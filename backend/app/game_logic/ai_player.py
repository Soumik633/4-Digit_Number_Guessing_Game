import random
from collections import defaultdict
from typing import List, Dict, Any, Optional
from .validator import ALL_CODES, random_code
from .feedback import matches_clue, calculate_feedback

class AIPlayer:
    """
    AI Player with three distinct difficulty tiers:
    - Easy: Random guess from valid codes (avoids repeating previous guesses).
    - Medium: Keeps list of candidates consistent with all previous clues, picks randomly from candidates.
    - Hard: Minimax solver based on Donald Knuth's Mastermind algorithm.
    """
    def __init__(self, difficulty: str = "medium", secret: Optional[str] = None):
        self.difficulty = difficulty.lower()
        self.secret = secret or random_code()
        self.history: List[Dict[str, Any]] = [] # list of {guess, digits_matched, positions_matched}
        self.candidates: List[str] = list(ALL_CODES)
        self.past_guesses: set = set()

    def record_feedback(self, guess: str, digits_matched: int, positions_matched: int):
        """Record feedback from a guess made by the AI."""
        self.past_guesses.add(guess)
        self.history.append({
            "guess": guess,
            "digits_matched": digits_matched,
            "positions_matched": positions_matched
        })
        # Filter remaining candidates
        self.candidates = [
            c for c in self.candidates
            if matches_clue(c, guess, digits_matched, positions_matched)
        ]

    def make_guess(self) -> str:
        """Determines the AI's next guess based on difficulty."""
        if self.difficulty == "easy":
            return self._guess_easy()
        elif self.difficulty == "medium":
            return self._guess_medium()
        elif self.difficulty == "hard":
            return self._guess_hard()
        else:
            return self._guess_medium()

    def _guess_easy(self) -> str:
        """Picks a random valid 4-unique-digit code, avoiding exact repeats if possible."""
        available = [c for c in ALL_CODES if c not in self.past_guesses]
        if not available:
            return random_code()
        return random.choice(available)

    def _guess_medium(self) -> str:
        """Picks uniformly at random from remaining consistent candidates."""
        if not self.candidates:
            # Fallback if no candidate left (in case opponent gave inconsistent clues)
            return self._guess_easy()
        return random.choice(self.candidates)

    def _guess_hard(self) -> str:
        """
        Knuth-style Minimax approach:
        Choose the guess that minimizes the maximum possible remaining candidates.
        """
        if not self.candidates:
            return self._guess_easy()
        
        # Opening move: "0123" is a classic optimal opener
        if not self.history:
            choice = "0123"
            return choice

        # If only 1 or 2 candidates remain, pick one directly
        if len(self.candidates) <= 2:
            return self.candidates[0]

        # For performance, if candidates > 300, evaluate a representative sample or candidates set
        eval_pool = self.candidates if len(self.candidates) <= 150 else self.candidates[:80] + random.sample(ALL_CODES, 40)
        
        best_guess = None
        min_max_size = float('inf')
        candidates_set = set(self.candidates)

        for guess in eval_pool:
            # Count distribution of outcomes (digits, positions)
            counts = defaultdict(int)
            for cand in self.candidates:
                cand_set = set(cand)
                d = sum(1 for ch in guess if ch in cand_set)
                p = sum(1 for c_ch, g_ch in zip(cand, guess) if c_ch == g_ch)
                counts[(d, p)] += 1
            
            max_size = max(counts.values()) if counts else 0
            
            # If tie in minimax score, prefer a guess that is a candidate itself
            if max_size < min_max_size:
                min_max_size = max_size
                best_guess = guess
            elif max_size == min_max_size and guess in candidates_set and best_guess not in candidates_set:
                best_guess = guess

        return best_guess or self.candidates[0]
