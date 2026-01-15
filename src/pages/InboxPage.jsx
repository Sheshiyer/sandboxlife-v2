import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import Breadcrumb from "../components/Breadcrumb";
import ConversationItem from "../components/chat/ConversationItem";
import { ToastContainer, toast } from "react-toastify";
import { getConversations, subscribeToConversationList, GLOBAL_CONVERSATION_ID } from "../utils/social";
import { PlusIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../context/GameModeContext";
import GamePageLayout from "../components/game/GamePageLayout";

const InboxPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchConversations = async () => {
      const result = await getConversations(userId);
      if (result.success) {
        setConversations(result.data);
      } else {
        toast.error("Failed to load conversations");
      }
      setLoading(false);
    };

    fetchConversations();

    const unsubscribe = subscribeToConversationList(userId, () => {
      fetchConversations();
    });

    return () => unsubscribe();
  }, [userId]);

  const handleConversationClick = (conversation) => {
    if (conversation.id === GLOBAL_CONVERSATION_ID) {
      navigate(`/inbox/${userId}/global`);
    } else {
      navigate(`/inbox/${userId}/chat/${conversation.id}`);
    }
  };

  const globalConversation = {
    id: GLOBAL_CONVERSATION_ID,
    type: "global",
    name: isGameMode ? "The Tavern" : "Global Chat Room",
    last_message_at: conversations.find(c => c.type === "global")?.last_message_at
  };

  const directConversations = conversations.filter(c => c.type === "direct");
  const groupConversations = conversations.filter(c => c.type === "group");

  const content = (
    <div className="max-w-2xl mx-auto">
      {!isGameMode && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-slate-900">Inbox</h1>
          <button
            onClick={() => navigate(`/friends/${userId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>
      )}

      {isGameMode && (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => navigate(`/friends/${userId}`)}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-950 rounded-xl hover:bg-yellow-400 transition-all font-bold shadow-lg shadow-yellow-500/20 active:scale-95"
          >
            <PlusIcon className="w-5 h-5 stroke-[2.5]" />
            <span className="font-serif tracking-wide">Start New Missive</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Global Chat */}
          <section className="animate-reveal">
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-left ${
              isGameMode ? "text-yellow-500/60 font-serif" : "text-slate-500"
            }`}>
              {isGameMode ? "The Gathering Place" : "Community"}
            </h2>
            <div className={`${isGameMode ? "" : "bg-white rounded-2xl border border-darkpapyrus overflow-hidden shadow-sm"}`}>
              <ConversationItem
                conversation={globalConversation}
                onClick={() => handleConversationClick(globalConversation)}
              />
            </div>
          </section>

          {/* Direct Messages */}
          {(directConversations.length > 0 || isGameMode) && (
            <section className="animate-reveal" style={{ animationDelay: '100ms' }}>
              <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-left ${
                isGameMode ? "text-yellow-500/60 font-serif" : "text-slate-500"
              }`}>
                {isGameMode ? "Private Missives" : "Direct Messages"}
              </h2>
              {directConversations.length > 0 ? (
                <div className={`${isGameMode ? "" : "bg-white rounded-2xl border border-darkpapyrus overflow-hidden shadow-sm divide-y divide-darkpapyrus"}`}>
                  {directConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      onClick={() => handleConversationClick(conv)}
                    />
                  ))}
                </div>
              ) : (
                isGameMode && (
                  <div className="py-8 text-center bg-slate-900/40 rounded-2xl border border-dashed border-white/10 italic text-slate-500 text-sm">
                    No private missives yet...
                  </div>
                )
              )}
            </section>
          )}

          {/* Group Chats */}
          {groupConversations.length > 0 && (
            <section className="animate-reveal" style={{ animationDelay: '200ms' }}>
              <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-left ${
                isGameMode ? "text-yellow-500/60 font-serif" : "text-slate-500"
              }`}>
                {isGameMode ? "Adventuring Parties" : "Groups"}
              </h2>
              <div className={`${isGameMode ? "" : "bg-white rounded-2xl border border-darkpapyrus overflow-hidden shadow-sm divide-y divide-darkpapyrus"}`}>
                {groupConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    onClick={() => handleConversationClick(conv)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state (only if everything is empty) */}
          {directConversations.length === 0 && groupConversations.length === 0 && !isGameMode && (
            <div className="text-center py-16 bg-lightpapyrus rounded-3xl border border-darkpapyrus">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-700 mb-2">Your inbox is empty</h3>
              <p className="text-slate-500 mb-6 max-w-xs mx-auto">Start chatting with friends or join the global chat room to begin your journey.</p>
              <button
                onClick={() => navigate(`/friends/${userId}`)}
                className="px-6 py-3 bg-red text-white rounded-xl hover:bg-red/90 transition-all font-bold shadow-lg active:scale-95"
              >
                Find Friends
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
      {!isGameMode && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <ToastContainer />

      {!isGameMode && (
        <Breadcrumb
          items={[
            { label: "Dashboard", to: `/home/${userId}` },
            { label: "Inbox" },
          ]}
        />
      )}

      <GamePageLayout 
        title={isGameMode ? "Missives" : "Inbox"} 
        icon="📬"
      >
        {content}
      </GamePageLayout>
    </>
  );
};

export default InboxPage;
