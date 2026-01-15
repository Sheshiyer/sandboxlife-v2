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

const ConversationPage = () => {
  const { userId, conversationId } = useParams();
  const navigate = useNavigate();
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
          name: "Global Chat Room"
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
  }, [actualConversationId, isGlobal]);

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
    if (isGlobal) return "Global Chat Room";
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
    if (isGlobal) return <GlobeAltIcon className="w-6 h-6" />;
    if (conversation?.type === "group") return <UserGroupIcon className="w-6 h-6" />;
    return <UserIcon className="w-6 h-6" />;
  };

  return (
    <>
      <TopBar toggleMenu={toggleMenu} />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <ToastContainer />

      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-darkpapyrus bg-white">
          <button
            onClick={() => navigate(`/inbox/${userId}`)}
            className="p-2 rounded-full hover:bg-lightpapyrus transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 rounded-full bg-lightpapyrus border border-darkpapyrus flex items-center justify-center text-slate-600">
            {getConversationIcon()}
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-slate-800">{getConversationName()}</h1>
            <p className="text-xs text-slate-500">
              {isGlobal ? "Public chat room" : `${messages.length} messages`}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-bgpapyrus">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-lightpapyrus border border-darkpapyrus flex items-center justify-center mb-4">
                {getConversationIcon()}
              </div>
              <h3 className="text-lg font-medium text-slate-700 mb-2">No messages yet</h3>
              <p className="text-slate-500">Send the first message to start the conversation</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender_id === currentUserId}
                  senderName={msg.sender?.email || msg.username || "Unknown"}
                  senderAvatar={null}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <MessageInput
          onSend={handleSendMessage}
          disabled={loading}
          placeholder={isGlobal ? "Say hello to everyone..." : "Type a message..."}
        />
      </div>
    </>
  );
};

export default ConversationPage;
