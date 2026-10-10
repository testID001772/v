# Website outcomes

- [x] Responsive BT Panel header and footer across Home, About, FAQ, and Contact pages, using the new BT Panel mark and containing no inherited provider branding or external-resource navigation.
- [x] Home page announces the BT Panel launch, uses a new AI-generated 5-second, 16:9 loopable, autoplaying muted MP4 as its only background media (no still-image poster), and displays an accurate live countdown to 2027-03-07T00:00:00 local time with a completed state.
- [x] Homepage omits the lower “BUILT FOR THE WORLDS YOU RUN / 01 — 04” ticker and the “Simple. Flexible. In your hands.” intro band with its control-panel statement.
- [x] No homepage launch-reminder signup: remove its heading, reminder copy, email field, submit button, submission status, and preview-only privacy note; remove links that pointed to that form.
- [x] About page presents BT Panel’s mission, vision, and operator-focused principles without inherited history or statistics.
- [x] FAQ explains launch timing, supported-game details, plans and licensing, deployment, backups, and support without claiming unverified BT Panel capabilities or directing visitors to a removed signup.
- [x] Contact page contains BT Panel launch-pending contact information and a separate form that confirms locally without sending or storing messages.
- [x] Header and button actions use plain text without emoji-style arrow glyphs, and the homepage has no circular icon-only link.
- [x] The transparent BT Panel PNG logo appears in the shared header, footer, favicon, and portable source bundle.
- [x] Provide one continuous 25-minute ambient instrumental loop assembled from six segments; it attempts autoplay unless the visitor previously turned it off, keeps a clearly labeled keyboard-accessible on/off button on every page, persists the visitor’s choice locally, and lets visitors start playback by clicking if the browser blocks autoplay.
- [x] Static implementation remains responsive, accessible, keyboard-friendly, and readable across common screen sizes.

- [x] Use https://pterodactyl.io only as a general design reference while retaining BT Panel’s own name, logo, copy, and assets.
- [x] `manus-routes.json` restored: the route manifest the README documents now lists all five pages.
- [x] Every page carries a Home / About / FAQ / Contact nav, so no page is orphaned, and the current page is marked with `aria-current="page"`.
- [x] Themed `404.html` for dead links, served automatically by GitHub Pages on the `liekg.qzz.io` domain.
- [x] Discord invite is not a dead link: one `DISCORD_INVITE` constant at the top of `site.js` drives every Discord link on every page, with a console warning while the placeholder is in place.
- [x] Footer on all four pages carries an inline Discord SVG icon plus “Owner @lie_kg”, linking to the invite in a new tab with `rel="noopener"`.
- [x] All six changes are applied consistently to Home, About, FAQ and Contact — shared header controls, footer owner link, theme and volume behavior.
- [x] Inline SVGs use `fill="currentColor"` and a theme-aware ink variable, so icons flip with the white/black card theme; the header/footer chrome follows the same theme.
- [x] Footer copyright reads “© 2026 BT Panel.” on every page.
- [x] Music volume is user-controlled: a keyboard-accessible 0–100% slider in every header, defaulting to 35%, clamped, persisted in local storage and kept in sync across tabs.
