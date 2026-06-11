# Korea Adventure

Korea Adventure is a browser-based RPG for learning Korean from zero. It runs from the files in this folder and does not require a build step.

## Start the Game

### Option 1: Open the HTML file

1. Open this project folder.
2. Double-click `index.html`.
3. The game should open in your default web browser.

### Option 2: Run a local server

Use this option if your browser blocks audio, speech, or local file loading.

1. Open PowerShell in this project folder.
2. Run:

```powershell
py -m http.server 8000
```

3. Open this address in your browser:

```text
http://localhost:8000
```

4. To stop the server, go back to PowerShell and press `Ctrl+C`.

## Controls

- Move: `WASD` or arrow keys
- Interact / continue dialog: `Space`
- Open or close menu: `Enter`
- Choose menu item: `Space`
- Change settings: arrow keys
- Close drills: `Escape`
- Hold translation view: `T`

## Folder Structure

```text
index.html          entry point (open this)
src/                game engine (game.js), speech (tts.js), styles
assets/audio/       music tracks
data/drills/        per-chapter content packs (text, drills, word lists)
docs/design/        the design bible: vision, curriculum, world, quests, NPCs, roadmap
docs/guides/        how-to guides for adding towns, drills, objects
docs/plans/         active working plans
docs/archive/       completed/superseded plans
tools/              smoke test and prototypes
```

## Verify Changes

After editing any JavaScript, run:

```powershell
node tools/smoke-test.js
```

It boots the whole game headlessly and checks scenes, all EN/KO/NL text keys, drill answers, quest/badge flow, saves, and route walkability.

## Notes

- No installation is needed.
- Progress is saved automatically in your browser (localStorage). Use Settings > Erase Save to start over.
- Music starts after the first key press because browsers require user input before playing audio.
- Keep `index.html` together with the `src/`, `assets/`, and `data/` folders.
