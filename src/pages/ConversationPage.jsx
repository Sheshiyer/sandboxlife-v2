import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import MessageBubble from "../components/chat/MessageBubble";
import MessageInput from "../components/chat/MessageInput";
import { ToastContainer, toast } from "react-toastify";
import { 
  getMessages, 
  sendMessage, 
  getConversation, 
  subscribeToConversation, 
  markConversationAsRead,
  GLOBAL_CONVERSATION_ID 
} from "../utils/social";
import { supabase } from "../utils/supabase";
import { ArrowLeftIcon, GlobeAltIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../context/GameModeContext";

const ConversationPage = () => {
  const { userId, conversationId } = useParams();
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const messagesEndRef = useRef(null);

  const isGlobal = conversationId === "global" || conversationId === GLOBAL_CONVERSATION_ID;
  const actualConversationId = isGlobal ? GLOBAL_CONVERSATION_ID : conversationId;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch conversation details
      if (!isGlobal) {
        const convResult = await getConversation(actualConversationId);
        if (convResult.success) {
          setConversation(convResult.data);
        }
      } else {
        setConversation({
          id: GLOBAL_CONVERSATION_ID,
          type: "global",
          name: isGameMode ? "The Tavern" : "Global Chat Room"
        });
      }

      // Fetch messages
      const msgResult = await getMessages(actualConversationId, 100);
      if (msgResult.success) {
        setMessages(msgResult.data);
      } else {
        toast.error("Failed to load messages");
      }

      // Mark as read
      if (!isGlobal) {
        await markConversationAsRead(actualConversationId);
      }

      setLoading(false);
    };

    fetchData();

    // Subscribe to new messages
    const unsubscribe = subscribeToConversation(actualConversationId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => unsubscribe();
  }, [actualConversationId, isGlobal, isGameMode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    const result = await sendMessage(actualConversationId, content);
    if (!result.success) {
      toast.error("Failed to send message");
    }
  };

  const getConversationName = () => {
    if (isGlobal) return isGameMode ? "The Tavern" : "Global Chat Room";
    if (conversation?.type === "group") return conversation?.name || "Group Chat";
    if (conversation?.type === "direct") {
      const otherParticipant = conversation?.conversation_participants?.find(
        p => p.user_id !== currentUserId
      );
      return otherParticipant?.display_name || "Direct Message";
    }
    return "Chat";
  };

  const getConversationIcon = () => {
    if (isGlobal) return <GlobeAltIcon className={`w-6 h-6 ${isGameMode ? "text-yellow-500" : ""}`} />;
    if (conversation?.type === "group") return <UserGroupIcon className={`w-6 h-6 ${isGameMode ? "text-yellow-500" : ""}`} />;
    return <UserIcon className={`w-6 h-6 ${isGameMode ? "text-yellow-500" : ""}`} />;
  };

  return (
    <div className={`flex flex-col h-screen ${isGameMode ? "bg-[#0a0a0a] text-white" : ""}`}>
      {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
      {!isGameMode && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <ToastContainer />

      <div className={`flex flex-col flex-1 ${!isGameMode ? "h-[calc(100vh-64px)]" : "h-full"}`}>
        {/* Chat Header */}
        <div className={`relative z-10 flex items-center gap-3 px-4 py-3 border-b transition-colors shadow-lg ${
          isGameMode ? "bg-slate-900 border-white/10" : "bg-white border-darkpapyrus"
        }`}>
          <button
            onClick={() => navigate(`/inbox/${userId}`)}
            className={`p-2 rounded-lg transition-all active:scale-95 ${
              isGameMode ? "bg-slate-800 text-yellow-500 hover:bg-slate-700" : "hover:bg-lightpapyrus text-slate-600"
            }`}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
            isGameMode ? "bg-slate-800 border-yellow-500/20 text-yellow-500" : "bg-lightpapyrus border-darkpapyrus text-slate-600"
          }`}>
            {getConversationIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className={`font-serif font-bold truncate ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              {getConversationName()}
            </h1>
            <p className={`text-[10px] uppercase tracking-widest ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>
              {isGlobal ? (isGameMode ? "Public Tales & Rumors" : "Public chat room") : `${messages.length} messages`}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto px-4 py-6 transition-colors custom-scrollbar ${
          isGameMode 
            ? "bg-[#0a0a0a] bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] bg-opacity-20" 
            : "bg-bgpapyrus"
        }`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-reveal">
              <div className={`w-20 h-20 rounded-full border flex items-center justify-center mb-6 shadow-xl ${
                isGameMode ? "bg-slate-900 border-yellow-500/20" : "bg-lightpapyrus border-darkpapyrus"
              }`}>
                {getConversationIcon()}
              </div>
              <h3 className={`text-xl font-serif font-bold mb-2 ${isGameMode ? "text-slate-300" : "text-slate-700"}`}>
                {isGameMode ? "Silence in the Halls" : "No messages yet"}
              </h3>
              <p className={`max-w-xs mx-auto ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>
                {isGameMode ? "Speak your truth and let the chronicle begin." : "Send the first message to start the conversation"}
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === currentUserId}
                  senderName={msg.sender?.display_name || msg.sender?.email || msg.username || "Unknown"}
                  senderAvatar={msg.sender?.avatar_url}
                  senderTitle={isGameMode ? "Adventurer" : null}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="relative z-10 shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
          <MessageInput
            onSend={handleSendMessage}
            disabled={loading}
            placeholder={isGlobal 
              ? (isGameMode ? "Share your tales with the tavern..." : "Say hello to everyone...") 
              : (isGameMode ? "Send a private missive..." : "Type a message...")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
