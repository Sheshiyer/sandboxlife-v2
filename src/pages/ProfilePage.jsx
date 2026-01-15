import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import Breadcrumb from "../components/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../utils/supabase";
import { PencilIcon, CameraIcon, FireIcon, TrophyIcon, StarIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../context/GameModeContext";
import GamePageLayout from "../components/game/GamePageLayout";
import { getUserProgression } from "../utils/progression";

const ProfilePage = () => {
  const { userId } = useParams();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [progression, setProgression] = useState(null);
  const [profile, setProfile] = useState({
    avatar_url: "",
    display_name: "",
    date_of_birth: "",
    gender: "",
    email: "",
    mobile_phone: "",
    street_address: "",
    zip: "",
    website: "",
    about_me: "",
    activities: "",
    hobbies: "",
    interests: "",
    entertainment: "",
    work_education: "",
    is_public: false,
  });

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          toast.error("Failed to load profile data");
        } else if (profileData) {
          setProfile((prev) => ({
            ...prev,
            ...profileData,
            email: user.email || "",
          }));
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || "" }));
        }

        // Fetch progression
        const progResult = await getUserProgression(user.id);
        if (progResult.success) {
          setProgression(progResult.data);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) handleUploadAvatar(file);
  };

  const handleUploadAvatar = async (file) => {
    setUploading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      toast.error("Failed to get user information");
      setUploading(false);
      return;
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;
    const filePath = `user_avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    const { data: publicURLData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const publicURL = publicURLData.publicUrl;

    const { error: saveError } = await supabase
      .from("user_profiles")
      .upsert({ user_id: user.id, avatar_url: publicURL }, { onConflict: ["user_id"] });

    if (saveError) {
      toast.error("Failed to save avatar URL");
    } else {
      setProfile((prev) => ({ ...prev, avatar_url: publicURL }));
      toast.success("Avatar updated successfully");
    }

    setUploading(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const profileData = {
        user_id: user.id,
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        date_of_birth: profile.date_of_birth || null,
        gender: profile.gender || null,
        mobile_phone: profile.mobile_phone || null,
        street_address: profile.street_address || null,
        zip: profile.zip || null,
        website: profile.website || null,
        about_me: profile.about_me || null,
        activities: profile.activities || null,
        hobbies: profile.hobbies || null,
        interests: profile.interests || null,
        entertainment: profile.entertainment || null,
        work_education: profile.work_education || null,
        is_public: profile.is_public,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("user_profiles")
        .upsert(profileData, { onConflict: ["user_id"] });

      if (error) {
        toast.error("Failed to save profile data");
      } else {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    }
    setSaving(false);
  };

  const displayName = profile.display_name || profile.email?.split("@")[0] || "User";

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

  const content = (
    <div className="max-w-2xl mx-auto pb-12">
      {/* Profile Header */}
      <div className={`flex flex-col items-center mb-12 animate-reveal`}>
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
          
          <label className={`absolute bottom-0 right-0 p-2.5 rounded-full shadow-xl cursor-pointer transition-all hover:scale-110 ${
            isGameMode ? "bg-yellow-500 text-slate-900" : "bg-white text-slate-600 hover:bg-lightpapyrus"
          }`}>
            <CameraIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[2px]">
              <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
            </div>
          )}
        </div>
        
        <h1 className={`text-3xl font-serif font-bold mb-1 ${isGameMode ? "text-yellow-500 drop-shadow-md" : "text-slate-900"}`}>
          {displayName}
        </h1>
        
        {isGameMode && progression ? (
          <p className="text-yellow-500/70 font-serif uppercase tracking-[0.2em] mb-4">
            {progression.title}
          </p>
        ) : (
          <p className="text-slate-500 mb-4">{profile.email}</p>
        )}

        {isGameMode && progression && (
          <div className="w-full max-w-xs mb-6 space-y-2">
            <div className="flex justify-between text-[10px] font-serif text-yellow-500/50 uppercase tracking-widest">
              <span>Experience</span>
              <span>{progression.xp} / {progression.xp_for_next_level} XP</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.3)] transition-all duration-1000"
                style={{ width: `${progression.xp_percentage}%` }}
              />
            </div>
          </div>
        )}

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all shadow-lg active:scale-95 font-bold ${
              isGameMode 
                ? "bg-slate-800 text-yellow-500 border border-yellow-500/30 hover:bg-slate-700" 
                : "bg-red text-white hover:bg-red/90"
            }`}
          >
            <PencilIcon className="w-4 h-4" />
            {isGameMode ? "Modify Appearance" : "Edit Profile"}
          </button>
        )}
      </div>

      {isGameMode && progression && !isEditing && (
        <div className="grid grid-cols-3 gap-4 mb-8 animate-reveal" style={{ animationDelay: '100ms' }}>
          <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <FireIcon className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Streak</p>
            <p className="text-xl font-bold text-slate-100">{progression.streak_days} Days</p>
          </div>
          <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <TrophyIcon className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Entries</p>
            <p className="text-xl font-bold text-slate-100">{progression.total_entries}</p>
          </div>
          <div className="bg-slate-900/40 border border-yellow-500/10 rounded-2xl p-4 text-center backdrop-blur-md">
            <StarIcon className="w-6 h-6 text-sky-500 mx-auto mb-1" />
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-serif">Longest</p>
            <p className="text-xl font-bold text-slate-100">{progression.longest_streak}</p>
          </div>
        </div>
      )}

      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-8 animate-reveal">
          {/* Sections shared styling */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
          }`}>
            <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => handleChange("display_name", e.target.value)}
                  placeholder="Your name in the realm"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    isGameMode 
                      ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                      : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                  }`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.date_of_birth || ""}
                    onChange={(e) => handleChange("date_of_birth", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      isGameMode 
                        ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                        : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                    Gender
                  </label>
                  <select
                    value={profile.gender || ""}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      isGameMode 
                        ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                        : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                    }`}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="undisclosed">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
          }`}>
            <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                    Mobile Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.mobile_phone || ""}
                    onChange={(e) => handleChange("mobile_phone", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      isGameMode 
                        ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                        : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      isGameMode 
                        ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                        : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                  Street Address
                </label>
                <input
                  type="text"
                  value={profile.street_address || ""}
                  onChange={(e) => handleChange("street_address", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    isGameMode 
                      ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                      : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* About */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
          }`}>
            <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              Adventurer Bio
            </h2>
            <div className="space-y-6">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                  About Me
                </label>
                <textarea
                  value={profile.about_me || ""}
                  onChange={(e) => handleChange("about_me", e.target.value)}
                  rows={4}
                  placeholder="Tell us your story..."
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                    isGameMode 
                      ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                      : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                  Interests & Hobbies
                </label>
                <textarea
                  value={profile.hobbies || ""}
                  onChange={(e) => handleChange("hobbies", e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
                    isGameMode 
                      ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                      : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className={`px-8 py-3 rounded-xl font-bold transition-all active:scale-95 ${
                isGameMode 
                  ? "bg-slate-800 text-slate-300 border border-white/5 hover:bg-slate-700" 
                  : "bg-white border border-darkpapyrus text-slate-700 hover:bg-lightpapyrus"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              disabled={saving}
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                isGameMode 
                  ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
                  : "bg-red text-white hover:bg-red/90"
              }`}
            >
              {saving ? "Processing..." : isGameMode ? "Save Attributes" : "Save Changes"}
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div className="space-y-6 animate-reveal" style={{ animationDelay: '200ms' }}>
          {/* About Section */}
          {profile.about_me && (
            <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
              isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
            }`}>
              <h2 className={`text-lg font-serif font-bold mb-4 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
                The Legend
              </h2>
              <p className={`text-left whitespace-pre-wrap leading-relaxed ${isGameMode ? "text-slate-300 italic font-serif" : "text-slate-600"}`}>
                {profile.about_me}
              </p>
            </section>
          )}

          {/* Details Grid */}
          <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
            isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
          }`}>
            <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
              Adventurer Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
              {profile.date_of_birth && (
                <div>
                  <p className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${isGameMode ? "text-slate-500" : "text-slate-400"}`}>
                    Date of Origin
                  </p>
                  <p className={`font-medium ${isGameMode ? "text-slate-200" : "text-slate-700"}`}>
                    {new Date(profile.date_of_birth).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              )}
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

          {/* Hobbies */}
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

          {/* Work */}
          {profile.work_education && (
            <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
              isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
            }`}>
              <h2 className={`text-lg font-serif font-bold mb-4 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
                Guild History
              </h2>
              <p className={`text-left whitespace-pre-wrap leading-relaxed ${isGameMode ? "text-slate-300" : "text-slate-600"}`}>
                {profile.work_education}
              </p>
            </section>
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
            { label: "Profile" },
          ]}
        />
      )}

      <GamePageLayout 
        title={isGameMode ? "Character Profile" : "Profile"} 
        icon="👤"
      >
        {content}
      </GamePageLayout>
    </>
  );
};

export default ProfilePage;
