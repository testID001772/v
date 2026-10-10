(() => {
  /* ===================================================================
     Site configuration
     =================================================================== */

  /* Background-music level used the first time somebody visits (0–1).
     After that the visitor's own slider position is restored. */
  const DEFAULT_VOLUME = 0.35;

  const MUSIC_KEY = 'bt-panel-background-music';
  const VOLUME_KEY = 'bt-panel-music-volume';

  const readStored = (key) => {
    try { return window.localStorage.getItem(key); } catch { return null; }
  };
  const writeStored = (key, value) => {
    try { window.localStorage.setItem(key, value); } catch { /* preference just won't persist */ }
  };

  /* ===================================================================
     Hero background video
     =================================================================== */
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    // Background video: muted autoplay loop that keeps itself running 24/7.
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('disablepictureinpicture', '');
    heroVideo.setAttribute('disableremoteplayback', '');

    const motionPreference = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = () => Boolean(motionPreference && motionPreference.matches);
    const keepPlaying = () => {
      if (reducedMotion() || document.hidden || !heroVideo.paused) return;
      const request = heroVideo.play();
      if (request && typeof request.catch === 'function') request.catch(() => {});
    };
    const updateHeroVideo = () => {
      if (reducedMotion()) { heroVideo.pause(); return; }
      keepPlaying();
    };

    updateHeroVideo();
    // Recover from anything that stops playback.
    ['loadeddata', 'canplay', 'pause', 'stalled', 'suspend', 'waiting', 'emptied'].forEach((name) =>
      heroVideo.addEventListener(name, () => window.setTimeout(keepPlaying, 150)));
    heroVideo.addEventListener('ended', () => { heroVideo.currentTime = 0; keepPlaying(); });
    heroVideo.addEventListener('error', () => {
      // One reload attempt if the file failed to load (flaky network).
      if (!heroVideo.dataset.retried) { heroVideo.dataset.retried = '1'; heroVideo.load(); keepPlaying(); }
    });
    document.addEventListener('visibilitychange', keepPlaying);
    window.addEventListener('pageshow', keepPlaying);
    window.addEventListener('focus', keepPlaying);
    // Browsers that block autoplay (e.g. Low Power Mode) start it on the first touch/click/key.
    ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((name) =>
      window.addEventListener(name, keepPlaying, { once: true, passive: true }));
    // Safety net: if it ever stalls, nudge it every few seconds.
    window.setInterval(keepPlaying, 5000);
    if (motionPreference && typeof motionPreference.addEventListener === 'function') {
      motionPreference.addEventListener('change', updateHeroVideo);
    }
  }

  /* ===================================================================
     Launch countdown
     =================================================================== */
  const launchDate = new Date('2027-03-07T00:00:00');
  const countdown = document.getElementById('countdown');
  const liveMessage = document.getElementById('launch-live');

  if (countdown) {
    const units = {
      days: document.getElementById('days'),
      hours: document.getElementById('hours'),
      minutes: document.getElementById('minutes'),
      seconds: document.getElementById('seconds')
    };
    let timer;

    const updateCountdown = () => {
      const remaining = launchDate.getTime() - Date.now();
      if (remaining <= 0) {
        Object.values(units).forEach((element) => {
          if (element) element.textContent = '00';
        });
        if (liveMessage) liveMessage.textContent = 'We’re live. Thanks for being here.';
        if (timer) window.clearInterval(timer);
        return;
      }

      const values = {
        days: Math.floor(remaining / 86_400_000),
        hours: Math.floor((remaining % 86_400_000) / 3_600_000),
        minutes: Math.floor((remaining % 3_600_000) / 60_000),
        seconds: Math.floor((remaining % 60_000) / 1_000)
      };
      Object.entries(values).forEach(([unit, value]) => {
        if (units[unit]) units[unit].textContent = String(value).padStart(2, '0');
      });
    };

    updateCountdown();
    if (launchDate.getTime() > Date.now()) timer = window.setInterval(updateCountdown, 1000);
  }

  /* ===================================================================
     Contact form (preview only — nothing is sent or stored)
     =================================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name');
      const status = document.getElementById('contact-status');
      if (!name || !status || !contactForm.reportValidity()) return;
      const safeName = name.value.trim() || 'there';
      status.textContent = `Thanks, ${safeName}. This preview does not send or store messages.`;
      contactForm.reset();
    });
  }

  /* ===================================================================
     Background music + volume control
     =================================================================== */
  const soundButton = document.getElementById('sound-toggle');
  const backgroundMusic = document.getElementById('background-music');
  const volumeSlider = document.getElementById('volume-slider');
  const volumeReadout = document.querySelector('[data-volume-value]');

  if (backgroundMusic) {
    const clampVolume = (value) => Math.min(1, Math.max(0, value));

    let volume = clampVolume(Number.parseFloat(readStored(VOLUME_KEY)));
    if (!Number.isFinite(volume)) volume = DEFAULT_VOLUME;

    // Apply the level every time it matters: some browsers reset it when a
    // fresh media element is loaded, and `preload="none"` defers that load.
    const applyVolume = () => {
      if (Number.isFinite(volume)) backgroundMusic.volume = volume;
    };

    const renderVolume = () => {
      const percent = Math.round(volume * 100);
      if (volumeSlider) {
        volumeSlider.value = String(percent);
        volumeSlider.setAttribute('aria-valuetext', `${percent} percent`);
      }
      if (volumeReadout) volumeReadout.textContent = `${percent}%`;
    };

    const renderSoundState = (isPlaying) => {
      if (!soundButton) return;
      soundButton.setAttribute('aria-pressed', String(isPlaying));
      soundButton.setAttribute('aria-label', isPlaying ? 'Turn background music off' : 'Turn background music on');
      const soundLabel = soundButton.querySelector('[data-sound-label]');
      if (soundLabel) soundLabel.textContent = isPlaying ? 'Music on' : 'Music off';
    };

    applyVolume();
    renderVolume();
    ['loadedmetadata', 'durationchange', 'play', 'playing', 'volumechange'].forEach((name) =>
      backgroundMusic.addEventListener(name, applyVolume));

    const play = () => backgroundMusic.play()
      .then(() => renderSoundState(true))
      .catch(() => renderSoundState(false));

    if (readStored(MUSIC_KEY) !== 'off') play();
    else renderSoundState(false);

    if (soundButton) {
      soundButton.addEventListener('click', () => {
        if (!backgroundMusic.paused) {
          backgroundMusic.pause();
          writeStored(MUSIC_KEY, 'off');
          renderSoundState(false);
          return;
        }
        backgroundMusic.play().then(() => {
          writeStored(MUSIC_KEY, 'on');
          renderSoundState(true);
        }).catch(() => renderSoundState(false));
      });
    }

    if (volumeSlider) {
      const commitVolume = (rawValue) => {
        const next = clampVolume(Number.parseFloat(rawValue) / 100);
        if (!Number.isFinite(next)) return;
        volume = next;
        applyVolume();
        renderVolume();
        writeStored(VOLUME_KEY, String(volume));
      };
      // Live feedback while dragging, persisted once the drag ends.
      volumeSlider.addEventListener('input', () => {
        const next = clampVolume(Number.parseFloat(volumeSlider.value) / 100);
        if (!Number.isFinite(next)) return;
        volume = next;
        applyVolume();
        const percent = Math.round(volume * 100);
        volumeSlider.setAttribute('aria-valuetext', `${percent} percent`);
        if (volumeReadout) volumeReadout.textContent = `${percent}%`;
      });
      volumeSlider.addEventListener('change', () => commitVolume(volumeSlider.value));
    }

    // Keep the level in sync if it is changed in another tab.
    window.addEventListener('storage', (event) => {
      if (event.key !== VOLUME_KEY || event.newValue === null) return;
      const next = clampVolume(Number.parseFloat(event.newValue));
      if (!Number.isFinite(next)) return;
      volume = next;
      applyVolume();
      renderVolume();
    });
  }

  /* ===================================================================
     Card theme: black / white
     =================================================================== */
  const cardButton = document.getElementById('card-toggle');
  if (cardButton) {
    const cardLabel = cardButton.querySelector('[data-card-label]');
    const root = document.documentElement;
    const renderCards = () => {
      const white = root.getAttribute('data-cards') === 'white';
      cardButton.setAttribute('aria-pressed', String(white));
      cardButton.setAttribute('aria-label', white ? 'Switch cards to black' : 'Switch cards to white');
      if (cardLabel) cardLabel.textContent = white ? 'Cards: White' : 'Cards: Black';
    };
    renderCards();
    cardButton.addEventListener('click', () => {
      const next = root.getAttribute('data-cards') === 'white' ? 'black' : 'white';
      root.setAttribute('data-cards', next);
      writeStored('bt-panel-card-style', next);
      renderCards();
    });
  }
})();
