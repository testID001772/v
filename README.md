# BT Panel — Coming Soon

A static HTML/CSS/JavaScript site for BT Panel with Home, About, FAQ, and Contact pages. The homepage has a live launch countdown, no email reminder signup, and a video-only AI-generated hero background over a dark CSS theme.

## Files

- `index.html`, `about.html`, `faq.html`, `contact.html` — page markup
- `styles.css` — shared responsive design and header audio control
- `site.js` — launch countdown, background-music playback and hero-video reduced-motion behavior, and client-side Contact form confirmation
- `assets/bt-panel-hero-bg.mp4` — 5-second, 1280×720 silent AI-generated background loop
- `assets/bt-panel-ambient.mp3` — one continuous 25-minute ambient loop assembled from six sections with gentle crossfades
- `images/bt-panel-logo.png` — BT Panel logo icon
- `manus-routes.json` — route manifest for the managed preview

## Run locally

Keep the folder structure intact, then from this directory run:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000` in a browser. The ZIP includes the hero video locally and the bundled homepage points to `assets/bt-panel-hero-bg.mp4`, so it works after extraction without editing the media path.

The 25-minute, six-section music track attempts to start automatically unless the visitor previously turned it off. Browsers may block audible autoplay until a user click; the Music on/off button in every header can start or stop it, and the choice is stored locally. The hero video autoplays muted and loops. No still image is used behind or in place of the video; if it cannot render, the hero falls back to the dark CSS theme. The countdown targets March 7, 2027, at midnight in the visitor's local timezone. The Contact form is demo-only: it validates and shows a local confirmation but does not send or store submissions. Google Fonts are used when online; system-font fallbacks are provided.

Pterodactyl.io was used only as a general design reference. This remains a BT Panel site with its own name, logo, copy, and assets.
