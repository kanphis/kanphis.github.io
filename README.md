# kanphis.github.io

The GitHub Pages user site. Three jobs:

1. **Personal landing** (`index.html`) — the owner's penguin avatar as a
   giant translucent watermark, beak-gradient accents. RU + EN with a
   client-side language switch (same mechanics as the KPuzzle web app's
   `privacy.html`: `?lang=` / `#lang` override the browser locale, no
   storage, both languages visible without JavaScript).
2. **`/projects/`** — project cards; KPuzzle links live here, not on the
   front page.
3. **Deep-link plumbing** — `.well-known/assetlinks.json` for Android App
   Links verification, and `404.html` redirecting `/KPuzzle/…` →
   `/KPuzzle-web/…` (GitHub Pages serves the root `404.html` with a 404
   status for every unmatched path; browsers render it and the script
   forwards the deep path).

Static files only: no build step, no service worker on purpose (the stub
must always reflect edits immediately, and caching would complicate
assetlinks updates).

## Files

```
.nojekyll                     GitHub Pages must serve dot-directories
index.html                    landing
projects/index.html           projects page
404.html                      /KPuzzle/* redirector + styled 404
style.css                     shared styles (palette from the avatar)
penguin.svg                   the avatar, verbatim (favicon + brand mark)
penguin-ghost.svg             watermark variant of the same geometry
kpuzzle-logo.svg              KPuzzle glyph, light literals hardcoded
fonts/inter_variable.ttf      Inter variable, same TTF as the app ships
fonts/OFL.txt                 the font's license
.well-known/assetlinks.json   Android App Links verification
```

## Design notes

- Palette: body gradient `#000084 → #000064`, beak gradient
  `#FFD100 → #FF5E4A` — the only accent, used for the primary buttons,
  the 404 numerals, selection and focus rings. Everything else is white
  at varying opacity.
- `penguin-ghost.svg` is `penguin.svg` redrawn as translucent line art
  (same paths); the beak keeps full-strength gradient.
- `kpuzzle-logo.svg` is the KPuzzle `favicon.svg` with the
  `prefers-color-scheme: dark` branch stripped so the glyph always stays
  light and legible on this site's dark background.
- Typography: Inter variable with `tnum, ss01` features and −0.02 em
  tracking on large headings, matching the KPuzzle app.

## Deploy

Push to `main`; Pages publishes in ~1 minute. Verify:

```bash
curl -fsS https://kanphis.github.io/.well-known/assetlinks.json | python3 -m json.tool
curl -fsSI https://kanphis.github.io/KPuzzle/sudoku | grep -i http/   # expect 404 status...
curl -fsS https://kanphis.github.io/KPuzzle/sudoku | head -3          # ...but redirector markup
```

If the JSON 404s: check that `.nojekyll` was pushed and the path case is
exactly `.well-known/`.
