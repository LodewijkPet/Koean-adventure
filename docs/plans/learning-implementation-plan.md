# Learning Implementation Plan

This note records the first implementation pass for `docs/plan.md` so new learning content stays consistent with the current codebase.

## Current Scope

The first pass implements chapter 1 as reusable drills instead of one-off dialogue:

- Start village:
  - Letter Block Table: Hangul syllable block forging.
  - Sound Fountain: basic Hangul sound-shape recognition.
  - Speaking Bench and Pattern Desk: sentence chunk recognition.
- Route 1:
  - Creek sign: batchim recognition.
  - Name Card Board: `저는 X예요` name-card matching.
  - Object Label Stall: `이건/그건/저건 X이에요` object labels.
  - Action Practice Sign: `저는 X을/를 V어요` action recognition.

This is intentionally recognition-first. The player does not need to produce Korean freely yet.

## Drill Contract

Drills live in `DRILLS` in `game.js`.

Each drill has:

```js
{
  titleKey: "drill.example.title",
  steps: [
    {
      promptKey: "drill.example.1.prompt",
      choices: ["drill.example.1.choice.a"],
      answer: 0,
      correctKey: "drill.example.1.correct",
      incorrectKey: "drill.example.1.incorrect",
    },
  ],
}
```

Every visible key must exist in `TEXT.en`, `TEXT.ko`, and `TEXT.nl`.

Interactables start a drill with:

```js
{
  labelKey: "object.example",
  x: 10,
  y: 12,
  solid: true,
  kind: "sign",
  drillKey: "exampleDrill",
}
```

Interior objects can use:

```js
fillInteriorObject(scene, 5, 8, 2, 2, "table", "object.example", {
  drillKey: "exampleDrill",
});
```

## Next Content

The next implementation should add:

- A Route 1 backpack check drill for `있어요` and `없어요`.
- A search-field event where object presence changes in the map.
- A Start Village gate test that chains reading, batchim, chunks, and sentence rhythm.
- Progress tracking so passed drills can unlock the next route or badge.

Avoid adding counters, time, restaurant orders, honorific depth, or tense before this first chapter has a complete gate test.
