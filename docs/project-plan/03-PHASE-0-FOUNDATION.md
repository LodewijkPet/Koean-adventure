# Phase 0 — Foundation: modularize the engine, open parallel work

**Stream:** FOUNDATION (single agent). **Blocks:** all other `src/` work. **Goal:** split `src/game.js` (~12k lines) into owned modules and add registration APIs so chapters/systems plug in from separate files. Zero behavior change — the game must play identically after every step.

## Target file layout (script-tag loading, no build step)

Load order matters; later files may use earlier globals. `index.html` gets anchor comments for append-only additions.

```
src/core/constants.js     TILE, COLORS, DIRS, keyToDir, LANGUAGES, MUSIC_TRACKS, SOLID_TILES
src/core/text.js          TEXT base tables + t(), uiText(), languageName()
src/core/state.js         settings, ui, progress, player, movementInput, scenes, camera, dialog/drill/studyBoard vars (as a KA.state object — see §API note)
src/core/save.js          SAVE_KEY/VERSION, serialize/persist/load, erase, applySavedPlayerState
src/core/words.js         WORD_* constants, registry, mastery fns, generated word questions
src/core/hangul.js        HANGUL_* items, composition, mastery fns, generated hangul questions
src/core/drills.js        DRILLS registry, run building, input handling, answer/complete logic
src/core/quests.js        flags, quest chapters registry, badges registry, refresh/status fns, chapterGuideLines
src/core/audio.js         musicState, musicTrack(), updateMusicForScene, unlock, pause  (AUDIO stream takes over after P0)
src/core/speech.js        speakDialogLine etc. (wraps src/tts.js)
src/core/interactions.js  getInteractionTarget, openDialogFor, resolveInteraction*, study boards open/close, route/step triggers
src/core/loop.js          update/draw dispatch, resize, main loop, key listeners, boot sequence
src/render/tiles.js       drawTile + terrain drawers
src/render/objects.js     outdoor/interior object + furniture drawers
src/render/actors.js      drawPlayer/drawNpc/drawPerson/drawChild
src/render/buildings.js   drawBuilding/drawWindow/ledges/interactables markers
src/ui/widgets.js         drawUiBox, cursors, fitted text, wrapText
src/ui/panels.js          info panel, dialog box, study board, drill overlay
src/ui/menus.js           main menu, settings, dictionaries, journal (+ future screens)
src/world/helpers.js      createTileMap/fillMapRect/createRouteTriggers/createRectInteractions/createInteriorScene/fillInterior*/addInteriorNpc — exposed as KA.world
src/world/town1.js        Haneul Town outdoor + interiors + TOWN1 quests/flags (move as-is)
src/world/trail1.js       Trail 1
src/world/town2.js        Name City + interiors + TOWN2 quests/flags + resolvers
src/world/trail2.js       Mirror Path + resolvers
src/world/town3.js        Number Market + interiors + TOWN3 quests/flags + resolvers + chapter-3 drill config
```

`index.html` final script order:

```html
<!-- DATA PACKS (append-only) -->
data/drills/start-town.js … data/drills/town-3.js
<!-- STORY PACKS (append-only) -->
<!-- ENGINE CORE (FOUNDATION/ENGINE only) -->
src/tts.js, src/core/*.js (fixed explicit order)
<!-- RENDER (ART) --> src/render/*.js
<!-- UI (UI/UX) --> src/ui/*.js
<!-- WORLD (one line per chapter, append-only) -->
src/world/helpers.js, town1.js, trail1.js, town2.js, trail2.js, town3.js
<!-- BOOT --> src/core/loop.js   (last)
```

## The `KA` API (the contract everyone codes against)

One global namespace object `window.KA` assembled across core files. Content files use ONLY this surface (plus the existing data-pack push):

```js
KA.t(key, params?, lang?)            // translation
KA.text.register({en,ko,nl})         // merge text keys (packs already do this via drill packs)
KA.state                             // {settings, ui, progress, player, scenes, ...} read access
KA.flags.has(flag) / set(flag) / setMany([...])
KA.quests.registerChapter({id, titleKey, sceneIds, quests})   // appends to QUEST_CHAPTERS
KA.badges.register({id, titleKey, flag})
KA.words.register([...])             // existing word item shape
KA.drills.register({key: data,...})  // merge into DRILLS
KA.drills.questions                  // {literalChoice, keyedChoice, createChoiceSet, buildWordQuestion, createGeneratedWordStep, generateWordStepsFromCategories, selectWordPracticeItems, hangul builders, composeSinoReading, buildSinoPriceStep, buildNativeCountStep, generateSinoSteps, generateNativeSteps}
KA.world                             // map/scene helpers listed above
KA.world.registerScene(sceneOrFactory)         // adds to scenes at boot, before saved-state apply
KA.world.registerInteriors(factory(buildings)) // same timing
KA.music.registerTracks({key: "assets/audio/X.mp3"})
KA.guide.chapterGuideLines(chapterId, introKey)
KA.story.register(script)            // E4 adds; stub object in P0 so packs can ship early
```

Boot order in `loop.js`: merge packs → build world scenes (registered factories in registration order) → loadSave → applySavedPlayerState → start loop. Identical to today, just driven by registries.

**State-variable note:** today many globals (`dialog`, `drill`, `currentSceneId`…) are bare `let`. P0 wraps them in `KA.state` with thin accessor functions where cross-file mutation is needed (e.g. `KA.openDialog(lines)`), keeping diffs mechanical. Do not redesign logic while moving it.

## Steps (execute in order; smoke test green after EVERY step)

- [x] **P0.1** Add `tools/smoke-test.js` auto-discovery: parse `index.html` script tags instead of the hardcoded file list (regex `src="([^"]+\.js)"`), so new files are tested automatically. Run: green.
- [ ] **P0.2** Create `src/core/constants.js`; move the constant blocks; add `window.KA = { }` seed. `index.html` loads it before `game.js`. Delete moved code from game.js. Green.
- [ ] **P0.3** Move TEXT + `t()` family to `src/core/text.js`; expose `KA.t`, `KA.text.register`. Point `mergeExternalDrillPacks` text merging at it. Green.
- [ ] **P0.4** Move Hangul item system to `src/core/hangul.js`; words system to `src/core/words.js`; expose question builders under `KA.drills.questions`. Green.
- [ ] **P0.5** Move save system to `src/core/save.js`; quests/flags/badges to `src/core/quests.js` with `registerChapter`/`register` APIs; convert the three existing chapter registrations to API calls (still inside game.js for now). Green.
- [ ] **P0.6** Move drills engine to `src/core/drills.js` (registry + run/answer/input). Green.
- [ ] **P0.7** Move audio to `src/core/audio.js` (+`KA.music.registerTracks`); speech glue to `src/core/speech.js`. Green.
- [ ] **P0.8** Move render functions to `src/render/*.js` (tiles/objects/actors/buildings). Pure moves. Green.
- [ ] **P0.9** Move UI draw + menu input to `src/ui/*.js`. Green.
- [ ] **P0.10** Move world helpers to `src/world/helpers.js` exposing `KA.world`; move interactions/step-trigger logic to `src/core/interactions.js`. Green.
- [ ] **P0.11** Split world content: `src/world/town1.js`, `trail1.js`, `town2.js`, `trail2.js`, `town3.js` — each file: its scene factory(ies), interiors, NPC resolvers, quest/flag tables, chapter registration, generated-drill config (`configureChapter3GeneratedDrills` moves into town-3's world file or stays in core where shared — sino/price builders are SHARED → keep in `core/words.js`). Register via `KA.world.registerScene`. Green.
- [ ] **P0.12** Reduce `src/game.js` to nothing; delete it; `src/core/loop.js` is the boot file. Update README structure block + `docs/guides/create-a-town.md` + `create-a-drill.md` to the new pattern (registration API examples). Green.
- [ ] **P0.13** Add smoke-test assertions: `KA` API surface exists (each function typeof check); registries non-empty; boot uses registration order. Green.
- [ ] **P0.14** Update `agents.md` anchors (file map), `01-WORKSTREAMS.md` ownership rows if names changed, flip STATUS row to done, announce in STATUS merge log.

## Acceptance criteria

- Behavior-identical playthrough: Town1 school loop, Trail2 key quest, Town3 badge — manual browser pass.
- `src/game.js` gone; every new file < ~1,500 lines; world chapters fully isolated per file.
- A demo "hello chapter" can be added with ZERO edits outside `src/world/demo.js` + `data/drills/demo.js` + two `index.html` anchor lines (prove it, then delete the demo).
- Smoke test green, parses index.html, exercises all registries.

## Hand-off notes (fill at completion)

- Deviations from the file map: …
- API additions content agents should know: …
