const TOWN2_FLAGS = {
  arrived: "town2.arrived",
  mixedReviewPassed: "town2.mixedReviewPassed",
  identityPassed: "town2.identityPassed",
  lostFoundPassed: "town2.lostFoundPassed",
  labelsPassed: "town2.labelsPassed",
  actionsPassed: "town2.actionsPassed",
  readingReviewPassed: "town2.readingReviewPassed",
  finalBadgePassed: "town2.finalBadgePassed",
};

const TOWN2_QUESTS = [
  {
    id: "town2Arrival",
    titleKey: "quest.town2.arrival",
    steps: [{ flag: TOWN2_FLAGS.arrived, objectiveKey: "quest.town2.arrival.greet", whereKey: "area.town2" }],
  },
  {
    id: "town2Identity",
    titleKey: "quest.town2.identity",
    steps: [{ flag: TOWN2_FLAGS.identityPassed, objectiveKey: "quest.town2.identity.pass", whereKey: "area.town2InfoCenter" }],
  },
  {
    id: "town2LostFound",
    titleKey: "quest.town2.lostFound",
    steps: [{ flag: TOWN2_FLAGS.lostFoundPassed, objectiveKey: "quest.town2.lostFound.pass", whereKey: "area.town2LostFound" }],
  },
  {
    id: "town2Labels",
    titleKey: "quest.town2.labels",
    steps: [{ flag: TOWN2_FLAGS.labelsPassed, objectiveKey: "quest.town2.labels.pass", whereKey: "area.town2LabelMuseum" }],
  },
  {
    id: "town2Actions",
    titleKey: "quest.town2.actions",
    steps: [{ flag: TOWN2_FLAGS.actionsPassed, objectiveKey: "quest.town2.actions.pass", whereKey: "area.town2" }],
  },
  {
    id: "town2ReadingReview",
    titleKey: "quest.town2.readingReview",
    steps: [{ flag: TOWN2_FLAGS.readingReviewPassed, objectiveKey: "quest.town2.readingReview.pass", whereKey: "area.town2ReviewLibrary" }],
  },
  {
    id: "town2FirstWordsBadge",
    titleKey: "quest.town2.firstWordsBadge",
    steps: [{ flag: TOWN2_FLAGS.finalBadgePassed, objectiveKey: "quest.town2.firstWordsBadge.podium", whereKey: "area.town2CityHall" }],
  },
];

window.KA.quests.registerChapter({ id: "town2", titleKey: "journal.chapter.town2", sceneIds: ["town2"], quests: TOWN2_QUESTS });

window.KA.badges.register({ id: "firstWords", titleKey: "badge.firstWords", flag: TOWN2_FLAGS.finalBadgePassed });

window.KA.drills.sentences.register("town2", [
  { promptKey: "drill.town2SentenceBuilder.prompt", chunks: ["저는", "책을", "읽어요"], teaches: ["town2.sov"] },
  { promptKey: "drill.town2SentenceBuilder.prompt", chunks: ["민수는", "물을", "마셔요"], teaches: ["town2.sov"] },
  { promptKey: "drill.town2SentenceBuilder.prompt", chunks: ["하나는", "사과를", "먹어요"], teaches: ["town2.sov"] },
  { promptKey: "drill.town2SentenceBuilder.prompt", chunks: ["지우는", "이름을", "써요"], teaches: ["town2.sov"] },
]);

window.KA.drills.register({
  town2SentenceBuilder: {
    titleKey: "drill.town2SentenceBuilder.title",
    shuffleChoices: true,
    stepCount: 3,
    generateSteps: () =>
      window.KA.drills.sentences.generate({
        chapterIds: ["town2"],
        count: 3,
        promptKey: "drill.town2SentenceBuilder.prompt",
      }),
  },
});

function town2FinalStationsPassed() {
  return [
    TOWN2_FLAGS.identityPassed,
    TOWN2_FLAGS.lostFoundPassed,
    TOWN2_FLAGS.labelsPassed,
    TOWN2_FLAGS.actionsPassed,
    TOWN2_FLAGS.readingReviewPassed,
  ].every((flag) => hasProgressFlag(flag));
}

function resolveTown2RoadGuardConversation() {
  if (hasProgressFlag(TOWN2_FLAGS.finalBadgePassed)) {
    return ["npc.town2RoadGuard.badge1", "npc.town2RoadGuard.badge2"];
  }
  return ["npc.town2RoadGuard.noBadge1", "npc.town2RoadGuard.noBadge2"];
}

function resolveTown2CityLeaderConversation() {
  if (hasProgressFlag(TOWN2_FLAGS.finalBadgePassed)) {
    return ["npc.town2CityLeader.done1"];
  }
  if (town2FinalStationsPassed()) {
    return ["npc.town2CityLeader.ready1"];
  }
  return ["npc.town2CityLeader.intro1", "npc.town2CityLeader.intro2"];
}

function buildTown2Map(town2Map, width, height) {
  for (let x = 0; x < width; x += 1) {
    setMapTile(town2Map, x, 0, "stone");
    setMapTile(town2Map, x, height - 1, "stone");
  }

  for (let y = 0; y < height; y += 1) {
    setMapTile(town2Map, 0, y, "stone");
    setMapTile(town2Map, width - 1, y, "stone");
  }

  const pathRects = [
    [22, 8, 5, 30],
    [10, 8, 33, 4],
    [15, 15, 18, 10],
    [4, 17, 18, 4],
    [26, 17, 18, 4],
    [5, 27, 22, 5],
    [33, 23, 11, 9],
    [38, 0, 5, 12],
    [8, 7, 3, 2],
    [9, 16, 3, 2],
    [8, 26, 3, 2],
    [36, 15, 3, 3],
    [17, 29, 3, 5],
    [37, 7, 3, 2],
  ];
  for (const rect of pathRects) fillMapRect(town2Map, ...rect, "path");

  fillMapRect(town2Map, 22, height - 1, 5, 1, "path");
  fillMapRect(town2Map, 38, 0, 5, 1, "path");

  const tallGrassPatches = [
    [6, 32, 11, 4],
    [2, 28, 5, 3],
    [28, 29, 5, 5],
  ];
  for (const patch of tallGrassPatches) fillMapRect(town2Map, ...patch, "tallGrass");

  fillMapRect(town2Map, 42, 32, 3, 3, "water");

  const hedgeSpots = [
    [2, 1], [3, 1], [4, 1], [12, 1], [13, 1], [33, 1], [34, 1],
    [45, 2], [45, 3], [45, 4], [45, 5], [2, 12], [2, 13], [2, 14],
    [45, 14], [45, 15], [45, 16], [2, 22], [2, 23], [2, 24],
    [45, 24], [45, 25], [45, 26], [18, 35], [19, 35], [28, 35], [29, 35],
  ];
  for (const [x, y] of hedgeSpots) setMapTile(town2Map, x, y, "hedge");

  const treeSpots = [
    [2, 3], [3, 5], [4, 3], [2, 6], [44, 6], [45, 8],
    [3, 31], [4, 34], [2, 35], [44, 29], [46, 31], [45, 35],
  ];
  for (const [x, y] of treeSpots) setMapTile(town2Map, x, y, "tree");

  const flowerSpots = [
    [14, 13], [15, 13], [16, 13], [31, 13], [32, 13],
    [13, 16], [34, 16], [14, 24], [33, 24], [21, 26],
    [22, 26], [27, 26], [28, 26], [35, 22], [36, 22],
    [41, 22], [42, 22], [36, 33], [37, 33], [39, 33],
  ];
  for (const [x, y] of flowerSpots) setMapTile(town2Map, x, y, "flowers");

  const ledges = [
    [6, 34], [7, 34], [16, 30], [27, 14], [28, 14], [29, 14],
    [43, 12], [44, 12], [30, 34], [31, 34],
  ];
  for (const [x, y] of ledges) setMapTile(town2Map, x, y, "ledge");
}

function createTown2Scene() {
  const width = 48;
  const height = 38;
  const town2Map = createTileMap(width, height, "grass");

  buildTown2Map(town2Map, width, height);

  const town2Buildings = [
    {
      labelKey: "object.town2CityHall",
      sceneId: "town2CityHall",
      x: 15,
      y: 2,
      w: 18,
      h: 7,
      doorX: 24,
      doorY: 8,
      roof: "#be6d39",
      trim: "#874a28",
      important: true,
    },
    {
      labelKey: "object.town2ReviewLibrary",
      sceneId: "town2ReviewLibrary",
      x: 5,
      y: 2,
      w: 8,
      h: 6,
      doorX: 9,
      doorY: 7,
      roof: COLORS.roofTeal,
      trim: "#287368",
    },
    {
      labelKey: "object.town2InfoCenter",
      sceneId: "town2InfoCenter",
      x: 5,
      y: 11,
      w: 10,
      h: 6,
      doorX: 10,
      doorY: 16,
      roof: COLORS.roofBlue,
      trim: "#2e4e83",
    },
    {
      labelKey: "object.town2LostFound",
      sceneId: "town2LostFound",
      x: 4,
      y: 22,
      w: 10,
      h: 5,
      doorX: 9,
      doorY: 26,
      roof: COLORS.roofViolet,
      trim: "#5f4b86",
    },
    {
      labelKey: "object.town2LabelMuseum",
      sceneId: "town2LabelMuseum",
      x: 32,
      y: 10,
      w: 11,
      h: 6,
      doorX: 37,
      doorY: 15,
      roof: COLORS.roofRed,
      trim: "#7d3137",
    },
    {
      labelKey: "object.town2Guesthouse",
      sceneId: "town2Guesthouse",
      x: 15,
      y: 25,
      w: 7,
      h: 5,
      doorX: 18,
      doorY: 29,
      roof: "#d18a3f",
      trim: "#8a5624",
    },
    {
      labelKey: "object.town2EastResidence",
      sceneId: "town2EastResidence",
      x: 34,
      y: 3,
      w: 7,
      h: 5,
      doorX: 37,
      doorY: 7,
      roof: "#6a9a72",
      trim: "#3f6948",
    },
  ];

  const town2Objects = [
    { x: 18, y: 19, w: 3, h: 2, type: "trailRestTable" },
    { x: 29, y: 19, w: 3, h: 2, type: "routeObjectStall" },
    { x: 17, y: 23, w: 3, h: 1, type: "speechBench" },
    { x: 7, y: 31, w: 3, h: 2, type: "trailRestTable" },
  ];

  const town2Interactables = [
    {
      labelKey: "object.town2WelcomeSign",
      x: 24,
      y: 34,
      solid: true,
      kind: "sign",
      conversationKeys: ["sign.town2Welcome.line1", "sign.town2Welcome.line2"],
    },
    {
      labelKey: "object.town2CentralReviewBoard",
      x: 16,
      y: 17,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2CentralReviewBoard.line1"],
      drillKey: "town2MixedReview",
    },
    {
      labelKey: "object.town2DistanceNear",
      x: 21,
      y: 22,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceNear.line1"],
    },
    {
      labelKey: "object.town2DistanceMiddle",
      x: 26,
      y: 18,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceMiddle.line1"],
    },
    {
      labelKey: "object.town2DistanceFar",
      x: 31,
      y: 16,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2DistanceFar.line1"],
    },
    {
      labelKey: "object.town2ActionParkBoard",
      x: 34,
      y: 24,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2ActionParkBoard.line1"],
      drillKey: "town2ActionPark",
    },
    {
      labelKey: "object.town2Trail2GateSign",
      x: 42,
      y: 3,
      solid: true,
      kind: "sign",
      conversationKeys: ["object.town2Trail2GateSign.line1"],
    },
    ...createRectInteractions({
      labelKey: "object.town2ReviewTable",
      x: 18,
      y: 19,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2ReviewTable.line1"],
      drillKey: "town2MixedReview",
    }),
    ...createRectInteractions({
      labelKey: "object.town2ObjectLabelStall",
      x: 29,
      y: 19,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2ObjectLabelStall.line1"],
      drillKey: "town2DistanceLabels",
    }),
    ...createRectInteractions({
      labelKey: "object.town2SpeechBench",
      x: 17,
      y: 23,
      w: 3,
      h: 1,
      conversationKeys: ["object.town2SpeechBench.line1"],
      drillKey: "town2SentenceBuilder",
    }),
    ...createRectInteractions({
      labelKey: "object.town2SearchBasket",
      x: 7,
      y: 31,
      w: 3,
      h: 2,
      conversationKeys: ["object.town2SearchBasket.line1"],
      drillKey: "town2LostFound",
    }),
    {
      labelKey: "object.town2HiddenBookSpot",
      x: 8,
      y: 33,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenBookSpot.line1"],
      hidden: true,
    },
    {
      labelKey: "object.town2HiddenWaterSpot",
      x: 12,
      y: 34,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenWaterSpot.line1"],
      hidden: true,
    },
    {
      labelKey: "object.town2HiddenBagSpot",
      x: 15,
      y: 32,
      solid: false,
      kind: "object",
      conversationKeys: ["object.town2HiddenBagSpot.line1"],
      hidden: true,
    },
    ...createRouteTriggers({
      labelKey: "object.routeSouth",
      fromX: 22,
      toX: 26,
      y: height - 1,
      targetSceneId: "trail1",
      targetX: 17,
      targetY: 1,
      targetDir: "down",
    }),
    ...createRouteTriggers({
      labelKey: "object.routeTrail2",
      fromX: 38,
      toX: 42,
      y: 0,
      targetSceneId: "trail2",
      targetX: 17,
      targetY: 52,
      targetDir: "up",
      conversationKeys: ["route.trail2.pending"],
      requiredFlags: [TOWN2_FLAGS.finalBadgePassed],
      lockedConversationKeys: ["route.trail2.locked"],
    }),
    ...town2Buildings.map((building) => ({
      labelKey: `${building.labelKey}.door`,
      sceneId: building.sceneId,
      x: building.doorX,
      y: building.doorY,
      solid: false,
      kind: "door",
    })),
  ];

  const town2Npcs = [
    {
      nameKey: "npc.town2GateGreeter",
      x: 24,
      y: 35,
      dir: "down",
      nextTurn: 0,
      jacket: "#4f8cc9",
      voiceGender: "female",
      voiceId: "town2GateGreeter",
      conversationPools: [
        ["npc.town2GateGreeter.line1", "npc.town2GateGreeter.line2"],
        ["npc.town2GateGreeter.pool2.line1", "npc.town2GateGreeter.pool2.line2"],
      ],
      progressFlagOnTalk: TOWN2_FLAGS.arrived,
    },
    {
      nameKey: "npc.town2PlazaGuide",
      x: 20,
      y: 17,
      dir: "down",
      nextTurn: 0,
      jacket: "#a65d3e",
      voiceGender: "male",
      voiceId: "town2PlazaGuide",
      conversationResolver: () => chapterGuideLines("town2", "npc.town2PlazaGuide.line1"),
    },
    {
      nameKey: "npc.town2ReviewClerk",
      x: 18,
      y: 22,
      dir: "up",
      nextTurn: 0,
      jacket: "#6c9a50",
      voiceGender: "female",
      voiceId: "town2ReviewClerk",
      conversationPools: [
        ["npc.town2ReviewClerk.line1", "npc.town2ReviewClerk.line2"],
        ["npc.town2ReviewClerk.pool2.line1", "npc.town2ReviewClerk.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town2LabelRunner",
      x: 30,
      y: 22,
      dir: "left",
      nextTurn: 0,
      jacket: "#8a6bb7",
      voiceGender: "female",
      voiceId: "town2LabelRunner",
      conversationPools: [
        ["npc.town2LabelRunner.line1", "npc.town2LabelRunner.line2"],
        ["npc.town2LabelRunner.pool2.line1", "npc.town2LabelRunner.pool2.line2"],
      ],
      wander: true,
    },
    {
      nameKey: "npc.town2LostChild",
      x: 11,
      y: 28,
      dir: "down",
      nextTurn: 0,
      jacket: "#e2a843",
      voiceGender: "female",
      voiceId: "town2LostChild",
      conversationKeys: ["npc.town2LostChild.line1", "npc.town2LostChild.line2"],
      kind: "child",
    },
    {
      nameKey: "npc.town2ActionCoach",
      x: 36,
      y: 24,
      dir: "down",
      nextTurn: 0,
      jacket: "#497a4d",
      voiceGender: "male",
      voiceId: "town2ActionCoach",
      conversationPools: [
        ["npc.town2ActionCoach.line1", "npc.town2ActionCoach.line2"],
        ["npc.town2ActionCoach.pool2.line1", "npc.town2ActionCoach.pool2.line2"],
      ],
    },
    {
      nameKey: "npc.town2ReaderActor",
      x: 37,
      y: 29,
      dir: "left",
      nextTurn: 0,
      jacket: "#3f7fb1",
      voiceGender: "male",
      voiceId: "town2ReaderActor",
      conversationKeys: ["npc.town2ReaderActor.line1", "npc.town2ReaderActor.line2"],
    },
    {
      nameKey: "npc.town2WaterActor",
      x: 41,
      y: 27,
      dir: "left",
      nextTurn: 0,
      jacket: "#4c8f95",
      voiceGender: "female",
      voiceId: "town2WaterActor",
      conversationKeys: ["npc.town2WaterActor.line1", "npc.town2WaterActor.line2"],
      wander: true,
    },
    {
      nameKey: "npc.town2AppleActor",
      x: 35,
      y: 31,
      dir: "right",
      nextTurn: 0,
      jacket: "#b56b84",
      voiceGender: "female",
      voiceId: "town2AppleActor",
      conversationKeys: ["npc.town2AppleActor.line1", "npc.town2AppleActor.line2"],
    },
    {
      nameKey: "npc.town2WriterActor",
      x: 40,
      y: 31,
      dir: "up",
      nextTurn: 0,
      jacket: "#bd6e48",
      voiceGender: "male",
      voiceId: "town2WriterActor",
      conversationKeys: ["npc.town2WriterActor.line1", "npc.town2WriterActor.line2"],
    },
    {
      nameKey: "npc.town2RoadGuard",
      x: 42,
      y: 4,
      dir: "down",
      nextTurn: 0,
      jacket: "#5f7f9a",
      voiceGender: "male",
      voiceId: "town2RoadGuard",
      conversationResolver: resolveTown2RoadGuardConversation,
    },
    {
      nameKey: "npc.town2Resident",
      x: 35,
      y: 8,
      dir: "down",
      nextTurn: 0,
      jacket: "#b65c7a",
      voiceGender: "female",
      voiceId: "town2Resident",
      conversationPools: [
        ["npc.town2Resident.line1", "npc.town2Resident.line2"],
        ["npc.town2Resident.pool2.line1", "npc.town2Resident.pool2.line2"],
      ],
      wander: true,
    },
  ];

  return {
    id: "town2",
    kind: "outdoor",
    map: town2Map,
    width,
    height,
    buildings: town2Buildings,
    objects: town2Objects,
    interactables: town2Interactables,
    npcs: town2Npcs,
    areaKey: "area.town2",
    musicKey: "town2",
  };
}

function createTown2InteriorScenes(town2Buildings) {
  const bySceneId = Object.fromEntries(town2Buildings.map((building) => [building.sceneId, building]));

  const town2CityHall = createInteriorScene({
    id: "town2CityHall",
    areaKey: "area.town2CityHall",
    width: 26,
    height: 18,
    entryX: 13,
    returnBuilding: bySceneId.town2CityHall,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2CityHall, 10, 12, 7, 4, "carpetBlue");
  fillInteriorTile(town2CityHall, 2, 2, 6, 4, "carpetGreen");
  fillInteriorTile(town2CityHall, 10, 2, 6, 4, "carpetRed");
  fillInteriorTile(town2CityHall, 18, 2, 6, 4, "tatami");
  fillInteriorObject(town2CityHall, 11, 3, 4, 1, "counter", "object.town2BadgePodium", {
    conversationKeys: ["object.town2BadgePodium.line1"],
    drillKey: "town2FinalBadge",
    requiredFlags: [
      TOWN2_FLAGS.identityPassed,
      TOWN2_FLAGS.lostFoundPassed,
      TOWN2_FLAGS.labelsPassed,
      TOWN2_FLAGS.actionsPassed,
      TOWN2_FLAGS.readingReviewPassed,
    ],
    lockedConversationKeys: ["object.town2BadgePodium.locked.line1"],
  });
  fillInteriorObject(town2CityHall, 3, 3, 3, 1, "bookcase", "object.town2FinalReadingStation", {
    conversationKeys: ["object.town2FinalReadingStation.line1"],
    drillKey: "town2ReadingReview",
  });
  fillInteriorObject(town2CityHall, 11, 7, 3, 1, "desk", "object.town2FinalNameStation", {
    conversationKeys: ["object.town2FinalNameStation.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2CityHall, 19, 3, 3, 1, "table", "object.town2FinalObjectStation", {
    conversationKeys: ["object.town2FinalObjectStation.line1"],
    drillKey: "town2DistanceLabels",
  });
  fillInteriorObject(town2CityHall, 4, 11, 3, 1, "supplyShelf", "object.town2FinalSearchStation", {
    conversationKeys: ["object.town2FinalSearchStation.line1"],
    drillKey: "town2LostFound",
  });
  fillInteriorObject(town2CityHall, 18, 12, 4, 1, "desk", "object.town2FinalActionStation", {
    conversationKeys: ["object.town2FinalActionStation.line1"],
    drillKey: "town2ActionPark",
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2CityLeader",
    x: 13,
    y: 2,
    dir: "down",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "town2CityLeader",
    conversationResolver: resolveTown2CityLeaderConversation,
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ReadingAttendant",
    x: 6,
    y: 5,
    dir: "left",
    jacket: "#6c9a50",
    voiceGender: "female",
    voiceId: "town2ReadingAttendant",
    conversationKeys: ["npc.town2ReadingAttendant.line1", "npc.town2ReadingAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2NameAttendant",
    x: 15,
    y: 7,
    dir: "left",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town2NameAttendant",
    conversationKeys: ["npc.town2NameAttendant.line1", "npc.town2NameAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ObjectAttendant",
    x: 22,
    y: 5,
    dir: "left",
    jacket: "#8a6bb7",
    voiceGender: "male",
    voiceId: "town2ObjectAttendant",
    conversationKeys: ["npc.town2ObjectAttendant.line1", "npc.town2ObjectAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2SearchAttendant",
    x: 7,
    y: 12,
    dir: "left",
    jacket: "#e2a843",
    voiceGender: "female",
    voiceId: "town2SearchAttendant",
    conversationKeys: ["npc.town2SearchAttendant.line1", "npc.town2SearchAttendant.line2"],
  });
  addInteriorNpc(town2CityHall, {
    nameKey: "npc.town2ActionAttendant",
    x: 22,
    y: 13,
    dir: "left",
    jacket: "#497a4d",
    voiceGender: "male",
    voiceId: "town2ActionAttendant",
    conversationKeys: ["npc.town2ActionAttendant.line1", "npc.town2ActionAttendant.line2"],
  });

  const town2ReviewLibrary = createInteriorScene({
    id: "town2ReviewLibrary",
    areaKey: "area.town2ReviewLibrary",
    width: 16,
    height: 12,
    entryX: 8,
    returnBuilding: bySceneId.town2ReviewLibrary,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2ReviewLibrary, 2, 6, 12, 2, "carpetGreen");
  fillInteriorObject(town2ReviewLibrary, 2, 2, 4, 1, "bookcase", "object.town2ReadingShelf", {
    conversationKeys: ["object.town2ReadingShelf.line1"],
    drillKey: "town2ReadingReview",
  });
  fillInteriorObject(town2ReviewLibrary, 10, 2, 4, 1, "mapBoard", "object.town2BatchimWall", {
    conversationKeys: ["object.town2BatchimWall.line1"],
    drillKey: "batchimBridge",
  });
  fillInteriorObject(town2ReviewLibrary, 6, 7, 2, 2, "desk", "object.town2ReadingDesk", {
    conversationKeys: ["object.town2ReadingDesk.line1"],
    drillKey: "town2ReadingReview",
  });
  addInteriorNpc(town2ReviewLibrary, {
    nameKey: "npc.town2Librarian",
    x: 8,
    y: 4,
    dir: "down",
    jacket: "#6c9a50",
    voiceGender: "female",
    voiceId: "town2Librarian",
    conversationKeys: ["npc.town2Librarian.line1", "npc.town2Librarian.line2"],
  });

  const town2InfoCenter = createInteriorScene({
    id: "town2InfoCenter",
    areaKey: "area.town2InfoCenter",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.town2InfoCenter,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2InfoCenter, 4, 7, 10, 2, "carpetBlue");
  fillInteriorObject(town2InfoCenter, 5, 2, 8, 1, "counter", "object.town2RegistrationCounter", {
    conversationKeys: ["object.town2RegistrationCounter.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2InfoCenter, 6, 7, 3, 2, "table", "object.town2NameFormTable", {
    conversationKeys: ["object.town2NameFormTable.line1"],
    drillKey: "town2IdentityOffice",
  });
  fillInteriorObject(town2InfoCenter, 13, 5, 2, 3, "brochureRack", "object.town2RoleCardRack", {
    conversationKeys: ["object.town2RoleCardRack.line1"],
    drillKey: "town2IdentityOffice",
  });
  placeInteriorObject(town2InfoCenter, 3, 5, "mapBoard", "object.town2WaitingLineSign", {
    conversationKeys: ["object.town2WaitingLineSign.line1"],
  });
  addInteriorNpc(town2InfoCenter, {
    nameKey: "npc.town2InfoClerk",
    x: 9,
    y: 1,
    dir: "down",
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town2InfoClerk",
    conversationKeys: ["npc.town2InfoClerk.line1", "npc.town2InfoClerk.line2"],
  });
  addInteriorNpc(town2InfoCenter, {
    nameKey: "npc.town2NameAttendant",
    x: 4,
    y: 8,
    dir: "right",
    jacket: "#a65d3e",
    voiceGender: "male",
    voiceId: "town2InfoApplicant",
    conversationKeys: ["npc.town2NameAttendant.line1", "npc.town2NameAttendant.line2"],
  });

  const town2LostFound = createInteriorScene({
    id: "town2LostFound",
    areaKey: "area.town2LostFound",
    width: 18,
    height: 13,
    entryX: 9,
    returnBuilding: bySceneId.town2LostFound,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2LostFound, 3, 8, 12, 2, "carpetGreen");
  fillInteriorObject(town2LostFound, 5, 2, 8, 1, "counter", "object.town2LostFoundCounter", {
    conversationKeys: ["object.town2LostFoundCounter.line1"],
    drillKey: "town2LostFound",
  });
  placeInteriorObject(town2LostFound, 3, 4, "bookcase", "object.town2ObjectShelfBook", {
    conversationKeys: ["object.town2ObjectShelfBook.line1"],
  });
  placeInteriorObject(town2LostFound, 6, 4, "supplyShelf", "object.town2ObjectShelfWater", {
    conversationKeys: ["object.town2ObjectShelfWater.line1"],
  });
  placeInteriorObject(town2LostFound, 9, 4, "brochureRack", "object.town2ObjectShelfBag", {
    conversationKeys: ["object.town2ObjectShelfBag.line1"],
  });
  placeInteriorObject(town2LostFound, 12, 4, "produce", "object.town2ObjectShelfApple", {
    conversationKeys: ["object.town2ObjectShelfApple.line1"],
  });
  placeInteriorObject(town2LostFound, 14, 7, "mapBoard", "object.town2LostFoundClipboard", {
    conversationKeys: ["object.town2LostFoundClipboard.line1"],
    drillKey: "town2LostFound",
  });
  addInteriorNpc(town2LostFound, {
    nameKey: "npc.town2LostFoundOwner",
    x: 9,
    y: 1,
    dir: "down",
    jacket: "#8a6bb7",
    voiceGender: "female",
    voiceId: "town2LostFoundOwner",
    conversationKeys: ["npc.town2LostFoundOwner.line1", "npc.town2LostFoundOwner.line2"],
  });

  const town2LabelMuseum = createInteriorScene({
    id: "town2LabelMuseum",
    areaKey: "area.town2LabelMuseum",
    width: 20,
    height: 14,
    entryX: 10,
    returnBuilding: bySceneId.town2LabelMuseum,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2LabelMuseum, 2, 7, 16, 3, "tatami");
  fillInteriorObject(town2LabelMuseum, 3, 5, 3, 1, "table", "object.town2NearDisplay", {
    conversationKeys: ["object.town2NearDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 8, 5, 3, 1, "table", "object.town2ListenerDisplay", {
    conversationKeys: ["object.town2ListenerDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 14, 5, 3, 1, "table", "object.town2FarDisplay", {
    conversationKeys: ["object.town2FarDisplay.line1"],
  });
  fillInteriorObject(town2LabelMuseum, 8, 9, 4, 1, "desk", "object.town2LabelTray", {
    conversationKeys: ["object.town2LabelTray.line1"],
    drillKey: "town2DistanceLabels",
  });
  placeInteriorObject(town2LabelMuseum, 16, 2, "mapBoard", "object.town2MuseumRuleSign", {
    conversationKeys: ["object.town2MuseumRuleSign.line1"],
  });
  addInteriorNpc(town2LabelMuseum, {
    nameKey: "npc.town2MuseumCurator",
    x: 10,
    y: 3,
    dir: "down",
    jacket: "#b65c7a",
    voiceGender: "female",
    voiceId: "town2MuseumCurator",
    conversationKeys: ["npc.town2MuseumCurator.line1", "npc.town2MuseumCurator.line2"],
  });

  const town2Guesthouse = createInteriorScene({
    id: "town2Guesthouse",
    areaKey: "area.town2Guesthouse",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.town2Guesthouse,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2Guesthouse, 4, 7, 6, 2, "carpetRed");
  fillInteriorObject(town2Guesthouse, 2, 2, 2, 2, "bed", "object.bed");
  fillInteriorObject(town2Guesthouse, 6, 5, 2, 2, "table", "object.town2Guestbook", {
    conversationKeys: ["object.town2Guestbook.line1"],
  });
  fillInteriorObject(town2Guesthouse, 10, 2, 2, 1, "bookcase", "object.town2HintBookshelf", {
    conversationKeys: ["object.town2HintBookshelf.line1"],
  });
  addInteriorNpc(town2Guesthouse, {
    nameKey: "npc.town2GuesthouseHost",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#bd6e48",
    voiceGender: "female",
    voiceId: "town2GuesthouseHost",
    conversationKeys: ["npc.town2GuesthouseHost.line1", "npc.town2GuesthouseHost.line2"],
  });

  const town2EastResidence = createInteriorScene({
    id: "town2EastResidence",
    areaKey: "area.town2EastResidence",
    width: 14,
    height: 12,
    entryX: 7,
    returnBuilding: bySceneId.town2EastResidence,
    returnSceneId: "town2",
    musicKey: "town2",
  });
  fillInteriorTile(town2EastResidence, 3, 6, 8, 2, "carpetGreen");
  fillInteriorObject(town2EastResidence, 3, 3, 4, 1, "mapBoard", "object.town2RoadMap", {
    conversationKeys: ["object.town2RoadMap.line1"],
  });
  fillInteriorObject(town2EastResidence, 6, 7, 2, 2, "table", "object.town2FamilyTable", {
    conversationKeys: ["object.town2FamilyTable.line1"],
  });
  placeInteriorObject(town2EastResidence, 10, 3, "desk", "object.town2RouteNote", {
    conversationKeys: ["object.town2RouteNote.line1"],
  });
  addInteriorNpc(town2EastResidence, {
    nameKey: "npc.town2EastResidentIndoor",
    x: 10,
    y: 7,
    dir: "left",
    jacket: "#5f7f9a",
    voiceGender: "male",
    voiceId: "town2EastResidentIndoor",
    conversationKeys: ["npc.town2EastResidentIndoor.line1", "npc.town2EastResidentIndoor.line2"],
  });

  return {
    town2CityHall,
    town2ReviewLibrary,
    town2InfoCenter,
    town2LostFound,
    town2LabelMuseum,
    town2Guesthouse,
    town2EastResidence,
  };
}

window.KA.world.registerScene(() => {
  const town2 = createTown2Scene();
  return {
    town2,
    ...createTown2InteriorScenes(town2.buildings),
  };
});
