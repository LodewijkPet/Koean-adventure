const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const settings = {
  primary: "en",
  secondary: "ko",
  speech: "ko",
};

const ui = {
  translationHeld: false,
  menuOpen: false,
  menuScreen: "main",
  menuIndex: 0,
  dictionaryCategoryIndex: 0,
  dictionaryPage: 0,
  wordCategoryIndex: 0,
  wordPage: 0,
  journalChapterIndex: 0,
  journalQuestIndex: 0,
  eraseArmed: false,
  quit: false,
};

const STUDY_BOARDS = {
  basicVowels: {
    titleKey: "study.basicVowels.title",
    subtitleKey: "study.basicVowels.subtitle",
    entries: [
      { glyph: "ㅏ", name: "a" },
      { glyph: "ㅑ", name: "ya" },
      { glyph: "ㅓ", name: "eo" },
      { glyph: "ㅕ", name: "yeo" },
      { glyph: "ㅗ", name: "o" },
      { glyph: "ㅛ", name: "yo" },
      { glyph: "ㅜ", name: "u" },
      { glyph: "ㅠ", name: "yu" },
      { glyph: "ㅡ", name: "eu" },
      { glyph: "ㅣ", name: "i" },
    ],
  },
  basicConsonants: {
    titleKey: "study.basicConsonants.title",
    subtitleKey: "study.basicConsonants.subtitle",
    entries: [
      { glyph: "ㄱ", name: "giyeok" },
      { glyph: "ㄴ", name: "nieun" },
      { glyph: "ㄷ", name: "digeut" },
      { glyph: "ㄹ", name: "rieul" },
      { glyph: "ㅁ", name: "mieum" },
      { glyph: "ㅂ", name: "bieup" },
      { glyph: "ㅅ", name: "siot" },
      { glyph: "ㅇ", name: "ieung" },
      { glyph: "ㅈ", name: "jieut" },
      { glyph: "ㅊ", name: "chieut" },
      { glyph: "ㅋ", name: "kieuk" },
      { glyph: "ㅌ", name: "tieut" },
      { glyph: "ㅍ", name: "pieup" },
      { glyph: "ㅎ", name: "hieut" },
    ],
  },
  aspiratedConsonants: {
    titleKey: "study.aspiratedConsonants.title",
    subtitleKey: "study.aspiratedConsonants.subtitle",
    entries: [
      { glyph: "ㅎ", nameKey: "study.aspiratedConsonants.entry.hieut" },
      { glyph: "ㅋ", nameKey: "study.aspiratedConsonants.entry.giyeok" },
      { glyph: "ㅌ", nameKey: "study.aspiratedConsonants.entry.digeut" },
      { glyph: "ㅍ", nameKey: "study.aspiratedConsonants.entry.bieup" },
      { glyph: "ㅊ", nameKey: "study.aspiratedConsonants.entry.jieut" },
    ],
  },
  doubleConsonants: {
    titleKey: "study.doubleConsonants.title",
    subtitleKey: "study.doubleConsonants.subtitle",
    entries: [
      { glyph: "ㄲ", nameKey: "study.doubleConsonants.entry.giyeok" },
      { glyph: "ㄸ", nameKey: "study.doubleConsonants.entry.digeut" },
      { glyph: "ㅃ", nameKey: "study.doubleConsonants.entry.bieup" },
      { glyph: "ㅆ", nameKey: "study.doubleConsonants.entry.siot" },
      { glyph: "ㅉ", nameKey: "study.doubleConsonants.entry.jieut" },
    ],
  },
  singleBatchim: {
    titleKey: "study.singleBatchim.title",
    subtitleKey: "study.singleBatchim.subtitle",
    entries: [
      { glyph: "간", nameKey: "study.singleBatchim.entry.gan" },
      { glyph: "문", nameKey: "study.singleBatchim.entry.mun" },
      { glyph: "나", nameKey: "study.singleBatchim.entry.na" },
    ],
  },
  doubleBatchim: {
    titleKey: "study.doubleBatchim.title",
    subtitleKey: "study.doubleBatchim.subtitle",
    entries: [
      { glyph: "앉", nameKey: "study.doubleBatchim.entry.anj" },
      { glyph: "닭", nameKey: "study.doubleBatchim.entry.dalk" },
      { glyph: "값", nameKey: "study.doubleBatchim.entry.gap" },
      { glyph: "?", nameKey: "study.doubleBatchim.entry.rule" },
    ],
  },
  compoundVowels: {
    titleKey: "study.compoundVowels.title",
    subtitleKey: "study.compoundVowels.subtitle",
    entries: [
      { glyph: "ㅐ", name: "ae (ㅏ+ㅣ)" },
      { glyph: "ㅔ", name: "e (ㅓ+ㅣ)" },
      { glyph: "ㅒ", name: "yae (ㅑ+ㅣ)" },
      { glyph: "ㅖ", name: "ye (ㅕ+ㅣ)" },
      { glyph: "ㅘ", name: "wa (ㅗ+ㅏ)" },
      { glyph: "ㅙ", name: "wae (ㅗ+ㅐ)" },
      { glyph: "ㅚ", name: "oe (ㅗ+ㅣ)" },
      { glyph: "ㅝ", name: "wo (ㅜ+ㅓ)" },
      { glyph: "ㅞ", name: "we (ㅜ+ㅔ)" },
      { glyph: "ㅟ", name: "wi (ㅜ+ㅣ)" },
      { glyph: "ㅢ", name: "ui (ㅡ+ㅣ)" },
    ],
  },
  sinoNumbers: {
    titleKey: "study.sinoNumbers.title",
    subtitleKey: "study.sinoNumbers.subtitle",
    entries: [
      { glyph: "일", name: "1 (il)" },
      { glyph: "이", name: "2 (i)" },
      { glyph: "삼", name: "3 (sam)" },
      { glyph: "사", name: "4 (sa)" },
      { glyph: "오", name: "5 (o)" },
      { glyph: "육", name: "6 (yuk)" },
      { glyph: "칠", name: "7 (chil)" },
      { glyph: "팔", name: "8 (pal)" },
      { glyph: "구", name: "9 (gu)" },
      { glyph: "십", name: "10 (sip)" },
      { glyph: "백", name: "100 (baek)" },
      { glyph: "천", name: "1,000 (cheon)" },
      { glyph: "만", name: "10,000 (man)" },
    ],
  },
  nativeNumbers: {
    titleKey: "study.nativeNumbers.title",
    subtitleKey: "study.nativeNumbers.subtitle",
    entries: [
      { glyph: "하나", name: "1 (hana / 한)" },
      { glyph: "둘", name: "2 (dul / 두)" },
      { glyph: "셋", name: "3 (set / 세)" },
      { glyph: "넷", name: "4 (net / 네)" },
      { glyph: "다섯", name: "5 (daseot)" },
      { glyph: "여섯", name: "6 (yeoseot)" },
      { glyph: "일곱", name: "7 (ilgop)" },
      { glyph: "여덟", name: "8 (yeodeol)" },
      { glyph: "아홉", name: "9 (ahop)" },
      { glyph: "열", name: "10 (yeol)" },
    ],
  },
  counters: {
    titleKey: "study.counters.title",
    subtitleKey: "study.counters.subtitle",
    entries: [
      { glyph: "개", nameKey: "study.counters.entry.gae" },
      { glyph: "명", nameKey: "study.counters.entry.myeong" },
      { glyph: "마리", nameKey: "study.counters.entry.mari" },
      { glyph: "병", nameKey: "study.counters.entry.byeong" },
      { glyph: "잔", nameKey: "study.counters.entry.jan" },
      { glyph: "권", nameKey: "study.counters.entry.gwon" },
      { glyph: "살", nameKey: "study.counters.entry.sal" },
    ],
  },
};

const STUDY_BOARD_WORD_ITEMS = {
  sinoNumbers: [
    "word.il", "word.i", "word.sam", "word.sa", "word.o2",
    "word.yuk", "word.chil", "word.pal", "word.gu", "word.sip",
    "word.baek", "word.cheon", "word.man",
  ],
  nativeNumbers: [
    "word.hana", "word.dul", "word.set", "word.net", "word.daseot",
    "word.yeoseot", "word.ilgop", "word.yeodeol", "word.ahop", "word.yeol",
  ],
  counters: [
    "word.gae", "word.myeong", "word.mari", "word.byeong",
    "word.jan", "word.gwon", "word.sal",
  ],
};

const STUDY_BOARD_DICTIONARY_ITEMS = {
  basicVowels: HANGUL_BASIC_VOWELS.map((item) => item.id),
  compoundVowels: HANGUL_COMPOUND_VOWELS.map((item) => item.id),
  basicConsonants: HANGUL_BASIC_CONSONANTS.map((item) => item.id),
  aspiratedConsonants: HANGUL_ASPIRATED_SIGNS.map((item) => item.id),
  doubleConsonants: HANGUL_DOUBLE_CONSONANTS.map((item) => item.id),
  singleBatchim: ["hangul.batchim.gan", "hangul.batchim.mun", "hangul.batchim.na"],
  doubleBatchim: HANGUL_DOUBLE_BATCHIM_ITEMS.map((item) => item.id),
};


const progress = {
  flags: new Set(),
  questLevels: {},
  dictionary: {},
  words: {},
  won: 0,
  items: {},
  rewarded: new Set(),
};

refreshQuestLevels();



const player = {
  tileX: 20,
  tileY: 18,
  px: 20 * TILE,
  py: 18 * TILE,
  dir: "down",
  moving: false,
  fromX: 20,
  fromY: 18,
  toX: 20,
  toY: 18,
  moveTime: 0,
  moveDuration: 0.145,
};

const movementInput = {
  held: new Set(),
  order: [],
  holdDelay: 0,
};

const scenes = {};

let currentSceneId = "town";
let cameraX = 0;
let cameraY = 0;
let dialog = null;
let drill = null;
let studyBoard = null;
let shop = null;
let lastTime = performance.now();
function currentScene() {
  return scenes[currentSceneId] || scenes.town;
}

function currentHeldDirection() {
  for (let i = movementInput.order.length - 1; i >= 0; i -= 1) {
    const code = movementInput.order[i];
    if (movementInput.held.has(code)) return keyToDir[code];
  }
  return null;
}

function clearMovementInput() {
  movementInput.held.clear();
  movementInput.order = [];
  movementInput.holdDelay = 0;
}

function setPlayerTile(x, y, dirName) {
  player.tileX = x;
  player.tileY = y;
  player.px = x * TILE;
  player.py = y * TILE;
  player.fromX = x;
  player.fromY = y;
  player.toX = x;
  player.toY = y;
  player.moveTime = 0;
  player.moving = false;
  player.dir = dirName;
}

function changeScene(sceneId, x, y, dirName) {
  scheduleSave();
  stopSpeech();
  currentSceneId = sceneId;
  if (sceneId === "elementarySchool") setProgressFlag(TOWN1_FLAGS.schoolEntered);
  dialog = null;
  studyBoard = null;
  shop = null;
  ui.menuOpen = false;
  ui.quit = false;
  clearMovementInput();
  setPlayerTile(x, y, dirName);
  updateMusicForScene();
}


function buildScenes() {
  window.KA.world.buildRegisteredScenes(scenes);
}


function resize() {
  const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = false;
}

function handleMovementPress(dirName) {
  if (ui.menuOpen || ui.quit || dialog || drill || studyBoard || shop || player.moving) return;

  if (player.dir !== dirName) {
    player.dir = dirName;
    movementInput.holdDelay = 0.12;
    return;
  }

  movementInput.holdDelay = 0;
  beginMove(dirName);
}

function beginMove(dirName) {
  const dir = DIRS[dirName];
  const nextX = player.tileX + dir.x;
  const nextY = player.tileY + dir.y;
  player.dir = dirName;

  if (isBlocked(nextX, nextY)) return;

  player.moving = true;
  player.fromX = player.tileX;
  player.fromY = player.tileY;
  player.toX = nextX;
  player.toY = nextY;
  player.moveTime = 0;
}

function updatePlayer(dt) {
  if (player.moving) {
    player.moveTime += dt;
    const t = Math.min(player.moveTime / player.moveDuration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    player.px = lerp(player.fromX * TILE, player.toX * TILE, eased);
    player.py = lerp(player.fromY * TILE, player.toY * TILE, eased);

    if (t >= 1) {
      player.moving = false;
      player.tileX = player.toX;
      player.tileY = player.toY;
      player.px = player.tileX * TILE;
      player.py = player.tileY * TILE;
      if (handleStepTrigger()) return;
    }
    return;
  }

  processHeldMovement(dt);
}

function processHeldMovement(dt) {
  if (ui.menuOpen || ui.quit || dialog || drill || studyBoard || shop || player.moving) return;

  const dir = currentHeldDirection();
  if (!dir) {
    movementInput.holdDelay = 0;
    return;
  }

  if (player.dir !== dir) {
    player.dir = dir;
    movementInput.holdDelay = 0.12;
    return;
  }

  if (movementInput.holdDelay > 0) {
    movementInput.holdDelay = Math.max(0, movementInput.holdDelay - dt);
    if (movementInput.holdDelay > 0) return;
  }

  beginMove(dir);
}

function updateNpcs(now) {
  const dirs = Object.keys(DIRS);
  const scene = currentScene();
  for (const npc of scene.npcs) {
    if (!npc.nextTurn) {
      npc.nextTurn = now + randomBetween(1200, 3600);
    }
    if (now >= npc.nextTurn && !dialog && !drill && !studyBoard && !ui.menuOpen && !ui.quit) {
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      if (npc.wander && Math.random() > 0.45) {
        tryMoveNpc(scene, npc, dir);
      } else {
        npc.dir = dir;
      }
      npc.nextTurn = now + randomBetween(1800, 5200);
    }
  }
}

function tryMoveNpc(scene, npc, dirName) {
  const dir = DIRS[dirName];
  const nextX = npc.x + dir.x;
  const nextY = npc.y + dir.y;
  npc.dir = dirName;

  if (canNpcMoveTo(scene, npc, nextX, nextY)) {
    npc.x = nextX;
    npc.y = nextY;
  }
}

function canNpcMoveTo(scene, npc, x, y) {
  const tile = tileAt(x, y);
  if (tile === "void" || SOLID_TILES.has(tile) || tile === "exit") return false;
  if (scene.buildings.some((building) => {
    const inside =
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h;
    return inside && !isBuildingDoor(building, x, y);
  })) return false;
  if (scene.interactables.some((item) => item.solid && item.x === x && item.y === y)) return false;
  if (scene.npcs.some((other) => other !== npc && other.x === x && other.y === y)) return false;
  if (player.tileX === x && player.tileY === y) return false;
  return true;
}

function update(dt, now) {
  updatePlayer(dt);
  updateNpcs(now);
  updateCamera();
}

function updateCamera() {
  const scene = currentScene();
  const scenePixelWidth = scene.width * TILE;
  const scenePixelHeight = scene.height * TILE;

  if (scene.kind === "interior" && scenePixelWidth <= window.innerWidth) {
    cameraX = -(window.innerWidth - scenePixelWidth) / 2;
  } else {
    cameraX = player.px + TILE / 2 - window.innerWidth / 2;
  }

  if (scene.kind === "interior" && scenePixelHeight <= window.innerHeight) {
    cameraY = -(window.innerHeight - scenePixelHeight) / 2;
  } else {
    cameraY = player.py + TILE / 2 - window.innerHeight / 2;
  }
}

function draw() {
  const scene = currentScene();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = COLORS.void;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const startX = Math.floor(cameraX / TILE) - 1;
  const startY = Math.floor(cameraY / TILE) - 1;
  const endX = Math.ceil((cameraX + window.innerWidth) / TILE) + 1;
  const endY = Math.ceil((cameraY + window.innerHeight) / TILE) + 1;

  for (let y = startY; y <= endY; y += 1) {
    for (let x = startX; x <= endX; x += 1) {
      drawTile(x, y);
    }
  }

  for (const building of scene.buildings) drawBuilding(building);
  if (scene.kind === "outdoor") drawOutdoorObjects(scene);
  drawInteractables();
  if (scene.kind === "interior") drawInteriorObjects(scene);

  const sortedCharacters = [...scene.npcs, player].sort((a, b) => {
    const ay = "tileY" in a ? a.tileY : a.y;
    const by = "tileY" in b ? b.tileY : b.y;
    return ay - by;
  });

  for (const character of sortedCharacters) {
    if (character === player) drawPlayer();
    else drawNpc(character);
  }

  drawInfoPanel();

  if (ui.quit) drawQuitScreen();
  if (dialog && !ui.quit) drawDialog(dialogDisplayText());
  if (studyBoard && !ui.quit) drawStudyBoard();
  if (shop && !ui.quit) drawShop();
  if (drill && !ui.quit) drawDrill();
  if (ui.menuOpen) drawMenu();
}

function seeded(x, y) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt, now);
  draw();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (!event.repeat) unlockMusic();

  if (event.code === "KeyT") {
    event.preventDefault();
    ui.translationHeld = true;
    return;
  }

  if (event.repeat && (event.code in keyToDir || event.code === "Space" || event.code === "Enter")) {
    event.preventDefault();
    return;
  }

  if (drill) {
    handleDrillInput(event);
    return;
  }

  if (shop) {
    handleShopInput(event);
    return;
  }

  if (studyBoard) {
    handleStudyBoardInput(event);
    return;
  }

  if (dialog) {
    handleDialogInput(event);
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    toggleMainMenu();
    return;
  }

  if (ui.menuOpen) {
    handleMenuInput(event);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    if (!ui.quit) openDialogFor(getInteractionTarget());
    return;
  }

  if (event.code in keyToDir) {
    event.preventDefault();
    if (!movementInput.held.has(event.code)) {
      movementInput.held.add(event.code);
      movementInput.order = movementInput.order.filter((code) => code !== event.code);
      movementInput.order.push(event.code);
    }
    handleMovementPress(keyToDir[event.code]);
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "KeyT") {
    event.preventDefault();
    ui.translationHeld = false;
  }

  if (event.code in keyToDir) {
    event.preventDefault();
    movementInput.held.delete(event.code);
    movementInput.order = movementInput.order.filter((code) => code !== event.code);
    if (movementInput.held.size === 0) movementInput.holdDelay = 0;
  }
});

window.addEventListener("resize", resize);
if (speechSupported()) {
  const handleVoicesChanged = () => normalizeSpeechLanguage();
  textToSpeech().prepare(handleVoicesChanged);
}

window.addEventListener("beforeunload", () => {
  persistSaveNow();
});

buildScenes();
loadSave();
applySavedPlayerState();
resize();
requestAnimationFrame(loop);
