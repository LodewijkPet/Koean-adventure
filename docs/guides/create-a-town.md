# How To Create A Town

This guide explains how to create a new town scene based on Town 1 and the future Town 2 hook from Trail 1.

Town 1 is currently the main outdoor scene with buildings, doors, NPCs, signs, a shoreline, and a north route to Trail 1. Future towns should use the same scene shape but should be created in their own function, similar to `createTrail1Scene()`, so they do not depend on the global Town 1 map.

## Current Town 1 Structure

Town 1 uses these top-level pieces:

- `WORLD_WIDTH` and `WORLD_HEIGHT`
- Global `map`
- `buildMap()`
- `buildings`
- `interactables`
- `npcs`
- `scenes.town` in `buildScenes()`
- Interior scenes from `createInteriorScenes()`

The Town 1 scene object looks like this:

```js
scenes.town = {
  id: "town",
  kind: "outdoor",
  map,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  buildings,
  interactables,
  npcs,
  areaKey: "area.haneulTown",
  musicKey: "town1",
};
```

For Town 2, prefer:

```js
scenes.town2 = createTown2Scene();
```

This keeps Town 2 self-contained.

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

Add an area key:

```js
Object.assign(TEXT.en, {
  "area.town2": "Town 2",
});
```

Then add the same key to `TEXT.ko` and `TEXT.nl`.

Add object keys:

```js
Object.assign(TEXT.en, {
  "object.town2WelcomeSign": "Town 2 Welcome Sign",
  "object.town2Inn": "Town 2 Inn",
  "object.town2Inn.door": "Town 2 Inn Door",
  "object.routeSouth": "Route South",
  "object.routeNorth": "Route North",
});
```

Add NPC names and dialogue:

```js
Object.assign(TEXT.en, {
  "npc.town2Greeter": "Town Guide",
  "npc.town2Greeter.line1": "Welcome to the second town.",
  "npc.town2Greeter.line2": "The southern trail leads back to Haneul Town.",
});
```

Use the same keys in all language blocks.

## Step 3: Create The Town Function

Create a function near `createTrail1Scene()`:

```js
function createTown2Scene() {
  const width = 42;
  const height = 35;
  const townMap = createTileMap(width, height, "grass");

  buildTown2Map(townMap, width, height);

  const town2Buildings = [];
  const town2Interactables = [];
  const town2Npcs = [];

  return {
    id: "town2",
    kind: "outdoor",
    map: townMap,
    width,
    height,
    buildings: town2Buildings,
    objects: [],
    interactables: town2Interactables,
    npcs: town2Npcs,
    areaKey: "area.town2",
    musicKey: "town2",
  };
}
```

Town scenes should include `objects: []` even if empty, because outdoor grouped objects use this field.

## Step 4: Build The Town Map

Use a separate helper:

```js
function buildTown2Map(townMap, width, height) {
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

Use `setMapTile()` and `fillMapRect()` for new town maps. Do not use `setTile()` or `fillRectTiles()` for future towns unless you intend to modify the original Town 1 global map.

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

For Town 2, do the same with `town2Buildings`:

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

Important: `handleStepTrigger()` currently only opens doors when `scene.id === "town"`. To support Town 2 doors, update that condition to allow outdoor scenes with doors:

```js
if (scene.kind === "outdoor" && item?.kind === "door" && item.sceneId) {
  const nextScene = scenes[item.sceneId];
  if (nextScene) {
    changeScene(nextScene.id, nextScene.entry.x, nextScene.entry.y, nextScene.entry.dir);
    return true;
  }
}
```

This is needed before Town 2 buildings can enter interiors.

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

Town 2 can use grouped objects just like Trail 1:

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

Add this in `buildScenes()`:

```js
scenes.town2 = createTown2Scene();
```

After this, Trail 1's existing north route can transition into Town 2 if its target landing coordinates match the new map.

Trail 1 currently lands future Town 2 at:

```js
targetX: 17,
targetY: 52,
targetDir: "up",
```

That coordinate only makes sense for a tall trail map, not a 35-tile-high town. When Town 2 is created, update Trail 1's north route target to a valid Town 2 entrance, for example:

```js
targetX: 20,
targetY: 33,
targetDir: "up",
```

## Step 12: Add Or Reuse Music

Town 2 should use:

```js
musicKey: "town2",
```

Make sure `MUSIC_TRACKS` contains:

```js
town2: "Town2.mp3",
```

## Town Checklist

- Add area, building, door, sign, route, object, and NPC text in all languages.
- Create `createTown2Scene()`.
- Create a self-contained `townMap`.
- Use `setMapTile()` and `fillMapRect()`, not Town 1's `setTile()`.
- Create local building, interactable, object, and NPC arrays.
- Add route triggers for entrances and exits.
- Add buildings and door interactables.
- Add grouped objects and rectangle interactions where needed.
- Register the scene in `buildScenes()`.
- Update incoming route target coordinates.
- Generalize outdoor door handling if the town has interiors.
- Run `node --check .\game.js`.

## Common Mistakes

- Using the global `map` for Town 2, which edits Town 1 by mistake.
- Forgetting to change Trail 1's future Town 2 landing coordinate.
- Creating a building with a door that does not touch a path.
- Adding a door interactable but not creating the interior scene.
- Leaving `scene.id === "town"` in door handling, which prevents Town 2 doors from opening.
- Forgetting the `.door` translation key.
- Reusing Town 1 building arrays for Town 2.
