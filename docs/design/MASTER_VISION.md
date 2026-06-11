# Korea Adventure — Master Vision

This is the single source of truth for what Korea Adventure is, what it must become, and the principles every future feature is measured against.

Companion documents:

- `CURRICULUM_MAP.md` — the full language curriculum, chapter by chapter.
- `WORLD_DESIGN.md` — the world, every town, route, and building.
- `QUEST_SYSTEM.md` — the quest framework and quest catalog.
- `NPC_SYSTEM.md` — NPC archetypes, speech leveling, and dialogue rules.
- `ROADMAP.md` — the build order from the current state to 1.0.

## 1. What This Game Is

Korea Adventure is a single-player, browser-based, top-down RPG that teaches Korean from absolute zero to roughly CEFR A2–B1. It is structured like Pokémon Red — a small starting town, routes that connect towns, one badge per region, a world that opens up as your skills grow — but the "creatures" you collect are Korean letters, words, and grammar patterns, and the "battles" are real moments of language use.

A player who finishes the game can:

- Read Hangul fluently, including batchim and pronunciation-change rules.
- Parse Korean sentence structure (topic–object–verb) automatically.
- Use the core particles (은/는, 이/가, 을/를, 에, 에서, 도, 의, 와/과, (으)로, 부터/까지, 한테/에게).
- Conjugate present, past, and future in polite style, plus negation, ability, desire, obligation, and requests.
- Survive — in Korean — a restaurant, a market, a train station, a hospital, a shop, a phone call, and small talk with a stranger.
- Recognize several thousand common words and produce the most frequent ~1,200.

## 2. Design Philosophy

### 2.1 The Prime Rule

**Educational value outranks everything — but it must never look like education.**

Every system, quest, NPC, and mini-game exists to teach. But the player should experience exploration, mystery, helping people, collecting, and getting stronger. If a feature teaches well but feels like a classroom, redesign the wrapper, not the lesson.

Practical consequences, already visible in the codebase and to be preserved:

- Theory lives in the world (wall maps, books, notes, signs — `STUDY_BOARDS`), not in tutorial popups.
- Practice is diegetic (a fountain that ripples syllables, a creek sign that quizzes batchim before you cross — `DRILLS` attached to world objects).
- Exams are gates with fiction around them (the blackboard check, the City Hall badge stations), not score screens.
- NPCs speak Korean aloud first (TTS) and only show text/translation when the player asks (Space to reveal, hold `T` to translate). The world is Korean; English is a tool the player chooses to reach for.

### 2.2 The Three-Station Loop

Every learning unit in the game follows the same loop the player already knows from Town 1:

```
THEORY  → an object or NPC teaches (study board, book, conversation)
PRACTICE → a repeatable, low-stakes drill station (fountain, desk, stall)
EXAM    → a one-time gate that unlocks the next unit (blackboard, badge station)
```

Theory unlocks practice; passing practice unlocks the exam; passing the exam advances the quest and opens the next unit. Physical movement through the world stays free — we gate *learning levels*, never exploration of already-reached areas.

### 2.3 Recognition Before Production

The game is recognition-first in early chapters (choose, match, sort, find) and gradually shifts toward production (ordering steps to build sentences, filling particles, typed Hangul in late chapters). A player should never be asked to produce a form they have not first recognized correctly many times in different disguises.

Production ladder across the game:

1. Choose the correct option (Ch. 1–2, current state).
2. Order chunks into a sentence (Ch. 3+, word-order builder).
3. Fill the blank from a closed set (particles, conjugations) (Ch. 4+).
4. Compose answers from a word bank in conversations (Ch. 6+).
5. Typed Hangul input for known words (Ch. 8+, optional mode).

### 2.4 No Flashcard Feeling

Banned: bare vocabulary lists to memorize, "lesson complete" screens, streaks/daily-goal nags, abstract grammar terminology before the pattern is felt. The Hangul Dictionary and Word Dictionary exist as *reference* (a Pokédex you fill by playing), never as the activity itself.

Allowed and encouraged: spaced repetition hidden inside the world — review drills select the player's weakest items first (`selectHangulPracticeItems` already does this), old vocabulary reappears in new towns' dialogue, festivals and side quests recycle earlier chapters' grammar in harder contexts.

### 2.5 Korean Is the World, Not the Subject

Signs are in Hangul. Shops have Korean names. NPCs introduce themselves in Korean. Money is won. Food is Korean food. Town names encode their curriculum (이름시 "Name City" teaches identity sentences). Culture is content: jesa, chuseok, noraebang, jjimjilbang, hanok, markets — each is a quest setting that demands its vocabulary.

### 2.6 The Quality Bar (quality before quantity)

New regions are not built until what exists meets this bar:

1. **No two drill runs feel identical.** Generated drills mix question directions (glyph→sound *and* sound→glyph; price→reading *and* reading→price; counting phrases), select weakness-first, and shuffle choices. Static drills draw random subsets where they have spare steps.
2. **The player always knows where to go.** Every quest step carries a `whereKey` (a place name) shown in the info panel, the journal hint, and spoken by guide NPCs (`chapterGuideLines` points to the next objective and its location).
3. **NPCs don't repeat themselves forever.** Ambient NPCs have multiple dialogue pools chosen at random (`conversationPools`); quest NPCs use state-aware resolvers so their words always match what the player should do next.
4. **Every interaction answers "why am I here?"** Buildings keep their archetype role; flavor objects still teach (a receipt teaches numbers; a map teaches place names).

## 3. The Player Fantasy

You are a traveler who lands on **한국도 (Hanguk-do)**, a fictional island province of Korea, with a one-way ticket and almost no Korean. The island has a tradition: travelers who master what each town teaches earn that town's **badge** (배지). Eight badges grant entry to the Seoul-like capital and its final challenge — living an entire day in Korean.

The rival: a fellow traveler studying the same route (the Rival Guesthouse in Town 1 already seeds this). The rival appears one step ahead in each chapter, providing pacing, humor, and review duels.

The mentor: 선생님 Seo (Town 1's teacher) sends letters as you travel — each letter is a reading exercise that grows with your level.

## 4. Game Structure (Pokémon-Shaped, Not Pokémon)

| Pokémon Red | Korea Adventure |
| --- | --- |
| Pallet Town | 하늘 마을 (Haneul Town) — Hangul basics |
| Routes | Trails — each is a "grammar corridor" drilling one pattern set through events |
| Gyms + badges | Town exams + badges (Reading Badge, First Words Badge, Number Badge…) |
| Pokédex | Hangul Dictionary + Word Dictionary + Grammar Pattern Log |
| Catching Pokémon | Collecting words/patterns by encountering and mastering them |
| Trainer battles | Conversation challenges and review duels with the rival |
| Elite Four / League | The Capital's **언어 연맹 (Language League)**: present eight badges, then the "Day in Korean" gauntlet |
| HMs opening areas | Language skills opening areas (you can't order at the restaurant district until you can count; the ferry needs you to read the timetable) |
| Post-game areas | The **West Region** (ferry from Family Village): badge-free culture-depth regions, led by the 조선 민속 마을 Joseon Folk Village — see `WORLD_DESIGN.md` |

Twelve chapters (towns/regions), eight badges, ~60–100 hours of core content, 100+ with optional systems. Full layout in `WORLD_DESIGN.md`; full curriculum in `CURRICULUM_MAP.md`.

## 5. Core Systems

### 5.1 Existing (keep and extend)

| System | Where | Status |
| --- | --- | --- |
| Tile/scene engine, interiors, route triggers | `src/core/loop.js`, `src/world/helpers.js`, `src/world/*.js` | Solid. Extend with registered scene modules only. |
| Trilingual text (EN/KO/NL), Korean-first dialogue | `TEXT`, `t()`, hold-`T` translation | Contract: every visible key exists in all three languages. |
| TTS with per-NPC stable voices | `tts.js` | Solid. Korean speech rate 0.92. |
| Drill engine (multiple choice, pass thresholds, completion flags) | `DRILLS`, `startDrill`, `completeDrillRun` | Extend with new step types (order, fill-blank). |
| Generated drills with weakness-first item selection | `selectHangulPracticeItems`, `buildDrillRun` | This is the seed of the SRS — generalize to words. |
| External drill packs | `data/drills/*.js`, `mergeExternalDrillPacks` | All new chapter content ships as packs. |
| Study boards (theory UI) | `STUDY_BOARDS`, `drawStudyBoard` | Extend to support example sentences. |
| Progress flags + quest steps + panel readout | `progress`, `TOWN1_QUESTS`, `refreshQuestLevels` | Extend per chapter. |
| Hangul Dictionary with mastery states | `progress.dictionary`, dictionary menu | Model for the Word Dictionary. |

### 5.2 To Build (the engine of the long game)

| System | Purpose | Design |
| --- | --- | --- |
| **Save system** | Nothing matters without persistence. | `localStorage` autosave: settings, flags, quest levels, dictionaries, badges, player scene/position. Versioned payload, silent load on boot, reset option in settings. |
| **Word Dictionary** | The vocabulary Pokédex. | Same mastery model as Hangul items (seen → learning → mastered via attempts/streaks), categories by topic (food, family, numbers…), fed by drills and dialogue encounters. |
| **Badge system** | Chapter completion, visible pride, gates. | Badge per chapter, awarded by final exam flag, displayed in menu; route guards check badges. |
| **Quest journal** | Players need to see the path. | Menu screen listing each chapter's quests with theory/practice/exam state (data already exists in `TOWN1_QUESTS`-style lists). |
| **Sentence builder drill type** | The bridge from recognition to production. | New step type: chunks displayed shuffled, player orders them; reuses drill UI with multi-select cursor. |
| **Conversation challenges** | Apply grammar socially. | Scripted branching dialogues where the player picks the correct Korean response; wrong picks get gentle in-fiction correction. |
| **Shop/money/inventory** | Numbers, counters, and transactions need real stakes. | Won earned from quests/exams; shops sell items (snacks, tickets, gifts) used in later quests; buying *is* the counting exam. |
| **Review echoes (SRS)** | 100-hour retention. | Each town's practice stations include a "review" mode pulling the player's weakest items from *all previous chapters*; mentor letters and rival duels are scheduled review in disguise. |
| **Grammar Pattern Log** | Reference for learned patterns. | Auto-filled card per pattern (e.g., `-(으)ㄹ 수 있어요`) with the examples the player actually met. |

### 5.3 Technical Principles

- **No build step, ever.** Open `index.html` and play. New content = new `data/drills/*.js` pack + registered scene module.
- **Data over code.** Chapters ship as drill packs (text + drills), scene builders, quest lists, and word lists. The engine stays small.
- **`node --check <changed-file.js>` + `node tools/smoke-test.js`** after every edit; the game must boot with zero console errors.
- **Every visible string** has `TEXT.en`, `TEXT.ko`, `TEXT.nl` entries.
- **Never break a save**: additive flags only; save payload versioned with migration.
- **Mobile-readable** UI (current font-fitting helpers stay mandatory).

## 6. Long-Term Engagement (100+ Hours)

1. **The badge journey** (~60h): 12 chapters × (theory + practice + exams + quests).
2. **Completion collections**: fill the Word Dictionary (thousands of entries), master every Hangul item, log every grammar pattern — visible percentages per category.
3. **Relationship arcs**: recurring NPCs (rival, mentor, the lost child from Town 2, shop owners) with multi-chapter side stories that unlock only when you can understand them.
4. **Festivals** (seasonal set pieces): Chuseok in the Family Village, the Lantern Festival at the lake — limited-area quests recycling all prior grammar.
5. **Post-game**: the Capital's daily-life simulator (random daily errands generated from the full curriculum), hard-mode conversation replays (no `T` translation), and a "Korean-only" new game+ where English UI labels switch off.
6. **Mastery decay & polish loops**: review stations always offer something — the weakest-first selector guarantees old weak items resurface.

## 7. What Done Looks Like (1.0)

- 12 chapters playable start to finish; 8 badges; capital finale.
- ~3,000-word dictionary, ~120 grammar patterns logged, full Hangul coverage including sound-change rules.
- Save/continue seamless; quest journal; badges; shops and money; sentence-builder and conversation drills; review echoes everywhere.
- A motivated player with zero Korean reaches A2 listening/reading comprehension and survival speaking ability, measured by the can-do statements in `CURRICULUM_MAP.md`.

## 8. Non-Goals

- Multiplayer, accounts, servers — never. This game is a local file.
- Romanization as a crutch — romanization appears only in Chapter 1 letter names and disappears permanently after Town 1.
- Speech recognition — TTS output yes; grading the player's microphone audio is out of scope for 1.0.
- Procedural story — the story is authored; only drills/review are procedurally assembled.
