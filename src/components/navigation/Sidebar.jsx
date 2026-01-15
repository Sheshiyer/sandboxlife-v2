import PropTypes from 'prop-types';
import { 
  XMarkIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  PowerIcon 
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import SidebarSection from './SidebarSection';
import NavCard from './NavCard';
import logo from '../../assets/otherImg/sandBoxLifeR.png';

/**
 * Sidebar Component - Collapsible sidebar with sections
 */
const Sidebar = ({ isOpen, onClose, userId }) => {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // Logout failed silently
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-bgpapyrus">
      <div className="h-full w-full max-w-5xl mx-auto flex flex-col px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={userId ? `/profile/${userId}` : '#'}
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-lightpapyrus px-3 py-1.5 text-sm font-semibold text-slate-700 border border-darkpapyrus hover:bg-darkpapyrus transition-nature"
          >
            <UserCircleIcon className="h-5 w-5" />
            Profile
          </Link>
          
          <div className="flex items-center gap-2">
            <Link
              to={userId ? `/settings/${userId}` : '#'}
              onClick={onClose}
              className="rounded-full bg-lightpapyrus p-2 border border-darkpapyrus hover:bg-darkpapyrus transition-nature"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={async () => {
                await handleLogout();
                onClose();
              }}
              className="rounded-full bg-lightpapyrus p-2 border border-darkpapyrus hover:bg-darkpapyrus transition-nature"
              aria-label="Log out"
            >
              <PowerIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-lightpapyrus p-2 border border-darkpapyrus hover:bg-darkpapyrus transition-nature"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Brand */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <img alt="Sandbox Life" className="h-6" src={logo} />
            <span className="text-lg font-serif font-semibold text-slate-800">
              SandBoxLife
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Your home for daily reflections, stories, and progress.
          </p>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <SidebarSection title="Main Navigation" defaultOpen>
            <div className="space-y-3">
              <NavCard
                to={`/home/${userId}`}
                title="Home / Dashboard"
                description="Your main overview and recent entries."
                variant="green"
                onClick={onClose}
              />
              <NavCard
                to={`/my-calendar/${userId}`}
                title="Calendar"
                description="View your activity."
                variant="blue"
                onClick={onClose}
              />
              <NavCard
                to={`/my-book/${userId}`}
                title="My Book"
                description="Story entries."
                variant="orange"
                onClick={onClose}
              />
              <NavCard
                to={`/chat/${userId}`}
                title="Inbox"
                description="Messages & notes."
                variant="teal"
                onClick={onClose}
              />
            </div>
          </SidebarSection>

          <SidebarSection title="Quick Actions" className="mt-6">
            <div className="space-y-2">
              <Link 
                to="/dailyjournal" 
                onClick={onClose}
                className="block rounded-2xl bg-white px-3 py-2 border border-darkpapyrus text-sm font-semibold text-slate-700 hover:bg-lightpapyrus transition-nature"
              >
                New Daily Entry
              </Link>
              <Link 
                to="/bookjourney" 
                onClick={onClose}
                className="block rounded-2xl bg-white px-3 py-2 border border-darkpapyrus text-sm font-semibold text-slate-700 hover:bg-lightpapyrus transition-nature"
              >
                New Book Entry
              </Link>
              <Link 
                to="/thoughtoftheday" 
                onClick={onClose}
                className="block rounded-2xl bg-white px-3 py-2 border border-darkpapyrus text-sm font-semibold text-slate-700 hover:bg-lightpapyrus transition-nature"
              >
                Update Status
              </Link>
            </div>
          </SidebarSection>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default Sidebar;