# WS-ART — procedural rendering upgrades (R1–R6)

**Owns:** `src/render/*.js`. Everything is canvas-procedural (no image assets — keeps zero-install). Each task lists the draw-function contract content/UI streams consume. Palette discipline: extend `COLORS` in constants via ENGINE request rows only; prefer local consts.

## R1 — Tile set expansion (chapter terrain needs)

New tile types + drawers in `tiles.js` (+ SOLID_TILES rows via ENGINE request when solid):

| Tile | For | Solid | Look |
| --- | --- | --- | --- |
| `rail` | CH7, trails 6 | no | parallel steel lines + ties on gravel |
| `platform` | CH7 stations | no | stone with yellow safety stripe |
| `clockPlaza` | CH4 | no | path variant with inlay circle pattern |
| `orchard` | trail4 | no | grass + fallen fruit dots |
| `hanokWallTile`/`gateTile` | CH5, west | yes | dark timber + white plaster band |
| `marketCanopy` | CH3 polish, CH6 | yes | striped awning top tile |
| `lanternPath` | CH10 | no | path + warm dot glows |
| `snow`/`ice` | CH10 winter lookout | no/`ice` slides? no (keep simple) | white sparkle / pale blue sheen |
| `hospitalFloor` | CH9 interiors | no | pale mint sheen lines |
| `tarmac` | CH11 | no | dark asphalt + guide lines |
| `redCarpet` | League | no | deep red with gold edge |

- [ ] R1.1–R1.11 one checkbox per tile (drawer + smoke-boot render of a test scene strip — QA provides harness).

## R2 — Building & roof styles

`drawBuilding` gains style variants via `building.style`:
- [ ] R2.1 `hanok` (curved dark roof ridge, white walls, wooden pillars), `clocktower` (tall narrow + clock face circle showing fixed time param), `station` (wide arch + clock), `glass` (airport/campus modern: big windows grid), `palaceGate` (capital landmark: two-tier roof).
- [ ] R2.2 Door variants: sliding hanok door, glass double door.
- [ ] R2.3 Signboards: optional `building.signTextKo` painted on facade (1–4 Hangul glyphs) — towns get real Korean signage everywhere.

## R3 — Character variety & portraits

- [ ] R3.1 NPC sprite params: `hair` (none/short/bun/long/cap/grandma-perm), `skin` tone, `bottom` color, `age` (child/adult/elder posture) — deterministic from voiceId hash when unspecified, explicit for cast characters.
- [ ] R3.2 Named-cast looks: rival (spiky hair + blue jacket), Seo (bun + cardigan), leaders per chapter docs §Leader.
- [ ] R3.3 `drawPortrait(ctx, x, y, size, look)` — face close-up from same params (UI U3 consumes).
- [ ] R3.4 Player customization (intro picks 1 of 4 palettes) — save field via ENGINE row.

## R4 — World life & feedback

- [ ] R4.1 Emote bubbles over NPCs: `npc.emote = "!"|"?"|"♥"|"…"` drawn glyphs; quest NPCs with available progress show "!" (quests.js exposes per-NPC hint — ENGINE row for the lookup hook).
- [ ] R4.2 Idle animations: water shimmer (exists?) + flower sway + market canopy flap (frame from `now`).
- [ ] R4.3 Walk dust puffs; door-enter fade circle transition (loop.js hook request).
- [ ] R4.4 NPC schedules-lite: optional `npc.spots = [{x,y},...]` patrol between points (engine move logic exists — render unaffected; this row is actually ENGINE — file as request, keep here for tracking).

## R5 — Weather, seasons, time-of-day tints

- [ ] R5.1 Overlay system `KA.render.setWeather("rain"|"snow"|"leaves"|"none")` — particle streaks/flakes + slight tint; scenes declare default (`scene.weather`), festivals override (E11).
- [ ] R5.2 Season palette for Lantern Lake lookout (4 sub-areas: spring petals / summer deep green / autumn oranges / winter snow) — tile-draw color shift table by `scene.season`.
- [ ] R5.3 Evening tint for Lantern Festival + Capital night district (simple multiply overlay).

## R6 — Title backdrop & league pageantry

- [ ] R6.1 `drawTitleBackdrop(t)` animated: sea waves bottom, island silhouette, drifting clouds, occasional 한글 letters floating (subliminal alphabet!).
- [ ] R6.2 League hall set pieces: banner columns, badge pedestal row drawer showing the 8 earned badges, confetti burst on victory (reduced-flash respects U12 setting).

## Render performance budget
- Full-screen draw ≤ 4ms on a 2020 laptop at 1080p: no per-frame `measureText` in hot rows beyond current usage; cache gradients; particles ≤ 120 alive. QA owns the measurement harness (15-WS-QA §perf).
