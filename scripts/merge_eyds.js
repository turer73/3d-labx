// Merge e-YDS questions into WordQuest words.json
const fs = require('fs');

const wordsPath = 'C:\\3dlabx\\tech-portal-frontend\\public\\wordquest\\data\\words.json';
const words = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

// New vocabulary questions from e-YDS (26 questions)
const newVocab = [
  {id:"v091",sentence:"Information about a person that might be acquired during a study must be treated as confidential and not made available to others without his or her ----.",options:["consent","identity","appointment","integration","resentment"],answer:0,word:"consent",meaning_tr:"rıza, onay",level:"B2",exam:"YDS"},
  {id:"v092",sentence:"Human beings' ability to discriminate sounds at a very early age appears to be ---- not only in the mother tongue but also in other languages.",options:["eventual","defensive","evident","frustrating","responsive"],answer:2,word:"evident",meaning_tr:"açık, belirgin",level:"B2",exam:"YDS"},
  {id:"v093",sentence:"According to a study, young people in the Middle East between 15 and 29 years of age ---- about one-third of the region's population.",options:["constitute","resign","absorb","spread","maintain"],answer:0,word:"constitute",meaning_tr:"oluşturmak, teşkil etmek",level:"C1",exam:"YDS"},
  {id:"v094",sentence:"The earliest music for movies was played live in the cinema to ---- the silent image and enhance its mood.",options:["receive","diminish","eradicate","accompany","verify"],answer:3,word:"accompany",meaning_tr:"eşlik etmek",level:"B2",exam:"YDS"},
  {id:"v095",sentence:"Despite delivering calcium and protein, drinking a lot of milk does not provide a net health benefit for women and may even ----- their long-term survival prospects.",options:["compensate","withdraw","foster","hinder","fulfill"],answer:3,word:"hinder",meaning_tr:"engellemek, zorlaştırmak",level:"C1",exam:"YDS"},
  {id:"v096",sentence:"What makes outdoor exercise ---- is that it has a significant positive effect on both physical and mental health, perhaps even more so than indoor training.",options:["challenging","instructive","accessible","favorable","functional"],answer:0,word:"challenging",meaning_tr:"zorlayıcı, meydan okuyan",level:"B1",exam:"YDS"},
  {id:"v097",sentence:"Biological explanations are not ---- wrong, but by focussing on the body, they fail to do justice to the social factors that play a part in disease.",options:["necessarily","accidentally","strictly","externally","hazardously"],answer:0,word:"necessarily",meaning_tr:"zorunlu olarak, mutlaka",level:"B2",exam:"YDS"},
  {id:"v098",sentence:"In Egypt, archeologists unearthed the remains of an Egyptian brewer, ---- a more detailed understanding of the lifestyles of ordinary ancient Egyptians.",options:["seeking","returning","denying","abandoning","magnifying"],answer:0,word:"seeking",meaning_tr:"aramak, peşinde olmak",level:"B2",exam:"YDS"},
  {id:"v099",sentence:"Although women make up nearly half of the labour force in South Africa, most of them work in lower-wage sectors, ---- domestic service.",options:["particularly","undoubtedly","loosely","dramatically","vitally"],answer:0,word:"particularly",meaning_tr:"özellikle, bilhassa",level:"B1",exam:"YDS"},
  {id:"v100",sentence:"The nervous systems of all animals have a number of basic functions in common, most ---- the ability to sense the environment.",options:["notably","promptly","deniably","approximately","fairly"],answer:0,word:"notably",meaning_tr:"özellikle, dikkat çekici biçimde",level:"B2",exam:"YDS"},
  {id:"v101",sentence:"While honesty is valued as a way of maintaining control over children, it is also a very important developmental ---- that a child acquires by the end of his or her first year.",options:["trait","sight","clue","custom","item"],answer:0,word:"trait",meaning_tr:"özellik, karakter özelliği",level:"B2",exam:"YDS"},
  {id:"v102",sentence:"Age ---- causes a physical decline and our risk of developing certain diseases such as heart disease steadily increases.",options:["uncommonly","irrationally","inevitably","unpredictably","inappropriately"],answer:2,word:"inevitably",meaning_tr:"kaçınılmaz olarak",level:"B2",exam:"YDS"},
  {id:"v103",sentence:"British education ---- some very big changes in the post-war era regarding economy, education, art and social life.",options:["withdrew","overestimated","upgraded","accused","underwent"],answer:4,word:"underwent",meaning_tr:"geçirmek, maruz kalmak",level:"C1",exam:"YDS"},
  {id:"v104",sentence:"Because much of the interior of South America is ----, all its major population centers are along the coasts.",options:["uninhabitable","indescribable","irreversible","immobile","dislocated"],answer:0,word:"uninhabitable",meaning_tr:"yaşanılmaz, oturulamaz",level:"C1",exam:"YDS"},
  {id:"v105",sentence:"The safety of football continues to be a heated topic for players and parents, with abundant evidence ---- the effect of concussions on the brain.",options:["countering","enhancing","revealing","reversing","eliminating"],answer:2,word:"revealing",meaning_tr:"ortaya koyan, açığa çıkaran",level:"B2",exam:"YDS"},
  {id:"v106",sentence:"Although Greenland, in the Arctic Ocean, is the world's largest island, few people live there because it is almost ---- covered in snow and ice.",options:["permanently","simultaneously","attractively","environmentally","bluntly"],answer:0,word:"permanently",meaning_tr:"kalıcı olarak, sürekli",level:"B2",exam:"YDS"},
  {id:"v107",sentence:"According to the term 'internal realism' in philosophy, scientific theories are not true ---- but only relative to large-scale conceptual schemes.",options:["incidentally","absolutely","gradually","doubtfully","severely"],answer:1,word:"absolutely",meaning_tr:"kesinlikle, mutlak olarak",level:"B1",exam:"YDS"},
  {id:"v108",sentence:"For the first time, a robot has successfully operated on live soft tissue without the ---- of a human surgeon.",options:["abduction","disruption","liberation","intervention","exclusion"],answer:3,word:"intervention",meaning_tr:"müdahale",level:"C1",exam:"YDS"},
  {id:"v109",sentence:"The use of blood in treating the sick is centuries old, but the process of transfusion only became an accepted and ---- practice in the 20th century.",options:["restrictive","reliable","notorious","demanding","deceptive"],answer:1,word:"reliable",meaning_tr:"güvenilir",level:"B1",exam:"YDS"},
  {id:"v110",sentence:"The eighteenth century was a great age of exploration, as it became ---- intertwined with science.",options:["arguably","accidentally","increasingly","jointly","temporarily"],answer:2,word:"increasingly",meaning_tr:"giderek artan şekilde",level:"B2",exam:"YDS"},
  {id:"v111",sentence:"When you buy from an online merchant, you trust that they are a ---- business that will send you the goods you order and not just take your money and run.",options:["legitimate","profitable","vulnerable","functional","substantial"],answer:0,word:"legitimate",meaning_tr:"meşru, yasal",level:"C1",exam:"YDS"},
  {id:"v112",sentence:"Due to a ---- of safety systems and units, elevators are the safest means of mass transportation, without which it would be difficult to build skyscrapers.",options:["portrayal","foundation","combination","proportion","reassurance"],answer:2,word:"combination",meaning_tr:"birleşim, kombinasyon",level:"B1",exam:"YDS"},
  {id:"v113",sentence:"An increasing problem of the industrial age is the ---- of substances into the atmosphere, causing harm to the environment.",options:["release","disturbance","contribution","pattern","outcome"],answer:0,word:"release",meaning_tr:"salınım, serbest bırakma",level:"B2",exam:"YDS"},
  {id:"v114",sentence:"There are ---- 400 active volcanoes in the world, and roughly half of them are located along the Pacific Ring of Fire.",options:["alternatively","coincidentally","approximately","fundamentally","independently"],answer:2,word:"approximately",meaning_tr:"yaklaşık olarak",level:"B1",exam:"YDS"},
  {id:"v115",sentence:"Where land is ----, floating solar farms offer a promising alternative for renewable energy production.",options:["fatal","scarce","controversial","abundant","marginal"],answer:1,word:"scarce",meaning_tr:"kıt, yetersiz",level:"B2",exam:"YDS"},
  {id:"v116",sentence:"Attachment is an emotional bond, usually between child and parent, characterised by the child's ---- to seek and maintain proximity to the parent, especially under stressful conditions.",options:["reluctance","tendency","opportunity","permission","approach"],answer:1,word:"tendency",meaning_tr:"eğilim, yatkınlık",level:"B2",exam:"YDS"}
];

// New phrasal verb questions from e-YDS (6 questions)
const newPV = [
  {id:"pv031",sentence:"Fairy tales are understood to be stories for children, ---- through millennia, with characters who are typical and common rather than unique and who embody good or evil in direct ways.",options:["passed down","cut off","set out","given in","blown up"],answer:0,word:"passed down",meaning_tr:"aktarmak, nesilden nesile geçmek",level:"B2",exam:"YDS"},
  {id:"pv032",sentence:"Workers should expect to return to school several times during their working lives just to ---- developments in their fields.",options:["keep up with","go along with","cut down on","do away with","fall behind with"],answer:0,word:"keep up with",meaning_tr:"ayak uydurmak, takip etmek",level:"B2",exam:"YDS"},
  {id:"pv033",sentence:"Floods occur when heavy rain falls, ---- so much water that it cannot seep into the ground fast enough.",options:["coping with","putting off","resulting in","emerging from","switching to"],answer:2,word:"resulting in",meaning_tr:"sonuçlanmak, yol açmak",level:"B2",exam:"YDS"},
  {id:"pv034",sentence:"Social psychologists construct and test theories of human social behaviour, and these theories ---- assumptions about social behaviour and relationships between social and psychological processes.",options:["take down","put aside","rest on","turn against","give up"],answer:2,word:"rest on",meaning_tr:"dayanmak, bağlı olmak",level:"B2",exam:"YDS"},
  {id:"pv035",sentence:"The government has recently announced plans to ---- tighter regulations on the financial sector to prevent future crises.",options:["figure out","carry out","give up","break down","set up"],answer:4,word:"set up",meaning_tr:"kurmak, oluşturmak",level:"B2",exam:"YDS"},
  {id:"pv036",sentence:"It is not necessary to eliminate all mosquitoes to ---- diseases like Zika and malaria because their numbers can be reduced significantly.",options:["take down","put forward","get rid of","break through","turn out"],answer:2,word:"get rid of",meaning_tr:"kurtulmak, yok etmek",level:"B2",exam:"YDS"}
];

// Merge
words.vocabulary.push(...newVocab);
words.phrasal_verbs.push(...newPV);

// Update meta
words.meta.totalQuestions = words.vocabulary.length + words.phrasal_verbs.length;
words.meta.lastUpdated = "2026-02-15";
words.meta.version = "2.0.0";

fs.writeFileSync(wordsPath, JSON.stringify(words, null, 2), 'utf8');

console.log(`Done! Total questions: ${words.meta.totalQuestions}`);
console.log(`Vocabulary: ${words.vocabulary.length} (was 90, added ${newVocab.length})`);
console.log(`Phrasal Verbs: ${words.phrasal_verbs.length} (was 30, added ${newPV.length})`);
