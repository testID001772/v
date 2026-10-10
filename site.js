(() => {
  const launchDate = new Date('2027-03-07T00:00:00');
  const countdown = document.getElementById('countdown');
  const liveMessage = document.getElementById('launch-live');

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

  const soundButton = document.getElementById('sound-toggle');
  const backgroundMusic = document.getElementById('background-music');
  if (soundButton && backgroundMusic) {
    const soundLabel = soundButton.querySelector('[data-sound-label]');
    const preferenceKey = 'bt-panel-background-music';
    let savedPreference = null;
    try {
      savedPreference = window.localStorage.getItem(preferenceKey);
    } catch {
      // Audio controls remain usable if browser storage is unavailable.
    }

    const renderSoundState = (isPlaying) => {
      soundButton.setAttribute('aria-pressed', String(isPlaying));
      soundButton.setAttribute('aria-label', isPlaying ? 'Turn background music off' : 'Turn background music on');
      if (soundLabel) soundLabel.textContent = isPlaying ? 'Music on' : 'Music off';
    };
    const savePreference = (value) => {
      try {
        window.localStorage.setItem(preferenceKey, value);
      } catch {
        // Playback continues even when the preference cannot be persisted.
      }
    };

    backgroundMusic.volume = 0.18;
    renderSoundState(false);
    if (savedPreference !== 'off') {
      backgroundMusic.play().then(() => renderSoundState(true)).catch(() => renderSoundState(false));
    }

    soundButton.addEventListener('click', () => {
      if (!backgroundMusic.paused) {
        backgroundMusic.pause();
        savePreference('off');
        renderSoundState(false);
        return;
      }
      backgroundMusic.play().then(() => {
        savePreference('on');
        renderSoundState(true);
      }).catch(() => renderSoundState(false));
    });
  }

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
      try { window.localStorage.setItem('bt-panel-card-style', next); } catch { /* choice just won't persist */ }
      renderCards();
    });
  }
})();
