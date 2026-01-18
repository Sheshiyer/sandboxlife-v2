import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  ArrowLeftIcon,
  SparklesIcon,
  TrophyIcon,
  ShieldCheckIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import {
  getIconInventory,
  getAchievementInventory,
  getTitleInventory,
  getInventoryStats,
} from "../utils/inventory";
import InventoryItem from "../components/game/InventoryItem";
import ItemDetailModal from "../components/game/ItemDetailModal";
import Menu from "../components/Menu";
import { Bars3Icon } from "@heroicons/react/24/solid";

const CATEGORIES = [
  { id: "icons", label: "Icons", icon: SparklesIcon, emoji: "🎨" },
  { id: "achievements", label: "Achievements", icon: TrophyIcon, emoji: "🏆" },
  { id: "titles", label: "Titles", icon: ShieldCheckIcon, emoji: "👑" },
];

const RARITIES = ["all", "common", "uncommon", "rare", "epic", "legendary"];

const InventoryPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("icons");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [icons, setIcons] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [titles, setTitles] = useState([]);
  const [stats, setStats] = useState(null);

  // Modal state
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("icon");

  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      const [iconsRes, achievementsRes, titlesRes, statsRes] = await Promise.all([
        getIconInventory(userId),
        getAchievementInventory(userId),
        getTitleInventory(userId),
        getInventoryStats(userId),
      ]);

      if (iconsRes.success) setIcons(iconsRes.data);
      if (achievementsRes.success) setAchievements(achievementsRes.data);
      if (titlesRes.success) setTitles(titlesRes.data);
      if (statsRes.success) setStats(statsRes.data);

      setIsLoading(false);
    };

    loadInventory();
  }, [userId]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleItemClick = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const getFilteredItems = () => {
    let items = [];
    let type = "icon";

    switch (activeCategory) {
      case "icons":
        items = icons;
        type = "icon";
        break;
      case "achievements":
        items = achievements;
        type = "achievement";
        break;
      case "titles":
        items = titles;
        type = "title";
        break;
      default:
        items = icons;
    }

    // Filter by rarity (not applicable for titles)
    if (selectedRarity !== "all" && activeCategory !== "titles") {
      items = items.filter((item) => item.rarity === selectedRarity);
    }

    // Filter by unlock status
    if (showUnlockedOnly) {
      items = items.filter((item) =>
        activeCategory === "titles" ? item.isUnlocked : item.isUnlocked || item.isEarned
      );
    }

    return { items, type };
  };

  const { items: filteredItems, type: itemType } = getFilteredItems();

  const getCurrentStats = () => {
    if (!stats) return { unlocked: 0, total: 0, percent: 0 };
    switch (activeCategory) {
      case "icons":
        return {
          unlocked: stats.icons.unlocked,
          total: stats.icons.total,
          percent: Math.round((stats.icons.unlocked / stats.icons.total) * 100),
        };
      case "achievements":
        return {
          unlocked: stats.achievements.earned,
          total: stats.achievements.total,
          percent: Math.round((stats.achievements.earned / stats.achievements.total) * 100),
        };
      case "titles":
        return {
          unlocked: stats.titles.unlocked,
          total: stats.titles.total,
          percent: Math.round((stats.titles.unlocked / stats.titles.total) * 100),
        };
      default:
        return { unlocked: 0, total: 0, percent: 0 };
    }
  };

  const currentStats = getCurrentStats();

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
          <span>🎒</span> INVENTORY
        </h1>

        <div className="w-32" /> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={clsx(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                activeCategory === cat.id
                  ? "bg-yellow-500 text-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-slate-800/50 rounded-xl p-4">
          {/* Rarity Filter */}
          {activeCategory !== "titles" && (
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400">Rarity:</span>
              <div className="flex gap-1">
                {RARITIES.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setSelectedRarity(rarity)}
                    className={clsx(
                      "px-3 py-1 rounded-lg text-xs font-semibold uppercase transition",
                      selectedRarity === rarity
                        ? "bg-yellow-500 text-slate-900"
                        : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    )}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unlocked Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showUnlockedOnly}
              onChange={(e) => setShowUnlockedOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-yellow-500 focus:ring-yellow-500"
            />
            <span className="text-sm text-slate-300">Show unlocked only</span>
          </label>
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Collection Progress</span>
            <span className="text-sm font-semibold text-yellow-400">
              {currentStats.unlocked}/{currentStats.total} ({currentStats.percent}%)
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentStats.percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
            />
          </div>
        </div>

        {/* Inventory Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-28 h-32 bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">📦</span>
            <p className="text-slate-400 text-lg">No items found</p>
            <p className="text-slate-500 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id || item.icon_uuid || item.achievement_key || item.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <InventoryItem
                  item={item}
                  type={itemType}
                  onClick={(item) => handleItemClick(item, itemType)}
                  size="md"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        {stats && activeCategory === "icons" && (
          <div className="mt-8 bg-slate-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-400 mb-4">
              Icons by Rarity
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(stats.icons.byRarity).map(([rarity, total]) => (
                <div key={rarity} className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {stats.icons.unlockedByRarity[rarity]}/{total}
                  </p>
                  <p className="text-xs text-slate-400 uppercase">{rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        isOpen={!!selectedItem}
        onClose={closeModal}
        item={selectedItem}
        type={modalType}
      />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} isDnDTheme={true} />
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
