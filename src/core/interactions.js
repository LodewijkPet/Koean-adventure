window.KA = window.KA || {};
window.KA.story = window.KA.story || {};

const CONVERSATION_CHALLENGES = {};

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

function registerConversationChallenge(challenge) {
  if (!challenge?.id || !Array.isArray(challenge.turns)) return;
  CONVERSATION_CHALLENGES[challenge.id] = {
    ...challenge,
    turns: challenge.turns
      .filter((turn) => turn?.say && Array.isArray(turn.choices) && turn.choices.length)
      .map((turn) => ({
        say: turn.say,
        params: turn.params || null,
        choices: turn.choices
          .filter((choice) => typeof choice?.ko === "string" && choice.ko)
          .map((choice) => ({
            ko: choice.ko,
            correct: !!choice.correct,
            replyKey: choice.replyKey || null,
            replyParams: choice.replyParams || null,
          })),
      }))
      .filter((turn) => turn.choices.length),
    onPass: toArray(challenge.onPass),
    onFailKey: challenge.onFailKey || null,
    onFailParams: challenge.onFailParams || null,
  };
}

function conversationChallenge(challengeId) {
  return CONVERSATION_CHALLENGES[challengeId] || null;
}

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

function resolveInteractionShop(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.shopResolver === "function") return source.shopResolver();
  return source.shopId || null;
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

function npcVoiceProfile(npc, challenge) {
  if (challenge?.npcVoice && typeof challenge.npcVoice === "object") {
    return { ...challenge.npcVoice };
  }
  if (typeof challenge?.npcVoice === "string") {
    return { id: challenge.npcVoice, nameKey: npc?.nameKey || challenge.npcVoice };
  }
  return {
    gender: npc?.voiceGender,
    id: npc?.voiceId || npc?.nameKey || challenge?.id,
    nameKey: npc?.nameKey || challenge?.id,
  };
}

function setDialogSpeechState(spoken = true) {
  dialog.index = 0;
  dialog.spoken = spoken;
  dialog.textVisible = !spoken;
  dialog.speaking = false;
  dialog.speechToken = 0;
  dialog.voiceRetry = false;
}

function currentConversationTurn() {
  if (dialog?.mode !== "conversationChallenge") return null;
  return dialog.challenge.turns[dialog.turnIndex] || null;
}

function loadConversationTurn(turnIndex, { resetAttempts = true } = {}) {
  const turn = dialog.challenge.turns[turnIndex];
  if (!turn) return false;
  stopSpeech();
  dialog.turnIndex = turnIndex;
  dialog.lines = [{ key: turn.say, params: turn.params || null }];
  dialog.phase = "question";
  dialog.selectedChoice = 0;
  dialog.feedbackAdvances = false;
  if (resetAttempts) dialog.turnAttempts = 0;
  setDialogSpeechState(true);
  speakDialogLine();
  return true;
}

function showConversationLine(key, params, phase, feedbackAdvances = false) {
  if (!key) return false;
  stopSpeech();
  dialog.lines = [{ key, params: params || null }];
  dialog.phase = phase;
  dialog.feedbackAdvances = feedbackAdvances;
  setDialogSpeechState(true);
  speakDialogLine();
  return true;
}

function finishConversationChallenge() {
  const challenge = dialog.challenge;
  if (!dialog.failed) {
    setProgressFlags(challenge.onPass);
    dialog = null;
    clearMovementInput();
    return;
  }

  if (challenge.onFailKey && showConversationLine(challenge.onFailKey, challenge.onFailParams, "finalFail")) {
    return;
  }

  dialog = null;
  clearMovementInput();
}

function continueConversationAfterFeedback() {
  if (!dialog.feedbackAdvances) {
    loadConversationTurn(dialog.turnIndex, { resetAttempts: false });
    return;
  }

  const nextTurn = dialog.turnIndex + 1;
  if (nextTurn < dialog.challenge.turns.length) {
    loadConversationTurn(nextTurn);
    return;
  }

  finishConversationChallenge();
}

function selectedConversationChoice() {
  const turn = currentConversationTurn();
  if (!turn?.choices.length) return null;
  return turn.choices[dialog.selectedChoice] || turn.choices[0];
}

function correctConversationChoice() {
  const turn = currentConversationTurn();
  return turn?.choices.find((choice) => choice.correct) || null;
}

function submitConversationChoice() {
  const choice = selectedConversationChoice();
  if (!choice) return;

  if (choice.correct) {
    dialog.feedbackAdvances = true;
    if (!showConversationLine(choice.replyKey, choice.replyParams, "feedback", true)) {
      continueConversationAfterFeedback();
    }
    return;
  }

  dialog.turnAttempts += 1;
  const outOfRetries = dialog.turnAttempts >= 2;
  if (outOfRetries) dialog.failed = true;
  dialog.feedbackAdvances = outOfRetries;
  const feedbackKey = outOfRetries ? "conversation.answer" : choice.replyKey;
  const feedbackParams = outOfRetries ? { answer: correctConversationChoice()?.ko || "" } : choice.replyParams;
  if (!showConversationLine(feedbackKey, feedbackParams, "feedback", outOfRetries)) {
    if (outOfRetries) continueConversationAfterFeedback();
    else loadConversationTurn(dialog.turnIndex, { resetAttempts: false });
  }
}

function startConversationChallenge(challengeId, source = {}) {
  const challenge = conversationChallenge(challengeId);
  if (!challenge?.turns.length) return false;

  dialog = {
    mode: "conversationChallenge",
    challengeId,
    challenge,
    turnIndex: 0,
    turnAttempts: 0,
    selectedChoice: 0,
    failed: false,
    feedbackAdvances: false,
    lines: [],
    index: 0,
    spoken: true,
    textVisible: false,
    speaking: false,
    speechToken: 0,
    voiceRetry: false,
    voiceProfile: npcVoiceProfile(source.npc, challenge),
    phase: "question",
  };
  loadConversationTurn(0);
  clearMovementInput();
  return true;
}

function resolveInteractionConversationChallengeId(source) {
  if (!source || !hasRequiredProgress(source)) return null;
  if (typeof source.conversationChallengeResolver === "function") return source.conversationChallengeResolver();
  return source.conversationChallengeId || null;
}

function openDialogFor(target) {
  if (!target) return;
  stopSpeech();

  if (target.npc) {
    if (target.npc.progressFlagOnTalk) setProgressFlag(target.npc.progressFlagOnTalk);
    if (typeof target.npc.progressFlagsOnTalkResolver === "function") {
      setProgressFlags(target.npc.progressFlagsOnTalkResolver());
    }

    const challengeId = resolveInteractionConversationChallengeId(target.npc);
    if (challengeId && startConversationChallenge(challengeId, { npc: target.npc })) {
      const opposite = {
        up: "down",
        down: "up",
        left: "right",
        right: "left",
      };
      target.npc.dir = opposite[player.dir];
      return;
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

  const itemShopId = resolveInteractionShop(target.item);
  if (itemShopId && openShop(itemShopId)) {
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
  if (!line) return "";
  const params = { ...(line.params || {}) };
  if (line.targetKey) params.target = t(line.targetKey, {}, language);
  return t(line.key, params, language);
}

function conversationChoiceText() {
  if (dialog?.mode !== "conversationChallenge" || dialog.phase !== "question" || !dialog.textVisible) return "";
  const turn = currentConversationTurn();
  if (!turn) return "";
  return turn.choices
    .map((choice, index) => `${index === dialog.selectedChoice ? ">" : " "} ${choice.ko}`)
    .join("   ");
}

function dialogDisplayText() {
  if (!dialog) return "";
  if (!dialog.textVisible) return "";
  const choiceText = conversationChoiceText();
  return choiceText ? `${dialogLineText()}   ${choiceText}` : dialogLineText();
}

function advanceDialog() {
  if (!dialog) return;
  if (dialog.mode === "conversationChallenge") {
    if (dialog.spoken && !dialog.textVisible) {
      dialog.textVisible = true;
      return;
    }
    if (dialog.phase === "question") {
      submitConversationChoice();
      return;
    }
    if (dialog.phase === "feedback") {
      continueConversationAfterFeedback();
      return;
    }
    dialog = null;
    clearMovementInput();
    return;
  }
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

function handleConversationChallengeInput(event) {
  const dir = keyToDir[event.code];
  if (dir === "up" || dir === "down") {
    event.preventDefault();
    if (!dialog.textVisible || dialog.phase !== "question") return;
    const choices = currentConversationTurn()?.choices || [];
    if (!choices.length) return;
    const delta = dir === "down" ? 1 : -1;
    dialog.selectedChoice = (dialog.selectedChoice + delta + choices.length) % choices.length;
    return;
  }

  if (dir === "left" || dir === "right") {
    event.preventDefault();
    return;
  }

  if (event.code === "Space" || event.code === "Enter") {
    event.preventDefault();
    advanceDialog();
  }
}

function handleDialogInput(event) {
  if (!dialog) return;
  if (dialog.mode === "conversationChallenge") {
    handleConversationChallengeInput(event);
    return;
  }
  if (event.code === "Space") {
    event.preventDefault();
    advanceDialog();
  }
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
  handleDialogInput,
  dialogLineText,
  dialogDisplayText,
  advanceDialog,
  handleStepTrigger,
};

Object.assign(window.KA.story, {
  conversations: CONVERSATION_CHALLENGES,
  registerConversation: registerConversationChallenge,
  conversation: conversationChallenge,
  startConversation: startConversationChallenge,
});
