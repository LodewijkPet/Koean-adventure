# Temporary Town 2 NPC And Interactable Interaction Plan

This is a temporary companion plan for `docs/town2-map-layout-plan.md`. It can be deleted once the Town 2 NPCs, interactables, drills, quest flags, dialogue, and badge flow are fully implemented and verified.

## Design Rules

- Keep Town 2 recognition-first. The player chooses, matches, reads, or identifies Korean; they do not need to freely type Korean yet.
- Put most repeatable minigames on signs, counters, tables, boards, displays, and stations. In the current code, an NPC with `drillKey` starts the drill immediately and skips normal dialogue, so NPCs should usually give context while nearby objects start drills.
- Every visible object, NPC name, prompt, choice, correct response, and incorrect response needs text keys in `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.
- Every planned minigame should have a non-crashing fallback conversation if the drill or event controller is not built yet.
- Current simple drill stand-ins can reuse `routeNames`, `objectLabels`, `presenceCheck`, `actionPath`, `sentenceBlocks`, `alphabetBlocks`, `soundFountain`, and `batchimBridge`.
- Future richer interactions can use progress flags, but the physical map should remain valid before flags exist.

## Planned Progress Flags

These are not required for the first layout implementation, but the interaction plan should reserve them.

| Flag | Set by | Purpose |
| --- | --- | --- |
| `town2.arrived` | Gate Greeter or Welcome Sign | Marks that the player has entered Town 2. |
| `town2.mixedReviewPassed` | Central Review Board/Table | Optional review complete. |
| `town2.identityPassed` | Information Center | Name/role registration complete. |
| `town2.lostFoundStarted` | Lost Child or Lost-and-Found Owner | Search event is active. |
| `town2.lostItemFound` | Search Field hidden object | Player found the requested item. |
| `town2.lostFoundPassed` | Lost-and-Found Owner | Presence/absence task complete. |
| `town2.labelsPassed` | Label Museum | Distance/object label task complete. |
| `town2.actionsPassed` | Action Park Board or Coach | Action/SOV task complete. |
| `town2.finalBadgePassed` | City Hall / Blocks Hall | Final Chapter 1 assessment complete. |
| `town2.trail2Unlocked` | Future route gate | Allows route to Trail 2 once Trail 2 exists. |

## Planned Drill And Event Hooks

| Hook | Type | Current stand-in | Main use |
| --- | --- | --- | --- |
| `town2ArrivalCheck` | simple drill or dialogue check | `sentenceBlocks` | First orientation: identify where to go and what the city is about. |
| `town2MixedReview` | reusable drill | `sentenceBlocks` | Mixed recall across reading, chunks, object labels, presence, and actions. |
| `town2IdentityOffice` | reusable drill | `routeNames` | Register names and roles from `저는 X예요/이에요`. |
| `town2LostFound` | reusable drill | `presenceCheck` | Read whether objects are present or missing. |
| `town2SearchField` | stateful event | none | Find a requested item in tall grass or object spots. |
| `town2DistanceLabels` | reusable drill | `objectLabels` | Match `이건/그건/저건` to near/listener/far objects. |
| `town2ActionPark` | reusable drill, later stateful actor matching | `actionPath` | Match actions and SOV chunks to visible NPC actors. |
| `town2FinalBadge` | chained station event | mixed stand-ins | Integrated Chapter 1 final test. |
| `town2Trail2GateCheck` | route gate interaction | none | Explain blocked/future route or check final badge. |

## Outdoor NPCs

### `npc.town2GateGreeter`

- Location: South Gate, `x 24, y 35`.
- Interaction type: spoken orientation dialogue, optional first-arrival check.
- Korean focus:
  - `여기는 이름시예요.`
  - `중앙 광장에 가요.`
  - `이 도시는 이름, 물건, 동작을 연습해요.`
- Minigame plan:
  - No required drill on the NPC.
  - Optional `town2ArrivalCheck` on first interaction only.
  - Sample prompt: `중앙 광장에 가요.` asks where the player should go. Correct answer: Central Plaza.
- Success behavior:
  - Set `town2.arrived`.
  - Point player toward the Central Review Board.
- Fallback:
  - Dialogue only. Do not block movement.

### `npc.town2PlazaGuide`

- Location: Central Plaza, `x 20, y 17`.
- Interaction type: spoken explanation and progression hints.
- Korean focus:
  - `이름이 섞였어요.`
  - `물건이 없어졌어요.`
  - `동작을 봐요.`
- Minigame plan:
  - No direct NPC drill by default.
  - If the player asks what to do next, guide points to the first incomplete district based on future flags.
- Success behavior:
  - None required. This NPC is a navigation helper.
- Fallback:
  - Static dialogue listing recommended order: Information Center, Lost-and-Found, Label Museum, Action Park, City Hall.

### `npc.town2ReviewClerk`

- Location: Central Plaza review table, `x 18, y 22`.
- Interaction type: short spoken setup for the nearby Review Table.
- Korean focus:
  - `연습해요.`
  - `문장을 덩어리로 봐요.`
- Minigame plan:
  - Prefer putting `town2MixedReview` on `object.town2ReviewTable`.
  - NPC tells the player that the table is for optional review.
- Success behavior:
  - If `town2.mixedReviewPassed` is set, congratulates and points to City Hall.
- Fallback:
  - Dialogue only. The review table can use `sentenceBlocks` as temporary stand-in.

### `npc.town2LabelRunner`

- Location: Central/east street, `x 30, y 22`, wandering.
- Interaction type: moving flavor NPC plus optional label chase clue.
- Korean focus:
  - `이건 라벨이에요.`
  - `그건 책이에요?`
  - `저건 가방이에요.`
- Minigame plan:
  - No direct drill unless a later chase mechanic exists.
  - Can give one clue for `town2DistanceLabels`: near object uses `이건`, object near the listener uses `그건`, far object uses `저건`.
- Success behavior:
  - If label task is incomplete, points to Label Museum.
  - If complete, says the labels are fixed.
- Fallback:
  - Spoken hint dialogue only.

### `npc.town2LostChild`

- Location: Search lane, `x 11, y 28`.
- Interaction type: starts the lost item story.
- Korean focus:
  - `가방이 없어요.`
  - `책이 없어요.`
  - `물은 있어요.`
- Minigame plan:
  - First interaction starts `town2.lostFoundStarted`.
  - Player then uses `object.town2SearchBasket` or hidden field spots.
  - Avoid direct `drillKey` on this NPC if the story needs dialogue before the task.
- Success behavior:
  - Before item found: tells player what item is missing.
  - After `town2.lostItemFound`: thanks player and points to Lost-and-Found Owner.
- Fallback:
  - Conversation line plus nearby Search Basket uses `presenceCheck`.

### `npc.town2ActionCoach`

- Location: Action Park, `x 36, y 24`.
- Interaction type: spoken setup and progression hint.
- Korean focus:
  - `책을 읽어요.`
  - `물을 마셔요.`
  - `사과를 먹어요.`
  - `이름을 써요.`
- Minigame plan:
  - Prefer putting `town2ActionPark` on `object.town2ActionParkBoard`.
  - Coach explains that the player should look at the actors before using the board.
- Success behavior:
  - If action task is complete, points to City Hall.
- Fallback:
  - Conversation only; board can use `actionPath`.

### `npc.town2ReaderActor`

- Location: Action Park, `x 37, y 29`.
- Interaction type: inspectable demonstration NPC.
- Korean focus:
  - `저는 책을 읽어요.`
  - `읽어요`
- Minigame plan:
  - No direct drill.
  - In the richer actor-matching version, this NPC is a clickable target for prompts such as `지우는 책을 읽어요. 누구예요?`
- Success behavior:
  - When clicked for the correct prompt, contributes to `town2.actionsPassed`.
- Fallback:
  - Spoken line: `저는 책을 읽어요.`

### `npc.town2WaterActor`

- Location: Action Park, `x 41, y 27`.
- Interaction type: inspectable demonstration NPC.
- Korean focus:
  - `저는 물을 마셔요.`
  - `마셔요`
- Minigame plan:
  - No direct drill.
  - Future actor-matching target for water/drinking prompts.
- Success behavior:
  - Correct target for `물을 마셔요` or `마셔요`.
- Fallback:
  - Spoken line only.

### `npc.town2AppleActor`

- Location: Action Park, `x 35, y 31`.
- Interaction type: inspectable demonstration NPC.
- Korean focus:
  - `저는 사과를 먹어요.`
  - `먹어요`
- Minigame plan:
  - No direct drill.
  - Future actor-matching target for apple/eating prompts.
- Success behavior:
  - Correct target for `사과를 먹어요` or `먹어요`.
- Fallback:
  - Spoken line only.

### `npc.town2WriterActor`

- Location: Action Park, `x 40, y 31`.
- Interaction type: inspectable demonstration NPC.
- Korean focus:
  - `저는 이름을 써요.`
  - `써요`
- Minigame plan:
  - No direct drill.
  - Future actor-matching target for name/writing prompts.
- Success behavior:
  - Correct target for `이름을 써요` or `써요`.
- Fallback:
  - Spoken line only.

### `npc.town2RoadGuard`

- Location: Future Trail 2 gate, `x 40, y 4`.
- Interaction type: spoken gatekeeper and route-state explanation.
- Korean focus:
  - `길이 아직 없어요.`
  - `배지가 있어요?`
  - `시청에 가요.`
- Minigame plan:
  - No normal drill before Trail 2 exists.
  - Future `town2Trail2GateCheck` can ask whether the player has the badge: `첫말배지가 있어요?`
- Success behavior:
  - If final badge and Trail 2 exist, allow route.
  - If not, point to City Hall.
- Fallback:
  - Pending dialogue matching `route.trail2.pending`.

### `npc.town2Resident`

- Location: East Residence street, `x 35, y 8`.
- Interaction type: flavor dialogue, light hint.
- Korean focus:
  - `저는 주민이에요.`
  - `집에 있어요.`
  - `시청은 북쪽에 있어요.`
- Minigame plan:
  - No drill. This NPC keeps the town feeling inhabited without adding required work.
- Success behavior:
  - None.
- Fallback:
  - Static spoken lines.

## City Hall / Blocks Hall NPCs

### `npc.town2CityLeader`

- Location: City Hall final dais.
- Interaction type: final test manager and badge giver.
- Korean focus:
  - Integrated review of all Chapter 1 patterns.
  - `읽어요`, `이름`, `물건`, `있어요`, `없어요`, `동작`.
- Minigame plan:
  - Starts or explains `town2FinalBadge`.
  - If station flags are not complete, sends player to the missing station.
  - If all final stations are complete, awards badge.
- Success behavior:
  - Set `town2.finalBadgePassed`.
  - Later set or allow `town2.trail2Unlocked`.
- Fallback:
  - If no final controller exists, attach `town2FinalBadge` or `sentenceBlocks` to `object.town2BadgePodium`.

### `npc.town2ReadingAttendant`

- Location: City Hall Reading Room.
- Interaction type: explains reading station.
- Korean focus:
  - Hangul reading.
  - Batchim recognition.
  - Words: `집`, `길`, `문`, `물`, `책`, `한국`.
- Minigame plan:
  - Station interactable starts `town2FinalReading`.
  - Current stand-ins: `alphabetBlocks`, `soundFountain`, or `batchimBridge`.
- Success behavior:
  - Set final reading station flag.
- Fallback:
  - Spoken hint about looking for bottom consonants.

### `npc.town2NameAttendant`

- Location: City Hall Name Room.
- Interaction type: explains name/role station.
- Korean focus:
  - `저는 민수예요.`
  - `저는 학생이에요.`
  - `저는 선생님이에요.`
- Minigame plan:
  - Station interactable starts `town2FinalNames`.
  - Current stand-in: `routeNames`.
- Success behavior:
  - Set final name station flag.
- Fallback:
  - Spoken hint: name/role is before `예요/이에요`.

### `npc.town2ObjectAttendant`

- Location: City Hall Object Room.
- Interaction type: explains object/distance station.
- Korean focus:
  - `이건 책이에요.`
  - `그건 물이에요.`
  - `저건 가방이에요.`
- Minigame plan:
  - Station interactable starts `town2FinalObjects`.
  - Current stand-in: `objectLabels`.
- Success behavior:
  - Set final object station flag.
- Fallback:
  - Spoken hint for `이/그/저`.

### `npc.town2SearchAttendant`

- Location: City Hall Search Room.
- Interaction type: explains presence/absence station.
- Korean focus:
  - `책이 있어요.`
  - `가방이 없어요.`
  - `물이 있어요?`
- Minigame plan:
  - Station interactable starts `town2FinalPresence`.
  - Current stand-in: `presenceCheck`.
- Success behavior:
  - Set final search station flag.
- Fallback:
  - Spoken hint that `있어요` means present and `없어요` means missing.

### `npc.town2ActionAttendant`

- Location: City Hall Action Dais.
- Interaction type: explains action station.
- Korean focus:
  - `민수는 책을 읽어요.`
  - `지우는 물을 마셔요.`
  - `하나는 사과를 먹어요.`
- Minigame plan:
  - Station interactable starts `town2FinalActions`.
  - Current stand-in: `actionPath`.
- Success behavior:
  - Set final action station flag.
- Fallback:
  - Spoken hint that the action usually comes at the end.

## Other Interior NPCs

### `npc.town2Librarian`

- Location: Review Library.
- Interaction type: review helper.
- Korean focus:
  - `받침이 있어요?`
  - `이 글자를 읽어요.`
- Minigame plan:
  - Points to shelves and reading desks, not a direct drill.
  - Recommended stand-ins: `alphabetBlocks`, `soundFountain`, `batchimBridge`.
- Success behavior:
  - None required; optional support area.

### `npc.town2InfoClerk`

- Location: Information Center counter.
- Interaction type: identity registration manager.
- Korean focus:
  - `이름이 뭐예요?` only as a fixed recognition phrase.
  - `저는 X예요.`
  - `저는 X이에요.`
- Minigame plan:
  - Counter or form table starts `town2IdentityOffice`.
  - Clerk dialogue explains what to read before using the form.
- Success behavior:
  - Set `town2.identityPassed`.

### `npc.town2ApplicantMinsu`

- Location: Information Center waiting line.
- Interaction type: target NPC for identity task.
- Korean focus:
  - `저는 민수예요.`
  - `저는 학생이에요.`
- Minigame plan:
  - In simple version, dialogue only.
  - In richer version, player matches this NPC to name card `민수` and role card `학생`.
- Success behavior:
  - Correct target in identity registration.

### `npc.town2ApplicantJiu`

- Location: Information Center waiting line.
- Interaction type: target NPC for identity task.
- Korean focus:
  - `저는 지우예요.`
  - `저는 친구예요.`
- Minigame plan:
  - Dialogue only in simple version.
  - Richer version target for `지우` and `친구`.
- Success behavior:
  - Correct target in identity registration.

### `npc.town2ApplicantHana`

- Location: Information Center waiting line.
- Interaction type: target NPC for identity task.
- Korean focus:
  - `저는 하나예요.`
  - `저는 선생님이에요.`
- Minigame plan:
  - Dialogue only in simple version.
  - Richer version target for `하나` and `선생님`.
- Success behavior:
  - Correct target in identity registration.

### `npc.town2LostFoundOwner`

- Location: Lost-and-Found Shop counter.
- Interaction type: presence/absence task owner.
- Korean focus:
  - `책이 있어요.`
  - `가방이 없어요.`
  - `사과가 없어요.`
- Minigame plan:
  - Counter or clipboard starts `town2LostFound`.
  - If the search event exists, owner asks for one missing item and checks `town2.lostItemFound`.
- Success behavior:
  - Set `town2.lostFoundPassed`.
  - Sends player to Label Museum.

### `npc.town2MuseumCurator`

- Location: Label Museum.
- Interaction type: demonstrative/object label guide.
- Korean focus:
  - `이건 책이에요.`
  - `그건 물이에요.`
  - `저건 가방이에요.`
- Minigame plan:
  - Curator explains distances.
  - Museum displays or label tray start `town2DistanceLabels`.
- Success behavior:
  - Set `town2.labelsPassed`.

### `npc.town2MuseumHelper`

- Location: Label Museum near far display.
- Interaction type: optional hint NPC.
- Korean focus:
  - `저건 멀어요.`
  - `그건 가까워요.` as light, optional exposure only.
- Minigame plan:
  - No drill. Use only if the museum needs more life.
- Success behavior:
  - None.

### `npc.town2GuesthouseHost`

- Location: Town Guesthouse.
- Interaction type: rest and hint NPC.
- Korean focus:
  - `쉬어요.`
  - `시청에 가요.`
  - `연습이 필요해요.`
- Minigame plan:
  - No drill. Keep this as a pacing break.
- Success behavior:
  - Optional heal/rest/save flavor if the game later adds those systems.

### `npc.town2EastResidentIndoor`

- Location: East Residence.
- Interaction type: future route flavor.
- Korean focus:
  - `길이 없어요.`
  - `문이 닫혀 있어요.`
  - `나중에 가요.`
- Minigame plan:
  - No drill before Trail 2 exists.
- Success behavior:
  - None.

## Outdoor Interactables

### `object.routeSouth`

- Location: South edge, `x 22..26, y 37`.
- Interaction type: route trigger back to Trail 1.
- Korean focus:
  - Optional route dialogue: `남쪽: 첫길.`
- Minigame plan:
  - No minigame.
- Behavior:
  - Transitions to Trail 1 when stepped on.

### `object.routeTrail2`

- Location: North edge, `x 38..42, y 0`.
- Interaction type: future route trigger.
- Korean focus:
  - `북쪽: 다음 길.`
  - `아직 갈 수 없어요.`
- Minigame plan:
  - No minigame while Trail 2 is missing.
  - Future route gate checks `town2.finalBadgePassed`.
- Behavior:
  - If Trail 2 exists and route is unlocked, transition.
  - Otherwise show `route.trail2.pending`.

### Building Door Interactables

Use generated door interactables from buildings.

| Door key | Interaction | Korean focus | Minigame |
| --- | --- | --- | --- |
| `object.town2CityHall.door` | Enter City Hall | `시청` / `블록홀` | No drill on door. |
| `object.town2ReviewLibrary.door` | Enter Review Library | `도서관` | No drill on door. |
| `object.town2InfoCenter.door` | Enter Information Center | `정보센터` | No drill on door. |
| `object.town2LostFound.door` | Enter Lost-and-Found | `분실물` | No drill on door. |
| `object.town2LabelMuseum.door` | Enter Label Museum | `라벨 박물관` | No drill on door. |
| `object.town2Guesthouse.door` | Enter Guesthouse | `게스트하우스` | No drill on door. |
| `object.town2EastResidence.door` | Enter East Residence | `집` | No drill on door. |

### `object.town2WelcomeSign`

- Location: South Gate, `x 24, y 34`.
- Interaction type: sign dialogue.
- Korean focus:
  - `이름시`
  - `이름`, `물건`, `동작`
- Minigame plan:
  - Optional `town2ArrivalCheck`.
  - Better first implementation: conversation only, so arrival is not blocked.
- Sample dialogue:
  - `이름시: 이름, 물건, 동작을 연습하는 도시.`

### `object.town2CentralReviewBoard`

- Location: Central Plaza, `x 16, y 17`.
- Interaction type: repeatable mixed review board.
- Korean focus:
  - Reading, chunks, identity, object labels, presence, action.
- Minigame plan:
  - Primary hook: `town2MixedReview`.
  - Temporary stand-in: `sentenceBlocks`.
- Sample steps:
  - Choose the greeting: `안녕하세요.`
  - Split `저는 책을 읽어요.`
  - Choose what `없어요` means.
  - Identify action chunk in `물을 마셔요`.
- Success behavior:
  - Set `town2.mixedReviewPassed`.

### `object.town2ReviewTable`

- Location: Central Plaza, `x 18, y 19`, `w 3, h 2`.
- Interaction type: solid grouped object and optional review drill.
- Korean focus:
  - Chunk recognition and earlier route review.
- Minigame plan:
  - Same as `object.town2CentralReviewBoard`.
  - Use this as the repeatable table if the board is only explanatory.
- Success behavior:
  - Set or refresh `town2.mixedReviewPassed`.

### `object.town2DistanceNear`

- Location: Distance Triangle near marker, `x 21, y 22`.
- Interaction type: inspectable object marker.
- Korean focus:
  - `이건`
  - `이건 책이에요.`
- Minigame plan:
  - No standalone drill unless using all three markers as a mini sequence.
  - In richer version, selecting this marker answers prompts containing `이건`.
- Success behavior:
  - Contributes to `town2DistanceLabels`.

### `object.town2DistanceMiddle`

- Location: Distance Triangle middle/listener marker, `x 26, y 18`.
- Interaction type: inspectable object marker.
- Korean focus:
  - `그건`
  - `그건 물이에요.`
- Minigame plan:
  - Richer version uses this as the correct target for `그건`.
- Success behavior:
  - Contributes to `town2DistanceLabels`.

### `object.town2DistanceFar`

- Location: Distance Triangle far marker, `x 31, y 16`.
- Interaction type: inspectable object marker.
- Korean focus:
  - `저건`
  - `저건 가방이에요.`
- Minigame plan:
  - Richer version uses this as the correct target for `저건`.
- Success behavior:
  - Contributes to `town2DistanceLabels`.

### `object.town2ObjectLabelStall`

- Location: Plaza/east street, `x 29, y 19`, `w 3, h 2`.
- Interaction type: solid object label stall.
- Korean focus:
  - `이건/그건/저건 X이에요`
- Minigame plan:
  - Primary hook: `town2DistanceLabels`.
  - Temporary stand-in: `objectLabels`.
- Success behavior:
  - Can set `town2.labelsPassed` if the museum is not implemented yet.

### `object.town2SpeechBench`

- Location: Central Plaza, `x 17, y 23`, `w 3, h 1`.
- Interaction type: optional chunk review.
- Korean focus:
  - `저는 / X예요`
  - `X이 / 없어요`
  - `저는 / X을 / V어요`
- Minigame plan:
  - Temporary or permanent hook: `sentenceBlocks`.
- Success behavior:
  - Optional, no required progression.

### `object.town2SearchBasket`

- Location: Search Field, `x 7, y 31`, `w 3, h 2`.
- Interaction type: quest-start object or presence drill.
- Korean focus:
  - `가방이 없어요.`
  - `책이 있어요.`
  - `사과가 없어요.`
- Minigame plan:
  - Simple version: `presenceCheck`.
  - Richer version: starts `town2SearchField`, tells player which item is missing.
- Success behavior:
  - Set `town2.lostFoundStarted`.

### `object.town2HiddenBookSpot`

- Location: hidden field spot, for example `x 8, y 33`.
- Interaction type: hidden/non-solid item spot.
- Korean focus:
  - `책이 있어요!`
  - `책이 없어요.`
- Minigame plan:
  - No multiple-choice drill.
  - Stateful search interaction: if the requested item is book, this is correct; otherwise gives a presence sentence.
- Success behavior:
  - If correct item, set `town2.lostItemFound`.

### `object.town2HiddenWaterSpot`

- Location: hidden field spot, for example `x 12, y 34`.
- Interaction type: hidden/non-solid item spot.
- Korean focus:
  - `물이 있어요!`
  - `물이 없어요.`
- Minigame plan:
  - Same search-field logic as hidden book spot.
- Success behavior:
  - Correct only if the active requested item is water.

### `object.town2HiddenBagSpot`

- Location: hidden field spot, for example `x 15, y 32`.
- Interaction type: hidden/non-solid item spot.
- Korean focus:
  - `가방이 있어요!`
  - `가방이 없어요.`
- Minigame plan:
  - Same search-field logic as hidden book spot.
- Success behavior:
  - Correct only if the active requested item is bag.

### `object.town2ActionParkBoard`

- Location: Action Park, `x 34, y 24`.
- Interaction type: repeatable action drill board.
- Korean focus:
  - `책을 읽어요`
  - `물을 마셔요`
  - `사과를 먹어요`
  - `이름을 써요`
- Minigame plan:
  - Primary hook: `town2ActionPark`.
  - Temporary stand-in: `actionPath`.
- Success behavior:
  - Set `town2.actionsPassed`.

### `object.town2PracticeStage`

- Location: Action Park, `x 36, y 27`, `w 5, h 3`.
- Interaction type: visual space, optional inspectable stage edge.
- Korean focus:
  - `동작을 봐요.`
- Minigame plan:
  - No direct drill in first pass.
  - Richer version can use stage zones to place actor targets for action matching.
- Success behavior:
  - None by itself.

### `object.town2Trail2GateSign`

- Location: Future Trail 2 gate, `x 40, y 3`.
- Interaction type: route sign and pending route explanation.
- Korean focus:
  - `북쪽: 다음 길.`
  - `첫말배지가 필요해요.`
- Minigame plan:
  - No minigame unless later tied to `town2Trail2GateCheck`.
- Success behavior:
  - If final badge exists, can tell player the next route will open later.

## Review Library Interactables

### `object.town2HangulShelf`

- Interaction type: reading review shelf.
- Korean focus:
  - Syllable blocks and simple words.
- Minigame plan:
  - Hook: `alphabetBlocks`.
- Role:
  - Optional retry station for players who struggle with final reading.

### `object.town2BatchimWall`

- Interaction type: wall poster or board.
- Korean focus:
  - Batchim yes/no recognition.
- Minigame plan:
  - Hook: `batchimBridge`.
- Role:
  - Optional retry station.

### `object.town2ReadingDesk`

- Interaction type: desk drill.
- Korean focus:
  - Read words such as `문`, `물`, `책`, `집`, `길`.
- Minigame plan:
  - Hook: future `town2ReadingReview`, temporary `alphabetBlocks`.

### `object.town2ListeningDesk`

- Interaction type: sound/Hangul matching review.
- Korean focus:
  - Match displayed or spoken syllables to Hangul.
- Minigame plan:
  - Hook: `soundFountain`.
- Note:
  - If no audio asset exists, use text prompt style already used by `soundFountain`.

## Information Center Interactables

### `object.town2RegistrationCounter`

- Interaction type: primary identity task counter.
- Korean focus:
  - `저는 X예요/이에요`
- Minigame plan:
  - Hook: `town2IdentityOffice`.
  - Temporary stand-in: `routeNames`.
- Success behavior:
  - Set `town2.identityPassed`.

### `object.town2NameFormTable`

- Interaction type: form table for matching names and roles.
- Korean focus:
  - Extract name/role before `예요/이에요`.
- Minigame plan:
  - Same hook as Registration Counter.
  - Later richer version can require inspecting applicant NPCs before filling form.

### `object.town2RoleCardRack`

- Interaction type: object rack holding role cards.
- Korean focus:
  - `학생`, `선생님`, `친구`, `주민`.
- Minigame plan:
  - Optional role-card matching station.
- Success behavior:
  - Supports `town2IdentityOffice`.

### `object.town2WaitingLineSign`

- Interaction type: sign.
- Korean focus:
  - `줄`
  - `이름`
  - `역할`
- Minigame plan:
  - No drill. Explain the room.

## Lost-And-Found Interactables

### `object.town2LostFoundCounter`

- Interaction type: task counter.
- Korean focus:
  - `있어요/없어요`
- Minigame plan:
  - Hook: `town2LostFound`.
  - Temporary stand-in: `presenceCheck`.
- Success behavior:
  - Set `town2.lostFoundPassed` after task or return item.

### `object.town2ObjectShelfBook`

- Interaction type: inspectable shelf slot.
- Korean focus:
  - `책이 있어요.`
  - `책이 없어요.`
- Minigame plan:
  - No separate drill; shelf state supports the presence task.

### `object.town2ObjectShelfWater`

- Interaction type: inspectable shelf slot.
- Korean focus:
  - `물이 있어요.`
  - `물이 없어요.`
- Minigame plan:
  - No separate drill; shelf state supports the presence task.

### `object.town2ObjectShelfBag`

- Interaction type: inspectable shelf slot.
- Korean focus:
  - `가방이 있어요.`
  - `가방이 없어요.`
- Minigame plan:
  - No separate drill; shelf state supports the presence task.

### `object.town2ObjectShelfApple`

- Interaction type: inspectable shelf slot.
- Korean focus:
  - `사과가 있어요.`
  - `사과가 없어요.`
- Minigame plan:
  - No separate drill; shelf state supports the presence task.

### `object.town2LostFoundClipboard`

- Interaction type: written task board.
- Korean focus:
  - Read a missing-item sentence and choose what to find.
- Minigame plan:
  - Hook: `town2LostFound`.
- Sample prompt:
  - `가방이 없어요. 무엇을 찾아요?`

## Label Museum Interactables

### `object.town2NearDisplay`

- Interaction type: display case near player.
- Korean focus:
  - `이건 책이에요.`
- Minigame plan:
  - Target object for `town2DistanceLabels`.

### `object.town2ListenerDisplay`

- Interaction type: display case near curator/listener.
- Korean focus:
  - `그건 물이에요.`
- Minigame plan:
  - Target object for `town2DistanceLabels`.

### `object.town2FarDisplay`

- Interaction type: far display case.
- Korean focus:
  - `저건 가방이에요.`
- Minigame plan:
  - Target object for `town2DistanceLabels`.

### `object.town2LabelTray`

- Interaction type: primary museum drill object.
- Korean focus:
  - Choose correct label for a sentence.
- Minigame plan:
  - Hook: `town2DistanceLabels`.
  - Temporary stand-in: `objectLabels`.
- Success behavior:
  - Set `town2.labelsPassed`.

### `object.town2MuseumRuleSign`

- Interaction type: explanatory sign.
- Korean focus:
  - `이건 가까워요.`
  - `저건 멀어요.`
- Minigame plan:
  - No drill. Keep as hint text.

## City Hall / Blocks Hall Interactables

### `object.town2FinalReadingStation`

- Interaction type: final station.
- Korean focus:
  - Read Hangul and identify batchim.
- Minigame plan:
  - Hook: `town2FinalReading`.
  - Temporary stand-ins: `alphabetBlocks`, `batchimBridge`.
- Success behavior:
  - Set final reading flag.

### `object.town2FinalNameStation`

- Interaction type: final station.
- Korean focus:
  - `저는 X예요/이에요`
- Minigame plan:
  - Hook: `town2FinalNames`.
  - Temporary stand-in: `routeNames`.
- Success behavior:
  - Set final name flag.

### `object.town2FinalObjectStation`

- Interaction type: final station.
- Korean focus:
  - `이건/그건/저건 X이에요`
- Minigame plan:
  - Hook: `town2FinalObjects`.
  - Temporary stand-in: `objectLabels`.
- Success behavior:
  - Set final object flag.

### `object.town2FinalSearchStation`

- Interaction type: final station.
- Korean focus:
  - `X이/가 있어요`
  - `X이/가 없어요`
- Minigame plan:
  - Hook: `town2FinalPresence`.
  - Temporary stand-in: `presenceCheck`.
- Success behavior:
  - Set final presence flag.

### `object.town2FinalActionStation`

- Interaction type: final station.
- Korean focus:
  - `X은/는 Y을/를 V어요`
- Minigame plan:
  - Hook: `town2FinalActions`.
  - Temporary stand-in: `actionPath`.
- Success behavior:
  - Set final action flag.

### `object.town2BadgePodium`

- Interaction type: final completion object.
- Korean focus:
  - Full mixed review summary.
  - `첫말배지`
- Minigame plan:
  - Hook: `town2FinalBadge`.
  - If all final station flags are set, award badge.
  - If not, list missing stations.
- Success behavior:
  - Set `town2.finalBadgePassed`.

## Guesthouse Interactables

### `object.town2Guestbook`

- Interaction type: flavor reading object.
- Korean focus:
  - Names: `민수`, `지우`, `하나`.
- Minigame plan:
  - No drill, or optional `routeNames` as a hidden review.

### `object.town2HintBookshelf`

- Interaction type: hint object.
- Korean focus:
  - Simple reminders:
    - `있어요 = present`
    - `없어요 = missing`
    - `읽어요 = read`
- Minigame plan:
  - No drill.

### `object.town2RestTable`

- Interaction type: flavor object.
- Korean focus:
  - `쉬어요.`
- Minigame plan:
  - No drill.

## East Residence Interactables

### `object.town2RoadMap`

- Interaction type: route hint map.
- Korean focus:
  - `북쪽`
  - `길`
  - `시청`
- Minigame plan:
  - No drill. Use for route/worldbuilding.

### `object.town2FamilyTable`

- Interaction type: flavor object.
- Korean focus:
  - `집`
  - `사람`
- Minigame plan:
  - No drill.

### `object.town2RouteNote`

- Interaction type: note about future Trail 2.
- Korean focus:
  - `아직 갈 수 없어요.`
  - `나중에 가요.`
- Minigame plan:
  - No drill.

## Suggested Drill Content By Hook

### `town2MixedReview`

- Step count: 5 or 6.
- Difficulty mix: mostly standard, one hard.
- Example task types:
  - Choose the greeting: `안녕하세요.`
  - Split `저는 민수예요.`
  - Identify object in `이건 책이에요.`
  - Decide if `가방이 없어요.` means present or missing.
  - Identify action in `저는 물을 마셔요.`
  - Choose the sentence that means "Jiu reads a book."

### `town2IdentityOffice`

- Step count: 4.
- Example task types:
  - Match `저는 민수예요.` to `민수`.
  - Match `저는 학생이에요.` to `학생`.
  - Identify what `저는` marks.
  - Choose whether `선생님이에요` is a name, role, object, or action.

### `town2LostFound`

- Step count: 4.
- Example task types:
  - `책이 있어요.` Is the book present?
  - `가방이 없어요.` Is the bag present?
  - `물이 있어요?` The water is on the shelf. Choose the answer.
  - `사과가 없어요.` What should you search for?

### `town2SearchField`

- Not a normal multiple-choice drill.
- Flow:
  1. Lost Child or Owner says a missing-item sentence.
  2. Player inspects hidden field spots.
  3. Each spot returns an `있어요/없어요` sentence.
  4. Correct spot sets `town2.lostItemFound`.
  5. Returning to Owner completes the event.

### `town2DistanceLabels`

- Step count: 4.
- Example task types:
  - `이건 책이에요.` Choose near object.
  - `그건 물이에요.` Choose object near the listener/curator.
  - `저건 가방이에요.` Choose far object.
  - Which Korean points far away? Correct: `저건`.

### `town2ActionPark`

- Step count: 4 or 5.
- Example task types:
  - `저는 책을 읽어요.` What does the person do?
  - `저는 물을 마셔요.` Choose the actor.
  - Which chunk is the object in `저는 사과를 먹어요`?
  - Which verb means writes? Correct: `써요`.

### `town2FinalBadge`

- Should be a chained event, not only one drill.
- Required stations:
  - Reading and batchim.
  - Names and roles.
  - Object labels and distance.
  - Presence and absence.
  - Actions and SOV chunks.
- Completion:
  - City Leader or Badge Podium awards the badge.
  - Road Guard recognizes the badge later.

## Implementation Notes

- Add planned hooks first as data-only drills where possible. More complex stateful interactions can wait.
- For the first implementation pass, attach existing stand-in drills to interactables so the town is playable immediately.
- Avoid assigning `drillKey` directly to NPCs that need to speak first.
- If a stateful search or badge system does not exist yet, use plain conversation keys and repeatable drills as placeholders.
- Keep each drill short. Town 2 has many stations, so individual interactions should feel quick.
- After implementation, run `node --check .\game.js` and test that every NPC and interactable can be approached without blocking doors or route triggers.
