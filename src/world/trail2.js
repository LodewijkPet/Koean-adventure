const TRAIL2_FLAGS = {
  mirrorBoardRead: "trail2.mirrorBoardRead",
  mirrorPracticePassed: "trail2.mirrorPracticePassed",
  locationPostsPassed: "trail2.locationPostsPassed",
  echoTwinsPassed: "trail2.echoTwinsPassed",
  keyQuestStarted: "trail2.keyQuestStarted",
  keyFound: "trail2.keyFound",
  keyReturned: "trail2.keyReturned",
};

function resolveTrail2KeeperConversation() {
  if (hasProgressFlag(TRAIL2_FLAGS.keyReturned)) {
    return ["npc.trail2Keeper.done1"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    setProgressFlag(TRAIL2_FLAGS.keyReturned);
    return ["npc.trail2Keeper.thanks1", "npc.trail2Keeper.thanks2"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted)) {
    return ["npc.trail2Keeper.hint1", "npc.trail2Keeper.hint2"];
  }
  setProgressFlag(TRAIL2_FLAGS.keyQuestStarted);
  return ["npc.trail2Keeper.start1", "npc.trail2Keeper.start2"];
}

function resolveTrail2KeyRockConversation() {
  if (!hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted) || hasProgressFlag(TRAIL2_FLAGS.keyReturned)) {
    return ["object.trail2KeyRock.idle"];
  }
  if (hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    return ["object.trail2KeyRock.alreadyFound"];
  }
  setProgressFlag(TRAIL2_FLAGS.keyFound);
  return ["object.trail2KeyRock.found1", "object.trail2KeyRock.found2"];
}

function resolveTrail2EmptyRockConversation() {
  if (hasProgressFlag(TRAIL2_FLAGS.keyQuestStarted) && !hasProgressFlag(TRAIL2_FLAGS.keyFound)) {
    return ["object.trail2EmptyRock.searching"];
  }
  return ["object.trail2EmptyRock.idle"];
}

function createTrail2Scene() {
  const width = 34;
  const height = 54;
  const trailMap = createTileMap(width, height, "grass");

  fillMapRect(trailMap, 15, 46, 5, 8, "path");
  fillMapRect(trailMap, 12, 40, 8, 6, "path");
  fillMapRect(trailMap, 12, 34, 5, 6, "path");
  fillMapRect(trailMap, 6, 26, 14, 8, "sand");
  fillMapRect(trailMap, 16, 20, 3, 8, "path");
  fillMapRect(trailMap, 16, 8, 3, 12, "path");
  fillMapRect(trailMap, 15, 1, 5, 9, "path");

  fillMapRect(trailMap, 24, 14, 7, 5, "water");
  fillMapRect(trailMap, 4, 12, 6, 6, "tallGrass");
  fillMapRect(trailMap, 22, 30, 6, 4, "tallGrass");
  fillMapRect(trailMap, 25, 44, 5, 4, "flowers");

  for (let x = 0; x < width; x += 1) {
    if (x < 15 || x > 19) {
      setMapTile(trailMap, x, 0, "tree");
      setMapTile(trailMap, x, height - 1, "tree");
    }
  }
  for (let y = 1; y < height - 1; y += 1) {
    setMapTile(trailMap, 0, y, "tree");
    setMapTile(trailMap, width - 1, y, "tree");
  }

  const treeSpots = [
    [4, 6], [8, 5], [24, 6], [28, 8], [6, 21], [26, 24],
    [4, 40], [7, 44], [26, 36], [29, 40], [10, 48], [24, 50],
  ];
  for (const [x, y] of treeSpots) setMapTile(trailMap, x, y, "tree");

  setMapTile(trailMap, 5, 30, "stone");
  setMapTile(trailMap, 8, 35, "stone");
  setMapTile(trailMap, 19, 31, "stone");

  return {
    id: "trail2",
    kind: "outdoor",
    map: trailMap,
    width,
    height,
    buildings: [],
    objects: [
      { x: 10, y: 28, w: 3, h: 2, type: "soundFountain" },
      { x: 25, y: 40, w: 3, h: 2, type: "trailRestTable" },
      { x: 13, y: 1, w: 9, h: 2, type: "trailGate" },
    ],
    interactables: [
      {
        labelKey: "object.trail2MirrorBoard",
        x: 15,
        y: 27,
        solid: true,
        kind: "sign",
        studyBoardKey: "compoundVowels",
        progressFlagOnStudyBoard: TRAIL2_FLAGS.mirrorBoardRead,
      },
      ...createRectInteractions({
        labelKey: "object.trail2MirrorPool",
        x: 10,
        y: 28,
        w: 3,
        h: 2,
        conversationKeys: ["object.trail2MirrorPool.locked"],
        drillResolver: () => (hasProgressFlag(TRAIL2_FLAGS.mirrorBoardRead) ? "trail2MirrorVowels" : null),
      }),
      {
        labelKey: "object.trail2LocationPost",
        x: 14,
        y: 41,
        solid: true,
        kind: "sign",
        conversationKeys: ["object.trail2LocationPost.line1"],
        drillKey: "trail2LocationPosts",
      },
      {
        labelKey: "object.trail2EchoSign",
        x: 23,
        y: 21,
        solid: true,
        kind: "sign",
        conversationKeys: ["object.trail2EchoSign.line1"],
        drillKey: "trail2EchoTwins",
      },
      {
        labelKey: "object.trail2KeyRock",
        x: 5,
        y: 30,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2KeyRockConversation,
      },
      {
        labelKey: "object.trail2EmptyRock",
        x: 8,
        y: 35,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2EmptyRockConversation,
      },
      {
        labelKey: "object.trail2EmptyRock",
        x: 19,
        y: 31,
        solid: true,
        kind: "object",
        hidden: true,
        conversationResolver: resolveTrail2EmptyRockConversation,
      },
      ...createRectInteractions({
        labelKey: "object.trailRestTable",
        x: 25,
        y: 40,
        w: 3,
        h: 2,
        conversationKeys: ["object.trailRestTable.line1"],
      }),
      {
        labelKey: "object.trail2SouthSign",
        x: 20,
        y: 50,
        solid: true,
        kind: "sign",
        conversationKeys: ["sign.trail2South.line1"],
      },
      {
        labelKey: "object.trail2NorthSign",
        x: 20,
        y: 4,
        solid: true,
        kind: "sign",
        conversationKeys: ["sign.trail2North.line1"],
      },
      ...createRouteTriggers({
        labelKey: "object.routeSouth",
        fromX: 15,
        toX: 19,
        y: height - 1,
        targetSceneId: "town2",
        targetX: 40,
        targetY: 1,
        targetDir: "down",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeTown3",
        fromX: 15,
        toX: 19,
        y: 0,
        targetSceneId: "town3",
        targetX: 24,
        targetY: 37,
        targetDir: "up",
      }),
    ],
    npcs: [
      {
        nameKey: "npc.trail2Keeper",
        x: 8,
        y: 27,
        dir: "down",
        nextTurn: 0,
        jacket: "#7a6093",
        voiceGender: "female",
        voiceId: "trail2Keeper",
        conversationResolver: resolveTrail2KeeperConversation,
      },
      {
        nameKey: "npc.trail2EchoTwinA",
        x: 22,
        y: 22,
        dir: "right",
        nextTurn: 0,
        jacket: "#4f8cc9",
        voiceGender: "female",
        voiceId: "trail2EchoTwinA",
        kind: "child",
        conversationKeys: ["npc.trail2EchoTwinA.line1", "npc.trail2EchoTwinA.line2"],
      },
      {
        nameKey: "npc.trail2EchoTwinB",
        x: 24,
        y: 22,
        dir: "left",
        nextTurn: 0,
        jacket: "#5fa069",
        voiceGender: "female",
        voiceId: "trail2EchoTwinB",
        kind: "child",
        conversationKeys: ["npc.trail2EchoTwinB.line1", "npc.trail2EchoTwinB.line2"],
      },
      {
        nameKey: "npc.trail2Hiker",
        x: 17,
        y: 44,
        dir: "down",
        nextTurn: 0,
        jacket: "#b56b48",
        voiceGender: "male",
        voiceId: "trail2Hiker",
        wander: true,
        conversationPools: [
          ["npc.trail2Hiker.line1", "npc.trail2Hiker.line2"],
          ["npc.trail2Hiker.pool2.line1", "npc.trail2Hiker.pool2.line2"],
        ],
      },
    ],
    areaKey: "area.trail2",
    musicKey: "trail2",
  };
}

window.KA.world.registerScene(() => createTrail2Scene());
