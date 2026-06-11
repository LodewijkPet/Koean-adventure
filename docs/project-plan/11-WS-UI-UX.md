# WS-UI/UX — screens, feedback, accessibility (U1–U12)

**Owns:** `src/ui/*.js`, `src/styles.css`. **Requires:** Phase 0. Engine provides hooks (state, registries); UI never implements game logic. Keep the existing visual language: cream panels (`COLORS.panel`), red accent, `Courier New/Malgun Gothic` font, chunky borders — Pokémon-Gen-1 warmth, readable Hangul first.

Global acceptance for every U-task: desktop (≥1200px) + narrow (≤520px) verified; all new strings trilingual; smoke test green; no per-frame allocations in draw loops (reuse arrays/strings where hot).

## U1 — Title screen & menus visual pass (with E4)
- [ ] Logo lockup: big 코리아 어드벤처 with Latin subtitle, tile-art frame (waves south, mountains north — ask ART for `drawTitleBackdrop` hook), version string bottom-right.
- [ ] Menu: New Game / Continue (grey if no save) / Settings / Erase Save (re-uses two-press arm).
- [ ] Continue shows save summary: chapter, badges, words mastered, play position area name.

## U2 — Area-name banner + quest toasts
- [ ] On scene change: top banner slides in 1.5s with `area.*` name (KO large + primary small).
- [ ] On flag-driven quest advance: toast bottom-left "퀘스트 갱신! <quest title>" (hook: quests.refresh returns change list).
- [ ] On badge: full-screen flash + jingle hook (AUDIO) + badge icon center.

## U3 — Dialog upgrade: name tags & portraits
- [ ] Speaker name tag chip on dialog box (NPC nameKey, or 나/player in conversations).
- [ ] Portrait slot left of dialog: 48×48 procedural face from ART R3 (`drawPortrait(voiceId, jacket)`); graceful absence pre-R3.
- [ ] Korean-first layout: spoken-awaiting state shows a subtle 🔊-style pulse glyph (drawn, not emoji) instead of empty box.

## U4 — Drill overlay 2.0
- [ ] Progress pips (●○○○○) per step; correct streak spark.
- [ ] Answer feedback animation: correct = green border pulse + tick; incorrect = shake + red, then highlight correct choice.
- [ ] Title row shows drill type chip (연습 practice / 시험 exam / 결투 duel) from drill data `examKind`.
- [ ] Results card on completion: score, pass/fail stamp (합격/불합격), reward line (won via E3 hook).

## U5 — HUD/panel restructure
- [ ] Collapse the dev-ish info panel into a compact HUD: area, quest line ("objective — where"), badges icons row, won (E3). Tile/facing rows move behind a debug toggle (settings).
- [ ] Panel auto-hides during dialog/drill; reappears after.

## U6 — Sentence-builder & typing widgets polish (with E1/E9)
- [ ] Chunk boxes: drag-feel via keyboard (selected chunk lifts/shadow), placed row with slot underlines.
- [ ] Hangul keyboard: key grid with current-syllable composition preview cell; jamo keys dim when invalid next input.

## U7 — World map screen (menu: 지도 Map)
- [ ] Hand-drawn-style island map rendered from a data table (towns as nodes on the WORLD_DESIGN layout); visited = colored, current = pulsing marker, badge towns show badge icon when earned; cursor over node shows name + chapter + "next objective here?" star when whereKey scene matches.
- [ ] Data: `KA.mapNodes.register({sceneId, x, y, labelKey, chapter})` — chapters add their node (one line, their own file).

## U8 — Shop & inventory screens (with E3)
- [ ] Shop list: item KO name + price right-aligned, owned count, balance header; buy animation (coin arc).
- [ ] Inventory in menu: categories, item detail line teaches the word (KO + meaning + count).

## U9 — Grammar Pattern Log screen (with E10)
- [ ] Card list grouped by chapter: pattern title KO, dot state (locked/seen/practiced), detail view shows the player-encountered examples; cross-link "practice now" → starts matching review drill if registered.

## U10 — Dictionaries & journal unification
- [ ] Shared list-screen component (the three current screens duplicate layout) — single implementation, three configs; adds search-by-first-jamo filter (ㄱㄴㄷ row) for words.
- [ ] Journal: chapter tabs header with badge icons; completed quests collapse to single lines; "track" star pins a quest to HUD.

## U11 — Input & mobile
- [ ] Touch: on-screen D-pad + A/B buttons (Space/Enter equivalents), shown on touch devices; drag = move dir.
- [ ] Keyboard: Enter alias for Space on confirm everywhere (audit), M opens map, J journal, configurable later.
- [ ] Hold-T translation: add tap-T toggle option (setting) for touch.

## U12 — Accessibility & settings expansion
- [ ] Settings: text size (S/M/L multiplier into fitted-text), music volume, speech rate (0.8–1.1 to TTS), reduced-flash mode (disables shakes/pulses), colorblind-safe accents audit (red/green feedback also uses icons ✓/✗ shapes).
- [ ] Settings persist in save (fields additive).

## UX writing rules (apply to all screens)
- Korean visible everywhere a player looks (screen titles bilingual: 지도 — Map).
- Never block exploration with UI: ESC always exits a screen; no modal stacks deeper than 1.
- Every empty state teaches ("아직 없어요 — Not yet! Visit the Counting House.").
