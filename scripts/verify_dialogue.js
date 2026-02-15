const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/3dlabx/scripts/ydt_dialogue_questions.json', 'utf8'));
const keyStr = '302.D 303.B 304.C 305.E 306.D 307.A 308.B 309.B 310.B 311.C 312.C 313.E 314.E 315.A 316.D 317.D 318.B 319.B 320.D 321.B 322.C 323.D 324.C 325.A 326.E 327.C 328.D 329.B 330.A 331.D 332.C 333.E 334.C 335.C 336.B';
const key = {};
keyStr.split(' ').forEach(s => { const [num, letter] = s.split('.'); key[parseInt(num)] = letter; });
const letters = ['A','B','C','D','E'];
let errors = 0;
data.dialogue.forEach((q, i) => {
    const qNum = 302 + i;
    const expected = key[qNum];
    const actual = letters[q.answer];
    if (actual !== expected) {
        console.log('MISMATCH ' + q.id + ' Q' + qNum + ': expected=' + expected + ' got=' + actual);
        errors++;
    }
});
console.log('Total: ' + data.dialogue.length + ' questions');
console.log(errors === 0 ? 'ALL CORRECT!' : errors + ' errors found');
