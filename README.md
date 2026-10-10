# BT Panel — Coming Soon

A static HTML/CSS/JavaScript site for BT Panel with Home, About, FAQ, and Contact pages. The homepage has a live launch countdown, no email reminder signup, and a video-only AI-generated hero background over a dark CSS theme.

## Files

- `index.html`, `about.html`, `faq.html`, `contact.html`, `404.html` — page markup
- `styles.css` — shared responsive design, header audio/volume control and the black/white theme
- `site.js` — launch countdown, background-music playback and volume, hero-video reduced-motion behavior, and client-side Contact form confirmation
- `assets/bt-panel-hero-bg.mp4` — 5-second, 1280×720 silent AI-generated background loop
- `images/bt-panel-logo.png` — BT Panel logo icon
- `manus-routes.json` — route manifest for the managed preview

## Discord (closed for now)

Discord is marked “coming soon”. The footer on every page shows a non-clickable “Discord coming soon” label instead of a link. To reopen it later, replace each `<span class="footer-owner is-soon">…</span>` in the five HTML pages with `<a class="footer-owner" href="https://discord.gg/YOUR-CODE" target="_blank" rel="noopener noreferrer">…</a>`.

## Run locally

Keep the folder structure intact, then from this directory run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. The ZIP includes the hero video locally and the bundled homepage points to `assets/bt-panel-hero-bg.mp4`, so it works after extraction without editing the media path.

The 25-minute, six-section music track attempts to start automatically unless the visitor previously turned it off. Browsers may block audible autoplay until a user click; the Music on/off button in every header can start or stop it, and the choice is stored locally. The volume slider next to it sets the level from 0–100% (35% on a first visit), is keyboard accessible, and remembers its position in local storage across pages and tabs. The hero video autoplays muted and loops. No still image is used behind or in place of the video; if it cannot render, the hero falls back to the dark CSS theme. The countdown targets March 7, 2027, at midnight in the visitor's local timezone. The Contact form is demo-only: it validates and shows a local confirmation but does not send or store submissions. Google Fonts are used when online; system-font fallbacks are provided.

Every page shares the same header (cards theme toggle, volume slider, music toggle) and footer (Discord “coming soon” label and “© 2026 BT Panel.”). Inline SVG icons use `fill="currentColor"`, so they follow the black/white card theme automatically, and the header/footer chrome switches with it.

Pterodactyl.io was used only as a general design reference. This remains a BT Panel site with its own name, logo, copy, and assets.
