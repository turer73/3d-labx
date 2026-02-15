const fs = require("fs");
const path = require("path");

const jsonPath = path.join(__dirname, "ydt_sentence_completion.json");
const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const questions = data.sentence_completion;

const ak = {
  141:"D",142:"E",143:"E",144:"D",145:"E",146:"A",147:"B",148:"E",
  149:"E",150:"D",151:"A",152:"B",153:"A",154:"E",155:"A",156:"C",
  157:"A",158:"A",159:"C",160:"B",161:"B",162:"D",163:"E",164:"D",
  165:"D",166:"D",167:"A",168:"C",169:"C",170:"E",171:"C",172:"C",
  173:"D",174:"C",175:"C",176:"A",177:"D",178:"A",179:"B",180:"C",
  181:"A",182:"B",183:"A",184:"D",185:"B",186:"D",187:"C",188:"B",
  189:"A",190:"E",191:"D",192:"A",193:"B",194:"D",195:"C",196:"C"
};

const l2i = {A:0,B:1,C:2,D:3,E:4};
const i2l = ["A","B","C","D","E"];

let correct = 0;
const mismatches = [];
const missing = [];

for (let i = 0; i < 56; i++) {
  const qNum = 141 + i;
  const scId = "sc" + String(i+1).padStart(3,"0");
  const expL = ak[qNum];
  const expI = l2i[expL];
  const q = questions.find(function(x){return x.id===scId;});
  if (!q) { missing.push({qNum,scId,exp:expL}); continue; }
  const ja = q.answer;
  const jl = i2l[ja];
  if (ja === expI) { correct++; }
  else {
    const s = q.sentence.length>80 ? q.sentence.substring(0,80)+"..." : q.sentence;
    mismatches.push({qNum,scId,expL,expI,jl,ja,s});
  }
}

console.log("=== Sentence Completion Answer Verification ===");
console.log("Total questions: 56");
console.log("JSON entries found: "+questions.length);
console.log("Correct: "+correct);
console.log("Mismatches: "+mismatches.length);
console.log("Missing from JSON: "+missing.length);
console.log("");

if (mismatches.length > 0) {
  console.log("--- MISMATCHES ---");
  mismatches.forEach(function(m) {
    console.log("  "+m.scId+" [Q"+m.qNum+"]: Expected "+m.expL+" [idx "+m.expI+"], Got "+m.jl+" [idx "+m.ja+"]");
    console.log("    Sentence: "+m.s);
    console.log("");
  });
}

if (missing.length > 0) {
  console.log("--- MISSING ---");
  missing.forEach(function(m) {
    console.log("  "+m.scId+" [Q"+m.qNum+"]: Expected "+m.exp+" - NOT FOUND IN JSON");
  });
}

if (mismatches.length===0 && missing.length===0) {
  console.log("ALL ANSWERS MATCH! No issues found.");
}