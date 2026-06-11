window.KA = window.KA || {};
window.KA.drills = window.KA.drills || {};
window.KA.drills.questions = window.KA.drills.questions || {};

const HANGUL_MASTERY_CORRECT_TARGET = 3;
const HANGUL_MASTERY_STREAK_TARGET = 2;
const HANGUL_SYLLABLE_BASE_CODE = 0xac00;
const HANGUL_VOWEL_STRIDE = 28;
const HANGUL_INITIAL_STRIDE = 588;

const HANGUL_BASIC_VOWELS = [
  { id: "hangul.vowel.a", category: "basicVowels", glyph: "ㅏ", answer: "a", vowelIndex: 0 },
  { id: "hangul.vowel.ya", category: "basicVowels", glyph: "ㅑ", answer: "ya", vowelIndex: 2 },
  { id: "hangul.vowel.eo", category: "basicVowels", glyph: "ㅓ", answer: "eo", vowelIndex: 4 },
  { id: "hangul.vowel.yeo", category: "basicVowels", glyph: "ㅕ", answer: "yeo", vowelIndex: 6 },
  { id: "hangul.vowel.o", category: "basicVowels", glyph: "ㅗ", answer: "o", vowelIndex: 8 },
  { id: "hangul.vowel.yo", category: "basicVowels", glyph: "ㅛ", answer: "yo", vowelIndex: 12 },
  { id: "hangul.vowel.u", category: "basicVowels", glyph: "ㅜ", answer: "u", vowelIndex: 13 },
  { id: "hangul.vowel.yu", category: "basicVowels", glyph: "ㅠ", answer: "yu", vowelIndex: 17 },
  { id: "hangul.vowel.eu", category: "basicVowels", glyph: "ㅡ", answer: "eu", vowelIndex: 18 },
  { id: "hangul.vowel.i", category: "basicVowels", glyph: "ㅣ", answer: "i", vowelIndex: 20 },
];

const HANGUL_COMPOUND_VOWELS = [
  { id: "hangul.compoundVowel.ae", category: "compoundVowels", glyph: "ㅐ", answer: "ae", vowelIndex: 1, parts: ["ㅏ", "ㅣ"] },
  { id: "hangul.compoundVowel.yae", category: "compoundVowels", glyph: "ㅒ", answer: "yae", vowelIndex: 3, parts: ["ㅑ", "ㅣ"] },
  { id: "hangul.compoundVowel.e", category: "compoundVowels", glyph: "ㅔ", answer: "e", vowelIndex: 5, parts: ["ㅓ", "ㅣ"] },
  { id: "hangul.compoundVowel.ye", category: "compoundVowels", glyph: "ㅖ", answer: "ye", vowelIndex: 7, parts: ["ㅕ", "ㅣ"] },
  { id: "hangul.compoundVowel.wa", category: "compoundVowels", glyph: "ㅘ", answer: "wa", vowelIndex: 9, parts: ["ㅗ", "ㅏ"] },
  { id: "hangul.compoundVowel.wae", category: "compoundVowels", glyph: "ㅙ", answer: "wae", vowelIndex: 10, parts: ["ㅗ", "ㅐ"] },
  { id: "hangul.compoundVowel.oe", category: "compoundVowels", glyph: "ㅚ", answer: "oe", vowelIndex: 11, parts: ["ㅗ", "ㅣ"] },
  { id: "hangul.compoundVowel.wo", category: "compoundVowels", glyph: "ㅝ", answer: "wo", vowelIndex: 14, parts: ["ㅜ", "ㅓ"] },
  { id: "hangul.compoundVowel.we", category: "compoundVowels", glyph: "ㅞ", answer: "we", vowelIndex: 15, parts: ["ㅜ", "ㅔ"] },
  { id: "hangul.compoundVowel.wi", category: "compoundVowels", glyph: "ㅟ", answer: "wi", vowelIndex: 16, parts: ["ㅜ", "ㅣ"] },
  { id: "hangul.compoundVowel.ui", category: "compoundVowels", glyph: "ㅢ", answer: "ui", vowelIndex: 19, parts: ["ㅡ", "ㅣ"] },
];

const HANGUL_BASIC_CONSONANTS = [
  { id: "hangul.consonant.giyeok", category: "basicConsonants", glyph: "ㄱ", answer: "giyeok", sound: "g", initialIndex: 0 },
  { id: "hangul.consonant.nieun", category: "basicConsonants", glyph: "ㄴ", answer: "nieun", sound: "n", initialIndex: 2 },
  { id: "hangul.consonant.digeut", category: "basicConsonants", glyph: "ㄷ", answer: "digeut", sound: "d", initialIndex: 3 },
  { id: "hangul.consonant.rieul", category: "basicConsonants", glyph: "ㄹ", answer: "rieul", sound: "r", initialIndex: 5 },
  { id: "hangul.consonant.mieum", category: "basicConsonants", glyph: "ㅁ", answer: "mieum", sound: "m", initialIndex: 6 },
  { id: "hangul.consonant.bieup", category: "basicConsonants", glyph: "ㅂ", answer: "bieup", sound: "b", initialIndex: 7 },
  { id: "hangul.consonant.siot", category: "basicConsonants", glyph: "ㅅ", answer: "siot", sound: "s", initialIndex: 9 },
  { id: "hangul.consonant.ieung", category: "basicConsonants", glyph: "ㅇ", answer: "ieung", sound: "", initialIndex: 11 },
  { id: "hangul.consonant.jieut", category: "basicConsonants", glyph: "ㅈ", answer: "jieut", sound: "j", initialIndex: 12 },
  { id: "hangul.consonant.chieut", category: "basicConsonants", glyph: "ㅊ", answer: "chieut", sound: "ch", initialIndex: 14 },
  { id: "hangul.consonant.kieuk", category: "basicConsonants", glyph: "ㅋ", answer: "kieuk", sound: "k", initialIndex: 15 },
  { id: "hangul.consonant.tieut", category: "basicConsonants", glyph: "ㅌ", answer: "tieut", sound: "t", initialIndex: 16 },
  { id: "hangul.consonant.pieup", category: "basicConsonants", glyph: "ㅍ", answer: "pieup", sound: "p", initialIndex: 17 },
  { id: "hangul.consonant.hieut", category: "basicConsonants", glyph: "ㅎ", answer: "hieut", sound: "h", initialIndex: 18 },
];

const HANGUL_ASPIRATED_SIGNS = [
  { id: "hangul.aspirated.kieuk", category: "aspirated", glyph: "ㅋ", answer: "k", base: "ㄱ", signName: "kieuk" },
  { id: "hangul.aspirated.tieut", category: "aspirated", glyph: "ㅌ", answer: "t", base: "ㄷ", signName: "tieut" },
  { id: "hangul.aspirated.pieup", category: "aspirated", glyph: "ㅍ", answer: "p", base: "ㅂ", signName: "pieup" },
  { id: "hangul.aspirated.chieut", category: "aspirated", glyph: "ㅊ", answer: "ch", base: "ㅈ", signName: "chieut" },
];

const HANGUL_DOUBLE_CONSONANTS = [
  { id: "hangul.double.ssangGiyeok", category: "doubleConsonants", glyph: "ㄲ", answer: "kk", base: "ㄱ", signName: "ssang giyeok", initialIndex: 1 },
  { id: "hangul.double.ssangDigeut", category: "doubleConsonants", glyph: "ㄸ", answer: "tt", base: "ㄷ", signName: "ssang digeut", initialIndex: 4 },
  { id: "hangul.double.ssangBieup", category: "doubleConsonants", glyph: "ㅃ", answer: "pp", base: "ㅂ", signName: "ssang bieup", initialIndex: 8 },
  { id: "hangul.double.ssangSiot", category: "doubleConsonants", glyph: "ㅆ", answer: "ss", base: "ㅅ", signName: "ssang siot", initialIndex: 10 },
  { id: "hangul.double.ssangJieut", category: "doubleConsonants", glyph: "ㅉ", answer: "jj", base: "ㅈ", signName: "ssang jieut", initialIndex: 13 },
];

const HANGUL_FIRST_SYLLABLE_CONSONANTS = HANGUL_BASIC_CONSONANTS.filter((item) =>
  ["giyeok", "nieun", "digeut", "rieul", "mieum", "bieup", "siot", "jieut", "hieut"].includes(item.answer),
);
const HANGUL_FIRST_SYLLABLE_VOWELS = HANGUL_BASIC_VOWELS.filter((item) =>
  ["a", "eo", "o", "u", "eu", "i"].includes(item.answer),
);

function composeHangulSyllable(consonant, vowel) {
  return String.fromCharCode(HANGUL_SYLLABLE_BASE_CODE + consonant.initialIndex * HANGUL_INITIAL_STRIDE + vowel.vowelIndex * HANGUL_VOWEL_STRIDE);
}

const HANGUL_FIRST_SYLLABLES = HANGUL_FIRST_SYLLABLE_CONSONANTS.flatMap((consonant) =>
  HANGUL_FIRST_SYLLABLE_VOWELS.map((vowel) => ({
    id: `hangul.syllable.${consonant.answer}.${vowel.answer}`,
    category: "firstSyllables",
    glyph: composeHangulSyllable(consonant, vowel),
    answer: `${consonant.sound}${vowel.answer}`,
    consonant,
    vowel,
  })),
);

const HANGUL_SINGLE_BATCHIM_ITEMS = [
  { id: "hangul.batchim.gan", category: "batchim", glyph: "간", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.mun", category: "batchim", glyph: "문", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.san", category: "batchim", glyph: "산", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.nun", category: "batchim", glyph: "눈", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.son", category: "batchim", glyph: "손", answer: "final n", hasBatchim: true, finalAnswer: "final n" },
  { id: "hangul.batchim.na", category: "batchim", glyph: "나", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
  { id: "hangul.batchim.ma", category: "batchim", glyph: "마", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
  { id: "hangul.batchim.uBlock", category: "batchim", glyph: "우", answer: "no batchim", hasBatchim: false, finalAnswer: "no batchim" },
];

const HANGUL_DOUBLE_BATCHIM_ITEMS = [
  { id: "hangul.doubleBatchim.anj", category: "batchim", glyph: "앉", answer: "first final ㄴ", cluster: "ㄵ" },
  { id: "hangul.doubleBatchim.dalk", category: "batchim", glyph: "닭", answer: "second final ㄱ", cluster: "ㄺ" },
  { id: "hangul.doubleBatchim.gap", category: "batchim", glyph: "값", answer: "first final ㅂ", cluster: "ㅄ" },
];

const HANGUL_ALL_ITEMS = [
  ...HANGUL_BASIC_VOWELS,
  ...HANGUL_COMPOUND_VOWELS,
  ...HANGUL_BASIC_CONSONANTS,
  ...HANGUL_FIRST_SYLLABLES,
  ...HANGUL_ASPIRATED_SIGNS,
  ...HANGUL_DOUBLE_CONSONANTS,
  ...HANGUL_SINGLE_BATCHIM_ITEMS,
  ...HANGUL_DOUBLE_BATCHIM_ITEMS,
];

const HANGUL_ITEMS = Object.fromEntries(HANGUL_ALL_ITEMS.map((item) => [item.id, item]));

const HANGUL_DICTIONARY_CATEGORIES = [
  {
    id: "basicVowels",
    titleKey: "dictionary.hangul.category.basicVowels",
    itemIds: HANGUL_BASIC_VOWELS.map((item) => item.id),
  },
  {
    id: "compoundVowels",
    titleKey: "dictionary.hangul.category.compoundVowels",
    itemIds: HANGUL_COMPOUND_VOWELS.map((item) => item.id),
  },
  {
    id: "basicConsonants",
    titleKey: "dictionary.hangul.category.basicConsonants",
    itemIds: HANGUL_BASIC_CONSONANTS.map((item) => item.id),
  },
  {
    id: "firstSyllables",
    titleKey: "dictionary.hangul.category.firstSyllables",
    itemIds: HANGUL_FIRST_SYLLABLES.map((item) => item.id),
    encounteredOnly: true,
  },
  {
    id: "aspirated",
    titleKey: "dictionary.hangul.category.aspirated",
    itemIds: HANGUL_ASPIRATED_SIGNS.map((item) => item.id),
  },
  {
    id: "doubleConsonants",
    titleKey: "dictionary.hangul.category.doubleConsonants",
    itemIds: HANGUL_DOUBLE_CONSONANTS.map((item) => item.id),
  },
  {
    id: "batchim",
    titleKey: "dictionary.hangul.category.batchim",
    itemIds: [...HANGUL_SINGLE_BATCHIM_ITEMS, ...HANGUL_DOUBLE_BATCHIM_ITEMS].map((item) => item.id),
    encounteredOnly: true,
  },
];

function ensureHangulDictionaryEntry(itemId) {
  if (!HANGUL_ITEMS[itemId]) return null;
  if (!progress.dictionary[itemId]) {
    progress.dictionary[itemId] = {
      seen: false,
      attempts: 0,
      correct: 0,
      streak: 0,
      mastered: false,
    };
  }
  return progress.dictionary[itemId];
}

function markHangulItemSeen(itemId) {
  const entry = ensureHangulDictionaryEntry(itemId);
  if (!entry) return;
  entry.seen = true;
}

function markHangulItemsSeen(itemIds = []) {
  itemIds.forEach((itemId) => markHangulItemSeen(itemId));
}

function markStudyBoardHangulItemsSeen(studyBoardKey) {
  markHangulItemsSeen(STUDY_BOARD_DICTIONARY_ITEMS[studyBoardKey] || []);
}

function hangulStepSeenItemIds(step) {
  return [...(step.seenItemIds || []), ...(step.dictionaryItemIds || []), ...(step.hangulItemIds || [])];
}

function hangulStepMasteryItemIds(step) {
  return [...(step.masteryItemIds || []), ...(step.dictionaryItemIds || []), ...(step.hangulItemIds || [])];
}

function recordHangulAnswer(itemIds = [], correct) {
  itemIds.forEach((itemId) => {
    const entry = ensureHangulDictionaryEntry(itemId);
    if (!entry) return;
    entry.seen = true;
    entry.attempts += 1;
    if (correct) {
      entry.correct += 1;
      entry.streak += 1;
    } else {
      entry.streak = 0;
    }
    entry.mastered = entry.correct >= HANGUL_MASTERY_CORRECT_TARGET && entry.streak >= HANGUL_MASTERY_STREAK_TARGET;
  });
  scheduleSave();
}

function hangulItemProgress(itemId) {
  return progress.dictionary[itemId] || null;
}

function hangulItemSeen(itemId) {
  return !!hangulItemProgress(itemId)?.seen;
}

function hangulItemMastered(itemId) {
  return !!hangulItemProgress(itemId)?.mastered;
}

function hangulDictionaryTotals(itemIds = HANGUL_ALL_ITEMS.map((item) => item.id)) {
  return itemIds.reduce(
    (totals, itemId) => {
      totals.total += 1;
      if (hangulItemSeen(itemId)) totals.seen += 1;
      if (hangulItemMastered(itemId)) totals.mastered += 1;
      return totals;
    },
    { total: 0, seen: 0, mastered: 0 },
  );
}

function hangulDictionarySummary() {
  const totals = hangulDictionaryTotals();
  return t("dictionary.hangul.summary", totals);
}

function hangulDictionaryPanelSummary() {
  const totals = hangulDictionaryTotals();
  return t("dictionary.hangul.panelSummary", totals);
}

function shuffledCopy(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function literalChoice(value) {
  return {
    id: `literal:${value}`,
    key: "drill.hangul.choice.literal",
    params: { value },
  };
}

function keyedChoice(key, params = {}) {
  return {
    id: `key:${key}:${JSON.stringify(params)}`,
    key,
    params,
  };
}

function choiceIdentity(choice) {
  if (typeof choice === "string") return `key:${choice}`;
  return choice.id || `key:${choice.key}:${JSON.stringify(choice.params || {})}`;
}

function createChoiceSet(correctChoice, candidateChoices, count = 4) {
  const choices = [correctChoice];
  const used = new Set([choiceIdentity(correctChoice)]);

  shuffledCopy(candidateChoices).forEach((choice) => {
    if (choices.length >= count) return;
    const id = choiceIdentity(choice);
    if (used.has(id)) return;
    choices.push(choice);
    used.add(id);
  });

  return { choices, answer: 0 };
}

function hangulPracticeScore(item) {
  const entry = hangulItemProgress(item.id);
  if (!entry?.seen) return -100;
  if (!entry.mastered) return entry.correct + entry.attempts * 0.25;
  return 100 + entry.correct + entry.attempts * 0.1;
}

function selectHangulPracticeItems(items, count) {
  return shuffledCopy(items)
    .sort((left, right) => hangulPracticeScore(left) - hangulPracticeScore(right))
    .slice(0, Math.min(count, items.length));
}

function createGeneratedHangulStep({
  item,
  promptKey,
  promptParams = {},
  correctChoice,
  candidateChoices,
  correctKey = "drill.hangul.feedback.correctMatch",
  incorrectKey = "drill.hangul.feedback.incorrectMatch",
  feedbackParams = {},
  seenItemIds = [],
  masteryItemIds = null,
  choiceCount = 4,
}) {
  const choiceSet = createChoiceSet(correctChoice, candidateChoices, choiceCount);
  return {
    promptKey,
    promptParams,
    choices: choiceSet.choices,
    answer: choiceSet.answer,
    correctKey,
    correctParams: feedbackParams,
    incorrectKey,
    incorrectParams: feedbackParams,
    dictionaryItemIds: [item.id],
    seenItemIds,
    masteryItemIds: masteryItemIds || [item.id],
  };
}

function buildVowelQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.soundToVowel",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_BASIC_VOWELS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.vowelToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_BASIC_VOWELS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildConsonantQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.nameToConsonant",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_BASIC_CONSONANTS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.consonantToName",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_BASIC_CONSONANTS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildSyllableQuestion(item) {
  if (Math.random() < 0.5) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.readingToSyllable",
      promptParams: { answer: item.answer },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_FIRST_SYLLABLES.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctSyllable",
      incorrectKey: "drill.hangul.feedback.incorrectSyllable",
      feedbackParams: {
        glyph: item.glyph,
        left: item.consonant.glyph,
        right: item.vowel.glyph,
        answer: item.answer,
      },
      seenItemIds: [item.consonant.id, item.vowel.id],
    });
  }
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.syllableToSound",
    promptParams: { glyph: item.glyph, left: item.consonant.glyph, right: item.vowel.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_FIRST_SYLLABLES.map((candidate) => literalChoice(candidate.answer)),
    correctKey: "drill.hangul.feedback.correctSyllable",
    incorrectKey: "drill.hangul.feedback.incorrectSyllable",
    feedbackParams: {
      glyph: item.glyph,
      left: item.consonant.glyph,
      right: item.vowel.glyph,
      answer: item.answer,
    },
    seenItemIds: [item.consonant.id, item.vowel.id],
  });
}

function buildAspiratedQuestion(item) {
  if (Math.random() < 0.55) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.aspiratedToSign",
      promptParams: { base: item.base },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_ASPIRATED_SIGNS.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctTransform",
      incorrectKey: "drill.hangul.feedback.incorrectTransform",
      feedbackParams: { base: item.base, glyph: item.glyph, answer: item.answer },
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.aspiratedToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_ASPIRATED_SIGNS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildDoubleConsonantQuestion(item) {
  if (Math.random() < 0.55) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.doubleToSign",
      promptParams: { base: item.base },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_DOUBLE_CONSONANTS.map((candidate) => literalChoice(candidate.glyph)),
      correctKey: "drill.hangul.feedback.correctTransform",
      incorrectKey: "drill.hangul.feedback.incorrectTransform",
      feedbackParams: { base: item.base, glyph: item.glyph, answer: item.answer },
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.doubleToSound",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.answer),
    candidateChoices: HANGUL_DOUBLE_CONSONANTS.map((candidate) => literalChoice(candidate.answer)),
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildSingleBatchimQuestion(item) {
  if (Math.random() < 0.45) {
    const correctKey = item.hasBatchim ? "drill.town1.choice.hasBatchim" : "drill.town1.choice.noBatchim";
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.batchimPresence",
      promptParams: { glyph: item.glyph },
      correctChoice: keyedChoice(correctKey),
      candidateChoices: [keyedChoice("drill.town1.choice.hasBatchim"), keyedChoice("drill.town1.choice.noBatchim")],
      correctKey: "drill.hangul.feedback.correctBatchim",
      incorrectKey: "drill.hangul.feedback.incorrectBatchim",
      feedbackParams: { glyph: item.glyph, answer: item.answer },
      choiceCount: 2,
    });
  }

  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.batchimFinal",
    promptParams: { glyph: item.glyph },
    correctChoice: literalChoice(item.finalAnswer),
    candidateChoices: ["final n", "final k", "final p", "no batchim"].map((value) => literalChoice(value)),
    correctKey: "drill.hangul.feedback.correctBatchim",
    incorrectKey: "drill.hangul.feedback.incorrectBatchim",
    feedbackParams: { glyph: item.glyph, answer: item.answer },
  });
}

function buildDoubleBatchimQuestion(item) {
  const answerKey = item.answer.startsWith("first") ? "drill.town1.choice.firstFinal" : "drill.town1.choice.secondFinal";
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.doubleBatchimFinal",
    promptParams: { glyph: item.glyph, cluster: item.cluster },
    correctChoice: keyedChoice(answerKey),
    candidateChoices: [
      keyedChoice("drill.town1.choice.firstFinal"),
      keyedChoice("drill.town1.choice.secondFinal"),
      keyedChoice("drill.town1.choice.wordDecides"),
    ],
    correctKey: "drill.hangul.feedback.correctBatchim",
    incorrectKey: "drill.hangul.feedback.incorrectBatchim",
    feedbackParams: { glyph: item.glyph, answer: item.answer },
    choiceCount: 3,
  });
}

function buildCompoundVowelQuestion(item) {
  const variant = Math.floor(Math.random() * 3);

  if (variant === 0) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.vowelToSound",
      promptParams: { glyph: item.glyph },
      correctChoice: literalChoice(item.answer),
      candidateChoices: HANGUL_COMPOUND_VOWELS.map((candidate) => literalChoice(candidate.answer)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }

  if (variant === 1) {
    return createGeneratedHangulStep({
      item,
      promptKey: "drill.hangul.prompt.compoundCombine",
      promptParams: { left: item.parts[0], right: item.parts[1] },
      correctChoice: literalChoice(item.glyph),
      candidateChoices: HANGUL_COMPOUND_VOWELS.map((candidate) => literalChoice(candidate.glyph)),
      feedbackParams: { glyph: item.glyph, answer: item.answer },
    });
  }

  const consonant = shuffledCopy(
    HANGUL_BASIC_CONSONANTS.filter((candidate) => ["ieung", "giyeok", "nieun", "mieum"].includes(candidate.answer)),
  )[0];
  const syllable = composeHangulSyllable(consonant, item);
  const reading = `${consonant.sound}${item.answer}`;
  const candidateReadings = HANGUL_COMPOUND_VOWELS.map((candidate) =>
    literalChoice(`${consonant.sound}${candidate.answer}`),
  );
  return createGeneratedHangulStep({
    item,
    promptKey: "drill.hangul.prompt.syllableToSound",
    promptParams: { left: consonant.glyph, right: item.glyph, glyph: syllable },
    correctChoice: literalChoice(reading),
    candidateChoices: candidateReadings,
    correctKey: "drill.hangul.feedback.correctSyllable",
    incorrectKey: "drill.hangul.feedback.incorrectSyllable",
    feedbackParams: { left: consonant.glyph, right: item.glyph, glyph: syllable, answer: reading },
  });
}

function buildHangulQuestionForItem(item) {
  if (item.category === "basicVowels") return buildVowelQuestion(item);
  if (item.category === "compoundVowels") return buildCompoundVowelQuestion(item);
  if (item.category === "basicConsonants") return buildConsonantQuestion(item);
  if (item.category === "firstSyllables") return buildSyllableQuestion(item);
  if (item.category === "aspirated") return buildAspiratedQuestion(item);
  if (item.category === "doubleConsonants") return buildDoubleConsonantQuestion(item);
  if (item.cluster) return buildDoubleBatchimQuestion(item);
  return buildSingleBatchimQuestion(item);
}

function generateHangulStepsFromPool(items, data) {
  const count = data.stepCount || Math.min(5, items.length);
  return selectHangulPracticeItems(items, count).map((item) => buildHangulQuestionForItem(item));
}

Object.assign(window.KA.drills.questions, {
  shuffledCopy,
  literalChoice,
  keyedChoice,
  choiceIdentity,
  createChoiceSet,
  createGeneratedHangulStep,
  buildHangulQuestionForItem,
  generateHangulStepsFromPool,
});

window.KA.hangul = {
  items: HANGUL_ITEMS,
  allItems: HANGUL_ALL_ITEMS,
  dictionaryCategories: HANGUL_DICTIONARY_CATEGORIES,
  composeHangulSyllable,
  markItemSeen: markHangulItemSeen,
  markItemsSeen: markHangulItemsSeen,
  markStudyBoardItemsSeen: markStudyBoardHangulItemsSeen,
  recordAnswer: recordHangulAnswer,
  itemProgress: hangulItemProgress,
  itemSeen: hangulItemSeen,
  itemMastered: hangulItemMastered,
  dictionaryTotals: hangulDictionaryTotals,
  dictionarySummary: hangulDictionarySummary,
  dictionaryPanelSummary: hangulDictionaryPanelSummary,
};
