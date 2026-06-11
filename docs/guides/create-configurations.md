# How To Create Configurations

This guide explains the configuration patterns currently used by the game: music, language text, speech, map constants, colors, tiles, menu settings, and scene-level configuration.

Most game configuration still lives in `game.js`, with speech provider configuration split into `tts.js`.

## Configuration Areas

Current configuration lives in these places:

- `TILE`, `WORLD_WIDTH`, `WORLD_HEIGHT`
- `COLORS`
- `MUSIC_TRACKS`
- `musicState`
- `LANGUAGES`
- Speech language tags and voice-provider hints in `tts.js`
- `TEXT`
- `settings`
- `ui`
- `mainMenuItems`
- `settingsRows`
- `SOLID_TILES`
- Scene fields such as `areaKey` and `musicKey`

## Music Configuration

Music files are mapped by key:

```js
const MUSIC_TRACKS = {
  intro: "Intro.mp3",
  town1: "Town1.mp3",
  town2: "Town2.mp3",
  trail1: "Trail1.mp3",
  trail2: "Trail2.mp3",
};
```

Scenes select music with `musicKey`:

```js
musicKey: "trail1",
```

Rules:

- The `musicKey` must match a key in `MUSIC_TRACKS`.
- The file must exist relative to `index.html`.
- Browser autoplay is blocked, so music starts after the first keyboard input.
- Current volume is controlled by `musicState.volume`.

To add a new track:

```js
const MUSIC_TRACKS = {
  forest1: "Forest1.mp3",
};
```

Then use:

```js
musicKey: "forest1",
```

Do not store file names directly in scenes. Use keys so renaming files is centralized.

## Language Configuration

The game supports:

```js
const LANGUAGES = [
  { code: "en", key: "language.english" },
  { code: "ko", key: "language.korean" },
  { code: "nl", key: "language.dutch" },
];
```

Text is read with:

```js
t("area.haneulTown")
```

Text keys live in `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.

Pattern:

```js
Object.assign(TEXT.en, {
  "area.trail2": "East Trail",
});

Object.assign(TEXT.ko, {
  "area.trail2": "...",
});

Object.assign(TEXT.nl, {
  "area.trail2": "Oostpad",
});
```

Rules:

- Use the same key in every language.
- Never hardcode display text inside scene data.
- `labelKey`, `areaKey`, `nameKey`, and `conversationKeys` should point to text keys.
- English is the fallback. If a key is missing in Korean or Dutch, English is shown.
- Missing English keys show the key name itself, which is useful for debugging but bad for finished content.

## Text Key Naming

Use prefixes:

- `area.*` for scene names.
- `object.*` for buildings, signs, doors, furniture, route objects, and props.
- `npc.*` for NPC names and NPC dialogue.
- `sign.*` for sign dialogue.
- `route.*` for route warnings or pending destination text.
- `menu.*` for menu labels.
- `settings.*` for settings labels.
- `panel.*` for info-panel labels.

Examples:

```js
"area.haneulTrail": "North Trail"
"object.trailRestTable": "Trail Rest Table"
"object.trailRestTable.line1": "A rest table holds a folded route map, a water jar, and two cups."
"npc.trailKeeper.line1": "The bridge ahead is old, but the footboards still hold."
"sign.trailNorth.line1": "North: Town 2."
"route.town2.pending": "Town 2 lies beyond the ridge. The gate stones are being set."
```

## Primary, Secondary, And Speech Settings

Current defaults:

```js
const settings = {
  primary: "en",
  secondary: "ko",
  speech: "ko",
};
```

Meaning:

- `primary`: normal text language.
- `secondary`: language shown while the translation key is held.
- `speech`: language used for spoken NPC dialogue.

The current input pattern:

- Hold `T` to show secondary language.
- Press `Enter` to open menu.
- Use settings menu to cycle primary, secondary, and speech language.

## Adding A New Language

To add a language:

1. Add it to `LANGUAGES`.
2. Add a speech tag to `LANGUAGE_TAGS` in `tts.js`.
3. Add voice hints to `EDGE_NATURAL_VOICE_HINTS` in `tts.js` if useful.
4. Add a new `TEXT.xx` object or assign block.
5. Add `"language.xx"` labels in all language groups.
6. Test primary, secondary, and speech settings.

Example:

```js
const LANGUAGES = [
  { code: "fr", key: "language.french" },
];

const LANGUAGE_TAGS = {
  fr: "fr-FR",
};

Object.assign(TEXT.en, {
  "language.french": "French",
});
```

The language code must match the key used in `settings`.

## Speech Voice Configuration

Voice selection uses:

- `LANGUAGE_TAGS` in `tts.js`
- `EDGE_NATURAL_VOICE_HINTS` in `tts.js`
- Provider fallback settings in `tts.js`
- NPC `voiceGender`
- NPC `voiceId`

NPC example:

```js
{
  nameKey: "npc.trailKeeper",
  voiceGender: "male",
  voiceId: "trailKeeper",
}
```

Rules:

- Use stable `voiceId` values.
- Use `voiceGender` as a hint, not a guarantee.
- The demo keeps the lower-quality Edge desktop fallback enabled; later it can become a slow-provider backup.
- `tts.js` prefers high-quality Edge natural voices when online and can fall back to generic native browser voices when offline.
- Browser voices vary by system.
- If speech is unavailable, dialogue still appears as text.

## Tile And Map Configuration

Core tile size:

```js
const TILE = 32;
```

Town 1 dimensions:

```js
const WORLD_WIDTH = 42;
const WORLD_HEIGHT = 35;
```

New self-contained scenes should use local width and height values:

```js
const width = 34;
const height = 54;
const trailMap = createTileMap(width, height, "grass");
```

Avoid changing `TILE` unless you want to rebalance every sprite, tile, object, and UI coordinate. The current art is built around 32-pixel tiles.

## Color Configuration

Core palette lives in `COLORS`:

```js
const COLORS = {
  grass: "#8fcf63",
  path: "#d9bd7a",
  water: "#3c8dca",
  roofRed: "#b44f4e",
};
```

Use `COLORS` for repeated semantic colors such as terrain, roofs, panels, and doors.

Inline colors are acceptable for one-off object details, but repeated colors should move into `COLORS`.

## Solid Tile Configuration

`SOLID_TILES` controls tile collision:

```js
const SOLID_TILES = new Set([
  "water",
  "stone",
  "hedge",
  "tree",
  "ledge",
]);
```

If you add a new tile type:

- Add it to `SOLID_TILES` if it should block movement.
- Do not add it if it should be walkable.
- Add drawing logic in `drawTile()`.
- Add a draw function if the tile needs custom art.

Example:

```js
if (type === "mud") drawMud(x, y, tx, ty);
```

## Scene Configuration

Every scene should define:

```js
{
  id: "trail1",
  kind: "outdoor",
  map,
  width,
  height,
  buildings: [],
  objects: [],
  interactables: [],
  npcs: [],
  areaKey: "area.haneulTrail",
  musicKey: "trail1",
}
```

Interior scenes also define:

```js
entry: { x, y, dir }
exit: { x, y, returnSceneId, returnX, returnY, returnDir }
```

Scene rules:

- `id` must be unique.
- `kind` should be `outdoor` or `interior`.
- `areaKey` must exist in the text config.
- `musicKey` should exist in `MUSIC_TRACKS`.
- Arrays should exist even when empty.

## Menu Configuration

Main menu items:

```js
const mainMenuItems = [
  { key: "menu.return", action: "return" },
  { key: "menu.settings", action: "settings" },
  { key: "menu.quit", action: "quit" },
];
```

Settings rows:

```js
const settingsRows = ["primary", "secondary", "speech", "back"];
```

If adding a setting:

1. Add a key to `settings`.
2. Add the row to `settingsRows`.
3. Update `drawSettingsMenu()`.
4. Update `selectMenuItem()` and `adjustCurrentSetting()`.
5. Add translation keys.

## Route Configuration

Routes are data-driven through `createRouteTriggers()`.

Example:

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

Rules:

- Route trigger tiles should be passable.
- Route trigger range should match the visual path width.
- Target coordinates should be passable in the destination scene.
- Future targets can be referenced before the scene exists.
- Add `conversationKeys` for future targets so players know the route is not ready.

## Configuration Checklist

- Use constants for repeated concepts.
- Use text keys for all visible strings.
- Add every text key in English, Korean, and Dutch.
- Use scene `musicKey` values that exist in `MUSIC_TRACKS`.
- Use `SOLID_TILES` for tile collision, not custom collision checks.
- Keep scene ids stable.
- Keep object `type` values stable after renderers depend on them.
- Run `node --check .\game.js` after edits.

## Common Mistakes

- Adding a scene `musicKey` that has no `MUSIC_TRACKS` entry.
- Adding a text key only in English.
- Changing `WORLD_WIDTH` or `WORLD_HEIGHT` expecting it to resize every future scene.
- Adding a solid visual object but forgetting its collision footprint.
- Adding a new setting row without updating menu selection logic.
- Hardcoding display text inside scene arrays.
