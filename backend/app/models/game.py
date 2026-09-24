import time
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class GuessRecord:
    index: int
    guess: str
    digits_matched: int
    positions_matched: int
    status: str
    timestamp: float = field(default_factory=time.time)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "guess": self.guess,
            "digits_matched": self.digits_matched,
            "positions_matched": self.positions_matched,
            "status": self.status,
            "timestamp": self.timestamp
        }


@dataclass
class Player:
    player_id: str  # "A" or "B"
    name: str
    sid: Optional[str] = None
    secret: Optional[str] = None
    is_ready: bool = False
    is_connected: bool = True
    guesses: List[GuessRecord] = field(default_factory=list)

    def to_dict(self, reveal_secret: bool = False) -> Dict[str, Any]:
        return {
            "player_id": self.player_id,
            "name": self.name,
            "secret": self.secret if reveal_secret else (True if self.secret else False),
            "is_ready": self.is_ready,
            "is_connected": self.is_connected,
            "guesses": [g.to_dict() for g in self.guesses]
        }


@dataclass
class GameSession:
    room_id: str
    mode: str = "multiplayer"  # "multiplayer", "single_player", "local"
    ai_difficulty: str = "medium"
    player_a: Player = field(default_factory=lambda: Player(player_id="A", name="Player A"))
    player_b: Player = field(default_factory=lambda: Player(player_id="B", name="Player B"))
    current_turn: str = "A"  # "A" starts
    status: str = "waiting"  # "waiting", "setup", "playing", "game_over"
    winner: Optional[str] = None  # "A", "B", "tie", None
    created_at: float = field(default_factory=time.time)

    def get_player(self, player_id: str) -> Optional[Player]:
        if player_id == "A":
            return self.player_a
        elif player_id == "B":
            return self.player_b
        return None

    def get_opponent(self, player_id: str) -> Optional[Player]:
        if player_id == "A":
            return self.player_b
        elif player_id == "B":
            return self.player_a
        return None

    def switch_turn(self):
        self.current_turn = "B" if self.current_turn == "A" else "A"

    def to_dict_for_player(self, player_id: str) -> Dict[str, Any]:
        """
        Single source of truth privacy view:
        Only reveal opponent's secret if status is 'game_over'.
        """
        is_over = self.status == "game_over"
        player = self.get_player(player_id)
        opponent = self.get_opponent(player_id)

        return {
            "room_id": self.room_id,
            "mode": self.mode,
            "ai_difficulty": self.ai_difficulty,
            "status": self.status,
            "current_turn": self.current_turn,
            "is_my_turn": self.current_turn == player_id if self.status == "playing" else False,
            "winner": self.winner,
            "my_player_id": player_id,
            "my_secret": player.secret if player else None,
            "opponent_has_secret": bool(opponent.secret) if opponent else False,
            "opponent_secret": opponent.secret if (is_over and opponent) else None,
            "my_guesses": [g.to_dict() for g in player.guesses] if player else [],
            "opponent_guesses": [g.to_dict() for g in opponent.guesses] if opponent else [],
            "player_a_name": self.player_a.name,
            "player_b_name": self.player_b.name,
            "player_a_ready": self.player_a.is_ready,
            "player_b_ready": self.player_b.is_ready,
            "player_a_connected": self.player_a.is_connected,
            "player_b_connected": self.player_b.is_connected,
            "player_a_secret": self.player_a.secret if (player_id == "A" or is_over) else None,
            "player_b_secret": self.player_b.secret if (player_id == "B" or is_over) else None,
            "player_a_guesses": [g.to_dict() for g in self.player_a.guesses],
            "player_b_guesses": [g.to_dict() for g in self.player_b.guesses],
        }

    def to_full_dict(self) -> Dict[str, Any]:
        """Dual / spectator / local view dictionary."""
        return {
            "room_id": self.room_id,
            "mode": self.mode,
            "ai_difficulty": self.ai_difficulty,
            "status": self.status,
            "current_turn": self.current_turn,
            "winner": self.winner,
            "player_a": self.player_a.to_dict(reveal_secret=self.status == "game_over"),
            "player_b": self.player_b.to_dict(reveal_secret=self.status == "game_over"),
        }
