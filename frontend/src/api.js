const API_BASE = '/api/rooms';

export async function createRoom(mode = 'multiplayer', aiDifficulty = 'medium', playerName = 'Player A') {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      ai_difficulty: aiDifficulty,
      player_name: playerName,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create room');
  }
  return res.json();
}

export async function getRoom(roomId) {
  const res = await fetch(`${API_BASE}/${roomId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Room not found');
  }
  return res.json();
}

export async function joinRoom(roomId, playerName = 'Player B') {
  const res = await fetch(`${API_BASE}/${roomId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player_name: playerName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to join room');
  }
  return res.json();
}
