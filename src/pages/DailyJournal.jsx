import { useState, useEffect, useRef } from 'react';
import CalendarDateHeader from '../components/CalendarDateHeader';
import Menu from '../components/Menu';
import TopBar from '../components/TopBar';
import IconSelectionWindow from '../components/IconSelectionWindow';
import { daily_journal_questions } from '../constants/questions';
import { JournalEntrySection } from '../components/JournalEntrySection';
import { insertJournalEntry , fetchDailyEntryCount} from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '../context/GameModeContext';
import QuestLayout from '../components/game/QuestLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function DailyJournal() {
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIconTheme, setSelectedIconTheme] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [userId, setUserId] = useState(null);
  const [dailyEntryCount, setDailyEntryCount] = useState(0);
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);

    const fetchCount = async () => {
      const count = await fetchDailyEntryCount(storedUserId, entryDate);
      setDailyEntryCount(count);
    };

    if (storedUserId) {
      fetchCount();
    }
  }, [entryDate]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
  }, []);
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

  const renderComponents = () => {
    switch (currentStep) {
      case 1:
        return (
          <IconSelectionWindow
            icons={daily_journal_questions}
            setSelectedIconTheme={setSelectedIconTheme}
            onSave={() => setCurrentStep(2)}
            onCancel={() => {}}
            dailyEntryCount={dailyEntryCount}
          />
        );
      case 2:
        return (
          <JournalEntrySection
            triggerQuestion={selectedIconTheme.trigger_question}
            triggerIcon={selectedIconTheme.icon}
            journalType={selectedIconTheme.journal_type}
            chapterEntry="Write your story here"
            onCancel={() => setCurrentStep(1)}
            saveToDb={saveToDb}
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            isLimitReached={dailyEntryCount >= 5}
            entryDate={entryDate}
            setEntryDate={setEntryDate}
          />
        );

      default:
        return <div>Default component or message</div>;
    }
  };

  const saveToDb = async (isNewEntry = false) => {
    if (dailyEntryCount >= 5) {
      toast.error('You have reached the maximum of 5 entries for today!');
      return;
    }

    const createdAt = new Date(`${entryDate}T12:00:00`).toISOString();
    const dbOperation = await insertJournalEntry(
      userId,
      selectedIconTheme.journal_type,
      selectedIconTheme.uuid,
      selectedIconTheme.icon,
      selectedIconTheme.meaning,
      journalEntry,
      null,
      createdAt
    );
    if (dbOperation.success) {
      setDailyEntryCount((prev) => prev + 1);
      if (isGameMode) {
        toast.success('🎉 Quest Complete! +20 XP', {
          icon: '⚔️',
          style: { background: '#0a0a0a', color: '#FFD700', border: '1px solid #FFD700' }
        });
        if (isNewEntry) {
          setTimeout(() => {
            setCurrentStep(1);
            setSelectedIconTheme('');
            setJournalEntry('');
          }, 1500);
        } else {
          setTimeout(() => navigate(`/dashboard-v2/${userId}`), 1500);
        }
      } else {
        toast.success('saved successfully!');
        if (isNewEntry) {
          setCurrentStep(1);
          setSelectedIconTheme('');
          setJournalEntry('');
        } else {
          navigate(`/home/${userId}`);
        }
      }
    } else {
      toast('something went wrong while saving the data');
    }
  };

  return (
    <QuestLayout questType="daily_journal" currentStep={currentStep} totalSteps={2}>
      <div className={`h-screen flex flex-col items-center justify-start gap-[10%] ${!isGameMode ? 'bg-bgpapyrus' : ''}`}>
        <div style={{width:"100vw"}}>
          {!isGameMode && <TopBar toggleMenu={toggleMenu} />}
          {isMenuOpen && (
            <div className="fixed inset-0 z-50">
              <Menu toggleMenu={toggleMenu} isDnDTheme={isGameMode} />
            </div>
          )}
          {!isGameMode && (
            <CalendarDateHeader
              currentDate={currentDate}
              onPrevClick={handlePrevClick}
              onNextClick={handleNextClick}
            />
          )}
        </div>
        
        {renderComponents()}

        <ToastContainer />
      </div>
    </QuestLayout>
  );
}
