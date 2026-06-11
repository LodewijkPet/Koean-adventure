# WS-ENGINE — feature backlog E1–E14

**Owns:** `src/core/*.js` + the engine section of `tools/smoke-test.js`. **Requires:** Phase 0 done. Features are independent of each other unless noted; do them in numbered order when possible (consumers are phased that way). Every feature ends with: smoke-test additions, `docs/guides` update if it adds an authoring pattern, STATUS merge-log line.

---

## E1 — Sentence-builder drill steps (production ladder step 2)

The bridge from recognition to production: the player **orders chunks** into a sentence.

- Data contract (new step `kind: "order"`):
  ```js
  { kind: "order", promptKey, chunks: ["저는", "물을", "마셔요"],   // correct order; engine shuffles
    correctKey, incorrectKey, wordIds?, hangulItemIds? }
  ```
- Engine: in `drills.js`, branch on `step.kind`. Order-step state: `available[]`, `placed[]`, cursor. Input: ←/→ move cursor over available chunks, Space picks → appends to placed; cursor over placed allows Space to return a chunk; Enter submits when all placed. Escape cancels drill as today.
- UI (coordinate with UI/UX U6, but engine ships a functional plain version): chunks as boxes in two rows (placed row on top), reuse `drawUiBox` + fitted text.
- Scoring: exact order = correct; on wrong, show correct order in feedback line (params `{answer: chunks.join(" ")}`).
- Generated builder: `KA.drills.questions.buildOrderStepFromSentence({chunks, wordIds})`; plus a generator that pulls taught sentence templates per chapter (template registry `KA.drills.sentences.register(chapterId, [{chunks, wordIds, teaches}])`).
- Steps:
  - [x] E1.1 step-kind dispatch in run/answer/input/draw paths (default kind "choice" keeps today's behavior).
  - [x] E1.2 order-step input + state machine + plain rendering.
  - [x] E1.3 sentence template registry + generator + weakness hook (templates carry wordIds).
  - [x] E1.4 smoke test: build run with an order step, simulate correct + incorrect submission paths.
  - [ ] E1.5 retrofit ONE builder drill into each shipped chapter (town1 chunk sentences, town2 SOV, town3 orders: "사과 두 개 주세요") — these live in world files; do via TODO(E1) handoff rows in STATUS, content owners apply.

## E2 — Conversation challenges (dialog-embedded choices)

NPC asks in Korean; the player answers by choosing among **Korean-only** replies inside the dialog box.

- Data: `KA.story.registerConversation({ id, npcVoice, turns: [{say, choices: [{ko, correct, replyKey}]}], onPass: flags, onFailKey })`. Triggered via NPC `conversationChallengeId` (interactions.js).
- Engine: dialog gets a `choice` mode (render 2–3 Korean options under the spoken line; ↑/↓ + Space). Wrong choice → gentle correction line (`replyKey`), retry same turn (max 2 retries then show answer, continue, mark fail). Pass sets flags; TTS speaks NPC lines, not choices.
- [ ] E2.1 dialog choice-mode state + input + render (engine-plain).
- [ ] E2.2 conversation registry + NPC hook + flag rewards.
- [ ] E2.3 smoke test: scripted conversation completes via correct path and via retry path; keys exist in 3 languages.
- [ ] E2.4 authoring guide `docs/guides/create-a-conversation.md`.

## E3 — Economy: won, inventory, shops

- State: `progress.won` (number), `progress.items` (`{itemId: count}`). Item registry `KA.items.register([{id, nameKey, priceWon, category}])`. Save-schema bump via E14 pattern (additive fields default 0/{} — no version bump needed).
- Rewards: quest/drill completion may carry `rewardWon`, `rewardItems` (drills.js applies on first pass only — store `progress.rewarded` set of drill keys).
- Shop UI: interactable `shopId` opens shop overlay: list (nameKey, price, owned), ↑/↓ select, Space buy (checks won, decrements, increments item), shows "won" balance. **Buying speaks the transaction**: on purchase, TTS the Korean line `"<item> 주세요"` → clerk reply `"<price> 원이에요"` — the shop IS the listening drill.
- Buy-quest support: quest steps can require `{item: id, count}` (quests.js checks inventory in refresh).
- [ ] E3.1 state + item registry + save fields + panel won display (UI row exists? hand UI/UX U5 the hook `KA.economy.summary()`).
- [ ] E3.2 reward plumbing in drills/quests + retrofit badge exams to pay won (amounts in chapter docs).
- [ ] E3.3 shop overlay + input + transaction speech.
- [ ] E3.4 smoke test: earn → buy → inventory → buy-quest step completes; insufficient-funds path.
- [ ] E3.5 CH3 retrofit handoff: grandma's list becomes a real buy-quest (TODO(E3) row).

## E4 — Title screen, intro engine & cutscenes

- Boot flow: `title` UI state before world starts: logo (코리아 어드벤처 / Korea Adventure), menu New Game / Continue (only if save) / Settings / Erase. New Game → intro cutscene → onboarding flags set.
- Cutscene mini-engine: `KA.story.register({id, steps})` where steps are `{bg: "ferry"|sceneId, lines: [...spoken lines with voice], pan?: {fromX..}, give?: flags}`; player advances with Space; skippable (hold Escape) after first completion flag.
- Intro content comes from NARRATIVE N1 (script) — engine ships with placeholder two-line script.
- Name entry: reuse E9 keyboard when available; until then player is `여행자` (Traveler) — name stored in save, used via `{player}` param in TEXT.
- [ ] E4.1 title state machine + render hooks (visual polish belongs to UI/UX U1) + Continue wiring to existing loadSave.
- [ ] E4.2 cutscene engine + skip + flag rewards; `story.intro` placeholder.
- [ ] E4.3 boot: first run → title → intro → spawn guesthouse; subsequent → title → Continue.
- [ ] E4.4 smoke test: simulated boot paths (fresh vs. saved), story registry keys in 3 languages.

## E5 — Rival duel system

Quiz race vs. the rival: alternating questions from BOTH players' weakest items (scheduled SRS in disguise).

- Flow: duel = special drill run (`kind:"duel"` wrapper): N rounds; each round one question to player (normal step) while rival "answers" with chapter-scaled accuracy (e.g. 70%+chapter*2%); score panel; win threshold; rewards (won + story flag). Rival's wrong answers show his answer + correction → extra teaching.
- Data: `KA.duels.register({id, chapterId, rounds, rivalAccuracy, pool: categories/hangul sets, rewardWon, flag})`. Trigger via NPC resolver.
- [ ] E5.1 duel wrapper state + scoring + result screen (plain).
- [ ] E5.2 registry + NPC hook + rewards/flags.
- [ ] E5.3 smoke test: duel win and lose paths; lose allows retry.
- [ ] E5.4 Handoff rows: one duel per badge town (specs in chapter docs §Rival).

## E6 — Mentor letters (scheduled review reading)

- On badge earn, queue a letter from Teacher Seo: appears at next guesthouse bed interaction ("편지가 왔어요!"). Letter = reading overlay (study-board style, multi-page) + 3-question comprehension drill from letter content; words tracked.
- Data: `KA.letters.register({id, afterFlag, pages: [textKeys], drillKey})`. Content from NARRATIVE N4.
- [ ] E6.1 queue + bed-interaction hook + read overlay (reuse study board with pages).
- [ ] E6.2 registry + letter-1 placeholder + smoke test (queue → read → drill → flag).

## E7 — Order-taking shift minigame (restaurant core)

- Loop: customer speaks order (TTS, 1–3 items with counts, later negations); player picks matching order ticket from 3; correct serves, builds combo; shift = 6–10 customers, pass threshold; pays won. Difficulty params per use (items pool, maxItems, modifiers).
- Data: `KA.shifts.register({id, menuWordIds, customers, maxItems, modifiers?, passCount, rewardWon, flag})` — generated tickets, infinite variety.
- [ ] E7.1 generator (order sentence builder from menu words + counters; ticket distractors differ by item OR count).
- [ ] E7.2 shift state/UI plain + results + rewards.
- [ ] E7.3 smoke test: generated shifts valid; pass/fail flags.

## E8 — Rail fast travel

- After CH7 badge: station boards open travel UI: destination list (only badge-visited towns), each shows departure "time" — player must pick the row matching a spoken/written constraint ("다음 기차는 두 시예요") → tiny comprehension gate, then teleport (changeScene to target station/gate)。
- [ ] E8.1 travel registry (stations per town) + UI + comprehension gate question generator (reuses time words once CH4 ships; pre-CH4 uses prices/platform numbers).
- [ ] E8.2 smoke test: travel between two registered stations; gate wrong-answer keeps you.

## E9 — Typed-Hangul input (production ladder step 5) + name entry

- On-screen keyboard grid (2-bul layout simplified: consonants row(s), vowels row(s)); arrows+Space pick jamo; engine composes syllables via existing composition math (extend for final consonants); Backspace = remove jamo; Enter submit. Also usable with physical keyboard mapping later (U11).
- Drill step `kind:"type"`: prompt shows meaning/audio; player types the word; compare to `answerHangul`.
- Name entry uses same component (Latin fallback grid for EN/NL names).
- [ ] E9.1 jamo composer (initial/medial/final incl. compound finals) + unit tests in smoke test (compose "한", "값", "있어요" sequence).
- [ ] E9.2 keyboard widget + type-step + drill integration.
- [ ] E9.3 name entry in intro (E4 hook); `{player}` param replacement in `t()`.

## E10 — Grammar Pattern Log

- Auto-collected reference: when a quest/drill with `teachesPatternIds` completes, unlock pattern cards (`KA.patterns.register([{id, titleKo, titleKey, exampleKeys, chapterId}])`). Menu screen lists by chapter with the examples the player actually met. UI screen = U9.
- [ ] E10.1 registry + unlock tracking in progress + save.
- [ ] E10.2 backfill pattern ids for CH1–3 quests (handoff rows to content owners).
- [ ] E10.3 smoke test: pattern unlocks on flag; keys trilingual.

## E11 — Festival/event system

- `KA.festivals.register({id, sceneId, gateFlag, npcs, interactables, bannerKey})`: injected into a scene when gateFlag set (or toggled by menu choice "festival day" — no real-time clock; deterministic and testable). Used by CH5 Chuseok, CH10 Lantern.
- [ ] E11.1 scene-injection mechanism (adds NPCs/objects at boot when active) + banner toast.
- [ ] E11.2 smoke test: with flag → injected content present & keys valid; without → absent.

## E12 — Post-game errand generator (Capital daily life)

- Generates a 3-errand day from mastered content: templates (buy X at Y; ask price of Z; take train to W at time T; order meal M; mail letter) each mapping to existing mechanics; tracked as a generated quest with whereKeys; completion pays won + streak count (no nagging — purely opt-in at the apartment desk).
- [ ] E12.1 template registry + generator (weakness-weighted item picks) + day state in progress.
- [ ] E12.2 smoke test: generate 20 days → all reference valid scenes/items/words.

## E13 — NG+ / hard mode toggles

- Settings (post-credits flags): Korean-only UI (TEXT falls back ko), no-translation mode (hold-T disabled), exam-strict (passCorrectCount = stepCount). Stored in settings; banner on title.
- [ ] E13.1 toggles + guards + title badge; smoke test toggling.

## E14 — Save migrations & versioning discipline

- `SAVE_VERSION` bump ONLY here; `migrations = {1: fn→2, …}` applied in loadSave chain; unknown future version → safe ignore (fresh start with warning line in console only).
- [ ] E14.1 migration framework + test fixtures in smoke test (v1 payload loads after bumps).
- [ ] E14.2 document the rule in 02-CONVENTIONS (link) + guides.

## Engine hand-off ledger

| Feature | Merged on | Consumers notified (STATUS row) |
| --- | --- | --- |
| E1 order drill steps | 2026-06-11 | E1.5 remains for content owners: register templates and retrofit one builder drill per shipped chapter; see `docs/guides/create-order-drill.md` |
| — | — | — |
