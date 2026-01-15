import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/TopBar";
import Menu from "../components/Menu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabase } from "../utils/supabase";
import Breadcrumb from "../components/Breadcrumb";
import { useAccessibility } from "../context/AccessibilityContext";
import { useGameMode } from "../context/GameModeContext";
import GamePageLayout from "../components/game/GamePageLayout";

const SettingsPage = () => {
  const { userId } = useParams();
  const { isGameMode } = useGameMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    theme: "light",
    icon_size: "medium",
    daily_reminder: false,
    reminder_time: "09:00",
  });

  const {
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
    FONT_SIZES,
  } = useAccessibility();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("user_define_settings")
            .select("theme, icon_size, daily_reminder, reminder_time")
            .eq("user_id", user.id)
            .single();
          
          if (data) {
            setSettings({
              theme: data.theme || "light",
              icon_size: data.icon_size || "medium",
              daily_reminder: data.daily_reminder || false,
              reminder_time: data.reminder_time || "09:00",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      const { error } = await supabase
        .from("user_define_settings")
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        }, { onConflict: ["user_id"] });

      if (error) {
        toast.error("Failed to save settings");
      } else {
        toast.success("Settings saved");
      }
    } finally {
      setSaving(false);
    }
  };

  const content = (
    <div className="max-w-2xl mx-auto space-y-8 animate-reveal">
      {!isGameMode && <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6 text-left">Settings</h1>}

      {/* Display Settings */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
        isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
      }`}>
        <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
          Visual Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
              Interface Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange("theme", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                isGameMode 
                  ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                  : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
              }`}
            >
              <option value="light">Light Parchment</option>
              <option value="dark">Shadow Realm</option>
              <option value="system">Follow System</option>
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
              Icon Scaling
            </label>
            <select
              value={settings.icon_size}
              onChange={(e) => handleChange("icon_size", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                isGameMode 
                  ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                  : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
              }`}
            >
              <option value="small">Compact</option>
              <option value="medium">Standard</option>
              <option value="large">Magnified</option>
            </select>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
        isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
      }`}>
        <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
          Accessibility
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
              Script Font Size
            </label>
            <div className="flex items-center gap-3">
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className={`flex-1 px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  isGameMode 
                    ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                    : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                }`}
              >
                {Object.entries(FONT_SIZES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-left">
              <p className={`text-sm font-semibold ${isGameMode ? "text-slate-200" : "text-slate-700"}`}>High Contrast</p>
              <p className={`text-xs ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>Enhance visual clarity</p>
            </div>
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                highContrast 
                  ? (isGameMode ? "bg-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "bg-red") 
                  : "bg-slate-700/50"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                highContrast ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="text-left">
              <p className={`text-sm font-semibold ${isGameMode ? "text-slate-200" : "text-slate-700"}`}>Ethereal Motion</p>
              <p className={`text-xs ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>Toggle animations and transitions</p>
            </div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                !reducedMotion 
                  ? (isGameMode ? "bg-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "bg-red") 
                  : "bg-slate-700/50"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                !reducedMotion ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className={`rounded-3xl border p-6 md:p-8 shadow-xl ${
        isGameMode ? "bg-slate-900/40 border-yellow-500/20 backdrop-blur-md" : "bg-lightpapyrus border-darkpapyrus"
      }`}>
        <h2 className={`text-lg font-serif font-bold mb-6 text-left ${isGameMode ? "text-yellow-500" : "text-slate-800"}`}>
          Reminders
        </h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className={`text-sm font-semibold ${isGameMode ? "text-slate-200" : "text-slate-700"}`}>Quest Reminder</p>
              <p className={`text-xs ${isGameMode ? "text-slate-500" : "text-slate-500"}`}>Get notified to chronicle your day</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange("daily_reminder", !settings.daily_reminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${
                settings.daily_reminder 
                  ? (isGameMode ? "bg-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.3)]" : "bg-red") 
                  : "bg-slate-700/50"
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.daily_reminder ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          {settings.daily_reminder && (
            <div className="animate-reveal">
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 text-left ${isGameMode ? "text-slate-400" : "text-slate-700"}`}>
                Reminder Hour
              </label>
              <input
                type="time"
                value={settings.reminder_time}
                onChange={(e) => handleChange("reminder_time", e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  isGameMode 
                    ? "bg-slate-800 border-white/5 text-slate-100 focus:ring-yellow-500/50" 
                    : "bg-white border-darkpapyrus text-slate-800 focus:ring-red"
                }`}
              />
            </div>
          )}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-4 pb-12">
        <button
          onClick={saveSettings}
          disabled={saving}
          className={`px-10 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
            isGameMode 
              ? "bg-yellow-500 text-slate-950 hover:bg-yellow-400" 
              : "bg-red text-white hover:bg-red/90"
          }`}
        >
          {saving ? "Saving Changes..." : isGameMode ? "Seal Settings" : "Save Changes"}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`min-h-screen ${isGameMode ? "bg-[#0a0a0a]" : "bg-bgpapyrus"}`}>
        {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
        <div className="flex items-center justify-center h-screen">
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isGameMode ? "border-yellow-500" : "border-red"}`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={isGameMode ? "" : "min-h-screen bg-bgpapyrus"}>
      {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
      {!isGameMode && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      
      {!isGameMode && (
        <Breadcrumb
          items={[
            { label: "Dashboard", to: `/home/${userId}` },
            { label: "Settings" },
          ]}
        />
      )}

      <GamePageLayout 
        title={isGameMode ? "Guild Settings" : "Settings"} 
        icon="⚙️"
      >
        {content}
      </GamePageLayout>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SettingsPage;
