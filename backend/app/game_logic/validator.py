import itertools
import random
from typing import List, Tuple

def validate_code(code: str) -> Tuple[bool, str]:
    """
    Validates a 4-digit code.
    Rules:
    - Must be a string of length 4.
    - All characters must be numeric digits ('0' to '9').
    - Leading zeros are allowed (e.g. '0154').
    - All 4 digits must be strictly unique (no repetition).
    """
    if not isinstance(code, str):
        return False, "Code must be a string."
    
    code = code.strip()
    if len(code) != 4:
        return False, "Code must be exactly 4 digits."
    
    if not code.isdigit():
        return False, "Code must contain only numeric digits (0-9)."
    
    if len(set(code)) != 4:
        return False, "All digits must be unique (no repeated digits)."
    
    return True, ""


def generate_all_codes() -> List[str]:
    """
    Precomputes all 5,040 possible 4-unique-digit codes (10 * 9 * 8 * 7).
    """
    digits = "0123456789"
    return ["".join(p) for p in itertools.permutations(digits, 4)]


ALL_CODES: List[str] = generate_all_codes()


def random_code() -> str:
    """Returns a random valid 4-unique-digit code."""
    return random.choice(ALL_CODES)
