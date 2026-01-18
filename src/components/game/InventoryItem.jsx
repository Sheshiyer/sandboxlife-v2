import PropTypes from "prop-types";
import { LockClosedIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { getRarityStyles, formatUnlockRequirement } from "../../utils/inventory";
import clsx from "clsx";

/**
 * InventoryItem - Displays a single collectible item (icon, achievement, or title)
 */
const InventoryItem = ({
  item,
  type = "icon", // "icon" | "achievement" | "title"
  onClick,
  size = "md", // "sm" | "md" | "lg"
}) => {
  const isUnlocked = type === "title" ? item.isUnlocked : (item.isUnlocked || item.isEarned);
  const rarity = item.rarity || "common";
  const styles = getRarityStyles(rarity);

  const sizeClasses = {
    sm: "w-20 h-24",
    md: "w-28 h-32",
    lg: "w-36 h-40",
  };

  const iconSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const getItemImage = () => {
    if (type === "achievement") {
      return item.icon_url || null;
    }
    return null; // Icons will use emoji or actual icon images
  };

  const getItemEmoji = () => {
    if (type === "achievement") {
      // Category-based emojis for achievements
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
      // Level-based emojis for titles
      if (item.level >= 90) return "👑";
      if (item.level >= 70) return "🌟";
      if (item.level >= 50) return "⚔️";
      if (item.level >= 30) return "🛡️";
      if (item.level >= 15) return "📖";
      return "🚶";
    }
    // For icons, we'll show the actual icon image
    return "🎨";
  };

  const getItemName = () => {
    if (type === "icon") return item.icon_name;
    if (type === "achievement") return item.name;
    if (type === "title") return item.title;
    return "Unknown";
  };

  const getItemSubtext = () => {
    if (type === "icon") {
      return item.journal_type?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    if (type === "achievement") {
      return item.category?.charAt(0).toUpperCase() + item.category?.slice(1);
    }
    if (type === "title") {
      return `Level ${item.level}`;
    }
    return "";
  };

  return (
    <button
      onClick={() => onClick && onClick(item)}
      className={clsx(
        "relative flex flex-col items-center justify-center rounded-xl border-2 p-2 transition-all duration-200",
        sizeClasses[size],
        isUnlocked
          ? `${styles.border} ${styles.bg} ${styles.glow} hover:scale-105 cursor-pointer`
          : "border-slate-700 bg-slate-900/80 cursor-pointer hover:bg-slate-800",
        item.isCurrent && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-900"
      )}
    >
      {/* Rarity Badge */}
      <div
        className={clsx(
          "absolute -top-2 -right-2 px-1.5 py-0.5 rounded text-[0.6rem] font-bold uppercase text-white",
          styles.badge
        )}
      >
        {rarity.charAt(0)}
      </div>

      {/* Lock/Unlock Status */}
      <div className="absolute top-1 left-1">
        {isUnlocked ? (
          <CheckCircleIcon className={clsx("w-4 h-4", styles.text)} />
        ) : (
          <LockClosedIcon className="w-4 h-4 text-slate-500" />
        )}
      </div>

      {/* Item Image/Emoji */}
      <div
        className={clsx(
          "flex items-center justify-center rounded-lg overflow-hidden mb-1",
          iconSizes[size],
          isUnlocked ? "opacity-100" : "opacity-40 grayscale"
        )}
      >
        {type === "icon" && item.icon_uuid ? (
          // For icons, we'd ideally show the actual icon image
          // For now, show a placeholder or emoji
          <span className="text-3xl">{getItemEmoji()}</span>
        ) : getItemImage() ? (
          <img
            src={getItemImage()}
            alt={getItemName()}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className={clsx("text-3xl", size === "lg" && "text-4xl")}>
            {getItemEmoji()}
          </span>
        )}
      </div>

      {/* Item Name */}
      <p
        className={clsx(
          "text-center font-semibold truncate w-full px-1",
          size === "sm" ? "text-[0.6rem]" : "text-xs",
          isUnlocked ? styles.text : "text-slate-500"
        )}
      >
        {getItemName()}
      </p>

      {/* Subtext */}
      <p
        className={clsx(
          "text-center truncate w-full px-1",
          size === "sm" ? "text-[0.5rem]" : "text-[0.65rem]",
          isUnlocked ? "text-slate-400" : "text-slate-600"
        )}
      >
        {isUnlocked ? getItemSubtext() : formatUnlockRequirement(item).split(" ").slice(0, 3).join(" ")}
      </p>

      {/* Current Title Indicator */}
      {item.isCurrent && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 text-[0.5rem] font-bold px-2 py-0.5 rounded-full">
          CURRENT
        </div>
      )}
    </button>
  );
};

InventoryItem.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(["icon", "achievement", "title"]),
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export default InventoryItem;
