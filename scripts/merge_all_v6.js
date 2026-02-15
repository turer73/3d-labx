const fs = require('fs');

const wordsPath = 'C:/3dlabx/tech-portal-frontend/public/wordquest/data/words.json';
const dialoguePath = 'C:/3dlabx/scripts/ydt_dialogue_questions.json';
const restatementPath = 'C:/3dlabx/scripts/ydt_restatement_questions.json';

const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));
const dialogueData = JSON.parse(fs.readFileSync(dialoguePath, 'utf8'));
const restatementData = JSON.parse(fs.readFileSync(restatementPath, 'utf8'));

// Add dialogue and restatement as new categories
words.dialogue = dialogueData.dialogue;
words.restatement = restatementData.restatement;

// Update meta
words.meta.categories = ['vocabulary', 'phrasal_verb', 'grammar', 'sentence_completion', 'cloze_test', 'dialogue', 'restatement'];
words.meta.totalQuestions = words.vocabulary.length + words.phrasal_verbs.length +
    words.grammar.length + words.sentence_completion.length + words.cloze_test.length +
    words.dialogue.length + words.restatement.length;
words.meta.version = '6.0.0';
words.meta.lastUpdated = '2026-02-15';

console.log('Vocabulary:', words.vocabulary.length);
console.log('Phrasal Verbs:', words.phrasal_verbs.length);
console.log('Grammar:', words.grammar.length);
console.log('Sentence Completion:', words.sentence_completion.length);
console.log('Cloze Test:', words.cloze_test.length);
console.log('Dialogue:', words.dialogue.length);
console.log('Restatement:', words.restatement.length);
console.log('Total:', words.meta.totalQuestions);

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), 'utf8');
console.log('Done! words.json v6.0.0 updated.');
