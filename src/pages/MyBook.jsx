import { useState, useEffect } from 'react';
import CalendarDateHeader from '../components/CalendarDateHeader';
import Menu from '../components/Menu';
import TopBar from '../components/TopBar';
import { fetchEntries } from '../utils/supabase';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GridList from "../components/GridList";
import Breadcrumb from "../components/Breadcrumb";
import { useGameMode } from '../context/GameModeContext';
import GamePageLayout from '../components/game/GamePageLayout';

export default function MyBook() {
  const { userId } = useParams();
  const { isGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    fetchEntries(userId, 'book_journal', 50)
      .then((data) => {
        let tempData = data.map((entry) => {
          const formattedDatetime = formatDatetime(entry.created_at);
          return {
            ...entry,
            date: formattedDatetime.date,
            time: formattedDatetime.time,
          };
        });
        setEntries(tempData);

        const journalMeaning = new Set();
        tempData.forEach((entry) => {
          journalMeaning.add(entry.journal_meaning);
        });
        setChapters(Array.from(journalMeaning));
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [userId]);

  const handlePrevClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() - 1))
    );
  };

  const handleNextClick = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setMonth(prevDate.getMonth() + 1))
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  function formatDatetime(datetimeStr) {
    const date = new Date(datetimeStr);
    function formatDate() {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    function formatTime() {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return {
      date: formatDate(),
      time: formatTime(),
    };
  }

  const content = (
    <>
      {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
      {!isGameMode && isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      {!isGameMode && (
        <Breadcrumb
          items={[
            { label: "Dashboard", to: `/home/${userId}` },
            { label: "My Book" },
          ]}
        />
      )}
      <CalendarDateHeader
        currentDate={currentDate}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
      <ToastContainer />
      
      <div className="w-full px-0 md:px-4 py-6">
        <div className={`max-w-6xl mx-auto rounded-3xl border ${
          isGameMode 
            ? "border-yellow-500/20 bg-slate-900/40 backdrop-blur-md p-6 shadow-2xl" 
            : "border-darkpapyrus bg-lightpapyrus p-4 shadow-sm"
        }`}>
          <GridList items={entries} chapters={chapters} />
        </div>
      </div>
    </>
  );

  return (
    <GamePageLayout 
      title={isGameMode ? "Tome of Tales" : "My Book"} 
      icon="📖"
    >
      {content}
    </GamePageLayout>
  );
}

