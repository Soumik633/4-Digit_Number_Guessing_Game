import React from 'react';
import { Shield } from 'lucide-react';

export default function OpponentColumn({ guesses = [], opponentName = "Opponent" }) {
  return (
    <div style={{
      background: 'var(--panel-inner-bg)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '220px',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        padding: '10px 14px',
        background: 'var(--table-head-bg)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {opponentName}'s Guesses at My Number
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px' }}>
        {guesses.length === 0 ? (
          <div style={{
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.82rem',
            gap: '8px'
          }}>
            <Shield size={24} style={{ opacity: 0.4 }} />
            <span>Opponent hasn't guessed your code yet.</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--table-head-bg)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'center' }}>
                <th style={{ padding: '8px 10px', width: '36px' }}>#</th>
                <th style={{ padding: '8px 10px' }}>Guess</th>
                <th style={{ padding: '8px 10px' }}>Digits Match</th>
                <th style={{ padding: '8px 10px' }}>Positions Match</th>
                <th style={{ padding: '8px 10px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {guesses.map((entry, idx) => {
                const isWin = entry.positions_matched === 4;
                return (
                  <tr
                    key={entry.index || idx}
                    className="animate-row"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                      background: isWin ? 'var(--no-match-bg)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '8px 10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {entry.index || idx + 1}
                    </td>
                    <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono)', fontWeight: '800', letterSpacing: '2px', color: 'var(--text-primary)' }}>
                      {entry.guess}
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: entry.digits_matched > 0 ? 'var(--digit-match-bg)' : 'transparent',
                        color: entry.digits_matched > 0 ? 'var(--digit-match)' : 'var(--text-muted)',
                      }}>
                        {entry.digits_matched}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)',
                        background: entry.positions_matched > 0 ? 'var(--pos-match-bg)' : 'transparent',
                        color: entry.positions_matched > 0 ? 'var(--pos-match)' : 'var(--text-muted)',
                      }}>
                        {entry.positions_matched}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      {isWin ? (
                        <span style={{
                          padding: '2px 10px',
                          borderRadius: '999px',
                          background: 'var(--no-match)',
                          color: '#FFFFFF',
                          fontWeight: '800',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                        }}>
                          Found! 💥
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          Trying...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
