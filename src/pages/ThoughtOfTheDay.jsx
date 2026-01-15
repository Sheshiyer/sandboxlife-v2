import { useState, useEffect, useRef } from 'react';
import CalendarDateHeader from '../components/CalendarDateHeader';
import Menu from '../components/Menu';
import TopBar from '../components/TopBar';
import IconSelectionWindow from '../components/IconSelectionWindow';
import { daily_journal_questions } from '../constants/questions';
import { JournalEntrySection } from '../components/JournalEntrySection';
import { insertJournalEntry } from '../utils/supabase';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '../context/GameModeContext';
import QuestLayout from '../components/game/QuestLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ThoughtOfTheDay() {
  const navigate = useNavigate();
  const { isGameMode } = useGameMode();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIconTheme, setSelectedIconTheme] = useState('');
  const [journalEntry, setJournalEntry] = useState('');
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
      // Skips setState on the first render
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

  function replacePrefixForThoughtOfTheDay(str) {
    if (str.startsWith('d_')) {
      return 't_' + str.slice(2);
    }
    return str;
  }
  const renderComponents = () => {
    switch (currentStep) {
      case 1:
        return (
          <IconSelectionWindow
            icons={daily_journal_questions}
            setSelectedIconTheme={setSelectedIconTheme}
            onSave={() => setCurrentStep(2)}
            onCancel={() => {}}
          />
        );
      case 2:
        return (
          <JournalEntrySection
            triggerQuestion={selectedIconTheme.trigger_question}
            triggerIcon={selectedIconTheme.icon}
            chapterEntry="Write your story here"
            onCancel={() => setCurrentStep(1)}
            saveToDb={() => saveToDb()}
            journalEntry={journalEntry}
            setJournalEntry={setJournalEntry}
            journalType="thought_of_the_day"
            entryDate={entryDate}
            setEntryDate={setEntryDate}
          />
        );

      default:
        return <div>Default component or message</div>;
    }
  };

  const saveToDb = async () => {
    const createdAt = new Date(`${entryDate}T12:00:00`).toISOString();
    const dbOperation = await insertJournalEntry(
      userId,
      'thought_of_the_day',
      replacePrefixForThoughtOfTheDay(selectedIconTheme.uuid),
      selectedIconTheme.icon,
      selectedIconTheme.meaning,
      journalEntry,
      null,
      createdAt
    );
    if (dbOperation.success) {
      if (isGameMode) {
        toast.success('🎉 Oracle Quest Complete! +20 XP', {
          icon: '✨',
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

  return (
    <QuestLayout questType="thought_of_the_day" currentStep={currentStep} totalSteps={2}>
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
