// Merge grammar and sentence_completion into words.json
const fs = require('fs');

const wordsPath = 'C:/3dlabx/tech-portal-frontend/public/wordquest/data/words.json';
const grammarPath = 'C:/3dlabx/scripts/ydt_grammar_questions.json';
const scPath = 'C:/3dlabx/scripts/ydt_sentence_completion.json';

const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
const grammarData = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
const scData = JSON.parse(fs.readFileSync(scPath, 'utf8'));

// Add grammar array
words.grammar = grammarData.grammar;

// Add sentence_completion array
words.sentence_completion = scData.sentence_completion;

// Update meta
words.meta.categories = ['vocabulary', 'phrasal_verb', 'grammar', 'sentence_completion'];
words.meta.totalQuestions = words.vocabulary.length + words.phrasal_verbs.length + words.grammar.length + words.sentence_completion.length;
words.meta.version = '4.0.0';
words.meta.lastUpdated = '2026-02-15';

console.log('Vocabulary:', words.vocabulary.length);
console.log('Phrasal Verbs:', words.phrasal_verbs.length);
console.log('Grammar:', words.grammar.length);
console.log('Sentence Completion:', words.sentence_completion.length);
console.log('Total:', words.meta.totalQuestions);

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), 'utf8');
console.log('Done! words.json updated.');
