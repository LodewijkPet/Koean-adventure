window.KA = window.KA || {};
window.KA.drills = window.KA.drills || {};
window.KA.drills.questions = window.KA.drills.questions || {};

const WORD_MASTERY_CORRECT_TARGET = 3;
const WORD_MASTERY_STREAK_TARGET = 2;

const WORD_CATEGORY_IDS = [
  "position",
  "nature",
  "numbersSino",
  "numbersNative",
  "counters",
  "shopping",
  "food",
  "colors",
  "people",
  "cafe",
];

const WORD_ITEMS = {};

function registerWordItems(words = []) {
  words.forEach((word) => {
    if (!word || !word.id || !word.hangul) return;
    WORD_ITEMS[word.id] = {
      id: word.id,
      hangul: word.hangul,
      category: word.category || "people",
      translations: { en: word.en || word.hangul, nl: word.nl || word.en || word.hangul },
    };
  });
}

function wordItemsByCategory(categoryId) {
  return Object.values(WORD_ITEMS).filter((item) => item.category === categoryId);
}

function wordMeaning(item, language = settings.primary) {
  if (!item) return "";
  if (language === "ko") return item.hangul;
  return item.translations[language] || item.translations.en;
}

function ensureWordEntry(wordId) {
  if (!WORD_ITEMS[wordId]) return null;
  if (!progress.words[wordId]) {
    progress.words[wordId] = {
      seen: false,
      attempts: 0,
      correct: 0,
      streak: 0,
      mastered: false,
    };
  }
  return progress.words[wordId];
}

function markWordSeen(wordId) {
  const entry = ensureWordEntry(wordId);
  if (!entry) return;
  entry.seen = true;
}

function markWordsSeen(wordIds = []) {
  wordIds.forEach((wordId) => markWordSeen(wordId));
}

function recordWordAnswer(wordIds = [], correct) {
  wordIds.forEach((wordId) => {
    const entry = ensureWordEntry(wordId);
    if (!entry) return;
    entry.seen = true;
    entry.attempts += 1;
    if (correct) {
      entry.correct += 1;
      entry.streak += 1;
    } else {
      entry.streak = 0;
    }
    entry.mastered = entry.correct >= WORD_MASTERY_CORRECT_TARGET && entry.streak >= WORD_MASTERY_STREAK_TARGET;
  });
  scheduleSave();
}

function wordProgressEntry(wordId) {
  return progress.words[wordId] || null;
}

function wordSeen(wordId) {
  return !!wordProgressEntry(wordId)?.seen;
}

function wordMastered(wordId) {
  return !!wordProgressEntry(wordId)?.mastered;
}

function wordDictionaryTotals(wordIds = Object.keys(WORD_ITEMS)) {
  return wordIds.reduce(
    (totals, wordId) => {
      totals.total += 1;
      if (wordSeen(wordId)) totals.seen += 1;
      if (wordMastered(wordId)) totals.mastered += 1;
      return totals;
    },
    { total: 0, seen: 0, mastered: 0 },
  );
}

function wordDictionaryPanelSummary() {
  const totals = wordDictionaryTotals();
  return t("dictionary.words.panelSummary", totals);
}

function wordDictionaryStatusKey(wordId) {
  const entry = wordProgressEntry(wordId);
  if (!entry?.seen) return "dictionary.hangul.status.unseen";
  if (entry.mastered) return "dictionary.hangul.status.mastered";
  if (entry.attempts > 0) return "dictionary.hangul.status.learning";
  return "dictionary.hangul.status.seen";
}

function wordPracticeScore(item) {
  const entry = wordProgressEntry(item.id);
  if (!entry?.seen) return -100;
  if (!entry.mastered) return entry.correct + entry.attempts * 0.25;
  return 100 + entry.correct + entry.attempts * 0.1;
}

function selectWordPracticeItems(items, count) {
  return shuffledCopy(items)
    .sort((left, right) => wordPracticeScore(left) - wordPracticeScore(right))
    .slice(0, Math.min(count, items.length));
}

function createGeneratedWordStep({ item, promptKey, promptParams, correctChoice, candidateChoices, feedbackParams }) {
  const choiceSet = createChoiceSet(correctChoice, candidateChoices, 4);
  return {
    promptKey,
    promptParams,
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: feedbackParams,
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: feedbackParams,
    wordIds: [item.id],
  };
}

function buildWordQuestion(item, pool) {
  const meaning = wordMeaning(item);
  const candidates = pool.filter((candidate) => candidate.id !== item.id);
  const showHangul = Math.random() < 0.5;

  if (showHangul) {
    return createGeneratedWordStep({
      item,
      promptKey: "drill.word.prompt.meaning",
      promptParams: { hangul: item.hangul },
      correctChoice: literalChoice(meaning),
      candidateChoices: candidates.map((candidate) => literalChoice(wordMeaning(candidate))),
      feedbackParams: { hangul: item.hangul, meaning },
    });
  }

  return createGeneratedWordStep({
    item,
    promptKey: "drill.word.prompt.hangul",
    promptParams: { meaning },
    correctChoice: literalChoice(item.hangul),
    candidateChoices: candidates.map((candidate) => literalChoice(candidate.hangul)),
    feedbackParams: { hangul: item.hangul, meaning },
  });
}

function generateWordStepsFromCategories(categoryIds, data) {
  const pool = categoryIds.flatMap((categoryId) => wordItemsByCategory(categoryId));
  if (!pool.length) return [];
  const count = data.stepCount || Math.min(5, pool.length);
  return selectWordPracticeItems(pool, count).map((item) => buildWordQuestion(item, pool));
}

const SINO_DIGIT_READINGS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const SINO_DIGIT_WORD_IDS = [null, "word.il", "word.i", "word.sam", "word.sa", "word.o2", "word.yuk", "word.chil", "word.pal", "word.gu"];
const SINO_UNITS = [
  [10000, "만", "word.man"],
  [1000, "천", "word.cheon"],
  [100, "백", "word.baek"],
  [10, "십", "word.sip"],
];
const PRICE_POOL = [100, 200, 300, 500, 700, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 7000, 7500, 8000, 9000, 10000, 12000, 15000, 20000, 23000, 30000, 50000];
const NATIVE_CONTRACTIONS = { "word.hana": "한", "word.dul": "두", "word.set": "세", "word.net": "네" };
const COUNT_NOUN_WORD_IDS = ["word.sagwa", "word.gyul", "word.podo", "word.banana", "word.ppang", "word.tteok", "word.gamja", "word.oi"];

function composeSinoReading(value) {
  let rest = value;
  let reading = "";
  const usedWordIds = new Set();

  for (const [unit, label, wordId] of SINO_UNITS) {
    const digit = Math.floor(rest / unit);
    if (digit > 0) {
      if (digit > 1) {
        reading += SINO_DIGIT_READINGS[digit];
        if (SINO_DIGIT_WORD_IDS[digit]) usedWordIds.add(SINO_DIGIT_WORD_IDS[digit]);
      }
      reading += label;
      usedWordIds.add(wordId);
      rest %= unit;
    }
  }
  if (rest > 0) {
    reading += SINO_DIGIT_READINGS[rest];
    if (SINO_DIGIT_WORD_IDS[rest]) usedWordIds.add(SINO_DIGIT_WORD_IDS[rest]);
  }

  return { reading, wordIds: [...usedWordIds] };
}

function formatPriceDigits(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function buildSinoPriceStep() {
  const value = PRICE_POOL[Math.floor(Math.random() * PRICE_POOL.length)];
  const { reading, wordIds } = composeSinoReading(value);
  const distractorValues = shuffledCopy(PRICE_POOL.filter((candidate) => candidate !== value));
  const toReading = Math.random() < 0.5;

  if (toReading) {
    const choiceSet = createChoiceSet(
      literalChoice(reading),
      distractorValues.map((candidate) => literalChoice(composeSinoReading(candidate).reading)),
      4,
    );
    return {
      promptKey: "drill.word.prompt.priceToReading",
      promptParams: { value: formatPriceDigits(value) },
      choices: choiceSet.choices,
      answer: choiceSet.answer,
      correctKey: "drill.word.feedback.correct",
      correctParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
      incorrectKey: "drill.word.feedback.incorrect",
      incorrectParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
      wordIds,
    };
  }

  const choiceSet = createChoiceSet(
    literalChoice(`${formatPriceDigits(value)}원`),
    distractorValues.map((candidate) => literalChoice(`${formatPriceDigits(candidate)}원`)),
    4,
  );
  return {
    promptKey: "drill.word.prompt.readingToPrice",
    promptParams: { reading },
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: { hangul: `${reading} 원`, meaning: `${formatPriceDigits(value)}원` },
    wordIds,
  };
}

function buildNativeCountStep() {
  const nativePool = wordItemsByCategory("numbersNative");
  const numberItem = nativePool[Math.floor(Math.random() * nativePool.length)];
  const nounId = COUNT_NOUN_WORD_IDS[Math.floor(Math.random() * COUNT_NOUN_WORD_IDS.length)];
  const noun = WORD_ITEMS[nounId];
  const numberIndex = nativePool.indexOf(numberItem) + 1;
  const countForm = NATIVE_CONTRACTIONS[numberItem.id] || numberItem.hangul;
  const phrase = `${noun ? noun.hangul : "사과"} ${countForm} 개`;
  const digits = Array.from({ length: 10 }, (_, index) => String(index + 1));
  const choiceSet = createChoiceSet(
    literalChoice(String(numberIndex)),
    digits.filter((digit) => digit !== String(numberIndex)).map((digit) => literalChoice(digit)),
    4,
  );
  return {
    promptKey: "drill.word.prompt.countPhrase",
    promptParams: { phrase },
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey: "drill.word.feedback.correct",
    correctParams: { hangul: phrase, meaning: String(numberIndex) },
    incorrectKey: "drill.word.feedback.incorrect",
    incorrectParams: { hangul: phrase, meaning: String(numberIndex) },
    wordIds: [numberItem.id, nounId, "word.gae"].filter((wordId) => WORD_ITEMS[wordId]),
  };
}

function generateSinoSteps(data) {
  const pool = wordItemsByCategory("numbersSino");
  const count = data.stepCount || 6;
  const queue = selectWordPracticeItems(pool, count);
  return Array.from({ length: count }, () => {
    if (Math.random() < 0.5 && queue.length) return buildWordQuestion(queue.shift(), pool);
    return buildSinoPriceStep();
  });
}

function generateNativeSteps(data) {
  const pool = wordItemsByCategory("numbersNative");
  const count = data.stepCount || 6;
  const queue = selectWordPracticeItems(pool, count);
  return Array.from({ length: count }, () => {
    if (Math.random() < 0.5 && queue.length) return buildWordQuestion(queue.shift(), pool);
    return buildNativeCountStep();
  });
}

Object.assign(window.KA.drills.questions, {
  selectWordPracticeItems,
  createGeneratedWordStep,
  buildWordQuestion,
  generateWordStepsFromCategories,
  composeSinoReading,
  formatPriceDigits,
  buildSinoPriceStep,
  buildNativeCountStep,
  generateSinoSteps,
  generateNativeSteps,
});

window.KA.words = {
  items: WORD_ITEMS,
  categoryIds: WORD_CATEGORY_IDS,
  register: registerWordItems,
  byCategory: wordItemsByCategory,
  meaning: wordMeaning,
  markSeen: markWordSeen,
  markManySeen: markWordsSeen,
  recordAnswer: recordWordAnswer,
  progressEntry: wordProgressEntry,
  seen: wordSeen,
  mastered: wordMastered,
  dictionaryTotals: wordDictionaryTotals,
  dictionaryPanelSummary: wordDictionaryPanelSummary,
  dictionaryStatusKey: wordDictionaryStatusKey,
};
