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

const InboxPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isGameMode, disableGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Disable game mode for classic-only pages
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

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

    // Subscribe to conversation updates
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

  // Ensure global conversation is always shown
  const globalConversation = {
    id: GLOBAL_CONVERSATION_ID,
    type: "global",
    name: "Global Chat Room",
    last_message_at: conversations.find(c => c.type === "global")?.last_message_at
  };

  const directConversations = conversations.filter(c => c.type === "direct");
  const groupConversations = conversations.filter(c => c.type === "group");

  return (
    <>
      <TopBar toggleMenu={toggleMenu} />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <ToastContainer />

      <Breadcrumb
        items={[
          { label: "Dashboard", to: `/home/${userId}` },
          { label: "Inbox" },
        ]}
      />

      <main className="max-w-2xl mx-auto px-4 py-8">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Global Chat */}
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 text-left">
                Community
              </h2>
              <div className="bg-white rounded-2xl border border-darkpapyrus overflow-hidden">
                <ConversationItem
                  conversation={globalConversation}
                  onClick={() => handleConversationClick(globalConversation)}
                />
              </div>
            </section>

            {/* Direct Messages */}
            {directConversations.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 text-left">
                  Direct Messages
                </h2>
                <div className="bg-white rounded-2xl border border-darkpapyrus overflow-hidden divide-y divide-darkpapyrus">
                  {directConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      onClick={() => handleConversationClick(conv)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Group Chats */}
            {groupConversations.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 text-left">
                  Groups
                </h2>
                <div className="bg-white rounded-2xl border border-darkpapyrus overflow-hidden divide-y divide-darkpapyrus">
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

            {/* Empty state */}
            {directConversations.length === 0 && groupConversations.length === 0 && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">No conversations yet</h3>
                <p className="text-slate-500 mb-4">Start chatting with friends or join the global chat room</p>
                <button
                  onClick={() => navigate(`/friends/${userId}`)}
                  className="px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
                >
                  Find Friends
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default InboxPage;
