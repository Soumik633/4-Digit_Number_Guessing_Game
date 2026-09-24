import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Share2, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { useGameSocket } from '../hooks/useGameSocket';
import SecretEntry from '../components/SecretEntry';
import Dashboard from '../components/Dashboard';
import WinModal from '../components/WinModal';
import { playClickSound, toggleAudio, isAudioEnabled } from '../utils/audio';
import ThemeToggle from '../components/ThemeToggle';

export default function GameRoom({ roomId, playerId = 'A', playerName = 'Player A', onBackHome, theme = 'dark', onToggleTheme }) {
  const {
    connected,
    gameState,
    errorMessage,
    announcement,
    gameOverData,
    submitSecret,
    submitGuess,
    restartGame,
  } = useGameSocket(roomId, playerId, playerName);

  const [copied, setCopied] = useState(false);
  const [audioOn, setAudioOn] = useState(isAudioEnabled());

  const handleCopyLink = () => {
    playClickSound();
    const shareUrl = `${window.location.origin}/join/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPlayerA = playerId === 'A';
  const myActualName = isPlayerA
    ? (gameState?.player_a_name || playerName || 'Host')
    : (gameState?.player_b_name || playerName || 'Joiner');
  const opponentActualName = isPlayerA
    ? (gameState?.player_b_name || 'Opponent')
    : (gameState?.player_a_name || 'Host');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 20px 48px' }}>
      {/* Top Navigation Bar */}
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
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Room:</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: '800',
              letterSpacing: '2px',
              color: 'var(--player-a-accent)',
              fontSize: '1rem',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {roomId}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: '600',
            color: connected ? 'var(--pos-match)' : 'var(--no-match)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: connected ? 'var(--pos-match)' : 'var(--no-match)'
            }} />
            {connected ? 'Live' : 'Connecting...'}
          </div>
        </div>

        {/* Share Link, Audio Controls & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: copied ? 'rgba(57, 255, 136, 0.2)' : 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${copied ? 'var(--pos-match)' : 'rgba(56, 189, 248, 0.4)'}`,
              color: copied ? 'var(--pos-match)' : 'var(--player-a-accent)',
              fontSize: '0.82rem',
              fontWeight: '600'
            }}
          >
            {copied ? <Check size={15} /> : <Share2 size={15} />}
            {copied ? 'Link Copied!' : 'Share Room Link'}
          </button>

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

      {/* Announcements / Errors */}
      {announcement && (
        <div className="animate-row" style={{
          padding: '10px 16px',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--player-a-accent)',
          fontSize: '0.88rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          📢 {announcement}
        </div>
      )}

      {errorMessage && (
        <div className="animate-shake" style={{
          padding: '10px 16px',
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--no-match)',
          fontSize: '0.88rem',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Content according to game phase */}
      {(!gameState || gameState.status === 'waiting') && isPlayerA && (
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '40px 24px',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)',
          maxWidth: '540px',
          margin: '40px auto',
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '10px' }}>
            Waiting for Opponent to Join...
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
            Send this invite link to your opponent. As soon as they enter their name and join, the hunt begins!
          </p>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            border: '1px solid var(--border-subtle)',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
          }}>
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/join/${roomId}`}
              style={{
                background: 'transparent',
                border: 'none',
                flex: 1,
                fontSize: '0.85rem',
                color: '#FFFFFF'
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'var(--player-a-primary)',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {gameState && gameState.status === 'setup' && (
        <div>
          <SecretEntry
            onLockSecret={submitSecret}
            isLocked={Boolean(gameState.my_secret)}
            playerColor={isPlayerA ? 'blue' : 'red'}
            secretCode={gameState.my_secret}
          />
        </div>
      )}

      {gameState && (gameState.status === 'playing' || gameState.status === 'game_over') && (
        <div>
          {/* Note disclaimer as shown in reference design */}
          <div style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: '14px'
          }}>
            🔒 <strong>Private View:</strong> You only see your own secret code. Opponent's code remains completely masked until game over.
          </div>

          <Dashboard
            playerRole={playerId}
            playerName={myActualName}
            playerTitle={isPlayerA ? 'Host' : 'Joiner'}
            secretCode={gameState.my_secret || '----'}
            myGuesses={gameState.my_guesses || []}
            opponentGuesses={gameState.opponent_guesses || []}
            isMyTurn={gameState.is_my_turn}
            opponentName={opponentActualName}
            onSubmitGuess={submitGuess}
            isGameOver={gameState.status === 'game_over'}
            isWinner={gameState.winner === playerId}
          />
        </div>
      )}

      {/* Victory Modal */}
      <WinModal
        gameOverData={gameOverData ? {
          ...gameOverData,
          player_a_name: gameOverData.player_a_name || gameState?.player_a_name || (isPlayerA ? playerName : 'Player A'),
          player_b_name: gameOverData.player_b_name || gameState?.player_b_name || (!isPlayerA ? playerName : 'Player B')
        } : null}
        currentPlayerId={playerId}
        onRematch={restartGame}
        onHome={onBackHome}
      />
    </div>
  );
}
