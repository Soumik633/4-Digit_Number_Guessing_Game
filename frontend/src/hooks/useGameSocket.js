import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useGameSocket(roomId, playerId, playerName = '') {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastGuessResult, setLastGuessResult] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!roomId) return;

    // Connect to server
    const socket = io(window.location.origin, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setErrorMessage(null);
      // Automatically join room with name
      socket.emit('join_room', { room_id: roomId, player_id: playerId, player_name: playerName });
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('sync_state', (data) => {
      setGameState(data);
    });

    socket.on('player_joined', (data) => {
      setAnnouncement(`${data.name || 'Player B'} has joined the game!`);
      setTimeout(() => setAnnouncement(''), 4000);
    });

    socket.on('opponent_ready', () => {
      setAnnouncement('Opponent locked in their secret code!');
      setTimeout(() => setAnnouncement(''), 4000);
    });

    socket.on('game_started', (data) => {
      setAnnouncement(data.message || 'Game started! Codes are locked in!');
      setTimeout(() => setAnnouncement(''), 4000);
    });

    socket.on('guess_result', (data) => {
      setLastGuessResult(data);
    });

    socket.on('game_over', (data) => {
      setGameOverData(data);
    });

    socket.on('turn_error', (data) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 3500);
    });

    socket.on('validation_error', (data) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 3500);
    });

    socket.on('error_message', (data) => {
      setErrorMessage(data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    });

    socket.on('opponent_left', () => {
      setAnnouncement('Opponent disconnected.');
    });

    socket.on('game_restarted', () => {
      setGameOverData(null);
      setLastGuessResult(null);
      setAnnouncement('Game has been reset! Choose your secret code.');
      setTimeout(() => setAnnouncement(''), 4000);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, playerId]);

  const submitSecret = useCallback((secret) => {
    if (socketRef.current) {
      socketRef.current.emit('submit_secret', {
        room_id: roomId,
        player_id: playerId,
        secret,
      });
    }
  }, [roomId, playerId]);

  const submitGuess = useCallback((guess) => {
    if (socketRef.current) {
      socketRef.current.emit('submit_guess', {
        room_id: roomId,
        player_id: playerId,
        guess,
      });
    }
  }, [roomId, playerId]);

  const restartGame = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('restart_game', { room_id: roomId });
    }
  }, [roomId]);

  return {
    connected,
    gameState,
    errorMessage,
    announcement,
    lastGuessResult,
    gameOverData,
    submitSecret,
    submitGuess,
    restartGame,
  };
}
