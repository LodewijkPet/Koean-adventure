# Content Pipeline — the 12 production steps every chapter follows

Each CONTENT-CHx stream executes these steps against its chapter spec (21–30). File set you own: `src/world/<slug>.js` (+trail file), `data/drills/<slug>.js`, `data/story/<slug>-story.js`. Index.html: append your lines at anchors. Tick the per-step boxes in YOUR chapter doc, not here.

## P-steps

**P1 Curriculum extract.** Copy your chapter's grammar+vocab allocation from `CURRICULUM_MAP.md` into the doc's Allocation table; list allowed word categories (Q1.5 lock); define review-echo pool (which earlier categories your review station pulls).

**P2 Word list.** Author the word table (target counts per spec; id/hangul/category/en/nl). Register in pack. Words used by drills/NPC lines must be in the list (or earlier chapters').

**P3 Map layout.** Translate the ASCII sketch into the scene factory: terrain → boundaries → roads to every door → landmarks. Trail first if the chapter has one. Run reachability (Q1.2) mentally: every door/sign reachable.

**P4 Buildings & interiors.** Outdoor buildings table → `createInteriorScene` per row; furniture per interior spec; exits verified.

**P5 NPC roster.** Place NPCs per table (unique voiceIds, pools ≥2 for ambient, resolvers for quest/leader/guide). Greeter sets `<slug>.arrived`; plaza-guide uses `chapterGuideLines`.

**P6 Study boards & theory.** Boards per spec (glyph/name entries or nameKeys); progressFlagOnStudyBoard wired; STUDY_BOARD_WORD_ITEMS rows for word-marking.

**P7 Drills.** Static drills in pack (more steps than stepCount where repeatable; wordIds on steps); generated drills registered in world file using `KA.drills.questions`; exam variants with completionFlags + passCorrectCount; review-echo station. Respect stand-in matrix for missing E-features (mark `TODO(E#)`).

**P8 Quests & flags.** Flags table → quest list (every step: flag, objectiveKey, whereKey) → `KA.quests.registerChapter`. Badge via exam drill completionFlags + `KA.badges.register`. Gate next trail with badge requiredFlags + locked line.

**P9 Minigame(s).** Implement the chapter's signature minigame per spec (engine feature when listed, else stand-in composition of drill steps/resolvers).

**P10 Story hooks.** Insert narrative scenes from `14-WS-NARRATIVE` handoff rows (rival spot, letter trigger, arc cameos): coords + trigger wiring; the script text lives in story packs.

**P11 Music & polish.** musicKey per scene (registered fallback ok); area banner reads well; emotes on quest NPCs (R4 when available); decoration pass (trees/flowers/signboards) — every flavor object teaches.

**P12 Verify & close.** Smoke green; browser playtest per Q2 template + chapter Acceptance beats; tick all boxes; STATUS row → done + merge-log line; flip doc header to SHIPPED with deviations noted; hand Upgrade-pass rows for pending TODO(E#).

## Standard chapter content budget (tune per spec)

| Asset | Target |
| --- | --- |
| Outdoor scenes | 1 town (44–48 × 36–40) + 1 trail (34 × 54) |
| Interiors | 4–6 |
| NPCs | 16–22 (≥8 with pools, 3–5 resolvers, 1 guide, 1 leader) |
| Study boards | 2–4 |
| Drills | 8–12 (≥3 generated, 2 exams, 1 review echo, 1 signature minigame) |
| Quests | 8–12 (~30 steps, all whereKeyed) |
| Words | 110–150 new |
| Sentences for E1 builder | 10+ templates |
| Trilingual keys | ~400–600 |

## Per-chapter Definition of Done

1. All P-steps ticked; budget met or deviation noted.
2. Badge earnable; gate to next trail opens; previous areas unaffected (regression beats in playtest).
3. Quality bar §02-CONVENTIONS.4 holds on every station.
4. Curriculum: every allocated pattern has theory+practice+exam coverage; Q1.5 leakage clean.
5. Save from before the chapter loads and can complete it.
