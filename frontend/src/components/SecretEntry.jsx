import React, { useState } from 'react';
import { Lock, Shuffle, CheckCircle, AlertCircle } from 'lucide-react';
import { playClickSound, playKeyStrokeSound } from '../utils/audio';

function generateRandomCode() {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = [...digits].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).join('');
}

export default function SecretEntry({ onLockSecret, isLocked, playerColor = 'blue', secretCode = '' }) {
  const [code, setCode] = useState(secretCode || '');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(val);
    playKeyStrokeSound();

    if (val.length === 4) {
      if (new Set(val).size !== 4) {
        setError('All 4 digits must be unique (no repeated digits).');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleRandomize = () => {
    playClickSound();
    const rnd = generateRandomCode();
    setCode(rnd);
    setError('');
  };

  const handleClear = () => {
    playClickSound();
    setCode('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError('Please enter exactly 4 digits.');
      return;
    }
    if (new Set(code).size !== 4) {
      setError('All 4 digits must be unique (e.g. 2580, not 2280).');
      return;
    }
    playClickSound();
    onLockSecret(code);
  };

  const digits = (code || '----').padEnd(4, '-').slice(0, 4).split('');

  return (
    <div style={{
      background: 'var(--panel-inner-bg)',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '28px 24px',
      textAlign: 'center',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: 'var(--shadow-card)'
    }}>
      <div style={{ display: 'inline-flex', padding: '10px', background: 'rgba(56, 189, 248, 0.12)', borderRadius: '50%', marginBottom: '12px' }}>
        <Lock size={24} color={playerColor === 'blue' ? 'var(--player-a-accent)' : 'var(--player-b-accent)'} />
      </div>

      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
        Choose Your Secret Code
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
        Pick 4 non-repeating digits (0–9). Your opponent will try to deduce this number!
      </p>

      {/* Digit Display Boxes */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '22px' }}>
        {digits.map((d, i) => (
          <div
            key={i}
            className="animate-flip"
            style={{
              width: '56px',
              height: '66px',
              borderRadius: '10px',
              background: d !== '-' ? (playerColor === 'blue' ? 'var(--secret-tile-bg-a)' : 'var(--secret-tile-bg-b)') : 'var(--table-head-bg)',
              border: `2px solid ${d !== '-' ? (playerColor === 'blue' ? 'var(--player-a-accent)' : 'var(--player-b-accent)') : 'var(--border-subtle)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '2.1rem',
              fontWeight: '900',
              color: d !== '-' ? 'var(--secret-digit-color)' : 'var(--text-muted)',
              boxShadow: d !== '-' ? (playerColor === 'blue' ? 'var(--shadow-glow-a)' : 'var(--shadow-glow-b)') : 'none',
            }}
          >
            {d !== '-' ? d : ''}
          </div>
        ))}
      </div>

      {isLocked ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '14px',
          background: 'var(--pos-match-bg)',
          border: '1.5px solid var(--pos-match)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--pos-match)',
          fontSize: '0.92rem',
          fontWeight: '700'
        }}>
          <CheckCircle size={18} />
          Code Locked In! Waiting for opponent to be ready...
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '14px' }}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 2580"
              maxLength={4}
              value={code}
              onChange={handleInputChange}
              style={{
                width: '180px',
                padding: '12px',
                textAlign: 'center',
                fontSize: '1.3rem',
                letterSpacing: '4px',
                fontWeight: '800',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                border: '1.5px solid var(--border-subtle)'
              }}
              autoFocus
            />

            <button
              type="button"
              onClick={handleRandomize}
              title="Randomize valid code"
              style={{
                padding: '0 14px',
                background: 'var(--panel-inner-bg)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              <Shuffle size={16} /> Random
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!code.length}
              title="Clear code"
              style={{
                padding: '0 14px',
                background: 'var(--panel-inner-bg)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: code.length ? 'var(--text-primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            >
              ✕ Clear
            </button>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--no-match)',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={code.length !== 4 || new Set(code).size !== 4}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: playerColor === 'blue'
                ? 'linear-gradient(135deg, #2563eb, #0284c7)'
                : 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: '1rem',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          >
            🔒 Lock In Secret Code
          </button>
        </form>
      )}
    </div>
  );
}
