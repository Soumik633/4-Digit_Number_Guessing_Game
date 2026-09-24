import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import GameRoom from './pages/GameRoom';
import SinglePlayer from './pages/SinglePlayer';
import DualView from './pages/DualView';
import JoinModal from './components/JoinModal';

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'game', 'solo', 'dual'
  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('A');
  const [playerName, setPlayerName] = useState('Player A');
  const [aiDifficulty, setAiDifficulty] = useState('medium');
  const [pendingJoinRoomId, setPendingJoinRoomId] = useState('');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('digit_duel_theme') || 'dark';
  });

  // Apply theme to HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('digit_duel_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check URL path or query params for join link: /join/:roomId or ?room=:roomId
  useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room') || urlParams.get('join');

    let detectedRoomId = null;
    if (path.startsWith('/join/')) {
      detectedRoomId = path.replace('/join/', '').trim().toUpperCase();
    } else if (roomParam) {
      detectedRoomId = roomParam.trim().toUpperCase();
    }

    if (detectedRoomId) {
      // Trigger joiner name entry popup instead of auto-joining blindly
      setPendingJoinRoomId(detectedRoomId);
    }
  }, []);

  const handleStartGame = (newRoomId, newPlayerId = 'A', name = 'Host') => {
    setRoomId(newRoomId);
    setPlayerId(newPlayerId);
    setPlayerName(name);
    setView('game');
    window.history.pushState({}, '', `/join/${newRoomId}`);
  };

  const handleStartSinglePlayer = (difficulty = 'medium', name = 'Player 1') => {
    setAiDifficulty(difficulty);
    setPlayerName(name);
    setView('solo');
  };

  const handleStartLocalDual = () => {
    setView('dual');
  };

  const handleBackHome = () => {
    setView('home');
    setRoomId('');
    setPendingJoinRoomId('');
    window.history.pushState({}, '', '/');
  };

  const handleJoinSuccess = (joinedRoomId, enteredName) => {
    setRoomId(joinedRoomId);
    setPlayerId('B');
    setPlayerName(enteredName);
    setPendingJoinRoomId('');
    setView('game');
    window.history.pushState({}, '', `/join/${joinedRoomId}`);
  };

  const handleCancelJoin = () => {
    setPendingJoinRoomId('');
    window.history.pushState({}, '', '/');
  };

  return (
    <div className="app-container">
      {view === 'home' && (
        <Home
          onStartGame={handleStartGame}
          onStartSinglePlayer={handleStartSinglePlayer}
          onStartLocalDual={handleStartLocalDual}
          onOpenJoinModal={(code) => setPendingJoinRoomId(code)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'game' && (
        <GameRoom
          roomId={roomId}
          playerId={playerId}
          playerName={playerName}
          onBackHome={handleBackHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'solo' && (
        <SinglePlayer
          difficulty={aiDifficulty}
          playerName={playerName}
          onBackHome={handleBackHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {view === 'dual' && (
        <DualView
          onBackHome={handleBackHome}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Joiner Name Entry Popup */}
      {pendingJoinRoomId && (
        <JoinModal
          roomId={pendingJoinRoomId}
          onJoinSuccess={handleJoinSuccess}
          onCancel={handleCancelJoin}
        />
      )}
    </div>
  );
}

