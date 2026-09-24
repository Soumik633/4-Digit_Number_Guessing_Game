import React, { useState } from 'react';
import { ArrowLeft, Split, Volume2, VolumeX } from 'lucide-react';
import Dashboard from '../components/Dashboard';
import WinModal from '../components/WinModal';
import { playClickSound, playScoreFeedbackSound, toggleAudio, isAudioEnabled } from '../utils/audio';
import ThemeToggle from '../components/ThemeToggle';

function calculateClue(guess, secret) {
  const secretSet = new Set(secret);
  let digitsMatched = 0;
  let positionsMatched = 0;
  for (let i = 0; i < 4; i++) {
    if (secretSet.has(guess[i])) digitsMatched++;
    if (guess[i] === secret[i]) positionsMatched++;
  }
  return {
    digits_matched: digitsMatched,
    positions_matched: positionsMatched,
    is_win: positionsMatched === 4,
    status: positionsMatched === 4 ? 'Found!' : 'Trying...'
  };
}

export default function DualView({ onBackHome, theme = 'dark', onToggleTheme }) {
  // Preset or custom codes matching reference mockup (Player A: 2580, Player B: 6307)
  const [secretA, setSecretA] = useState('2580');
  const [secretB, setSecretB] = useState('6307');
  const [currentTurn, setCurrentTurn] = useState('A');
  const [guessesA, setGuessesA] = useState([]);
  const [guessesB, setGuessesB] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [audioOn, setAudioOn] = useState(isAudioEnabled());

  const handleGuessA = (guess) => {
    if (currentTurn !== 'A' || gameOverData) return;
    const feedback = calculateClue(guess, secretB);
    playScoreFeedbackSound(feedback.positions_matched, feedback.digits_matched);

    const newRecord = {
      index: guessesA.length + 1,
      guess,
      digits_matched: feedback.digits_matched,
      positions_matched: feedback.positions_matched,
      status: feedback.status
    };

    const updated = [...guessesA, newRecord];
    setGuessesA(updated);

    if (feedback.is_win) {
      setGameOverData({
        winner: 'A',
        winner_name: 'Player A',
        player_a_name: 'Player A',
        player_b_name: 'Player B',
        player_a_secret: secretA,
        player_b_secret: secretB,
        total_guesses: updated.length
      });
      return;
    }
    setCurrentTurn('B');
  };

  const handleGuessB = (guess) => {
    if (currentTurn !== 'B' || gameOverData) return;
    const feedback = calculateClue(guess, secretA);
    playScoreFeedbackSound(feedback.positions_matched, feedback.digits_matched);

    const newRecord = {
      index: guessesB.length + 1,
      guess,
      digits_matched: feedback.digits_matched,
      positions_matched: feedback.positions_matched,
      status: feedback.status
    };

    const updated = [...guessesB, newRecord];
    setGuessesB(updated);

    if (feedback.is_win) {
      setGameOverData({
        winner: 'B',
        winner_name: 'Player B',
        player_a_name: 'Player A',
        player_b_name: 'Player B',
        player_a_secret: secretA,
        player_b_secret: secretB,
        total_guesses: updated.length
      });
      return;
    }
    setCurrentTurn('A');
  };

  const handleRematch = () => {
    setGuessesA([]);
    setGuessesB([]);
    setCurrentTurn('A');
    setGameOverData(null);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 20px 48px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 18px',
        background: 'var(--panel-inner-bg)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => {
              playClickSound();
              onBackHome();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--text-secondary)',
              fontSize: '0.88rem',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={18} /> Lobby
          </button>
          <div style={{ height: '18px', width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Split size={18} color="var(--player-a-accent)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
              Dual Side-by-Side View (Local Demo)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            onClick={() => {
              const s = toggleAudio();
              setAudioOn(s);
            }}
            style={{
              padding: '8px',
              borderRadius: '50%',
              background: 'var(--panel-inner-bg)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: '16px'
      }}>
        💡 <strong>Side-by-Side Presentation View:</strong> Both dashboards are shown together for local pass-and-play and layout testing.
      </div>

      {/* Side by side 2-column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(560px, 1fr))',
        gap: '24px'
      }}>
        {/* Player A Panel */}
        <Dashboard
          playerRole="A"
          playerName="Player A"
          playerTitle="Host"
          secretCode={secretA}
          myGuesses={guessesA}
          opponentGuesses={guessesB}
          isMyTurn={currentTurn === 'A'}
          opponentName="Player B"
          onSubmitGuess={handleGuessA}
          isGameOver={Boolean(gameOverData)}
          isWinner={gameOverData?.winner === 'A'}
        />

        {/* Player B Panel */}
        <Dashboard
          playerRole="B"
          playerName="Player B"
          playerTitle="Joiner"
          secretCode={secretB}
          myGuesses={guessesB}
          opponentGuesses={guessesA}
          isMyTurn={currentTurn === 'B'}
          opponentName="Player A"
          onSubmitGuess={handleGuessB}
          isGameOver={Boolean(gameOverData)}
          isWinner={gameOverData?.winner === 'B'}
        />
      </div>

      <WinModal
        gameOverData={gameOverData}
        currentPlayerId={gameOverData?.winner}
        onRematch={handleRematch}
        onHome={onBackHome}
      />
    </div>
  );
}
