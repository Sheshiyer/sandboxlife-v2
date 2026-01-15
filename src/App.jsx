import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import BookJourney from "./pages/BookJourney";
import DailyJournal from "./pages/DailyJournal";
import ThoughtOfTheDay from "./pages/ThoughtOfTheDay";
import MyBook from "./pages/MyBook";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import SetBCollection from "./pages/SetBCollection";
import DashboardV2 from "./pages/DashboardV2";
import ComponentShowcase from "./pages/ComponentShowcase";
import ProtectedRoute from "./components/ProtectedRoute";
import InboxPage from "./pages/InboxPage";
import ConversationPage from "./pages/ConversationPage";
import FriendsPage from "./pages/FriendsPage";
import UserProfilePage from "./pages/UserProfilePage";

import MyCalendar from "./pages/MyCalendar";
import { useState } from "react";
import { Context } from "./utils/context";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { GameModeProvider } from "./context/GameModeContext";

function App() {
  const [context, setContext] = useState("");

  return (
    <AccessibilityProvider>
      <GameModeProvider>
        <BrowserRouter>
          <Context.Provider value={[context, setContext]}>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route path="/home/:userId" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/my-book/:userId" element={<ProtectedRoute><MyBook /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/settings/:userId" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/chat/:userId" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
          <Route path="/inbox/:userId" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/inbox/:userId/global" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
          <Route path="/inbox/:userId/chat/:conversationId" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
          <Route path="/friends/:userId" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>} />
          <Route path="/user/:profileId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/my-calendar/:userId" element={<ProtectedRoute><MyCalendar /></ProtectedRoute>} />
          <Route path="/set-b-collection/:userId" element={<ProtectedRoute><SetBCollection /></ProtectedRoute>} />
          <Route path="/dashboard-v2/:userId" element={<ProtectedRoute><DashboardV2 /></ProtectedRoute>} />
          <Route path="/component-showcase/:userId" element={<ProtectedRoute><ComponentShowcase /></ProtectedRoute>} />
          <Route path="/bookjourney" element={<ProtectedRoute><BookJourney /></ProtectedRoute>} />
          <Route path="/dailyjournal" element={<ProtectedRoute><DailyJournal /></ProtectedRoute>} />
          <Route path="/thoughtoftheday" element={<ProtectedRoute><ThoughtOfTheDay /></ProtectedRoute>} />
          </Routes>
        </Context.Provider>
      </BrowserRouter>
      </GameModeProvider>
    </AccessibilityProvider>
  );
}

export default App;
