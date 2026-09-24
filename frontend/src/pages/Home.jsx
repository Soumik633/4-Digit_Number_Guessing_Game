import React, { useState } from 'react';
import { Crown, Target, Users, Bot, BookOpen, Copy, Check, Sparkles, ArrowRight, Play, Volume2, VolumeX, User, LogIn } from 'lucide-react';
import { createRoom } from '../api';
import { playClickSound, toggleAudio, isAudioEnabled } from '../utils/audio';
import ThemeToggle from '../components/ThemeToggle';

export default function Home({ onStartGame, onStartSinglePlayer, onStartLocalDual, onOpenJoinModal, theme = 'dark', onToggleTheme }) {
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [createdRoomLink, setCreatedRoomLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [audioOn, setAudioOn] = useState(isAudioEnabled());
  const [hostName, setHostName] = useState('');
  const [soloName, setSoloName] = useState('');
  const [manualRoomCode, setManualRoomCode] = useState('');

  const handleCreateRoom = async (e) => {
    if (e) e.preventDefault();
    playClickSound();
    setLoading(true);
    const chosenName = hostName.trim() || 'Host';
    try {
      const res = await createRoom('multiplayer', selectedDifficulty, chosenName);
      const fullLink = `${window.location.origin}/join/${res.room_id}`;
      setCreatedRoomLink(fullLink);
      onStartGame(res.room_id, 'A', chosenName);
    } catch (err) {
      alert(err.message || 'Error creating game room');
    } finally {
      setLoading(false);
    }
  };

  const handleManualJoin = (e) => {
    if (e) e.preventDefault();
    const cleanCode = manualRoomCode.trim().toUpperCase();
    if (!cleanCode) return;
    playClickSound();
    if (onOpenJoinModal) {
      onOpenJoinModal(cleanCode);
    }
  };

  const handlePlayVsComputer = (e) => {
    if (e) e.preventDefault();
    playClickSound();
    const chosenName = soloName.trim() || 'Player 1';
    onStartSinglePlayer(selectedDifficulty, chosenName);
  };

  const handleToggleSound = () => {
    const newState = toggleAudio();
    setAudioOn(newState);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 48px' }}>
      {/* Top Title Banner */}
      <header style={{
        background: 'var(--header-bg)',
        border: '1.5px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '28px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        gap: '24px',
        boxShadow: 'var(--shadow-card)',
      }}>
        {/* Left: Crown & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(245, 158, 11, 0.4)',
          }}>
            <Crown size={30} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Two Players,
            </div>
            <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-accent)', lineHeight: 1.2 }}>
              One Brain Game
            </div>
          </div>
        </div>

        {/* Center: Main Logo & Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            letterSpacing: '1px',
            color: 'var(--text-primary)',
            marginBottom: '4px',
            textShadow: theme === 'dark' ? '0 0 30px rgba(56, 189, 248, 0.4)' : 'none',
          }}>
            Number Hunt
          </h1>
          <div style={{
            fontFamily: 'var(--font-subheading)',
            fontSize: '1.15rem',
            color: 'var(--text-accent)',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            4-Digit Number Guessing Game
          </div>
          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', letterSpacing: '1px' }}>
            Think • Guess • Find • Win!
          </div>
        </div>

        {/* Right: Rules Validation Badge, Audio Toggle & Dark/Light Mode Switcher */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Theme Toggle Button */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              onClick={handleToggleSound}
              title={audioOn ? "Mute sound" : "Unmute sound"}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                background: 'var(--panel-inner-bg)',
                border: '1.5px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: '600'
              }}
            >
              {audioOn ? <Volume2 size={15} color="var(--pos-match)" /> : <VolumeX size={15} />}
              {audioOn ? 'Sound ON' : 'Muted'}
            </button>
          </div>

          <div style={{
            background: 'var(--panel-inner-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)'
          }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '700' }}>
              4 Unique Digits (0–9)
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--pos-match)' }}>2580 ✅</span>
              <span style={{ color: 'var(--no-match)' }}>1123 ❌</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main 3 Feature Cards (Play Online, Play Computer, Rules) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* CARD 1: Play with a Friend (Online) */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={22} color="var(--player-a-accent)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Play with a Friend (Online)</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Create a game and share the link with your friend!
              </p>
            </div>
          </div>

          {/* Steps list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px', flex: 1 }}>
            {[
              "Player A creates a game (Host).",
              "A shareable invite link is generated.",
              "Share the link with Player B.",
              "Player B joins using the link & play live!"
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: 'var(--player-a-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {idx + 1}
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Host Name Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              fontWeight: '600'
            }}>
              <User size={14} color="var(--player-a-accent)" />
              Your Name (Host):
            </label>
            <input
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={15}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Action button */}
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #2563eb, #0284c7)',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
            }}
          >
            <Users size={18} /> {loading ? 'Creating...' : 'Host Game & Get Link'}
          </button>

          {/* Or join with room code */}
          <div style={{
            margin: '16px 0 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span>or join with code</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleManualJoin} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={manualRoomCode}
              onChange={(e) => setManualRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              maxLength={8}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-subtle)',
                color: '#38BDF8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.88rem',
                letterSpacing: '2px',
                textAlign: 'center',
                textTransform: 'uppercase',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="submit"
              disabled={!manualRoomCode.trim()}
              style={{
                padding: '9px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38BDF8',
                fontSize: '0.82rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: !manualRoomCode.trim() ? 'not-allowed' : 'pointer',
                opacity: !manualRoomCode.trim() ? 0.5 : 1,
              }}
            >
              <LogIn size={14} /> Join
            </button>
          </form>
        </div>

        {/* CARD 2: Play with Computer (Single Player) */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(57, 255, 136, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(57, 255, 136, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot size={22} color="var(--pos-match)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Play with Computer (Solo)</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Play against an AI that will try to find your number!
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>
              Select Difficulty:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'easy', label: 'Easy', desc: 'Random guesses' },
                { id: 'medium', label: 'Medium', desc: 'Smarter guesses' },
                { id: 'hard', label: 'Hard', desc: 'Advanced logic' },
              ].map((tier) => {
                const isSelected = selectedDifficulty === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedDifficulty(tier.id);
                    }}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(57, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1.5px solid ${isSelected ? 'var(--pos-match)' : 'var(--border-subtle)'}`,
                      textAlign: 'center',
                    }}
                  >
                    <div style={{
                      fontWeight: '700',
                      fontSize: '0.88rem',
                      color: isSelected ? 'var(--pos-match)' : 'var(--text-primary)',
                      marginBottom: '2px'
                    }}>
                      {tier.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {tier.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px' }}>
            {selectedDifficulty === 'easy' && 'Easy AI picks random unique digits without checking past clues.'}
            {selectedDifficulty === 'medium' && 'Medium AI filters out impossible numbers using past clue feedback.'}
            {selectedDifficulty === 'hard' && 'Hard AI uses Donald Knuth Minimax algorithm to solve within 5 guesses!'}
          </div>

          {/* Solo Player Name Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              fontWeight: '600'
            }}>
              <User size={14} color="var(--pos-match)" />
              Your Name:
            </label>
            <input
              type="text"
              value={soloName}
              onChange={(e) => setSoloName(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={15}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(57, 255, 136, 0.3)',
                color: '#FFFFFF',
                fontSize: '0.9rem',
                outline: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handlePlayVsComputer}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #15803d, #16a34a)',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
            }}
          >
            <Play size={18} /> Play vs Computer
          </button>
        </div>

        {/* CARD 3: Game Rules */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255, 210, 63, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 210, 63, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BookOpen size={22} color="var(--digit-match)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Game Rules</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Bulls & Cows / Mastermind code-breaking
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1 }}>
            <div><strong>1. Secret Code:</strong> Choose 4 non-repeated digits (0–9). Leading zeros allowed.</div>
            <div><strong>2. Alternating Turns:</strong> Players take turns guessing the opponent's secret code.</div>
            <div><strong>3. Two Clues Revealed:</strong></div>
            <div style={{ paddingLeft: '12px' }}>
              • <strong style={{ color: 'var(--digit-match)' }}>Digits Match:</strong> Digits anywhere in the secret.<br/>
              • <strong style={{ color: 'var(--pos-match)' }}>Positions Match:</strong> Digits in the exact right spot.
            </div>
            <div><strong>4. Win Condition:</strong> First to reach <strong>Positions Match = 4</strong> wins!</div>
          </div>

          {/* Footer Motto */}
          <div style={{
            background: 'rgba(255, 210, 63, 0.08)',
            border: '1px solid rgba(255, 210, 63, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--digit-match)',
            fontWeight: '600',
          }}>
            🏆 Use Logic • Analyze • Keep Guessing • Can you crack it?
          </div>
        </div>
      </div>

      {/* Dual Side-by-Side Local Play Button */}
      <div style={{
        textAlign: 'center',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--border-subtle)'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginRight: '12px' }}>
          Playing on the same screen or demoing?
        </span>
        <button
          onClick={onStartLocalDual}
          style={{
            padding: '8px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-active)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          🎮 Launch Local Dual-Dashboard Mode
        </button>
      </div>
    </div>
  );
}
