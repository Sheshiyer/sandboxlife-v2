import PropTypes from "prop-types";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, LockClosedIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { getRarityStyles, formatUnlockRequirement } from "../../utils/inventory";
import clsx from "clsx";

/**
 * ItemDetailModal - Shows detailed information about an inventory item
 */
const ItemDetailModal = ({ isOpen, onClose, item, type = "icon" }) => {
  if (!item) return null;

  const isUnlocked = type === "title" ? item.isUnlocked : (item.isUnlocked || item.isEarned);
  const rarity = item.rarity || "common";
  const styles = getRarityStyles(rarity);

  const getItemEmoji = () => {
    if (type === "achievement") {
      const categoryEmojis = {
        journal: "📜",
        streak: "🔥",
        social: "👥",
        milestone: "🏆",
        special: "⭐",
      };
      return categoryEmojis[item.category] || "🎯";
    }
    if (type === "title") {
      if (item.level >= 90) return "👑";
      if (item.level >= 70) return "🌟";
      if (item.level >= 50) return "⚔️";
      if (item.level >= 30) return "🛡️";
      if (item.level >= 15) return "📖";
      return "🚶";
    }
    // Icon type emojis based on journal type
    const journalEmojis = {
      book_journal: "📚",
      daily_journal: "📅",
      thought_of_the_day: "💭",
    };
    return journalEmojis[item.journal_type] || "🎨";
  };

  const getItemName = () => {
    if (type === "icon") return item.icon_name;
    if (type === "achievement") return item.name;
    if (type === "title") return item.title;
    return "Unknown";
  };

  const getItemDescription = () => {
    if (type === "icon") return item.description;
    if (type === "achievement") return item.description;
    if (type === "title") return item.description;
    return "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  "w-full max-w-md transform overflow-hidden rounded-2xl border-2 bg-slate-900 p-6 text-left align-middle shadow-xl transition-all",
                  styles.border,
                  styles.glow
                )}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 hover:bg-slate-700 transition"
                >
                  <XMarkIcon className="w-5 h-5 text-slate-400" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  {/* Icon/Emoji */}
                  <div
                    className={clsx(
                      "w-24 h-24 mx-auto mb-4 rounded-xl border-2 flex items-center justify-center",
                      styles.border,
                      styles.bg,
                      isUnlocked ? "opacity-100" : "opacity-50 grayscale"
                    )}
                  >
                    <span className="text-5xl">{getItemEmoji()}</span>
                  </div>

                  {/* Name */}
                  <Dialog.Title
                    as="h3"
                    className={clsx("text-xl font-serif font-bold", styles.text)}
                  >
                    {getItemName()}
                  </Dialog.Title>

                  {/* Rarity Badge */}
                  <span
                    className={clsx(
                      "inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase text-white",
                      styles.badge
                    )}
                  >
                    {rarity}
                  </span>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-slate-300 text-center italic">
                    &quot;{getItemDescription() || "A mysterious item..."}&quot;
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-3 bg-slate-800/50 rounded-xl p-4">
                  {/* Type-specific info */}
                  {type === "icon" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Journal Type</span>
                      <span className="text-slate-300">
                        {item.journal_type?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    </div>
                  )}

                  {type === "achievement" && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Category</span>
                        <span className="text-slate-300">
                          {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">XP Reward</span>
                        <span className="text-yellow-400 font-semibold">+{item.xp_reward} XP</span>
                      </div>
                    </>
                  )}

                  {type === "title" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Required Level</span>
                      <span className="text-slate-300">Level {item.level}</span>
                    </div>
                  )}

                  {/* Unlock Requirement */}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Unlock</span>
                    <span className="text-slate-300">
                      {type === "title" ? `Reach Level ${item.level}` : formatUnlockRequirement(item)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-slate-500">Status</span>
                    <span className="flex items-center gap-1">
                      {isUnlocked ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-semibold">UNLOCKED</span>
                        </>
                      ) : (
                        <>
                          <LockClosedIcon className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-500">LOCKED</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Unlock Date */}
                  {isUnlocked && (item.unlockedAt || item.earnedAt) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Obtained</span>
                      <span className="text-slate-300">
                        {formatDate(item.unlockedAt || item.earnedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Title Indicator */}
                {type === "title" && item.isCurrent && (
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-yellow-400 text-slate-900 text-sm font-bold px-4 py-2 rounded-full">
                      ⭐ Currently Equipped
                    </span>
                  </div>
                )}

                {/* Close Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

ItemDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  type: PropTypes.oneOf(["icon", "achievement", "title"]),
};

export default ItemDetailModal;
