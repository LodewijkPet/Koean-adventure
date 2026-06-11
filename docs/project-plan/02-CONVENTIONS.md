# Conventions — the rules that make parallel work safe

Violating these creates merge conflicts or broken saves. They are checked by the smoke test where possible; the rest is review discipline.

## 1. Namespaces (collision-proof ids)

Every identifier an agent creates is prefixed with its area/feature slug. Slugs are single-claim (see table). Never reuse, never rename after ship.

| Kind | Pattern | Examples |
| --- | --- | --- |
| Scene ids | `<slug>` + camel suffix for interiors | `town4`, `town4ClockTower`, `trail3` |
| Progress flags | `<slug>.<thing>` | `town4.diaryRead`, `trail3.harvestPassed` |
| TEXT keys | `area.<slug>*`, `npc.<slug>*`, `object.<slug>*`, `drill.<slug>*`, `quest.<slug>*`, `sign.<slug>*`, `story.<slug>*` | `npc.town4Watchmaker.line1` |
| Drill keys | `<slug><PascalName>` | `town4ScheduleBoard` |
| Word ids | `word.<romanized>` — check `WORD_ITEMS` for clashes; suffix `2`,`3` on homographs | `word.bae2` (pear) |
| Voice ids | `<slug><Role>` unique forever | `town4Watchmaker` |
| Quest ids | `<slug><PascalName>` | `town4StoppedClock` |
| Badge ids | one word | `clock`, `family`, `taste`, `travel`, `study`, `health` |
| Music keys | `<slug>` or named | `town4`, `league`, `jingleBadge` |
| Engine feature flags/settings | `feature.<name>` | reserved by ENGINE only |

Reserved slugs: `town`(=town1), `trail1`, `town2`, `trail2`, `town3`, `trail3`, `town4` … `town12`, `trail4`…`trail9`, `capital`, `league`, `west`, `joseon`, `story`, `intro`, `rival`, `mentor`, `festival`.

## 2. Registries are append-only, via APIs

After Phase 0, all content enters the game through registration (defined in `03-PHASE-0-FOUNDATION.md` §KA API): text, drills, words, scenes, chapters (quests+flags), badges, music tracks, story scripts. Direct mutation of engine tables from content files is forbidden. Never delete or rename a shipped key/flag/id — saves reference them (`SAVE_VERSION` migrations are ENGINE-only, feature E14).

## 3. Language rules (every string)

1. Write the **Korean line first**; EN and NL translate the Korean.
2. Every visible key exists in `TEXT.en`, `TEXT.ko`, `TEXT.nl` (smoke test enforces for everything reachable from scenes/drills/quests).
3. NPC Korean obeys the speech-leveling rule (`docs/design/NPC_SYSTEM.md` §2): chapter grammar or below, max ONE transparent i+1 pattern per NPC.
4. No romanization outside Chapter 1 letter names. Numbers/prices may use digits.
5. Names: Korean given names from the narrative cast list (`14-WS-NARRATIVE.md` §Cast); romanized only inside EN/NL strings.

## 4. The Quality Bar (gates every merge — from MASTER_VISION §2.6)

1. Generated drills: `shuffleChoices: true`, ≥2 question directions, weakness-first selection.
2. Static drills meant for repetition: more `steps` than `stepCount` so runs differ.
3. Every quest step has `objectiveKey` + `whereKey` (an `area.*` key).
4. Ambient NPCs ≥2 `conversationPools`; quest NPCs use `conversationResolver`; guides use `chapterGuideLines`.
5. Theory → practice → exam stations per learning unit; fountain-archetype practices, blackboard/podium-archetype examines.
6. Each chapter ships its "review echo": one station whose pool includes weakest items from ALL previous chapters.

## 5. Verification gate (before every stop/commit)

```
node --check <each touched .js>
node tools/smoke-test.js        # must end: SMOKE TEST PASSED, zero FAILURES
```

Plus, when you added content: walk it once in the browser (`py -m http.server 8000`), confirm: enterable/exitable scenes, no NPC blocking a door/route, drills openable, zero console errors. Record the playtest in your chapter doc's checklist.

## 6. Writing-to-disk conventions

- New pack files: copy the header pattern of `data/drills/town-3.js` (IIFE pushing onto the global pack array).
- World scene files (post-P0): one chapter per file `src/world/<slug>.js`, exporting nothing — they call `KA.registerScenePack(...)`.
- Keep functions ≤ ~60 lines; mirror existing naming (`createX`, `drawX`, `resolveX`, `buildXQuestion`).
- Comments only for non-obvious constraints (tile coordinates magic, Hangul composition math).

## 7. Documentation upkeep

- Tick your checkboxes in your stream doc as steps complete; flip section headers from "to build" to "implemented" with one line of what differs from plan.
- New reusable pattern? Update the matching `docs/guides/create-*.md` in the same change.
- Finished plans move to `docs/archive/` (content chapter docs stay in project-plan with status SHIPPED header instead).

## 8. Educational integrity (curriculum lock)

- A chapter teaches ONLY its `CURRICULUM_MAP.md` allocation (+ review of earlier). If you want to move a grammar point between chapters, that's a design change: update CURRICULUM_MAP in the same commit and note it in STATUS.
- Every quest carries `teaches:` in its plan table; every drill maps to a curriculum line. No decorative content that teaches nothing (flavor objects teach vocabulary).
- Recognition before production: production step types (E1 builder, E9 typing) only for patterns the player has recognized in ≥2 prior stations.
