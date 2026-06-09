# Korea Adventure

Korea Adventure is a browser-based mini game for learning Korean. It runs from the files in this folder and does not require a build step.

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

## Notes

- No installation is needed.
- Keep the `.mp3`, `data`, `game.js`, `styles.css`, and `index.html` files together in the same project folder.
- Music starts after the first key press because browsers require user input before playing audio.
