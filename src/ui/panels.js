window.KA = window.KA || {};

function drawInfoPanel() {
  const questStatus = currentQuestStatus();
  const rows = [
    [t("panel.area"), t(currentScene().areaKey)],
    [t("panel.facing"), t(`direction.${player.dir}`)],
    [t("panel.tile"), `${player.tileX}, ${player.tileY}`],
    [t("panel.quest"), t(questStatus.titleKey)],
    [t("panel.questStep"), t(questStatus.objectiveKey)],
    [t("panel.where"), questStatus.whereKey ? t(questStatus.whereKey) : "-"],
    [t("panel.badges"), badgePanelSummary()],
    [t("panel.hangulDex"), hangulDictionaryPanelSummary()],
    [t("panel.words"), wordDictionaryPanelSummary()],
    [t("panel.primary"), languageName(settings.primary)],
    [t("panel.secondary"), languageName(settings.secondary)],
  ];
  const w = Math.min(230, Math.max(190, window.innerWidth - 28));
  const h = 54 + rows.length * 17 + 18;
  const x = Math.max(14, window.innerWidth - w - 14);
  const y = 14;

  drawUiBox(x, y, w, h);
  drawFittedText(t("game.title"), x + 18, y + 20, w - 36, 14, true);

  rows.forEach(([label, value], index) => {
    const rowY = y + 44 + index * 17;
    drawFittedText(`${label}:`, x + 18, rowY, 82, 12, false);
    drawFittedText(value, x + 104, rowY, w - 122, 12, false);
  });
}

function drawQuitScreen() {
  ctx.fillStyle = "rgba(10, 10, 14, 0.82)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const w = Math.min(420, window.innerWidth - 36);
  const h = 128;
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  drawUiBox(x, y, w, h);
  drawFittedText(t("quit.message"), x + 28, y + 38, w - 56, 20, true);
  drawFittedText(t("quit.subtext"), x + 28, y + 72, w - 56, 15, false);
}

function drawDialog(text) {
  const margin = 18;
  const boxHeight = Math.min(150, Math.max(104, window.innerHeight * 0.22));
  const x = margin;
  const y = window.innerHeight - boxHeight - margin;
  const w = window.innerWidth - margin * 2;
  const h = boxHeight;

  drawUiBox(x, y, w, h);

  ctx.fillStyle = COLORS.text;
  ctx.font = `18px ${UI_FONT}`;
  ctx.textBaseline = "top";
  const lines = wrapText(text, w - 46, `18px ${UI_FONT}`);
  lines.slice(0, 4).forEach((line, index) => {
    ctx.fillText(line, x + 24, y + 30 + index * 24);
  });

  const pulse = text && Math.floor(performance.now() / 320) % 2 === 0;
  if (pulse) {
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(x + w - 34, y + h - 32, 10, 4);
    ctx.fillRect(x + w - 30, y + h - 28, 6, 4);
    ctx.fillRect(x + w - 28, y + h - 24, 2, 4);
  }
}

function drawStudyBoard() {
  const board = STUDY_BOARDS[studyBoard];
  if (!board) return;

  ctx.fillStyle = "rgba(10, 10, 14, 0.38)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const narrow = window.innerWidth < 520;
  const columns = board.entries.length > 12 ? (narrow ? 3 : 5) : (narrow ? 2 : 5);
  const rows = Math.ceil(board.entries.length / columns);
  const cellGap = narrow ? 8 : 12;
  const preferredCellHeight = narrow ? 58 : 72;
  const w = Math.min(760, window.innerWidth - 36);
  const gridW = w - 72;
  const h = Math.min(
    window.innerHeight - 36,
    132 + rows * preferredCellHeight + (rows - 1) * cellGap + 36,
  );
  const cellHeight = Math.max(
    narrow ? 48 : 56,
    Math.min(preferredCellHeight, (h - 168 - (rows - 1) * cellGap) / rows),
  );
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const innerX = x + 36;
  const innerY = y + 92;
  const cellWidth = (gridW - cellGap * (columns - 1)) / columns;

  drawStudyBoardFrame(x, y, w, h);
  drawCenteredFittedText(t(board.titleKey), x + w / 2, y + 28, w - 76, narrow ? 18 : 24, true);
  drawCenteredFittedText(t(board.subtitleKey), x + w / 2, y + 58, w - 86, narrow ? 12 : 15, false);

  board.entries.forEach((entry, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const cellX = innerX + column * (cellWidth + cellGap);
    const cellY = innerY + row * (cellHeight + cellGap);

    ctx.fillStyle = "#f4e7c4";
    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);
    ctx.fillStyle = "#b28a55";
    ctx.fillRect(cellX, cellY, cellWidth, 3);
    ctx.fillRect(cellX, cellY + cellHeight - 3, cellWidth, 3);
    ctx.fillStyle = "#e1c993";
    ctx.fillRect(cellX, cellY, 3, cellHeight);
    ctx.fillRect(cellX + cellWidth - 3, cellY, 3, cellHeight);

    drawCenteredFittedText(
      entry.glyph,
      cellX + cellWidth / 2,
      cellY + Math.max(7, cellHeight * 0.12),
      cellWidth - 16,
      Math.min(narrow ? 24 : 30, cellHeight * 0.46),
      true,
    );
    drawCenteredFittedText(
      entry.nameKey ? t(entry.nameKey) : entry.name,
      cellX + cellWidth / 2,
      cellY + Math.max(30, cellHeight * 0.62),
      cellWidth - 12,
      Math.min(narrow ? 11 : 13, cellHeight * 0.22),
      false,
    );
  });

  drawDrillPulse(x + w - 46, y + h - 42);
}

function drawStudyBoardFrame(x, y, w, h) {
  ctx.fillStyle = "#3e2a1e";
  ctx.fillRect(x + 14, y + 6, w - 28, h - 12);
  ctx.fillStyle = "#8b5f35";
  ctx.fillRect(x + 8, y, w - 16, 12);
  ctx.fillRect(x + 8, y + h - 12, w - 16, 12);
  ctx.fillStyle = "#b7844a";
  ctx.fillRect(x + 2, y + 3, w - 4, 6);
  ctx.fillRect(x + 2, y + h - 9, w - 4, 6);
  ctx.fillStyle = "#ead7aa";
  ctx.fillRect(x + 22, y + 14, w - 44, h - 28);
  ctx.fillStyle = "#c0935c";
  ctx.fillRect(x + 30, y + 20, w - 60, 5);
  ctx.fillRect(x + 30, y + h - 25, w - 60, 4);
}

function drawOrderChunkRow({ labelKey, emptyKey, chunks, zone, x, y, w }) {
  const state = currentOrderDrillState();
  const selectedIndex = zone === "placed" ? state?.selectedPlaced : state?.selectedAvailable;
  const active = !drill.answered && state?.zone === zone;
  const rowX = x + 28;
  const rowW = w - 56;
  let boxX = rowX;
  let boxY = y + 24;

  drawFittedText(t(labelKey), rowX, y, rowW, 13, true);

  if (!chunks.length) {
    drawFittedText(t(emptyKey), rowX, boxY + 5, rowW, 14, false);
    return boxY + 36;
  }

  ctx.font = `16px ${UI_FONT}`;
  chunks.forEach((chunk, index) => {
    const boxW = Math.min(rowW, Math.max(68, ctx.measureText(chunk.text).width + 28));
    if (boxX > rowX && boxX + boxW > rowX + rowW) {
      boxX = rowX;
      boxY += 36;
    }

    ctx.fillStyle = active && index === selectedIndex ? "#f4e7c4" : "#ead7aa";
    ctx.fillRect(boxX, boxY, boxW, 28);
    ctx.fillStyle = active && index === selectedIndex ? COLORS.black : "#b7844a";
    ctx.fillRect(boxX, boxY, boxW, 3);
    ctx.fillRect(boxX, boxY + 25, boxW, 3);
    ctx.fillRect(boxX, boxY, 3, 28);
    ctx.fillRect(boxX + boxW - 3, boxY, 3, 28);
    drawFittedText(chunk.text, boxX + 12, boxY + 6, boxW - 24, 14, false);
    boxX += boxW + 8;
  });

  return boxY + 36;
}

function drawOrderDrillStep(step, x, y, w) {
  const state = currentOrderDrillState();
  if (!state) return y + 134;

  let rowY = y + 132;
  rowY = drawOrderChunkRow({
    labelKey: "drill.order.placed",
    emptyKey: "drill.order.emptyPlaced",
    chunks: state.placed,
    zone: "placed",
    x,
    y: rowY,
    w,
  });

  rowY += 10;
  rowY = drawOrderChunkRow({
    labelKey: "drill.order.available",
    emptyKey: "drill.order.emptyAvailable",
    chunks: state.available,
    zone: "available",
    x,
    y: rowY,
    w,
  });

  rowY += 8;
  if (!drill.answered) {
    drawFittedText(t("drill.order.hint"), x + 28, rowY, w - 56, 13, false);
  }
  return rowY + 28;
}

function drawDrill() {
  const data = currentDrillData();
  if (!data) return;

  ctx.fillStyle = "rgba(10, 10, 14, 0.32)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  const step = currentDrillStep();
  const orderStep = isOrderDrillStep(step);
  const choiceCount = orderStep ? 0 : step?.choices.length || 0;
  const baseHeight = drill.complete
    ? 210
    : orderStep
      ? 360 + (drill.answered ? 54 : 0)
      : 164 + choiceCount * 34 + (drill.answered ? 54 : 0);
  const w = Math.min(560, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, baseHeight);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;

  drawUiBox(x, y, w, h);
  drawFittedText(t(data.titleKey), x + 24, y + 22, w - 130, 18, true);
  drawFittedText(
    t("drill.progress", { current: Math.min(drill.index + 1, data.steps.length), total: data.steps.length }),
    x + w - 104,
    y + 25,
    78,
    13,
    false,
  );

  if (drill.complete) {
    drawFittedText(t("drill.complete"), x + 28, y + 68, w - 56, 20, true);
    drawFittedText(
      t("drill.score", { correct: drill.correctCount, total: data.steps.length }),
      x + 28,
      y + 104,
      w - 56,
      16,
      false,
    );
    drawFittedText(t(drill.passed ? "drill.passed" : "drill.retry"), x + 28, y + 134, w - 56, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  if (!step) return;

  const promptLines = wrapText(t(step.promptKey, step.promptParams || {}), w - 56, `18px ${UI_FONT}`);
  promptLines.slice(0, 3).forEach((line, index) => {
    drawFittedText(line, x + 28, y + 64 + index * 24, w - 56, 18, false);
  });

  if (orderStep) {
    const feedbackY = drawOrderDrillStep(step, x, y, w);
    if (drill.answered && drill.feedbackKey) {
      drawFittedText(t(drill.feedbackKey, drill.feedbackParams || {}), x + 28, feedbackY, w - 56, 15, false);
      drawDrillPulse(x + w - 42, y + h - 40);
    }
    return;
  }

  const choicesY = y + 134;
  step.choices.forEach((choiceKey, index) => {
    const rowY = choicesY + index * 34;
    if (drill.answered && index === step.answer) {
      ctx.fillStyle = "rgba(63, 143, 69, 0.22)";
      ctx.fillRect(x + 24, rowY - 5, w - 48, 28);
    } else if (drill.answered && index === drill.selected) {
      ctx.fillStyle = "rgba(192, 68, 68, 0.18)";
      ctx.fillRect(x + 24, rowY - 5, w - 48, 28);
    }

    drawMenuCursor(x + 30, rowY + 1, !drill.answered && index === drill.selected);
    drawFittedText(uiText(choiceKey), x + 56, rowY, w - 86, 17, false);
  });

  if (drill.answered && drill.feedbackKey) {
    const feedbackY = choicesY + choiceCount * 34 + 12;
    drawFittedText(t(drill.feedbackKey, drill.feedbackParams || {}), x + 28, feedbackY, w - 56, 15, false);
    drawDrillPulse(x + w - 42, y + h - 40);
  }
}
