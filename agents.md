# Agent Handoff

Korea Adventure is a browser-based Korean-learning RPG (no build step). Three chapters are playable: Haneul Town (Hangul), Name City (first sentences, First Words Badge), and Number Market (numbers/counters/prices, Number Badge), connected by Trails 1-2.

## Start Here

1. **`docs/project-plan/00-MASTER-PLAN.md`** - the executable plan to 1.0: pick a workstream, claim it in `docs/project-plan/STATUS.md`, follow your stream doc. Built for multiple agents in parallel (strict file ownership: read `01-WORKSTREAMS.md` + `02-CONVENTIONS.md` before touching anything).
2. `docs/design/MASTER_VISION.md` - what the game is and the design rules.
3. `docs/design/CURRICULUM_MAP.md` - the chapter-by-chapter language curriculum.
4. `docs/guides/create-a-town.md` and `docs/guides/create-a-drill.md` - implementation patterns.

`docs/design/` is the vision source of truth; `docs/project-plan/` is the work breakdown; `docs/plans/` holds legacy working notes; `docs/archive/` holds finished plans.

## Layout

- `src/core/loop.js` - boot file, canvas loop, player/NPC movement, input, study-board registry.
- `src/core/*.js` - constants, text/i18n, Hangul/word dictionaries, drills, quests/badges/flags, save, audio, speech, interactions.
- `src/world/*.js` - chapter and route scene modules. Town 1/2/3 and Trails 1-2 register themselves with `KA.world.registerScene(...)`.
- `src/render/*.js` - tile, object, building, and actor drawing.
- `src/ui/*.js` - HUD, dialogs, menus, panels, widgets.
- `src/tts.js` - speech synthesis voice selection.
- `data/drills/*.js` - per-chapter packs merged at boot: text keys (EN/KO/NL), static drills, word lists.
- `tools/smoke-test.js` - headless boot + integrity test. **Run it after every change.**

## Key Systems

- Save system: `src/core/save.js` (`SAVE_KEY`, `loadSave`, `scheduleSave`; localStorage, versioned).
- Quests/flags: `src/core/quests.js` provides registries; shipped chapter flags live in their `src/world/*.js` files. Every quest step has `objectiveKey` + `whereKey` (an `area.*` key).
- Badges: registered through `KA.badges.register(...)`, usually from the owning world file.
- Dictionaries: Hangul items in `src/core/hangul.js`; words in `src/core/words.js`, registered from pack `words` arrays.
- Generated drills: builders live in `src/core/hangul.js` and `src/core/words.js`; chapter-specific drill setup lives with the owning world file. Always set `shuffleChoices: true` on generated drills.
- NPC dialogue: `conversationKeys` (fixed), `conversationPools` (random variety), `conversationResolver` (state-aware) live in world files. Guides use `chapterGuideLines(chapterId, introKey)` to point players to the next objective.

## Editing Rules

- Every visible string needs `TEXT.en`, `TEXT.ko`, and `TEXT.nl` entries (engine text in `src/core/text.js`, chapter text in its pack).
- Korean is written first; EN/NL translate the Korean.
- Flags are append-only; never rename shipped flags (saves depend on them).
- Quest steps must include a `whereKey` so the panel/journal can say where to go.
- Ambient NPCs should have at least two conversation pools; quest NPCs use resolvers.
- New chapters ship as: scene builder(s) in `src/world/<area>.js` + a `data/drills/<area>.js` pack + quest list + flags + words.
- After JavaScript edits run `node --check <changed-file.js>` and `node tools/smoke-test.js` (must end with SMOKE TEST PASSED and zero failures).
- Do not revert user changes. Keep documentation in sync with what you implement.

## Browser Verification

For gameplay/UI changes beyond the smoke test:

1. `py -m http.server 8000` and open `http://localhost:8000`.
2. Drive the changed interaction by keyboard through the canvas.
3. Check desktop and one narrow/mobile layout when UI sizing changed.
4. Confirm zero console errors.
