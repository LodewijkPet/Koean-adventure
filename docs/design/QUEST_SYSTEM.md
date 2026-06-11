# Korea Adventure — Quest System

The quest framework: data model, quest types, authoring templates, rewards, and UI. Every quest exists to teach; "every quest must have educational purpose" is enforced by the template — a quest without a curriculum line doesn't ship.

## 1. Current Implementation (baseline)

Quests are flag-driven step lists (see `TOWN1_QUESTS` in `src/world/town1.js`):

```js
{
  id: "basicVowels",
  titleKey: "quest.town1.basicVowels",
  steps: [
    { flag: "town1.vowelMapRead",        objectiveKey: "quest.town1.basicVowels.theory" },
    { flag: "town1.vowelPracticePassed1", objectiveKey: "quest.town1.basicVowels.practice" },
    { flag: "town1.vowelExamPassed",      objectiveKey: "quest.town1.basicVowels.exam" },
  ],
}
```

- Flags live in `progress.flags` (a `Set`), set by NPC talks (`progressFlagOnTalk`), study boards (`progressFlagOnStudyBoard`), and passed drills (`completionFlags`).
- `refreshQuestLevels()` recomputes the current step per quest; the info panel shows the active quest + step.
- Interactions gate on `requiredFlags` (theory unlocks practice unlocks exam).

This model is kept. Extensions below are additive.

## 2. Extended Quest Data Model

```js
{
  id: "town3.shoppingList",            // stable, namespaced
  chapter: 3,                          // for journal grouping & review weighting
  type: "side",                        // main | side | relationship | collection |
                                       // investigation | restaurant | travel | cultural
  titleKey: "quest.town3.shoppingList",
  giverKey: "npc.town3GrandmaShopper", // who starts it (journal shows portrait color)
  steps: [
    { flag: "town3.listRead",   objectiveKey: "...read",   hintKey: "...hint1" },
    { flag: "town3.applesBought", objectiveKey: "...buy",  hintKey: "...hint2" },
    { flag: "town3.listDone",   objectiveKey: "...return", hintKey: "...hint3" },
  ],
  rewards: { won: 500, wordIds: ["word.사과", "word.귤"], badgeId: null },
  teaches: ["native numbers", "counter 개", "주세요"],   // curriculum line (required!)
}
```

Rules:

- **Flags are append-only** and namespaced per area (`town3.*`). Never reuse or rename a shipped flag (saves depend on them).
- **`teaches` is mandatory.** Code review rejects quests without a curriculum line.
- Steps are linear per quest; parallelism comes from multiple active quests.
- Hints power the journal's "what now?" line and NPC reminder dialogue.

## 3. Quest Types & Templates

### 3.1 Main Story (per chapter: 4–8)

The chapter's teaching spine: theory → practice → exam chains, ending in the badge.
Template (already proven in Town 1):

1. Discover the place/problem (talk to keeper NPC) → flag.
2. Read the theory (study board) → flag, unlocks practice.
3. Pass practice (repeatable drill, weakness-first) → flag, unlocks exam.
4. Pass exam (one-shot drill at exam archetype) → flag, advances chapter.

### 3.2 Side Quests (per chapter: 6–12)

Optional applications of the chapter's grammar in a fresh wrapper. Must be solvable with *current-chapter* skills only.

Example (Ch 3): **할머니의 장보기 (Grandma's Shopping List)** — read her list (사과 세 개, 물 두 병), buy the items at the right stalls within budget, return. Teaches: native numbers + counters + 주세요. Reward: won + recipe item for a Ch 6 callback.

### 3.3 Relationship Quests (recurring NPCs, multi-chapter)

A character's story continues across towns; each meeting requires the *new* chapter's grammar to progress, and replays earlier patterns.

Example: **the Lost Child** (Town 2) reappears in Time Town having lost her *schedule* (Ch 4 time reading), then at the Station having taken the wrong train (Ch 7 directions). Completing all arcs = friendship entry in the journal + capital cameo.

Example: **the Rival** — review duels at each badge town: a quiz race over mixed content from all chapters so far (scheduled SRS in disguise).

### 3.4 Collection Quests

World-spanning gathering with linguistic keys.

- **간판 사냥 (Sign Hunt)**: photograph (interact) every shop sign in a district; each is a reading micro-drill.
- **단어 채집 (Word Foraging)**: the Word Dictionary itself; milestone rewards at 100/500/1,000 mastered words.
- **수수께끼 돌 (Riddle Stones)**: stones across trails with riddles in Korean; answer = a word you must have mastered.

### 3.5 Investigation Quests

Read/listen for clues; deduction = comprehension test.

Example (Ch 4): **멈춘 시계 (The Stopped Clock)** — interview five townsfolk about *when* they last heard the chime (past tense + times), cross-check statements, find the contradiction. The "culprit" interview replays all five time statements.

### 3.6 Restaurant Quests (Ch 6 specialty, echoes later)

Order-taking shifts: listen to TTS orders, mark the table's choices; difficulty scales (1 item → multi-item with negations: 김치찌개 하나요, 안 맵게 해 주세요).

### 3.7 Travel Quests (Ch 7 specialty)

Ticket missions: reach destination X by time Y under budget Z — forces timetable reading, platform signs, transfer announcements.

### 3.8 Cultural Quests (festivals)

Set-piece events (Chuseok, Lantern Festival, Kimjang) — see `WORLD_DESIGN.md`. Always mixed-review + culture notes in easy Korean.

## 4. Rewards

| Reward | Source | Spends on |
| --- | --- | --- |
| **Won (₩)** | quests, exams, shifts | snacks (review boosts later), tickets, gifts (relationship quests), festival games |
| **Words** | quest completion force-adds to Word Dictionary as "seen" | — |
| **Badges** | chapter finals only | gates next trail; displayed in journal |
| **Keepsakes** | relationship/cultural quests | journal trophies; some unlock dialogue callbacks |
| **Fast travel** | Ch 7 badge | rail network |

No XP levels: **the player's level *is* their language.** Gates check flags/badges (= demonstrated skill), never grind.

## 5. Quest UI

- **Info panel** (exists): active quest + current step, kept.
- **Quest Journal** (menu screen, to build): grouped by chapter → quest list with step checkmarks, hint line for the selected quest, badge case at top. Data: the quest lists + `progress.flags`; no new state needed beyond cosmetic "viewed" marks.
- **NPC reminders**: quest givers repeat the current `hintKey` when re-talked (conversation resolvers already support this pattern via flag checks).

## 6. Authoring Checklist (per quest)

1. `teaches` line maps to `CURRICULUM_MAP.md` for its chapter.
2. All flags namespaced, additive, registered in the chapter's flag table.
3. Every text key in `TEXT.en/ko/nl` (Korean first-class, not an afterthought).
4. Solvable with chapter-current recognition skills; production only if the chapter's ladder step allows.
5. Fallback dialogue when prerequisites missing (no dead interactions).
6. Reward registered; badge quests set the badge flag through the exam drill's `completionFlags`.
7. `node tools/smoke-test.js` passes; journal renders the quest correctly.
