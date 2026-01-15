import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import {
  HomeIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  XMarkIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase";
import logo from "../assets/otherImg/sandBoxLifeR.png";

const SidebarMenu = ({ toggleMenu, isDnDTheme = false }) => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  function getUserIdFromStorage() {
    const storedUserId = localStorage.getItem("user_id");
    setUserId(storedUserId);
  }

  useEffect(() => {
    getUserIdFromStorage();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("user_id");
      navigate("/");
    } catch (error) {
      // Logout failed silently
    }
  };

  const navigateToHome = () => {
    if (userId) {
      navigate(isDnDTheme ? `/dashboard-v2/${userId}` : `/home/${userId}`);
      toggleMenu();
    }
  };

  // D&D Theme styles
  const dndStyles = {
    background: "fixed inset-0 z-50 bg-[#0a0a0a] text-white",
    container: "mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-6",
    header: "flex items-center justify-between pb-6 border-b border-white/10",
    profileBtn: "inline-flex items-center gap-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 px-4 py-2 text-sm font-semibold text-yellow-400 hover:bg-yellow-500/30 transition shadow-[0_0_10px_rgba(234,179,8,0.3)]",
    iconBtn: "rounded-lg bg-white/10 border border-white/20 p-2 hover:bg-white/20 transition text-white",
    closeBtn: "rounded-lg bg-red-500/20 border border-red-500/40 p-2 hover:bg-red-500/30 transition text-red-400",
    logo: "pt-6 pb-4 border-b border-white/10",
    logoText: "text-xl font-serif font-bold text-yellow-400 tracking-widest",
    subtitle: "mt-1 text-sm text-slate-400",
    card: "rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm px-5 py-4 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition hover:border-yellow-500/40",
    cardLarge: "col-span-2 rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-yellow-900/20 to-amber-900/20 backdrop-blur-sm px-5 py-4 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition",
    cardTitle: "flex items-center gap-2 text-yellow-400 font-bold",
    cardText: "mt-2 text-sm text-slate-300",
    icon: "h-5 w-5 text-yellow-400",
    quickAction: "rounded-xl bg-slate-800/50 border border-white/20 px-3 py-2 hover:bg-slate-700/50 hover:border-yellow-500/40 transition text-slate-200 font-semibold",
  };

  // Classic papyrus theme styles
  const classicStyles = {
    background: "fixed inset-0 z-50 bg-bgpapyrus text-slate-700",
    container: "mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-6",
    header: "flex items-center justify-between pb-6 border-b border-darkpapyrus/30",
    profileBtn: "inline-flex items-center gap-2 rounded-full bg-lightpapyrus px-4 py-2 text-sm font-semibold text-slate-700 border border-darkpapyrus hover:bg-bgpapyrus transition",
    iconBtn: "rounded-full bg-lightpapyrus p-2 border border-darkpapyrus hover:bg-bgpapyrus transition text-slate-700",
    closeBtn: "rounded-full bg-lightpapyrus p-2 border border-darkpapyrus hover:bg-bgpapyrus transition text-slate-700",
    logo: "pt-6 pb-4 border-b border-darkpapyrus/30",
    logoText: "text-lg font-serif font-semibold text-slate-800",
    subtitle: "mt-1 text-sm text-slate-600",
    card: "rounded-3xl border border-darkpapyrus bg-lightpapyrus px-5 py-4 shadow-sm hover:shadow-md transition",
    cardLarge: "col-span-2 rounded-3xl border border-darkpapyrus bg-lightpapyrus px-5 py-4 shadow-sm hover:shadow-md transition",
    cardTitle: "flex items-center gap-2 text-slate-800 font-bold",
    cardText: "mt-2 text-sm text-slate-600",
    icon: "h-5 w-5 text-slate-700",
    quickAction: "rounded-2xl bg-white px-3 py-2 border border-darkpapyrus hover:border-[#9B1D1E] transition text-slate-700 font-semibold",
  };

  const styles = isDnDTheme ? dndStyles : classicStyles;

  return (
    <div className={styles.background}>
      {/* Animated background for D&D theme */}
      {isDnDTheme && (
        <>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />
        </>
      )}

      <div className={styles.container}>
        {/* Header with Profile button, logo, and action icons */}
        <div className={styles.header}>
          <div className="flex items-center gap-4">
            <Link
              to={userId ? `/profile/${userId}` : "#"}
              onClick={toggleMenu}
              className={styles.profileBtn}
            >
              <UserCircleIcon className="h-5 w-5" />
              Profile
            </Link>
            <button
              onClick={navigateToHome}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <img alt="Sandbox Life" className="h-6" src={logo} />

            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={navigateToHome}
              className={styles.iconBtn}
              aria-label="Home"
            >
              <HomeIcon className="h-5 w-5" />
            </button>
            <Link
              to={userId ? `/settings/${userId}` : "#"}
              onClick={toggleMenu}
              className={styles.iconBtn}
              aria-label="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={async () => {
                await handleLogout();
                toggleMenu();
              }}
              className={styles.iconBtn}
              aria-label="Log out"
            >
              <PowerIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={toggleMenu}
              className={styles.closeBtn}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tagline */}
        <p className={styles.subtitle}>
          Your home for daily reflections, stories, and progress.
        </p>

        {userId && (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr] relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <Link
                to={isDnDTheme ? `/dashboard-v2/${userId}` : `/home/${userId}`}
                onClick={toggleMenu}
                className={styles.cardLarge}
              >
                <div className={styles.cardTitle}>
                  <HomeIcon className={styles.icon} />
                  <span className="text-base font-semibold">Home / Dashboard</span>
                </div>
                <p className={styles.cardText}>
                  Your main overview and recent entries.
                </p>
              </Link>
              <Link
                to={`/my-calendar/${userId}`}
                onClick={toggleMenu}
                className={styles.card}
              >
                <CalendarDaysIcon className={styles.icon} />
                <p className="mt-3 text-base font-semibold">Calendar</p>
                <p className={styles.cardText}>View your activity.</p>
              </Link>
              <Link
                to={`/my-book/${userId}`}
                onClick={toggleMenu}
                className={styles.card}
              >
                <BookOpenIcon className={styles.icon} />
                <p className="mt-3 text-base font-semibold">My Book</p>
                <p className={styles.cardText}>Story entries.</p>
              </Link>
              <Link
                to={`/inbox/${userId}`}
                onClick={toggleMenu}
                className={styles.card}
              >
                <InboxIcon className={styles.icon} />
                <p className="mt-3 text-base font-semibold">Inbox</p>
                <p className={styles.cardText}>Messages & chats.</p>
              </Link>
              <Link
                to={`/friends/${userId}`}
                onClick={toggleMenu}
                className={styles.card}
              >
                <UsersIcon className={styles.icon} />
                <p className="mt-3 text-base font-semibold">Friends</p>
                <p className={styles.cardText}>Manage connections.</p>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <div className={styles.card}>
                <h3 className="text-base font-semibold text-slate-800">Quick Actions</h3>
                <p className={`mt-1 text-sm ${styles.cardText}`}>
                  Start a new entry or review highlights.
                </p>
                <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                  <Link to="/dailyjournal" onClick={toggleMenu} className={styles.quickAction}>
                    New Daily Entry
                  </Link>
                  <Link to="/bookjourney" onClick={toggleMenu} className={styles.quickAction}>
                    New Book Entry
                  </Link>
                  <Link to="/thoughtoftheday" onClick={toggleMenu} className={styles.quickAction}>
                    Update Status
                  </Link>
                </div>
              </div>
              <div className={styles.card}>
                <h3 className="text-base font-semibold text-slate-800">Today&apos;s Focus</h3>
                <p className={`mt-1 text-sm ${styles.cardText}`}>
                  Keep your reflection steady and intentional.
                </p>
                <div
                  className="mt-4 rounded-xl px-4 py-3 text-sm bg-white border border-darkpapyrus text-slate-700"
                >
                  &ldquo;Write one moment that made you feel grounded.&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SidebarMenu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  isDnDTheme: PropTypes.bool,
};

export default SidebarMenu;
