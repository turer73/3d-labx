const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/3dlabx/scripts/ydt_cloze_questions.json', 'utf8'));

// Answer key from YDT 2018-2024 (Q106-Q140)
// Line 8619: 106-140 answers
const keyStr = '106.A 107.B 108.E 109.C 110.A 111.A 112.A 113.B 114.B 115.D 116.E 117.A 118.B 119.A 120.D 121.B 122.D 123.E 124.C 125.C 126.A 127.D 128.C 129.E 130.B 131.A 132.B 133.D 134.B 135.B 136.D 137.B 138.D 139.E 140.C';
const key = {};
keyStr.split(' ').forEach(s => {
    const [num, letter] = s.split('.');
    key[parseInt(num)] = letter;
});

const letters = ['A','B','C','D','E'];
let errors = 0;

data.cloze_test.forEach((q, i) => {
    const qNum = 106 + i;
    const expected = key[qNum];
    const actual = letters[q.answer];
    if (actual !== expected) {
        console.log(`MISMATCH ${q.id} Q${qNum}: expected=${expected} got=${actual} sentence="${q.sentence.substring(0,50)}..."`);
        errors++;
    }
});

console.log(`\nTotal: ${data.cloze_test.length} questions`);
console.log(errors === 0 ? 'ALL CORRECT!' : `${errors} errors found`);
