import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useGameMode } from '../../context/GameModeContext';
import PropTypes from 'prop-types';

/**
 * GamePageLayout: A shared layout wrapper for non-journal pages (Profile, Settings, etc.)
 * that supports both D&D and Classic themes.
 */
const GamePageLayout = ({ 
  children, 
  title, 
  icon, 
  showBackButton = true, 
  backRoute 
}) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isGameMode } = useGameMode();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      // Default back route is dashboard-v2 if in game mode, else home
      navigate(isGameMode ? `/dashboard-v2/${userId}` : `/home/${userId}`);
    }
  };

  // Classic mode - render children with minimal or no wrapper
  if (!isGameMode) {
    return <div className="min-h-screen bg-transparent">{children}</div>;
  }

  // Game mode - D&D themed layout
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden flex flex-col">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/60 pointer-events-none" />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-vignette pointer-events-none z-0" />

      {/* Header */}
      <header className="relative z-10 border-b border-yellow-500/20 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-slate-900/60 border border-yellow-500/30 text-yellow-500 hover:bg-slate-800 hover:border-yellow-500/50 transition-all group shadow-lg"
                aria-label="Go back"
              >
                <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            )}
            <div className="flex items-center gap-3">
              {icon && <span className="text-3xl drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">{icon}</span>}
              <h1 className="text-xl md:text-2xl font-serif text-yellow-500 tracking-wider drop-shadow-md">
                {title}
              </h1>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="text-xs text-yellow-500/50 uppercase tracking-[0.2em] font-serif">
              Sandbox Life • Adventurer Edition
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 overflow-y-auto">
        <div className="animate-reveal">
          {children}
        </div>
      </main>

      {/* Footer Ambient Glow */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

GamePageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  showBackButton: PropTypes.bool,
  backRoute: PropTypes.string,
};

export default GamePageLayout;
