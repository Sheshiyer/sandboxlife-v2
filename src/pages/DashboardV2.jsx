import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import GameLayout from "../components/game/GameLayout";
import Card3D from "../components/game/Card3D";
import QuadrantsBoard from "../components/game/QuadrantsBoard";
import PlayerChoiceModal from "../components/game/PlayerChoiceModal";
import ScribeEditor from "../components/game/ScribeEditor";
import Menu from "../components/Menu";
import { fetchDashboardV2Entries } from "../utils/dashboardV2";
import { formatDatetime } from "../utils/formatters";
import { toast } from 'react-toastify';

import { getCardDisplayData } from "../utils/sigilSystem";

import TimelineMap from "../components/game/TimelineMap";

const DashboardV2 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContext] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'map'
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      const result = await fetchDashboardV2Entries(userId, 12);

      if (!isMounted) return;
      if (result.success) {
        setEntries(result.data);
        toast.success("Daily Login Bonus: +10 Mana!", {
          icon: "💎",
          style: { background: '#0a0a0a', color: '#FFD700', border: '1px solid #FFD700' }
        });
      }
      setIsLoading(false);
    };

    if (userId) loadData();
    return () => { isMounted = false; };
  }, [userId]);

  const cards = useMemo(() => {
    if (isLoading) return Array(4).fill({ id: 'loading', isSkeleton: true });

    return entries.map(entry => {
      // Get display data using actual entry icons
      const displayData = getCardDisplayData(entry);

      return {
        id: entry.id,
        title: displayData.title,
        subtitle: formatDatetime(entry.created_at).date,
        type: entry.journal_type,
        rarity: entry.journal_meaning ? 'legendary' : 'common',
        quadrant: displayData.quadrant,
        icon: entry.journal_icon, // Use actual icon URL from database
        scheme: displayData.scheme
      };
    });
  }, [entries, isLoading]);

  const mana = entries.length * 10;

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleChoiceSelect = (choice) => {
    setShowChoiceModal(false);
    // Navigate to the actual journal page
    if (choice.route) {
      navigate(choice.route);
    }
  };

  const handleEditorSave = (content) => {
    // Here we would actually save to Supabase
    console.log("Saving entry:", content);
    toast.success("Query Completed! +50 XP", {
      icon: "📜",
      style: { background: '#0a0a0a', color: '#FFD700', border: '1px solid #FFD700' }
    });
    setEntries(prev => [...prev, {
      id: Date.now(),
      journal_type: editorContext?.id || 'daily_journal',
      journal_meaning: 'New Entry',
      created_at: new Date().toISOString(),
      journal_entry: content
    }]);
  };

  return (
    <>
      <GameLayout mana={mana} toggleMenu={toggleMenu} userId={userId}>
        {/* Navigation Toggles (HUD) */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 flex gap-4 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
          <button
            onClick={() => setViewMode('board')}
            className={clsx("px-6 py-2 rounded-full font-serif text-sm transition-all", viewMode === 'board' ? "bg-yellow-500 text-black font-bold shadow-glow" : "text-slate-400 hover:text-white")}
          >
            Board
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={clsx("px-6 py-2 rounded-full font-serif text-sm transition-all", viewMode === 'map' ? "bg-purple-500 text-black font-bold shadow-glow" : "text-slate-400 hover:text-white")}
          >
            Map
          </button>
        </div>

      <div className="h-full flex flex-col pt-12">
        {viewMode === 'board' ? (
          <div className="flex-1 relative">
            <QuadrantsBoard decayState={{ mind: 0, body: 0.9, spirit: 0.2, heart: 0 }}>
              {cards.map((card, idx) => (
                <div key={card.id || idx} className="scale-75 origin-top-left" data-quadrant={card.quadrant}>
                  <Card3D
                    title={card.title}
                    subtitle={card.subtitle}
                    rarity={card.rarity}
                    icon={card.icon}
                    scheme={card.scheme}
                  />
                </div>
              ))}
            </QuadrantsBoard>

            {/* FAB for New Entry */}
            <button
              onClick={() => setShowChoiceModal(true)}
              className="absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.6)] flex items-center justify-center text-3xl hover:scale-110 transition-transform z-30 group"
            >
              <span className="group-hover:rotate-90 transition-transform duration-300">⚔️</span>
            </button>
          </div>
        ) : (
          <TimelineMap entries={entries} />
        )}
      </div>

      <PlayerChoiceModal
        isOpen={showChoiceModal}
        onClose={() => setShowChoiceModal(false)}
        onSelect={handleChoiceSelect}
      />

      <ScribeEditor
        isOpen={showEditor}
        onClose={() => setShowEditor(false)}
        context={editorContext}
        onSave={handleEditorSave}
      />
    </GameLayout>

    {/* Menu Overlay */}
    {isMenuOpen && (
      <div className="fixed inset-0 z-50">
        <Menu toggleMenu={toggleMenu} isDnDTheme={true} />
      </div>
    )}
    </>
  );
};


export default DashboardV2;
