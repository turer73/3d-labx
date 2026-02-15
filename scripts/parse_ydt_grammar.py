"""
Parse YDT 2018-2024 Grammar, Cloze Test, and Sentence Completion questions.
The PDF text is in two-column interleaved format, which makes simple line-by-line
parsing unreliable. Instead, we'll use a semi-automated approach:
1. Extract raw text blocks around each question number
2. Match with answer key
3. Output clean JSON
"""
import re, json

with open(r'C:\3dlabx\scripts\pdfs\YDT_2018_2024_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Parse answer key (lines starting with number.letter format)
answer_key = {}
# Find all "N.X" patterns in the answer key section (last ~100 lines)
ak_matches = re.findall(r'(\d+)\.([A-E])', text)
for num, letter in ak_matches:
    n = int(num)
    # Only keep entries from the answer key area (avoid matching question text)
    # The answer key has entries like "1.E 2.A 3.C" etc
    if n not in answer_key:
        answer_key[n] = letter

print(f"Answer key has {len(answer_key)} entries")
# Verify some known answers
assert answer_key[1] == 'E', f"Q1 should be E, got {answer_key[1]}"
assert answer_key[36] == 'C', f"Q36 should be C, got {answer_key[36]}"
print("Answer key verified OK")

# For the interleaved two-column format, manual parsing is more reliable.
# Let's extract each question by finding "N." pattern and collecting text until next question.
# But due to interleaving, this won't work cleanly.

# Instead, let's output the answer key mapping for each section so we can
# manually verify and create the question data.

print("\n=== GRAMMAR (Q36-105) Answer Key ===")
for i in range(36, 106):
    letter = answer_key.get(i, '?')
    print(f"  Q{i}: {letter}")

print("\n=== CLOZE TEST (Q106-140) Answer Key ===")
for i in range(106, 141):
    letter = answer_key.get(i, '?')
    print(f"  Q{i}: {letter}")

print("\n=== SENTENCE COMPLETION (Q141-196) Answer Key ===")
for i in range(141, 197):
    letter = answer_key.get(i, '?')
    print(f"  Q{i}: {letter}")
