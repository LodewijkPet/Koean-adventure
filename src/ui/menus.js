window.KA = window.KA || {};

const mainMenuItems = [
  { key: "menu.return", action: "return" },
  { key: "menu.journal", action: "journal" },
  { key: "menu.dictionary", action: "dictionary" },
  { key: "menu.words", action: "words" },
  { key: "menu.settings", action: "settings" },
  { key: "menu.quit", action: "quit" },
];

const settingsRows = ["primary", "secondary", "speech", "erase", "back"];

function toggleMainMenu() {
  ui.eraseArmed = false;
  if (ui.menuOpen) {
    ui.menuOpen = false;
    return;
  }

  ui.menuOpen = true;
  ui.menuScreen = "main";
  ui.menuIndex = 0;
}

function handleMenuInput(event) {
  const dir = keyToDir[event.code];

  if (ui.menuScreen === "dictionary") {
    handleDictionaryMenuInput(event, dir);
    return;
  }

  if (ui.menuScreen === "words") {
    handleWordMenuInput(event, dir);
    return;
  }

  if (ui.menuScreen === "journal") {
    handleJournalMenuInput(event, dir);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    ui.eraseArmed = false;
    moveMenuCursor(dir === "down" ? 1 : -1);
    return;
  }

  if (ui.menuScreen === "settings" && (dir === "left" || dir === "right")) {
    event.preventDefault();
    adjustCurrentSetting(dir === "right" ? 1 : -1);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    selectMenuItem();
  }
}

function handleWordMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    moveWordCategory(dir === "right" ? 1 : -1);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    moveWordPage(dir === "down" ? 1 : -1);
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "words");
  }
}

function moveWordCategory(delta) {
  const count = WORD_CATEGORY_IDS.length;
  ui.wordCategoryIndex = (ui.wordCategoryIndex + delta + count) % count;
  ui.wordPage = 0;
}

function moveWordPage(delta) {
  const categoryId = WORD_CATEGORY_IDS[ui.wordCategoryIndex];
  const totalRows = wordItemsByCategory(categoryId).length;
  const pages = Math.max(1, Math.ceil(totalRows / hangulDictionaryPageSize()));
  ui.wordPage = (ui.wordPage + delta + pages) % pages;
}

function handleJournalMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    const count = QUEST_CHAPTERS.length;
    ui.journalChapterIndex = (ui.journalChapterIndex + (dir === "right" ? 1 : -1) + count) % count;
    ui.journalQuestIndex = 0;
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    const chapter = QUEST_CHAPTERS[ui.journalChapterIndex];
    const count = chapter.quests.length;
    ui.journalQuestIndex = (ui.journalQuestIndex + (dir === "down" ? 1 : -1) + count) % count;
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "journal");
  }
}

function moveMenuCursor(delta) {
  const count = ui.menuScreen === "main" ? mainMenuItems.length : settingsRows.length;
  ui.menuIndex = (ui.menuIndex + delta + count) % count;
}

function selectMenuItem() {
  if (ui.menuScreen === "main") {
    const action = mainMenuItems[ui.menuIndex].action;
    if (action === "return") {
      ui.quit = false;
      ui.menuOpen = false;
      updateMusicForScene();
    } else if (action === "journal") {
      ui.menuScreen = "journal";
      ui.journalQuestIndex = 0;
    } else if (action === "dictionary") {
      ui.menuScreen = "dictionary";
      ui.dictionaryPage = 0;
    } else if (action === "words") {
      ui.menuScreen = "words";
      ui.wordPage = 0;
    } else if (action === "settings") {
      ui.menuScreen = "settings";
      ui.menuIndex = 0;
      ui.eraseArmed = false;
    } else if (action === "quit") {
      dialog = null;
      stopSpeech();
      pauseCurrentMusic();
      ui.quit = true;
      ui.menuOpen = false;
    }
    return;
  }

  const row = settingsRows[ui.menuIndex];
  if (row === "back") {
    ui.eraseArmed = false;
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "settings");
  } else if (row === "erase") {
    if (ui.eraseArmed) {
      eraseSaveAndReload();
    } else {
      ui.eraseArmed = true;
    }
  } else if (row === "speech") {
    cycleSpeechLanguage(1);
    scheduleSave();
  } else {
    cycleLanguage(row, 1);
    scheduleSave();
  }
}

function handleDictionaryMenuInput(event, dir) {
  if (dir === "left" || dir === "right") {
    event.preventDefault();
    moveDictionaryCategory(dir === "right" ? 1 : -1);
    return;
  }

  if (dir === "up" || dir === "down") {
    event.preventDefault();
    moveDictionaryPage(dir === "down" ? 1 : -1);
    return;
  }

  if (event.code === "Space" || event.code === "Escape") {
    event.preventDefault();
    ui.menuScreen = "main";
    ui.menuIndex = mainMenuItems.findIndex((item) => item.action === "dictionary");
  }
}

function moveDictionaryCategory(delta) {
  const count = HANGUL_DICTIONARY_CATEGORIES.length;
  ui.dictionaryCategoryIndex = (ui.dictionaryCategoryIndex + delta + count) % count;
  ui.dictionaryPage = 0;
}

function moveDictionaryPage(delta) {
  const category = currentHangulDictionaryCategory();
  const totalRows = hangulDictionaryDisplayItemIds(category).length;
  const pages = Math.max(1, Math.ceil(totalRows / hangulDictionaryPageSize()));
  ui.dictionaryPage = (ui.dictionaryPage + delta + pages) % pages;
}

function adjustCurrentSetting(delta) {
  const row = settingsRows[ui.menuIndex];
  if (row === "primary" || row === "secondary") {
    cycleLanguage(row, delta);
    scheduleSave();
  } else if (row === "speech") {
    cycleSpeechLanguage(delta);
    scheduleSave();
  }
}

function cycleLanguage(settingName, delta) {
  const currentIndex = LANGUAGES.findIndex((language) => language.code === settings[settingName]);
  const nextIndex = (currentIndex + delta + LANGUAGES.length) % LANGUAGES.length;
  settings[settingName] = LANGUAGES[nextIndex].code;
}

function currentHangulDictionaryCategory() {
  return HANGUL_DICTIONARY_CATEGORIES[ui.dictionaryCategoryIndex] || HANGUL_DICTIONARY_CATEGORIES[0];
}

function hangulDictionaryDisplayItemIds(category) {
  const itemIds = (category?.itemIds || []).filter((itemId) => HANGUL_ITEMS[itemId]);
  if (!category?.encounteredOnly) return itemIds;
  return itemIds.filter((itemId) => hangulItemSeen(itemId));
}

function hangulDictionaryPageSize() {
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  return Math.max(4, Math.floor((window.innerHeight - 190) / rowHeight));
}

function hangulDictionaryStatusKey(itemId) {
  const entry = hangulItemProgress(itemId);
  if (!entry?.seen) return "dictionary.hangul.status.unseen";
  if (entry.mastered) return "dictionary.hangul.status.mastered";
  if (entry.attempts > 0) return "dictionary.hangul.status.learning";
  return "dictionary.hangul.status.seen";
}

function drawMenu() {
  if (ui.menuScreen === "dictionary") {
    drawHangulDictionaryMenu();
    return;
  }
  if (ui.menuScreen === "words") {
    drawWordDictionaryMenu();
    return;
  }
  if (ui.menuScreen === "journal") {
    drawJournalMenu();
    return;
  }
  if (ui.menuScreen === "settings") {
    drawSettingsMenu();
    return;
  }
  drawMainMenu();
}

function drawMainMenu() {
  const w = Math.min(250, window.innerWidth - 36);
  const h = 54 + mainMenuItems.length * 32;
  const x = Math.max(18, window.innerWidth - w - 18);
  const y = 18;
  drawUiBox(x, y, w, h);
  drawFittedText(t("menu.title"), x + 24, y + 22, w - 48, 16, true);

  mainMenuItems.forEach((item, index) => {
    const rowY = y + 52 + index * 32;
    drawMenuCursor(x + 18, rowY + 3, index === ui.menuIndex);
    drawFittedText(t(item.key), x + 42, rowY, w - 62, 16, false);
  });
}

function drawSettingsMenu() {
  const w = Math.min(392, window.innerWidth - 36);
  const h = 54 + settingsRows.length * 32 + 12;
  const x = Math.max(18, window.innerWidth - w - 18);
  const y = 18;
  drawUiBox(x, y, w, h);
  drawFittedText(t("settings.title"), x + 24, y + 22, w - 48, 16, true);

  const labels = [
    { label: t("settings.primary"), value: `< ${languageName(settings.primary)} >` },
    { label: t("settings.secondary"), value: `< ${languageName(settings.secondary)} >` },
    { label: t("settings.speech"), value: speechSupported() ? `< ${speechLanguageName()} >` : t("settings.speechUnavailable") },
    { label: ui.eraseArmed ? t("settings.eraseArmed") : t("settings.erase"), value: "" },
    { label: t("menu.back"), value: "" },
  ];

  labels.forEach((row, index) => {
    const rowY = y + 54 + index * 32;
    drawMenuCursor(x + 18, rowY + 3, index === ui.menuIndex);

    if (row.value) {
      drawFittedText(row.label, x + 42, rowY, Math.max(94, w * 0.42), 14, false);
      drawFittedText(row.value, x + Math.max(178, w * 0.5), rowY, w - Math.max(198, w * 0.5), 14, false);
    } else {
      drawFittedText(row.label, x + 42, rowY, w - 62, 14, false);
    }
  });
}

function drawWordDictionaryMenu() {
  const categoryId = WORD_CATEGORY_IDS[ui.wordCategoryIndex];
  const items = wordItemsByCategory(categoryId);
  const totals = wordDictionaryTotals(items.map((item) => item.id));
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const pageSize = hangulDictionaryPageSize();
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  ui.wordPage = Math.min(ui.wordPage, pages - 1);
  const pageStart = ui.wordPage * pageSize;
  const pageItems = items.slice(pageStart, pageStart + pageSize);
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 124 + Math.max(4, pageItems.length) * rowHeight + 40);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("dictionary.words.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(`dictionary.words.category.${categoryId}`), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);
  drawCenteredFittedText(t("dictionary.words.summary", totals), x + w / 2, y + 74, w - 60, 12, false);

  const pageLabel = t("dictionary.hangul.page", { page: ui.wordPage + 1, pages });
  drawFittedText(pageLabel, x + w - 76, y + 51, 52, 12, false);

  const rowsY = y + 104;
  if (!pageItems.length) {
    drawCenteredFittedText(t("dictionary.words.empty"), x + w / 2, rowsY + 20, w - 60, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  pageItems.forEach((item, index) => {
    const entry = wordProgressEntry(item.id);
    const seen = !!entry?.seen;
    const rowY = rowsY + index * rowHeight;
    const status = t(wordDictionaryStatusKey(item.id));
    const score = seen ? `${entry.correct}/${WORD_MASTERY_CORRECT_TARGET}` : "";
    const hangul = seen ? item.hangul : t("dictionary.hangul.unseenValue");
    const meaning = seen ? wordMeaning(item) : t("dictionary.hangul.unseenValue");

    ctx.fillStyle = index % 2 === 0 ? "rgba(255, 250, 240, 0.46)" : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);
    drawFittedText(hangul, x + 34, rowY, narrow ? 70 : 92, narrow ? 14 : 16, true);
    drawFittedText(meaning, x + (narrow ? 110 : 138), rowY, narrow ? w - 250 : w - 352, 13, false);
    drawFittedText(status, x + w - (narrow ? 130 : 170), rowY, narrow ? 82 : 108, 12, false);
    drawFittedText(score, x + w - 58, rowY, 32, 12, false);
  });

  drawDrillPulse(x + w - 42, y + h - 40);
}

function drawJournalMenu() {
  const chapter = QUEST_CHAPTERS[ui.journalChapterIndex];
  const quests = chapter.quests;
  ui.journalQuestIndex = Math.min(ui.journalQuestIndex, quests.length - 1);
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 150 + Math.max(4, quests.length) * rowHeight + 56);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("journal.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(chapter.titleKey), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);

  const badges = earnedBadges();
  const badgeText = badges.length
    ? `${t("journal.badges")}: ${badges.map((badge) => t(badge.titleKey)).join(" - ")}`
    : `${t("journal.badges")}: ${t("journal.noBadges")}`;
  drawCenteredFittedText(badgeText, x + w / 2, y + 74, w - 60, 12, false);

  const rowsY = y + 104;
  quests.forEach((quest, index) => {
    const level = progress.questLevels[quest.id] || 0;
    const total = quest.steps.length;
    const complete = level >= total;
    const rowY = rowsY + index * rowHeight;
    const selected = index === ui.journalQuestIndex;

    ctx.fillStyle = selected
      ? "rgba(192, 68, 68, 0.18)"
      : index % 2 === 0
        ? "rgba(255, 250, 240, 0.46)"
        : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);

    const mark = complete ? "O" : level > 0 ? "-" : " ";
    drawFittedText(`[${mark}]`, x + 32, rowY, 34, 13, complete);
    drawFittedText(t(quest.titleKey), x + 72, rowY, narrow ? w - 200 : w - 260, 13, selected);
    drawFittedText(`${Math.min(level, total)}/${total}`, x + w - 78, rowY, 44, 12, false);
  });

  const selectedQuest = quests[ui.journalQuestIndex];
  const selectedLevel = progress.questLevels[selectedQuest.id] || 0;
  const hintY = rowsY + quests.length * rowHeight + 14;
  let hintText = `${t("journal.hint")}: ${t("journal.complete")}`;
  if (selectedLevel < selectedQuest.steps.length) {
    const step = selectedQuest.steps[selectedLevel];
    const wherePart = step.whereKey ? ` - ${t(step.whereKey)}` : "";
    hintText = `${t("journal.hint")}: ${t(step.objectiveKey)}${wherePart}`;
  }
  drawFittedText(hintText, x + 28, hintY, w - 56, 12, false);

  drawDrillPulse(x + w - 42, y + h - 40);
}

function drawHangulDictionaryMenu() {
  const category = currentHangulDictionaryCategory();
  const itemIds = hangulDictionaryDisplayItemIds(category);
  const totals = hangulDictionaryTotals(category.itemIds);
  const rowHeight = window.innerWidth < 520 ? 24 : 26;
  const pageSize = hangulDictionaryPageSize();
  const pages = Math.max(1, Math.ceil(itemIds.length / pageSize));
  ui.dictionaryPage = Math.min(ui.dictionaryPage, pages - 1);
  const pageStart = ui.dictionaryPage * pageSize;
  const pageItems = itemIds.slice(pageStart, pageStart + pageSize);
  const w = Math.min(620, window.innerWidth - 36);
  const h = Math.min(window.innerHeight - 36, 124 + Math.max(4, pageItems.length) * rowHeight + 40);
  const x = (window.innerWidth - w) / 2;
  const y = (window.innerHeight - h) / 2;
  const narrow = w < 460;

  drawUiBox(x, y, w, h);
  drawCenteredFittedText(t("dictionary.hangul.title"), x + w / 2, y + 22, w - 60, narrow ? 17 : 20, true);
  drawCenteredFittedText(t(category.titleKey), x + w / 2, y + 50, w - 60, narrow ? 13 : 15, false);
  drawCenteredFittedText(t("dictionary.hangul.summary", totals), x + w / 2, y + 74, w - 60, 12, false);

  const pageLabel = t("dictionary.hangul.page", { page: ui.dictionaryPage + 1, pages });
  drawFittedText(pageLabel, x + w - 76, y + 51, 52, 12, false);

  const rowsY = y + 104;
  if (!pageItems.length) {
    drawCenteredFittedText(t("dictionary.hangul.empty"), x + w / 2, rowsY + 20, w - 60, 14, false);
    drawDrillPulse(x + w - 42, y + h - 40);
    return;
  }

  pageItems.forEach((itemId, index) => {
    const item = HANGUL_ITEMS[itemId];
    const entry = hangulItemProgress(itemId);
    const seen = !!entry?.seen;
    const rowY = rowsY + index * rowHeight;
    const status = t(hangulDictionaryStatusKey(itemId));
    const score = seen ? `${entry.correct}/${HANGUL_MASTERY_CORRECT_TARGET}` : "";
    const glyph = seen ? item.glyph : t("dictionary.hangul.unseenValue");
    const answer = seen ? item.answer : t("dictionary.hangul.unseenValue");

    ctx.fillStyle = index % 2 === 0 ? "rgba(255, 250, 240, 0.46)" : "rgba(225, 201, 147, 0.24)";
    ctx.fillRect(x + 24, rowY - 4, w - 48, rowHeight - 2);
    drawFittedText(glyph, x + 34, rowY, narrow ? 54 : 66, narrow ? 15 : 17, true);
    drawFittedText(answer, x + (narrow ? 92 : 112), rowY, narrow ? w - 232 : w - 326, 13, false);
    drawFittedText(status, x + w - (narrow ? 130 : 170), rowY, narrow ? 82 : 108, 12, false);
    drawFittedText(score, x + w - 58, rowY, 32, 12, false);
  });

  drawDrillPulse(x + w - 42, y + h - 40);
}
