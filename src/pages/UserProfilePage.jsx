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
  LockClosedIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from "@heroicons/react/24/outline";
import { 
  sendFriendRequest, 
  getFriendshipStatus, 
  createDirectConversation 
} from "../utils/social";
import { useGameMode } from "../context/GameModeContext";
import GamePageLayout from "../components/game/GamePageLayout";
import { getUserProgression } from "../utils/progression";

const UserProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [progression, setProgression] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
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

      setProfile(profileData);

      // Fetch progression
      const progResult = await getUserProgression(profileId);
      if (progResult.success) {
        setProgression(progResult.data);
      }

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
        {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
        <div className={`flex items-center justify-center min-h-screen ${isGameMode ? "bg-[#0a0a0a]" : ""}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <GamePageLayout title="Adventurer Profile" icon="🗡️">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h1 className={`text-2xl font-serif font-bold mb-4 ${isGameMode ? "text-yellow-500" : "text-slate-900"}`}>
            Adventurer Not Found
          </h1>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-xl transition-all font-bold ${
              isGameMode ? "bg-slate-800 text-yellow-500 border border-yellow-500/30" : "bg-red text-white"
            }`}
          >
            Return to Safety
          </button>
        </div>
      </GamePageLayout>
    );
  }

  const content = (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-12 animate-reveal">
        <div className="relative mb-6">
          <div className={`p-1 rounded-full ${isGameMode ? "bg-gradient-to-tr from-yellow-600 to-yellow-300 shadow-[0_0_20px_rgba(255,215,0,0.3)]" : ""}`}>
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className={`w-32 h-32 rounded-full object-cover border-4 ${isGameMode ? "border-slate-900" : "border-white shadow-lg"}`}
              />
            ) : (
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4 ${
                isGameMode ? "bg-slate-800 text-yellow-500 border-slate-900" : "bg-red text-white border-white shadow-lg"
              }`}>
                {displayName[0]?.toUpperCase()}
              </div>
            )}
          </div>
          
          {isGameMode && progression && (
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center text-lg font-bold border-4 border-slate-900 shadow-lg">
              {progression.level}
            </div>
          )}
          
          {profile.online_status === "online" && (
            <span className={`absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 ${isGameMode ? "border-slate-900" : "border-white"}`} />
          )}
        </div>

        <h1 className={`text-3xl font-serif font-bold mb-1 ${isGameMode ? "text-yellow-500 drop-shadow-md" : "text-slate-900"}`}>
          {displayName}
        </h1>
        
        {isGameMode && progression && (
          <p className="text-yellow-500/70 font-serif uppercase tracking-[0.2em] mb-4">
            {progression.title}
          </p>
        )}
        
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {isFriend && (
            <span className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full ${
              isGameMode ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-green-50 text-green-600"
            }`}>
              <CheckIcon className="w-4 h-4" />
              Party Member
            </span>
          )}
          {isPending && (
            <span className={`flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full ${
              isGameMode ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "bg-yellow-50 text-yellow-600"
            }`}>
              <ClockIcon className="w-4 h-4" />
              Invitation Pending
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {!isFriend && !isPending && currentUserId && (
            <button
              onClick={handleSendFriendRequest}
              disabled={sendingRequest}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                isGameMode 
                  ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
                  : "bg-red text-white hover:bg-red/90"
              }`}
            >
              <UserPlusIcon className="w-5 h-5 stroke-[2.5]" />
              {sendingRequest ? "Sending..." : isGameMode ? "Invite to Party" : "Add Friend"}
            </button>
          )}
          {isFriend && (
            <button
              onClick={handleStartChat}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${
                isGameMode 
                  ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
                  : "bg-red text-white hover:bg-red/90"
              }`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 stroke-[2.5]" />
              {isGameMode ? "Send Missive" : "Message"}
            </button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      {canViewFullProfile ? (
        <div className="space-y-8 animate-reveal" style={{ animationDelay: '100ms' }}>
          {isGameMode && progression && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <FireIcon className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Streak</p>
                <p className="text-xl font-bold text-slate-100">{progression.streak_days}</p>
              </div>
              <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <TrophyIcon className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Entries</p>
                <p className="text-xl font-bold text-slate-100">{progression.total_entries}</p>
              </div>
              <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <StarIcon className="w-6 h-6 text-sky-500 mx-auto mb-1" />
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Level</p>
                <p className="text-xl font-bold text-slate-100">{progression.level}</p>
              </div>
            </div>
          )}

          {profile.about_me && (
            <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
              isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
            }`}>
              <h2 className={`text-lg font-serif font-bold mb-4 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
                {isGameMode ? "The Legend" : "About"}
              </h2>
              <p className={`text-left whitespace-pre-wrap leading-relaxed ${isGameMode ? "text-slate-300 italic font-serif" : "text-slate-600"}`}>
                {profile.about_me}
              </p>
            </section>
          )}

          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
          }`}>
            <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              Adventurer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {profile.gender && (
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isGameMode ? "text-slate-500" : "text-slate-400"}`}>
                    Identity
                  </p>
                  <p className={`font-medium capitalize ${isGameMode ? "text-slate-200" : "text-slate-700"}`}>
                    {profile.gender}
                  </p>
                </div>
              )}
              {profile.website && (
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isGameMode ? "text-slate-500" : "text-slate-400"}`}>
                    External Realm
                  </p>
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className={`font-medium hover:underline flex items-center gap-1 ${isGameMode ? "text-yellow-500" : "text-red"}`}>
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </section>

          {profile.hobbies && (
            <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
              isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
            }`}>
              <h2 className={`text-lg font-serif font-bold mb-4 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
                Skills & Interests
              </h2>
              <p className={`text-left whitespace-pre-wrap leading-relaxed ${isGameMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile.hobbies}
              </p>
            </section>
          )}
        </div>
      ) : (
        /* Private Profile */
        <div className={`text-center py-20 rounded-3xl border animate-reveal shadow-2xl ${
          isGameMode ? "bg-slate-900/40 border-yellow-500/10 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
        }`}>
          <LockClosedIcon className={`w-20 h-20 mx-auto mb-6 ${isGameMode ? "text-slate-700" : "text-slate-300"}`} />
          <h3 className={`text-2xl font-serif font-bold mb-2 ${isGameMode ? "text-slate-300" : "text-slate-700"}`}>
            Shadowed Profile
          </h3>
          <p className={`mb-8 max-w-xs mx-auto ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>
            {isGameMode 
              ? `You must be in a party with ${displayName} to view their full chronicle.` 
              : `Add ${displayName} as a friend to see their full profile`}
          </p>
          {!isPending && !isFriend && currentUserId && (
            <button
              onClick={handleSendFriendRequest}
              disabled={sendingRequest}
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                isGameMode 
                  ? "bg-slate-800 text-yellow-500 border border-yellow-500/30 hover:bg-slate-700" 
                  : "bg-red text-white hover:bg-red/90"
              }`}
            >
              {sendingRequest ? "Processing..." : isGameMode ? "Send Party Invitation" : "Send Friend Request"}
            </button>
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
            { label: "Dashboard", to: `/home/${currentUserId}` },
            { label: "Friends", to: `/friends/${currentUserId}` },
            { label: displayName },
          ]}
        />
      )}

      <GamePageLayout 
        title={isGameMode ? "Adventurer Profile" : "User Profile"} 
        icon="🗡️"
      >
        {content}
      </GamePageLayout>
    </>
  );
};

export default UserProfilePage;
