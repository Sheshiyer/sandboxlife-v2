import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import Breadcrumb from "../components/Breadcrumb";
import FriendCard from "../components/friends/FriendCard";
import FriendRequests from "../components/friends/FriendRequests";
import AddFriend from "../components/friends/AddFriend";
import { ToastContainer, toast } from "react-toastify";
import {
  getFriends,
  getPendingRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  createDirectConversation,
  subscribeToFriendRequests,
} from "../utils/social";
import { UserPlusIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../context/GameModeContext";
import GamePageLayout from "../components/game/GamePageLayout";

const FriendsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const [friendsResult, requestsResult] = await Promise.all([
        getFriends(userId),
        getPendingRequests(userId),
      ]);

      if (friendsResult.success) {
        setFriends(friendsResult.data);
      } else {
        toast.error("Failed to load friends");
      }

      if (requestsResult.success) {
        setRequests(requestsResult.data);
      }

      setLoading(false);
    };

    fetchData();

    const unsubscribe = subscribeToFriendRequests(userId, () => {
      fetchData();
    });

    return () => unsubscribe();
  }, [userId]);

  const refetchData = async () => {
    const [friendsResult, requestsResult] = await Promise.all([
      getFriends(userId),
      getPendingRequests(userId),
    ]);
    if (friendsResult.success) setFriends(friendsResult.data);
    if (requestsResult.success) setRequests(requestsResult.data);
  };

  const handleAcceptRequest = async (friendshipId) => {
    const result = await acceptFriendRequest(friendshipId);
    if (result.success) {
      toast.success("Friend request accepted!");
      refetchData();
    } else {
      toast.error("Failed to accept request");
    }
  };

  const handleDeclineRequest = async (friendshipId) => {
    const result = await declineFriendRequest(friendshipId);
    if (result.success) {
      toast.success("Friend request declined");
      refetchData();
    } else {
      toast.error("Failed to decline request");
    }
  };

  const handleRemoveFriend = async (friend) => {
    if (!confirm(`Remove ${friend.friend_display_name || friend.friend_email} from friends?`)) {
      return;
    }
    const result = await removeFriend(friend.friendship_id);
    if (result.success) {
      toast.success("Friend removed");
      setFriends((prev) => prev.filter((f) => f.friendship_id !== friend.friendship_id));
    } else {
      toast.error("Failed to remove friend");
    }
  };

  const handleMessageFriend = async (friend) => {
    const result = await createDirectConversation(friend.friend_id);
    if (result.success) {
      navigate(`/inbox/${userId}/chat/${result.data}`);
    } else {
      toast.error("Failed to start conversation");
    }
  };

  const content = (
    <div className="max-w-2xl mx-auto px-0 py-0">
      {!isGameMode && (
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-serif font-bold text-slate-900">Friends</h1>
          <button
            onClick={() => setShowAddFriend(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
          >
            <UserPlusIcon className="w-5 h-5" />
            <span>Add Friend</span>
          </button>
        </div>
      )}

      {isGameMode && (
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setShowAddFriend(true)}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-slate-950 rounded-xl hover:bg-yellow-400 transition-all font-bold shadow-lg shadow-yellow-500/20 active:scale-95"
          >
            <UserPlusIcon className="w-5 h-5 stroke-[2.5]" />
            <span className="font-serif tracking-wide">Recruit Member</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Friend Requests */}
          <FriendRequests
            requests={requests}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
          />

          {/* Friends List */}
          <section className="animate-reveal" style={{ animationDelay: '100ms' }}>
            <h2 className={`text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-left ${
              isGameMode ? "text-yellow-500/60 font-serif" : "text-slate-500"
            }`}>
              {isGameMode ? "Active Party" : "My Friends"} ({friends.length})
            </h2>

            {friends.length === 0 ? (
              <div className={`text-center py-16 rounded-3xl border ${
                isGameMode 
                  ? "bg-slate-900/40 border-yellow-500/10 backdrop-blur-md" 
                  : "bg-lightpapyrus border-darkpapyrus"
              }`}>
                <UsersIcon className={`w-16 h-16 mx-auto mb-4 ${isGameMode ? "text-slate-700" : "text-slate-300"}`} />
                <h3 className={`text-xl font-medium mb-2 ${isGameMode ? "text-slate-300" : "text-slate-700"}`}>
                  Your party is empty
                </h3>
                <p className={`mb-6 max-w-xs mx-auto ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>
                  Journeying alone is dangerous. Recruit friends to join your adventure.
                </p>
                <button
                  onClick={() => setShowAddFriend(true)}
                  className={`px-6 py-3 rounded-xl transition-all font-bold shadow-lg active:scale-95 ${
                    isGameMode 
                      ? "bg-slate-800 text-yellow-500 border border-yellow-500/30 hover:bg-slate-700" 
                      : "bg-red text-white hover:bg-red/90"
                  }`}
                >
                  Find Adventurers
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.friendship_id}
                    friend={friend}
                    onMessage={handleMessageFriend}
                    onRemove={handleRemoveFriend}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Add Friend Modal */}
      {showAddFriend && (
        <AddFriend
          userId={userId}
          onClose={() => setShowAddFriend(false)}
          onRequestSent={refetchData}
        />
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
            { label: "Friends" },
          ]}
        />
      )}

      <GamePageLayout 
        title={isGameMode ? "Party Members" : "Friends"} 
        icon="👥"
      >
        {content}
      </GamePageLayout>
    </>
  );
};


export default FriendsPage;
