# How To Create Objects

This guide explains how to create objects in the current game. Objects can be visual only, solid, interactive, grouped into larger shapes, or used as route triggers.

The game has three related concepts:

- Tile types: terrain stored directly in a map, such as `grass`, `path`, `water`, or `tree`.
- Scene objects: larger rendered objects stored in `scene.objects`, such as the Trail 1 bridge, gate, and rest table.
- Interactables: collision and dialogue points stored in `scene.interactables`, such as signs, doors, route triggers, and object footprints.

Understanding the difference is important. A thing can be visible without being interactive, interactive without having a custom large drawing, or both.

## Object Types In The Current Game

Current object patterns:

- Buildings: stored in `buildings` arrays and rendered by `drawBuilding()`.
- Doors: stored in `interactables` with `kind: "door"`.
- Signs: stored in `interactables` with `kind: "sign"`.
- Routes: stored in `interactables` with `kind: "route"`.
- Indoor furniture: stored in interior `objects` and rendered by `drawFurnitureObject()`.
- Outdoor grouped objects: stored in outdoor `objects` and rendered by `drawOutdoorObject()`.
- Tile decorations: stored as tile types and rendered by `drawTile()`.

## Choosing The Right Pattern

Use a tile type when:

- The thing repeats across the map.
- It is terrain.
- It fits one tile.
- It should be drawn underneath characters.

Examples: `grass`, `path`, `water`, `flowers`, `tallGrass`.

Use a scene object when:

- The thing spans multiple tiles.
- It should draw as one larger object.
- It needs custom art.
- It should sort against characters by its bottom edge.

Examples: `trailBridge`, `trailGate`, `trailRestTable`.

Use an interactable when:

- The player can press Space to inspect it.
- It should block movement.
- It is a door.
- It is a route transition.
- It is a collision footprint for a larger object.

Examples: signs, doors, route triggers, rest-table footprint.

## Basic Interactable Fields

An interactable looks like this:

```js
{
  labelKey: "object.trailRestTable",
  x: 24,
  y: 26,
  solid: true,
  kind: "object",
  conversationKeys: ["object.trailRestTable.line1"],
}
```

Fields:

- `labelKey`: text key for the object name.
- `x`, `y`: tile position.
- `solid`: whether it blocks movement.
- `kind`: behavior category.
- `conversationKeys`: optional dialogue lines.
- `hidden`: optional. If true, `drawInteractables()` skips drawing it.

## Create A Simple Sign

Step 1: Add text:

```js
Object.assign(TEXT.en, {
  "object.routeWarningSign": "Route Warning Sign",
  "sign.routeWarning.line1": "The road is narrow past this point.",
});
```

Add the same keys to `TEXT.ko` and `TEXT.nl`.

Step 2: Add the interactable:

```js
{
  labelKey: "object.routeWarningSign",
  x: 14,
  y: 20,
  solid: true,
  kind: "sign",
  conversationKeys: ["sign.routeWarning.line1"],
}
```

Signs are drawn by `drawSign()` because `drawInteractables()` checks `kind === "sign"`.

## Create A Visual-Only Outdoor Object

Step 1: Add to scene `objects`:

```js
objects: [
  { x: 14, y: 0, w: 7, h: 2, type: "trailGate" },
],
```

Step 2: Add a drawer in `drawOutdoorObject()`:

```js
if (object.type === "trailGate") {
  drawTrailGateObject(x, y, w, h);
  return;
}
```

Step 3: Create the drawing function:

```js
function drawTrailGateObject(x, y, w, h) {
  ctx.fillStyle = "#5f5a4c";
  ctx.fillRect(x + 7, y + 7, 18, h - 4);
  ctx.fillRect(x + w - 25, y + 7, 18, h - 4);

  ctx.fillStyle = "#6b4b2f";
  ctx.fillRect(x + 20, y + 12, w - 40, 9);
}
```

This object is visual only. It does not block movement unless you also add interactables or place solid tiles underneath it.

## Create A Solid Multi-Tile Outdoor Object

Use this for things like tables, shrines, carts, crates, benches, or signs that occupy several tiles.

Step 1: Add text:

```js
Object.assign(TEXT.en, {
  "object.picnicTable": "Picnic Table",
  "object.picnicTable.line1": "A small picnic table is packed with snacks for the road.",
});
```

Step 2: Add the visual object:

```js
objects: [
  { x: 24, y: 26, w: 3, h: 2, type: "picnicTable" },
],
```

Step 3: Add the collision and dialogue footprint:

```js
...createRectInteractions({
  labelKey: "object.picnicTable",
  x: 24,
  y: 26,
  w: 3,
  h: 2,
  conversationKeys: ["object.picnicTable.line1"],
}),
```

`createRectInteractions()` creates one hidden solid interactable per tile in the rectangle. The player can inspect the object from any occupied tile edge, and movement is blocked across the full footprint.

Step 4: Add a drawer:

```js
if (object.type === "picnicTable") {
  drawPicnicTableObject(x, y, w, h);
  return;
}
```

Step 5: Draw the object:

```js
function drawPicnicTableObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 7, y + 13, w - 14, h - 22);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 5, y + 8, w - 10, 20);
}
```

## Create An Interior Object

Interior objects use helpers:

- `placeInteriorObject(scene, x, y, type, labelKey, options)`
- `fillInteriorObject(scene, x, y, w, h, type, labelKey, options)`

Single tile:

```js
placeInteriorObject(yourGuesthouse, 2, 6, "tv", "object.tv");
```

Multi-tile:

```js
fillInteriorObject(yourGuesthouse, 5, 5, 2, 2, "table", "object.familyTable");
```

With dialogue:

```js
fillInteriorObject(travelCenter, 7, 3, 6, 1, "counter", "object.counter", {
  conversationKeys: ["npc.travelGuide.line1", "npc.travelGuide.line2"],
});
```

Interior object drawing is handled by `drawFurnitureObject()` or `drawFurnitureTile()`.

## Add A New Interior Furniture Type

Step 1: Add it to `SOLID_TILES` if placed directly as a tile or used in the interior map.

Step 2: Add it to the list inside `drawInteriorTile()` if needed.

Step 3: Add drawing logic:

```js
if (type === "lamp") {
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 13, y + 8, 6, 18);
  ctx.fillStyle = "#f0d36a";
  ctx.fillRect(x + 8, y + 5, 16, 8);
  return;
}
```

Step 4: Place it:

```js
placeInteriorObject(scene, 3, 4, "lamp", "object.lamp");
```

## Create A Route Object

Route triggers are interactables, not visual scene objects.

```js
...createRouteTriggers({
  labelKey: "object.routeNorth",
  fromX: 18,
  toX: 22,
  y: 0,
  targetSceneId: "trail1",
  targetX: 17,
  targetY: 52,
  targetDir: "up",
}),
```

They are handled by `handleStepTrigger()`.

Visible route markers are drawn by `drawRouteMarker()` only for the center trigger. Side triggers are hidden so the whole exit works without clutter.

## Create A Door Object

Door interactables are created from buildings:

```js
{
  labelKey: `${building.labelKey}.door`,
  sceneId: building.sceneId,
  x: building.doorX,
  y: building.doorY,
  solid: false,
  kind: "door",
}
```

The door's `sceneId` must match an interior scene id.

The destination interior scene must have:

```js
entry: { x, y, dir }
```

The interior exit returns the player through:

```js
exit: {
  returnSceneId: "town",
  returnX: returnBuilding.doorX,
  returnY: returnBuilding.doorY + 1,
  returnDir: "down",
}
```

## Add A New Tile Type

Use this when the object is terrain or repeated one-tile decoration.

Step 1: Place it on the map:

```js
fillMapRect(trailMap, 5, 10, 6, 5, "mud");
```

Step 2: Decide collision:

```js
const SOLID_TILES = new Set([
  "mud",
]);
```

Only add it if movement should be blocked.

Step 3: Draw it in `drawTile()`:

```js
if (type === "mud") drawMud(x, y, tx, ty);
```

Step 4: Add the draw function:

```js
function drawMud(x, y, tx, ty) {
  ctx.fillStyle = "#8a6743";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#5f442c";
  if (seeded(tx, ty) > 0.5) ctx.fillRect(x + 7, y + 12, 10, 3);
}
```

## Collision Rules

Movement is blocked by `isBlocked()`:

- Outside the map is blocked.
- Tiles in `SOLID_TILES` are blocked.
- Building rectangles are blocked except door tiles.
- NPC positions are blocked.
- Interactables with `solid: true` are blocked.

NPC movement uses similar checks in `canNpcMoveTo()`.

If an object should block movement, use either:

- A solid tile type.
- A solid interactable.
- A `createRectInteractions()` footprint.
- A building rectangle.

Do not rely on drawing alone. Visual pixels do not block movement.

## Draw Order

Outdoor draw order:

1. Tiles.
2. Buildings.
3. Outdoor grouped objects.
4. Interactable markers such as signs and route markers.
5. Characters sorted by tile Y.
6. UI.

Interior draw order:

1. Tiles.
2. Interior objects.
3. Characters sorted by tile Y.
4. UI.

If an object appears behind or in front of the wrong thing, check where it is drawn and whether it should be a tile, building, object, or character-like sorted object.

## Object Checklist

- Add text keys in English, Korean, and Dutch.
- Decide tile type, scene object, interactable, building, or route trigger.
- Add visual data to the scene.
- Add collision data if needed.
- Add dialogue with `conversationKeys` if inspectable.
- Add a drawer for new `object.type` values.
- Add tile drawing for new tile types.
- Add solid tiles to `SOLID_TILES` only when movement should be blocked.
- Run `node --check .\game.js`.

## Common Mistakes

- Adding a visual object but no collision footprint.
- Adding a collision footprint but no visual object.
- Adding `conversationKeys` without adding the text keys.
- Adding an object `type` but not handling it in `drawOutdoorObject()`.
- Making every tile of a route marker visible instead of hiding side triggers.
- Placing an NPC on a solid object tile.
- Using `setTile()` on a future scene map instead of `setMapTile()`.
