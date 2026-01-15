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

const SettingsPage = () => {
  const { userId } = useParams();
  const { isGameMode, disableGameMode } = useGameMode();
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

  // Disable game mode for classic-only pages
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-bgpapyrus">
        <TopBar toggleMenu={toggleMenu} />
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgpapyrus">
      <TopBar toggleMenu={toggleMenu} />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      
      <Breadcrumb
        items={[
          { label: "Dashboard", to: `/home/${userId}` },
          { label: "Settings" },
        ]}
      />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Display Settings */}
          <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Display</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange("theme", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Icon Size
                </label>
                <select
                  value={settings.icon_size}
                  onChange={(e) => handleChange("icon_size", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>
          </section>

          {/* Accessibility */}
          <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Accessibility</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                  Font Size
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                  >
                    {Object.entries(FONT_SIZES).map(([key, { label }]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-500 hidden sm:inline">
                    Use A-/A+ in header for quick access
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">High Contrast</p>
                  <p className="text-xs text-slate-500">Increase color contrast for better visibility</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    highContrast ? "bg-red" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Reduced Motion</p>
                  <p className="text-xs text-slate-500">Minimize animations and transitions</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    reducedMotion ? "bg-red" : "bg-slate-300"
                  }`}
                  role="switch"
                  aria-checked={reducedMotion}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      reducedMotion ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-darkpapyrus bg-lightpapyrus p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 text-left">Reminders</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">Daily Reminder</p>
                  <p className="text-xs text-slate-500">Get reminded to journal</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange("daily_reminder", !settings.daily_reminder)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.daily_reminder ? "bg-red" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.daily_reminder ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {settings.daily_reminder && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={settings.reminder_time}
                    onChange={(e) => handleChange("reminder_time", e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-darkpapyrus bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2.5 bg-red text-white font-semibold rounded-xl hover:bg-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SettingsPage;
