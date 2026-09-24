import React, { useState, useEffect, useRef } from 'react';
import { Swords, User, ArrowRight, X, AlertCircle } from 'lucide-react';
import { getRoom, joinRoom } from '../api';
import { playClickSound } from '../utils/audio';

export default function JoinModal({ roomId, onJoinSuccess, onCancel }) {
  const [joinerName, setJoinerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (roomId) {
      getRoom(roomId)
        .then((info) => setRoomInfo(info))
        .catch(() => {
          // It's okay if info fetch fails, they can still try joining
        });
    }
  }, [roomId]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const finalName = joinerName.trim() || 'Player B';
    setLoading(true);
    setError('');
    playClickSound();

    try {
      await joinRoom(roomId, finalName);
      onJoinSuccess(roomId, finalName);
    } catch (err) {
      setError(err.message || 'Failed to join game room.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(7, 8, 18, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '20px'
    }}>
      <div
        className="animate-pop"
        style={{
          background: 'linear-gradient(180deg, #182045, #0f142e)',
          border: '2px solid rgba(56, 189, 248, 0.5)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 28px',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 0 50px rgba(56, 189, 248, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)',
          position: 'relative',
        }}
      >
        {/* Close / Cancel Button */}
        <button
          onClick={() => {
            playClickSound();
            onCancel();
          }}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          title="Cancel"
        >
          <X size={16} />
        </button>

        {/* Swords Icon Badge */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.3), rgba(56, 189, 248, 0.3))',
          border: '2px solid rgba(56, 189, 248, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.3)',
        }}>
          <Swords size={32} color="#38BDF8" />
        </div>

        {/* Modal Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.6rem',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: '6px'
        }}>
          Join Number Hunt
        </h2>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          You've been invited to battle in Room:
        </p>

        {/* Room Code Badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '22px'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            fontWeight: '900',
            letterSpacing: '3px',
            color: '#38BDF8',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            padding: '6px 18px',
            borderRadius: '8px',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)'
          }}>
            {roomId}
          </span>
        </div>

        {error && (
          <div className="animate-shake" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--no-match)',
            fontSize: '0.82rem',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} flexShrink={0} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: '8px'
            }}>
              <User size={15} color="var(--player-b-accent)" />
              Enter Your Name:
            </label>
            <input
              ref={inputRef}
              type="text"
              value={joinerName}
              onChange={(e) => setJoinerName(e.target.value)}
              placeholder="e.g. Sarah"
              maxLength={15}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1.5px solid rgba(225, 29, 72, 0.4)',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--player-b-accent)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(225, 29, 72, 0.4)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #e11d48, #be123c)',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 18px rgba(225, 29, 72, 0.4)',
              border: 'none',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
          >
            {loading ? 'Joining Arena...' : (
              <>
                Enter Battle <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
