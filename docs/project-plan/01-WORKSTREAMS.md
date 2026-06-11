# Workstreams — Parallel Paths & File Ownership

This document is the law of parallel work. An agent = one claimed workstream. Two agents never edit the same file (two tiny exceptions below, both append-only).

## 1. The streams

| Stream | Doc | Owns (may create/edit) | Must NEVER edit |
| --- | --- | --- | --- |
| **FOUNDATION** (Phase 0 only) | `03` | everything in `src/`, `index.html`, `tools/smoke-test.js` | `data/drills/*` content text |
| **ENGINE** | `10` | `src/core/*.js`, `tools/smoke-test.js` (engine checks section) | `src/ui/*`, `src/render/*`, `src/world/*`, `data/*` |
| **UI/UX** | `11` | `src/ui/*.js`, `src/styles.css` | `src/core/*`, `src/world/*`, `data/*` |
| **AUDIO** | `12` | `src/core/audio.js` (after E-handoff), `assets/audio/*`, audio section of smoke test | everything else in `src/` |
| **ART** | `13` | `src/render/*.js` | `src/core/*`, `src/ui/*`, `src/world/*` |
| **NARRATIVE** | `14` | `data/story/*.js` (its packs), narrative sections inside chapter packs *only via the chapter owner* | `src/*` |
| **QA** | `15` | `tools/*` (tests, scripts), `docs/project-plan/15-WS-QA.md` artifacts | game source (files bugs instead) |
| **CONTENT-CH4 … CONTENT-WEST** | `21`–`30` | `src/world/<chapter>.js`, `data/drills/<chapter>.js`, `data/story/<chapter>-story.js` | every other chapter's files, `src/core|ui|render` |

Until Phase 0 lands there is no `src/core|ui|render|world` split — therefore **pre-P0 only FOUNDATION touches `src/`**, and content streams may only build their `data/drills/<chapter>.js` pack (text keys, static drills, word lists — all safe, they merge via the pack registry).

## 2. Shared files — the only two, and how to touch them

| File | Rule |
| --- | --- |
| `index.html` | Append-only. Add your `<script>` line under the matching anchor comment (`<!-- CHAPTER PACKS -->`, `<!-- STORY PACKS -->`, `<!-- WORLD SCENES -->`). One line per pack, alphabetical within the anchor. Never reorder existing lines. |
| `STATUS.md` | Edit only your own stream's row. |

If you believe you must edit a file you don't own: stop, write the request in `STATUS.md` Notes column, and either claim the owning stream (if free) or leave a `TODO(<stream>)` marker.

## 3. Dependency graph

```
                      ┌──────────────────────────────────────────────┐
                      │ P0 FOUNDATION (single agent, blocks src/*)   │
                      └──────────────┬───────────────────────────────┘
        ┌───────────┬───────────┬────┴──────┬───────────┬───────────┬──────────┐
        ▼           ▼           ▼           ▼           ▼           ▼          ▼
     ENGINE       UI/UX       ART        AUDIO      NARRATIVE   CONTENT-CH4  CONTENT-CH5
     E1..E14      U1..U12    R1..R6     A1..A6      N1..N6      (full)       (full)
        │                                              │
        │  feature → consumer (stand-ins allowed):     │
        │  E1 sentence-builder ─→ CH4+ exams           │
        │  E2 conversation     ─→ CH5+ dialog quests   │
        │  E3 economy/shops    ─→ CH6 restaurant, CH3 retrofit
        │  E4 intro engine     ─→ NARRATIVE N1 intro
        │  E5 rival duels      ─→ NARRATIVE N3, every badge town
        │  E6 mentor letters   ─→ NARRATIVE N4
        │  E7 shift minigame   ─→ CH6 badge
        │  E8 fast travel      ─→ CH7 badge reward
        │  E9 typed Hangul     ─→ CH8+ production drills, name entry
        │  E10 grammar log     ─→ UI U9 screen
        │  E11 festival system ─→ CH5 Chuseok, CH10 Lantern
        │  E12 errand generator─→ CH12 post-game
        │  E13 NG+/hard mode   ─→ CH12
        │  E14 save migrations ─→ continuous
        ▼
     CONTENT-CH6..CH11 (each independent of the others; only soft deps on E-features above)
        │
        ▼
     CONTENT-CH12 + LEAGUE  (hard dep: CH4–CH9 merged, E3+E5 merged, N5 script)
        │
        ▼
     P5 WEST REGION (independent again)
```

**What can run simultaneously at any moment:** ENGINE, UI/UX, ART, AUDIO, NARRATIVE, QA, and any number of CONTENT chapters — because they own disjoint files. CH12 is the only chapter with hard dependencies.

## 4. Claim protocol

1. Open `STATUS.md`. If the stream row says `free`, write your agent name/date and the task block you start (e.g. "E3 economy, steps 1–6").
2. Work only inside your ownership row. Tick checkboxes in your stream doc as you go.
3. Before stopping: run the verification gate (02-CONVENTIONS §5), update your STATUS row (`done through E3.4`, hand-off notes, any `TODO(stream)` markers you left).
4. A stream is `free` again when its row says so. Never claim two streams at once unless no other agent is active.

## 5. Merge discipline

- Small, complete units: one feature step or one pipeline step per commit; message format `[STREAM] step: summary` (e.g. `[CH4] P6: clocktower drills`).
- Never commit with a red smoke test. Never disable a test to get green — fix or file in `15-WS-QA.md`.
- If you must change a shared contract (a `KA.*` API, a registry shape): that is ENGINE work; coordinate via STATUS notes, bump `SAVE_VERSION` only with a migration (E14).

## 6. Stand-in matrix (don't block on ENGINE)

| You need | Until it exists, use | Marker |
| --- | --- | --- |
| Sentence builder steps (E1) | multiple-choice "choose the correct order" steps | `TODO(E1)` |
| Conversation challenge (E2) | NPC resolver + ordinary drill on adjacent object | `TODO(E2)` |
| Money/shop transactions (E3) | drill that *describes* the purchase (CH3 pattern) | `TODO(E3)` |
| Rival duel (E5) | mixed-review drill titled as duel | `TODO(E5)` |
| Shift/order-taking minigame (E7) | sequence of listening-choice steps | `TODO(E7)` |
| Fast travel (E8) | route triggers as normal walking | `TODO(E8)` |
| Typed Hangul input (E9) | recognition choices | `TODO(E9)` |
| Festival scheduler (E11) | always-on festival area behind a flag | `TODO(E11)` |

When the feature merges, ENGINE announces in STATUS; the chapter owner upgrades the stand-ins (each chapter doc has an "Upgrade pass" section listing exactly which objects to revisit).
