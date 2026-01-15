import { useState, useEffect } from 'react';
import CalendarDateHeader from '../components/CalendarDateHeader';
import Menu from '../components/Menu';
import TopBar from '../components/TopBar';
import SetBPreviewCard from '../components/SetBPreviewCard';
import DashboardToggle from "../components/DashboardToggle";
import { fetchTopUserRecords, fetchEntries } from '../utils/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GridList from "../components/GridList";
import { useGameMode } from '../context/GameModeContext';

export default function HomePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isGameMode, disableGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [tod, setTod] = useState({});
  const newHomeData = [tod, ...entries];

  // Disable game mode when accessing classic home
  useEffect(() => {
    if (isGameMode) {
      disableGameMode();
    }
  }, []);

  useEffect(() => {
    fetchEntries(userId, 'thought_of_the_day', 1)
      .then((data) => {
        if (data && data[0]) {
          setTod(data[0]);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [userId]);

  useEffect(() => {
    fetchTopUserRecords(userId)
      .then((data) => {
        if (data.success && data.data) {
          const tempData = data.data.map((entry) => {
            const formattedDatetime = formatDatetime(entry.created_at);
            return {
              ...entry,
              date: formattedDatetime.date,
              time: formattedDatetime.time,
            };
          });
          setEntries(tempData);
        }
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
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${month}/${day}`;
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

  return (
    <div className="min-h-screen bg-bgpapyrus flex flex-col">
      {/* Header */}
      <TopBar toggleMenu={toggleMenu} />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}

      {/* Calendar Strip Section */}
      <section className="bg-lightpapyrus border-b border-darkpapyrus">
        <div className="max-w-7xl mx-auto py-4 px-4 md:px-8">
          <CalendarDateHeader
            currentDate={currentDate}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Recent Entries Section Header */}
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900">
              Recent Entries
            </h2>
            <p className="text-sm text-slate-700 mt-1 font-medium">
              Your latest journal reflections
            </p>
          </div>

          {/* Content Grid - Entries + Sidebar */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Journal Entries */}
            <div className="flex-1 min-w-0">
              <GridList items={newHomeData} />
            </div>

            {/* Sidebar - New Features */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="sticky top-4 space-y-6">
                {/* Section Label */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">
                    New Features
                  </h3>
                </div>

                {/* Set B Preview Card */}
                <SetBPreviewCard />

                {/* Dashboard Settings Card */}
                <div className="bg-white rounded-2xl border border-darkpapyrus shadow-sm p-6">
                  <h4 className="text-lg font-serif font-bold text-slate-900 mb-4 text-center">
                    Dashboard Settings
                  </h4>
                  <div className="border-t border-darkpapyrus pt-4">
                    <div className="flex items-center justify-center">
                      <DashboardToggle
                        isV2={false}
                        onToggle={() => navigate(`/dashboard-v2/${userId}`)}
                      />
                    </div>
                    <p className="text-xs text-slate-700 text-center mt-3 font-medium">
                      Experience our enhanced card-first interface with improved accessibility and focus mode.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
