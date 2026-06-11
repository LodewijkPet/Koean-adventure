# How To Create A Trail Or Route Area

This guide documents the route-area pattern currently used by Trail 1. The request used the word "drill"; in the current codebase the created feature is a trail, so this guide treats a drill as a route-style outdoor area that connects towns.

Use this guide when you want to create a new area like Trail 1, Trail 2, a mountain path, a beach road, or any map whose job is to connect one town to another.

## Current Pattern

Trail 1 is implemented as a full scene in `src/world/trail1.js`.

A route scene has these pieces:

- A tile map made with `createTileMap(width, height, "grass")`.
- Decorative terrain placed with `fillMapRect()` and `setMapTile()`.
- A returned scene object with `id`, `kind`, `map`, `width`, `height`, `objects`, `interactables`, `npcs`, `areaKey`, and `musicKey`.
- Route triggers created with `createRouteTriggers()`.
- Translation keys supplied by a `data/drills/<area>.js` pack or `KA.text.register(...)`.
- Optional grouped objects in `scene.objects`.
- Optional solid object interactions created with `createRectInteractions()`.

Trail 1 currently connects:

- Town 1 north exit to Trail 1 south side.
- Trail 1 south exit back to Town 1.
- Trail 1 north exit to future Town 2, guarded so it does not crash before Town 2 exists.

## Naming Rules

Use stable lowercase ids:

```js
scene id: "trail2"
function name: createTrail2Scene
area key: "area.trail2"
music key: "trail2"
route label: "object.routeTown3"
```

Avoid changing ids after other scenes point to them. Route triggers use `targetSceneId`, so renaming scenes means updating every route that links to them.

## Step 1: Add Text Keys

Every visible name or dialogue line should use translation keys. Add keys to all three language sections.

Minimum keys for a route:

```js
packs.push({
  id: "trail-2-learning-drills",
  text: {
    en: {
      "area.trail2": "East Trail",
      "object.routeTown2": "Town 2 Road",
      "object.routeTown3": "Town 3 Road",
      "object.trail2NorthSign": "North Trail Sign",
      "object.trail2SouthSign": "South Trail Sign",
      "sign.trail2North.line1": "North: Town 3.",
      "sign.trail2South.line1": "South: Town 2.",
      "npc.trail2Guide.line1": "The road narrows near the trees.",
      "npc.trail2Guide.line2": "Follow the pale dirt if you want the next town.",
    },
    ko: {},
    nl: {},
  },
});
```

Then add the same keys to `ko` and `nl`.

Keep the key names identical across languages. Only the values should change.

## Step 2: Create The Scene Function

Create the function in `src/world/trail2.js`.

```js
function createTrail2Scene() {
  const width = 34;
  const height = 54;
  const trailMap = createTileMap(width, height, "grass");

  return {
    id: "trail2",
    kind: "outdoor",
    map: trailMap,
    width,
    height,
    buildings: [],
    objects: [],
    interactables: [],
    npcs: [],
    areaKey: "area.trail2",
    musicKey: "trail2",
  };
}
```

Use `kind: "outdoor"` for route scenes. This makes the scene use outdoor tile rendering, outdoor camera behavior, outdoor buildings, outdoor objects, and outdoor interactables.

## Step 3: Shape The Terrain

Use large rectangles first, then smaller details.

Example:

```js
fillMapRect(trailMap, 15, 49, 5, 5, "path");
fillMapRect(trailMap, 14, 42, 5, 8, "path");
fillMapRect(trailMap, 0, 35, width, 3, "water");
fillMapRect(trailMap, 9, 35, 5, 3, "bridge");
fillMapRect(trailMap, 4, 43, 7, 5, "tallGrass");
```

Current outdoor tile types include:

- `grass`
- `path`
- `sand`
- `water`
- `stone`
- `hedge`
- `tree`
- `flowers`
- `ledge`
- `tallGrass`
- `bridge`

Solid tiles are controlled by `SOLID_TILES`. If a tile type is in that set, the player and NPCs cannot walk on it. `water`, `tree`, `hedge`, `ledge`, and `stone` are solid. `path`, `grass`, `flowers`, `tallGrass`, and `bridge` are passable.

## Step 4: Add Map Boundaries

Route maps should not let the player walk into empty space. Use trees, hedges, ledges, water, or stone at the edges.

Example:

```js
for (let x = 0; x < width; x += 1) {
  if (x < 15 || x > 19) setMapTile(trailMap, x, 0, "tree");
  if (x < 15 || x > 19) setMapTile(trailMap, x, height - 1, "tree");
}

for (let y = 1; y < height - 1; y += 1) {
  setMapTile(trailMap, 0, y, "tree");
  setMapTile(trailMap, width - 1, y, "tree");
}
```

Leave an opening where route triggers will sit. In Trail 1, the opening is five tiles wide.

## Step 5: Add Route Triggers

Route triggers are invisible or partly visible interactable tiles that call `changeScene()` when the player steps onto them.

Use `createRouteTriggers()` for exits that span multiple tiles:

```js
...createRouteTriggers({
  labelKey: "object.routeTown2",
  fromX: 15,
  toX: 19,
  y: height - 1,
  targetSceneId: "town2",
  targetX: 20,
  targetY: 1,
  targetDir: "down",
}),
```

Field meaning:

- `labelKey`: translation key used if the player interacts with the route tile.
- `fromX` and `toX`: horizontal range of trigger tiles.
- `y`: vertical position of the trigger row.
- `targetSceneId`: scene to enter.
- `targetX` and `targetY`: landing tile in the target scene.
- `targetDir`: direction the player faces after transition.
- `conversationKeys`: optional dialogue used when the route cannot yet lead anywhere or when the player interacts with it.

The helper hides every route marker except the center tile by setting `hidden: true` on side triggers. This keeps the visible marker clean while still letting the whole path width work.

## Step 6: Handle Future Routes Safely

Routes can point at scenes that are registered later. `handleStepTrigger()` checks for the target scene before changing scenes:

```js
const nextScene = scenes[item.targetSceneId];
if (nextScene) {
  changeScene(...);
}
```

That means a future route can be placed without crashing. Add `conversationKeys` to explain that the destination is not ready:

```js
...createRouteTriggers({
  labelKey: "object.routeTown3",
  fromX: 15,
  toX: 19,
  y: 0,
  targetSceneId: "town3",
  targetX: 17,
  targetY: 52,
  targetDir: "up",
  conversationKeys: ["route.town3.pending"],
}),
```

## Step 7: Add Signs

Signs are solid interactables:

```js
{
  labelKey: "object.trail2NorthSign",
  x: 20,
  y: 3,
  solid: true,
  kind: "sign",
  conversationKeys: ["sign.trail2North.line1"],
}
```

If `conversationKeys` is missing, the game uses the generic `interaction.default` line. Prefer specific lines for signs.

## Step 8: Add NPCs

NPCs are stored in the scene's `npcs` array:

```js
{
  nameKey: "npc.trail2Guide",
  x: 8,
  y: 22,
  dir: "right",
  nextTurn: 0,
  jacket: "#a6633f",
  voiceGender: "male",
  voiceId: "trail2Guide",
  conversationKeys: ["npc.trail2Guide.line1", "npc.trail2Guide.line2"],
}
```

Required fields:

- `nameKey`: translation key for the NPC name.
- `x`, `y`: tile position.
- `dir`: one of `up`, `down`, `left`, `right`.
- `nextTurn`: set to `0`.
- `jacket`: color used by the sprite renderer.
- `conversationKeys`: dialogue lines.

Recommended fields:

- `voiceGender`: helps speech voice selection.
- `voiceId`: stable id used for voice consistency.
- `wander: true`: optional movement. Use only where there is enough free space.
- `kind: "child"`: optional smaller sprite.

## Step 9: Add Grouped Outdoor Objects

Trail 1 uses grouped outdoor objects:

```js
objects: [
  { x: 9, y: 35, w: 5, h: 3, type: "trailBridge" },
  { x: 14, y: 0, w: 7, h: 2, type: "trailGate" },
  { x: 24, y: 26, w: 3, h: 2, type: "trailRestTable" },
],
```

These render as one larger object instead of a repeated tile. To make an object solid and interactive, add a rectangle interaction:

```js
...createRectInteractions({
  labelKey: "object.trailRestTable",
  x: 24,
  y: 26,
  w: 3,
  h: 2,
  conversationKeys: ["object.trailRestTable.line1"],
}),
```

The object drawing must also be handled by `drawOutdoorObject()`:

```js
if (object.type === "trailRestTable") {
  drawTrailRestTableObject(x, y, w, h);
}
```

## Step 10: Register The Scene

Add the scene registration at the bottom of `src/world/trail2.js`:

```js
window.KA.world.registerScene(() => createTrail2Scene());
```

Do this before any route needs to enter it. A route can point to a missing scene safely, but the transition will do nothing until the scene is registered.

## Step 11: Connect The Previous Area

To connect Town 2 north to Trail 2, add route triggers to Town 2's `interactables`:

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
}),
```

Make sure the target landing tile is passable. Do not land on `water`, `tree`, `hedge`, `ledge`, `stone`, a solid object, or an NPC.

## Step 12: Add Music

Music is selected by `musicKey`:

```js
musicKey: "trail2",
```

The key must exist in `MUSIC_TRACKS`, or be added through `KA.music.registerTracks(...)`:

```js
window.KA.music.registerTracks({ trail2: "Trail2.mp3" });
```

The browser starts music after the first keyboard input because autoplay is blocked by browsers.

## Route Area Checklist

- Add area, object, sign, route, and NPC text in a data pack or `KA.text.register(...)`.
- Create a scene function in `src/world/<route>.js`.
- Build a passable path from entrance to exit.
- Add solid boundaries.
- Add route triggers for every exit.
- Add signs near exits.
- Add NPCs only on passable tiles.
- Add grouped objects through `objects`.
- Add object interactions through `createRectInteractions()`.
- Register the scene with `KA.world.registerScene(...)`.
- Connect the previous scene to this route.
- Set `musicKey`.
- Add the world file and data pack to `index.html`.
- Run `node --check .\src\world\trail2.js` and `node tools/smoke-test.js`.

## Common Mistakes

- Forgetting `KA.world.registerScene(...)`: the route exists as code but never gets added to `scenes`.
- Landing on a solid tile: the player appears stuck after changing scenes.
- Adding an object to `objects` but not adding a drawer in `drawOutdoorObject()`.
- Adding a solid grouped object but forgetting `createRectInteractions()`.
- Adding English text but forgetting Korean and Dutch.
- Reusing an existing `voiceId` for a different NPC.
- Pointing to a future scene without adding `conversationKeys`, leaving the player with no clue why the route does not transition.
