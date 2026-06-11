# How To Create A Town

This guide explains how to create a new town scene module.

Each town owns one world file in `src/world/<town>.js` and one content pack in `data/drills/<town>.js`. The world file registers its scene with `KA.world.registerScene`; the data pack supplies text, drills, and words through the pack merge path.

## Current Pattern

Existing towns use these pieces:

- A local map from `createTileMap(width, height, "grass")`
- Local `buildings`, `objects`, `interactables`, and `npcs` arrays
- Optional interiors created with `createInteriorScene()`
- Quest and flag tables registered with `KA.quests.registerChapter(...)`
- Optional badges registered with `KA.badges.register(...)`
- A final `KA.world.registerScene(...)` call

The registered scene object looks like this:

```js
const town4 = {
  id: "town4",
  kind: "outdoor",
  map: town4Map,
  width,
  height,
  buildings: town4Buildings,
  objects: town4Objects,
  interactables,
  npcs: town4Npcs,
  areaKey: "area.town4",
  musicKey: "town4",
};
```

Register it from the same file:

```js
window.KA.world.registerScene(() => createTown4Scene());
```

This keeps every chapter self-contained and lets `src/core/loop.js` build scenes from registrations.

## Step 1: Choose Ids And Keys

Decide the town identity before adding map data.

Example:

```js
scene id: "town2"
function: createTown2Scene
area key: "area.town2"
music key: "town2"
route from Trail 1: "object.routeTown2"
```

Use these consistently. Scene ids are used by route triggers and doors, so changing them later requires updating references.

## Step 2: Add Translation Keys

Every visible label should be translated.

Add area, object, NPC, and dialog keys in the chapter data pack:

```js
packs.push({
  id: "town-4-learning-drills",
  text: {
    en: {
      "area.town4": "Schedule Harbor",
    },
    ko: {
      "area.town4": "ì¼ì • í•­êµ¬",
    },
    nl: {
      "area.town4": "Schemahaven",
    },
  },
});
```

Use the same keys in all language blocks.

## Step 3: Create The Town Function

Create the scene in `src/world/town4.js`:

```js
function createTown4Scene() {
  const width = 42;
  const height = 35;
  const townMap = createTileMap(width, height, "grass");

  buildTown4Map(townMap, width, height);

  const town4Buildings = [];
  const town4Objects = [];
  const town4Interactables = [];
  const town4Npcs = [];

  return {
    id: "town4",
    kind: "outdoor",
    map: townMap,
    width,
    height,
    buildings: town4Buildings,
    objects: town4Objects,
    interactables: town4Interactables,
    npcs: town4Npcs,
    areaKey: "area.town4",
    musicKey: "town4",
  };
}

window.KA.world.registerScene(() => createTown4Scene());
```

Town scenes should include `objects: []` even if empty, because outdoor grouped objects use this field.

## Step 4: Build The Town Map

Use a separate helper:

```js
function buildTown4Map(townMap, width, height) {
  for (let x = 0; x < width; x += 1) {
    setMapTile(townMap, x, 0, "stone");
    setMapTile(townMap, x, height - 1, "stone");
  }

  for (let y = 0; y < height; y += 1) {
    setMapTile(townMap, 0, y, "stone");
    setMapTile(townMap, width - 1, y, "stone");
  }

  fillMapRect(townMap, 18, height - 3, 5, 3, "path");
  fillMapRect(townMap, 18, 10, 5, height - 10, "path");
  fillMapRect(townMap, 10, 16, 22, 3, "path");
}
```

Use `setMapTile()` and `fillMapRect()` for new town maps.

## Step 5: Design The Road Network

The player should understand how the town connects:

- Main entrance from the previous trail.
- Main road to important buildings.
- Exit route to the next trail or blocked future route.
- Optional side road to beach, park, market, or inn.

Town 1 uses a central north-south road, a horizontal road through houses, and a beach road. Reuse that readable style.

Good road rules:

- Make main roads at least three tiles wide.
- Make route exits five tiles wide if they connect to route triggers.
- Keep building doors connected to path tiles.
- Do not place NPCs directly on door tiles or route trigger tiles.

## Step 6: Add Buildings

Buildings are drawn by `drawBuilding()`.

Example:

```js
const town2Buildings = [
  {
    labelKey: "object.town2Inn",
    sceneId: "town2Inn",
    x: 6,
    y: 12,
    w: 7,
    h: 5,
    doorX: 9,
    doorY: 16,
    roof: COLORS.roofBlue,
    trim: "#2e4e83",
  },
];
```

Building fields:

- `labelKey`: translated building name.
- `sceneId`: interior scene id entered through the door.
- `x`, `y`: top-left tile.
- `w`, `h`: building size in tiles.
- `doorX`, `doorY`: tile where the player steps to enter.
- `roof`: roof color.
- `trim`: darker roof trim.
- `important`: optional. Makes the building roof/sign larger, used by the Travel Center.

The building blocks movement everywhere inside its rectangle except the door tile.

## Step 7: Add Door Interactables

Town 1 automatically creates door interactables from `buildings`:

```js
...buildings.map((building) => ({
  labelKey: `${building.labelKey}.door`,
  sceneId: building.sceneId,
  x: building.doorX,
  y: building.doorY,
  solid: false,
  kind: "door",
})),
```

For the new town, do the same with its local building array:

```js
const town2Interactables = [
  ...town2Buildings.map((building) => ({
    labelKey: `${building.labelKey}.door`,
    sceneId: building.sceneId,
    x: building.doorX,
    y: building.doorY,
    solid: false,
    kind: "door",
  })),
];
```

Door triggers are handled by `handleStepTrigger()` for all outdoor scenes.

## Step 8: Add Signs And Routes

Signs:

```js
{
  labelKey: "object.town2WelcomeSign",
  x: 16,
  y: 20,
  solid: true,
  kind: "sign",
  conversationKeys: ["sign.town2Welcome.line1"],
}
```

South route back to Trail 1:

```js
...createRouteTriggers({
  labelKey: "object.routeSouth",
  fromX: 18,
  toX: 22,
  y: height - 1,
  targetSceneId: "trail1",
  targetX: 17,
  targetY: 1,
  targetDir: "down",
}),
```

North route to Trail 2:

```js
...createRouteTriggers({
  labelKey: "object.routeNorth",
  fromX: 18,
  toX: 22,
  y: 0,
  targetSceneId: "trail2",
  targetX: 17,
  targetY: 52,
  targetDir: "up",
  conversationKeys: ["route.trail2.pending"],
}),
```

Use pending dialogue when the target scene has not been built yet.

## Step 9: Add NPCs

NPC example:

```js
const town2Npcs = [
  {
    nameKey: "npc.town2Greeter",
    x: 20,
    y: 21,
    dir: "down",
    nextTurn: 0,
    jacket: "#4f8cc9",
    voiceGender: "female",
    voiceId: "town2Greeter",
    conversationKeys: ["npc.town2Greeter.line1", "npc.town2Greeter.line2"],
  },
];
```

NPC placement rules:

- Place NPCs on passable tiles.
- Do not place NPCs on doors, route triggers, or solid object footprints.
- Use `wander: true` only in open areas.
- Use unique `voiceId` values.

## Step 10: Add Optional Grouped Outdoor Objects

Towns can use grouped objects just like route scenes:

```js
objects: [
  { x: 24, y: 22, w: 3, h: 2, type: "town2NoticeTable" },
],
```

To make the object solid:

```js
...createRectInteractions({
  labelKey: "object.town2NoticeTable",
  x: 24,
  y: 22,
  w: 3,
  h: 2,
  conversationKeys: ["object.town2NoticeTable.line1"],
}),
```

Then draw it from `drawOutdoorObject()`.

## Step 11: Register The Town

Add this at the bottom of `src/world/<town>.js`:

```js
window.KA.world.registerScene(() => createTown4Scene());
```

After this, any route can transition into the town if its target landing coordinates match the new map.

Example incoming route:

```js
targetX: 17,
targetY: 52,
targetDir: "up",
```

Make sure the landing coordinate is on a passable tile near the town entrance. For example:

```js
targetX: 20,
targetY: 33,
targetDir: "up",
```

## Step 12: Add Or Reuse Music

The town should use its own music key:

```js
musicKey: "town4",
```

Make sure `MUSIC_TRACKS` or `KA.music.registerTracks(...)` contains a matching key:

```js
window.KA.music.registerTracks({ town4: "Town4.mp3" });
```

## Town Checklist

- Add area, building, door, sign, route, object, and NPC text in all languages.
- Create `createTown4Scene()` in `src/world/town4.js`.
- Create a self-contained `townMap`.
- Use `setMapTile()` and `fillMapRect()`.
- Create local building, interactable, object, and NPC arrays.
- Add route triggers for entrances and exits.
- Add buildings and door interactables.
- Add grouped objects and rectangle interactions where needed.
- Register the scene with `KA.world.registerScene(...)`.
- Update incoming route target coordinates.
- Add the world file and data pack to `index.html`.
- Run `node --check .\src\world\town4.js` and `node tools/smoke-test.js`.

## Common Mistakes

- Reusing another town's map or building arrays.
- Forgetting to update the incoming route landing coordinate.
- Creating a building with a door that does not touch a path.
- Adding a door interactable but not creating the interior scene.
- Forgetting the `.door` translation key.
