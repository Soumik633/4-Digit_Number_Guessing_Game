import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import { playClickSound, playKeyStrokeSound, playErrorSound } from '../utils/audio';

export default function GuessInput({ onSubmitGuess, isMyTurn, disabled, playerTheme = 'blue' }) {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setGuess(val);
    playKeyStrokeSound();

    if (val.length === 4) {
      if (new Set(val).size !== 4) {
        setError('Digits must be unique');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isMyTurn || disabled) return;

    if (guess.length !== 4) {
      setError('Must be exactly 4 digits');
      playErrorSound();
      return;
    }
    if (new Set(guess).size !== 4) {
      setError('Digits must be unique');
      playErrorSound();
      return;
    }

    playClickSound();
    onSubmitGuess(guess);
    setGuess('');
    setError('');
  };

  const handleClear = () => {
    playClickSound();
    setGuess('');
    setError('');
  };

  const isButtonDisabled = disabled || !isMyTurn || guess.length !== 4 || new Set(guess).size !== 4;

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter 4 unique digits (e.g. 1234)"
            maxLength={4}
            value={guess}
            onChange={handleChange}
            disabled={!isMyTurn || disabled}
            style={{
              width: '100%',
              height: '48px',
              padding: '0 38px 0 16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              letterSpacing: '3px',
              borderRadius: 'var(--radius-sm)',
              background: isMyTurn ? 'var(--bg-card-subtle)' : 'var(--table-head-bg)',
              color: 'var(--text-primary)',
              border: `1.5px solid ${isMyTurn ? (playerTheme === 'blue' ? 'var(--player-a-accent)' : 'var(--player-b-accent)') : 'var(--border-subtle)'}`,
              opacity: isMyTurn ? 1 : 0.6,
            }}
          />
          {guess.length > 0 && isMyTurn && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear input"
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          )}
          {error && (
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '4px',
              color: 'var(--no-match)',
              fontSize: '0.72rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: '700'
            }}>
              <AlertCircle size={12} /> {error}
            </div>
          )}
        </div>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          disabled={!guess.length || !isMyTurn || disabled}
          title="Clear entered digits"
          style={{
            height: '48px',
            padding: '0 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--panel-inner-bg)',
            border: '1.5px solid var(--border-subtle)',
            color: guess.length > 0 && isMyTurn ? 'var(--text-primary)' : 'var(--text-muted)',
            fontWeight: '700',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          ✕ Clear
        </button>

        {/* Submit Guess Button */}
        <button
          type="submit"
          disabled={isButtonDisabled}
          style={{
            height: '46px',
            padding: '0 22px',
            borderRadius: 'var(--radius-sm)',
            background: isButtonDisabled
              ? 'rgba(255, 255, 255, 0.08)'
              : playerTheme === 'blue'
                ? 'linear-gradient(135deg, #2563eb, #0284c7)'
                : 'linear-gradient(135deg, #e11d48, #be123c)',
            color: isButtonDisabled ? 'var(--text-muted)' : '#FFFFFF',
            fontWeight: '700',
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isButtonDisabled ? 'none' : '0 4px 14px rgba(0, 0, 0, 0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          <Send size={16} /> Submit Guess
        </button>
      </div>
    </form>
  );
}
