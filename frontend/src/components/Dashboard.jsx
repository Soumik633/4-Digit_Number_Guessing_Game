import React, { useState } from 'react';
import { Eye, EyeOff, Target } from 'lucide-react';
import TurnBanner from './TurnBanner';
import PlayerColumn from './PlayerColumn';
import OpponentColumn from './OpponentColumn';
import GuessInput from './GuessInput';

export default function Dashboard({
  playerRole = 'A', // 'A' or 'B'
  playerName = 'Player A',
  playerTitle = 'Host',
  secretCode = '----',
  myGuesses = [],
  opponentGuesses = [],
  isMyTurn = false,
  opponentName = 'Opponent',
  onSubmitGuess,
  isGameOver = false,
  isWinner = false,
}) {
  const [showSecret, setShowSecret] = useState(true);

  const isPlayerA = playerRole === 'A';
  const themeAccent = isPlayerA ? 'var(--player-a-accent)' : 'var(--player-b-accent)';
  const themePrimary = isPlayerA ? 'var(--player-a-primary)' : 'var(--player-b-primary)';
  const turnPulseClass = isWinner
    ? 'winner-dashboard-gold'
    : isMyTurn && !isGameOver
      ? (isPlayerA ? 'pulse-turn-a' : 'pulse-turn-b')
      : '';

  const secretDigits = (secretCode || '----').padEnd(4, '-').slice(0, 4).split('');

  return (
    <div
      className={turnPulseClass}
      style={{
        background: isPlayerA ? 'var(--bg-panel-a)' : 'var(--bg-panel-b)',
        borderRadius: 'var(--radius-lg)',
        border: isWinner
          ? '2.5px solid #FFD23F'
          : `2px solid ${isMyTurn ? themeAccent : (isPlayerA ? 'var(--panel-border-a)' : 'var(--panel-border-b)')}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: isWinner
          ? '0 0 35px rgba(255, 210, 63, 0.45)'
          : isMyTurn
            ? (isPlayerA ? 'var(--shadow-glow-a)' : 'var(--shadow-glow-b)')
            : 'var(--shadow-card)',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px',
      }}>
        {/* Player Profile & Role */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isWinner
              ? 'linear-gradient(135deg, #f59e0b, #eab308)'
              : isPlayerA
                ? 'linear-gradient(135deg, #1d4ed8, #0284c7)'
                : 'linear-gradient(135deg, #e11d48, #be123c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1.3rem',
            fontFamily: 'var(--font-heading)',
            color: isWinner ? '#0B0C1A' : '#FFFFFF',
            boxShadow: isWinner ? '0 0 18px #FFD23F' : '0 4px 12px rgba(0,0,0,0.25)',
          }}>
            {isWinner ? '👑' : playerRole}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.15rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {playerName}
              </span>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '6px',
                background: isWinner ? 'rgba(255, 210, 63, 0.25)' : (isPlayerA ? 'rgba(56, 189, 248, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
                color: isWinner ? '#FFD23F' : themeAccent,
                fontWeight: '700',
                border: `1px solid ${isWinner ? 'rgba(255, 210, 63, 0.4)' : (isPlayerA ? 'rgba(56, 189, 248, 0.3)' : 'rgba(244, 63, 94, 0.3)')}`
              }}>
                {isWinner ? '🏆 WINNER' : playerTitle}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isWinner ? 'Cracked the opponent code!' : `Find ${opponentName}'s 4-digit code!`}
            </div>
          </div>
        </div>

        {/* Turn Status Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <Target size={14} color={themeAccent} /> Find {opponentName}'s number!
          </div>
          <TurnBanner isMyTurn={isMyTurn} opponentName={opponentName} isGameOver={isGameOver} />
        </div>
      </div>

      {/* Upper Area: Secret Number & My Guesses Table */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 240px) 1fr',
        gap: '16px',
      }}>
        {/* Secret Number Panel */}
        <div style={{
          background: 'var(--panel-inner-bg)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '12px',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>
              Your Secret Code
            </span>
            <button
              onClick={() => setShowSecret(!showSecret)}
              title={showSecret ? "Mask secret code" : "Reveal secret code"}
              style={{ color: 'var(--text-muted)', padding: '2px', cursor: 'pointer' }}
            >
              {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Large Digit Tiles */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {secretDigits.map((d, i) => (
              <div
                key={i}
                style={{
                  width: '44px',
                  height: '56px',
                  borderRadius: '10px',
                  background: isPlayerA ? 'var(--secret-tile-bg-a)' : 'var(--secret-tile-bg-b)',
                  border: `2px solid ${themeAccent}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.7rem',
                  fontWeight: '900',
                  color: showSecret ? 'var(--secret-digit-color)' : 'var(--text-muted)',
                  boxShadow: `0 4px 12px ${isPlayerA ? 'rgba(37, 99, 235, 0.2)' : 'rgba(225, 29, 72, 0.2)'}`,
                }}
              >
                {showSecret ? d : '•'}
              </div>
            ))}
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px', fontWeight: '500' }}>
            🔒 Hidden from opponent
          </span>
        </div>

        {/* My Guesses Table */}
        <PlayerColumn guesses={myGuesses} opponentName={opponentName} />
      </div>

      {/* Lower Area: Opponent's Guesses at My Number */}
      <OpponentColumn guesses={opponentGuesses} opponentName={opponentName} />

      {/* Input Action Form */}
      <GuessInput
        onSubmitGuess={onSubmitGuess}
        isMyTurn={isMyTurn}
        disabled={isGameOver}
        playerTheme={isPlayerA ? 'blue' : 'red'}
      />
    </div>
  );
}
