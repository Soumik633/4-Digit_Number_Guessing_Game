import random
import string
import time
from typing import Dict, Optional
from ..models.game import GameSession
from ..game_logic.ai_player import AIPlayer

class SessionStore:
    def __init__(self):
        self.sessions: Dict[str, GameSession] = {}
        self.ai_players: Dict[str, AIPlayer] = {}

    def generate_room_id(self, length: int = 6) -> str:
        """Generates a random human-friendly room code (excluding ambiguous chars)."""
        chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
        for _ in range(100):
            room_id = "".join(random.choices(chars, k=length))
            if room_id not in self.sessions:
                return room_id
        return "".join(random.choices(chars, k=length + 2))

    def create_session(self, mode: str = "multiplayer", ai_difficulty: str = "medium") -> GameSession:
        self.cleanup_stale_sessions()
        room_id = self.generate_room_id()
        session = GameSession(
            room_id=room_id,
            mode=mode,
            ai_difficulty=ai_difficulty,
            status="waiting" if mode == "multiplayer" else "setup"
        )
        
        if mode == "single_player":
            ai = AIPlayer(difficulty=ai_difficulty)
            self.ai_players[room_id] = ai
            session.player_b.name = f"Computer ({ai_difficulty.capitalize()})"
            session.player_b.secret = ai.secret
            session.player_b.is_ready = True
            session.player_b.is_connected = True
            session.status = "setup"

        self.sessions[room_id] = session
        return session

    def get_session(self, room_id: str) -> Optional[GameSession]:
        return self.sessions.get(room_id.upper())

    def get_ai(self, room_id: str) -> Optional[AIPlayer]:
        return self.ai_players.get(room_id.upper())

    def set_ai(self, room_id: str, ai: AIPlayer):
        self.ai_players[room_id.upper()] = ai

    def delete_session(self, room_id: str):
        room_id = room_id.upper()
        self.sessions.pop(room_id, None)
        self.ai_players.pop(room_id, None)

    def cleanup_stale_sessions(self, max_age_seconds: int = 86400):
        now = time.time()
        stale = [rid for rid, sess in self.sessions.items() if now - sess.created_at > max_age_seconds]
        for rid in stale:
            self.delete_session(rid)

# Singleton global instance
session_store = SessionStore()
