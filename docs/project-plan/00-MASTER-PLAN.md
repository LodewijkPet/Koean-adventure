# Korea Adventure — Master Project Plan (to 1.0 and beyond)

This folder is the **executable plan** that turns the current build (Chapters 1–3, two badges) into the complete Pokémon-like Korean-learning RPG described in `docs/design/`. The design docs say *what* and *why*; this folder says *who builds what, in which file, in which order, and how several agents work simultaneously without conflicts*.

## How to use this plan (read this first)

1. Read `01-WORKSTREAMS.md` — pick a free workstream and claim it in `STATUS.md`.
2. Read `02-CONVENTIONS.md` — the non-negotiable rules that keep parallel work conflict-free.
3. Open your workstream document (10–15 for systems, 21–30 for content chapters) and execute its steps top-to-bottom, ticking checkboxes as you complete them.
4. After every change: `node --check` on touched JS + `node tools/smoke-test.js` must end `SMOKE TEST PASSED`.
5. Update `STATUS.md` when you start, hand off, or finish a task block.

**The one hard gate:** until Phase 0 (`03-PHASE-0-FOUNDATION.md`) is complete, only ONE agent may edit `src/`. Phase 0 splits the monolith so that afterwards every stream owns separate files. Content streams may start *before* Phase 0 only on their `data/drills/*.js` pack (text, drills, words) — never on scene code.

## Document map

| Doc | Contents | Stream |
| --- | --- | --- |
| `00-MASTER-PLAN.md` | This file: orientation, phases, definition of done | — |
| `01-WORKSTREAMS.md` | Parallel paths, file-ownership matrix, dependency graph, claim protocol | — |
| `02-CONVENTIONS.md` | Namespaces, append-only rules, quality bar, verification gates | — |
| `03-PHASE-0-FOUNDATION.md` | Engine modularization + pack APIs (the parallelism enabler) | FOUNDATION |
| `10-WS-ENGINE.md` | Engine features E1–E14: drill types, economy, duels, letters, fast travel, intro engine, NG+ | ENGINE |
| `11-WS-UI-UX.md` | Title screen, HUD, map screen, portraits, feedback, mobile, accessibility | UI/UX |
| `12-WS-AUDIO.md` | Track plan per area, jingles, synthesized SFX, TTS ducking, settings | AUDIO |
| `13-WS-ART.md` | Tiles, sprite variety, portraits, weather/seasons, emotes | ART |
| `14-WS-NARRATIVE.md` | Game intro script, rival arc, mentor letters, leaders, League, ending | NARRATIVE |
| `15-WS-QA.md` | Smoke-test backlog, playtest scripts, language QA, performance | QA |
| `20-CONTENT-PIPELINE.md` | The 12-step template every chapter follows + QA checklist | CONTENT |
| `21-CH4-TIME-TOWN.md` | Chapter 4 full spec (time, dates, past tense) | CONTENT-CH4 |
| `22-CH5-FAMILY-VILLAGE.md` | Chapter 5 full spec (family, honorifics, adjectives) | CONTENT-CH5 |
| `23-CH6-TASTETRAIL.md` | Chapter 6 full spec (restaurant, desire, negation) | CONTENT-CH6 |
| `24-CH7-STATION-CITY.md` | Chapter 7 full spec (transport, future, ability) | CONTENT-CH7 |
| `25-CH8-CAMPUS.md` | Chapter 8 full spec (connectors, reasons, comparison) | CONTENT-CH8 |
| `26-CH9-HOSPITAL-COAST.md` | Chapter 9 full spec (health, conditions, give/receive) | CONTENT-CH9 |
| `27-CH10-LANTERN-LAKE.md` | Chapter 10 full spec (relative clauses, hobbies, seasons) | CONTENT-CH10 |
| `28-CH11-AIRPORT.md` | Chapter 11 full spec (plans, formal style, phone) | CONTENT-CH11 |
| `29-CH12-CAPITAL-LEAGUE.md` | Chapter 12 + Language League finale + post-game | CONTENT-CH12 |
| `30-WEST-REGION.md` | Joseon Folk Village + west side region (post-1.0) | CONTENT-WEST |
| `STATUS.md` | Live claim board — who works on what right now | — |

Companion references (do not duplicate, link): `docs/design/MASTER_VISION.md` (rules), `docs/design/CURRICULUM_MAP.md` (grammar/vocab per chapter), `docs/design/WORLD_DESIGN.md` (places), `docs/design/QUEST_SYSTEM.md`, `docs/design/NPC_SYSTEM.md`, `docs/guides/*` (how-to patterns).

## Phases (delivery order)

Each phase is shippable; the game must boot clean and stay save-compatible at every merge.

| Phase | Version | Contents | Parallelism |
| --- | --- | --- | --- |
| **P0 Foundation** | v0.6 | `03-PHASE-0`: split `src/game.js` into modules; scene/chapter pack APIs; smoke-test auto-discovery | 1 agent (blocking) |
| **P1 Open the floodgates** | v0.7 | ENGINE E1–E4 (sentence builder, conversation challenge, economy, intro/title) ∥ CH4 ∥ CH5 ∥ UI U1–U4 ∥ AUDIO A1–A3 ∥ ART R1–R2 ∥ NARRATIVE N1–N2 | up to 8 agents |
| **P2 Middle game** | v0.8 | ENGINE E5–E8 (duels, letters, shifts, fast travel) ∥ CH6 ∥ CH7 ∥ UI U5–U8 ∥ AUDIO A4–A5 ∥ ART R3–R4 ∥ NARRATIVE N3–N4 | up to 8 agents |
| **P3 Late game** | v0.9 | ENGINE E9–E11 (typed Hangul, grammar log, festivals) ∥ CH8 ∥ CH9 ∥ UI U9–U10 ∥ ART R5 ∥ NARRATIVE N5 | up to 7 agents |
| **P4 Finale** | v1.0 | CH10 ∥ CH11 → CH12+League (needs CH4–9 done) ∥ ENGINE E12–E14 (errands, NG+, polish) ∥ QA full pass | 4–5 agents |
| **P5 West** | v1.1+ | `30-WEST-REGION.md` | content agents |

## Definition of Done — 1.0

- All 12 chapters playable start→finish; 8 badges + Language League finale + ending + credits.
- Curriculum: every pattern in `CURRICULUM_MAP.md` §Master Grammar Inventory is taught, practiced, and examined where marked; ≥1,800 core words registered and drillable; can-do statements pass the playtest scripts in `15-WS-QA.md`.
- Title screen → intro cutscene → onboarding → world; save/continue across all content; Erase Save works.
- Quality bar (`MASTER_VISION.md` §2.6) holds everywhere: no identical drill runs, every quest step has a place, every ambient NPC ≥2 pools, every interaction teaches.
- Smoke test green with all feature checks; zero console errors on boot in a real browser; mobile-readable.
- All visible text in EN/KO/NL; Korean-first authoring verified by language QA checklist.

## Ground rules (summary — full text in 02-CONVENTIONS)

1. **Own your files.** Each stream edits only the files listed in its ownership row. The only shared files are `index.html` (append-only script lines at marked anchors) and `STATUS.md` (your own row).
2. **Registries are append-only** via registration APIs (packs register text, drills, words, scenes, quests, badges, music). Never rename shipped ids/flags/keys.
3. **Namespaces prevent collisions**: every id you create is prefixed with your chapter/feature slug.
4. **Verify before you stop**: `node tools/smoke-test.js` green, zero new warnings, checkboxes updated.
5. **Stand-ins over blocking**: if a needed engine feature isn't merged, ship with the documented stand-in (existing drill types) and leave a `TODO(E#)` marker listed in your doc's hand-back section.
