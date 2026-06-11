window.KA = window.KA || {};

function isBlockedInScene(scene, x, y) {
  const tile = scene.map[y]?.[x];
  if (!tile || SOLID_TILES.has(tile)) return true;
  if (scene.interactables.some((item) => item.solid && item.x === x && item.y === y)) return true;
  if (scene.npcs.some((npc) => npc.x === x && npc.y === y)) return true;
  if (scene.kind === "outdoor" && (scene.buildings || []).some((building) => isBuildingBlockedAt(building, x, y))) return true;
  return false;
}

function isBuildingBlockedAt(building, x, y) {
  if (x < building.x || x >= building.x + building.w || y < building.y || y >= building.y + building.h) {
    return false;
  }
  return !(x === building.doorX && y === building.doorY);
}

function tileAt(x, y) {
  const scene = currentScene();
  if (x < 0 || y < 0 || x >= scene.width || y >= scene.height) return "void";
  return scene.map[y][x];
}

function isBuildingDoor(building, x, y) {
  return x === building.doorX && y === building.doorY;
}

function isBuildingBlocked(x, y) {
  return currentScene().buildings.some((building) => {
    const inside =
      x >= building.x &&
      x < building.x + building.w &&
      y >= building.y &&
      y < building.y + building.h;
    return inside && !isBuildingDoor(building, x, y);
  });
}

function isNpcAt(x, y) {
  return currentScene().npcs.some((npc) => npc.x === x && npc.y === y);
}

function isSolidInteractive(x, y) {
  return currentScene().interactables.some((item) => item.solid && item.x === x && item.y === y);
}

function isBlocked(x, y) {
  const tile = tileAt(x, y);
  if (tile === "void") return true;
  if (SOLID_TILES.has(tile)) return true;
  if (isBuildingBlocked(x, y)) return true;
  if (isNpcAt(x, y)) return true;
  if (isSolidInteractive(x, y)) return true;
  return false;
}

function getFacingTile() {
  const dir = DIRS[player.dir];
  return {
    x: player.tileX + dir.x,
    y: player.tileY + dir.y,
  };
}

function getInteractionTarget() {
  const scene = currentScene();
  const facing = getFacingTile();
  const spots = [
    { x: facing.x, y: facing.y },
    { x: player.tileX, y: player.tileY },
  ];

  for (const spot of spots) {
    const npc = scene.npcs.find((person) => person.x === spot.x && person.y === spot.y);
    if (npc) return { type: "npc", labelKey: npc.nameKey, npc };

    const item = scene.interactables.find((candidate) => candidate.x === spot.x && candidate.y === spot.y);
    if (item) return { type: item.kind, labelKey: item.labelKey, item };
  }

  const building = scene.buildings.find((place) => {
    const nearX = facing.x >= place.x && facing.x < place.x + place.w;
    const nearY = facing.y >= place.y && facing.y < place.y + place.h;
    return nearX && nearY;
  });
  if (building) return { type: "building", labelKey: building.labelKey, building };

  return null;
}

function hasRequiredProgress(source) {
  return (source.requiredFlags || []).every((flag) => hasProgressFlag(flag));
}

function resolveInteractionDrill(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.drillResolver === "function") return source.drillResolver();
  return source.drillKey || null;
}

function resolveInteractionStudyBoard(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.studyBoardResolver === "function") return source.studyBoardResolver();
  return source.studyBoardKey || null;
}

function resolveInteractionStudyBoardProgressFlags(source) {
  if (!source) return [];
  const flags = [];
  if (source.progressFlagOnStudyBoard) flags.push(source.progressFlagOnStudyBoard);
  if (typeof source.progressFlagsOnStudyBoardResolver === "function") {
    flags.push(...source.progressFlagsOnStudyBoardResolver());
  }
  return flags;
}

function resolveInteractionConversationKeys(source) {
  if (!source) return null;
  if (typeof source.conversationResolver === "function") return source.conversationResolver();
  if (!hasRequiredProgress(source) && source.lockedConversationKeys) return source.lockedConversationKeys;
  if (source.conversationPools?.length) {
    return source.conversationPools[Math.floor(Math.random() * source.conversationPools.length)];
  }
  return source.conversationKeys || null;
}

function toDialogLines(entries) {
  return entries.map((entry) => (typeof entry === "string" ? { key: entry } : entry));
}

function openDialogFor(target) {
  if (!target) return;
  stopSpeech();

  if (target.npc) {
    if (target.npc.progressFlagOnTalk) setProgressFlag(target.npc.progressFlagOnTalk);
    if (typeof target.npc.progressFlagsOnTalkResolver === "function") {
      setProgressFlags(target.npc.progressFlagsOnTalkResolver());
    }

    const npcDrillKey = resolveInteractionDrill(target.npc);
    if (npcDrillKey) {
      startDrill(npcDrillKey);
      return;
    }

    const opposite = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };
    target.npc.dir = opposite[player.dir];
    const conversationKeys = resolveInteractionConversationKeys(target.npc) || ["interaction.default"];
    dialog = {
      lines: toDialogLines(conversationKeys),
      index: 0,
      spoken: true,
      textVisible: false,
      speaking: false,
      speechToken: 0,
      voiceRetry: false,
      voiceProfile: {
        gender: target.npc.voiceGender,
        id: target.npc.voiceId || target.npc.nameKey,
        nameKey: target.npc.nameKey,
      },
    };
    speakDialogLine();
    return;
  }

  const itemStudyBoardKey = resolveInteractionStudyBoard(target.item);
  if (itemStudyBoardKey) {
    setProgressFlags(resolveInteractionStudyBoardProgressFlags(target.item));
    openStudyBoard(itemStudyBoardKey);
    return;
  }

  const itemDrillKey = resolveInteractionDrill(target.item);
  if (itemDrillKey) {
    startDrill(itemDrillKey);
    return;
  }

  const conversationKeys = resolveInteractionConversationKeys(target.item);
  if (conversationKeys) {
    dialog = {
      lines: toDialogLines(conversationKeys),
      index: 0,
      spoken: false,
      textVisible: true,
    };
    return;
  }

  dialog = {
    lines: [{ key: "interaction.default", targetKey: target.labelKey }],
    index: 0,
    spoken: false,
    textVisible: true,
  };
}

function openStudyBoard(studyBoardKey) {
  if (!STUDY_BOARDS[studyBoardKey]) return;
  stopSpeech();
  dialog = null;
  drill = null;
  studyBoard = studyBoardKey;
  markStudyBoardHangulItemsSeen(studyBoardKey);
  markWordsSeen(STUDY_BOARD_WORD_ITEMS[studyBoardKey] || []);
  scheduleSave();
  clearMovementInput();
}

function closeStudyBoard() {
  studyBoard = null;
  clearMovementInput();
}

function handleStudyBoardInput(event) {
  if (!studyBoard) return;
  if (event.code in keyToDir) {
    event.preventDefault();
    return;
  }
  if (event.code === "Space" || event.code === "Enter" || event.code === "Escape") {
    event.preventDefault();
    closeStudyBoard();
  }
}

function dialogLineText(language = activeLanguage()) {
  if (!dialog) return "";
  const line = dialog.lines[dialog.index];
  const params = { ...(line.params || {}) };
  if (line.targetKey) params.target = t(line.targetKey, {}, language);
  return t(line.key, params, language);
}

function dialogDisplayText() {
  if (!dialog) return "";
  return dialog.textVisible ? dialogLineText() : "";
}

function advanceDialog() {
  if (!dialog) return;
  if (dialog.spoken && !dialog.textVisible) {
    dialog.textVisible = true;
    return;
  }

  if (dialog.index < dialog.lines.length - 1) {
    stopSpeech();
    dialog.index += 1;
    dialog.textVisible = !dialog.spoken;
    dialog.speaking = false;
    dialog.voiceRetry = false;
    if (dialog.spoken) speakDialogLine();
    return;
  }
  dialog = null;
}

function handleStepTrigger() {
  const scene = currentScene();
  const item = scene.interactables.find(
    (candidate) => candidate.x === player.tileX && candidate.y === player.tileY,
  );

  if (item?.kind === "route" && item.targetSceneId) {
    if (!hasRequiredProgress(item)) {
      if (item.lockedConversationKeys && !dialog) {
        dialog = {
          lines: item.lockedConversationKeys.map((key) => ({ key })),
          index: 0,
          spoken: false,
          textVisible: true,
        };
      }
      return false;
    }
    const nextScene = scenes[item.targetSceneId];
    if (nextScene) {
      changeScene(
        nextScene.id,
        item.targetX ?? player.tileX,
        item.targetY ?? player.tileY,
        item.targetDir || player.dir,
      );
      return true;
    }
  }

  if (scene.kind === "outdoor" && item?.kind === "door" && item.sceneId) {
    const nextScene = scenes[item.sceneId];
    if (nextScene) {
      changeScene(nextScene.id, nextScene.entry.x, nextScene.entry.y, nextScene.entry.dir);
      return true;
    }
  }

  if (scene.kind === "interior" && item?.kind === "exit" && scene.exit) {
    changeScene(
      scene.exit.returnSceneId,
      scene.exit.returnX,
      scene.exit.returnY,
      scene.exit.returnDir,
    );
    return true;
  }

  return false;
}

window.KA.interactions = {
  isBlockedInScene,
  isBuildingBlockedAt,
  tileAt,
  isBlocked,
  getInteractionTarget,
  hasRequiredProgress,
  openDialogFor,
  openStudyBoard,
  closeStudyBoard,
  handleStudyBoardInput,
  dialogLineText,
  dialogDisplayText,
  advanceDialog,
  handleStepTrigger,
};
