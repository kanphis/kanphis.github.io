# kanphis.github.io

The GitHub Pages user site. Three jobs:

1. **Personal landing** (`index.html`) — the penguin's face — eyes, beak
   and the white belly — anchored to the bottom-right corner, beak-gradient
   accents. No top
   bar: just the wordmark, the tagline, a link to `/projects/` and a
   floating RU + EN switch. The choice is kept in `localStorage`, so it
   survives navigation between the pages (`?lang=` / `#lang` still override
   it; without JavaScript both languages stay visible).
2. **`/projects/`** — project cards; KPuzzle links live here, not on the
   front page.
3. **Deep-link plumbing** — `.well-known/assetlinks.json` for Android App
   Links verification, and `404.html` redirecting the legacy `/KPuzzle-web/…`
   prefix to `/KPuzzle/…` (GitHub Pages serves the root `404.html` with a
   404 status for every unmatched path; browsers render it and the script
   forwards the deep path). `/KPuzzle/…` itself is served by the KPuzzle
   repo's own project pages and never reaches this site.

Static files only: no build step, no service worker on purpose (the stub
must always reflect edits immediately, and caching would complicate
assetlinks updates).

## Files

```
.nojekyll                     GitHub Pages must serve dot-directories
index.html                    landing
projects/index.html           projects page
404.html                      /KPuzzle-web/* redirector + styled 404
lang.js                       RU/EN switch: ?lang= or # > localStorage > browser locale
style.css                     shared styles (palette from the avatar)
favicon.svg                   the avatar clipped to a circle (favicon)
penguin-face-sparkle.svg      the avatar's face: eyes, beak, white belly (watermark)
penguin-face-smile.svg        the same face, closed smiling eyes (watermark on /projects/)
penguin-face-empty.svg        the same face, blank eyes without pupils (watermark on the 404)
kpuzzle-icon.svg              the app icon: light launcher colors on a rounded tile
badge-google-play-en/ru.svg   official Google Play badges
badge-rustore.svg             official RuStore dark button
fonts/inter_variable.ttf      Inter variable, same TTF as the app ships
fonts/OFL.txt                 the font's license
.well-known/assetlinks.json   Android App Links verification
```

## Design notes

- Palette: body gradient `#000084 → #000064`, beak gradient
  `#FFD100 → #FF5E4A` — the only accent, used for the primary buttons,
  the 404 numerals, selection and focus rings. Everything else is white
  at varying opacity.
- `penguin-face-sparkle.svg` is the avatar reduced to the face: the white belly
  ellipse with the beak and the two eyes on top. The navy body is left out
  so the mark floats straight on the page's own navy — the eyes keep their
  pupils readable against the white of the eye, not the ground. The mood
  varies per page: the landing shows the ordinary sparkle-eyed penguin,
  `/projects/` the smiling one (`penguin-face-smile.svg`), the 404 the
  blank-staring one (`penguin-face-empty.svg`); all three share the same
  face-only crop. On scrollable pages
  the mark anchors to the document (`.watermark.scrolls`), so text never
  crosses it. Do not blend the watermark with `mix-blend-mode`: screen over
  the blue backdrop cannot lower the blue channel, so warm hues turn to
  pastel mud.
- Gradient buttons carry no border, not even a transparent one: WebKit
  paints the gradient under the border-box and bleeds the far gradient end
  through the element's edges. The ghost buttons draw their outline with an
  inset box-shadow instead.
- `kpuzzle-icon.svg` renders the app icon the way the light launcher does:
  the `ic_launcher_background` light literal (#DEE1FF, the light
  primaryContainer) behind the foreground glyph in its light literals.
- Store badges are the official assets (user-provided Google Play badge
  SVGs and the RuStore dark button). RuStore is shown only when the page
  language is Russian.
- Typography: Inter variable with `tnum, ss01` features and −0.02 em
  tracking on large headings, matching the KPuzzle app.

## Deploy

Push to `main`; Pages publishes in ~1 minute. Verify:

```bash
curl -fsS https://kanphis.github.io/.well-known/assetlinks.json | python3 -m json.tool
curl -fsSI https://kanphis.github.io/KPuzzle-web/sudoku | grep -i http/   # expect 404 status...
curl -fsS https://kanphis.github.io/KPuzzle-web/sudoku | head -3          # ...but redirector markup
```

If the JSON 404s: check that `.nojekyll` was pushed and the path case is
exactly `.well-known/`.
