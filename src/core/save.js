window.KA = window.KA || {};

const SAVE_KEY = "koreaAdventure.save";
const SAVE_VERSION = 1;
let saveTimer = null;
let saveLoaded = false;
let pendingPlayerState = null;

function saveAvailable() {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch (error) {
    return false;
  }
}

function serializeSave() {
  return JSON.stringify({
    version: SAVE_VERSION,
    settings: { ...settings },
    flags: [...progress.flags],
    questLevels: { ...progress.questLevels },
    dictionary: progress.dictionary,
    words: progress.words,
    player: {
      sceneId: currentSceneId,
      x: player.tileX,
      y: player.tileY,
      dir: player.dir,
    },
  });
}

function persistSaveNow() {
  if (!saveAvailable() || !saveLoaded) return;
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  try {
    window.localStorage.setItem(SAVE_KEY, serializeSave());
  } catch (error) {
    // Storage may be full or blocked; the game keeps running without saving.
  }
}

function scheduleSave() {
  if (!saveAvailable() || !saveLoaded) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(persistSaveNow, 500);
}

function loadSave() {
  saveLoaded = true;
  if (!saveAvailable()) return;

  let payload = null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    payload = JSON.parse(raw);
  } catch (error) {
    return;
  }
  if (!payload || payload.version !== SAVE_VERSION) return;

  const savedSettings = payload.settings || {};
  ["primary", "secondary", "speech"].forEach((key) => {
    if (LANGUAGES.some((language) => language.code === savedSettings[key])) {
      settings[key] = savedSettings[key];
    }
  });

  (payload.flags || []).forEach((flag) => {
    if (typeof flag === "string") progress.flags.add(flag);
  });
  Object.assign(progress.questLevels, payload.questLevels || {});
  Object.entries(payload.dictionary || {}).forEach(([itemId, entry]) => {
    if (HANGUL_ITEMS[itemId] && entry) progress.dictionary[itemId] = entry;
  });
  Object.entries(payload.words || {}).forEach(([wordId, entry]) => {
    if (WORD_ITEMS[wordId] && entry) progress.words[wordId] = entry;
  });

  if (payload.player && typeof payload.player.sceneId === "string") {
    pendingPlayerState = payload.player;
  }

  refreshQuestLevels();
}

function applySavedPlayerState() {
  if (!pendingPlayerState) return;
  const target = scenes[pendingPlayerState.sceneId];
  if (target) {
    const x = Math.min(Math.max(0, pendingPlayerState.x ?? 0), target.width - 1);
    const y = Math.min(Math.max(0, pendingPlayerState.y ?? 0), target.height - 1);
    const dir = DIRS[pendingPlayerState.dir] ? pendingPlayerState.dir : "down";
    if (!isBlockedInScene(target, x, y)) {
      changeScene(target.id, x, y, dir);
    }
  }
  pendingPlayerState = null;
}

function eraseSaveAndReload() {
  if (saveAvailable()) {
    try {
      window.localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      // Ignore storage errors during erase.
    }
  }
  saveLoaded = false;
  window.location.reload();
}

window.KA.save = {
  key: SAVE_KEY,
  version: SAVE_VERSION,
  serialize: serializeSave,
  persistNow: persistSaveNow,
  schedule: scheduleSave,
  load: loadSave,
  applyPlayerState: applySavedPlayerState,
  eraseAndReload: eraseSaveAndReload,
};
