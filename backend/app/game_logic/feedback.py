from typing import Tuple, Dict, Any

def calculate_feedback(guess: str, secret: str) -> Dict[str, Any]:
    """
    Evaluates a guess against a secret code.
    Returns:
        {
            'digits_matched': int (0 to 4),
            'positions_matched': int (0 to 4),
            'is_win': bool (True if positions_matched == 4),
            'status': str ('Found!' or 'Trying...')
        }
    """
    if len(guess) != 4 or len(secret) != 4:
        raise ValueError("Both guess and secret must be 4 characters long.")

    secret_set = set(secret)
    digits_matched = sum(1 for ch in guess if ch in secret_set)
    positions_matched = sum(1 for g_ch, s_ch in zip(guess, secret) if g_ch == s_ch)
    
    # Mathematical invariant check: positions_matched <= digits_matched
    is_win = positions_matched == 4
    status = "Found!" if is_win else "Trying..."

    return {
        "digits_matched": digits_matched,
        "positions_matched": positions_matched,
        "is_win": is_win,
        "status": status
    }


def matches_clue(candidate: str, guess: str, digits_matched: int, positions_matched: int) -> bool:
    """
    Checks whether candidate would produce the exact same (digits_matched, positions_matched)
    clue if it were the secret for the given guess.
    """
    cand_set = set(candidate)
    d = sum(1 for ch in guess if ch in cand_set)
    if d != digits_matched:
        return False
    p = sum(1 for c_ch, g_ch in zip(candidate, guess) if c_ch == g_ch)
    return p == positions_matched
