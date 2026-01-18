import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  GiftIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { getQuestTypeStyles } from "../../utils/quests";
import clsx from "clsx";

/**
 * QuestCard - Displays a single quest with progress
 */
const QuestCard = ({
  quest,
  onClaim,
  isClaimLoading = false,
}) => {
  const styles = getQuestTypeStyles(quest.quest_type);
  const canClaim = quest.isCompleted && !quest.isClaimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "relative rounded-xl border-2 p-4 transition-all",
        quest.isClaimed
          ? "border-slate-700 bg-slate-800/30 opacity-60"
          : quest.isCompleted
          ? `${styles.border} ${styles.bg} ${styles.glow}`
          : "border-slate-700 bg-slate-800/50"
      )}
    >
      {/* Quest Type Badge */}
      <div
        className={clsx(
          "absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase text-white",
          styles.badge
        )}
      >
        {quest.quest_type}
      </div>

      {/* Claimed Overlay */}
      {quest.isClaimed && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 z-10">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircleIcon className="w-6 h-6" />
            <span className="font-bold">CLAIMED</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Icon */}
        <div
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center text-2xl border",
            quest.isCompleted
              ? `${styles.bg} ${styles.border}`
              : "bg-slate-700 border-slate-600"
          )}
        >
          {quest.icon_emoji}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-w-0">
          <h3
            className={clsx(
              "font-semibold text-base",
              quest.isCompleted ? styles.text : "text-slate-200"
            )}
          >
            {quest.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2">
            {quest.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-400">Progress</span>
          <span className={quest.isCompleted ? styles.text : "text-slate-300"}>
            {quest.progress}/{quest.target}
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${quest.percentComplete}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={clsx(
              "h-full rounded-full",
              quest.isCompleted
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-slate-500 to-slate-400"
            )}
          />
        </div>
      </div>

      {/* Reward & Claim Button */}
      <div className="flex items-center justify-between">
        {/* XP Reward */}
        <div className="flex items-center gap-1.5">
          <GiftIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">
            +{quest.xp_reward} XP
          </span>
        </div>

        {/* Claim Button */}
        {canClaim ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClaim(quest.quest_key)}
            disabled={isClaimLoading}
            className={clsx(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-sm transition-all",
              "bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900",
              "hover:from-yellow-300 hover:to-amber-400",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-[0_0_15px_rgba(234,179,8,0.4)]"
            )}
          >
            {isClaimLoading ? (
              <span className="animate-pulse">Claiming...</span>
            ) : (
              <>
                <GiftIcon className="w-4 h-4" />
                <span>Claim</span>
              </>
            )}
          </motion.button>
        ) : quest.isClaimed ? (
          <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" />
            Claimed
          </span>
        ) : (
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <LockClosedIcon className="w-4 h-4" />
            In Progress
          </span>
        )}
      </div>
    </motion.div>
  );
};

QuestCard.propTypes = {
  quest: PropTypes.shape({
    quest_key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    quest_type: PropTypes.oneOf(["daily", "weekly", "special"]).isRequired,
    xp_reward: PropTypes.number.isRequired,
    icon_emoji: PropTypes.string,
    progress: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired,
    percentComplete: PropTypes.number.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    isClaimed: PropTypes.bool.isRequired,
  }).isRequired,
  onClaim: PropTypes.func.isRequired,
  isClaimLoading: PropTypes.bool,
};

export default QuestCard;
