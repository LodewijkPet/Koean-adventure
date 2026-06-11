const TOWN3_FLAGS = {
  arrived: "town3.arrived",
  sinoBoardRead: "town3.sinoBoardRead",
  sinoPracticePassed: "town3.sinoPracticePassed",
  sinoExamPassed: "town3.sinoExamPassed",
  nativeBoardRead: "town3.nativeBoardRead",
  nativePracticePassed: "town3.nativePracticePassed",
  nativeExamPassed: "town3.nativeExamPassed",
  counterBoardRead: "town3.counterBoardRead",
  countersPracticePassed: "town3.countersPracticePassed",
  priceBoardRead: "town3.priceBoardRead",
  pricesPracticePassed: "town3.pricesPracticePassed",
  shoppingListDone: "town3.shoppingListDone",
  cafeOrderDone: "town3.cafeOrderDone",
  numberBadgePassed: "town3.numberBadgePassed",
};

const CHAPTER3_QUESTS = [
  {
    id: "trail2MirrorVowels",
    titleKey: "quest.trail2.mirrorVowels",
    steps: [
      { flag: TRAIL2_FLAGS.mirrorBoardRead, objectiveKey: "quest.trail2.mirrorVowels.theory", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.mirrorPracticePassed, objectiveKey: "quest.trail2.mirrorVowels.practice", whereKey: "area.trail2" },
    ],
  },
  {
    id: "trail2Location",
    titleKey: "quest.trail2.location",
    steps: [{ flag: TRAIL2_FLAGS.locationPostsPassed, objectiveKey: "quest.trail2.location.pass", whereKey: "area.trail2" }],
  },
  {
    id: "trail2Also",
    titleKey: "quest.trail2.also",
    steps: [{ flag: TRAIL2_FLAGS.echoTwinsPassed, objectiveKey: "quest.trail2.also.pass", whereKey: "area.trail2" }],
  },
  {
    id: "trail2LostKey",
    titleKey: "quest.trail2.lostKey",
    steps: [
      { flag: TRAIL2_FLAGS.keyQuestStarted, objectiveKey: "quest.trail2.lostKey.start", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.keyFound, objectiveKey: "quest.trail2.lostKey.find", whereKey: "area.trail2" },
      { flag: TRAIL2_FLAGS.keyReturned, objectiveKey: "quest.trail2.lostKey.return", whereKey: "area.trail2" },
    ],
  },
  {
    id: "town3Sino",
    titleKey: "quest.town3.sino",
    steps: [
      { flag: TOWN3_FLAGS.sinoBoardRead, objectiveKey: "quest.town3.sino.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.sinoPracticePassed, objectiveKey: "quest.town3.sino.practice", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.sinoExamPassed, objectiveKey: "quest.town3.sino.exam", whereKey: "area.town3CountingHouse" },
    ],
  },
  {
    id: "town3Native",
    titleKey: "quest.town3.native",
    steps: [
      { flag: TOWN3_FLAGS.nativeBoardRead, objectiveKey: "quest.town3.native.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.nativePracticePassed, objectiveKey: "quest.town3.native.practice", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.nativeExamPassed, objectiveKey: "quest.town3.native.exam", whereKey: "area.town3CountingHouse" },
    ],
  },
  {
    id: "town3Counters",
    titleKey: "quest.town3.counters",
    steps: [
      { flag: TOWN3_FLAGS.counterBoardRead, objectiveKey: "quest.town3.counters.theory", whereKey: "area.town3CountingHouse" },
      { flag: TOWN3_FLAGS.countersPracticePassed, objectiveKey: "quest.town3.counters.practice", whereKey: "area.town3" },
    ],
  },
  {
    id: "town3Prices",
    titleKey: "quest.town3.prices",
    steps: [
      { flag: TOWN3_FLAGS.priceBoardRead, objectiveKey: "quest.town3.prices.theory", whereKey: "area.town3" },
      { flag: TOWN3_FLAGS.pricesPracticePassed, objectiveKey: "quest.town3.prices.practice", whereKey: "area.town3" },
    ],
  },
  {
    id: "town3ShoppingList",
    titleKey: "quest.town3.shoppingList",
    steps: [{ flag: TOWN3_FLAGS.shoppingListDone, objectiveKey: "quest.town3.shoppingList.help", whereKey: "area.town3" }],
  },
  {
    id: "town3Cafe",
    titleKey: "quest.town3.cafe",
    steps: [{ flag: TOWN3_FLAGS.cafeOrderDone, objectiveKey: "quest.town3.cafe.order", whereKey: "area.town3SnackCafe" }],
  },
  {
    id: "town3NumberBadge",
    titleKey: "quest.town3.numberBadge",
    steps: [{ flag: TOWN3_FLAGS.numberBadgePassed, objectiveKey: "quest.town3.numberBadge.podium", whereKey: "area.town3GuildHall" }],
  },
];

window.KA.quests.registerChapter({ id: "town3", titleKey: "journal.chapter.town3", sceneIds: ["trail2", "town3"], quests: CHAPTER3_QUESTS });

window.KA.badges.register({ id: "numbers", titleKey: "badge.numbers", flag: TOWN3_FLAGS.numberBadgePassed });

function town3ReviewCategories() {
  const categories = ["position", "nature"];
  if (hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) categories.push("numbersSino");
  if (hasProgressFlag(TOWN3_FLAGS.nativeBoardRead)) categories.push("numbersNative");
  if (hasProgressFlag(TOWN3_FLAGS.counterBoardRead)) categories.push("counters");
  categories.push("shopping", "food", "colors", "people", "cafe");
  return categories;
}

function resolveTown3GrandmaConversation() {
  if (hasProgressFlag(TOWN3_FLAGS.shoppingListDone)) {
    return ["npc.town3Grandma.done1"];
  }
  return ["npc.town3Grandma.line1", "npc.town3Grandma.line2"];
}

function resolveTown3AbacusDrill() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return "town3SinoNumbers";
  if (!hasProgressFlag(TOWN3_FLAGS.nativeBoardRead)) return "town3SinoNumbers";
  if (!hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) return "town3NativeNumbers";
  return Math.random() < 0.5 ? "town3SinoNumbers" : "town3NativeNumbers";
}

function resolveTown3AbacusConversation() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoBoardRead)) return ["object.town3AbacusDesk.locked"];
  return null;
}

function resolveTown3BlackboardDrill() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.sinoExamPassed)) return "town3SinoExam";
  if (!hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) return null;
  if (!hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) return "town3NativeExam";
  return null;
}

function resolveTown3BlackboardConversation() {
  if (!hasProgressFlag(TOWN3_FLAGS.sinoPracticePassed)) return ["object.town3PriceBlackboard.locked"];
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && !hasProgressFlag(TOWN3_FLAGS.nativePracticePassed)) {
    return ["object.town3PriceBlackboard.nextNative"];
  }
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) {
    return ["object.town3PriceBlackboard.done"];
  }
  return null;
}

function resolveTown3GuildLeaderConversation() {
  if (hasProgressFlag(TOWN3_FLAGS.numberBadgePassed)) {
    return ["npc.town3GuildLeader.done1"];
  }
  if (hasProgressFlag(TOWN3_FLAGS.sinoExamPassed) && hasProgressFlag(TOWN3_FLAGS.nativeExamPassed)) {
    return ["npc.town3GuildLeader.ready1"];
  }
  return ["npc.town3GuildLeader.intro1", "npc.town3GuildLeader.intro2"];
}

function configureChapter3GeneratedDrills() {
  DRILLS.trail2MirrorVowels = {
    titleKey: "drill.trail2MirrorVowels.title",
    shuffleChoices: true,
    completionFlags: [TRAIL2_FLAGS.mirrorPracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: (data) => generateHangulStepsFromPool(HANGUL_COMPOUND_VOWELS, data),
  };
  DRILLS.town3SinoNumbers = {
    titleKey: "drill.town3SinoNumbers.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.sinoPracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: generateSinoSteps,
  };
  DRILLS.town3NativeNumbers = {
    titleKey: "drill.town3NativeNumbers.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.nativePracticePassed],
    passCorrectCount: 5,
    stepCount: 6,
    generateSteps: generateNativeSteps,
  };
  DRILLS.town3SinoExam = {
    titleKey: "drill.town3SinoExam.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.sinoExamPassed],
    passCorrectCount: 6,
    stepCount: 7,
    generateSteps: generateSinoSteps,
  };
  DRILLS.town3NativeExam = {
    titleKey: "drill.town3NativeExam.title",
    shuffleChoices: true,
    completionFlags: [TOWN3_FLAGS.nativeExamPassed],
    passCorrectCount: 6,
    stepCount: 7,
    generateSteps: generateNativeSteps,
  };
  DRILLS.town3MarketReview = {
    titleKey: "drill.town3MarketReview.title",
    shuffleChoices: true,
    stepCount: 6,
    generateSteps: (data) => generateWordStepsFromCategories(town3ReviewCategories(), data),
  };
  if (DRILLS.town3Prices) {
    Object.assign(DRILLS.town3Prices, {
      shuffleChoices: true,
      stepCount: 5,
      passCorrectCount: 4,
      generateSteps: (data) => Array.from({ length: data.stepCount || 5 }, () => buildSinoPriceStep()),
    });
  }
}

configureChapter3GeneratedDrills();

function createTown3Scene() {
  const width = 48;
  const height = 40;
  const town3Map = createTileMap(width, height, "grass");

  for (let x = 0; x < width; x += 1) {
    if (x < 22 || x > 26) {
      setMapTile(town3Map, x, 0, "stone");
      setMapTile(town3Map, x, height - 1, "stone");
    }
  }
  for (let y = 0; y < height; y += 1) {
    setMapTile(town3Map, 0, y, "stone");
    setMapTile(town3Map, width - 1, y, "stone");
  }

  fillMapRect(town3Map, 14, 13, 22, 11, "path");
  fillMapRect(town3Map, 22, 24, 5, 15, "path");
  fillMapRect(town3Map, 22, 1, 5, 12, "path");
  fillMapRect(town3Map, 6, 16, 8, 3, "path");
  fillMapRect(town3Map, 11, 10, 2, 6, "path");
  fillMapRect(town3Map, 25, 10, 3, 3, "path");
  fillMapRect(town3Map, 38, 10, 3, 6, "path");
  fillMapRect(town3Map, 36, 16, 8, 3, "path");
  fillMapRect(town3Map, 10, 33, 3, 2, "path");
  fillMapRect(town3Map, 13, 33, 9, 2, "path");
  fillMapRect(town3Map, 8, 19, 5, 4, "path");
  fillMapRect(town3Map, 15, 25, 6, 4, "path");
  fillMapRect(town3Map, 28, 25, 6, 4, "path");
  fillMapRect(town3Map, 36, 19, 5, 4, "path");

  const treeSpots = [
    [3, 4], [4, 12], [3, 24], [5, 36], [44, 4], [44, 22], [43, 36], [33, 31],
    [16, 5], [31, 2], [44, 13],
  ];
  for (const [x, y] of treeSpots) setMapTile(town3Map, x, y, "tree");

  const flowerSpots = [
    [14, 11], [15, 11], [34, 11], [35, 11], [16, 31], [17, 31], [30, 31], [31, 31],
  ];
  for (const [x, y] of flowerSpots) setMapTile(town3Map, x, y, "flowers");

  const town3Buildings = [
    {
      labelKey: "object.town3CountingHouse",
      sceneId: "town3CountingHouse",
      x: 6,
      y: 4,
      w: 10,
      h: 6,
      doorX: 11,
      doorY: 10,
      roof: COLORS.roofTeal,
      trim: "#287368",
      important: true,
    },
    {
      labelKey: "object.town3GuildHall",
      sceneId: "town3GuildHall",
      x: 20,
      y: 3,
      w: 12,
      h: 7,
      doorX: 26,
      doorY: 10,
      roof: COLORS.roofViolet,
      trim: "#5f4b86",
      important: true,
    },
    {
      labelKey: "object.town3SnackCafe",
      sceneId: "town3SnackCafe",
      x: 36,
      y: 5,
      w: 8,
      h: 5,
      doorX: 39,
      doorY: 10,
      roof: COLORS.roofRed,
      trim: "#7d3137",
    },
    {
      labelKey: "object.town3Guesthouse",
      sceneId: "town3Guesthouse",
      x: 8,
      y: 28,
      w: 7,
      h: 5,
      doorX: 11,
      doorY: 33,
      roof: "#d18a3f",
      trim: "#8a5624",
    },
  ];

  const town3Objects = [
    { x: 9, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    { x: 16, y: 26, w: 3, h: 2, type: "routeObjectStall" },
    { x: 29, y: 26, w: 3, h: 2, type: "routeObjectStall" },
    { x: 37, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    { x: 30, y: 14, w: 3, h: 2, type: "routeObjectStall" },
    { x: 17, y: 28, w: 3, h: 2, type: "trailRestTable" },
    { x: 19, y: 18, w: 3, h: 1, type: "speechBench" },
  ];

  const town3Interactables = [
    {
      labelKey: "object.town3WelcomeSign",
      x: 21,
      y: 35,
      solid: true,
      kind: "sign",
      conversationKeys: ["sign.town3Welcome.line1", "sign.town3Welcome.line2"],
    },
    {
      labelKey: "object.town3PriceBoard",
      x: 24,
      y: 12,
      solid: true,
      kind: "sign",
      studyBoardKey: "sinoNumbers",
      progressFlagOnStudyBoard: TOWN3_FLAGS.priceBoardRead,
    },
    {
      labelKey: "object.town3ReviewBoard",
      x: 17,
      y: 14,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town3ReviewBoard.line1"],
      drillKey: "town3MarketReview",
    },
    ...createRectInteractions({
      labelKey: "object.town3FishStall",
      x: 9,
      y: 20,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3FishStall.line1"],
      drillKey: "town3FishStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3FruitStall",
      x: 16,
      y: 26,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3FruitStall.line1"],
      drillKey: "town3FruitStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3ClothStall",
      x: 29,
      y: 26,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3ClothStall.line1"],
      drillKey: "town3ColorStall",
    }),
    ...createRectInteractions({
      labelKey: "object.town3CounterStall",
      x: 37,
      y: 20,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3CounterStall.line1"],
      drillKey: "town3CounterStall",
      requiredFlags: [TOWN3_FLAGS.counterBoardRead],
      lockedConversationKeys: ["object.town3CounterStall.locked"],
    }),
    ...createRectInteractions({
      labelKey: "object.town3PriceStall",
      x: 30,
      y: 14,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3PriceStall.line1"],
      drillKey: "town3Prices",
      requiredFlags: [TOWN3_FLAGS.priceBoardRead],
      lockedConversationKeys: ["object.town3PriceStall.locked"],
    }),
    ...createRectInteractions({
      labelKey: "object.town3GrandmaBasket",
      x: 17,
      y: 28,
      w: 3,
      h: 2,
      conversationKeys: ["object.town3GrandmaBasket.line1"],
      drillKey: "town3ShoppingList",
    }),
    ...createRectInteractions({
      labelKey: "object.town3PlazaBench",
      x: 19,
      y: 18,
      w: 3,
      h: 1,
      conversationKeys: ["object.town3PlazaBench.line1"],
    }),
    ...createRouteTriggers({
      labelKey: "object.routeSouth",
      fromX: 22,
      toX: 26,
      y: height - 1,
      targetSceneId: "trail2",
      targetX: 17,
      targetY: 1,
      targetDir: "down",
    }),
    ...createRouteTriggers({
      labelKey: "object.routeTrail3",
      fromX: 22,
      toX: 26,
      y: 0,
      targetSceneId: "trail3",
      targetX: 17,
      targetY: 52,
      targetDir: "up",
      conversationKeys: ["route.trail3.pending"],
    }),
    ...town3Buildings.map((building) => ({
      labelKey: `${building.labelKey}.door`,
      sceneId: building.sceneId,
      x: building.doorX,
      y: building.doorY,
      solid: false,
      kind: "door",
    })),
  ];

  const town3Npcs = [
    {
      nameKey: "npc.town3GateGreeter",
      x: 24,
      y: 34,
      dir: "down",
      nextTurn: 0,
      jacket: "#4f8cc9",
      voiceGender: "male",
      voiceId: "town3GateGreeter",
      conversationKeys: ["npc.town3GateGreeter.line1", "npc.town3GateGreeter.line2"],
      progressFlagOnTalk: TOWN3_FLAGS.arrived,
    },
    {
      nameKey: "npc.town3PlazaGuide",
      x: 24,
      y: 16,
      dir: "down",
      nextTurn: 0,
      jacket: "#a65d3e",
      voiceGender: "female",
      voiceId: "town3PlazaGuide",
      conversationResolver: () => chapterGuideLines("town3", "npc.town3PlazaGuide.line1"),
    },
    {
      nameKey: "npc.town3FruitSeller",
      x: 17,
      y: 25,
      dir: "down",
      nextTurn: 0,
      jacket: "#c9554f",
      voiceGender: "female",
      voiceId: "town3FruitSeller",
      conversationPools: [
        ["npc.town3FruitSeller.line1", "npc.town3FruitSeller.line2"],
        ["npc.town3FruitSeller.pool2.line1", "npc.town3FruitSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3ClothSeller",
      x: 30,
      y: 25,
      dir: "down",
      nextTurn: 0,
      jacket: "#8a6bb7",
      voiceGender: "male",
      voiceId: "town3ClothSeller",
      conversationPools: [
        ["npc.town3ClothSeller.line1", "npc.town3ClothSeller.line2"],
        ["npc.town3ClothSeller.pool2.line1", "npc.town3ClothSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3FishSeller",
      x: 10,
      y: 19,
      dir: "down",
      nextTurn: 0,
      jacket: "#3f7fb1",
      voiceGender: "male",
      voiceId: "town3FishSeller",
      conversationPools: [
        ["npc.town3FishSeller.line1", "npc.town3FishSeller.line2"],
        ["npc.town3FishSeller.pool2.line1", "npc.town3FishSeller.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3CounterCoach",
      x: 38,
      y: 19,
      dir: "down",
      nextTurn: 0,
      jacket: "#497a4d",
      voiceGender: "female",
      voiceId: "town3CounterCoach",
      conversationKeys: ["npc.town3CounterCoach.line1", "npc.town3CounterCoach.line2"],
    },
    {
      nameKey: "npc.town3Grandma",
      x: 20,
      y: 27,
      dir: "left",
      nextTurn: 0,
      jacket: "#b65c7a",
      voiceGender: "female",
      voiceId: "town3Grandma",
      conversationResolver: resolveTown3GrandmaConversation,
    },
    {
      nameKey: "npc.town3CountingKidA",
      x: 26,
      y: 20,
      dir: "right",
      nextTurn: 0,
      jacket: "#e2a843",
      voiceGender: "female",
      voiceId: "town3CountingKidA",
      kind: "child",
      wander: true,
      conversationPools: [
        ["npc.town3CountingKidA.line1", "npc.town3CountingKidA.line2"],
        ["npc.town3CountingKidA.pool2.line1", "npc.town3CountingKidA.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town3CountingKidB",
      x: 28,
      y: 21,
      dir: "left",
      nextTurn: 0,
      jacket: "#5fa069",
      voiceGender: "male",
      voiceId: "town3CountingKidB",
      kind: "child",
      wander: true,
      conversationKeys: ["npc.town3CountingKidB.line1", "npc.town3CountingKidB.line2"],
    },
    {
      nameKey: "npc.town3Shopper",
      x: 33,
      y: 17,
      dir: "left",
      nextTurn: 0,
      jacket: "#b56b84",
      voiceGender: "female",
      voiceId: "town3Shopper",
      wander: true,
      conversationPools: [
        ["npc.town3Shopper.line1", "npc.town3Shopper.line2"],
        ["npc.town3Shopper.pool2.line1", "npc.town3Shopper.pool2.line2"],
      ],
    },
  ];

  return {
    id: "town3",
    kind: "outdoor",
    map: town3Map,
    width,
    height,
    buildings: town3Buildings,
    objects: town3Objects,
    interactables: town3Interactables,
    npcs: town3Npcs,
    areaKey: "area.town3",
    musicKey: "town3",
  };
}

function createTown3InteriorScenes(town3Buildings) {
  const bySceneId = Object.fromEntries(town3Buildings.map((building) => [building.sceneId, building]));

  const countingHouse = createInteriorScene({
    id: "town3CountingHouse",
    areaKey: "area.town3CountingHouse",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.town3CountingHouse,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(countingHouse, 2, 7, 16, 4, "carpetBlue");
  fillInteriorObject(countingHouse, 3, 2, 3, 1, "mapBoard", "object.town3SinoBoard", {
    studyBoardKey: "sinoNumbers",
    progressFlagOnStudyBoard: TOWN3_FLAGS.sinoBoardRead,
  });
  fillInteriorObject(countingHouse, 8, 2, 3, 1, "mapBoard", "object.town3NativeBoard", {
    studyBoardKey: "nativeNumbers",
    progressFlagOnStudyBoard: TOWN3_FLAGS.nativeBoardRead,
    requiredFlags: [TOWN3_FLAGS.sinoPracticePassed],
    lockedConversationKeys: ["object.town3NativeBoard.locked"],
  });
  fillInteriorObject(countingHouse, 13, 2, 2, 1, "bookcase", "object.town3CounterBoard", {
    studyBoardKey: "counters",
    progressFlagOnStudyBoard: TOWN3_FLAGS.counterBoardRead,
    requiredFlags: [TOWN3_FLAGS.nativePracticePassed],
    lockedConversationKeys: ["object.town3CounterBoard.locked"],
  });
  fillInteriorObject(countingHouse, 16, 2, 3, 1, "blackboard", "object.town3PriceBlackboard", {
    drillResolver: resolveTown3BlackboardDrill,
    conversationResolver: resolveTown3BlackboardConversation,
  });
  fillInteriorObject(countingHouse, 5, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  fillInteriorObject(countingHouse, 9, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  fillInteriorObject(countingHouse, 13, 8, 2, 1, "desk", "object.town3AbacusDesk", {
    drillResolver: resolveTown3AbacusDrill,
    conversationResolver: resolveTown3AbacusConversation,
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusMaster",
    x: 10,
    y: 5,
    dir: "down",
    jacket: "#287368",
    voiceGender: "male",
    voiceId: "town3AbacusMaster",
    conversationKeys: ["npc.town3AbacusMaster.line1", "npc.town3AbacusMaster.line2"],
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusPupilA",
    x: 6,
    y: 10,
    dir: "up",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town3AbacusPupilA",
    kind: "child",
    conversationKeys: ["npc.town3AbacusPupilA.line1", "npc.town3AbacusPupilA.line2"],
  });
  addInteriorNpc(countingHouse, {
    nameKey: "npc.town3AbacusPupilB",
    x: 14,
    y: 10,
    dir: "up",
    jacket: "#e2a843",
    voiceGender: "male",
    voiceId: "town3AbacusPupilB",
    kind: "child",
    conversationKeys: ["npc.town3AbacusPupilB.line1", "npc.town3AbacusPupilB.line2"],
  });

  const guildHall = createInteriorScene({
    id: "town3GuildHall",
    areaKey: "area.town3GuildHall",
    width: 18,
    height: 12,
    entryX: 9,
    returnBuilding: bySceneId.town3GuildHall,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(guildHall, 6, 5, 6, 3, "carpetRed");
  fillInteriorObject(guildHall, 7, 3, 4, 1, "counter", "object.town3BadgePodium", {
    conversationKeys: ["object.town3BadgePodium.line1"],
    drillKey: "town3NumberBadge",
    requiredFlags: [
      TOWN3_FLAGS.sinoExamPassed,
      TOWN3_FLAGS.nativeExamPassed,
      TOWN3_FLAGS.countersPracticePassed,
      TOWN3_FLAGS.pricesPracticePassed,
    ],
    lockedConversationKeys: ["object.town3BadgePodium.locked"],
  });
  fillInteriorObject(guildHall, 2, 6, 2, 1, "bookcase", "object.town3GuildLedger", {
    conversationKeys: ["object.town3GuildLedger.line1"],
  });
  addInteriorNpc(guildHall, {
    nameKey: "npc.town3GuildLeader",
    x: 9,
    y: 2,
    dir: "down",
    jacket: "#5f4b86",
    voiceGender: "female",
    voiceId: "town3GuildLeader",
    conversationResolver: resolveTown3GuildLeaderConversation,
  });
  addInteriorNpc(guildHall, {
    nameKey: "npc.town3GuildClerk",
    x: 4,
    y: 8,
    dir: "right",
    jacket: "#6c9a50",
    voiceGender: "male",
    voiceId: "town3GuildClerk",
    conversationKeys: ["npc.town3GuildClerk.line1", "npc.town3GuildClerk.line2"],
  });

  const snackCafe = createInteriorScene({
    id: "town3SnackCafe",
    areaKey: "area.town3SnackCafe",
    width: 14,
    height: 10,
    entryX: 7,
    returnBuilding: bySceneId.town3SnackCafe,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(snackCafe, 2, 5, 10, 3, "tatami");
  fillInteriorObject(snackCafe, 4, 2, 6, 1, "counter", "object.town3CafeCounter", {
    conversationKeys: ["object.town3CafeCounter.line1"],
    drillKey: "town3CafeOrder",
  });
  fillInteriorObject(snackCafe, 3, 6, 2, 2, "table", "object.town3CafeTable", {
    conversationKeys: ["object.town3CafeTable.line1"],
  });
  fillInteriorObject(snackCafe, 9, 6, 2, 2, "table", "object.town3CafeTable", {
    conversationKeys: ["object.town3CafeTable.line1"],
  });
  addInteriorNpc(snackCafe, {
    nameKey: "npc.town3Barista",
    x: 6,
    y: 1,
    dir: "down",
    jacket: "#7d3137",
    voiceGender: "female",
    voiceId: "town3Barista",
    conversationPools: [
      ["npc.town3Barista.line1", "npc.town3Barista.line2"],
      ["npc.town3Barista.pool2.line1", "npc.town3Barista.pool2.line2"],
    ],
  });
  addInteriorNpc(snackCafe, {
    nameKey: "npc.town3CafeCustomer",
    x: 6,
    y: 5,
    dir: "left",
    jacket: "#b56b48",
    voiceGender: "male",
    voiceId: "town3CafeCustomer",
    conversationKeys: ["npc.town3CafeCustomer.line1", "npc.town3CafeCustomer.line2"],
  });

  const town3Guesthouse = createInteriorScene({
    id: "town3Guesthouse",
    areaKey: "area.town3Guesthouse",
    width: 12,
    height: 9,
    entryX: 6,
    returnBuilding: bySceneId.town3Guesthouse,
    returnSceneId: "town3",
    musicKey: "town3",
  });
  fillInteriorTile(town3Guesthouse, 2, 4, 8, 3, "carpetGreen");
  placeInteriorObject(town3Guesthouse, 2, 2, "bed", "object.bed", {
    conversationKeys: ["object.town3GuesthouseBed.line1"],
  });
  fillInteriorObject(town3Guesthouse, 7, 4, 2, 2, "table", "object.familyTable", {
    conversationKeys: ["object.town3GuesthouseTable.line1"],
  });
  addInteriorNpc(town3Guesthouse, {
    nameKey: "npc.town3GuesthouseHost",
    x: 8,
    y: 2,
    dir: "down",
    jacket: "#8a5624",
    voiceGender: "male",
    voiceId: "town3GuesthouseHost",
    conversationKeys: ["npc.town3GuesthouseHost.line1", "npc.town3GuesthouseHost.line2"],
  });

  return {
    town3CountingHouse: countingHouse,
    town3GuildHall: guildHall,
    town3SnackCafe: snackCafe,
    town3Guesthouse: town3Guesthouse,
  };
}

window.KA.world.registerScene(() => {
  const town3 = createTown3Scene();
  return {
    town3,
    ...createTown3InteriorScenes(town3.buildings),
  };
});
