import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function TurnBanner({ isMyTurn, opponentName = 'Opponent', isGameOver = false }) {
  if (isGameOver) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem',
        fontWeight: '600'
      }}>
        Game Finished
      </div>
    );
  }

  if (isMyTurn) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 16px',
        borderRadius: '12px',
        background: 'rgba(57, 255, 136, 0.15)',
        border: '1px solid rgba(57, 255, 136, 0.5)',
        boxShadow: '0 0 16px rgba(57, 255, 136, 0.25)',
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: 'var(--pos-match)',
          boxShadow: '0 0 8px var(--pos-match)'
        }} />
        <div>
          <div style={{ color: 'var(--pos-match)', fontWeight: '700', fontSize: '0.9rem', fontFamily: 'var(--font-heading)' }}>
            Your Turn
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
            It's your turn to make a guess!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 16px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid var(--border-subtle)',
    }}>
      <Clock size={16} color="var(--text-secondary)" />
      <div>
        <div style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.88rem' }}>
          Waiting for {opponentName}...
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
          Please wait, it's not your turn yet.
        </div>
      </div>
    </div>
  );
}
