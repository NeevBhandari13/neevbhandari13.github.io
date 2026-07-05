# Neev Bhandari — Resume Adventure

A personal resume website styled as a Game Boy-era RPG. Visitors walk around
"Neevville" and read the resume by entering buildings and talking to NPCs.
There is also a plain HTML resume and a downloadable one-page PDF for
recruiters in a hurry.

All pixel art is original, generated in code — no Nintendo assets.

## Updating the resume (single source of truth)

**Edit [`js/data.js`](js/data.js), then run:**

```sh
node tools/generate.js
```

- `js/data.js` — every job, project, skill, school, and contact link lives here.
  The game reads it directly, so the game version updates with **no build step**.
- `node tools/generate.js` regenerates the two derived artifacts:
  - `resume.html` — the plain, printable fallback page
  - `assets/Neev-Bhandari-Resume.pdf` — the one-page PDF (printed with headless
    Chrome). **Check it still fits one page after big edits.**

Do not hand-edit `resume.html` or `tools/resume-print.html`; they get overwritten.

Game flavor text (sign posts, NPC dialogue) lives in [`js/map.js`](js/map.js).

## Content rules

- Google Cloud Associate Cloud Engineer cert is **In Progress** — never list as done.
- No phone number anywhere on the site.
- No WAM/GPA.

## Running locally

Any static file server works:

```sh
python3 -m http.server 8321
# then open http://localhost:8321
```

## Structure

```
index.html        game shell (canvas + overlays + skip link)
resume.html       plain resume (GENERATED — do not edit)
assets/…PDF       one-page PDF resume (GENERATED)
css/style.css     retro styling, dialogue/panels/menu, touch controls
js/data.js        ★ resume content — edit this
js/sprites.js     original pixel art, generated in code
js/map.js         town layout, buildings, signs, NPC dialogue
js/engine.js      game loop, movement, camera, click-to-interact
js/dialogue.js    typewriter dialogue box
js/ui.js          start menu + resume panels
js/main.js        input (keyboard/touch) + boot
tools/generate.js regenerates resume.html + PDF from data.js
```

## Controls

- **Move:** arrow keys / WASD / on-screen d-pad (touch)
- **Interact:** Z / Enter / Space / E — or just **click** buildings, signs, and NPCs
- **Menu:** Esc / M / MENU button
