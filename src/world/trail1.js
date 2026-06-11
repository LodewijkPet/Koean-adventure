function createTrail1Scene() {
  const width = 34;
  const height = 54;
  const trailMap = createTileMap(width, height, "grass");

  fillMapRect(trailMap, 0, 35, width, 3, "water");

  const tallGrassPatches = [
    [4, 43, 7, 5],
    [22, 39, 7, 6],
    [4, 25, 7, 8],
    [23, 27, 6, 5],
    [5, 10, 6, 5],
    [22, 5, 7, 6],
  ];
  for (const patch of tallGrassPatches) fillMapRect(trailMap, ...patch, "tallGrass");

  const pathRects = [
    [15, 49, 5, 5],
    [14, 42, 5, 8],
    [10, 39, 9, 4],
    [9, 30, 5, 10],
    [9, 30, 12, 4],
    [18, 24, 5, 9],
    [18, 21, 10, 4],
    [24, 14, 4, 9],
    [14, 12, 14, 4],
    [13, 6, 5, 8],
    [15, 0, 5, 7],
  ];
  for (const rect of pathRects) fillMapRect(trailMap, ...rect, "path");
  fillMapRect(trailMap, 9, 35, 5, 3, "bridge");

  for (let x = 0; x < width; x += 1) {
    if (x < 15 || x > 19) setMapTile(trailMap, x, 0, "tree");
    if (x < 15 || x > 19) setMapTile(trailMap, x, height - 1, "tree");
  }

  for (let y = 1; y < height - 1; y += 1) {
    setMapTile(trailMap, 0, y, "tree");
    setMapTile(trailMap, width - 1, y, "tree");
    if (y % 4 !== 0) {
      setMapTile(trailMap, 1, y, "hedge");
      setMapTile(trailMap, width - 2, y, "hedge");
    }
  }

  const treeSpots = [
    [3, 3],
    [6, 4],
    [28, 14],
    [30, 16],
    [3, 18],
    [6, 20],
    [28, 22],
    [30, 25],
    [4, 39],
    [6, 41],
    [27, 47],
    [30, 49],
  ];
  for (const [x, y] of treeSpots) setMapTile(trailMap, x, y, "tree");

  const ledges = [
    [5, 18],
    [6, 18],
    [7, 18],
    [8, 18],
    [20, 18],
    [21, 18],
    [22, 18],
    [23, 18],
    [24, 44],
    [25, 44],
    [26, 44],
    [27, 44],
  ];
  for (const [x, y] of ledges) setMapTile(trailMap, x, y, "ledge");

  const flowerSpots = [
    [7, 7],
    [8, 7],
    [25, 9],
    [26, 9],
    [5, 29],
    [6, 29],
    [24, 31],
    [25, 31],
    [28, 40],
    [29, 40],
  ];
  for (const [x, y] of flowerSpots) setMapTile(trailMap, x, y, "flowers");

  return {
    id: "trail1",
    kind: "outdoor",
    map: trailMap,
    width,
    height,
    buildings: [],
    objects: [
      { x: 9, y: 35, w: 5, h: 3, type: "trailBridge" },
      { x: 14, y: 0, w: 7, h: 2, type: "trailGate" },
      { x: 24, y: 26, w: 3, h: 2, type: "trailRestTable" },
      { x: 22, y: 20, w: 3, h: 2, type: "routeObjectStall" },
    ],
    interactables: [
      { labelKey: "object.trailSouthSign", x: 20, y: 50, solid: true, kind: "sign", conversationKeys: ["sign.trailSouth.line1"] },
      { labelKey: "object.creekSign", x: 15, y: 33, solid: true, kind: "sign", conversationKeys: ["sign.creek.line1"], drillKey: "batchimBridge" },
      { labelKey: "object.trailNorthSign", x: 20, y: 3, solid: true, kind: "sign", conversationKeys: ["sign.trailNorth.line1"] },
      { labelKey: "object.nameCardBoard", x: 8, y: 31, solid: true, kind: "sign", conversationKeys: ["object.nameCardBoard.line1"], drillKey: "routeNames" },
      { labelKey: "object.actionPracticeSign", x: 23, y: 16, solid: true, kind: "sign", conversationKeys: ["object.actionPracticeSign.line1"], drillKey: "actionPath" },
      ...createRectInteractions({
        labelKey: "object.trailRestTable",
        x: 24,
        y: 26,
        w: 3,
        h: 2,
        conversationKeys: ["object.trailRestTable.line1"],
        drillKey: "presenceCheck",
      }),
      ...createRectInteractions({
        labelKey: "object.routeObjectStall",
        x: 22,
        y: 20,
        w: 3,
        h: 2,
        conversationKeys: ["object.routeObjectStall.line1"],
        drillKey: "objectLabels",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeSouth",
        fromX: 15,
        toX: 19,
        y: height - 1,
        targetSceneId: "town",
        targetX: 20,
        targetY: 1,
        targetDir: "down",
      }),
      ...createRouteTriggers({
        labelKey: "object.routeTown2",
        fromX: 15,
        toX: 19,
        y: 0,
        targetSceneId: "town2",
        targetX: 24,
        targetY: 36,
        targetDir: "up",
        conversationKeys: ["route.town2.pending"],
      }),
    ],
    npcs: [
      {
        nameKey: "npc.trailKeeper",
        x: 8,
        y: 22,
        dir: "right",
        nextTurn: 0,
        jacket: "#a6633f",
        voiceGender: "male",
        voiceId: "trailKeeper",
        conversationPools: [
          ["npc.trailKeeper.line1", "npc.trailKeeper.line2"],
          ["npc.trailKeeper.pool2.line1", "npc.trailKeeper.pool2.line2"],
        ],
      },
    ],
    areaKey: "area.haneulTrail",
    musicKey: "trail1",
  };
}

window.KA.world.registerScene(() => createTrail1Scene());
