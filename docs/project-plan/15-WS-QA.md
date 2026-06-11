# WS-QA — verification, playtests, language quality (Q1–Q6)

**Owns:** `tools/*`, this doc's artifacts. QA never edits game source: findings become STATUS request rows or checklist failures returned to the owning stream.

## Q1 — Smoke-test hardening (continuous)

Current coverage: boot, key parity, drill integrity, badge flow, save round-trip, route walkability, guide lines, price composer, prompt variety. Backlog:
- [ ] Q1.1 Auto-discover scripts from index.html (shared with P0.1 — whoever first).
- [ ] Q1.2 Reachability: BFS walkable tiles per outdoor scene from entry; assert every interactable/door/route is adjacent to reachable tile (catches walled-off content).
- [ ] Q1.3 NPC placement: no NPC on door/route/exit tile; wander NPCs have ≥2 free neighbors.
- [ ] Q1.4 Quest soundness: every flag set somewhere (drill completionFlags ∪ progressFlagOnTalk ∪ resolver sets ∪ story rewards) — orphan-flag report.
- [ ] Q1.5 Curriculum lock: drills' `wordIds` categories ⊆ chapter's allowed list (table maintained per chapter doc) — leakage report (warning first).
- [ ] Q1.6 Save fuzz: load truncated/corrupt/old-version payloads → must boot fresh, never throw.
- [ ] Q1.7 Per-feature checks land WITH the feature (listed in each E-task) — audit they exist.
- [ ] Q1.8 Performance harness: headless draw-time sampling per scene (stub clock), budget warnings (>4ms logical ops proxy).

## Q2 — Browser playtest scripts (one per chapter, run on merge + phase end)

Template (10 min): boot fresh → intro → chapter path: theory boards → practice → exam → badge → journal/map/dictionaries reflect it → save/reload mid-chapter → resume correct. Each chapter doc §Acceptance lists its specific beats; QA records pass/fail+console here:

| Chapter | Last run | Result | Notes |
| --- | --- | --- | --- |
| CH1–3 | — | — | baseline after P0 |

## Q3 — Language QA checklist (per content merge)

- [ ] KO lines natural + level-appropriate (no untaught grammar; checker table per chapter).
- [ ] Particles correct after batchim (은/는, 이/가, 을/를, 과/와 audit — grep helper `tools/ko-particle-lint.js` to build: flags noun+particle mismatches for known words).
- [ ] EN/NL faithfully translate KO (spot 20%).
- [ ] TTS pronounces names/lines acceptably (listen pass on new NPCs).
- [ ] No romanization leaks; digits ok.

## Q4 — Curriculum verification (phase ends)

Walk `CURRICULUM_MAP.md` inventory: each pattern's "introduced/production" cells point to a live station; can-do statements each have a playtest beat proving them. Output: coverage table commit in this doc.

## Q5 — Release gates

- Phase gate: all streams' phase tasks checked; smoke green; playtests green; zero console errors; save from previous phase loads.
- 1.0 gate additionally: full-run longplay (all 12 chapters, ~6–8h) by two agents with fresh saves, defect list empty of blockers; NG+ boot; erase-save → intro path.

## Q6 — Defect log

| ID | Found | Stream | Severity | Status |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |
