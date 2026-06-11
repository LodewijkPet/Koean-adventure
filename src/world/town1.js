const TOWN1_FLAGS = {
  schoolEntered: "town1.schoolEntered",
  vowelMapRead: "town1.vowelMapRead",
  consonantMapRead: "town1.consonantMapRead",
  teacherIntroDone: "town1.teacherIntroDone",
  vowelPracticePassed1: "town1.vowelPracticePassed1",
  consonantPracticePassed1: "town1.consonantPracticePassed1",
  firstSyllablePracticePassed1: "town1.firstSyllablePracticePassed1",
  vowelExamPassed: "town1.vowelExamPassed",
  consonantExamPassed: "town1.consonantExamPassed",
  firstSyllablesPassed: "town1.firstSyllablesPassed",
  aspiratedIntroDone: "town1.aspiratedIntroDone",
  aspiratedBookRead: "town1.aspiratedBookRead",
  aspiratedPracticePassed1: "town1.aspiratedPracticePassed1",
  aspiratedExamPassed: "town1.aspiratedExamPassed",
  doubleConsonantIntroDone: "town1.doubleConsonantIntroDone",
  doubleConsonantBookRead: "town1.doubleConsonantBookRead",
  doubleConsonantPracticePassed1: "town1.doubleConsonantPracticePassed1",
  doubleConsonantExamPassed: "town1.doubleConsonantExamPassed",
  batchimSingleIntroDone: "town1.batchimSingleIntroDone",
  batchimSingleBookRead: "town1.batchimSingleBookRead",
  batchimSinglePracticePassed1: "town1.batchimSinglePracticePassed1",
  batchimDoubleIntroDone: "town1.batchimDoubleIntroDone",
  batchimDoubleBookRead: "town1.batchimDoubleBookRead",
  batchimDoublePracticePassed1: "town1.batchimDoublePracticePassed1",
};

const TOWN1_QUESTS = [
  {
    id: "basicVowels",
    titleKey: "quest.town1.basicVowels",
    steps: [
      { flag: TOWN1_FLAGS.vowelMapRead, objectiveKey: "quest.town1.basicVowels.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.vowelPracticePassed1, objectiveKey: "quest.town1.basicVowels.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.vowelExamPassed, objectiveKey: "quest.town1.basicVowels.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "basicConsonants",
    titleKey: "quest.town1.basicConsonants",
    steps: [
      { flag: TOWN1_FLAGS.consonantMapRead, objectiveKey: "quest.town1.basicConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.consonantPracticePassed1, objectiveKey: "quest.town1.basicConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.consonantExamPassed, objectiveKey: "quest.town1.basicConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "firstSyllables",
    titleKey: "quest.town1.firstSyllables",
    steps: [
      { flag: TOWN1_FLAGS.firstSyllablePracticePassed1, objectiveKey: "quest.town1.firstSyllables.practice", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.firstSyllablesPassed, objectiveKey: "quest.town1.firstSyllables.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "aspiratedConsonants",
    titleKey: "quest.town1.aspiratedConsonants",
    steps: [
      { flag: TOWN1_FLAGS.aspiratedIntroDone, objectiveKey: "quest.town1.aspiratedConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.aspiratedBookRead, objectiveKey: "quest.town1.aspiratedConsonants.book", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.aspiratedPracticePassed1, objectiveKey: "quest.town1.aspiratedConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.aspiratedExamPassed, objectiveKey: "quest.town1.aspiratedConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "doubleConsonants",
    titleKey: "quest.town1.doubleConsonants",
    steps: [
      { flag: TOWN1_FLAGS.doubleConsonantIntroDone, objectiveKey: "quest.town1.doubleConsonants.theory", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.doubleConsonantBookRead, objectiveKey: "quest.town1.doubleConsonants.book", whereKey: "area.elementarySchool" },
      { flag: TOWN1_FLAGS.doubleConsonantPracticePassed1, objectiveKey: "quest.town1.doubleConsonants.practice", whereKey: "area.haneulTown" },
      { flag: TOWN1_FLAGS.doubleConsonantExamPassed, objectiveKey: "quest.town1.doubleConsonants.exam", whereKey: "area.elementarySchool" },
    ],
  },
  {
    id: "singleBatchim",
    titleKey: "quest.town1.singleBatchim",
    steps: [
      { flag: TOWN1_FLAGS.batchimSingleIntroDone, objectiveKey: "quest.town1.singleBatchim.theory", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimSingleBookRead, objectiveKey: "quest.town1.singleBatchim.book", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimSinglePracticePassed1, objectiveKey: "quest.town1.singleBatchim.practice", whereKey: "area.haneulTown" },
    ],
  },
  {
    id: "doubleBatchim",
    titleKey: "quest.town1.doubleBatchim",
    steps: [
      { flag: TOWN1_FLAGS.batchimDoubleIntroDone, objectiveKey: "quest.town1.doubleBatchim.theory", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimDoubleBookRead, objectiveKey: "quest.town1.doubleBatchim.book", whereKey: "area.rivalGuesthouse" },
      { flag: TOWN1_FLAGS.batchimDoublePracticePassed1, objectiveKey: "quest.town1.doubleBatchim.practice", whereKey: "area.haneulTown" },
    ],
  },
  {
    id: "readingBadge",
    titleKey: "quest.town1.readingBadge",
    steps: [
      { flag: TOWN1_FLAGS.batchimDoublePracticePassed1, objectiveKey: "quest.town1.readingBadge.ready", whereKey: "area.haneulTown" },
    ],
  },
];

window.KA.quests.registerChapter({ id: "town1", titleKey: "journal.chapter.town1", sceneIds: ["town", "trail1"], quests: TOWN1_QUESTS });

function resolveTown1FountainDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return "town1FountainVowels";
  if (!hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return "town1FountainConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return "town1FountainAspirated";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) return "town1FountainDoubleConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return "town1FountainReview";
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return "town1FountainBatchimSingle";
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoublePracticePassed1)) return "town1FountainBatchimDouble";
  return "town1FountainReview";
}

function resolveTown1FountainConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) return ["object.soundFountain.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantMapRead) && hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) {
    return ["object.soundFountain.locked.consonants"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed) && !hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) {
    return ["object.soundFountain.locked.aspirated"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed) && !hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) {
    return ["object.soundFountain.locked.doubleConsonants"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed) && !hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) {
    return ["object.soundFountain.locked.batchimSingle"];
  }
  if (hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1) && !hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) {
    return ["object.soundFountain.locked.batchimDouble"];
  }
  return ["object.soundFountain.complete.line1"];
}

function resolveTown1DeskDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return null;
  return "town1DeskSyllables";
}

function resolveTown1DeskConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return ["object.studentDesk.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return ["object.studentDesk.locked.consonants"];
  return ["object.studentDesk.line1"];
}

function resolveTown1BlackboardDrill() {
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.vowelExamPassed)) return "town1BlackboardVowels";
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.consonantExamPassed)) return "town1BlackboardConsonants";
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) return "town1BlackboardSyllables";
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return "town1BlackboardAspirated";
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) return null;
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return "town1BlackboardDoubleConsonants";
  return null;
}

function resolveTown1BlackboardConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) return ["object.schoolBlackboard.locked.teacher"];
  if (!hasProgressFlag(TOWN1_FLAGS.vowelPracticePassed1)) return ["object.schoolBlackboard.locked.vowels"];
  if (!hasProgressFlag(TOWN1_FLAGS.consonantPracticePassed1) || !hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) {
    return ["object.schoolBlackboard.locked.consonants"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) return ["object.schoolBlackboard.locked.syllables"];
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedPracticePassed1)) return ["object.schoolBlackboard.locked.aspirated"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantPracticePassed1)) {
    return ["object.schoolBlackboard.locked.doubleConsonants"];
  }
  return ["object.schoolBlackboard.complete.line1"];
}

function resolveTown1TeacherConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed)) {
    return ["npc.hangulTeacher.line1", "npc.hangulTeacher.line2", "npc.hangulTeacher.line3"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) {
    return [
      "npc.hangulTeacher.aspiratedIntro.line1",
      "npc.hangulTeacher.aspiratedIntro.line2",
      "npc.hangulTeacher.aspiratedIntro.line3",
    ];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) return ["npc.hangulTeacher.aspiratedBook.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed)) return ["npc.hangulTeacher.aspiratedPractice.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) {
    return [
      "npc.hangulTeacher.doubleConsonantIntro.line1",
      "npc.hangulTeacher.doubleConsonantIntro.line2",
      "npc.hangulTeacher.doubleConsonantIntro.line3",
    ];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) return ["npc.hangulTeacher.doubleConsonantBook.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return ["npc.hangulTeacher.doubleConsonantPractice.line1"];
  return ["npc.hangulTeacher.doubleConsonantDone.line1"];
}

function resolveTown1TeacherProgressFlags() {
  const flags = [];
  if (!hasProgressFlag(TOWN1_FLAGS.teacherIntroDone)) flags.push(TOWN1_FLAGS.teacherIntroDone);
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablesPassed) && !hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) {
    flags.push(TOWN1_FLAGS.aspiratedIntroDone);
  }
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedExamPassed) && !hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) {
    flags.push(TOWN1_FLAGS.doubleConsonantIntroDone);
  }
  return flags;
}

function resolveTown1AspiratedBookBoard() {
  return hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone) ? "aspiratedConsonants" : null;
}

function resolveTown1AspiratedBookConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone)) return ["object.aspiratedBookcase.locked.line1"];
  return ["object.schoolBookshelf.line1"];
}

function resolveTown1AspiratedBookFlags() {
  return hasProgressFlag(TOWN1_FLAGS.aspiratedIntroDone) ? [TOWN1_FLAGS.aspiratedBookRead] : [];
}

function resolveTown1DoubleConsonantBookBoard() {
  return hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone) ? "doubleConsonants" : null;
}

function resolveTown1DoubleConsonantBookConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone)) return ["object.doubleConsonantBookcase.locked.line1"];
  return ["object.schoolBookshelf.line1"];
}

function resolveTown1DoubleConsonantBookFlags() {
  return hasProgressFlag(TOWN1_FLAGS.doubleConsonantIntroDone) ? [TOWN1_FLAGS.doubleConsonantBookRead] : [];
}

function resolveTown1FinalSoundCoachConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed)) return ["npc.finalSoundCoach.locked.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) {
    return ["npc.finalSoundCoach.intro.line1", "npc.finalSoundCoach.intro.line2"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) return ["npc.finalSoundCoach.readNote.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return ["npc.finalSoundCoach.afterNote.line1"];
  return ["npc.finalSoundCoach.done.line1"];
}

function resolveTown1FinalSoundCoachProgressFlags() {
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantExamPassed) && !hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) {
    return [TOWN1_FLAGS.batchimSingleIntroDone];
  }
  return [];
}

function resolveTown1DoubleFinalLearnerConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1)) return ["npc.doubleFinalLearner.locked.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) {
    return ["npc.doubleFinalLearner.intro.line1", "npc.doubleFinalLearner.intro.line2"];
  }
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) return ["npc.doubleFinalLearner.readNote.line1"];
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoublePracticePassed1)) return ["npc.doubleFinalLearner.afterNote.line1"];
  return ["npc.doubleFinalLearner.done.line1"];
}

function resolveTown1DoubleFinalLearnerProgressFlags() {
  if (hasProgressFlag(TOWN1_FLAGS.batchimSinglePracticePassed1) && !hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) {
    return [TOWN1_FLAGS.batchimDoubleIntroDone];
  }
  return [];
}

function resolveTown1BatchimSingleBoard() {
  return hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone) ? "singleBatchim" : null;
}

function resolveTown1BatchimSingleConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone)) return ["object.batchimSingleNotebook.locked.line1"];
  return ["npc.finalSoundCoach.readNote.line1"];
}

function resolveTown1BatchimSingleFlags() {
  return hasProgressFlag(TOWN1_FLAGS.batchimSingleIntroDone) ? [TOWN1_FLAGS.batchimSingleBookRead] : [];
}

function resolveTown1BatchimDoubleBoard() {
  return hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone) ? "doubleBatchim" : null;
}

function resolveTown1BatchimDoubleConversation() {
  if (!hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone)) return ["object.batchimDoubleNotebook.locked.line1"];
  return ["npc.doubleFinalLearner.readNote.line1"];
}

function resolveTown1BatchimDoubleFlags() {
  return hasProgressFlag(TOWN1_FLAGS.batchimDoubleIntroDone) ? [TOWN1_FLAGS.batchimDoubleBookRead] : [];
}

function town1ReviewItems() {
  const items = [];
  if (hasProgressFlag(TOWN1_FLAGS.vowelMapRead)) items.push(...HANGUL_BASIC_VOWELS);
  if (hasProgressFlag(TOWN1_FLAGS.consonantMapRead)) items.push(...HANGUL_BASIC_CONSONANTS);
  if (hasProgressFlag(TOWN1_FLAGS.firstSyllablePracticePassed1)) items.push(...HANGUL_FIRST_SYLLABLES);
  if (hasProgressFlag(TOWN1_FLAGS.aspiratedBookRead)) items.push(...HANGUL_ASPIRATED_SIGNS);
  if (hasProgressFlag(TOWN1_FLAGS.doubleConsonantBookRead)) items.push(...HANGUL_DOUBLE_CONSONANTS);
  if (hasProgressFlag(TOWN1_FLAGS.batchimSingleBookRead)) items.push(...HANGUL_SINGLE_BATCHIM_ITEMS);
  if (hasProgressFlag(TOWN1_FLAGS.batchimDoubleBookRead)) items.push(...HANGUL_DOUBLE_BATCHIM_ITEMS);
  return items.length ? items : HANGUL_BASIC_VOWELS;
}

function configureTown1HangulDrills() {
  Object.assign(DRILLS.town1FountainVowels, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_VOWELS, data),
  });
  Object.assign(DRILLS.town1BlackboardVowels, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_VOWELS, data),
  });
  Object.assign(DRILLS.town1FountainConsonants, {
    stepCount: 7,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1BlackboardConsonants, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_BASIC_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1DeskSyllables, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_FIRST_SYLLABLES, data),
  });
  Object.assign(DRILLS.town1BlackboardSyllables, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_FIRST_SYLLABLES, data),
  });
  Object.assign(DRILLS.town1FountainAspirated, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_ASPIRATED_SIGNS, data),
  });
  Object.assign(DRILLS.town1BlackboardAspirated, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_ASPIRATED_SIGNS, data),
  });
  Object.assign(DRILLS.town1FountainDoubleConsonants, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1BlackboardDoubleConsonants, {
    stepCount: 4,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_CONSONANTS, data),
  });
  Object.assign(DRILLS.town1FountainBatchimSingle, {
    stepCount: 5,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_SINGLE_BATCHIM_ITEMS, data),
  });
  Object.assign(DRILLS.town1FountainBatchimDouble, {
    stepCount: 3,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_DOUBLE_BATCHIM_ITEMS, data),
  });
  Object.assign(DRILLS.town1FountainReview, {
    stepCount: 6,
    shuffleChoices: true,
    generateSteps: (data) => generateHangulStepsFromPool(town1ReviewItems(), data),
  });
}

configureTown1HangulDrills();

const map = createTileMap(WORLD_WIDTH, WORLD_HEIGHT, "grass");

const buildings = [
  {
    labelKey: "object.elementarySchool",
    sceneId: "elementarySchool",
    x: 3,
    y: 3,
    w: 9,
    h: 7,
    doorX: 7,
    doorY: 9,
    roof: "#c88942",
    trim: "#87542e",
  },
  {
    labelKey: "object.yourGuesthouse",
    sceneId: "yourGuesthouse",
    x: 5,
    y: 12,
    w: 6,
    h: 5,
    doorX: 7,
    doorY: 16,
    roof: COLORS.roofRed,
    trim: "#7d3137",
  },
  {
    labelKey: "object.rivalGuesthouse",
    sceneId: "rivalGuesthouse",
    x: 14,
    y: 12,
    w: 6,
    h: 5,
    doorX: 16,
    doorY: 16,
    roof: COLORS.roofBlue,
    trim: "#2e4e83",
  },
  {
    labelKey: "object.hanokTeaHouse",
    sceneId: "hanokTeaHouse",
    x: 27,
    y: 12,
    w: 7,
    h: 5,
    doorX: 30,
    doorY: 16,
    roof: COLORS.roofTeal,
    trim: "#287368",
  },
  {
    labelKey: "object.cornerMarket",
    sceneId: "cornerMarket",
    x: 29,
    y: 20,
    w: 7,
    h: 5,
    doorX: 32,
    doorY: 24,
    roof: COLORS.roofViolet,
    trim: "#5f4b86",
  },
  {
    labelKey: "object.travelCenter",
    sceneId: "travelCenter",
    x: 14,
    y: 4,
    w: 12,
    h: 7,
    doorX: 19,
    doorY: 10,
    roof: "#be6d39",
    trim: "#874a28",
    important: true,
  },
];

const townObjects = [
  { x: 13, y: 20, w: 3, h: 3, type: "soundFountain" },
  { x: 22, y: 19, w: 3, h: 1, type: "speechBench" },
];

const interactables = [
  { labelKey: "object.northRouteMarker", x: 22, y: 3, solid: true, kind: "sign" },
  { labelKey: "object.townWelcomeSign", x: 12, y: 21, solid: true, kind: "sign" },
  { labelKey: "object.beachNoticeBoard", x: 22, y: 25, solid: true, kind: "sign" },
  ...createRectInteractions({
    labelKey: "object.soundFountain",
    x: 13,
    y: 20,
    w: 3,
    h: 3,
    conversationKeys: ["object.soundFountain.line1"],
    drillResolver: resolveTown1FountainDrill,
    conversationResolver: resolveTown1FountainConversation,
  }),
  ...createRectInteractions({
    labelKey: "object.speechBench",
    x: 22,
    y: 19,
    w: 3,
    h: 1,
    conversationKeys: ["object.speechBench.line1"],
    drillKey: "sentenceBlocks",
  }),
  ...createRouteTriggers({
    labelKey: "object.routeNorth",
    fromX: 18,
    toX: 22,
    y: 0,
    targetSceneId: "trail1",
    targetX: 17,
    targetY: 52,
    targetDir: "up",
  }),
  { labelKey: "object.shoreline", x: 18, y: 27, solid: false, kind: "waterEdge" },
  ...buildings.map((building) => ({
    labelKey: `${building.labelKey}.door`,
    sceneId: building.sceneId,
    x: building.doorX,
    y: building.doorY,
    solid: false,
    kind: "door",
  })),
];

const npcs = [
  {
    nameKey: "npc.mina",
    x: 9,
    y: 21,
    dir: "down",
    nextTurn: 0,
    jacket: "#e48d3d",
    voiceGender: "female",
    voiceId: "mina",
    conversationPools: [
      ["npc.mina.line1", "npc.mina.line2"],
      ["npc.mina.pool2.line1", "npc.mina.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.joon",
    x: 24,
    y: 14,
    dir: "left",
    nextTurn: 0,
    jacket: "#4f8cc9",
    voiceGender: "male",
    voiceId: "joon",
    conversationPools: [
      ["npc.joon.line1", "npc.joon.line2"],
      ["npc.joon.pool2.line1", "npc.joon.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.sora",
    x: 35,
    y: 18,
    dir: "up",
    nextTurn: 0,
    jacket: "#8a6bb7",
    voiceGender: "female",
    voiceId: "sora",
    conversationPools: [
      ["npc.sora.line1", "npc.sora.line2"],
      ["npc.sora.pool2.line1", "npc.sora.pool2.line2"],
    ],
  },
  {
    nameKey: "npc.mrHan",
    x: 17,
    y: 26,
    dir: "right",
    nextTurn: 0,
    jacket: "#497a4d",
    voiceGender: "male",
    voiceId: "mrHan",
    conversationPools: [
      ["npc.mrHan.line1", "npc.mrHan.line2"],
      ["npc.mrHan.pool2.line1", "npc.mrHan.pool2.line2"],
    ],
  },
];

function setTile(x, y, type) {
  if (x < 0 || y < 0 || x >= WORLD_WIDTH || y >= WORLD_HEIGHT) return;
  map[y][x] = type;
}

function fillRectTiles(x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setTile(xx, yy, type);
    }
  }
}

function buildMap() {
  for (let x = 0; x < WORLD_WIDTH; x += 1) {
    setTile(x, 0, "stone");
    setTile(x, WORLD_HEIGHT - 1, "water");
  }

  for (let y = 0; y < WORLD_HEIGHT; y += 1) {
    setTile(0, y, "stone");
    setTile(WORLD_WIDTH - 1, y, "stone");
  }

  for (let x = 18; x <= 22; x += 1) {
    setTile(x, 0, "path");
    setTile(x, 1, "path");
    setTile(x, 2, "path");
  }

  fillRectTiles(18, 0, 5, 13, "path");
  fillRectTiles(11, 16, 19, 3, "path");
  fillRectTiles(18, 10, 3, 16, "path");
  fillRectTiles(6, 17, 6, 2, "path");
  fillRectTiles(15, 17, 6, 2, "path");
  fillRectTiles(28, 17, 5, 2, "path");
  fillRectTiles(31, 18, 3, 8, "path");
  fillRectTiles(13, 24, 19, 2, "path");

  fillRectTiles(1, 27, WORLD_WIDTH - 2, 7, "water");
  fillRectTiles(1, 25, WORLD_WIDTH - 2, 2, "sand");
  fillRectTiles(16, 25, 7, 2, "path");

  for (let x = 2; x < WORLD_WIDTH - 2; x += 1) {
    if (x < 17 || x > 23) setTile(x, 1, "hedge");
  }

  for (let y = 2; y < 25; y += 1) {
    if (y !== 13 && y !== 18) {
      setTile(1, y, "hedge");
      setTile(WORLD_WIDTH - 2, y, "hedge");
    }
  }

  const treeSpots = [
    [3, 4],
    [5, 4],
    [8, 5],
    [34, 4],
    [36, 5],
    [38, 7],
    [4, 9],
    [37, 10],
    [3, 19],
    [5, 22],
    [37, 23],
    [35, 26],
    [7, 26],
  ];
  for (const [x, y] of treeSpots) setTile(x, y, "tree");

  const flowerSpots = [
    [7, 8],
    [8, 8],
    [9, 8],
    [28, 7],
    [29, 7],
    [30, 7],
    [25, 21],
    [26, 21],
    [26, 22],
    [10, 24],
    [11, 24],
    [36, 14],
    [36, 15],
  ];
  for (const [x, y] of flowerSpots) setTile(x, y, "flowers");

  const ledges = [
    [3, 11],
    [4, 11],
    [5, 11],
    [12, 9],
    [13, 9],
    [26, 10],
    [27, 10],
    [34, 11],
    [35, 11],
    [23, 23],
    [24, 23],
    [25, 23],
  ];
  for (const [x, y] of ledges) setTile(x, y, "ledge");

  setTile(7, 9, "path");
  fillRectTiles(6, 10, 8, 2, "path");
  fillRectTiles(13, 11, 6, 1, "path");
}

function createInteriorScenes() {
  const bySceneId = Object.fromEntries(buildings.map((building) => [building.sceneId, building]));

  const elementarySchool = createInteriorScene({
    id: "elementarySchool",
    areaKey: "area.elementarySchool",
    width: 22,
    height: 16,
    entryX: 11,
    returnBuilding: bySceneId.elementarySchool,
  });
  fillInteriorObject(elementarySchool, 2, 1, 5, 1, "mapBoard", "object.consonantWallMap", {
    studyBoardKey: "basicConsonants",
    progressFlagOnStudyBoard: TOWN1_FLAGS.consonantMapRead,
  });
  fillInteriorObject(elementarySchool, 8, 1, 6, 1, "blackboard", "object.schoolBlackboard", {
    conversationKeys: ["object.schoolBlackboard.line1"],
    drillResolver: resolveTown1BlackboardDrill,
    conversationResolver: resolveTown1BlackboardConversation,
  });
  fillInteriorObject(elementarySchool, 15, 1, 5, 1, "mapBoard", "object.vowelWallMap", {
    studyBoardKey: "basicVowels",
    progressFlagOnStudyBoard: TOWN1_FLAGS.vowelMapRead,
  });
  fillInteriorObject(elementarySchool, 1, 4, 2, 3, "bookcase", "object.aspiratedBookcase", {
    conversationResolver: resolveTown1AspiratedBookConversation,
    studyBoardResolver: resolveTown1AspiratedBookBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1AspiratedBookFlags,
  });
  fillInteriorObject(elementarySchool, 19, 5, 2, 3, "bookcase", "object.doubleConsonantBookcase", {
    conversationResolver: resolveTown1DoubleConsonantBookConversation,
    studyBoardResolver: resolveTown1DoubleConsonantBookBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1DoubleConsonantBookFlags,
  });
  fillInteriorObject(elementarySchool, 9, 4, 5, 1, "teacherDesk", "object.teacherDesk", {
    conversationKeys: ["object.teacherDesk.line1"],
  });

  const studentDeskSpots = [
    [4, 8],
    [9, 8],
    [14, 8],
    [4, 11],
    [9, 11],
    [14, 11],
  ];
  for (const [deskX, deskY] of studentDeskSpots) {
    fillInteriorObject(elementarySchool, deskX, deskY, 2, 1, "studentDesk", "object.studentDesk", {
      conversationKeys: ["object.studentDesk.line1"],
      drillResolver: resolveTown1DeskDrill,
      conversationResolver: resolveTown1DeskConversation,
    });
    placeInteriorObject(elementarySchool, deskX, deskY + 1, "chair", "object.studentSeat", {
      solid: false,
    });
    placeInteriorObject(elementarySchool, deskX + 1, deskY + 1, "chair", "object.studentSeat", {
      solid: false,
    });
  }

  addInteriorNpc(elementarySchool, {
    nameKey: "npc.hangulTeacher",
    x: 11,
    y: 3,
    dir: "down",
    jacket: "#9b5f42",
    voiceGender: "female",
    voiceId: "hangulTeacher",
    conversationKeys: ["npc.hangulTeacher.line1", "npc.hangulTeacher.line2", "npc.hangulTeacher.line3"],
    conversationResolver: resolveTown1TeacherConversation,
    progressFlagsOnTalkResolver: resolveTown1TeacherProgressFlags,
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentA",
    x: 11,
    y: 6,
    dir: "up",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "schoolStudentA",
    conversationKeys: ["npc.schoolStudentA.line1", "npc.schoolStudentA.line2"],
    kind: "child",
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentB",
    x: 6,
    y: 10,
    dir: "right",
    jacket: "#d28a4d",
    voiceGender: "male",
    voiceId: "schoolStudentB",
    conversationKeys: ["npc.schoolStudentB.line1", "npc.schoolStudentB.line2"],
    kind: "child",
    wander: true,
  });
  addInteriorNpc(elementarySchool, {
    nameKey: "npc.schoolStudentC",
    x: 17,
    y: 12,
    dir: "left",
    jacket: "#7a6fb2",
    voiceGender: "female",
    voiceId: "schoolStudentC",
    conversationKeys: ["npc.schoolStudentC.line1", "npc.schoolStudentC.line2"],
    kind: "child",
    wander: true,
  });

  const yourGuesthouse = createInteriorScene({
    id: "yourGuesthouse",
    areaKey: "area.yourGuesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.yourGuesthouse,
  });
  fillInteriorTile(yourGuesthouse, 5, 7, 4, 2, "carpetRed");
  fillInteriorObject(yourGuesthouse, 2, 2, 2, 2, "bed", "object.bed");
  placeInteriorObject(yourGuesthouse, 2, 6, "tv", "object.tv");
  placeInteriorObject(yourGuesthouse, 10, 2, "fridge", "object.fridge");
  placeInteriorObject(yourGuesthouse, 11, 2, "sink", "object.sink");
  placeInteriorObject(yourGuesthouse, 12, 2, "stove", "object.stove");
  fillInteriorObject(yourGuesthouse, 5, 5, 2, 2, "table", "object.familyTable");
  placeInteriorObject(yourGuesthouse, 4, 5, "chair", "object.familyTable");
  placeInteriorObject(yourGuesthouse, 7, 6, "chair", "object.familyTable");
  addInteriorNpc(yourGuesthouse, {
    nameKey: "npc.guesthouseHost",
    x: 10,
    y: 6,
    dir: "left",
    jacket: "#b65c7a",
    voiceGender: "female",
    voiceId: "guesthouseHost",
    conversationKeys: ["npc.guesthouseHost.line1", "npc.guesthouseHost.line2"],
    wander: true,
  });
  addInteriorNpc(yourGuesthouse, {
    nameKey: "npc.guesthouseKid",
    x: 4,
    y: 8,
    dir: "down",
    jacket: "#e2a843",
    voiceGender: "female",
    voiceId: "guesthouseKid",
    conversationKeys: ["npc.guesthouseKid.line1", "npc.guesthouseKid.line2"],
    kind: "child",
    wander: true,
  });

  const rivalGuesthouse = createInteriorScene({
    id: "rivalGuesthouse",
    areaKey: "area.rivalGuesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.rivalGuesthouse,
  });
  fillInteriorTile(rivalGuesthouse, 4, 7, 6, 2, "carpetBlue");
  fillInteriorObject(rivalGuesthouse, 2, 2, 2, 2, "bed", "object.bed");
  placeInteriorObject(rivalGuesthouse, 9, 2, "desk", "object.batchimSingleNotebook", {
    conversationResolver: resolveTown1BatchimSingleConversation,
    studyBoardResolver: resolveTown1BatchimSingleBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1BatchimSingleFlags,
  });
  fillInteriorObject(rivalGuesthouse, 10, 2, 2, 1, "bookcase", "object.batchimDoubleNotebook", {
    conversationResolver: resolveTown1BatchimDoubleConversation,
    studyBoardResolver: resolveTown1BatchimDoubleBoard,
    progressFlagsOnStudyBoardResolver: resolveTown1BatchimDoubleFlags,
  });
  placeInteriorObject(rivalGuesthouse, 3, 6, "tv", "object.tv");
  fillInteriorObject(rivalGuesthouse, 7, 5, 2, 2, "table", "object.familyTable");
  placeInteriorObject(rivalGuesthouse, 6, 6, "chair", "object.familyTable");
  placeInteriorObject(rivalGuesthouse, 9, 5, "chair", "object.familyTable");
  addInteriorNpc(rivalGuesthouse, {
    nameKey: "npc.rivalDad",
    x: 5,
    y: 5,
    dir: "right",
    jacket: "#5f7f9a",
    voiceGender: "male",
    voiceId: "rivalDad",
    conversationKeys: ["npc.rivalDad.line1", "npc.rivalDad.line2"],
    conversationResolver: resolveTown1FinalSoundCoachConversation,
    progressFlagsOnTalkResolver: resolveTown1FinalSoundCoachProgressFlags,
  });
  addInteriorNpc(rivalGuesthouse, {
    nameKey: "npc.rivalStudent",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#bd6e48",
    voiceGender: "male",
    voiceId: "rivalStudent",
    conversationKeys: ["npc.rivalStudent.line1", "npc.rivalStudent.line2"],
    conversationResolver: resolveTown1DoubleFinalLearnerConversation,
    progressFlagsOnTalkResolver: resolveTown1DoubleFinalLearnerProgressFlags,
    kind: "child",
  });

  const hanokTeaHouse = createInteriorScene({
    id: "hanokTeaHouse",
    areaKey: "area.hanokTeaHouse",
    width: 16,
    height: 12,
    entryX: 8,
    returnBuilding: bySceneId.hanokTeaHouse,
  });
  fillInteriorTile(hanokTeaHouse, 2, 4, 12, 5, "tatami");
  fillInteriorObject(hanokTeaHouse, 2, 2, 4, 1, "counter", "object.teaCounter", {
    conversationKeys: ["npc.teaOwner.line1", "npc.teaOwner.line2"],
  });
  fillInteriorObject(hanokTeaHouse, 4, 5, 2, 1, "teaTable", "object.teaTable");
  fillInteriorObject(hanokTeaHouse, 10, 5, 2, 1, "teaTable", "object.teaTable");
  fillInteriorObject(hanokTeaHouse, 7, 8, 2, 1, "teaTable", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 4, 4, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 5, 6, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 10, 4, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 11, 6, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 7, 7, "cushion", "object.teaTable");
  placeInteriorObject(hanokTeaHouse, 8, 9, "cushion", "object.teaTable");
  addInteriorNpc(hanokTeaHouse, {
    nameKey: "npc.teaOwner",
    x: 3,
    y: 1,
    dir: "down",
    jacket: "#4b8f79",
    voiceGender: "female",
    voiceId: "teaOwner",
    conversationPools: [
      ["npc.teaOwner.line1", "npc.teaOwner.line2"],
      ["npc.teaOwner.pool2.line1", "npc.teaOwner.pool2.line2"],
    ],
  });
  addInteriorNpc(hanokTeaHouse, {
    nameKey: "npc.teaCustomer",
    x: 12,
    y: 7,
    dir: "left",
    jacket: "#8b6fb0",
    voiceGender: "female",
    voiceId: "teaCustomer",
    conversationKeys: ["npc.teaCustomer.line1", "npc.teaCustomer.line2"],
    wander: true,
  });

  const cornerMarket = createInteriorScene({
    id: "cornerMarket",
    areaKey: "area.cornerMarket",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.cornerMarket,
  });
  fillInteriorTile(cornerMarket, 2, 8, 14, 2, "carpetGreen");
  fillInteriorObject(cornerMarket, 2, 2, 3, 2, "produce", "object.produceShelf");
  fillInteriorObject(cornerMarket, 2, 6, 3, 1, "fish", "object.fishIcebox");
  fillInteriorObject(cornerMarket, 6, 2, 1, 4, "supplyShelf", "object.supplyShelf");
  fillInteriorObject(cornerMarket, 8, 2, 1, 4, "supplyShelf", "object.supplyShelf");
  fillInteriorObject(cornerMarket, 11, 3, 5, 1, "counter", "object.marketCounter", {
    conversationKeys: ["npc.marketClerk.line1", "npc.marketClerk.line2"],
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketClerk",
    x: 13,
    y: 2,
    dir: "down",
    jacket: "#3f7fb1",
    voiceGender: "female",
    voiceId: "marketClerk",
    conversationPools: [
      ["npc.marketClerk.line1", "npc.marketClerk.line2"],
      ["npc.marketClerk.pool2.line1", "npc.marketClerk.pool2.line2"],
    ],
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketStocker",
    x: 6,
    y: 7,
    dir: "down",
    jacket: "#6c9a50",
    voiceGender: "male",
    voiceId: "marketStocker",
    conversationKeys: ["npc.marketStocker.line1", "npc.marketStocker.line2"],
    wander: true,
  });
  addInteriorNpc(cornerMarket, {
    nameKey: "npc.marketCustomer",
    x: 12,
    y: 9,
    dir: "left",
    jacket: "#b56b84",
    voiceGender: "female",
    voiceId: "marketCustomer",
    conversationKeys: ["npc.marketCustomer.line1", "npc.marketCustomer.line2"],
    wander: true,
  });

  const travelCenter = createInteriorScene({
    id: "travelCenter",
    areaKey: "area.travelCenter",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.travelCenter,
  });
  fillInteriorTile(travelCenter, 4, 7, 12, 3, "carpetBlue");
  fillInteriorObject(travelCenter, 7, 3, 6, 1, "counter", "object.counter", {
    conversationKeys: ["npc.travelGuide.line1", "npc.travelGuide.line2"],
  });
  fillInteriorObject(travelCenter, 2, 1, 4, 1, "mapBoard", "object.syllablePoster", {
    conversationKeys: ["object.syllablePoster.line1", "object.syllablePoster.line2"],
  });
  fillInteriorObject(travelCenter, 15, 2, 2, 2, "brochureRack", "object.hangulBookshelf", {
    conversationKeys: ["object.hangulBookshelf.line1"],
  });
  fillInteriorObject(travelCenter, 5, 8, 2, 2, "table", "object.letterBlockTable", {
    conversationKeys: ["object.letterBlockTable.line1"],
    drillKey: "alphabetBlocks",
  });
  fillInteriorObject(travelCenter, 12, 8, 2, 2, "desk", "object.patternDesk", {
    conversationKeys: ["object.patternDesk.line1"],
    drillKey: "sentenceBlocks",
  });
  placeInteriorObject(travelCenter, 4, 8, "chair", "object.letterBlockTable");
  placeInteriorObject(travelCenter, 7, 9, "chair", "object.letterBlockTable");
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelGuide",
    x: 9,
    y: 2,
    dir: "down",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "travelGuide",
    conversationResolver: () => chapterGuideLines("town1", "npc.travelGuide.line1"),
  });
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelTrainee",
    x: 16,
    y: 6,
    dir: "left",
    jacket: "#4c8f95",
    voiceGender: "female",
    voiceId: "travelTrainee",
    conversationKeys: ["npc.travelTrainee.line1", "npc.travelTrainee.line2"],
    wander: true,
  });
  addInteriorNpc(travelCenter, {
    nameKey: "npc.travelGuest",
    x: 5,
    y: 10,
    dir: "up",
    jacket: "#7a6fb2",
    voiceGender: "male",
    voiceId: "travelGuest",
    conversationKeys: ["npc.travelGuest.line1", "npc.travelGuest.line2"],
    wander: true,
  });

  return {
    elementarySchool,
    yourGuesthouse,
    rivalGuesthouse,
    hanokTeaHouse,
    cornerMarket,
    travelCenter,
  };
}

window.KA.world.registerScene(() => {
  buildMap();
  const town = {
    id: "town",
    kind: "outdoor",
    map,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT,
    buildings,
    objects: townObjects,
    interactables,
    npcs,
    areaKey: "area.haneulTown",
    musicKey: "town1",
  };

  return {
    town,
    ...createInteriorScenes(),
  };
});
