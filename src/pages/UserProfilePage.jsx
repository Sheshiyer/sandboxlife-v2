import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import Breadcrumb from "../components/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../utils/supabase";
import { 
  UserPlusIcon, 
  ChatBubbleLeftIcon, 
  CheckIcon,
  ClockIcon,
  LockClosedIcon 
} from "@heroicons/react/24/outline";
import { 
  sendFriendRequest, 
  getFriendshipStatus, 
  createDirectConversation 
} from "../utils/social";

const UserProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // If viewing own profile, redirect to profile page
        if (user.id === profileId) {
          navigate(`/profile/${user.id}`);
          return;
        }
      }

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", profileId)
        .single();

      if (error) {
        toast.error("User not found");
        setLoading(false);
        return;
      }

      // Get user email
      const { data: userData } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", profileId)
        .single();

      setProfile({
        ...profileData,
        user_id: userData?.user_id || profileId,
      });

      // Check friendship status
      if (user) {
        const statusResult = await getFriendshipStatus(user.id, profileId);
        if (statusResult.success && statusResult.data) {
          setFriendshipStatus(statusResult.data);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [profileId, navigate]);

  const handleSendFriendRequest = async () => {
    setSendingRequest(true);
    const result = await sendFriendRequest(profileId);
    if (result.success) {
      toast.success("Friend request sent!");
      setFriendshipStatus({ status: "pending", requester_id: currentUserId });
    } else {
      toast.error(result.error || "Failed to send request");
    }
    setSendingRequest(false);
  };

  const handleStartChat = async () => {
    const result = await createDirectConversation(profileId);
    if (result.success) {
      navigate(`/inbox/${currentUserId}/chat/${result.data}`);
    } else {
      toast.error("Failed to start conversation");
    }
  };

  const displayName = profile?.display_name || "User";
  const isPublic = profile?.is_public;
  const isFriend = friendshipStatus?.status === "accepted";
  const isPending = friendshipStatus?.status === "pending";
  const canViewFullProfile = isPublic || isFriend;

  if (loading) {
    return (
      <>
        <TopBar toggleMenu={toggleMenu} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <TopBar toggleMenu={toggleMenu} />
        {isMenuOpen && (
          <div className="fixed inset-0 z-50">
            <Menu toggleMenu={toggleMenu} />
          </div>
        )}
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">User Not Found</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red text-white rounded-xl"
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

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
          { label: "Dashboard", to: `/home/${currentUserId}` },
          { label: "Friends", to: `/friends/${currentUserId}` },
          { label: displayName },
        ]}
      />

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-red text-white flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg">
                {displayName[0]?.toUpperCase()}
              </div>
            )}
            {/* Online status indicator */}
            {profile.online_status === "online" && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">{displayName}</h1>
          
          {/* Status badge */}
          {isFriend && (
            <span className="mt-2 flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckIcon className="w-4 h-4" />
              Friends
            </span>
          )}
          {isPending && (
            <span className="mt-2 flex items-center gap-1 text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              <ClockIcon className="w-4 h-4" />
              Request Pending
            </span>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {!isFriend && !isPending && currentUserId && (
              <button
                onClick={handleSendFriendRequest}
                disabled={sendingRequest}
                className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 disabled:opacity-50 transition-colors"
              >
                <UserPlusIcon className="w-5 h-5" />
                {sendingRequest ? "Sending..." : "Add Friend"}
              </button>
            )}
            {isFriend && (
              <button
                onClick={handleStartChat}
                className="flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
              >
                <ChatBubbleLeftIcon className="w-5 h-5" />
                Message
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        {canViewFullProfile ? (
          <div className="space-y-6">
            {/* About Section */}
            {profile.about_me && (
              <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2 text-left">About</h2>
                <p className="text-slate-600 text-left whitespace-pre-wrap">{profile.about_me}</p>
              </section>
            )}

            {/* Details Grid */}
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Details</h2>
              <div className="grid grid-cols-2 gap-4 text-left">
                {profile.gender && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Gender</p>
                    <p className="text-slate-700 capitalize">{profile.gender}</p>
                  </div>
                )}
                {profile.website && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Website</p>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-red hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Hobbies */}
            {profile.hobbies && (
              <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2 text-left">Hobbies & Interests</h2>
                <p className="text-slate-600 text-left whitespace-pre-wrap">{profile.hobbies}</p>
              </section>
            )}

            {/* Entertainment */}
            {profile.entertainment && (
              <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2 text-left">Entertainment</h2>
                <p className="text-slate-600 text-left whitespace-pre-wrap">{profile.entertainment}</p>
              </section>
            )}
          </div>
        ) : (
          /* Private Profile */
          <div className="text-center py-12 bg-lightpapyrus rounded-2xl border border-darkpapyrus">
            <LockClosedIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Private Profile</h3>
            <p className="text-slate-500 mb-4">
              Add {displayName} as a friend to see their full profile
            </p>
            {!isPending && !isFriend && currentUserId && (
              <button
                onClick={handleSendFriendRequest}
                disabled={sendingRequest}
                className="px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 disabled:opacity-50 transition-colors"
              >
                {sendingRequest ? "Sending..." : "Send Friend Request"}
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default UserProfilePage;
