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

export default function MyBook() {
  const { userId } = useParams();
  const { isGameMode, disableGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [chapters, setChapters] = useState([]);

  // Disable game mode for classic-only pages
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

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
    // Create a Date object from the datetime string
    const date = new Date(datetimeStr);

    // Function to extract date part (YYYY-MM-DD)
    function formatDate() {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    // Function to extract time part (hh:mm)
    function formatTime() {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    }

    // Return the desired formats
    return {
      date: formatDate(),
      time: formatTime(),
    };
  }

  return (
    <>
      <TopBar toggleMenu={toggleMenu} />
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: `/home/${userId}` },
          { label: "My Book" },
        ]}
      />
      <CalendarDateHeader
        currentDate={currentDate}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
      />
      <ToastContainer />
      

      <div className="w-full px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto rounded-3xl border border-darkpapyrus bg-lightpapyrus p-4 shadow-sm">
          <GridList items={entries} chapters={chapters} />
        </div>
      </div>
    </>
  );
}
