import unittest
from app.game_logic.ai_player import AIPlayer
from app.game_logic.validator import validate_code

class TestAIPlayer(unittest.TestCase):
    def test_easy_ai_valid_guess(self):
        ai = AIPlayer(difficulty="easy")
        guess = ai.make_guess()
        valid, _ = validate_code(guess)
        self.assertTrue(valid)

    def test_medium_ai_prunes_candidates(self):
        ai = AIPlayer(difficulty="medium")
        initial_candidates = len(ai.candidates)
        self.assertEqual(initial_candidates, 5040)

        # Give clue: guess "1234", digits 2, pos 1
        ai.record_feedback("1234", 2, 1)
        self.assertLess(len(ai.candidates), initial_candidates)

        next_guess = ai.make_guess()
        valid, _ = validate_code(next_guess)
        self.assertTrue(valid)
        self.assertIn(next_guess, ai.candidates)

    def test_hard_ai_prunes_and_solves(self):
        ai = AIPlayer(difficulty="hard")
        first_guess = ai.make_guess()
        self.assertEqual(first_guess, "0123")

        # Secret is 0145 -> against 0123: 0 and 1 match at pos 0 and 1 -> digits 2, pos 2
        ai.record_feedback("0123", 2, 2)
        self.assertLess(len(ai.candidates), 5040)

        second_guess = ai.make_guess()
        valid, _ = validate_code(second_guess)
        self.assertTrue(valid)

if __name__ == "__main__":
    unittest.main()
