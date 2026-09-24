import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, Award, Target, CheckCircle2 } from 'lucide-react';
import { playWinSound, playClickSound } from '../utils/audio';

function getRankTitle(guesses) {
  if (guesses <= 3) return { title: 'Psychic Mastermind', desc: 'Flawless lightning deduction!', icon: '⚡' };
  if (guesses <= 5) return { title: 'Grandmaster Codebreaker', desc: 'Mathematical genius level!', icon: '🏆' };
  if (guesses <= 7) return { title: 'Elite Deduction Sleuth', desc: 'Sharp logical pruning!', icon: '🔍' };
  return { title: 'Unyielding Code Victor', desc: 'Determined persistence cracked the lock!', icon: '🎯' };
}

export default function WinModal({
  gameOverData,
  currentPlayerId = 'A',
  onRematch,
  onHome,
}) {
  if (!gameOverData) return null;

  const {
    winner,
    winner_name,
    player_a_name,
    player_b_name,
    player_a_secret,
    player_b_secret,
    total_guesses,
  } = gameOverData;
  const isCurrentPlayerWinner = winner === currentPlayerId;
  const nameA = player_a_name || 'Player A';
  const nameB = player_b_name || 'Player B';
  const winnerTitle = winner_name || (winner === 'A' ? nameA : nameB);
  const rank = getRankTitle(total_guesses || 1);
  const crackedCode = winner === 'A' ? player_b_secret : player_a_secret;

  useEffect(() => {
    playWinSound();

    // Multi-stage confetti cannon celebration
    try {
      // Immediate blast
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#39FF88', '#38BDF8', '#FFD23F', '#FF4F6E']
      });

      // Left cannon
      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#FFD23F', '#39FF88', '#F59E0B']
        });
      }, 300);

      // Right cannon
      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#38BDF8', '#818CF8', '#C084FC']
        });
      }, 600);

      // Grand finale shower
      const timer3 = setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
          decay: 0.92,
          scalar: 1.2
        });
      }, 1000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } catch (err) {
      // Graceful confetti fallback
    }
  }, [winner]);

  const crackedDigits = (crackedCode || '----').padEnd(4, '-').slice(0, 4).split('');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 8, 18, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div
        className="animate-pop"
        style={{
          background: 'linear-gradient(180deg, #161a36, #101226)',
          border: '2px solid rgba(255, 210, 63, 0.6)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 28px',
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 60px rgba(255, 210, 63, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Top Winning Moment Ribbon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 20px',
          borderRadius: '999px',
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.25), rgba(57, 255, 136, 0.25))',
          border: '1px solid rgba(255, 210, 63, 0.5)',
          color: '#FFD23F',
          fontSize: '0.85rem',
          fontWeight: '800',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '20px',
          boxShadow: '0 0 20px rgba(255, 210, 63, 0.3)',
        }}>
          <Sparkles size={16} /> The Winning Moment <Sparkles size={16} />
        </div>

        {/* Bouncing Crown / Trophy */}
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 210, 63, 0.3) 0%, rgba(255, 210, 63, 0.05) 70%)',
          border: '2px solid #FFD23F',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 30px rgba(255, 210, 63, 0.5)',
        }}>
          <Trophy size={42} color="#FFD23F" className="animate-crown" />
        </div>

        {/* Winner Announcement Header */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2rem',
          color: '#FFFFFF',
          marginBottom: '6px',
          letterSpacing: '0.5px',
        }}>
          <span style={{ color: '#FFD23F' }}>{winnerTitle}</span> Wins!
        </h2>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '8px',
          background: 'rgba(57, 255, 136, 0.15)',
          border: '1px solid rgba(57, 255, 136, 0.4)',
          color: 'var(--pos-match)',
          fontSize: '0.88rem',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          <span>{rank.icon}</span>
          <span>{rank.title}</span>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>• {rank.desc}</span>
        </div>

        {/* The Cracked Code Showcase */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(57, 255, 136, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 16px',
          marginBottom: '24px',
          position: 'relative',
        }}>
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--pos-match)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <Target size={15} /> Code Cracked in {total_guesses} {total_guesses === 1 ? 'Guess' : 'Guesses'}!
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
            {crackedDigits.map((digit, i) => (
              <div
                key={i}
                className="animate-flip"
                style={{
                  width: '54px',
                  height: '64px',
                  borderRadius: '10px',
                  background: 'rgba(57, 255, 136, 0.2)',
                  border: '2px solid var(--pos-match)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.2rem',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  boxShadow: '0 0 20px rgba(57, 255, 136, 0.35)',
                }}
              >
                {digit}
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)' }}>
            4 Positions Matched • 4 Digits Matched ✅
          </div>
        </div>

        {/* Both Player Secrets Revealed Side-by-Side */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px',
          marginBottom: '26px',
        }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: '700' }}>
            Final Codes Comparison
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(37, 99, 235, 0.15)',
              border: '1px solid var(--player-a-accent)',
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--player-a-accent)', fontWeight: '700', marginBottom: '4px' }}>
                {nameA} Secret {winner === 'A' ? '👑' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '4px', color: '#FFFFFF' }}>
                {player_a_secret || '????'}
              </div>
            </div>

            <div style={{
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(225, 29, 72, 0.15)',
              border: '1px solid var(--player-b-accent)',
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--player-b-accent)', fontWeight: '700', marginBottom: '4px' }}>
                {nameB} Secret {winner === 'B' ? '👑' : ''}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '4px', color: '#FFFFFF' }}>
                {player_b_secret || '????'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              playClickSound();
              onRematch();
            }}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #2563eb, #0284c7)',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
            }}
          >
            <RotateCcw size={18} /> Play Rematch
          </button>

          <button
            onClick={() => {
              playClickSound();
              onHome();
            }}
            style={{
              padding: '14px 22px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={18} /> Lobby
          </button>
        </div>
      </div>
    </div>
  );
}
