# Agent Handoff

This project is a browser-based Korean learning mini-game. Continue from the current Town 1 Hangul-basics work unless the user explicitly redirects you.

## Start Here

Read these first:

1. `docs/town1-hangul-basics-plan.md`
2. `docs/learning-implementation-plan.md`
3. `docs/create-a-drill.md`
4. `docs/create-objects.md`

Use `docs/town1-hangul-basics-plan.md` as the active source of truth for the next Town 1 improvements.

## Current Town 1 State

The latest implemented feature is the elementary school in Town 1.

Important `game.js` anchors:

- Text keys for the school and study boards: search `area.elementarySchool`.
- Study-board data: search `const STUDY_BOARDS`.
- School outdoor building: search `sceneId: "elementarySchool"`.
- School path shaping: search `setTile(7, 9, "path")`.
- School interior: search `const elementarySchool = createInteriorScene`.
- Study-board interactions: search `studyBoardKey`.
- Study-board renderer: search `function drawStudyBoard`.

Do not start by redesigning Town 2. Town 2 already has separate planning files and should stay out of scope unless requested.

## Next Work

The next agent should implement a clean Town 1 quest/progress system before adding more drills.

Recommended order:

1. Add progress flags and quest-level storage.
2. Set flags for entering the school, reading the vowel map, reading the consonant map, and talking to the teacher.
3. Convert the fountain into levelled romanization practice for basic vowels first.
4. Add consonant practice after the consonant map flag.
5. Add classroom desk practice for first syllable combinations.
6. Add blackboard exam checks after practice levels are complete.

Keep the fountain as practice. Keep the blackboard or future gym as exam content.

## Editing Rules

- Use `apply_patch` for manual file edits.
- Keep changes scoped to the requested feature.
- Do not revert user changes.
- Every visible string must have `TEXT.en`, `TEXT.ko`, and `TEXT.nl` entries.
- Use existing helper patterns before adding new systems.
- Keep documents clean and update `docs/town1-hangul-basics-plan.md` when implementation changes the plan.
- Run `node --check .\game.js` after JavaScript edits.

## Browser Verification

For gameplay/UI changes:

1. Start a local server, for example `py -m http.server 8000`.
2. Open the game in the in-app browser.
3. Verify the changed interaction by keyboard through the canvas.
4. Check at least one desktop view.
5. Check mobile layout when board or UI sizing changed.
6. Confirm there are no browser console errors.

The current game does not require a build step.
