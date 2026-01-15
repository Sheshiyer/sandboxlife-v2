import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const GameModeContext = createContext();

export function GameModeProvider({ children }) {
  const [isGameMode, setIsGameMode] = useState(false);
  const [lastRoute, setLastRoute] = useState(null);

  // Detect if user is in game mode based on route or session
  useEffect(() => {
    const checkGameMode = () => {
      const currentPath = window.location.pathname;
      const fromDashboardV2 = 
        currentPath.includes('/dashboard-v2/') || 
        sessionStorage.getItem('gameMode') === 'true';
      
      setIsGameMode(fromDashboardV2);
    };

    checkGameMode();
    window.addEventListener('popstate', checkGameMode);
    return () => window.removeEventListener('popstate', checkGameMode);
  }, []);

  const enableGameMode = () => {
    setIsGameMode(true);
    sessionStorage.setItem('gameMode', 'true');
  };

  const disableGameMode = () => {
    setIsGameMode(false);
    sessionStorage.removeItem('gameMode');
  };

  return (
    <GameModeContext.Provider value={{ 
      isGameMode, 
      enableGameMode, 
      disableGameMode,
      lastRoute,
      setLastRoute 
    }}>
      {children}
    </GameModeContext.Provider>
  );
}

GameModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
};
