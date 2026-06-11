// Headless smoke test: boots the game with browser stubs and verifies
// scenes, text keys, drills, quest/badge flow, and save round-trips.
// Run: node tools/smoke-test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

const ctxStub = new Proxy(
  { canvas: {} },
  {
    get(target, prop) {
      if (prop === "measureText") return (text) => ({ width: String(text).length * 7 });
      if (prop in target) return target[prop];
      return () => undefined;
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
  },
);

const canvasStub = {
  width: 0,
  height: 0,
  style: {},
  getContext: () => ctxStub,
  setAttribute: () => {},
};

const storage = new Map();
const rafCallbacks = [];

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  performance: { now: () => Date.now() },
  requestAnimationFrame: (callback) => {
    rafCallbacks.push(callback);
    return rafCallbacks.length;
  },
  document: {
    getElementById: () => canvasStub,
    addEventListener: () => {},
  },
  navigator: { onLine: true },
  localStorage: {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key),
  },
  location: { reload: () => {} },
  Audio: class {
    constructor() {
      this.volume = 1;
      this.loop = false;
      this.currentTime = 0;
    }
    play() {
      return Promise.resolve();
    }
    pause() {}
  },
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.innerWidth = 1280;
sandbox.innerHeight = 800;
sandbox.devicePixelRatio = 1;
sandbox.addEventListener = () => {};
sandbox.removeEventListener = () => {};

const context = vm.createContext(sandbox);

const files = [
  "data/drills/start-town.js",
  "data/drills/trail-1.js",
  "data/drills/town-2.js",
  "data/drills/trail-2.js",
  "data/drills/town-3.js",
  "src/tts.js",
  "src/game.js",
];

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf-8");
  try {
    vm.runInContext(source, context, { filename: file });
  } catch (error) {
    fail(`${file} threw during load: ${error.stack}`);
  }
}

if (failures.length) {
  console.error("BOOT FAILURES:\n" + failures.join("\n"));
  process.exit(1);
}

// Run a couple of frames.
try {
  const first = rafCallbacks.shift();
  if (first) first(16);
  const second = rafCallbacks.shift();
  if (second) second(32);
} catch (error) {
  fail(`frame loop threw: ${error.stack}`);
}

const api = vm.runInContext(
  `({
    TEXT, DRILLS, STUDY_BOARDS, scenes, WORD_ITEMS, WORD_CATEGORY_IDS,
    STUDY_BOARD_WORD_ITEMS, QUEST_CHAPTERS, BADGES, progress,
    setProgressFlag, hasProgressFlag, buildDrillRun, earnedBadges,
    startDrillFn: startDrill, drillRef: () => drill, answerDrillStepFn: answerDrillStep,
    advanceDrillFn: advanceDrill, currentDrillStepFn: currentDrillStep,
    persistSaveNow, loadSave, serializeSave, currentQuestStatus,
    wordItemsByCategory, isBlockedInScene, changeScene, currentSceneIdRef: () => currentSceneId,
    SAVE_KEY,
  })`,
  context,
);

// 1. Scenes exist.
const expectedScenes = [
  "town", "trail1", "town2", "trail2", "town3",
  "town3CountingHouse", "town3GuildHall", "town3SnackCafe", "town3Guesthouse",
  "town2CityHall",
];
for (const sceneId of expectedScenes) {
  if (!api.scenes[sceneId]) fail(`scene missing: ${sceneId}`);
}

// 2. Language key parity.
const languages = ["en", "ko", "nl"];
const enKeys = Object.keys(api.TEXT.en);
for (const language of ["ko", "nl"]) {
  for (const key of enKeys) {
    if (!(key in api.TEXT[language])) warnings.push(`TEXT.${language} missing key: ${key}`);
  }
}

// 3. Every key referenced by scenes resolves in all languages.
function checkKey(key, source) {
  if (!key) return;
  for (const language of languages) {
    if (!(key in api.TEXT[language])) fail(`TEXT.${language} missing "${key}" (${source})`);
  }
}
for (const [sceneId, scene] of Object.entries(api.scenes)) {
  checkKey(scene.areaKey, `scene ${sceneId}`);
  for (const item of scene.interactables || []) {
    checkKey(item.labelKey, `scene ${sceneId} interactable`);
    for (const key of item.conversationKeys || []) checkKey(key, `scene ${sceneId} conversation`);
    for (const key of item.lockedConversationKeys || []) checkKey(key, `scene ${sceneId} locked`);
  }
  for (const npc of scene.npcs || []) {
    checkKey(npc.nameKey, `scene ${sceneId} npc`);
    for (const key of npc.conversationKeys || []) checkKey(key, `scene ${sceneId} npc line`);
    for (const pool of npc.conversationPools || []) {
      for (const key of pool) checkKey(key, `scene ${sceneId} npc pool line`);
    }
  }
  for (const building of scene.buildings || []) checkKey(building.labelKey, `scene ${sceneId} building`);
}

// 4. Drill integrity: static steps have valid answers + keys.
for (const [drillKey, data] of Object.entries(api.DRILLS)) {
  checkKey(data.titleKey, `drill ${drillKey}`);
  for (const step of data.steps || []) {
    if (typeof step.answer !== "number" || step.answer < 0 || step.answer >= step.choices.length) {
      fail(`drill ${drillKey} has out-of-range answer`);
    }
    for (const choice of step.choices) {
      if (typeof choice === "string") checkKey(choice, `drill ${drillKey} choice`);
    }
    checkKey(step.promptKey, `drill ${drillKey} prompt`);
    if (step.correctKey) checkKey(step.correctKey, `drill ${drillKey} correct`);
    if (step.incorrectKey) checkKey(step.incorrectKey, `drill ${drillKey} incorrect`);
    for (const wordId of step.wordIds || []) {
      if (!api.WORD_ITEMS[wordId]) fail(`drill ${drillKey} references unknown word ${wordId}`);
    }
  }
}

// 5. Study board words exist.
for (const [board, wordIds] of Object.entries(api.STUDY_BOARD_WORD_ITEMS)) {
  for (const wordId of wordIds) {
    if (!api.WORD_ITEMS[wordId]) fail(`study board ${board} references unknown word ${wordId}`);
  }
  if (!api.STUDY_BOARDS[board]) fail(`study board missing: ${board}`);
}

// 6. Word categories non-empty.
for (const categoryId of api.WORD_CATEGORY_IDS) {
  if (!api.wordItemsByCategory(categoryId).length) fail(`word category empty: ${categoryId}`);
}

// 7. Quest flags resolve and journal data is sane; every step names a place.
for (const chapter of api.QUEST_CHAPTERS) {
  checkKey(chapter.titleKey, `chapter ${chapter.id}`);
  for (const quest of chapter.quests) {
    checkKey(quest.titleKey, `quest ${quest.id}`);
    for (const step of quest.steps) {
      if (!step.flag) fail(`quest ${quest.id} step missing flag`);
      checkKey(step.objectiveKey, `quest ${quest.id} objective`);
      if (!step.whereKey) fail(`quest ${quest.id} step missing whereKey`);
      else checkKey(step.whereKey, `quest ${quest.id} where`);
    }
  }
}

// 7b. Guide resolvers return valid dialog entries (string keys or {key, params}).
for (const guideChapter of ["town1", "town2", "town3"]) {
  const lines = vm.runInContext(`chapterGuideLines("${guideChapter}", "npc.guide.allDone")`, context);
  if (!Array.isArray(lines) || !lines.length) {
    fail(`chapterGuideLines(${guideChapter}) returned nothing`);
    continue;
  }
  for (const entry of lines) {
    const key = typeof entry === "string" ? entry : entry?.key;
    if (!key) fail(`chapterGuideLines(${guideChapter}) produced entry without key`);
    else checkKey(key, `guide ${guideChapter}`);
  }
}

// 7c. Sino price composition spot checks.
const priceChecks = [
  [500, "오백"],
  [1000, "천"],
  [1500, "천오백"],
  [3500, "삼천오백"],
  [10000, "만"],
  [12000, "만이천"],
  [23000, "이만삼천"],
];
for (const [value, expected] of priceChecks) {
  const reading = vm.runInContext(`composeSinoReading(${value}).reading`, context);
  if (reading !== expected) fail(`composeSinoReading(${value}) = ${reading}, expected ${expected}`);
}

// 7d. Question variety: repeated runs of practice drills should produce >1 distinct prompt key.
for (const variedDrill of ["town1FountainVowels", "town3SinoNumbers", "town3NativeNumbers", "town3Prices"]) {
  const promptKeys = new Set();
  for (let i = 0; i < 16; i += 1) {
    const run = api.buildDrillRun(api.DRILLS[variedDrill]);
    run.steps.forEach((step) => promptKeys.add(step.promptKey));
  }
  if (promptKeys.size < 2) fail(`drill ${variedDrill} shows no prompt variety across runs`);
}

// 8. Generated drills produce playable runs once theory flags are set.
api.setProgressFlag("trail2.mirrorBoardRead");
api.setProgressFlag("town3.sinoBoardRead");
api.setProgressFlag("town3.nativeBoardRead");
api.setProgressFlag("town3.counterBoardRead");
for (const generated of ["trail2MirrorVowels", "town3SinoNumbers", "town3NativeNumbers", "town3SinoExam", "town3NativeExam", "town3MarketReview"]) {
  const run = api.buildDrillRun(api.DRILLS[generated]);
  if (!run.steps.length) fail(`generated drill produced no steps: ${generated}`);
  for (const step of run.steps) {
    if (typeof step.answer !== "number" || step.answer < 0 || step.answer >= step.choices.length) {
      fail(`generated drill ${generated} produced invalid answer index`);
    }
  }
  const shuffledAnswers = new Set(
    Array.from({ length: 12 }, () => api.buildDrillRun(api.DRILLS[generated]).steps[0].answer),
  );
  if (shuffledAnswers.size === 1 && shuffledAnswers.has(0)) {
    warnings.push(`generated drill ${generated}: first answer always index 0 across 12 runs (shuffle suspect)`);
  }
}

// 9. Badge flow: complete town2 stations, run final badge drill to passing.
["town2.identityPassed", "town2.lostFoundPassed", "town2.labelsPassed", "town2.actionsPassed", "town2.readingReviewPassed"].forEach(api.setProgressFlag);
vm.runInContext(`startDrill("town2FinalBadge")`, context);
let guard = 0;
while (vm.runInContext("drill && !drill.complete", context) && guard < 50) {
  vm.runInContext(
    `(function () {
      const step = currentDrillStep();
      if (!step) return;
      drill.selected = step.answer;
      answerDrillStep();
      advanceDrill();
    })()`,
    context,
  );
  guard += 1;
}
if (!api.hasProgressFlag("town2.finalBadgePassed")) fail("town2 final badge flag not set after perfect run");
const badges = vm.runInContext("earnedBadges().map((badge) => badge.id)", context);
if (!badges.includes("firstWords")) fail("firstWords badge not earned");

// 10. Save round trip.
vm.runInContext("saveLoaded = true; persistSaveNow();", context);
const raw = storage.get(api.SAVE_KEY);
if (!raw) {
  fail("save not written to localStorage");
} else {
  const payload = JSON.parse(raw);
  if (!payload.flags.includes("town2.finalBadgePassed")) fail("save payload missing badge flag");
  if (payload.version !== 1) fail("save payload version mismatch");
}

// 11. Route landing tiles are walkable.
for (const [sceneId, scene] of Object.entries(api.scenes)) {
  for (const item of scene.interactables || []) {
    if (item.kind !== "route" || !item.targetSceneId) continue;
    const target = api.scenes[item.targetSceneId];
    if (!target) continue; // pending future scenes are fine
    if (api.isBlockedInScene(target, item.targetX, item.targetY)) {
      fail(`route ${sceneId} -> ${item.targetSceneId} lands on blocked tile (${item.targetX}, ${item.targetY})`);
    }
  }
}

// 12. Scene changes to the new areas work and draw a frame each.
for (const sceneId of ["trail2", "town3", "town3CountingHouse", "town3GuildHall", "town3SnackCafe", "town3Guesthouse"]) {
  try {
    const scene = api.scenes[sceneId];
    const entry = scene.entry || { x: 17, y: 50, dir: "up" };
    vm.runInContext(`changeScene("${sceneId}", ${entry.x}, ${entry.y}, "up"); update(0.016, 1000); draw();`, context);
  } catch (error) {
    fail(`scene ${sceneId} update/draw threw: ${error.message}`);
  }
}

if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}):`);
  for (const warning of warnings.slice(0, 40)) console.log("  - " + warning);
  if (warnings.length > 40) console.log(`  ... and ${warnings.length - 40} more`);
}

if (failures.length) {
  console.error(`\nFAILURES (${failures.length}):`);
  for (const failure of failures) console.error("  - " + failure);
  process.exit(1);
}

console.log("\nSMOKE TEST PASSED: scenes, text keys, drills, badge flow, save, routes all OK.");
