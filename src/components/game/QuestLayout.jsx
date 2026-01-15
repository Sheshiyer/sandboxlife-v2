import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useGameMode } from '../../context/GameModeContext';
import PropTypes from 'prop-types';

const QUEST_TYPES = {
  book_journal: { title: 'Campaign Tome', subtitle: 'Chronicle Your Journey', icon: '📖', color: 'from-purple-600 to-purple-900' },
  daily_journal: { title: 'Daily Quest', subtitle: 'Record Your Adventures', icon: '📜', color: 'from-blue-600 to-blue-900' },
  thought_of_the_day: { title: "Oracle's Wisdom", subtitle: 'Capture Your Insight', icon: '✨', color: 'from-yellow-600 to-yellow-900' },
};

const QuestLayout = ({ children, questType, currentStep = 1, totalSteps = 3 }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { isGameMode, disableGameMode } = useGameMode();

  const questInfo = QUEST_TYPES[questType] || QUEST_TYPES.daily_journal;

  const handleBackToHub = () => {
    disableGameMode();
    navigate(`/dashboard-v2/${userId}`);
  };

  // Classic mode - render children without wrapper
  if (!isGameMode) {
    return <>{children}</>;
  }

  // Game mode - full D&D themed layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 border-b border-yellow-500/20 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBackToHub}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/60 border border-yellow-500/30 text-yellow-500 hover:bg-slate-800 hover:border-yellow-500/50 transition-all group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-serif text-sm tracking-wide">Return to Hub</span>
            </button>

            {/* Quest Title */}
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow-lg">{questInfo.icon}</span>
              <div>
                <h1 className="text-xl font-serif text-yellow-500 tracking-wide">{questInfo.title}</h1>
                <p className="text-sm text-slate-400">{questInfo.subtitle}</p>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full border-2 transition-all ${
                    idx + 1 === currentStep
                      ? 'bg-yellow-500 border-yellow-500 scale-125 shadow-lg shadow-yellow-500/50'
                      : idx + 1 < currentStep
                      ? 'bg-yellow-500/50 border-yellow-500/50'
                      : 'bg-transparent border-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer Glow Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none" />
    </div>
  );
};

QuestLayout.propTypes = {
  children: PropTypes.node.isRequired,
  questType: PropTypes.oneOf(['book_journal', 'daily_journal', 'thought_of_the_day']).isRequired,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
};

export default QuestLayout;
