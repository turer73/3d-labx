// Merge YDT 2018-2024 + YDS 2018 Sonbahar + YDS 2019/2 questions into WordQuest words.json
// Manually parsed from PDF text extractions with answer keys verified
const fs = require('fs');

const wordsPath = 'C:\\3dlabx\\tech-portal-frontend\\public\\wordquest\\data\\words.json';
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

// Collect existing words (lowercase) to check duplicates
const existingWords = new Set();
words.vocabulary.forEach(q => existingWords.add(q.word.toLowerCase()));
words.phrasal_verbs.forEach(q => existingWords.add(q.word.toLowerCase()));

console.log(`Existing: ${existingWords.size} unique words`);

// ============================================================
// YDT 2018-2024 VOCABULARY (Questions 1-35, answer key line 8606+)
// Answer key: 1.E 2.A 3.C 4.B 5.A 6.D 7.C 8.B 9.E 10.B 11.B 12.D 13.A 14.A 15.C 16.A 17.D 18.B 19.E 20.A 21.B 22.B 23.B 24.B 25.A 26.A 27.D 28.C 29.A 30.A 31.C 32.D 33.B 34.E 35.C
// ============================================================

const ydtVocab = [
  // Q1: 2018-YDT - "conditions" - Answer: E
  {id:"ydt_v01", sentence:"United Nations Peacekeeping emerged out of World War II to help warring countries or communities to create the ---- for world peace.",
   options:["inventions","predictions","interventions","accomplishments","conditions"], answer:4, word:"conditions", meaning_tr:"koşullar, şartlar", level:"B1", exam:"YDT"},

  // Q2: 2018-YDT - "crucial" - Answer: A
  {id:"ydt_v02", sentence:"Invented by the Chinese in the 9th century, gunpowder rapidly became a ---- factor in battle.",
   options:["crucial","complicating","provable","virtual","limiting"], answer:0, word:"crucial", meaning_tr:"çok önemli, hayati", level:"B2", exam:"YDT"},

  // Q3: 2018-YDT - "exactly" - Answer: C
  {id:"ydt_v03", sentence:"It is difficult to say ---- when people first started to make rope because very few early examples have survived until today.",
   options:["eventually","importantly","exactly","consistently","partially"], answer:2, word:"exactly", meaning_tr:"tam olarak, kesin olarak", level:"B1", exam:"YDT"},

  // Q4: 2018-YDT - "occupy" - Answer: B
  {id:"ydt_v04", sentence:"The continents are the major land masses of the Earth and ---- around 29 per cent of the planet's surface.",
   options:["threaten","occupy","maintain","initiate","provide"], answer:1, word:"occupy", meaning_tr:"kaplamak, işgal etmek", level:"B2", exam:"YDT"},

  // Q5: 2018-YDT - "set up" (phrasal verb) - Answer: A
  {id:"ydt_pv01", sentence:"The Hanseatic League, a confederation of North German cities founded in the late 1200's, ---- special areas in cities across north Europe and controlled most trading routes.",
   options:["set up","put aside","turned down","came out","kept off"], answer:0, word:"set up", meaning_tr:"kurmak, oluşturmak", level:"B2", exam:"YDT"},

  // Q6: 2019-YDT - "demand" - Answer: D
  {id:"ydt_v05", sentence:"As soon as the computer was invented, a growing ---- for computers by scientists and engineers evolved, and numerous universities started their own projects to produce them in the 1940s.",
   options:["isolation","concern","awareness","demand","variety"], answer:3, word:"demand", meaning_tr:"talep, istek", level:"B2", exam:"YDT"},

  // Q7: 2019-YDT - "damaging" - Answer: C
  {id:"ydt_v06", sentence:"By messing with the balance of microorganisms in the body and by killing too many of the good bacteria in your gut, antibiotics may have certain ---- effects on your health.",
   options:["prevalent","negligible","damaging","consistent","abundant"], answer:2, word:"damaging", meaning_tr:"zararlı, hasar veren", level:"B2", exam:"YDT"},

  // Q8: 2019-YDT - "significantly" - Answer: B
  {id:"ydt_v07", sentence:"Current research has suggested that people who consume more trans fatty acids have ---- greater levels of aggression.",
   options:["independently","significantly","deliberately","mutually","preciously"], answer:1, word:"significantly", meaning_tr:"önemli ölçüde, belirgin biçimde", level:"B2", exam:"YDT"},

  // Q9: 2019-YDT - "provides" - Answer: E
  {id:"ydt_v08", sentence:"In crime scene investigation, forensic science ---- evidence that may link a suspect to a crime or prove him or her innocent.",
   options:["initiates","accelerates","precedes","counters","provides"], answer:4, word:"provides", meaning_tr:"sağlamak, sunmak", level:"B1", exam:"YDT"},

  // Q10: 2019-YDT - "derives from" (phrasal verb) - Answer: B
  {id:"ydt_pv02", sentence:"Although the game of baseball as it is known today is uniquely American, it ---- the popular English children's bat-and-ball game called rounders.",
   options:["gets along","derives from","accounts for","goes through","brings about"], answer:1, word:"derives from", meaning_tr:"türemek, kaynaklanmak", level:"B2", exam:"YDT"},

  // Q11: 2020-YDT - "assumptions" - Answer: B
  {id:"ydt_v09", sentence:"Although considering how someone may react to a situation can be worthwhile, making ---- about another person's behaviour may lead you to the wrong conclusions.",
   options:["promises","assumptions","mistakes","priorities","compliments"], answer:1, word:"assumptions", meaning_tr:"varsayımlar, tahminler", level:"B2", exam:"YDT"},

  // Q12: 2020-YDT - "independent" - Answer: D
  {id:"ydt_v10", sentence:"By the time psychology came into its own as an ---- discipline after separating from philosophy, the scientific revolution was two centuries old.",
   options:["offensive","artificial","inadequate","independent","outdated"], answer:3, word:"independent", meaning_tr:"bağımsız", level:"B1", exam:"YDT"},

  // Q13: 2020-YDT - "Initially" - Answer: A
  {id:"ydt_v11", sentence:"----, the Universe was too energetic for stars to form, but as it expanded and cooled, it became possible for gravity to form clumps of gas.",
   options:["Initially","Frankly","Virtually","Ultimately","Merely"], answer:0, word:"initially", meaning_tr:"başlangıçta, ilk olarak", level:"B2", exam:"YDT"},

  // Q14: 2020-YDT - "enhance" - Answer: A
  {id:"ydt_v12", sentence:"Mobile learning, the role of which in education is becoming quite important, is often applied outside classrooms to ---- the learning that takes place inside classrooms.",
   options:["enhance","insist","require","suspect","provide"], answer:0, word:"enhance", meaning_tr:"geliştirmek, iyileştirmek", level:"B2", exam:"YDT"},

  // Q15: 2020-YDT - "account for" (phrasal verb) - Answer: C
  {id:"ydt_pv03", sentence:"In wealthier parts of the world, heart disease and strokes ---- over a quarter of deaths and there are many factors at play, with conventional wisdom identifying cholesterol as one of the biggest offenders.",
   options:["rest on","go through","account for","bring down","stem from"], answer:2, word:"account for", meaning_tr:"açıklamak, oluşturmak", level:"B2", exam:"YDT"},

  // Q16: 2021-YDT - "capability" - Answer: A
  {id:"ydt_v13", sentence:"The achievements of Sherlock Holmes, the most famous fictional detective in history, derive from his ---- to balance the physical evidence of a case with the more challenging subjective truths into a single coherent judgement.",
   options:["capability","prejudice","deception","resistance","nomination"], answer:0, word:"capability", meaning_tr:"yetenek, kapasite", level:"B2", exam:"YDT"},

  // Q17: 2021-YDT - "disastrous" - Answer: D
  {id:"ydt_v14", sentence:"In 1558, Queen Mary I of England was persuaded by her husband, King Philip II of Spain, to join him in a renewed war with France, which proved ---- for England as it led to the loss of Calais, England's last foothold in continental Europe.",
   options:["compatible","vulnerable","predictable","disastrous","indicative"], answer:3, word:"disastrous", meaning_tr:"felaket, yıkıcı", level:"B2", exam:"YDT"},

  // Q18: 2021-YDT - "decisively" - Answer: B
  {id:"ydt_v15", sentence:"Governments around the world, in partnership with civil society, must continue to act ---- against the tobacco epidemic – the leading global cause of preventable death.",
   options:["deficiently","decisively","suspiciously","adversely","roughly"], answer:1, word:"decisively", meaning_tr:"kararlı bir şekilde", level:"C1", exam:"YDT"},

  // Q19: 2021-YDT - "encompasses" - Answer: E
  {id:"ydt_v16", sentence:"The term 'Geography' formally applies to an academic discipline that ---- the study of the Earth's surface, its inhabitants, and more recently, its environment.",
   options:["attaches","occupies","considers","inhabits","encompasses"], answer:4, word:"encompasses", meaning_tr:"kapsamak, içermek", level:"C1", exam:"YDT"},

  // Q20: 2021-YDT - "brings about" (phrasal verb) - Answer: A
  // "brings about" already exists as pv001? No, let me check... pv001 is "run into"
  {id:"ydt_pv04", sentence:"Serotonin is responsible for maintaining appetite, sleep, and mood balance, but a deficit of it ---- depression.",
   options:["brings about","takes over","keeps on","turns down","gives off"], answer:0, word:"brings about", meaning_tr:"neden olmak, yol açmak", level:"B2", exam:"YDT"},

  // Q21: 2022-YDT - "predictions" - Answer: B
  {id:"ydt_v17", sentence:"Fairly accurate meteorological ---- are often made by looking at the shape of clouds and watching how they change.",
   options:["causes","predictions","speculations","inclusions","expansions"], answer:1, word:"predictions", meaning_tr:"tahminler, öngörüler", level:"B2", exam:"YDT"},

  // Q22: 2022-YDT - "abundant" - Answer: B
  {id:"ydt_v18", sentence:"The food industry, encompassing businesses that produce, package, prepare, and serve foods and beverages, brings us a food supply which is ---- and readily available.",
   options:["decisive","abundant","obsolete","futile","implicit"], answer:1, word:"abundant", meaning_tr:"bol, bereketli", level:"B2", exam:"YDT"},

  // Q23: 2022-YDT - "primarily" - Answer: B
  {id:"ydt_v19", sentence:"Although children's literature is intended ---- for children, it is more accurate to view such texts as having dual audiences of children and adults.",
   options:["tightly","primarily","vividly","allegedly","divisively"], answer:1, word:"primarily", meaning_tr:"öncelikle, esas olarak", level:"B2", exam:"YDT"},

  // Q24: 2022-YDT - "progresses" - Answer: B
  {id:"ydt_v20", sentence:"As their pregnancy ----, most women become increasingly short of breath because of the effect of the hormone progesterone on the central breathing system.",
   options:["expands","progresses","persuades","differs","boosts"], answer:1, word:"progresses", meaning_tr:"ilerlemek, gelişmek", level:"B2", exam:"YDT"},

  // Q25: 2022-YDT - "resulted in" (phrasal verb) - Answer: A
  {id:"ydt_pv05", sentence:"World War II was a catastrophic event that was by far the most deadly and destructive war in human history as it raged on for almost six years in Europe and ---- the death of millions of civilians.",
   options:["resulted in","stemmed from","took over","turned into","amounted to"], answer:0, word:"resulted in", meaning_tr:"sonuçlanmak, yol açmak", level:"B2", exam:"YDT"},

  // Q26: 2023-YDT - "extinction" - Answer: A
  {id:"ydt_v21", sentence:"Scientists believe an asteroid struck the planet Earth off Mexico's Yucatán Peninsula some 65 million years ago, bringing about the ---- of almost 50 percent of the plant species then living on Earth.",
   options:["extinction","identification","differentiation","invasion","exhibition"], answer:0, word:"extinction", meaning_tr:"yok oluş, nesli tükenme", level:"B2", exam:"YDT"},

  // Q27: 2023-YDT - "visible" - Answer: D
  {id:"ydt_v22", sentence:"The influence of ancient Greek civilisation, art and architecture, which were passed on by the Romans, is still ---- all around us.",
   options:["abrupt","reasonable","competitive","visible","confidential"], answer:3, word:"visible", meaning_tr:"görünür, açık", level:"B1", exam:"YDT"},

  // Q28: 2023-YDT - "widely" - Answer: C
  {id:"ydt_v23", sentence:"While toys today are ---- associated with children, historically, toys were the province of adults and were only gradually passed on to the young.",
   options:["separately","consecutively","widely","slightly","arbitrarily"], answer:2, word:"widely", meaning_tr:"yaygın olarak, geniş çapta", level:"B1", exam:"YDT"},

  // Q29: 2023-YDT - "overlooked" - Answer: A
  {id:"ydt_v24", sentence:"Cognitive and behavioural changes after a stroke are common yet often ---- because their effects may be subtle.",
   options:["overlooked","identified","avoided","estimated","examined"], answer:0, word:"overlooked", meaning_tr:"gözden kaçırılmak, ihmal edilmek", level:"B2", exam:"YDT"},

  // Q30: 2023-YDT - "break down" (phrasal verb) - Answer: A
  {id:"ydt_pv06", sentence:"It is important to have big goals, but we need to ---- these goals into small, measurable pieces, or milestones, making them easier to handle and achieve.",
   options:["break down","reflect on","pull through","cut off","put off"], answer:0, word:"break down", meaning_tr:"parçalara ayırmak, analiz etmek", level:"B2", exam:"YDT"},

  // Q31: 2024-YDT - "efficacy" - Answer: C
  {id:"ydt_v25", sentence:"While most synthetic vitamins are just as useful as the natural forms, controversy has arisen over the ---- of synthetic versus natural forms of vitamin E.",
   options:["adjustment","vulnerability","efficacy","severity","inspection"], answer:2, word:"efficacy", meaning_tr:"etkinlik, tesir", level:"C1", exam:"YDT"},

  // Q32: 2024-YDT - "crucial" - Answer: D
  // "crucial" already exists as ydt_v02, skip this (use a different focus word)
  // Actually let me re-check: Q32 answer is D=crucial
  // The sentence is different, so it's a valid question even if the word repeats
  // But we should skip duplicates. Let me mark it.

  // Q33: 2024-YDT - "slightly" - Answer: B
  {id:"ydt_v26", sentence:"Animation is the rapid display of a sequence of images, each ---- different from the last, to give the illusion of motion.",
   options:["notoriously","slightly","coincidentally","arguably","adversely"], answer:1, word:"slightly", meaning_tr:"hafifçe, biraz", level:"B1", exam:"YDT"},

  // Q34: 2024-YDT - "maintaining" - Answer: E
  {id:"ydt_v27", sentence:"With the knowledge that surface and ground waters are resources that can be overused, farmers are paying attention to the methods of conserving and reusing water while ---- the growth of their crops.",
   options:["transmitting","surrendering","admitting","installing","maintaining"], answer:4, word:"maintaining", meaning_tr:"sürdürmek, korumak", level:"B2", exam:"YDT"},

  // Q35: 2024-YDT - "credited with" (phrasal verb) - Answer: C
  {id:"ydt_pv07", sentence:"There is no single person ---- inventing the bicycle since many people independently developed models throughout history that would lead to the creation of bicycle as it is known today.",
   options:["exposed to","derived from","credited with","deprived of","counted against"], answer:2, word:"credited with", meaning_tr:"ile anılmak, hak ettiği kabul edilmek", level:"C1", exam:"YDT"},
];

// ============================================================
// YDS 2018 SONBAHAR (Questions 1-6)
// Answer key: 1.D 2.D 3.A 4.B 5.D 6.B
// ============================================================

const yds2018Vocab = [
  // Q1: excuses - Answer: D
  {id:"yds18s_v01", sentence:"For smokers who are under increased pressure to give up smoking, one of the easiest ---- is that quitting smoking makes people more likely to put on weight.",
   options:["incentives","attempts","purposes","excuses","features"], answer:3, word:"excuses", meaning_tr:"bahaneler, mazeretler", level:"B1", exam:"YDS"},

  // Q2: objectives - Answer: D
  {id:"yds18s_v02", sentence:"The primary ---- of an organisation's accounting department are to process financial information and to prepare financial statements at the end of the accounting period.",
   options:["advancements","compensations","obstacles","objectives","classifications"], answer:3, word:"objectives", meaning_tr:"hedefler, amaçlar", level:"B2", exam:"YDS"},

  // Q3: compelling - Answer: A
  {id:"yds18s_v03", sentence:"Scholars and historians have offered possible locations for the mythical island Atlantis, even in the face of ---- scientific evidence that it does not exist.",
   options:["compelling","doubtful","erroneous","refutable","ambiguous"], answer:0, word:"compelling", meaning_tr:"ikna edici, zorlayıcı", level:"B2", exam:"YDS"},

  // Q4: accepted - Answer: B
  {id:"yds18s_v04", sentence:"The Big Bang theory is the explanation most commonly ---- by astronomers for the origin of the universe.",
   options:["discovered","accepted","regulated","conducted","influenced"], answer:1, word:"accepted", meaning_tr:"kabul edilmiş", level:"B1", exam:"YDS"},

  // Q5: extensively - Answer: D
  {id:"yds18s_v05", sentence:"The relationship between sport and aggression has been studied ---- for decades, yet researchers still have a limited understanding of the link between the two.",
   options:["severely","suspiciously","uniquely","extensively","instantly"], answer:3, word:"extensively", meaning_tr:"kapsamlı olarak, geniş çapta", level:"B2", exam:"YDS"},

  // Q6: bring about (phrasal verb) - Answer: B
  {id:"yds18s_pv01", sentence:"Sense of control refers to the degree to which people believe that they can deliberately ---- desired outcomes and avoid undesirable ones in their environment.",
   options:["fill out","bring about","switch off","turn down","hand over"], answer:1, word:"bring about", meaning_tr:"neden olmak, meydana getirmek", level:"B2", exam:"YDS"},
];

// ============================================================
// YDS 2019/2 (Questions 1-6)
// Answer key: 1.B 2.D 3.E 4.B 5.D 6.B
// ============================================================

const yds2019Vocab = [
  // Q1: conclusion - Answer: B
  {id:"yds19_v01", sentence:"Research has found that the typical brain is a 'mosaic' combining some features that are more common in males and some that appear more frequently in females, pointing to the ---- that human brains do not belong to two distinct types categorised by gender.",
   options:["violation","conclusion","development","compulsion","obstacle"], answer:1, word:"conclusion", meaning_tr:"sonuç, çıkarım", level:"B1", exam:"YDS"},

  // Q2: efficacy - Answer: D
  {id:"yds19_v02", sentence:"Many scientists and research advocates contend that animal experiments are crucial for learning about basic biology and disease mechanisms, and are necessary for testing the ---- of new medicines.",
   options:["scarcity","urgency","ambiguity","efficacy","uniformity"], answer:3, word:"efficacy", meaning_tr:"etkinlik, tesir", level:"C1", exam:"YDS"},

  // Q3: inseparable - Answer: E
  {id:"yds19_v03", sentence:"Because the functions and disturbances of smell and taste are nearly ----, disturbances of one affect the other.",
   options:["inconvenient","unremarkable","inexplicable","unsophisticated","inseparable"], answer:4, word:"inseparable", meaning_tr:"ayrılmaz, birbirinden ayrılamayan", level:"B2", exam:"YDS"},

  // Q4: notoriously - Answer: B
  {id:"yds19_v04", sentence:"Maps of the ocean are rare as the vastness and depth of the ocean make it ---- difficult to study.",
   options:["admirably","notoriously","questionably","properly","incidentally"], answer:1, word:"notoriously", meaning_tr:"kötü şekilde tanınmış, herkesin bildiği gibi", level:"C1", exam:"YDS"},

  // Q5: identifying - Answer: D
  {id:"yds19_v05", sentence:"Children with autism spectrum conditions often have trouble ---- the emotional states of people around them, struggling to distinguish a happy face from a sad one, for example.",
   options:["overcoming","ignoring","provoking","identifying","improving"], answer:3, word:"identifying", meaning_tr:"tanımlamak, belirlemek", level:"B2", exam:"YDS"},

  // Q6: stem from (phrasal verb) - Answer: B
  {id:"yds19_pv01", sentence:"Human accomplishments ---- our ability to acquire knowledge from others and to use that communal store of experience to devise novel solutions to life's challenges.",
   options:["call off","stem from","bring down","take out","figure out"], answer:1, word:"stem from", meaning_tr:"kaynaklanmak, ileri gelmek", level:"B2", exam:"YDS"},
];

// ============================================================
// Q32 from YDT (2024): "crucial" as answer D - DUPLICATE of ydt_v02, skip
// ============================================================

// Combine all new questions
const allNewQuestions = [...ydtVocab, ...yds2018Vocab, ...yds2019Vocab];

// Separate into vocab and phrasal verbs, check duplicates
const newVocab = [];
const newPV = [];
const duplicates = [];

for (const q of allNewQuestions) {
  const wordLower = q.word.toLowerCase();
  if (existingWords.has(wordLower)) {
    duplicates.push(`${q.id}: "${q.word}" already exists`);
    continue;
  }

  // Check if it's a phrasal verb (id contains "pv" or has multi-word)
  const isPV = q.id.includes('pv') || q.word.includes(' ');

  if (isPV) {
    newPV.push(q);
  } else {
    newVocab.push(q);
  }

  existingWords.add(wordLower); // prevent duplicates within new set too
}

console.log(`\nDuplicates skipped (${duplicates.length}):`);
duplicates.forEach(d => console.log(`  - ${d}`));

// Renumber IDs sequentially
const vocabStart = words.vocabulary.length + 1;
newVocab.forEach((q, i) => {
  q.id = `v${String(vocabStart + i).padStart(3, '0')}`;
});

const pvStart = words.phrasal_verbs.length + 1;
newPV.forEach((q, i) => {
  q.id = `pv${String(pvStart + i).padStart(3, '0')}`;
});

console.log(`\nNew vocabulary to add: ${newVocab.length}`);
newVocab.forEach(q => console.log(`  ${q.id}: ${q.word} (${q.exam})`));

console.log(`\nNew phrasal verbs to add: ${newPV.length}`);
newPV.forEach(q => console.log(`  ${q.id}: ${q.word} (${q.exam})`));

// Merge
words.vocabulary.push(...newVocab);
words.phrasal_verbs.push(...newPV);

// Update meta
words.meta.totalQuestions = words.vocabulary.length + words.phrasal_verbs.length;
words.meta.lastUpdated = "2026-02-15";
words.meta.version = "3.0.0";

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), 'utf8');

console.log(`\n=== FINAL COUNTS ===`);
console.log(`Vocabulary: ${words.vocabulary.length}`);
console.log(`Phrasal Verbs: ${words.phrasal_verbs.length}`);
console.log(`Total: ${words.meta.totalQuestions}`);
console.log(`\nSaved to ${wordsPath}`);
