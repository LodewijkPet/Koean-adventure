# Temporary Town 2 Map Layout Plan

This is a temporary planning file for the second town map. It can be deleted once the Town 2 map, events, buildings, NPCs, route links, and learning-test locations are fully implemented and verified.

## Sources Checked

This plan follows the local project guides and current implementation patterns:

- `docs/create-a-town.md`
- `docs/create-objects.md`
- `docs/create-configurations.md`
- `docs/create-a-drill.md`
- `docs/learning-implementation-plan.md`
- `docs/plan.md`
- Current `game.js` scene, route, object, NPC, and drill patterns.

## Town Identity

- Scene id: `town2`
- Function: `createTown2Scene()`
- Area key: `area.town2`
- Suggested English area name: `Ireum City`
- Suggested Korean area name: `이름시`
- Suggested Dutch area name: `Naamstad`
- Music key: `town2`
- Theme: a label, identity, and first-sentence city where names, signs, objects, and actions have been mixed up.
- Learning role: this is the first integrated application town after Haneul Town and Trail 1. It should test Chapter 1 material in context instead of introducing a large new grammar set.

## Learning Scope

Town 2 should test and reinforce:

- Hangul reading and batchim recognition from Start Town and Trail 1.
- `저는 X예요/이에요` identity and role recognition.
- `이건/그건/저건 X예요/이에요` object labeling and distance.
- `X이/가 있어요` and `X이/가 없어요` presence and absence.
- Basic action recognition with `은/는`, `을/를`, and verbs such as `가요`, `와요`, `봐요`, `먹어요`, `마셔요`, `읽어요`, `써요`.
- Light location/routing with `에`, mostly through signs and movement tasks.
- A final integrated badge test in the City Hall / Blocks Hall.

Town 2 should not yet focus on:

- Counters.
- Money and prices.
- Restaurant ordering.
- Clock time and dates.
- Family honorifics.
- Past/future tense.
- Complex honorific systems.

## Map Size And Coordinate System

Use a self-contained outdoor scene:

```js
const width = 48;
const height = 38;
const town2Map = createTileMap(width, height, "grass");
```

Coordinates are tile based:

- `x` range: `0..47`
- `y` range: `0..37`
- South entrance from Trail 1: `x 22..26`, `y 37`
- Future north/east ridge exit to Trail 2: `x 38..42`, `y 0`
- Main south landing tile: `x 24`, `y 36`, facing `up`

## Route Connections

### Incoming From Trail 1

Trail 1 currently points north to `town2` but lands at a trail-sized coordinate. When Town 2 is implemented, update Trail 1's north route target:

```js
targetSceneId: "town2",
targetX: 24,
targetY: 36,
targetDir: "up",
```

Because `createRouteTriggers()` offsets the landing x coordinate across the route width, the full Trail 1 entrance should land on Town 2 tiles `x 22..26`, `y 36`.

### Town 2 South Exit Back To Trail 1

Town 2 should include:

```js
...createRouteTriggers({
  labelKey: "object.routeSouth",
  fromX: 22,
  toX: 26,
  y: 37,
  targetSceneId: "trail1",
  targetX: 17,
  targetY: 1,
  targetDir: "down",
})
```

### Future Trail 2 Exit

Reserve a future route at the north edge:

```js
...createRouteTriggers({
  labelKey: "object.routeTrail2",
  fromX: 38,
  toX: 42,
  y: 0,
  targetSceneId: "trail2",
  targetX: 17,
  targetY: 52,
  targetDir: "up",
  conversationKeys: ["route.trail2.pending"],
})
```

If `trail2` is not implemented yet, keep pending dialogue so the player understands why the route does not transition.

## Overall Layout

Town 2 should be readable as five districts:

- South Gate: arrival, recap, route back to Trail 1.
- Central Plaza: safe hub, mixed review boards, optional self-tests.
- West District: identity office and lost-and-found search loop.
- East District: label museum and action park.
- North Civic District: review library, City Hall / Blocks Hall, and future Trail 2 route.

Approximate map sketch:

```text
y=0     stone boundary             Trail 2 route x38..42
        [Review Library]   [City Hall / Blocks Hall]       ridge road

y=8     ================= civic cross street ==============

y=15    [Info Center]      CENTRAL REVIEW PLAZA      [Label Museum]

y=22    [Lost & Found]     plaza south road          Action Park

y=29    Search Field       Guesthouse / rest spot    Action Park

y=37                     Trail 1 route x22..26
```

## Base Tile Plan

Use `setMapTile()` and `fillMapRect()` for Town 2. Do not use the global Town 1 helpers.

### Boundaries

- Fill the whole map with `grass`.
- Set the outer border to `stone`.
- Leave south opening `x 22..26`, `y 37` as `path`.
- Leave north opening `x 38..42`, `y 0` as `path`.
- Add inner hedges along the border except near road openings, so the scene feels contained.

Suggested boundary logic:

```js
for (let x = 0; x < width; x += 1) {
  setMapTile(town2Map, x, 0, "stone");
  setMapTile(town2Map, x, height - 1, "stone");
}

for (let y = 0; y < height; y += 1) {
  setMapTile(town2Map, 0, y, "stone");
  setMapTile(town2Map, width - 1, y, "stone");
}

fillMapRect(town2Map, 22, 37, 5, 1, "path");
fillMapRect(town2Map, 38, 0, 5, 1, "path");
```

### Main Roads

Create the broad roads first:

```js
fillMapRect(town2Map, 22, 8, 5, 30, "path");    // main north-south road
fillMapRect(town2Map, 10, 8, 33, 4, "path");    // civic cross street
fillMapRect(town2Map, 15, 15, 18, 10, "path");  // central plaza
fillMapRect(town2Map, 4, 17, 18, 4, "path");    // west street
fillMapRect(town2Map, 26, 17, 18, 4, "path");   // east street
fillMapRect(town2Map, 5, 27, 22, 5, "path");    // south-west search lane
fillMapRect(town2Map, 33, 25, 11, 7, "path");   // action park loop
fillMapRect(town2Map, 38, 0, 5, 12, "path");    // ridge road to future Trail 2
```

Add short door connectors:

```js
fillMapRect(town2Map, 8, 7, 3, 2, "path");      // review library door
fillMapRect(town2Map, 9, 16, 3, 2, "path");     // information center door
fillMapRect(town2Map, 8, 26, 3, 2, "path");     // lost-and-found door
fillMapRect(town2Map, 36, 15, 3, 3, "path");    // label museum door
fillMapRect(town2Map, 17, 29, 3, 5, "path");    // guesthouse connector
```

### Decoration And Natural Barriers

- Put `flowers` around the central plaza and civic road so the city feels more developed than Trail 1.
- Put `tallGrass` in the Search Field at `x 6..16`, `y 32..35` for hidden-object events.
- Use `hedge` around Action Park edges, but leave multiple entrances so NPCs do not trap the player.
- Use `tree` clusters in unused corners:
  - North-west: around `x 2..4`, `y 2..6`
  - South-east: around `x 44..46`, `y 30..35`
  - South-west beyond Search Field: around `x 2..4`, `y 31..35`
- Optional small pond in Action Park at `x 42..44`, `y 32..34` using `water`, with path tiles around it.

## Buildings

All building labels need matching `.door` keys in English, Korean, and Dutch.

| Building | Purpose | Footprint | Door | Notes |
| --- | --- | --- | --- | --- |
| City Hall / Blocks Hall | Final integrated Chapter 1 badge test | `x 15, y 2, w 18, h 7` | `x 24, y 8` | Mark `important: true`. This is the town's main destination. |
| Review Library | Optional reading, Hangul, and batchim refresh | `x 5, y 2, w 8, h 6` | `x 9, y 7` | Good place to reuse or later expand reading drills. |
| Information Center | Identity and role registration | `x 5, y 11, w 10, h 6` | `x 10, y 16` | Tests `저는 X예요/이에요`. |
| Lost-and-Found Shop | Presence/absence and inventory check | `x 4, y 22, w 10, h 5` | `x 9, y 26` | Links directly to outdoor Search Field. |
| Label Museum | Object labels and distance words | `x 32, y 10, w 11, h 6` | `x 37, y 15` | Tests `이건/그건/저건`. |
| Town Guesthouse | Rest, flavor, optional NPC dialogue | `x 15, y 25, w 7, h 5` | `x 18, y 29` | Not required for progression. Useful as a quiet checkpoint. |
| East Residence | Flavor house near future Trail 2 road | `x 34, y 3, w 7, h 5` | `x 37, y 7` | Use for residents who mention the next road is not ready. |

Suggested building data names:

```js
object.town2CityHall
object.town2ReviewLibrary
object.town2InfoCenter
object.town2LostFound
object.town2LabelMuseum
object.town2Guesthouse
object.town2EastResidence
```

## Outdoor Objects And Interactables

Use existing outdoor object renderers where possible. New custom object drawing can wait until the layout is proven.

| Object | Suggested type | Position | Size | Solid | Learning role |
| --- | --- | --- | --- | --- | --- |
| South Welcome Sign | sign interactable | `x 24, y 34` | 1 tile | yes | Explains this city tests names, labels, things, and actions. |
| Central Review Board | sign interactable | `x 16, y 17` | 1 tile | yes | Optional mixed self-test. |
| Plaza Review Table | `trailRestTable` or new `town2ReviewTable` | `x 18, y 19` | `w 3, h 2` | yes | Self-test slot for chunk review. |
| Distance Triangle Markers | signs or small object footprints | `x 21, y 22`, `x 26, y 18`, `x 31, y 16` | 1 tile each | yes | Spatializes `이건`, `그건`, `저건`. |
| Object Label Stall | `routeObjectStall` | `x 29, y 19` | `w 3, h 2` | yes | Outdoor backup for object labels. |
| Speech Bench | `speechBench` | `x 17, y 23` | `w 3, h 1` | yes | Sentence chunk refresh. |
| Search Field Basket | `trailRestTable` or sign | `x 7, y 31` | `w 3, h 2` | yes | Start point for lost-item search. |
| Hidden Object Spots | hidden interactables | `x 8, y 33`, `x 12, y 34`, `x 15, y 32` | 1 tile each | optional | Future object-present/object-absent events. |
| Action Park Board | sign interactable | `x 34, y 24` | 1 tile | yes | Starts action recognition practice. |
| Park Practice Stage | path tiles or new object | `x 36, y 27` | `w 5, h 3` | no or partial | Space for NPC action demonstrations. |
| Trail 2 Gate Sign | sign interactable | `x 40, y 3` | 1 tile | yes | Explains future route / badge gate. |

If grouped objects are used, add matching `createRectInteractions()` footprints for solid collision and optional `drillKey` hooks.

## Outdoor NPC Plan

Place NPCs only on passable tiles, never on doors or route triggers. Use `wander: true` only in broad plaza or park areas.

| NPC key | Position | Direction | Movement | Role |
| --- | --- | --- | --- | --- |
| `npc.town2GateGreeter` | `x 24, y 35` | down | stationary | Welcomes the player from Trail 1 and points to the central plaza. |
| `npc.town2PlazaGuide` | `x 20, y 17` | down | stationary | Explains the city problem: names, labels, objects, and actions are mixed. |
| `npc.town2ReviewClerk` | `x 18, y 22` | up | stationary | Runs optional mixed self-test at the review table. |
| `npc.town2LabelRunner` | `x 30, y 22` | left | wander | Carries wrong labels between plaza and museum. |
| `npc.town2LostChild` | `x 11, y 28` | down | stationary | Introduces missing-object language before the Search Field. |
| `npc.town2ActionCoach` | `x 36, y 24` | down | stationary | Starts or explains Action Park practice. |
| `npc.town2ReaderActor` | `x 37, y 29` | left | stationary | Reads a book for `책을 읽어요`. |
| `npc.town2WaterActor` | `x 41, y 27` | left | wander within park | Drinks water for `물을 마셔요`. |
| `npc.town2AppleActor` | `x 35, y 31` | right | stationary | Eats an apple for `사과를 먹어요`. |
| `npc.town2WriterActor` | `x 40, y 31` | up | stationary | Writes a name for `이름을 써요`. |
| `npc.town2RoadGuard` | `x 40, y 4` | down | stationary | Guards the future Trail 2 road until the badge/test exists. |
| `npc.town2Resident` | `x 35, y 8` | down | wander near east residence | Flavor NPC who uses simple identity/location sentences. |

Suggested jacket colors should stay varied and readable:

- Gate greeter: `#4f8cc9`
- Plaza guide: `#a65d3e`
- Review clerk: `#6c9a50`
- Label runner: `#8a6bb7`
- Lost child: `#e2a843`
- Action coach: `#497a4d`
- Actors: use distinct muted colors so they are easy to tell apart.

## Indoor Layout Plans

The town map should be useful even before interiors are fully polished. These interiors can be implemented later, but the door destinations should be planned now so building placement makes sense.

### City Hall / Blocks Hall

Purpose: final integrated Chapter 1 test.

Suggested interior:

- Size: `26 x 18`
- Entry: bottom center, around `x 13, y 16`
- Main hall: `x 10..16`, `y 12..16`
- Four side rooms plus final dais:
  - Reading Room: `x 2..8`, `y 2..7`
  - Name Room: `x 10..16`, `y 2..7`
  - Object Room: `x 18..24`, `y 2..7`
  - Search Room: `x 2..11`, `y 9..13`
  - Action Dais: `x 15..24`, `y 10..14`

NPCs:

- `npc.town2CityLeader`: stationary at final dais.
- `npc.town2ReadingAttendant`: Reading Room.
- `npc.town2NameAttendant`: Name Room.
- `npc.town2ObjectAttendant`: Object Room.
- `npc.town2SearchAttendant`: Search Room.
- `npc.town2ActionAttendant`: Action Dais.

Events:

- Do not make this a single abstract quiz room. The player should walk through stations that mirror the town:
  - Read a sign or choose matching Hangul.
  - Match a name/role card.
  - Identify a nearby/listener/far object.
  - Decide whether an item is present or missing.
  - Match an action sentence to a person.
- Final reward can later be `First Words Badge` or `글자배지`.

### Review Library

Purpose: optional retry/review area.

Suggested interior:

- Size: `16 x 12`
- Front shelves with Hangul cards.
- A batchim wall on one side.
- Two reading desks.

Events:

- Reuse existing reading concepts from `alphabetBlocks`, `soundFountain`, `batchimBridge`, or future Town 2 review drills.
- This should never block town progression. It is a support space for players who fail the City Hall test.

### Information Center

Purpose: identity and role registration.

Suggested interior:

- Size: `18 x 13`
- Counter at top.
- Waiting line area with 3 NPCs.
- Form table at center.

Events:

- NPCs say lines like:
  - `저는 민수예요.`
  - `저는 학생이에요.`
  - `저는 선생님이에요.`
- Player identifies name or role on a form.
- This should test pattern recognition, not free production.

### Lost-and-Found Shop

Purpose: presence/absence loop.

Suggested interior:

- Size: `18 x 13`
- Counter with owner.
- Shelves with object slots: book, water, bag, apple, door/key card.
- Back door or dialogue link pointing to Search Field.

Events:

- Owner says which item is present or missing.
- Player checks shelves or outdoor hidden spots.
- Grammar focus:
  - `책이 있어요.`
  - `가방이 없어요.`
  - `물이 있어요?`
  - `네, 있어요.`
  - `아니요, 없어요.`

### Label Museum

Purpose: object labels and demonstratives.

Suggested interior:

- Size: `20 x 14`
- Three display distances:
  - Near-player display.
  - Near-curator display.
  - Far display.
- Movable or inspectable labels for book, water, bag, apple, house, door.

Events:

- Curator uses:
  - `이건 책이에요.`
  - `그건 물이에요.`
  - `저건 가방이에요.`
- Player identifies which object is being named.
- Reinforce `이/그/저` spatially, not as a lecture.

### Town Guesthouse

Purpose: quiet flavor and pacing break.

Suggested interior:

- Size: `14 x 12`
- Bed, table, chair, bookshelf.
- One resident NPC.

Events:

- Simple dialogue only.
- Good place for a hint NPC who says where the player should go next.

### East Residence

Purpose: future-route flavor.

Suggested interior:

- Size: `14 x 12`
- Family table and small map board.
- Resident mentions the road to the next area.

Events:

- Keep this optional.
- Avoid adding new grammar here.

## Learning Event Flow

The map should gently guide the player through this order without hard locking every step:

1. South Gate welcome sign and greeter.
2. Central Plaza mixed review board.
3. Information Center identity task.
4. Lost-and-Found presence/absence task.
5. Search Field outdoor object task.
6. Label Museum object/distance task.
7. Action Park action/SOV task.
8. City Hall / Blocks Hall integrated final test.
9. Future Trail 2 gate, still pending until the next route exists.

The player should be able to reach every practice area before entering City Hall. The final building can later require progress flags, but the physical map should not need to change for that.

## Drill And Event Hooks To Reserve

These are planned hook names only. Do not implement the minigames as part of the map layout task unless a later task asks for that.

| Planned hook | Location | Purpose |
| --- | --- | --- |
| `town2MixedReview` | Central Review Board or Review Table | Mixed self-test across earlier drills. |
| `town2IdentityOffice` | Information Center | Name and role extraction from `저는 X예요/이에요`. |
| `town2LostFound` | Lost-and-Found Shop | Presence/absence with `있어요/없어요`. |
| `town2SearchField` | Search Field Basket and hidden object spots | Object present/missing search event. |
| `town2DistanceLabels` | Label Museum and Distance Triangle | `이건/그건/저건` spatial practice. |
| `town2ActionPark` | Action Park Board | Match actions and SOV sentences to NPCs. |
| `town2FinalBadge` | City Hall / Blocks Hall | Integrated Chapter 1 final. |

Temporary stand-ins, if the layout needs testing before new Town 2 drills exist:

- `routeNames` for Information Center.
- `objectLabels` for Label Museum.
- `presenceCheck` for Lost-and-Found.
- `actionPath` for Action Park.
- `sentenceBlocks` for Central Review Board.

## Key Interactable Data Plan

Example outdoor interactables:

```js
{
  labelKey: "object.town2WelcomeSign",
  x: 24,
  y: 34,
  solid: true,
  kind: "sign",
  conversationKeys: ["sign.town2Welcome.line1", "sign.town2Welcome.line2"],
}
```

```js
{
  labelKey: "object.town2CentralReviewBoard",
  x: 16,
  y: 17,
  solid: true,
  kind: "sign",
  conversationKeys: ["object.town2CentralReviewBoard.line1"],
  drillKey: "town2MixedReview",
}
```

```js
...createRectInteractions({
  labelKey: "object.town2ReviewTable",
  x: 18,
  y: 19,
  w: 3,
  h: 2,
  conversationKeys: ["object.town2ReviewTable.line1"],
  drillKey: "town2MixedReview",
})
```

```js
{
  labelKey: "object.town2ActionParkBoard",
  x: 34,
  y: 24,
  solid: true,
  kind: "sign",
  conversationKeys: ["object.town2ActionParkBoard.line1"],
  drillKey: "town2ActionPark",
}
```

Keep route triggers and door interactables separate from these practice interactables.

## Text Keys To Add Later

Minimum area and building keys:

```text
area.town2
object.town2CityHall
object.town2CityHall.door
object.town2ReviewLibrary
object.town2ReviewLibrary.door
object.town2InfoCenter
object.town2InfoCenter.door
object.town2LostFound
object.town2LostFound.door
object.town2LabelMuseum
object.town2LabelMuseum.door
object.town2Guesthouse
object.town2Guesthouse.door
object.town2EastResidence
object.town2EastResidence.door
```

Minimum outdoor object/sign keys:

```text
object.town2WelcomeSign
object.town2CentralReviewBoard
object.town2ReviewTable
object.town2DistanceNear
object.town2DistanceMiddle
object.town2DistanceFar
object.town2SearchBasket
object.town2ActionParkBoard
object.town2Trail2GateSign
object.routeTrail2
route.trail2.pending
```

Minimum NPC keys:

```text
npc.town2GateGreeter
npc.town2PlazaGuide
npc.town2ReviewClerk
npc.town2LabelRunner
npc.town2LostChild
npc.town2ActionCoach
npc.town2ReaderActor
npc.town2WaterActor
npc.town2AppleActor
npc.town2WriterActor
npc.town2RoadGuard
npc.town2Resident
npc.town2CityLeader
```

Every key should be added to `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.

## Collision And Placement Rules

- Door tiles must be connected to path tiles.
- Do not place NPCs at:
  - `x 22..26, y 37`
  - `x 38..42, y 0`
  - any building door tile
  - any solid object footprint
- The central plaza should stay open enough for the camera and player pathfinding:
  - Keep at least a 3-tile-wide route through `x 22..26`.
  - Keep object footprints near plaza edges, not in the direct south-to-north path.
- Search Field tall grass should be passable.
- Hidden object interactables in Search Field can be non-solid if they represent items on the ground.
- Park actors should not wander outside Action Park unless bounded by hedges, trees, or object placement.

## Implementation Notes From Guides

When this plan is implemented:

- Create `createTown2Scene()` instead of modifying the global Town 1 `map`.
- Include `objects: []` even if some objects are deferred.
- Use `setMapTile()` and `fillMapRect()` for Town 2.
- Register with `scenes.town2 = createTown2Scene();`.
- Update Trail 1's incoming `town2` route target to a valid Town 2 coordinate.
- Add route triggers for south return and future Trail 2.
- Add door interactables from the Town 2 building array.
- Generalize outdoor door handling if it still checks only `scene.id === "town"`.
- Add text keys in all three languages.
- Add new outdoor object renderers only when reusing existing object types is not enough.
- Run `node --check .\game.js` after implementation.

## Acceptance Checklist For The Future Map

- The player can enter from Trail 1 at the south road and move without being blocked.
- The player can walk to every Town 2 building door.
- The player can return to Trail 1 from the south exit.
- The future Trail 2 route gives pending dialogue if `trail2` does not exist.
- There is a clear visual path from arrival to Central Plaza, then to all practice districts.
- There are at least six learning/test locations:
  - Central Review Board/Table.
  - Information Center.
  - Lost-and-Found Shop.
  - Search Field.
  - Label Museum.
  - Action Park.
  - City Hall / Blocks Hall final test.
- Outdoor NPCs are on passable tiles and do not block route triggers or doors.
- Every visible label uses translation keys.
- All solid grouped objects have collision footprints.
- The map remains useful even before the planned minigames are implemented.
