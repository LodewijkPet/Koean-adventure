window.KA = window.KA || {};
window.KA.world = window.KA.world || {};

const WORLD_SCENE_FACTORIES = [];

function registerScene(factory) {
  WORLD_SCENE_FACTORIES.push(factory);
}

function buildRegisteredScenes(targetScenes) {
  WORLD_SCENE_FACTORIES.forEach((factory) => {
    const result = factory(targetScenes);
    if (!result) return;

    if (Array.isArray(result)) {
      result.forEach((scene) => {
        if (scene?.id) targetScenes[scene.id] = scene;
      });
      return;
    }

    if (result.id) {
      targetScenes[result.id] = result;
      return;
    }

    Object.assign(targetScenes, result);
  });
}

function createTileMap(width, height, fill = "grass") {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => fill),
  );
}

function setMapTile(tileMap, x, y, type) {
  if (x < 0 || y < 0 || y >= tileMap.length || x >= tileMap[0].length) return;
  tileMap[y][x] = type;
}

function fillMapRect(tileMap, x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      setMapTile(tileMap, xx, yy, type);
    }
  }
}

function createRouteTriggers({
  labelKey,
  fromX,
  toX,
  y,
  targetSceneId,
  targetX,
  targetY,
  targetDir,
  conversationKeys = null,
  requiredFlags = null,
  lockedConversationKeys = null,
}) {
  const centerX = Math.floor((fromX + toX) / 2);
  const triggers = [];

  for (let x = fromX; x <= toX; x += 1) {
    triggers.push({
      labelKey,
      x,
      y,
      solid: false,
      kind: "route",
      targetSceneId,
      targetX: targetX + (x - centerX),
      targetY,
      targetDir,
      conversationKeys,
      requiredFlags,
      lockedConversationKeys,
      hidden: x !== centerX,
    });
  }

  return triggers;
}

function createRectInteractions({
  labelKey,
  x,
  y,
  w,
  h,
  kind = "object",
  solid = true,
  conversationKeys = null,
  drillKey = null,
  drillResolver = null,
  shopId = null,
  shopResolver = null,
  conversationResolver = null,
  requiredFlags = null,
  lockedConversationKeys = null,
  studyBoardKey = null,
  studyBoardResolver = null,
  progressFlagOnStudyBoard = null,
  progressFlagsOnStudyBoardResolver = null,
}) {
  const interactions = [];

  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      interactions.push({
        labelKey,
        x: xx,
        y: yy,
        solid,
        kind,
        conversationKeys,
        drillKey,
        drillResolver,
        shopId,
        shopResolver,
        conversationResolver,
        requiredFlags,
        lockedConversationKeys,
        studyBoardKey,
        studyBoardResolver,
        progressFlagOnStudyBoard,
        progressFlagsOnStudyBoardResolver,
        hidden: true,
      });
    }
  }

  return interactions;
}

function createInteriorScene({
  id,
  areaKey,
  width,
  height,
  entryX,
  returnBuilding,
  returnSceneId = "town",
  musicKey = "town1",
}) {
  const scene = {
    id,
    kind: "interior",
    map: createInteriorMap(width, height, entryX),
    width,
    height,
    buildings: [],
    interactables: [],
    objects: [],
    npcs: [],
    areaKey,
    musicKey,
    entry: { x: entryX, y: height - 2, dir: "up" },
    exit: {
      x: entryX,
      y: height - 1,
      returnSceneId,
      returnX: returnBuilding.doorX,
      returnY: returnBuilding.doorY + 1,
      returnDir: "down",
    },
  };

  scene.interactables.push({
    labelKey: "object.exit",
    x: scene.exit.x,
    y: scene.exit.y,
    solid: false,
    kind: "exit",
  });

  return scene;
}

function createInteriorMap(width, height, exitX) {
  const interiorMap = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "floor"),
  );

  for (let x = 0; x < width; x += 1) {
    interiorMap[0][x] = "wall";
    interiorMap[height - 1][x] = x === exitX ? "exit" : "wall";
  }

  for (let y = 0; y < height; y += 1) {
    interiorMap[y][0] = "wall";
    interiorMap[y][width - 1] = "wall";
  }

  interiorMap[height - 1][exitX] = "exit";
  return interiorMap;
}

function fillInteriorTile(scene, x, y, w, h, type) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx > 0 && yy > 0 && xx < scene.width - 1 && yy < scene.height - 1) {
        scene.map[yy][xx] = type;
      }
    }
  }
}

function placeInteriorObject(scene, x, y, type, labelKey, options = {}) {
  if (x <= 0 || y <= 0 || x >= scene.width - 1 || y >= scene.height - 1) return;
  scene.objects.push({ x, y, w: 1, h: 1, type });
  addInteriorObjectInteraction(scene, x, y, labelKey, options);
}

function fillInteriorObject(scene, x, y, w, h, type, labelKey, options = {}) {
  scene.objects.push({ x, y, w, h, type });
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx > 0 && yy > 0 && xx < scene.width - 1 && yy < scene.height - 1) {
        addInteriorObjectInteraction(scene, xx, yy, labelKey, options);
      }
    }
  }
}

function addInteriorObjectInteraction(scene, x, y, labelKey, options = {}) {
  scene.interactables.push({
    labelKey,
    x,
    y,
    solid: options.solid ?? true,
    kind: options.kind || "furniture",
    conversationKeys: options.conversationKeys || null,
    drillKey: options.drillKey || null,
    drillResolver: options.drillResolver || null,
    shopId: options.shopId || null,
    shopResolver: options.shopResolver || null,
    conversationResolver: options.conversationResolver || null,
    requiredFlags: options.requiredFlags || null,
    lockedConversationKeys: options.lockedConversationKeys || null,
    studyBoardKey: options.studyBoardKey || null,
    studyBoardResolver: options.studyBoardResolver || null,
    progressFlagOnStudyBoard: options.progressFlagOnStudyBoard || null,
    progressFlagsOnStudyBoardResolver: options.progressFlagsOnStudyBoardResolver || null,
  });
}

function addInteriorNpc(scene, npc) {
  scene.npcs.push({
    nextTurn: 0,
    kind: "adult",
    wander: false,
    voiceGender: "female",
    voiceId: npc.nameKey,
    ...npc,
  });
}

Object.assign(window.KA.world, {
  registerScene,
  buildRegisteredScenes,
  createTileMap,
  setMapTile,
  fillMapRect,
  createRouteTriggers,
  createRectInteractions,
  createInteriorScene,
  createInteriorMap,
  fillInteriorTile,
  placeInteriorObject,
  fillInteriorObject,
  addInteriorObjectInteraction,
  addInteriorNpc,
});
