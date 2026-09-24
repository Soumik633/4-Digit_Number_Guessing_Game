import unittest
from app.game_logic.validator import validate_code, ALL_CODES, random_code

class TestValidator(unittest.TestCase):
    def test_valid_codes(self):
        valid, msg = validate_code("2580")
        self.assertTrue(valid)
        self.assertEqual(msg, "")

        # Leading zero allowed
        valid, msg = validate_code("0154")
        self.assertTrue(valid)

        # Another valid code
        valid, msg = validate_code("6307")
        self.assertTrue(valid)

    def test_repeated_digits(self):
        valid, msg = validate_code("2280")
        self.assertFalse(valid)
        self.assertIn("unique", msg)

        valid, msg = validate_code("1123")
        self.assertFalse(valid)

    def test_length_and_characters(self):
        valid, msg = validate_code("123")
        self.assertFalse(valid)

        valid, msg = validate_code("98765")
        self.assertFalse(valid)

        valid, msg = validate_code("12a4")
        self.assertFalse(valid)

    def test_all_codes_permutation_count(self):
        # 10 * 9 * 8 * 7 = 5040
        self.assertEqual(len(ALL_CODES), 5040)
        # All must be unique
        self.assertEqual(len(set(ALL_CODES)), 5040)

    def test_random_code(self):
        code = random_code()
        valid, _ = validate_code(code)
        self.assertTrue(valid)

if __name__ == "__main__":
    unittest.main()
