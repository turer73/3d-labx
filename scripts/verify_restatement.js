const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/3dlabx/scripts/ydt_restatement_questions.json', 'utf8'));
const keyStr = '337.E 338.B 339.A 340.B 341.A 342.A 343.C 344.E 345.D 346.D 347.B 348.B 349.A 350.D 351.D 352.E 353.E 354.D 355.A 356.B 357.C 358.B 359.A 360.B 361.C 362.B 363.A 364.D 365.E 366.D 367.B 368.B 369.B 370.C 371.B';
const key = {};
keyStr.split(' ').forEach(s => { const [num, letter] = s.split('.'); key[parseInt(num)] = letter; });
const letters = ['A','B','C','D','E'];
let errors = 0;
data.restatement.forEach((q, i) => {
    const qNum = 337 + i;
    const expected = key[qNum];
    const actual = letters[q.answer];
    if (actual !== expected) {
        console.log('MISMATCH ' + q.id + ' Q' + qNum + ': expected=' + expected + ' got=' + actual);
        errors++;
    }
});
console.log('Total: ' + data.restatement.length + ' questions');
console.log(errors === 0 ? 'ALL CORRECT!' : errors + ' errors found');
