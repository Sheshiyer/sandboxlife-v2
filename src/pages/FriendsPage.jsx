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

const FriendsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isGameMode, disableGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Disable game mode for classic-only pages
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

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

    // Subscribe to new friend requests
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
          { label: "Friends" },
        ]}
      />

      <main className="max-w-2xl mx-auto px-4 py-8">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
          </div>
        ) : (
          <>
            {/* Friend Requests */}
            <FriendRequests
              requests={requests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
            />

            {/* Friends List */}
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 text-left">
                My Friends ({friends.length})
              </h2>

              {friends.length === 0 ? (
                <div className="text-center py-12 bg-lightpapyrus rounded-2xl border border-darkpapyrus">
                  <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No friends yet</h3>
                  <p className="text-slate-500 mb-4">Add friends to start chatting</p>
                  <button
                    onClick={() => setShowAddFriend(true)}
                    className="px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
                  >
                    Find Friends
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
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
          </>
        )}
      </main>

      {/* Add Friend Modal */}
      {showAddFriend && (
        <AddFriend
          userId={userId}
          onClose={() => setShowAddFriend(false)}
          onRequestSent={refetchData}
        />
      )}
    </>
  );
};

export default FriendsPage;
