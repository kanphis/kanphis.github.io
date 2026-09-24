# kanphis.github.io

The GitHub Pages user site. Three jobs:

1. **Personal landing** (`index.html`) — the owner's penguin avatar as a
   giant translucent watermark, beak-gradient accents. No top bar: just the
   wordmark, the tagline, a link to `/projects/` and a floating RU + EN
   switch. The choice is kept in `localStorage`, so it survives navigation
   between the pages (`?lang=` / `#lang` still override it; without
   JavaScript both languages stay visible).
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
lang.js                       RU/EN switch: ?lang= or # > localStorage > browser locale
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
- `penguin-ghost.svg` is `penguin.svg` redrawn as the face only — the circle
  and the beak; the avatar's squares are left out so the watermark never
  reads as an inscribed square. The beak keeps a strong gradient
  (`fill-opacity` 0.8). Do not blend the watermark with `mix-blend-mode`:
  screen over the blue backdrop cannot lower the blue channel, so warm hues
  turn to pastel mud.
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
