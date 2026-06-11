window.KA = window.KA || {};
window.KA.drills = window.KA.drills || {};
window.KA.drills.questions = window.KA.drills.questions || {};

const SENTENCE_TEMPLATES = {};

const DRILLS = {
  alphabetBlocks: {
    titleKey: "drill.alphabetBlocks.title",
    steps: [
      {
        promptKey: "drill.alphabetBlocks.1.prompt",
        choices: [
          "drill.alphabetBlocks.1.choice.a",
          "drill.alphabetBlocks.1.choice.b",
          "drill.alphabetBlocks.1.choice.c",
        ],
        answer: 0,
        correctKey: "drill.alphabetBlocks.1.correct",
        incorrectKey: "drill.alphabetBlocks.1.incorrect",
      },
      {
        promptKey: "drill.alphabetBlocks.2.prompt",
        choices: [
          "drill.alphabetBlocks.2.choice.a",
          "drill.alphabetBlocks.2.choice.b",
          "drill.alphabetBlocks.2.choice.c",
        ],
        answer: 1,
        correctKey: "drill.alphabetBlocks.2.correct",
        incorrectKey: "drill.alphabetBlocks.2.incorrect",
      },
      {
        promptKey: "drill.alphabetBlocks.3.prompt",
        choices: [
          "drill.alphabetBlocks.3.choice.a",
          "drill.alphabetBlocks.3.choice.b",
          "drill.alphabetBlocks.3.choice.c",
        ],
        answer: 0,
        correctKey: "drill.alphabetBlocks.3.correct",
        incorrectKey: "drill.alphabetBlocks.3.incorrect",
      },
    ],
  },
  soundFountain: {
    titleKey: "drill.soundFountain.title",
    steps: [
      {
        promptKey: "drill.soundFountain.1.prompt",
        choices: [
          "drill.soundFountain.1.choice.a",
          "drill.soundFountain.1.choice.b",
          "drill.soundFountain.1.choice.c",
          "drill.soundFountain.1.choice.d",
        ],
        answer: 0,
        correctKey: "drill.soundFountain.1.correct",
        incorrectKey: "drill.soundFountain.1.incorrect",
      },
      {
        promptKey: "drill.soundFountain.2.prompt",
        choices: [
          "drill.soundFountain.2.choice.a",
          "drill.soundFountain.2.choice.b",
          "drill.soundFountain.2.choice.c",
          "drill.soundFountain.2.choice.d",
        ],
        answer: 2,
        correctKey: "drill.soundFountain.2.correct",
        incorrectKey: "drill.soundFountain.2.incorrect",
      },
      {
        promptKey: "drill.soundFountain.3.prompt",
        choices: [
          "drill.soundFountain.3.choice.a",
          "drill.soundFountain.3.choice.b",
          "drill.soundFountain.3.choice.c",
          "drill.soundFountain.3.choice.d",
        ],
        answer: 3,
        correctKey: "drill.soundFountain.3.correct",
        incorrectKey: "drill.soundFountain.3.incorrect",
      },
    ],
  },
  town1FountainVowels: {
    titleKey: "drill.town1FountainVowels.title",
    completionFlags: ["town1.vowelPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainVowels.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.i",
        ],
        answer: 0,
        correctKey: "drill.town1FountainVowels.1.correct",
        incorrectKey: "drill.town1FountainVowels.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.2.prompt",
        choices: [
          "drill.town1.choice.o",
          "drill.town1.choice.eo",
          "drill.town1.choice.u",
          "drill.town1.choice.eu",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.2.correct",
        incorrectKey: "drill.town1FountainVowels.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.3.prompt",
        choices: [
          "drill.town1.choice.yo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
          "drill.town1.choice.eo",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.3.correct",
        incorrectKey: "drill.town1FountainVowels.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainVowels.4.prompt",
        choices: [
          "drill.town1.choice.eu",
          "drill.town1.choice.u",
          "drill.town1.choice.a",
          "drill.town1.choice.o",
        ],
        answer: 1,
        correctKey: "drill.town1FountainVowels.4.correct",
        incorrectKey: "drill.town1FountainVowels.4.incorrect",
      },
    ],
  },
  town1FountainConsonants: {
    titleKey: "drill.town1FountainConsonants.title",
    completionFlags: ["town1.consonantPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainConsonants.1.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 0,
        correctKey: "drill.town1FountainConsonants.1.correct",
        incorrectKey: "drill.town1FountainConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.2.prompt",
        choices: [
          "drill.town1.choice.digeut",
          "drill.town1.choice.nieun",
          "drill.town1.choice.rieul",
          "drill.town1.choice.giyeok",
        ],
        answer: 1,
        correctKey: "drill.town1FountainConsonants.2.correct",
        incorrectKey: "drill.town1FountainConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.3.prompt",
        choices: [
          "drill.town1.choice.siot",
          "drill.town1.choice.digeut",
          "drill.town1.choice.bieup",
          "drill.town1.choice.rieul",
        ],
        answer: 1,
        correctKey: "drill.town1FountainConsonants.3.correct",
        incorrectKey: "drill.town1FountainConsonants.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainConsonants.4.prompt",
        choices: [
          "drill.town1.choice.mieum",
          "drill.town1.choice.bieup",
          "drill.town1.choice.nieun",
          "drill.town1.choice.siot",
        ],
        answer: 0,
        correctKey: "drill.town1FountainConsonants.4.correct",
        incorrectKey: "drill.town1FountainConsonants.4.incorrect",
      },
    ],
  },
  town1FountainReview: {
    titleKey: "drill.town1FountainReview.title",
    steps: [
      {
        promptKey: "drill.town1FountainReview.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
          "drill.town1.choice.eo",
        ],
        answer: 1,
        correctKey: "drill.town1FountainReview.1.correct",
        incorrectKey: "drill.town1FountainReview.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.2.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 1,
        correctKey: "drill.town1FountainReview.2.correct",
        incorrectKey: "drill.town1FountainReview.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.3.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.na",
          "drill.town1.choice.da",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1FountainReview.3.correct",
        incorrectKey: "drill.town1FountainReview.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainReview.4.prompt",
        choices: [
          "drill.town1.choice.mu",
          "drill.town1.choice.no",
          "drill.town1.choice.gu",
          "drill.town1.choice.du",
        ],
        answer: 0,
        correctKey: "drill.town1FountainReview.4.correct",
        incorrectKey: "drill.town1FountainReview.4.incorrect",
      },
    ],
  },
  town1DeskSyllables: {
    titleKey: "drill.town1DeskSyllables.title",
    completionFlags: ["town1.firstSyllablePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1DeskSyllables.1.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.na",
          "drill.town1.choice.da",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.1.correct",
        incorrectKey: "drill.town1DeskSyllables.1.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.2.prompt",
        choices: [
          "drill.town1.choice.geo",
          "drill.town1.choice.neo",
          "drill.town1.choice.no",
          "drill.town1.choice.mu",
        ],
        answer: 1,
        correctKey: "drill.town1DeskSyllables.2.correct",
        incorrectKey: "drill.town1DeskSyllables.2.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.3.prompt",
        choices: [
          "drill.town1.choice.do",
          "drill.town1.choice.du",
          "drill.town1.choice.da",
          "drill.town1.choice.to",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.3.correct",
        incorrectKey: "drill.town1DeskSyllables.3.incorrect",
      },
      {
        promptKey: "drill.town1DeskSyllables.4.prompt",
        choices: [
          "drill.town1.choice.mu",
          "drill.town1.choice.gu",
          "drill.town1.choice.no",
          "drill.town1.choice.du",
        ],
        answer: 0,
        correctKey: "drill.town1DeskSyllables.4.correct",
        incorrectKey: "drill.town1DeskSyllables.4.incorrect",
      },
    ],
  },
  town1BlackboardVowels: {
    titleKey: "drill.town1BlackboardVowels.title",
    completionFlags: ["town1.vowelExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardVowels.1.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardVowels.1.correct",
        incorrectKey: "drill.town1BlackboardVowels.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardVowels.2.prompt",
        choices: [
          "drill.town1.choice.a",
          "drill.town1.choice.eo",
          "drill.town1.choice.o",
          "drill.town1.choice.u",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardVowels.2.correct",
        incorrectKey: "drill.town1BlackboardVowels.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardVowels.3.prompt",
        choices: [
          "drill.town1.choice.o",
          "drill.town1.choice.eu",
          "drill.town1.choice.u",
          "drill.town1.choice.i",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardVowels.3.correct",
        incorrectKey: "drill.town1BlackboardVowels.3.incorrect",
      },
    ],
  },
  town1BlackboardConsonants: {
    titleKey: "drill.town1BlackboardConsonants.title",
    completionFlags: ["town1.consonantExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardConsonants.1.prompt",
        choices: [
          "drill.town1.choice.giyeok",
          "drill.town1.choice.nieun",
          "drill.town1.choice.digeut",
          "drill.town1.choice.mieum",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardConsonants.1.correct",
        incorrectKey: "drill.town1BlackboardConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardConsonants.2.prompt",
        choices: [
          "drill.town1.choice.digeut",
          "drill.town1.choice.nieun",
          "drill.town1.choice.rieul",
          "drill.town1.choice.siot",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardConsonants.2.correct",
        incorrectKey: "drill.town1BlackboardConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardConsonants.3.prompt",
        choices: [
          "drill.town1.choice.bieup",
          "drill.town1.choice.mieum",
          "drill.town1.choice.siot",
          "drill.town1.choice.rieul",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardConsonants.3.correct",
        incorrectKey: "drill.town1BlackboardConsonants.3.incorrect",
      },
    ],
  },
  town1BlackboardSyllables: {
    titleKey: "drill.town1BlackboardSyllables.title",
    completionFlags: ["town1.firstSyllablesPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardSyllables.1.prompt",
        choices: [
          "drill.town1.choice.ga",
          "drill.town1.choice.geo",
          "drill.town1.choice.no",
          "drill.town1.choice.mu",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardSyllables.1.correct",
        incorrectKey: "drill.town1BlackboardSyllables.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardSyllables.2.prompt",
        choices: [
          "drill.town1.choice.na",
          "drill.town1.choice.neo",
          "drill.town1.choice.geo",
          "drill.town1.choice.no",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardSyllables.2.correct",
        incorrectKey: "drill.town1BlackboardSyllables.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardSyllables.3.prompt",
        choices: [
          "drill.town1.choice.do",
          "drill.town1.choice.du",
          "drill.town1.choice.to",
          "drill.town1.choice.da",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardSyllables.3.correct",
        incorrectKey: "drill.town1BlackboardSyllables.3.incorrect",
      },
    ],
  },
  town1FountainAspirated: {
    titleKey: "drill.town1FountainAspirated.title",
    completionFlags: ["town1.aspiratedPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainAspirated.1.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 0,
        correctKey: "drill.town1FountainAspirated.1.correct",
        incorrectKey: "drill.town1FountainAspirated.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.2.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1FountainAspirated.2.correct",
        incorrectKey: "drill.town1FountainAspirated.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.3.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainAspirated.3.correct",
        incorrectKey: "drill.town1FountainAspirated.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainAspirated.4.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 3,
        correctKey: "drill.town1FountainAspirated.4.correct",
        incorrectKey: "drill.town1FountainAspirated.4.incorrect",
      },
    ],
  },
  town1BlackboardAspirated: {
    titleKey: "drill.town1BlackboardAspirated.title",
    completionFlags: ["town1.aspiratedExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardAspirated.1.prompt",
        choices: [
          "drill.town1.choice.k",
          "drill.town1.choice.g",
          "drill.town1.choice.h",
          "drill.town1.choice.t",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardAspirated.1.correct",
        incorrectKey: "drill.town1BlackboardAspirated.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardAspirated.2.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardAspirated.2.correct",
        incorrectKey: "drill.town1BlackboardAspirated.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardAspirated.3.prompt",
        choices: [
          "drill.town1.choice.kieukSign",
          "drill.town1.choice.tieutSign",
          "drill.town1.choice.pieupSign",
          "drill.town1.choice.chieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardAspirated.3.correct",
        incorrectKey: "drill.town1BlackboardAspirated.3.incorrect",
      },
    ],
  },
  town1FountainDoubleConsonants: {
    titleKey: "drill.town1FountainDoubleConsonants.title",
    completionFlags: ["town1.doubleConsonantPracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainDoubleConsonants.1.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangSiotSign",
        ],
        answer: 0,
        correctKey: "drill.town1FountainDoubleConsonants.1.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.2.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1FountainDoubleConsonants.2.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.3.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangSiotSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainDoubleConsonants.3.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.3.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.4.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangSiotSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1FountainDoubleConsonants.4.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.4.incorrect",
      },
      {
        promptKey: "drill.town1FountainDoubleConsonants.5.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 3,
        correctKey: "drill.town1FountainDoubleConsonants.5.correct",
        incorrectKey: "drill.town1FountainDoubleConsonants.5.incorrect",
      },
    ],
  },
  town1BlackboardDoubleConsonants: {
    titleKey: "drill.town1BlackboardDoubleConsonants.title",
    completionFlags: ["town1.doubleConsonantExamPassed"],
    steps: [
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.1.prompt",
        choices: [
          "drill.town1.choice.kk",
          "drill.town1.choice.k",
          "drill.town1.choice.g",
          "drill.town1.choice.h",
        ],
        answer: 0,
        correctKey: "drill.town1BlackboardDoubleConsonants.1.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.1.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.2.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangBieupSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 1,
        correctKey: "drill.town1BlackboardDoubleConsonants.2.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.2.incorrect",
      },
      {
        promptKey: "drill.town1BlackboardDoubleConsonants.3.prompt",
        choices: [
          "drill.town1.choice.ssangGiyeokSign",
          "drill.town1.choice.ssangDigeutSign",
          "drill.town1.choice.ssangSiotSign",
          "drill.town1.choice.ssangJieutSign",
        ],
        answer: 2,
        correctKey: "drill.town1BlackboardDoubleConsonants.3.correct",
        incorrectKey: "drill.town1BlackboardDoubleConsonants.3.incorrect",
      },
    ],
  },
  town1FountainBatchimSingle: {
    titleKey: "drill.town1FountainBatchimSingle.title",
    completionFlags: ["town1.batchimSinglePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainBatchimSingle.1.prompt",
        choices: [
          "drill.town1.choice.hasBatchim",
          "drill.town1.choice.noBatchim",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimSingle.1.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimSingle.2.prompt",
        choices: [
          "drill.town1.choice.finalN",
          "drill.town1.choice.finalK",
          "drill.town1.choice.finalP",
          "drill.town1.choice.noBatchim",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimSingle.2.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimSingle.3.prompt",
        choices: [
          "drill.town1.choice.gan",
          "drill.town1.choice.mun",
          "drill.town1.choice.naBlock",
          "drill.town1.choice.gap",
        ],
        answer: 2,
        correctKey: "drill.town1FountainBatchimSingle.3.correct",
        incorrectKey: "drill.town1FountainBatchimSingle.3.incorrect",
      },
    ],
  },
  town1FountainBatchimDouble: {
    titleKey: "drill.town1FountainBatchimDouble.title",
    completionFlags: ["town1.batchimDoublePracticePassed1"],
    steps: [
      {
        promptKey: "drill.town1FountainBatchimDouble.1.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 0,
        correctKey: "drill.town1FountainBatchimDouble.1.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.1.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimDouble.2.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 1,
        correctKey: "drill.town1FountainBatchimDouble.2.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.2.incorrect",
      },
      {
        promptKey: "drill.town1FountainBatchimDouble.3.prompt",
        choices: [
          "drill.town1.choice.firstFinal",
          "drill.town1.choice.secondFinal",
          "drill.town1.choice.wordDecides",
        ],
        answer: 2,
        correctKey: "drill.town1FountainBatchimDouble.3.correct",
        incorrectKey: "drill.town1FountainBatchimDouble.3.incorrect",
      },
    ],
  },
  batchimBridge: {
    titleKey: "drill.batchimBridge.title",
    steps: [
      {
        promptKey: "drill.batchimBridge.1.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 0,
        correctKey: "drill.batchimBridge.1.correct",
        incorrectKey: "drill.batchimBridge.1.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.2.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 1,
        correctKey: "drill.batchimBridge.2.correct",
        incorrectKey: "drill.batchimBridge.2.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.3.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 1,
        correctKey: "drill.batchimBridge.3.correct",
        incorrectKey: "drill.batchimBridge.3.incorrect",
      },
      {
        promptKey: "drill.batchimBridge.4.prompt",
        choices: ["drill.batchimBridge.choice.no", "drill.batchimBridge.choice.yes"],
        answer: 0,
        correctKey: "drill.batchimBridge.4.correct",
        incorrectKey: "drill.batchimBridge.4.incorrect",
      },
    ],
  },
  sentenceBlocks: {
    titleKey: "drill.sentenceBlocks.title",
    steps: [
      {
        promptKey: "drill.sentenceBlocks.1.prompt",
        choices: [
          "drill.sentenceBlocks.1.choice.a",
          "drill.sentenceBlocks.1.choice.b",
          "drill.sentenceBlocks.1.choice.c",
        ],
        answer: 0,
        correctKey: "drill.sentenceBlocks.1.correct",
        incorrectKey: "drill.sentenceBlocks.1.incorrect",
      },
      {
        promptKey: "drill.sentenceBlocks.2.prompt",
        choices: [
          "drill.sentenceBlocks.2.choice.a",
          "drill.sentenceBlocks.2.choice.b",
          "drill.sentenceBlocks.2.choice.c",
        ],
        answer: 1,
        correctKey: "drill.sentenceBlocks.2.correct",
        incorrectKey: "drill.sentenceBlocks.2.incorrect",
      },
      {
        promptKey: "drill.sentenceBlocks.3.prompt",
        choices: [
          "drill.sentenceBlocks.3.choice.a",
          "drill.sentenceBlocks.3.choice.b",
          "drill.sentenceBlocks.3.choice.c",
        ],
        answer: 0,
        correctKey: "drill.sentenceBlocks.3.correct",
        incorrectKey: "drill.sentenceBlocks.3.incorrect",
      },
    ],
  },
  routeNames: {
    titleKey: "drill.routeNames.title",
    steps: [
      {
        promptKey: "drill.routeNames.1.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 1,
        correctKey: "drill.routeNames.1.correct",
        incorrectKey: "drill.routeNames.1.incorrect",
      },
      {
        promptKey: "drill.routeNames.2.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 0,
        correctKey: "drill.routeNames.2.correct",
        incorrectKey: "drill.routeNames.2.incorrect",
      },
      {
        promptKey: "drill.routeNames.3.prompt",
        choices: [
          "drill.routeNames.choice.minsu",
          "drill.routeNames.choice.jiu",
          "drill.routeNames.choice.hana",
        ],
        answer: 2,
        correctKey: "drill.routeNames.3.correct",
        incorrectKey: "drill.routeNames.3.incorrect",
      },
    ],
  },
  objectLabels: {
    titleKey: "drill.objectLabels.title",
    steps: [
      {
        promptKey: "drill.objectLabels.1.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 0,
        correctKey: "drill.objectLabels.1.correct",
        incorrectKey: "drill.objectLabels.1.incorrect",
      },
      {
        promptKey: "drill.objectLabels.2.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 1,
        correctKey: "drill.objectLabels.2.correct",
        incorrectKey: "drill.objectLabels.2.incorrect",
      },
      {
        promptKey: "drill.objectLabels.3.prompt",
        choices: [
          "drill.objectLabels.choice.book",
          "drill.objectLabels.choice.water",
          "drill.objectLabels.choice.bag",
        ],
        answer: 2,
        correctKey: "drill.objectLabels.3.correct",
        incorrectKey: "drill.objectLabels.3.incorrect",
      },
    ],
  },
  actionPath: {
    titleKey: "drill.actionPath.title",
    steps: [
      {
        promptKey: "drill.actionPath.1.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 1,
        correctKey: "drill.actionPath.1.correct",
        incorrectKey: "drill.actionPath.1.incorrect",
      },
      {
        promptKey: "drill.actionPath.2.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 0,
        correctKey: "drill.actionPath.2.correct",
        incorrectKey: "drill.actionPath.2.incorrect",
      },
      {
        promptKey: "drill.actionPath.3.prompt",
        choices: [
          "drill.actionPath.choice.drinkWater",
          "drill.actionPath.choice.readBook",
          "drill.actionPath.choice.eatApple",
        ],
        answer: 2,
        correctKey: "drill.actionPath.3.correct",
        incorrectKey: "drill.actionPath.3.incorrect",
      },
    ],
  },
};

function registerDrills(drills = {}) {
  Object.assign(DRILLS, drills);
}

function buildOrderStepFromSentence({
  promptKey = "drill.order.prompt",
  promptParams = null,
  chunks,
  correctKey = "drill.order.correct",
  incorrectKey = "drill.order.incorrect",
  correctParams = null,
  incorrectParams = null,
  wordIds = [],
  hangulItemIds = [],
  teaches = [],
}) {
  return {
    kind: "order",
    promptKey,
    promptParams,
    chunks: [...chunks],
    correctKey,
    incorrectKey,
    correctParams,
    incorrectParams,
    wordIds: [...wordIds],
    hangulItemIds: [...hangulItemIds],
    teaches: [...teaches],
  };
}

function registerSentenceTemplates(chapterId, templates = []) {
  if (!chapterId || !Array.isArray(templates)) return;
  if (!SENTENCE_TEMPLATES[chapterId]) SENTENCE_TEMPLATES[chapterId] = [];
  SENTENCE_TEMPLATES[chapterId].push(
    ...templates
      .filter((template) => Array.isArray(template.chunks) && template.chunks.length > 1)
      .map((template) => ({
        ...template,
        chunks: [...template.chunks],
        wordIds: [...(template.wordIds || [])],
        hangulItemIds: [...(template.hangulItemIds || [])],
        teaches: [...(template.teaches || [])],
      })),
  );
}

function sentenceTemplatesByChapter(chapterId) {
  return [...(SENTENCE_TEMPLATES[chapterId] || [])];
}

function sentenceTemplateWeaknessScore(template) {
  const wordIds = template.wordIds || [];
  if (!wordIds.length) return 0;

  return wordIds.reduce((score, wordId) => {
    const entry = typeof wordProgressEntry === "function" ? wordProgressEntry(wordId) : null;
    if (!entry?.seen) return score - 8;
    if (!entry.mastered) return score - 2 + entry.attempts * 0.1;
    return score + 4 + entry.attempts * 0.05;
  }, 0);
}

function selectSentenceTemplates(chapterIds, count) {
  const ids = Array.isArray(chapterIds) ? chapterIds : Object.keys(SENTENCE_TEMPLATES);
  const templates = ids.flatMap((chapterId) => sentenceTemplatesByChapter(chapterId));
  if (!templates.length) return [];

  return shuffledCopy(templates)
    .sort((left, right) => sentenceTemplateWeaknessScore(left) - sentenceTemplateWeaknessScore(right))
    .slice(0, Math.min(count, templates.length));
}

function generateOrderStepsFromTemplates({
  chapterIds = null,
  count = 4,
  promptKey = "drill.order.prompt",
} = {}) {
  return selectSentenceTemplates(chapterIds, count).map((template) =>
    buildOrderStepFromSentence({
      promptKey: template.promptKey || promptKey,
      promptParams: template.promptParams || null,
      chunks: template.chunks,
      correctKey: template.correctKey || "drill.order.correct",
      incorrectKey: template.incorrectKey || "drill.order.incorrect",
      correctParams: template.correctParams || null,
      incorrectParams: template.incorrectParams || null,
      wordIds: template.wordIds || [],
      hangulItemIds: template.hangulItemIds || [],
      teaches: template.teaches || [],
    }),
  );
}

function mergeExternalDrillPacks() {
  const packs = window.KOREA_ADVENTURE_DRILL_PACKS || [];

  packs.forEach((pack) => {
    window.KA.text.register(pack.text || {});
    registerDrills(pack.drills || {});
    registerWordItems(pack.words || []);
  });
}

mergeExternalDrillPacks();

function selectDrillSteps(data) {
  if (typeof data.generateSteps === "function") return data.generateSteps(data);

  const steps = data.steps || [];
  const targetCount = Math.min(data.stepCount || steps.length, steps.length);
  if (targetCount <= 0) return [];

  const indexedSteps = steps.map((step, index) => ({ step, index }));
  const selected = [];
  const usedIndexes = new Set();
  const difficultyMix = data.difficultyMix || {};

  Object.entries(difficultyMix).forEach(([difficulty, count]) => {
    const candidates = shuffledCopy(
      indexedSteps.filter(({ step, index }) => step.difficulty === difficulty && !usedIndexes.has(index)),
    );

    candidates.slice(0, count).forEach(({ step, index }) => {
      selected.push(step);
      usedIndexes.add(index);
    });
  });

  if (selected.length < targetCount) {
    shuffledCopy(indexedSteps.filter(({ index }) => !usedIndexes.has(index)))
      .slice(0, targetCount - selected.length)
      .forEach(({ step, index }) => {
        selected.push(step);
        usedIndexes.add(index);
      });
  }

  return data.shuffleSteps === false ? selected : shuffledCopy(selected);
}

function drillStepKind(step) {
  return step?.kind || "choice";
}

function isOrderDrillStep(step) {
  return drillStepKind(step) === "order";
}

function prepareOrderDrillStep(step) {
  return {
    ...step,
    kind: "order",
    chunks: [...(step.chunks || [])],
    wordIds: [...(step.wordIds || [])],
    hangulItemIds: [...(step.hangulItemIds || [])],
    incorrectParams: {
      ...(step.incorrectParams || {}),
      answer: (step.chunks || []).join(" "),
    },
  };
}

function prepareChoiceDrillStep(step, data) {
  const prepared = {
    ...step,
    choices: [...step.choices],
  };

  const shouldShuffleChoices = step.shuffleChoices ?? data.shuffleChoices;
  if (!shouldShuffleChoices) return prepared;

  const correctChoice = prepared.choices[prepared.answer];
  prepared.choices = shuffledCopy(prepared.choices);
  prepared.answer = prepared.choices.indexOf(correctChoice);

  return prepared;
}

function prepareDrillStep(step, data) {
  if (isOrderDrillStep(step)) return prepareOrderDrillStep(step);
  return prepareChoiceDrillStep(step, data);
}

function buildDrillRun(data) {
  return {
    ...data,
    steps: selectDrillSteps(data).map((step) => prepareDrillStep(step, data)),
  };
}

function createOrderDrillState(step) {
  const chunks = step.chunks.map((text, index) => ({ id: index, text }));
  return {
    available: shuffledCopy(chunks),
    placed: [],
    zone: "available",
    selectedAvailable: 0,
    selectedPlaced: 0,
  };
}

function resetDrillStepState() {
  const step = currentDrillStep();
  drill.selected = 0;
  drill.orderState = isOrderDrillStep(step) ? createOrderDrillState(step) : null;
}

function currentOrderDrillState() {
  return drill?.orderState || null;
}

function startDrill(drillKey) {
  const data = DRILLS[drillKey];
  if (!data) return;
  const runData = buildDrillRun(data);
  if (!runData.steps.length) return;
  markHangulItemsSeen(runData.steps.flatMap((step) => hangulStepSeenItemIds(step)));
  markWordsSeen(runData.steps.flatMap((step) => step.wordIds || []));
  markWordsSeen(runData.wordIds || []);

  stopSpeech();
  dialog = null;
  drill = {
    key: drillKey,
    data: runData,
    index: 0,
    selected: 0,
    answered: false,
    complete: false,
    feedbackKey: null,
    feedbackParams: null,
    correctCount: 0,
    passed: false,
    completionApplied: false,
    orderState: null,
  };
  resetDrillStepState();
  clearMovementInput();
}

function currentDrillData() {
  return drill ? drill.data : null;
}

function currentDrillStep() {
  const data = currentDrillData();
  if (!data || drill.complete) return null;
  return data.steps[drill.index] || null;
}

function closeDrill() {
  drill = null;
  clearMovementInput();
}

function advanceDrill() {
  const data = currentDrillData();
  if (!data) return;

  if (drill.index >= data.steps.length - 1) {
    completeDrillRun();
    return;
  }

  drill.index += 1;
  drill.answered = false;
  drill.feedbackKey = null;
  drill.feedbackParams = null;
  resetDrillStepState();
}

function drillPassThreshold(data) {
  return data.passCorrectCount ?? data.steps.length;
}

function drillRunPassed() {
  const data = currentDrillData();
  if (!data) return false;
  return drill.correctCount >= drillPassThreshold(data);
}

function completeDrillRun() {
  const data = currentDrillData();
  if (!data) return;

  drill.complete = true;
  drill.answered = false;
  drill.feedbackKey = null;
  drill.feedbackParams = null;
  drill.passed = drillRunPassed();

  if (!drill.completionApplied) {
    if (drill.passed) setProgressFlags(data.completionFlags || []);
    drill.completionApplied = true;
  }
}

function orderDrillAnswerText() {
  return (currentOrderDrillState()?.placed || []).map((chunk) => chunk.text).join(" ");
}

function orderDrillStepCorrect(step) {
  const placed = currentOrderDrillState()?.placed || [];
  if (placed.length !== step.chunks.length) return false;
  return placed.every((chunk, index) => chunk.text === step.chunks[index]);
}

function drillStepCorrect(step) {
  if (isOrderDrillStep(step)) return orderDrillStepCorrect(step);
  return drill.selected === step.answer;
}

function answerDrillStep() {
  const step = currentDrillStep();
  if (!step || drill.answered) return;

  const correct = drillStepCorrect(step);
  if (correct) drill.correctCount += 1;
  recordHangulAnswer(hangulStepMasteryItemIds(step), correct);
  recordWordAnswer(step.wordIds || [], correct);
  drill.answered = true;
  drill.feedbackKey = correct ? step.correctKey : step.incorrectKey;
  drill.feedbackParams = correct ? step.correctParams : step.incorrectParams;
}

function moveDrillCursor(delta) {
  const step = currentDrillStep();
  if (!step || drill.answered) return;

  if (isOrderDrillStep(step)) {
    moveOrderDrillCursor(delta);
    return;
  }

  const count = step.choices.length;
  drill.selected = (drill.selected + delta + count) % count;
}

function orderStateActiveRow() {
  const state = currentOrderDrillState();
  if (!state) return [];
  return state.zone === "placed" ? state.placed : state.available;
}

function clampOrderSelection() {
  const state = currentOrderDrillState();
  if (!state) return;
  state.selectedAvailable = Math.max(0, Math.min(state.selectedAvailable, state.available.length - 1));
  state.selectedPlaced = Math.max(0, Math.min(state.selectedPlaced, state.placed.length - 1));
  if (state.zone === "placed" && !state.placed.length) state.zone = "available";
  if (state.zone === "available" && !state.available.length && state.placed.length) state.zone = "placed";
}

function moveOrderDrillCursor(delta) {
  const state = currentOrderDrillState();
  if (!state) return;

  if (state.zone === "placed") {
    const count = state.placed.length;
    if (count) state.selectedPlaced = (state.selectedPlaced + delta + count) % count;
    return;
  }

  const count = state.available.length;
  if (count) state.selectedAvailable = (state.selectedAvailable + delta + count) % count;
}

function switchOrderDrillZone(targetZone) {
  const state = currentOrderDrillState();
  if (!state) return;
  if (targetZone === "placed" && !state.placed.length) return;
  if (targetZone === "available" && !state.available.length) return;
  state.zone = targetZone;
  clampOrderSelection();
}

function placeOrderDrillChunk() {
  const state = currentOrderDrillState();
  if (!state || !state.available.length) return;

  const [chunk] = state.available.splice(state.selectedAvailable, 1);
  state.placed.push(chunk);
  state.selectedPlaced = state.placed.length - 1;
  clampOrderSelection();
}

function returnOrderDrillChunk() {
  const state = currentOrderDrillState();
  if (!state || !state.placed.length) return;

  const [chunk] = state.placed.splice(state.selectedPlaced, 1);
  state.available.push(chunk);
  state.selectedAvailable = state.available.length - 1;
  clampOrderSelection();
}

function toggleOrderDrillChunk() {
  const state = currentOrderDrillState();
  if (!state) return;
  if (state.zone === "placed") returnOrderDrillChunk();
  else placeOrderDrillChunk();
}

function orderDrillReadyToSubmit(step) {
  return (currentOrderDrillState()?.placed.length || 0) === step.chunks.length;
}

function handleOrderDrillInput(event, dir) {
  const step = currentDrillStep();
  if (!step) return;

  if (dir === "up" || dir === "down" || dir === "left" || dir === "right") {
    event.preventDefault();
    if (dir === "up") switchOrderDrillZone("placed");
    else if (dir === "down") switchOrderDrillZone("available");
    else moveOrderDrillCursor(dir === "right" ? 1 : -1);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    toggleOrderDrillChunk();
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    if (orderDrillReadyToSubmit(step)) answerDrillStep();
  }
}

function handleDrillInput(event) {
  if (!drill) return;

  if (event.code === "Escape") {
    event.preventDefault();
    closeDrill();
    return;
  }

  const proceedKey = event.code === "Space" || event.code === "Enter";
  if (drill.complete) {
    if (!proceedKey) return;
    event.preventDefault();
    closeDrill();
    return;
  }

  if (drill.answered) {
    if (!proceedKey) return;
    event.preventDefault();
    advanceDrill();
    return;
  }

  const step = currentDrillStep();
  const dir = keyToDir[event.code];
  if (isOrderDrillStep(step)) {
    handleOrderDrillInput(event, dir);
    return;
  }

  if (dir === "up" || dir === "down" || dir === "left" || dir === "right") {
    event.preventDefault();
    moveDrillCursor(dir === "down" || dir === "right" ? 1 : -1);
    return;
  }

  if (!proceedKey) return;

  event.preventDefault();
  answerDrillStep();
}

Object.assign(window.KA.drills, {
  registry: DRILLS,
  register: registerDrills,
  buildRun: buildDrillRun,
  start: startDrill,
  close: closeDrill,
  currentData: currentDrillData,
  currentStep: currentDrillStep,
  currentOrderState: currentOrderDrillState,
  stepKind: drillStepKind,
  isOrderStep: isOrderDrillStep,
  answerStep: answerDrillStep,
  handleInput: handleDrillInput,
});

Object.assign(window.KA.drills.questions, {
  buildOrderStepFromSentence,
  generateOrderStepsFromTemplates,
});

window.KA.drills.sentences = {
  templates: SENTENCE_TEMPLATES,
  register: registerSentenceTemplates,
  byChapter: sentenceTemplatesByChapter,
  generate: generateOrderStepsFromTemplates,
};
