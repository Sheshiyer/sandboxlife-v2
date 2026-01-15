import { useState, useEffect, useRef } from 'react';
import CalendarDateHeader from '../components/CalendarDateHeader';
import Menu from '../components/Menu';
import TopBar from '../components/TopBar';
import IconSelectionWindow from '../components/IconSelectionWindow';
import { book_journal_questions } from '../constants/questions';
import { JournalEntrySection } from '../components/JournalEntrySection';
import { PearlsOfWisdomWindow } from '../components/PearlsOfWisdomWindow';
import { insertJournalEntry } from '../utils/supabase';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '../context/GameModeContext';
import QuestLayout from '../components/game/QuestLayout';
import 'react-toastify/dist/ReactToastify.css';

export default function BookJourney() {
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIconTheme, setSelectedIconTheme] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
  const [wisdomMessage, setWisdomMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  function getUserIdFromStorage() {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }

  useEffect(() => {
    getUserIdFromStorage();
  }, []);

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

  const saveToDb = async () => {
    const createdAt = new Date(`${entryDate}T12:00:00`).toISOString();
    const dbOperation = await insertJournalEntry(
      userId,
      selectedIconTheme.journal_type,
      selectedIconTheme.uuid,
      selectedIconTheme.icon,
      selectedIconTheme.meaning,
      journalEntry,
      wisdomMessage,
      createdAt
    );
    if (dbOperation.success) {
      if (isGameMode) {
        toast.success('🎉 Quest Complete! +20 XP', {
          icon: '⚔️',
          style: { background: '#0a0a0a', color: '#FFD700', border: '1px solid #FFD700' }
        });
        setTimeout(() => navigate(`/dashboard-v2/${userId}`), 1500);
      } else {
        toast.success('saved successfully!');
        navigate(`/home/${userId}`);
      }
    } else {
      toast('something went wrong while saving the data');
    }
  };
  const renderComponents = () => {
    switch (currentStep) {
      case 1:
        return (
          <IconSelectionWindow
            icons={book_journal_questions}
            setSelectedIconTheme={setSelectedIconTheme}
            onSave={() => setCurrentStep(2)}
            onCancel={() => {}}
          />
        );
      case 2:
        return (
          <JournalEntrySection
            triggerQuestion={selectedIconTheme.trigger_question[0]} 
            triggerIcon={selectedIconTheme.icon}
            chapterEntry="Write your story here"
            onCancel={() => setCurrentStep(1)}
            saveToDb={() => setCurrentStep(3)}
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            entryDate={entryDate}
            setEntryDate={setEntryDate}
          />
        );
      case 3:
        return (
          <PearlsOfWisdomWindow
            triggerQuestion={selectedIconTheme.trigger_question}
            triggerIcon={selectedIconTheme.icon}
            chapterEntry="Pearls of wisdom"
            onCancel={() => setCurrentStep(2)}
            onSave={() => saveToDb()}
            wisdomMessage={wisdomMessage}
            setWisdomMessage={setWisdomMessage}
          />
        );

      default:
        return <div>Default component or message</div>;
    }
  };

  return (
    <QuestLayout questType="book_journal" currentStep={currentStep} totalSteps={3}>
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
      <div className="flex-1 w-full px-4 md:px-8 py-6 flex justify-center">
        <div className={`w-full max-w-5xl rounded-3xl p-6 shadow-sm ${
          isGameMode 
            ? 'bg-slate-900/40 border border-yellow-500/20 backdrop-blur-sm' 
            : 'bg-lightpapyrus border border-darkpapyrus'
        }`}>
          {renderComponents()}
        </div>
      </div>
      <ToastContainer />
    </QuestLayout>
  );
}
