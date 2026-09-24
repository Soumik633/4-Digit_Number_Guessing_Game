import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bot, Sparkles, Volume2, VolumeX } from 'lucide-react';
import SecretEntry from '../components/SecretEntry';
import Dashboard from '../components/Dashboard';
import WinModal from '../components/WinModal';
import { playClickSound, playScoreFeedbackSound, toggleAudio, isAudioEnabled } from '../utils/audio';
import ThemeToggle from '../components/ThemeToggle';

// Precomputed 5,040 codes generator for client-side AI
function generateAllCodes() {
  const digits = ['0','1','2','3','4','5','6','7','8','9'];
  const res = [];
  function permute(current) {
    if (current.length === 4) {
      res.push(current.join(''));
      return;
    }
    for (let i = 0; i < digits.length; i++) {
      if (!current.includes(digits[i])) {
        current.push(digits[i]);
        permute(current);
        current.pop();
      }
    }
  }
  permute([]);
  return res;
}

const ALL_CODES = generateAllCodes();

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

export default function SinglePlayer({ difficulty = 'medium', playerName = 'Player A', onBackHome, theme = 'dark', onToggleTheme }) {
  const [phase, setPhase] = useState('setup'); // 'setup', 'playing', 'game_over'
  const [playerSecret, setPlayerSecret] = useState('');
  const [aiSecret, setAiSecret] = useState('');
  const [currentTurn, setCurrentTurn] = useState('A'); // 'A' or 'B'
  const [myGuesses, setMyGuesses] = useState([]);
  const [aiGuesses, setAiGuesses] = useState([]);
  const [gameOverData, setGameOverData] = useState(null);
  const [audioOn, setAudioOn] = useState(isAudioEnabled());

  // AI State
  const aiCandidatesRef = useRef([...ALL_CODES]);
  const aiPastGuessesRef = useRef(new Set());

  // Initialize Game
  useEffect(() => {
    // Generate AI Secret
    const rndCode = ALL_CODES[Math.floor(Math.random() * ALL_CODES.length)];
    setAiSecret(rndCode);
    aiCandidatesRef.current = [...ALL_CODES];
    aiPastGuessesRef.current = new Set();
  }, []);

  const handleLockSecret = (code) => {
    setPlayerSecret(code);
    setPhase('playing');
    setCurrentTurn('A');
  };

  // Player submits guess
  const handlePlayerGuess = (guess) => {
    if (currentTurn !== 'A' || phase !== 'playing') return;

    const feedback = calculateClue(guess, aiSecret);
    playScoreFeedbackSound(feedback.positions_matched, feedback.digits_matched);

    const newRecord = {
      index: myGuesses.length + 1,
      guess,
      digits_matched: feedback.digits_matched,
      positions_matched: feedback.positions_matched,
      status: feedback.status
    };

    const updatedMyGuesses = [...myGuesses, newRecord];
    setMyGuesses(updatedMyGuesses);

    if (feedback.is_win) {
      setPhase('game_over');
      setGameOverData({
        winner: 'A',
        winner_name: playerName || 'Player A',
        player_a_name: playerName || 'Player A',
        player_b_name: `Computer (${difficulty.toUpperCase()})`,
        player_a_secret: playerSecret,
        player_b_secret: aiSecret,
        total_guesses: updatedMyGuesses.length
      });
      return;
    }

    // Switch to AI Turn
    setCurrentTurn('B');
  };

  // AI Turn effect
  useEffect(() => {
    if (currentTurn !== 'B' || phase !== 'playing') return;

    const timer = setTimeout(() => {
      let aiGuess = '';

      if (difficulty === 'easy') {
        const available = ALL_CODES.filter(c => !aiPastGuessesRef.current.has(c));
        aiGuess = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : ALL_CODES[0];
      } else if (difficulty === 'medium') {
        const cands = aiCandidatesRef.current;
        aiGuess = cands.length > 0 ? cands[Math.floor(Math.random() * cands.length)] : ALL_CODES[0];
      } else {
        // Hard mode (Minimax)
        const cands = aiCandidatesRef.current;
        if (aiGuesses.length === 0) {
          aiGuess = '0123';
        } else if (cands.length <= 2) {
          aiGuess = cands[0];
        } else {
          // Fast sample Minimax
          const pool = cands.length <= 100 ? cands : cands.slice(0, 50);
          let bestGuess = cands[0];
          let minMax = Infinity;

          for (const candGuess of pool) {
            const counts = {};
            for (const testTarget of cands) {
              const res = calculateClue(candGuess, testTarget);
              const key = `${res.digits_matched},${res.positions_matched}`;
              counts[key] = (counts[key] || 0) + 1;
            }
            const worstCase = Math.max(...Object.values(counts));
            if (worstCase < minMax) {
              minMax = worstCase;
              bestGuess = candGuess;
            }
          }
          aiGuess = bestGuess;
        }
      }

      aiPastGuessesRef.current.add(aiGuess);
      const feedback = calculateClue(aiGuess, playerSecret);

      // Filter AI candidate pool based on feedback
      aiCandidatesRef.current = aiCandidatesRef.current.filter(cand => {
        const res = calculateClue(aiGuess, cand);
        return res.digits_matched === feedback.digits_matched && res.positions_matched === feedback.positions_matched;
      });

      const newRecord = {
        index: aiGuesses.length + 1,
        guess: aiGuess,
        digits_matched: feedback.digits_matched,
        positions_matched: feedback.positions_matched,
        status: feedback.status
      };

      const updatedAiGuesses = [...aiGuesses, newRecord];
      setAiGuesses(updatedAiGuesses);

      if (feedback.is_win) {
        setPhase('game_over');
        setGameOverData({
          winner: 'B',
          winner_name: `Computer (${difficulty.toUpperCase()})`,
          player_a_name: playerName || 'Player A',
          player_b_name: `Computer (${difficulty.toUpperCase()})`,
          player_a_secret: playerSecret,
          player_b_secret: aiSecret,
          total_guesses: updatedAiGuesses.length
        });
        return;
      }

      setCurrentTurn('A');
    }, 900);

    return () => clearTimeout(timer);
  }, [currentTurn, phase, difficulty, playerSecret, aiSecret, aiGuesses]);

  const handleRematch = () => {
    const rndCode = ALL_CODES[Math.floor(Math.random() * ALL_CODES.length)];
    setAiSecret(rndCode);
    aiCandidatesRef.current = [...ALL_CODES];
    aiPastGuessesRef.current = new Set();
    setMyGuesses([]);
    setAiGuesses([]);
    setPlayerSecret('');
    setGameOverData(null);
    setCurrentTurn('A');
    setPhase('setup');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px' }}>
      {/* Navigation */}
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
            <ArrowLeft size={18} /> Exit
          </button>

          <div style={{ height: '18px', width: '1px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={18} color="var(--pos-match)" />
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>
              Solo vs AI
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '999px',
              background: 'var(--pos-match-bg)',
              color: 'var(--pos-match)',
              border: '1px solid var(--pos-match-border)',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              {difficulty}
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
            title={audioOn ? "Mute sound" : "Unmute sound"}
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

      {phase === 'setup' ? (
        <SecretEntry
          onLockSecret={handleLockSecret}
          isLocked={Boolean(playerSecret)}
          playerColor="blue"
          secretCode={playerSecret}
        />
      ) : (
        <div>
          <div style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '14px'
          }}>
            🔒 <strong>Private View:</strong> Computer holds its secret code hidden until the hunt concludes.
          </div>

          <Dashboard
            playerRole="A"
            playerName={playerName}
            playerTitle="Human"
            secretCode={playerSecret}
            myGuesses={myGuesses}
            opponentGuesses={aiGuesses}
            isMyTurn={currentTurn === 'A'}
            opponentName={`Computer (${difficulty})`}
            onSubmitGuess={handlePlayerGuess}
            isGameOver={phase === 'game_over'}
            isWinner={gameOverData?.winner === 'A'}
          />
        </div>
      )}

      {/* Victory Modal */}
      <WinModal
        gameOverData={gameOverData}
        currentPlayerId="A"
        onRematch={handleRematch}
        onHome={onBackHome}
      />
    </div>
  );
}
