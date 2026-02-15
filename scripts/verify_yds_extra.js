const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/3dlabx/scripts/yds_extra_questions.json', 'utf8'));

// YDS 2018 Sonbahar answer key (Q7-16 grammar, Q27-36 sentence completion)
const yds2018key = {7:'C',8:'E',9:'E',10:'B',11:'D',12:'C',13:'E',14:'B',15:'C',16:'C',
                    27:'B',28:'D',29:'C',30:'A',31:'D',32:'C',33:'D',34:'C',35:'C',36:'D'};
// YDS/2 2019 answer key
const yds2019key = {7:'B',8:'D',9:'C',10:'C',11:'D',12:'B',13:'C',14:'C',15:'A',16:'B',
                    27:'C',28:'A',29:'D',30:'E',31:'C',32:'C',33:'C',34:'D',35:'B',36:'D'};

const letters = ['A','B','C','D','E'];
let errors = 0;

// Verify grammar: yg001-yg010 = YDS2018 Q7-16, yg011-yg020 = YDS2019 Q7-16
data.grammar.forEach((q, i) => {
    const qNum = (i % 10) + 7;
    const key = i < 10 ? yds2018key : yds2019key;
    const expected = key[qNum];
    const actual = letters[q.answer];
    if (actual !== expected) {
        console.log(`MISMATCH grammar ${q.id}: Q${qNum} expected=${expected} got=${actual}`);
        errors++;
    }
});

// Verify SC: ysc01-ysc10 = YDS2018 Q27-36, ysc11-ysc20 = YDS2019 Q27-36
data.sentence_completion.forEach((q, i) => {
    const qNum = (i % 10) + 27;
    const key = i < 10 ? yds2018key : yds2019key;
    const expected = key[qNum];
    const actual = letters[q.answer];
    if (actual !== expected) {
        console.log(`MISMATCH SC ${q.id}: Q${qNum} expected=${expected} got=${actual}`);
        errors++;
    }
});

console.log(`\nGrammar: ${data.grammar.length}, SC: ${data.sentence_completion.length}`);
console.log(errors === 0 ? 'ALL CORRECT!' : `${errors} errors found`);
