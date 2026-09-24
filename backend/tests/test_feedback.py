import unittest
from app.game_logic.feedback import calculate_feedback, matches_clue

class TestFeedback(unittest.TestCase):
    def test_blueprint_worked_example(self):
        # From section 2.2 of blueprint: secret 2580, guess 2081 -> digits: 3, pos: 2
        res = calculate_feedback("2081", "2580")
        self.assertEqual(res["digits_matched"], 3)
        self.assertEqual(res["positions_matched"], 2)
        self.assertFalse(res["is_win"])
        self.assertEqual(res["status"], "Trying...")

    def test_exact_match(self):
        res = calculate_feedback("2580", "2580")
        self.assertEqual(res["digits_matched"], 4)
        self.assertEqual(res["positions_matched"], 4)
        self.assertTrue(res["is_win"])
        self.assertEqual(res["status"], "Found!")

    def test_zero_match(self):
        res = calculate_feedback("1349", "2580")
        self.assertEqual(res["digits_matched"], 0)
        self.assertEqual(res["positions_matched"], 0)
        self.assertFalse(res["is_win"])

    def test_digits_only_no_positions(self):
        res = calculate_feedback("0852", "2580")
        self.assertEqual(res["digits_matched"], 4)
        self.assertEqual(res["positions_matched"], 0)
        self.assertFalse(res["is_win"])

    def test_matches_clue_helper(self):
        # Candidate 2580 with guess 2081 gave (3, 2).
        self.assertTrue(matches_clue("2580", "2081", 3, 2))
        # Candidate 1234 does not match that clue
        self.assertFalse(matches_clue("1234", "2081", 3, 2))

if __name__ == "__main__":
    unittest.main()
