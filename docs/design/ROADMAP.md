# Korea Adventure — Roadmap

From the current build (Town 1 + Trail 1 + Town 2, no persistence) to 1.0 (twelve chapters, capital finale). Each milestone is shippable: the game must boot clean (`node tools/smoke-test.js` with zero failures) and remain save-compatible at every step.

> **Execution detail lives in `docs/project-plan/`** — the task-level breakdown of everything below into parallel multi-agent workstreams (file ownership, dependency graph, per-chapter specs, claim board). Start there to build; this file stays the milestone summary.

## Current State (v0.3)

- Engine: scenes, interiors, drills (multiple choice + generated Hangul), study boards, flags/quests, Hangul Dictionary, TTS, i18n EN/KO/NL, music.
- Content: Chapter 1 complete (Hangul), Trail 1 complete, Chapter 2 (Name City) playable with City Hall stations.
- Known gaps: **no save system**, `town2FinalBadge` sets no flags (badge unearnable), no word dictionary, no badges UI, no quest journal, Trail 2/Town 3 absent.

## M1 — Foundations (v0.4) — SHIPPED

The systems everything else depends on. All five tasks below are implemented and verified by `tools/smoke-test.js`.

| # | Task | Definition of done |
| --- | --- | --- |
| 1 | **Save system** | `localStorage` autosave (debounced) of settings, flags, quest levels, Hangul+Word dictionaries, badges, player scene/position; versioned payload; silent load on boot; "Erase Save" in settings; never crashes on corrupt/missing data. |
| 2 | **Word Dictionary engine** | `WORD_ITEMS` registry (id, hangul, category, translations via TEXT keys); same mastery model as Hangul items; drills can tag `wordIds`; menu screen "Words" with categories/pagination; persisted. |
| 3 | **Badge system** | `BADGES` registry; `town2FinalBadge` exam awards First Words Badge via completionFlags; badges screen in menu; road guard + Trail 2 gate check the badge. |
| 4 | **Quest journal** | Menu screen listing quests per chapter with step states + hint for current step; Town 1 + Town 2 quest lists registered. |
| 5 | **Town 2 closure** | Final badge wiring: station flags, podium logic, leader dialogue states, badge award celebration line. |

## M2 — Chapter 3 Vertical Slice (v0.5) — SHIPPED (first cut)

Proves the chapter pipeline on new content. Trail 2 (Mirror Path), Town 3 (Number Market) with four interiors, `data/drills/trail-2.js` + `data/drills/town-3.js` packs (~100 words), generated number/compound-vowel drills, and the Number Badge are in. Remaining for M2 polish: grandma quest as a stateful buy-event once money exists (M3), and map decoration passes.

| # | Task | Definition of done |
| --- | --- | --- |
| 1 | **Trail 2 (Mirror Path)** | Scene + compound-vowel shrine (study board + generated drills from new `HANGUL_COMPOUND_VOWELS` pool), location-grammar events (에 있어요 / position words), connects Town 2 ↔ Town 3, badge-gated at Town 2 exit. |
| 2 | **Town 3 (Number Market)** | Outdoor scene + Counting House + Guild Hall + stalls; theory boards (sino/native numbers, counters); generated number drills (weakness-first); shopping/price drills; quest list `TOWN3_QUESTS`; Number Badge exam; ~120 new words registered in Word Dictionary. |
| 3 | **Drill pack** | `data/drills/town-3.js` with all static drill text EN/KO/NL. |
| 4 | **Docs hygiene** | This file + town3 plan notes updated to current state. |

## M2.5 — Quality Pass (v0.55) — SHIPPED

Quality before quantity: polish everything that exists before building Chapter 4.

| # | Task | What shipped |
| --- | --- | --- |
| 1 | **Folder structure** | `src/` (engine), `assets/audio/`, `data/drills/` (packs), `docs/{design,guides,plans,archive}/`, `tools/`. All paths updated; root holds only `index.html`, `README.md`, `agents.md`. |
| 2 | **Question variety** | Vowel/consonant/syllable questions now run in both directions (glyph→sound and sound→glyph); sino number drills mix word questions with generated price reading (`composeSinoReading`, both directions); native drills mix in generated counting phrases (사과 세 개 → how many?); `town3Prices` fully generated. Smoke test asserts multi-prompt variety per drill. |
| 3 | **Wayfinding** | Every quest step has a `whereKey`; the info panel shows a "Where" row; journal hints append the place; plaza/travel guides became dynamic (`chapterGuideLines`) and literally tell you your next objective and where it is. |
| 4 | **NPC variety** | `conversationPools` engine: ambient NPCs (Town 1 four outdoor + clerk/owner, Trail keepers/hiker, Town 2 five, Town 3 six) now pick randomly between dialogue sets; quest NPCs keep state-aware resolvers. |
| 5 | **Docs current** | README (structure, save, smoke test), agents.md rewritten, vision docs updated (Language League finale, West Region + Joseon Folk Village), this roadmap. |

## M3 — Economy & Production Drills (v0.6)

- Won currency + inventory (items, gifts); shops become transactional (buying = counting exam).
- **Sentence-builder step type** (order the chunks) in the drill engine; retrofit one builder drill per existing chapter.
- **Conversation challenge** drill type (answer NPC in Korean from Korean-only choices).
- Review echo stations: every town's practice landmark gains "review" mode pulling weakest items across all chapters.

## M4 — Chapter 4 (Time Town) (v0.7)

Time/dates/past tense per `CURRICULUM_MAP.md`; investigation quest archetype (The Stopped Clock); mentor letters v1 (scheduled review reading); rival duel v1 at the badge.

## M5 — Chapter 5 (Family Village) (v0.8)

Family/honorifics/adjectives; relationship quest arcs begin (Lost Child #2); Chuseok festival set piece; Grammar Pattern Log menu (auto-filled cards).

## M6 — Chapters 6–7 (Restaurant + Station) (v0.9)

Restaurant shift system (order-taking mini-game); travel/ticket missions; rail fast-travel (timetable-gated); pronunciation-rule mini-games (tensification, ㄹ assimilation).

## M7 — Chapters 8–9 + Capital ferry gate (v0.95)

Campus + Hospital chapters; 8th badge opens ferry; typed-Hangul input mode (optional) for production drills.

## M8 — Chapters 10–12 + Finale (v1.0)

Lantern Lake (optional region), Airport, Capital with the **언어 연맹 (Language League)** hall; **A Day in Korean** finale (generated from full curriculum, weakness-weighted); post-game errand generator; Korean-only NG+ mode; 3,000-word dictionary target; full QA pass of curriculum can-do statements.

## M9+ — West Region (post-1.0)

Ferry from Family Village to the optional, badge-free west: **조선 민속 마을 (Joseon Folk Village)** first (traditional life, politeness depth, storytelling listening), then Hot Spring Town, Potters' Village, Ink-Painting Trail — see `WORLD_DESIGN.md`. Built only while the main road keeps meeting the Quality Bar (`MASTER_VISION.md` §2.6).

## Standing Engineering Rules

1. `node --check <changed-file.js>` and `node tools/smoke-test.js` after every JS edit; the smoke test must end with zero failures.
2. Every visible key in `TEXT.en/ko/nl`; Korean written first.
3. Flags append-only; save payload versioned (`SAVE_VERSION`), migrations additive.
4. New chapter content ships as: scene builder(s) + drill pack file + quest list (every step with `whereKey`) + word list + flag table; engine changes only when a new *mechanic* is needed.
5. Generated drills always set `shuffleChoices: true` and should offer at least two question directions; ambient NPCs get at least two `conversationPools`.
6. Keep `docs/guides/create-*.md` updated when patterns change; retire stale planning files into `docs/archive/`.
7. No build step, no external dependencies, mobile-readable UI.
