# STATUS — live claim board

Rules: edit ONLY your stream's row. `State` ∈ free | claimed | blocked | done. Keep Notes short; long notes go in your stream doc's hand-off section. One agent per stream.

| Stream | Doc | State | Agent | Started | Progress / Notes |
| --- | --- | --- | --- | --- | --- |
| FOUNDATION (P0) | 03 | done | Codex | 2026-06-11 | P0 complete; smoke green; `src/game.js` removed |
| ENGINE | 10 | free | - | - | E1.1-E1.4 done; E1.5 content retrofit handoff pending |
| UI/UX | 11 | free | - | - | E1 order-step plain renderer landed; U polish still open |
| AUDIO | 12 | free | - | - | Ready post-P0 |
| ART | 13 | free | - | - | Ready post-P0 |
| NARRATIVE | 14 | free | - | - | Ready post-P0 |
| QA | 15 | free | — | — | Test backlog writable anytime |
| CONTENT-CH4 | 21 | free | - | - | Ready post-P0 |
| CONTENT-CH5 | 22 | free | - | - | Ready post-P0 |
| CONTENT-CH6 | 23 | free | - | - | Ready post-P0 |
| CONTENT-CH7 | 24 | free | - | - | Ready post-P0 |
| CONTENT-CH8 | 25 | free | - | - | Ready post-P0 |
| CONTENT-CH9 | 26 | free | - | - | Ready post-P0 |
| CONTENT-CH10 | 27 | free | — | — | P4 |
| CONTENT-CH11 | 28 | free | — | — | P4 |
| CONTENT-CH12+LEAGUE | 29 | free | — | — | Hard dep: CH4–CH9 merged, E3+E5, N5 |
| CONTENT-WEST | 30 | free | — | — | Post-1.0 |

## Cross-stream requests / TODO markers

| From | To | Request | Resolved |
| --- | --- | --- | --- |
| ENGINE | CONTENT | E1.5: retrofit one order-builder drill into shipped Town 1, Town 2, and Town 3 content using `docs/guides/create-order-drill.md` | No |
| — | — | — | — |

## Merge log (latest first)

| Date | Stream | What landed |
| --- | --- | --- |
| 2026-06-11 | ENGINE | E1.1-E1.4 order drill runtime, sentence template registry, plain renderer, guide, and smoke coverage |
| 2026-06-11 | FOUNDATION | P0 complete: split core/render/ui/world modules, registered scenes, replaced `src/game.js` with `src/core/loop.js`, added smoke registry checks |
| 2026-06-11 | FOUNDATION | P0.11-P0.13 world scene split, loop entrypoint, and smoke API/registration assertions |
| 2026-06-11 | FOUNDATION | P0.1 smoke-test now discovers script load order from `index.html` |
| — | — | Plan created; no plan-tracked merges yet |
