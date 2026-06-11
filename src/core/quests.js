window.KA = window.KA || {};

const QUEST_CHAPTERS = [];
const BADGES = [];

function registerQuestChapter(chapter) {
  if (!chapter || !chapter.id) return;
  QUEST_CHAPTERS.push(chapter);
}

function registerBadge(badge) {
  if (!badge || !badge.id) return;
  BADGES.push(badge);
}

function hasProgressFlag(flag) {
  return progress.flags.has(flag);
}

function setProgressFlag(flag) {
  if (!flag || progress.flags.has(flag)) return false;
  progress.flags.add(flag);
  refreshQuestLevels();
  scheduleSave();
  return true;
}

function setProgressFlags(flags = []) {
  flags.forEach((flag) => setProgressFlag(flag));
}

function earnedBadges() {
  return BADGES.filter((badge) => hasProgressFlag(badge.flag));
}

function badgePanelSummary() {
  return `${earnedBadges().length}/${BADGES.length}`;
}

function refreshQuestLevels() {
  QUEST_CHAPTERS.forEach((chapter) => {
    chapter.quests.forEach((quest) => {
      let level = 0;
      for (const step of quest.steps) {
        if (!hasProgressFlag(step.flag)) break;
        level += 1;
      }
      progress.questLevels[quest.id] = level;
    });
  });
}

function firstIncompleteQuest(quests) {
  for (const quest of quests) {
    const level = progress.questLevels[quest.id] || 0;
    if (level < quest.steps.length) {
      return {
        titleKey: quest.titleKey,
        objectiveKey: quest.steps[level].objectiveKey,
        whereKey: quest.steps[level].whereKey || null,
      };
    }
  }
  return null;
}

function chapterGuideLines(chapterId, introKey) {
  const chapter = QUEST_CHAPTERS.find((candidate) => candidate.id === chapterId);
  const status = chapter ? firstIncompleteQuest(chapter.quests) : null;
  if (!status) return [introKey, "npc.guide.allDone"];
  return [
    introKey,
    {
      key: "npc.guide.next",
      params: {
        objective: t(status.objectiveKey),
        where: status.whereKey ? t(status.whereKey) : t(chapter.titleKey),
      },
    },
  ];
}

function currentQuestStatus() {
  const sceneId = currentSceneId;
  const sceneChapter = QUEST_CHAPTERS.find((chapter) => chapter.sceneIds.some((id) => sceneId.startsWith(id)));
  if (sceneChapter) {
    const local = firstIncompleteQuest(sceneChapter.quests);
    if (local) return local;
  }

  for (const chapter of QUEST_CHAPTERS) {
    const status = firstIncompleteQuest(chapter.quests);
    if (status) return status;
  }

  const lastChapter = QUEST_CHAPTERS[QUEST_CHAPTERS.length - 1];
  const finalQuest = lastChapter.quests[lastChapter.quests.length - 1];
  return { titleKey: finalQuest.titleKey, objectiveKey: "journal.complete" };
}

window.KA.flags = {
  has: hasProgressFlag,
  set: setProgressFlag,
  setMany: setProgressFlags,
};

window.KA.quests = {
  chapters: QUEST_CHAPTERS,
  registerChapter: registerQuestChapter,
  refreshLevels: refreshQuestLevels,
  currentStatus: currentQuestStatus,
};

window.KA.badges = {
  all: BADGES,
  register: registerBadge,
  earned: earnedBadges,
};

window.KA.guide = {
  chapterGuideLines,
};
