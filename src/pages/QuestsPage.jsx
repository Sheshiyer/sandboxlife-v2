import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  ArrowLeftIcon,
  SparklesIcon,
  CalendarDaysIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { getQuestsWithProgress, claimQuestReward } from "../utils/quests";
import QuestCard from "../components/game/QuestCard";
import Menu from "../components/Menu";

const QuestsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [claimingQuest, setClaimingQuest] = useState(null);

  // Quest data
  const [dailyQuests, setDailyQuests] = useState([]);
  const [weeklyQuests, setWeeklyQuests] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadQuests();
  }, [userId]);

  const loadQuests = async () => {
    setIsLoading(true);
    const result = await getQuestsWithProgress(userId);
    if (result.success) {
      setDailyQuests(result.data.dailyQuests);
      setWeeklyQuests(result.data.weeklyQuests);
      setStats(result.data.stats);
    } else {
      toast.error("Failed to load quests");
    }
    setIsLoading(false);
  };

  const handleClaimReward = async (questKey) => {
    setClaimingQuest(questKey);
    const result = await claimQuestReward(userId, questKey);

    if (result.success) {
      toast.success(`+${result.data.xpAwarded} XP earned!`, {
        icon: "🎁",
        style: {
          background: "#0a0a0a",
          color: "#fbbf24",
          border: "1px solid #fbbf24",
        },
      });

      if (result.data.levelUp) {
        setTimeout(() => {
          toast.success(`Level Up! You are now Level ${result.data.newLevel}: ${result.data.newTitle}!`, {
            icon: "⭐",
            style: {
              background: "#0a0a0a",
              color: "#fbbf24",
              border: "1px solid #fbbf24",
            },
            autoClose: 5000,
          });
        }, 1000);
      }

      // Reload quests to update claimed status
      await loadQuests();
    } else {
      toast.error(result.error || "Failed to claim reward");
    }

    setClaimingQuest(null);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const getTimeUntilReset = (type) => {
    const now = new Date();
    let resetTime;

    if (type === "daily") {
      resetTime = new Date(now);
      resetTime.setUTCDate(resetTime.getUTCDate() + 1);
      resetTime.setUTCHours(0, 0, 0, 0);
    } else {
      // Weekly - next Monday
      resetTime = new Date(now);
      const day = resetTime.getUTCDay();
      const daysUntilMonday = day === 0 ? 1 : 8 - day;
      resetTime.setUTCDate(resetTime.getUTCDate() + daysUntilMonday);
      resetTime.setUTCHours(0, 0, 0, 0);
    }

    const diff = resetTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMenu}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 flex items-center justify-center transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => navigate(`/dashboard-v2/${userId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/20 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="font-semibold text-sm">Back to HQ</span>
          </button>
        </div>

        <h1 className="text-2xl font-serif text-yellow-400 tracking-wider flex items-center gap-2">
          <span>⚔️</span> QUEST BOARD
        </h1>

        <div className="w-32" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        {/* Stats Banner */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-xs text-slate-400">Completed Today</p>
                    <p className="text-xl font-bold text-yellow-400">
                      {stats.dailyCompleted}/{stats.dailyTotal}
                    </p>
                  </div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-xs text-slate-400">Weekly Progress</p>
                    <p className="text-xl font-bold text-purple-400">
                      {stats.weeklyCompleted}/{stats.weeklyTotal}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-xs text-slate-400">XP Claimed</p>
                  <p className="text-xl font-bold text-yellow-400">
                    {stats.xpClaimed}/{stats.totalXpAvailable} XP
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="space-y-8">
            {/* Loading Skeletons */}
            <div>
              <div className="h-8 w-40 bg-slate-800 rounded mb-4 animate-pulse" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-40 bg-slate-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Daily Quests */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                    <span className="text-xl">📜</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-blue-400">
                      Daily Quests
                    </h2>
                    <p className="text-xs text-slate-500">
                      Resets in {getTimeUntilReset("daily")}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {dailyQuests.filter((q) => q.isCompleted).length}/{dailyQuests.length} Complete
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyQuests.map((quest) => (
                  <QuestCard
                    key={quest.quest_key}
                    quest={quest}
                    onClaim={handleClaimReward}
                    isClaimLoading={claimingQuest === quest.quest_key}
                  />
                ))}
              </div>

              {dailyQuests.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No daily quests available</p>
                </div>
              )}
            </section>

            {/* Weekly Quests */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                    <span className="text-xl">📚</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-purple-400">
                      Weekly Challenges
                    </h2>
                    <p className="text-xs text-slate-500">
                      Resets in {getTimeUntilReset("weekly")}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {weeklyQuests.filter((q) => q.isCompleted).length}/{weeklyQuests.length} Complete
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeklyQuests.map((quest) => (
                  <QuestCard
                    key={quest.quest_key}
                    quest={quest}
                    onClaim={handleClaimReward}
                    isClaimLoading={claimingQuest === quest.quest_key}
                  />
                ))}
              </div>

              {weeklyQuests.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No weekly quests available</p>
                </div>
              )}
            </section>

            {/* Tips Section */}
            <section className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                <span>💡</span> Quest Tips
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Daily quests reset at midnight UTC. Complete them before they expire!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Weekly challenges give more XP but require consistent effort throughout the week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Writing in different journal types helps complete the Versatile Scribe quest.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">•</span>
                  <span>Keep your streak alive by writing at least one entry every day!</span>
                </li>
              </ul>
            </section>
          </div>
        )}
      </main>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} isDnDTheme={true} />
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
