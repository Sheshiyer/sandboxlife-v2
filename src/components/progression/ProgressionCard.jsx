import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserProgression } from '../../utils/progression';
import { SparklesIcon, FireIcon } from '@heroicons/react/24/solid';

const ProgressionCard = ({ userId, compact = false }) => {
  const [progression, setProgression] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgression();
  }, [userId]);

  const loadProgression = async () => {
    const result = await getUserProgression(userId);
    if (result.success) {
      setProgression(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-lightpapyrus rounded-xl border border-darkpapyrus p-6">
        <div className="h-4 bg-darkpapyrus rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-darkpapyrus rounded w-3/4 mb-4"></div>
        <div className="h-2 bg-darkpapyrus rounded"></div>
      </div>
    );
  }

  if (!progression) return null;

  const { level, xp, title, total_entries, streak_days, xp_for_next_level, xp_percentage } = progression;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-lightpapyrus rounded-lg px-4 py-2 border border-darkpapyrus">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-2 border-amber-700 shadow-md">
          <span className="text-white font-serif font-bold text-lg">{level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
          <div className="w-full bg-darkpapyrus rounded-full h-1.5 mt-1">
            <div className="bg-gradient-to-r from-amber-400 to-amber-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${xp_percentage}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-lightpapyrus rounded-2xl border-2 border-darkpapyrus shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-red to-red/80 px-6 py-4 border-b-2 border-darkpapyrus">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Level {level}</p>
            <h3 className="text-white font-serif font-bold text-2xl">{title}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center border-3 border-white shadow-lg">
            <span className="text-white font-serif font-bold text-2xl">{level}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Experience Points</span>
            <span className="text-sm font-semibold text-slate-900">{xp} / {xp_for_next_level} XP</span>
          </div>
          <div className="relative w-full bg-darkpapyrus rounded-full h-4 border border-slate-400 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 h-full rounded-full transition-all duration-500" style={{ width: `${xp_percentage}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1 text-right">{Math.floor(xp_percentage)}% to next level</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bgpapyrus rounded-xl p-4 border border-darkpapyrus">
            <div className="flex items-center gap-2 mb-1">
              <SparklesIcon className="w-5 h-5 text-blue-600" />
              <p className="text-xs font-medium text-slate-600">Entries Written</p>
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900">{total_entries}</p>
          </div>
          <div className="bg-bgpapyrus rounded-xl p-4 border border-darkpapyrus">
            <div className="flex items-center gap-2 mb-1">
              <FireIcon className="w-5 h-5 text-orange-600" />
              <p className="text-xs font-medium text-slate-600">Current Streak</p>
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900">{streak_days} {streak_days === 1 ? 'day' : 'days'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

ProgressionCard.propTypes = {
  userId: PropTypes.string.isRequired,
  compact: PropTypes.bool,
};

export default ProgressionCard;
