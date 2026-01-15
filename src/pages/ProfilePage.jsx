import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import Breadcrumb from "../components/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../utils/supabase";
import { PencilIcon, CameraIcon } from "@heroicons/react/24/outline";
import { useGameMode } from "../context/GameModeContext";

const ProfilePage = () => {
  const { userId } = useParams();
  const { isGameMode, disableGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  // Disable game mode for classic-only pages
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          toast.error("Failed to load profile data");
        } else if (data) {
          setProfile((prev) => ({
            ...prev,
            ...data,
            email: user.email || "",
          }));
        } else {
          setProfile((prev) => ({ ...prev, email: user.email || "" }));
        }
      }
      setLoading(false);
    };

    fetchProfile();
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
        <TopBar toggleMenu={toggleMenu} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red"></div>
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
          { label: "Dashboard", to: `/home/${userId}` },
          { label: "Profile" },
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
            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-lightpapyrus transition-colors">
              <CameraIcon className="w-5 h-5 text-slate-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red"></div>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">{displayName}</h1>
          <p className="text-slate-500">{profile.email}</p>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Basic Info */}
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Display Name</label>
                  <input
                    type="text"
                    value={profile.display_name}
                    onChange={(e) => handleChange("display_name", e.target.value)}
                    placeholder="Your display name"
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Date of Birth</label>
                    <input
                      type="date"
                      value={profile.date_of_birth || ""}
                      onChange={(e) => handleChange("date_of_birth", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Gender</label>
                    <select
                      value={profile.gender || ""}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
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
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Mobile Phone</label>
                    <input
                      type="tel"
                      value={profile.mobile_phone || ""}
                      onChange={(e) => handleChange("mobile_phone", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Website</label>
                    <input
                      type="url"
                      value={profile.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Street Address</label>
                  <input
                    type="text"
                    value={profile.street_address || ""}
                    onChange={(e) => handleChange("street_address", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">ZIP Code</label>
                  <input
                    type="text"
                    value={profile.zip || ""}
                    onChange={(e) => handleChange("zip", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                  />
                </div>
              </div>
            </section>

            {/* About */}
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">About Me</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Bio</label>
                  <textarea
                    value={profile.about_me || ""}
                    onChange={(e) => handleChange("about_me", e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Hobbies & Interests</label>
                  <textarea
                    value={profile.hobbies || ""}
                    onChange={(e) => handleChange("hobbies", e.target.value)}
                    rows={3}
                    placeholder="What do you enjoy doing?"
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Entertainment</label>
                  <textarea
                    value={profile.entertainment || ""}
                    onChange={(e) => handleChange("entertainment", e.target.value)}
                    rows={3}
                    placeholder="Favorite movies, music, TV shows..."
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Work & Education */}
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Work & Education</h2>
              <textarea
                value={profile.work_education || ""}
                onChange={(e) => handleChange("work_education", e.target.value)}
                rows={4}
                placeholder="Your work and education history..."
                className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red resize-none"
              />
            </section>

            {/* Privacy */}
            <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Privacy</h2>
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Public Profile</p>
                  <p className="text-xs text-slate-500">Allow others to view your profile</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("is_public", !profile.is_public)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    profile.is_public ? "bg-red" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={profile.is_public}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      profile.is_public ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-700 hover:bg-lightpapyrus transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-red text-white hover:bg-red/90 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          /* View Mode */
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
                {profile.date_of_birth && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Birthday</p>
                    <p className="text-slate-700">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                  </div>
                )}
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

            {/* Work */}
            {profile.work_education && (
              <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2 text-left">Work & Education</h2>
                <p className="text-slate-600 text-left whitespace-pre-wrap">{profile.work_education}</p>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default ProfilePage;
