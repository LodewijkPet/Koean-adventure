# Agent Handoff

Korea Adventure is a browser-based Korean-learning RPG (no build step). Three chapters are playable: Haneul Town (Hangul), Name City (first sentences, First Words Badge), and Number Market (numbers/counters/prices, Number Badge), connected by Trails 1–2.

## Start Here

1. `docs/design/MASTER_VISION.md` — what the game is and the design rules.
2. `docs/design/ROADMAP.md` — what is shipped and what comes next.
3. `docs/design/CURRICULUM_MAP.md` — the chapter-by-chapter language curriculum.
4. `docs/guides/create-a-town.md` and `docs/guides/create-a-drill.md` — implementation patterns.

`docs/design/` is the source of truth. `docs/plans/` holds active working notes; `docs/archive/` holds finished plans.

## Layout

- `src/game.js` — the whole engine + Town 1/2/3 scenes (TEXT, DRILLS, STUDY_BOARDS, quests, save system, menus, rendering).
- `src/tts.js` — speech synthesis voice selection.
- `data/drills/*.js` — per-chapter packs merged at boot: text keys (EN/KO/NL), static drills, word lists.
- `tools/smoke-test.js` — headless boot + integrity test. **Run it after every change.**

## Key Systems (search anchors in src/game.js)

- Save system: `SAVE_KEY`, `loadSave`, `scheduleSave` (localStorage, versioned).
- Quests/flags: `QUEST_CHAPTERS`, `TOWN1_FLAGS`/`TOWN2_FLAGS`/`TRAIL2_FLAGS`/`TOWN3_FLAGS`, `setProgressFlag`. Every quest step has `objectiveKey` + `whereKey` (an `area.*` key).
- Badges: `BADGES`, awarded via drill `completionFlags`.
- Dictionaries: Hangul items (`HANGUL_ALL_ITEMS`) and words (`WORD_ITEMS`, registered from pack `words` arrays), both with seen/learning/mastered tracking.
- Generated drills: `generateHangulStepsFromPool`, `generateSinoSteps`, `generateNativeSteps`, `buildSinoPriceStep`, `buildWordQuestion` — weakness-first selection, multiple question directions per item. Always set `shuffleChoices: true` on generated drills.
- NPC dialogue: `conversationKeys` (fixed), `conversationPools` (random variety), `conversationResolver` (state-aware). Guides use `chapterGuideLines(chapterId, introKey)` to point players to the next objective.

## Editing Rules

- Every visible string needs `TEXT.en`, `TEXT.ko`, and `TEXT.nl` entries (engine text in `src/game.js`, chapter text in its pack).
- Korean is written first; EN/NL translate the Korean.
- Flags are append-only; never rename shipped flags (saves depend on them).
- Quest steps must include a `whereKey` so the panel/journal can say where to go.
- Ambient NPCs should have at least two conversation pools; quest NPCs use resolvers.
- New chapters ship as: scene builder(s) in `src/game.js` + a `data/drills/<area>.js` pack + quest list + flags + words.
- After JavaScript edits run `node --check src/game.js` and `node tools/smoke-test.js` (must end with SMOKE TEST PASSED and zero failures).
- Do not revert user changes. Keep documentation in sync with what you implement.

## Browser Verification

For gameplay/UI changes beyond the smoke test:

1. `py -m http.server 8000` and open `http://localhost:8000`.
2. Drive the changed interaction by keyboard through the canvas.
3. Check desktop and one narrow/mobile layout when UI sizing changed.
4. Confirm zero console errors.
