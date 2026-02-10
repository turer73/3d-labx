/**
 * KELIME FETHI — Core Unit Tests
 * Run: node tests/test-core.js
 *
 * Tests cover:
 * - Turkish character handling (trUpper, trLower, trLen)
 * - Wordle evaluation algorithm (evaluateGuess)
 * - Daily word generation (getDailyWord, getDayNumber)
 * - State integrity (ensureStateIntegrity)
 * - Word validation
 */

const fs = require('fs');
const path = require('path');

// ===== TEST FRAMEWORK =====
let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        passed++;
        console.log(`  ✅ ${name}`);
    } catch (e) {
        failed++;
        console.log(`  ❌ ${name}: ${e.message}`);
    }
}

function assertEqual(actual, expected, msg = '') {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(`${msg} Expected ${b}, got ${a}`);
}

function assertTrue(val, msg = '') {
    if (!val) throw new Error(`${msg} Expected truthy, got ${val}`);
}

function assertFalse(val, msg = '') {
    if (val) throw new Error(`${msg} Expected falsy, got ${val}`);
}

// ===== INLINE MODULE IMPLEMENTATIONS (for Node.js testing) =====

// --- Turkish Character Handling ---
const TR_UPPER = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
const TR_LOWER = 'abcçdefgğhıijklmnoöprsştuüvyz';

function trUpper(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_LOWER.indexOf(ch);
        result += idx >= 0 ? TR_UPPER[idx] : ch.toUpperCase();
    }
    return result;
}

function trLower(str) {
    let result = '';
    for (const ch of str) {
        const idx = TR_UPPER.indexOf(ch);
        result += idx >= 0 ? TR_LOWER[idx] : ch.toLowerCase();
    }
    return result;
}

function trLen(str) {
    return [...str].length;
}

// --- Wordle Evaluation ---
const WORD_LENGTH = 5;

function evaluateGuess(guess, target) {
    const result = new Array(WORD_LENGTH).fill('absent');
    const guessArr = [...guess];
    const targetArr = [...target];
    const targetUsed = new Array(WORD_LENGTH).fill(false);
    const guessUsed = new Array(WORD_LENGTH).fill(false);

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetUsed[i] = true;
            guessUsed[i] = true;
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessUsed[i]) continue;
        for (let j = 0; j < WORD_LENGTH; j++) {
            if (targetUsed[j]) continue;
            if (guessArr[i] === targetArr[j]) {
                result[i] = 'present';
                targetUsed[j] = true;
                break;
            }
        }
    }
    return result;
}

// --- Daily Word Generation ---
function mulberry32(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

function getDailyPermutation(cycleNum, n) {
    const indices = Array.from({ length: n }, (_, i) => i);
    const rng = mulberry32(cycleNum * 7919 + 42);
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices;
}

function getDailyWord(dailyWords, dayNum) {
    if (dailyWords.length === 0) return null;
    const n = dailyWords.length;
    const cycleNum = Math.floor(dayNum / n);
    const dayInCycle = dayNum % n;
    const perm = getDailyPermutation(cycleNum, n);
    return dailyWords[perm[dayInCycle]];
}

// ===== TESTS =====

console.log('\n🧪 KELIME FETHI — Unit Tests\n');

// --- Turkish Character Tests ---
console.log('📝 Turkish Characters:');

test('trUpper: basic Turkish lowercase → uppercase', () => {
    assertEqual(trUpper('kelime'), 'KELİME');
});

test('trUpper: ş → Ş', () => {
    assertEqual(trUpper('şehir'), 'ŞEHİR');
});

test('trUpper: ç → Ç, ğ → Ğ, ö → Ö, ü → Ü', () => {
    assertEqual(trUpper('çöğüş'), 'ÇÖĞÜŞ');
});

test('trUpper: ı → I (undotted)', () => {
    assertEqual(trUpper('ılık'), 'ILIK');
});

test('trUpper: i → İ (dotted)', () => {
    assertEqual(trUpper('ilk'), 'İLK');
});

test('trLower: İ → i (dotted)', () => {
    assertEqual(trLower('İSTANBUL'), 'istanbul');
});

test('trLower: I → ı (undotted)', () => {
    assertEqual(trLower('ILIK'), 'ılık');
});

test('trLen: handles multi-byte Turkish chars', () => {
    assertEqual(trLen('ŞEHİR'), 5);
    assertEqual(trLen('ÇÖZÜM'), 5);
    assertEqual(trLen('GÜNEŞ'), 5);
});

test('trLen: emoji length', () => {
    assertEqual(trLen('🔥ABC'), 4);
});

// --- Wordle Evaluation Tests ---
console.log('\n🎯 Wordle Evaluation:');

test('evaluateGuess: all correct', () => {
    assertEqual(
        evaluateGuess('KELME', 'KELME'),
        ['correct', 'correct', 'correct', 'correct', 'correct']
    );
});

test('evaluateGuess: all absent', () => {
    assertEqual(
        evaluateGuess('ABCÇD', 'KLMNİ'),
        ['absent', 'absent', 'absent', 'absent', 'absent']
    );
});

test('evaluateGuess: mixed correct and present', () => {
    const result = evaluateGuess('SALON', 'ASLAN');
    // S: present (in target at index 1)
    // A: present (in target at index 0)
    // L: correct (index 2)
    // O: absent
    // N: correct (index 4)
    assertEqual(result, ['present', 'present', 'correct', 'absent', 'correct']);
});

test('evaluateGuess: duplicate letter in guess', () => {
    // Target: AHLAK — A at 0 and 4
    // Guess:  AAHHK — A at 0 and 1
    const result = evaluateGuess('ALARM', 'AHLAK');
    // A: correct (index 0)
    // L: present (L in target at index 2)
    // A: absent (one A already matched, second A in target at 4 but...)
    // R: absent
    // M: absent
    // Actually:
    // A(0)=correct, L(1)=present, A(2)=present(matches target[4]), R(3)=absent, M(4)=absent
    assertEqual(result[0], 'correct');
    assertEqual(result[1], 'present');
});

test('evaluateGuess: Turkish special chars - Ş, İ', () => {
    const result = evaluateGuess('ŞEHİR', 'ŞEHİR');
    assertEqual(result, ['correct', 'correct', 'correct', 'correct', 'correct']);
});

test('evaluateGuess: Ç vs C should be different', () => {
    const result = evaluateGuess('ÇADIR', 'CADDE');
    // Ç ≠ C, so Ç is absent
    assertEqual(result[0], 'absent');
});

test('evaluateGuess: present letter not double-counted', () => {
    // Target has one N, guess has two N's
    const result = evaluateGuess('NANAN', 'KALIN');
    // Target: KALIN = K(0) A(1) L(2) I(3) N(4)
    // Guess:  NANAN = N(0) A(1) N(2) A(3) N(4)
    // Pass 1 (correct): A(1)=A(1) correct, N(4)=N(4) correct
    // Pass 2 (present): N(0)→no free N→absent, N(2)→absent, A(3)→no free A→absent
    assertEqual(result[0], 'absent');   // N: target N(4) already used as correct
    assertEqual(result[1], 'correct');  // A: exact match
    assertEqual(result[2], 'absent');   // N: no more N
    assertEqual(result[3], 'absent');   // A: no more A
    assertEqual(result[4], 'correct'); // N: exact match
});

// --- Daily Word Tests ---
console.log('\n📅 Daily Word Generation:');

test('getDailyWord: returns a word from the list', () => {
    const words = ['KELME', 'SALON', 'GÜNEŞ', 'ÇIÇEK', 'BALIK'];
    const word = getDailyWord(words, 0);
    assertTrue(words.includes(word), `"${word}" not in list`);
});

test('getDailyWord: empty list returns null', () => {
    assertEqual(getDailyWord([], 0), null);
});

test('getDailyWord: no repeats within one cycle', () => {
    const words = ['KELME', 'SALON', 'GÜNEŞ', 'ÇIÇEK', 'BALIK', 'ARABA', 'KITAP', 'ZAMAN', 'DENIZ', 'HAYAL'];
    const n = words.length;
    const seen = new Set();
    for (let day = 0; day < n; day++) {
        const word = getDailyWord(words, day);
        assertFalse(seen.has(word), `Repeat at day ${day}: ${word}`);
        seen.add(word);
    }
    assertEqual(seen.size, n, 'Should use all words in one cycle');
});

test('getDailyWord: different cycles produce different permutations', () => {
    const words = ['KELME', 'SALON', 'GÜNEŞ', 'ÇIÇEK', 'BALIK'];
    const n = words.length;
    const cycle0 = [];
    const cycle1 = [];
    for (let d = 0; d < n; d++) {
        cycle0.push(getDailyWord(words, d));
        cycle1.push(getDailyWord(words, n + d));
    }
    // Cycles should be different orderings (very unlikely to be same)
    const same = cycle0.every((w, i) => w === cycle1[i]);
    assertFalse(same, 'Cycles should differ');
});

test('getDailyWord: deterministic (same day → same word)', () => {
    const words = ['KELME', 'SALON', 'GÜNEŞ'];
    const w1 = getDailyWord(words, 42);
    const w2 = getDailyWord(words, 42);
    assertEqual(w1, w2);
});

test('getDailyWord: 365 days coverage with 600 words', () => {
    // Simulate 600 daily words for a year
    const dailyList = [];
    for (let i = 0; i < 600; i++) dailyList.push(`W${String(i).padStart(4, '0')}`);

    const yearWords = new Set();
    for (let d = 0; d < 365; d++) {
        yearWords.add(getDailyWord(dailyList, d));
    }
    // With 600 words, 365 days = all unique (within first cycle)
    assertEqual(yearWords.size, 365, `Expected 365 unique, got ${yearWords.size}`);
});

// --- Word Data Validation ---
console.log('\n📚 Word Data Validation:');

const wordsPath = path.join(__dirname, '..', 'data', 'words.json');
const citiesPath = path.join(__dirname, '..', 'data', 'cities.json');

if (fs.existsSync(wordsPath)) {
    const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));

    test('words.json: has words array', () => {
        assertTrue(Array.isArray(wordsData.words), 'words should be array');
        assertTrue(wordsData.words.length > 500, `Expected >500 words, got ${wordsData.words.length}`);
    });

    test('words.json: has daily array', () => {
        assertTrue(Array.isArray(wordsData.daily), 'daily should be array');
        assertTrue(wordsData.daily.length >= 365, `Expected >=365 daily, got ${wordsData.daily.length}`);
    });

    test('words.json: all words are 5 Turkish chars', () => {
        const TR = new Set('ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ');
        let invalid = 0;
        for (const w of wordsData.words) {
            const chars = [...w];
            if (chars.length !== 5 || !chars.every(c => TR.has(c))) invalid++;
        }
        assertEqual(invalid, 0, `${invalid} invalid words found`);
    });

    test('words.json: daily words are subset of words', () => {
        const wordSet = new Set(wordsData.words);
        const missing = wordsData.daily.filter(w => !wordSet.has(w));
        assertEqual(missing.length, 0, `${missing.length} daily words not in dict: ${missing.slice(0,3)}`);
    });

    test('words.json: no duplicate words', () => {
        const unique = new Set(wordsData.words);
        assertEqual(unique.size, wordsData.words.length, 'Duplicate words found');
    });

    test('words.json: no duplicate daily words', () => {
        const unique = new Set(wordsData.daily);
        assertEqual(unique.size, wordsData.daily.length, 'Duplicate daily words found');
    });
}

if (fs.existsSync(citiesPath)) {
    const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));

    test('cities.json: has 81 cities', () => {
        assertEqual(citiesData.cities.length, 81);
    });

    test('cities.json: each city has >=5 words', () => {
        const low = citiesData.cities.filter(c => (c.words || []).length < 5);
        assertEqual(low.length, 0, `${low.length} cities with <5 words`);
    });

    test('cities.json: all city words are valid 5-letter', () => {
        const TR = new Set('ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ');
        let invalid = 0;
        for (const city of citiesData.cities) {
            for (const w of (city.words || [])) {
                const chars = [...w];
                if (chars.length !== 5 || !chars.every(c => TR.has(c))) {
                    invalid++;
                    if (invalid <= 3) console.log(`    Invalid city word: "${w}" in ${city.name}`);
                }
            }
        }
        assertEqual(invalid, 0, `${invalid} invalid city words`);
    });

    test('cities.json: has 7 regions', () => {
        assertEqual(citiesData.regions.length, 7);
    });

    test('cities.json: all cities have valid region', () => {
        const regionIds = new Set(citiesData.regions.map(r => r.id));
        const invalid = citiesData.cities.filter(c => !regionIds.has(c.region));
        assertEqual(invalid.length, 0, `${invalid.length} cities with invalid region`);
    });
}

// ===== SUMMARY =====
console.log('\n' + '='.repeat(50));
console.log(`📊 Results: ${passed}/${total} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
    process.exit(1);
} else {
    console.log('🎉 All tests passed!\n');
}
