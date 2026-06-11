# How To Create An Order Drill

Order drills are sentence-builder steps. The player arranges Korean chunks into the correct sentence order.

## Static Step

Add an order step inside any drill:

```js
{
  kind: "order",
  promptKey: "drill.town4ScheduleOrder.prompt",
  chunks: ["저는", "두 시에", "가요"],
  correctKey: "drill.order.correct",
  incorrectKey: "drill.order.incorrect",
  wordIds: ["word.du", "word.si", "word.gayo"],
  teaches: ["time.at"],
}
```

Rules:

- `chunks` are the correct order. The engine shuffles them for play.
- `correctKey` and `incorrectKey` may use the generic `drill.order.*` keys.
- Incorrect feedback receives `{answer}` automatically, built from `chunks.join(" ")`.
- Add `wordIds` and `hangulItemIds` when the step should update dictionary mastery.

## Generated Steps

Register sentence templates from the owning chapter file:

```js
window.KA.drills.sentences.register("town4", [
  {
    chunks: ["저는", "두 시에", "가요"],
    wordIds: ["word.du", "word.si", "word.gayo"],
    teaches: ["time.at"],
  },
]);
```

Then use the generator in a drill:

```js
window.KA.drills.register({
  town4ScheduleBuilder: {
    titleKey: "drill.town4ScheduleBuilder.title",
    stepCount: 4,
    generateSteps: () =>
      window.KA.drills.questions.generateOrderStepsFromTemplates({
        chapterIds: ["town4"],
        count: 4,
      }),
  },
});
```

The generator prefers templates whose `wordIds` are unseen or not yet mastered.

## Controls

- Left/right moves across the active row.
- Up/down switches between placed chunks and available chunks.
- Space places an available chunk or returns a placed chunk.
- Enter submits after every chunk is placed.
- Escape exits the drill.

## Verification

Run:

```powershell
node --check <changed-file.js>
node tools/smoke-test.js
```

The smoke test includes an engine-owned order-drill path that checks correct submission, incorrect feedback, and rendering.
