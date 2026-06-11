# WS-AUDIO — music, jingles, SFX, speech polish (A1–A6)

**Owns:** `assets/audio/*`, `src/core/audio.js` (after ENGINE P0 hand-off), audio checks in smoke test. **No new dependencies**: music = audio files; SFX/jingles = WebAudio oscillator synthesis (works offline, zero assets).

## A1 — Music plan & track table (asset production/levy)

Current assets: `Intro.mp3, Town1.mp3, Town2.mp3, Trail1.mp3, Trail2.mp3`. Until a real track exists, map the key to the listed fallback (the game already supports key→file mapping). Track specs: loopable 60–90s, soft melodic, no vocals (TTS must sit on top), -14 LUFS-ish consistent loudness.

| Music key | Area | Mood / instrumentation | Fallback until produced |
| --- | --- | --- | --- |
| `title` | Title screen | warm gayageum arpeggio + pad, hopeful | Intro.mp3 |
| `town1` | Haneul Town | exists | — |
| `trail1/2` | trails | exist | — |
| `town2` | Name City | exists | — |
| `town3` | Number Market | busy market plucks, woodblock percussion | Intro.mp3 (current) |
| `trail3` | Clock Pass | ticking pizzicato | Trail2.mp3 |
| `town4` | Time Town | clockwork waltz 3/4, celesta | Town2.mp3 |
| `town5` | Family Village | warm haegeum lullaby | Town1.mp3 |
| `town6` | Tastetrail | upbeat samulnori-lite kitchen groove | Town2.mp3 |
| `town7` | Station City | locomotive rhythm, brass | Trail1.mp3 |
| `town8` | Campus | bright piano study-pop | Town1.mp3 |
| `town9` | Hospital Coast | calm waves, marimba | Trail2.mp3 |
| `town10` | Lantern Lake | nocturne, soft bells | Intro.mp3 |
| `town11` | Airport | glassy modern pads, announcement-room air | Town2.mp3 |
| `capital` | Capital | grand main-theme reprise | Town1.mp3 |
| `league` | League hall | tense drums + theme fragments | Trail1.mp3 |
| `festival` | festivals overlay | percussion-forward variation hook | Town2.mp3 |
| `joseon` | West region | court music (jongmyo jeryeak flavor) | Intro.mp3 |

- [ ] A1.1 Register all keys with fallbacks now (one `KA.music.registerTracks` block) so content never blocks.
- [ ] A1.2 Produce/acquire tracks license-free; drop into `assets/audio/`, flip mapping lines. Keep files ≤ 2 MB each.

## A2 — Jingles (synthesized, WebAudio)

`KA.sfx.jingle(name)` — short oscillator sequences, no assets:

| Name | Use | Sketch |
| --- | --- | --- |
| `correct` | right answer | maj 3rd blip (C5→E5, 120ms) |
| `wrong` | wrong answer | low buzz (G2 saw, 150ms) |
| `pass` | drill passed | I-IV-V-I arp 600ms |
| `badge` | badge earned | fanfare 1.2s (triad up two octaves) |
| `quest` | quest advance toast | two-note chime |
| `coin` | won gained | square blip pair |
| `letter` | mentor letter | soft bell |
| `door` | scene change | filtered click |

- [ ] A2.1 Tiny synth helper (envelope + note sequencing, master gain).
- [ ] A2.2 Wire hooks: drills answer/complete, badge flag, toast (UI U2 emits events), shop buy (E3), letters (E6).
- [ ] A2.3 Settings: SFX volume (UI U12 slider hook), respect reduced-flash? (no — audio separate toggle: SFX on/off).

## A3 — Music manager upgrades
- [ ] A3.1 Crossfade on scene change (300ms out/in) instead of hard swap.
- [ ] A3.2 **TTS ducking**: while speech plays, music gain →35%, restore after (hook speech.js start/end callbacks).
- [ ] A3.3 Music volume slider (settings field exists? add `settings.musicVolume`, additive save).
- [ ] A3.4 Festival overlay: when festival active (E11), prefer `festival` key variant if registered for the scene.

## A4 — Speech (TTS) QA & voice casting
- [ ] A4.1 Voice cast table: assign stable `voiceGender` per recurring character (rival male youthful, Seo female calm, leaders varied) — document in 14-WS-NARRATIVE cast list; verify Edge natural voices chosen on Windows (sunhi/injoon) and fallbacks sane.
- [ ] A4.2 Rate per context: dialog 0.92 (current), drill prompts 0.85 when speaking (future listening steps), letters 0.9.
- [ ] A4.3 Listening-step support for ENGINE: `KA.speech.speakOnce(text, {rate})` promise API (engine consumes in listening drills).

## A5 — Listening drill audio path
- [ ] A5.1 With A4.3: drill step `speakPromptKo` field — overlay shows 🔊 replay control (R key) instead of the Korean text until answered; after answering reveal text. (Engine logic lives in drills.js — pair with ENGINE via STATUS; AUDIO owns the speech path + replay UX spec.)
- [ ] A5.2 Smoke test: steps with speakPromptKo never leak the answer into the visible prompt.

## A6 — Audio asset hygiene
- [ ] A6.1 Normalize existing five tracks' loudness; trim silence; confirm loop points (fade tail 0.5s acceptable).
- [ ] A6.2 README/credits: track attribution list (NARRATIVE credits screen feed).
