# BT Panel — Coming Soon

A static HTML/CSS/JavaScript site for BT Panel with Home, About, FAQ, and Contact pages. The homepage has a live launch countdown, no email reminder signup, and a video-only AI-generated hero background over a dark CSS theme.

## Files

- `index.html`, `about.html`, `faq.html`, `contact.html`, `404.html` — page markup
- `styles.css` — shared responsive design, header audio/volume control and the black/white theme
- `site.js` — Discord invite configuration, launch countdown, background-music playback and volume, hero-video reduced-motion behavior, and client-side Contact form confirmation
- `assets/bt-panel-hero-bg.mp4` — 5-second, 1280×720 silent AI-generated background loop
- `assets/bt-panel-ambient.mp3` — one continuous 25-minute ambient loop assembled from six sections with gentle crossfades
- `images/bt-panel-logo.png` — BT Panel logo icon
- `manus-routes.json` — route manifest for the managed preview

## Site configuration

The Discord invite lives in **one place**: the `DISCORD_INVITE` constant at the top of `site.js`.

```js
const DISCORD_INVITE = 'https://discord.gg/REPLACE-ME';
```

Replace `REPLACE-ME` with the real invite code and every Discord link on every page (the
footer “Owner @lie_kg” link) updates at once. The matching `href` in each page’s footer is
only a no-JavaScript fallback. Until it is replaced, `site.js` logs a console warning on load.

## Run locally

Keep the folder structure intact, then from this directory run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. The ZIP includes the hero video locally and the bundled homepage points to `assets/bt-panel-hero-bg.mp4`, so it works after extraction without editing the media path.

The 25-minute, six-section music track attempts to start automatically unless the visitor previously turned it off. Browsers may block audible autoplay until a user click; the Music on/off button in every header can start or stop it, and the choice is stored locally. The volume slider next to it sets the level from 0–100% (35% on a first visit), is keyboard accessible, and remembers its position in local storage across pages and tabs. The hero video autoplays muted and loops. No still image is used behind or in place of the video; if it cannot render, the hero falls back to the dark CSS theme. The countdown targets March 7, 2027, at midnight in the visitor's local timezone. The Contact form is demo-only: it validates and shows a local confirmation but does not send or store submissions. Google Fonts are used when online; system-font fallbacks are provided.

Every page shares the same header (cards theme toggle, volume slider, music toggle) and footer (Discord owner link and “© 2026 BT Panel.”). Inline SVG icons use `fill="currentColor"`, so they follow the black/white card theme automatically, and the header/footer chrome switches with it.

Pterodactyl.io was used only as a general design reference. This remains a BT Panel site with its own name, logo, copy, and assets.
