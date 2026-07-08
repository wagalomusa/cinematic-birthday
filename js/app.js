/**
 * Cinematic Birthday Experience — Core State Machine
 *
 * Flow: INTRO → STORY → VOICES → SONG → ENDING
 * Voice sub-flow: player skin per person with play / pause / next controls
 * Song sub-flow: play / pause / progress controls, same pattern as voices
 */

const CONFIG = {
  introMessages: [
    'You are not alone, We are here with you...',
    'Just like the sun has illuminated the earth for eternity, may your light never fade!',
  ],
  storySlideDuration: 5000,
  storyTransitionDelay: 800,
  voiceMessages: [
    {
      id: 1,
      speaker: 'Raniah',
      subtitle: 'has something beautiful to say',
      audio: 'audio-raniah',
      portrait: 'assets/images/speakers/Raniah.jpeg',
      skin: 'lavender',
      visualizer: {
        color: 'rgba(200, 180, 255, 0.85)',
        glowColor: 'rgba(180, 150, 255, 0.4)',
        secondaryColor: 'rgba(220, 200, 255, 0.7)',
      },
    },
    {
      id: 2,
      speaker: 'Marie',
      subtitle: 'wants you to know something',
      audio: 'audio-marie',
      portrait: 'assets/images/speakers/Marie.jpeg',
      skin: 'peach',
      visualizer: {
        color: 'rgba(255, 200, 160, 0.85)',
        glowColor: 'rgba(255, 170, 120, 0.4)',
        secondaryColor: 'rgba(255, 220, 190, 0.7)',
      },
    },
    {
      id: 3,
      speaker: 'Bahiga',
      subtitle: 'left you a precious message',
      audio: 'audio-bahiga',
      portrait: 'assets/images/speakers/Bahiga.jpeg',
      skin: 'lilac',
      visualizer: {
        color: 'rgba(224, 184, 240, 0.85)',
        glowColor: 'rgba(200, 150, 230, 0.4)',
        secondaryColor: 'rgba(240, 210, 255, 0.7)',
      },
    },
    {
      id: 4,
      speaker: 'Leylah',
      subtitle: 'has words from the heart',
      audio: 'audio-leylah',
      portrait: 'assets/images/speakers/Leylah.jpeg',
      skin: 'champagne',
      visualizer: {
        color: 'rgba(240, 216, 152, 0.85)',
        glowColor: 'rgba(240, 200, 120, 0.4)',
        secondaryColor: 'rgba(255, 235, 200, 0.7)',
      },
    },
    {
      id: 5,
      speaker: 'Glosh',
      subtitle: 'sent you a special message',
      audio: 'audio-glosh',
      portrait: 'assets/images/speakers/Glosh.jpeg',
      skin: 'sage',
      visualizer: {
        color: 'rgba(180, 214, 190, 0.85)',
        glowColor: 'rgba(150, 200, 165, 0.4)',
        secondaryColor: 'rgba(210, 235, 215, 0.7)',
      },
    },
  ],
  // Full lyric text with exact start timestamps (in seconds), captured
  // by tapping along to the real track. Section markers in [brackets]
  // have no timestamp — they're just visual dividers in the panel.
  songLyrics: [
    '[Verse 1]',
    { t: 15.75, x: 'The calendar circles a bright July line' },
    { t: 22.09, x: 'A beautiful rhythm ahead of the time' },
    { t: 28.85, x: 'The world spun a little more softly today' },
    { t: 34.67, x: 'Like it knew that Munirah was on her way' },
    { t: 40.62, x: 'I watch how you move, how you brighten the room' },
    { t: 47.24, x: 'A quiet dynamic, a flower in bloom' },
    '[Verse 2]',
    { t: 53.62, x: 'There\u2019s a grace in the way that you carry your name' },
    { t: 57.00, x: 'And a spark in your presence that nothing can tame' },
    { t: 60.29, x: 'But it\u2019s those beautiful eyes, clear as the night' },
    { t: 66.21, x: 'Holding a universe, catching the light' },
    { t: 69.39, x: 'And when you laugh, the world stands still for a while' },
    { t: 78.66, x: '\u2019Cause it reaches your eyes, that beautiful smile' },
    '[Chorus]',
    { t: 88.13, x: 'Happy birthday to you, happy birthday to you' },
    { t: 105.25, x: 'Happy birthday, dear Munirah Ali, happy birthday to you' },
    { t: 114.50, x: 'You\u2019re the light that you don\u2019t even know that you shine' },
    { t: 121.27, x: 'The sweetest horizon I\u2019ve happened to meet' },
    { t: 127.47, x: 'Yeah, the world got it right on this day' },
    '[Verse 3]',
    { t: 146.85, x: 'You carry a kindness that\u2019s heavy to find' },
    { t: 153.19, x: 'A thoughtful reflection, incredibly kind' },
    { t: 160.77, x: 'I\u2019m just a witness to all that you are' },
    { t: 164.96, x: 'Counting my blessings from a little afar' },
    { t: 171.67, x: 'Hoping July keeps you safe, keeps you whole' },
    { t: 179.47, x: 'With all of the magic you hold in your soul' },
    '[Chorus]',
    { t: 184.49, x: 'Happy birthday to you, happy birthday to you' },
    { t: 193.78, x: 'Happy birthday, dear Munirah Ali, happy birthday to you' },
    { t: 213.86, x: 'You\u2019re the light that you don\u2019t even know that you shine' },
    { t: 220.48, x: 'The sweetest horizon I\u2019ve happened to meet' },
    { t: 226.82, x: 'Yeah, the world got it right on this day' },
    '[Bridge]',
    '[Vocal Swell]',
    { t: 254.44, x: 'No flashing lights, no crowded noise' },
    { t: 265.33, x: 'Just a wish carried soft in the strength of my voice' },
    { t: 267.69, x: 'Munirah, may your sky remain endlessly clear' },
    { t: 272.16, x: 'I\u2019m so incredibly glad that you\u2019re here...' },
    '[Outro]',
    '[Acoustic Outro]',
    { t: 289.80, x: 'Happy birthday, Munirah Ali...' },
    { t: 297.76, x: 'The melody I keep on repeat.' },
    { t: 304.45, x: 'From the bottom of my heart,' },
    { t: 309.88, x: 'Sham wishes you a happy birthday...' },
    '[Soft guitar strum]',
    '[Fade out to silence]',
  ],
  transitionMessage: 'Another person wanted to tell you something...',
  finalTransitionMessage: "That's everyone who wanted to speak to you...",
  countdownSeconds: 3,
  countdownInterval: 1000,
  transitionDisplayTime: 2500,
  finalTransitionDisplayTime: 4000,
  autoAdvanceOnEnd: true,
  // When the song finishes, automatically move on to the ending scene.
  // Set to false if you'd rather let the person tap "Next" themselves.
  autoAdvanceAfterSong: true,
};

const SCENES = ['intro', 'story', 'voices', 'song', 'ending'];

class CinematicExperience {
  constructor() {
    this.currentScene = 'intro';
    this.currentVoiceIndex = 0;
    this.voiceVisualizer = null;
    this.songVisualizer = null;
    this.isTransitioning = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.progressRAF = null;
    this.currentAudio = null;
    this.nextButtons = [];
    this.introTypewriter = null;
    this.skipIntroAdvance = false;
    this.audioUnlocked = false;
    this.pendingPlayback = null;

    // Song player state
    this.isSongPlaying = false;
    this.isSongPaused = false;
    this.songProgressRAF = null;

    // Song lyrics state
    this.lyricLineEls = [];
    this.lyricTimings = [];
    this.lyricsTimingsComputed = false;
    this.activeLyricIndex = -1;

    // Keeps the screen from auto-locking during playback
    this.wakeLock = null;

    // Bumped every time a new voice message starts loading, so a
    // delayed fallback from an earlier failed message can detect
    // it's stale and avoid interfering with what's currently playing.
    this.voiceGen = 0;
    this.isAdvancingVoice = false;

    this._bindElements();
    this._initVisualizers();
    this._initVoiceDots();
    this._buildLyrics();
    this._bindControls();
    this._bindAudioStateSync();
    this._bindVisibilityHandling();
    this._bindUserGestureUnlock();
    this._start();
  }

  _bindElements() {
    this.scenes = {};
    SCENES.forEach((name) => {
      this.scenes[name] = document.getElementById(`scene-${name}`);
    });

    this.voiceCard = document.getElementById('voice-card');
    this.voiceLabel = document.getElementById('voice-label');
    this.voiceSpeaker = document.getElementById('voice-speaker');
    this.voiceSubtitle = document.getElementById('voice-subtitle');
    this.voicePortrait = document.getElementById('voice-portrait');
    this.voiceTransition = document.getElementById('voice-transition');
    this.transitionMessage = document.getElementById('transition-message');
    this.countdownEl = document.getElementById('countdown');
    this.countdownNumber = document.getElementById('countdown-number');
    this.progressFill = document.getElementById('progress-fill');
    this.timeCurrent = document.getElementById('time-current');
    this.timeDuration = document.getElementById('time-duration');
    this.btnPlay = document.getElementById('btn-play');
    this.btnNext = document.getElementById('btn-next');
    this.iconPlay = this.btnPlay.querySelector('.icon-play');
    this.iconPause = this.btnPlay.querySelector('.icon-pause');
    this.voiceDots = document.getElementById('voice-dots');

    this.storySlides = document.querySelectorAll('.story-slide');
    this.audioSong = document.getElementById('audio-song');
    this.nextButtons = Array.from(document.querySelectorAll('.scene-next-btn'));

    // Song player controls
    this.btnSongPlay = document.getElementById('btn-song-play');
    this.songIconPlay = this.btnSongPlay.querySelector('.icon-play');
    this.songIconPause = this.btnSongPlay.querySelector('.icon-pause');
    this.songProgressFill = document.getElementById('song-progress-fill');
    this.songTimeCurrent = document.getElementById('song-time-current');
    this.songTimeDuration = document.getElementById('song-time-duration');

    this.lyricsContainer = document.getElementById('song-lyrics');
    this.gestureHint = document.getElementById('gesture-hint');
  }

  _initVisualizers() {
    const voiceCanvas = document.getElementById('voice-visualizer');
    const songCanvas = document.getElementById('song-visualizer');

    this.voiceVisualizer = new AudioVisualizer(voiceCanvas, {
      mode: 'wave',
      barCount: 40,
      color: 'rgba(255, 182, 193, 0.85)',
      glowColor: 'rgba(255, 182, 193, 0.35)',
      secondaryColor: 'rgba(200, 180, 255, 0.65)',
    });

    this.songVisualizer = new AudioVisualizer(songCanvas, {
      mode: 'bars',
      barCount: 80,
      color: 'rgba(255, 200, 150, 0.9)',
      glowColor: 'rgba(255, 180, 120, 0.4)',
      secondaryColor: 'rgba(200, 150, 255, 0.7)',
    });
  }

  _initVoiceDots() {
    this.voiceDots.innerHTML = '';
    CONFIG.voiceMessages.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'voice-dot';
      dot.dataset.index = i;
      this.voiceDots.appendChild(dot);
    });
  }

  _updateDots(index) {
    const dots = this.voiceDots.querySelectorAll('.voice-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < index) dot.classList.add('done');
      if (i === index) dot.classList.add('active');
    });
  }

  /* ─── Song Lyrics ─── */

  _buildLyrics() {
    if (!this.lyricsContainer) return;

    this.lyricsContainer.innerHTML = '';
    this.lyricLineEls = [];

    CONFIG.songLyrics.forEach((item) => {
      const el = document.createElement('p');

      if (typeof item === 'string') {
        const trimmed = item.trim();
        el.className = 'lyric-marker';
        el.textContent = trimmed.slice(1, -1);
        this.lyricsContainer.appendChild(el);
        this.lyricLineEls.push({ el, isMarker: true });
      } else {
        el.className = 'lyric-line';
        el.textContent = item.x;
        this.lyricsContainer.appendChild(el);
        this.lyricLineEls.push({ el, isMarker: false, time: item.t });
      }
    });

    this._computeLyricTimings();
  }

  _computeLyricTimings(duration) {
    const timedEntries = [];
    this.lyricLineEls.forEach((entry, index) => {
      if (!entry.isMarker) timedEntries.push({ index, time: entry.time });
    });

    if (!timedEntries.length) return;

    this.lyricTimings = timedEntries.map((entry, order) => {
      const nextTime = order + 1 < timedEntries.length
        ? timedEntries[order + 1].time
        : (duration && isFinite(duration) ? duration : entry.time + 9999);
      return { lineIndex: entry.index, start: entry.time, end: nextTime };
    });

    this.lyricsTimingsComputed = true;
  }

  _updateLyricsHighlight(currentTime, duration) {
    if (!this.lyricsContainer || !this.lyricsTimingsComputed) return;

    // Extend the final line's window once the real song duration
    // is known, instead of the placeholder fallback.
    if (duration && isFinite(duration) && this.lyricTimings.length) {
      this.lyricTimings[this.lyricTimings.length - 1].end = duration;
    }

    let matchIndex = -1;
    for (let i = 0; i < this.lyricTimings.length; i++) {
      const timing = this.lyricTimings[i];
      if (currentTime >= timing.start && currentTime < timing.end) {
        matchIndex = timing.lineIndex;
        break;
      }
    }

    if (matchIndex === -1 && this.lyricTimings.length) {
      const last = this.lyricTimings[this.lyricTimings.length - 1];
      if (currentTime >= last.end) matchIndex = last.lineIndex;
    }

    if (matchIndex === this.activeLyricIndex) return;

    if (this.activeLyricIndex !== -1 && this.lyricLineEls[this.activeLyricIndex]) {
      this.lyricLineEls[this.activeLyricIndex].el.classList.remove('active');
    }

    if (matchIndex !== -1 && this.lyricLineEls[matchIndex]) {
      const activeEl = this.lyricLineEls[matchIndex].el;
      activeEl.classList.add('active');

      const targetScroll = activeEl.offsetTop
        - this.lyricsContainer.clientHeight / 2
        + activeEl.clientHeight / 2;

      this.lyricsContainer.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    this.activeLyricIndex = matchIndex;
  }

  _resetLyrics() {
    if (this.activeLyricIndex !== -1 && this.lyricLineEls[this.activeLyricIndex]) {
      this.lyricLineEls[this.activeLyricIndex].el.classList.remove('active');
    }
    this.activeLyricIndex = -1;
    if (this.lyricsContainer) this.lyricsContainer.scrollTo({ top: 0 });
  }

  _bindControls() {
    this.btnPlay.addEventListener('click', () => this._togglePlayPause());
    this.btnNext.addEventListener('click', () => this._skipToNext());
    this.btnSongPlay.addEventListener('click', () => this._toggleSongPlayPause());

    this.nextButtons.forEach((button) => {
      button.addEventListener('click', () => this._handleNextButton(button));
    });
  }

  /**
   * Keeps our internal play/pause flags and icons honest even when
   * something outside our own controls pauses audio — e.g. the OS
   * suspending playback when the screen locks. Without this, tapping
   * play/pause after an interruption can look "broken" because our
   * flag still thinks it's playing when it isn't.
   */
  _bindAudioStateSync() {
    this.audioSong.addEventListener('pause', () => {
      // A track reaching its natural end also fires 'pause' right
      // before 'ended' — that's not a real interruption, so skip it
      // and let the dedicated onended handler manage what happens next.
      if (this.audioSong.ended) return;

      if (this.isSongPlaying) {
        this.isSongPlaying = false;
        this.isSongPaused = true;
        this._setSongPlayState(false);
        this.songVisualizer.stop();
        this._stopSongProgressLoop();
        this._releaseWakeLock();
      }
    });

    this.audioSong.addEventListener('play', () => {
      if (!this.isSongPlaying) {
        this.isSongPlaying = true;
        this.isSongPaused = false;
        this._setSongPlayState(true);
        this.songVisualizer.start();
        this._startSongProgressLoop();
        this._requestWakeLock();
      }
    });

    CONFIG.voiceMessages.forEach((msg) => {
      const audioEl = document.getElementById(msg.audio);
      if (!audioEl) return;

      audioEl.addEventListener('pause', () => {
        if (this.currentAudio !== audioEl) return;
        // Same fix as the song player — don't treat reaching the end
        // of a message as a manual pause, or auto-advance breaks.
        if (audioEl.ended) return;

        if (this.isPlaying) {
          this.isPlaying = false;
          this.isPaused = true;
          this._setPlayState(false);
          this.voiceCard.classList.remove('playing');
          this.voiceVisualizer.stop();
          this._stopProgressLoop();
          this._releaseWakeLock();
        }
      });

      audioEl.addEventListener('play', () => {
        if (this.currentAudio !== audioEl) return;
        if (!this.isPlaying) {
          this.isPlaying = true;
          this.isPaused = false;
          this._setPlayState(true);
          this.voiceCard.classList.add('playing');
          this.voiceVisualizer.start();
          this._startProgressLoop();
          this._requestWakeLock();
        }
      });
    });
  }

  /**
   * When the tab comes back into the foreground (e.g. after a screen
   * lock or app switch), resume anything the browser auto-suspended
   * so playback recovers gracefully instead of appearing stuck.
   */
  _bindVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;

      this._resumeAudioContext();
      this._reacquireWakeLock();

      if (this.currentAudio && this.isPlaying && this.currentAudio.paused) {
        this.currentAudio.play().catch(() => {
          // Browser may require a fresh tap to resume — the play
          // button will already show the correct (paused) state.
        });
      }

      if (this.audioSong && this.isSongPlaying && this.audioSong.paused) {
        this.audioSong.play().catch(() => {});
      }
    });
  }

  _bindUserGestureUnlock() {
    const unlock = () => {
      if (this.audioUnlocked) return;

      this.audioUnlocked = true;
      this._resumeAudioContext();

      if (this.pendingPlayback === 'voice') {
        this.pendingPlayback = null;
        this._play().catch(() => {});
      } else if (this.pendingPlayback === 'song') {
        this.pendingPlayback = null;
        this._playSong().catch(() => {});
      }
    };

    document.addEventListener('pointerdown', unlock, { once: true, capture: true });
    document.addEventListener('touchstart', unlock, { once: true, capture: true });
    document.addEventListener('click', unlock, { once: true, capture: true });
    document.addEventListener('keydown', unlock, { once: true, capture: true });
  }

  async _requestWakeLock() {
    if (!('wakeLock' in navigator)) {
      console.warn('Wake Lock API not supported in this browser — screen may time out during playback.');
      return;
    }
    if (!window.isSecureContext) {
      console.warn('Wake Lock requires a secure context (https:// or localhost) — it will not work when opening the file directly (file://). Host it on a server to enable this.');
      return;
    }
    if (this.wakeLock) return;

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake lock acquired — screen should stay on during playback.');
      this.wakeLock.addEventListener('release', () => {
        this.wakeLock = null;
      });
    } catch (err) {
      // Can fail (e.g. low battery mode) — playback still works,
      // the screen just might time out during a long message.
      console.warn('Wake lock request failed', err);
    }
  }

  _releaseWakeLock() {
    if (this.wakeLock) {
      this.wakeLock.release().catch(() => {});
      this.wakeLock = null;
    }
  }

  async _reacquireWakeLock() {
    if (this.wakeLock) return;
    const somethingPlaying = (this.currentAudio && !this.currentAudio.paused)
      || (this.audioSong && !this.audioSong.paused);
    if (somethingPlaying) {
      await this._requestWakeLock();
    }
  }

  _start() {
    this._showGestureHint();
    this._runIntro();
  }

  /* ─── Scene Management ─── */

  async _goToScene(sceneName) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const prev = this.scenes[this.currentScene];
    const next = this.scenes[sceneName];

    prev.classList.remove('active');

    await this._wait(1800);

    next.classList.add('active');
    this.currentScene = sceneName;

    await this._wait(400);
    this.isTransitioning = false;
  }

  async _handleNextButton(button) {
    if (this.isTransitioning) return;

    const nextScene = button.dataset.nextScene;
    if (!nextScene) return;

    if (nextScene === 'story' && this.currentScene === 'intro') {
      this.skipIntroAdvance = true;
      this._hideGestureHint();
    }

    if (nextScene === 'intro') {
      await this._goToScene('intro');
      this._runIntro();
      return;
    }

    if (nextScene === 'story') {
      await this._goToScene('story');
      this._runStory();
      return;
    }

    if (nextScene === 'voices') {
      await this._goToScene('voices');
      this._runVoices();
      return;
    }

    if (nextScene === 'song') {
      await this._goToScene('song');
      this._runSong();
      return;
    }

    if (nextScene === 'ending') {
      this._stopSongProgressLoop();
      await this._goToScene('ending');
    }
  }

  /* ─── SCENE 1: Intro ─── */

  _runIntro() {
    const textEl = document.getElementById('typewriter-text');
    const cursorEl = document.getElementById('typewriter-cursor');
    this.skipIntroAdvance = false;

    this._showGestureHint();

    const typewriter = new Typewriter(textEl, cursorEl, {
      speed: 28,
      pauseBetween: 1200,
      chaos: 0.12,
      voiceEnabled: true,
      onComplete: () => {
        this._hideGestureHint();
        if (this.skipIntroAdvance) return;
        this._goToScene('story').then(() => this._runStory());
      },
    });

    this.introTypewriter = typewriter;

    document.addEventListener(
      'click',
      () => {
        if (typewriter.audioContext && typewriter.audioContext.state === 'suspended') {
          typewriter.audioContext.resume();
        }
      },
      { once: true }
    );

    typewriter.typeMessages(CONFIG.introMessages);
  }

  /* ─── SCENE 2: Story ─── */

  async _runStory() {
    for (let i = 0; i < this.storySlides.length; i++) {
      if (i > 0) {
        this.storySlides[i - 1].classList.remove('active');
        await this._wait(CONFIG.storyTransitionDelay);
      }

      this.storySlides[i].classList.add('active');
      await this._wait(CONFIG.storySlideDuration);
    }

    this.storySlides[this.storySlides.length - 1].classList.remove('active');
    await this._wait(1200);

    await this._goToScene('voices');
    this._runVoices();
  }

  /* ─── SCENE 3: Voice Player Skins ─── */

  _runVoices() {
    this.currentVoiceIndex = 0;
    this._resumeAudioContext();
    this._loadVoiceSkin(this.currentVoiceIndex, true);
  }

  _getAudioElement(index) {
    const msg = CONFIG.voiceMessages[index];
    return document.getElementById(msg.audio);
  }

  _applySkin(msg) {
    this.voiceCard.dataset.skin = msg.skin;
    this.voiceVisualizer.color = msg.visualizer.color;
    this.voiceVisualizer.glowColor = msg.visualizer.glowColor;
    this.voiceVisualizer.secondaryColor = msg.visualizer.secondaryColor;
  }

  async _loadVoiceSkin(index, autoPlay = false) {
    this.voiceGen += 1;

    const msg = CONFIG.voiceMessages[index];
    const isFirstLoad = !this.voiceCard.classList.contains('visible');

    if (!isFirstLoad) {
      this.voiceCard.classList.add('switching');
      await this._wait(500);
    }

    this._stopCurrentAudio();

    this.voiceLabel.textContent = `Message ${msg.id} of ${CONFIG.voiceMessages.length}`;
    this.voiceSpeaker.textContent = msg.speaker;
    this.voiceSubtitle.textContent = msg.subtitle;
    this.voicePortrait.src = msg.portrait;
    this.voicePortrait.alt = msg.speaker;

    this._applySkin(msg);
    this._updateDots(index);

    this.progressFill.style.width = '0%';
    this.timeCurrent.textContent = '0:00';
    this.timeDuration.textContent = '0:00';

    this.voiceCard.classList.remove('switching');
    this.voiceCard.classList.add('visible');

    this.currentAudio = this._getAudioElement(index);
    this.currentAudio.onended = null;

    this._setPlayState(false);

    if (autoPlay) {
      this._queuePlayback('voice');
    }
  }

  _queuePlayback(type) {
    if (this.audioUnlocked) {
      if (type === 'voice') {
        this._play().catch(() => {});
      } else if (type === 'song') {
        this._playSong().catch(() => {});
      }
      return;
    }

    this.pendingPlayback = type;
  }

  async _play() {
    if (!this.currentAudio) return;

    if (!this.audioUnlocked) {
      this.pendingPlayback = 'voice';
      return;
    }

    this._resumeAudioContext();

    try {
      this.voiceVisualizer.connect(this.currentAudio);
    } catch (_) {
      /* already connected */
    }

    this.voiceVisualizer.start();

    try {
      await this.currentAudio.play();
    } catch (err) {
      const isAutoplayBlocked = err.name === 'NotAllowedError' || err.name === 'AbortError';
      if (isAutoplayBlocked) {
        console.warn('Voice playback is waiting for a user gesture — tap play to continue.', err);
        this.isPlaying = false;
        this.isPaused = true;
        this._setPlayState(false);
        this.voiceCard.classList.remove('playing');
        this.voiceVisualizer.stop();
        this._stopProgressLoop();
        this._releaseWakeLock();
        return;
      }

      console.warn('Voice message failed to play (missing file or unsupported source) — advancing automatically', err);
      this._handleVoicePlaybackFailure();
      return;
    }

    this.isPlaying = true;
    this.isPaused = false;
    this._setPlayState(true);
    this.voiceCard.classList.add('playing');
    this._requestWakeLock();

    this.currentAudio.onended = () => {
      if (CONFIG.autoAdvanceOnEnd && !this.isPaused) {
        this._onVoiceEnded(this.currentVoiceIndex);
      } else {
        this._setPlayState(false);
        this.voiceCard.classList.remove('playing');
        this.voiceVisualizer.stop();
      }
    };

    this._startProgressLoop();
  }

  /**
   * Called when a voice message's audio fails to play — most likely
   * because the recording hasn't been added yet. Rather than getting
   * stuck forever waiting for an "ended" event that will never fire,
   * wait a moment (so it doesn't feel like a glitch) then move on,
   * same as if the message had actually played.
   */
  async _handleVoicePlaybackFailure() {
    const indexAtFailure = this.currentVoiceIndex;
    const genAtFailure = this.voiceGen;

    // The browser fires a "play" signal the instant play() is called,
    // before it discovers the file is missing — our state-sync
    // listener picks that up and marks isPlaying true. Reset it here
    // now that we know the attempt actually failed, or this message's
    // stale "playing" state can bleed into whatever plays next.
    this.isPlaying = false;
    this.isPaused = false;
    this._setPlayState(false);
    this.voiceCard.classList.remove('playing');
    this.voiceVisualizer.stop();
    this._stopProgressLoop();
    this._releaseWakeLock();

    if (!CONFIG.autoAdvanceOnEnd) return;

    await this._wait(2000);

    // If anything else has since moved us on — a manual Next tap,
    // or another load starting — this attempt is stale. Checking the
    // generation counter (bumped on every load) is more reliable
    // than comparing index alone, since index can cycle back around.
    if (genAtFailure !== this.voiceGen) return;
    if (this.currentVoiceIndex !== indexAtFailure) return;

    this._onVoiceEnded(indexAtFailure);
  }

  _pause() {
    if (!this.currentAudio) return;

    this.currentAudio.pause();
    this.isPlaying = false;
    this.isPaused = true;
    this._setPlayState(false);
    this.voiceCard.classList.remove('playing');
    this.voiceVisualizer.stop();
    this._stopProgressLoop();
  }

  _togglePlayPause() {
    this._resumeAudioContext();

    if (this.isPlaying) {
      this._pause();
    } else {
      if (this.currentAudio && this.currentAudio.currentTime > 0 && !this.currentAudio.ended) {
        this._play();
      } else if (this.currentAudio) {
        this.currentAudio.currentTime = 0;
        this._play();
      }
    }
  }

  async _skipToNext() {
    this._stopCurrentAudio();
    const isLast = this.currentVoiceIndex >= CONFIG.voiceMessages.length - 1;

    if (isLast) {
      await this._showFinalTransition();
      await this._goToScene('song');
      this._runSong();
    } else {
      this.currentVoiceIndex += 1;
      await this._loadVoiceSkin(this.currentVoiceIndex, true);
    }
  }

  _stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.onended = null;
    }
    this.isPlaying = false;
    this.isPaused = false;
    this._setPlayState(false);
    this.voiceCard.classList.remove('playing');
    this.voiceVisualizer.stop();
    this._stopProgressLoop();
    this._releaseWakeLock();
  }

  _setPlayState(playing) {
    this.iconPlay.classList.toggle('hidden', playing);
    this.iconPause.classList.toggle('hidden', !playing);
  }

  _startProgressLoop() {
    this._stopProgressLoop();

    const tick = () => {
      if (!this.currentAudio) return;

      const { currentTime, duration } = this.currentAudio;
      if (duration && isFinite(duration)) {
        const pct = (currentTime / duration) * 100;
        this.progressFill.style.width = `${pct}%`;
        this.timeCurrent.textContent = this._formatTime(currentTime);
        this.timeDuration.textContent = this._formatTime(duration);
      }

      this.progressRAF = requestAnimationFrame(tick);
    };

    this.progressRAF = requestAnimationFrame(tick);
  }

  _stopProgressLoop() {
    if (this.progressRAF) {
      cancelAnimationFrame(this.progressRAF);
      this.progressRAF = null;
    }
  }

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  async _onVoiceEnded(index) {
    // Guards against two advance sequences running at once — e.g. a
    // delayed fallback from a missing file firing at the same moment
    // as a natural "ended" event from the next message.
    if (this.isAdvancingVoice) return;
    this.isAdvancingVoice = true;

    this._stopCurrentAudio();

    const isLast = index >= CONFIG.voiceMessages.length - 1;

    if (isLast) {
      await this._showFinalTransition();
      await this._goToScene('song');
      this._runSong();
    } else {
      await this._showTransitionWithCountdown();
      this.currentVoiceIndex = index + 1;
      await this._loadVoiceSkin(this.currentVoiceIndex, true);
    }

    this.isAdvancingVoice = false;
  }

  async _showTransitionWithCountdown() {
    this.transitionMessage.textContent = CONFIG.transitionMessage;
    this.voiceTransition.classList.remove('hidden');
    this.voiceTransition.classList.add('visible');

    await this._wait(CONFIG.transitionDisplayTime);

    this.countdownEl.classList.remove('hidden');
    this.countdownEl.classList.add('visible');

    for (let i = CONFIG.countdownSeconds; i >= 1; i--) {
      this.countdownNumber.textContent = i;
      this.countdownNumber.style.animation = 'none';
      void this.countdownNumber.offsetWidth;
      this.countdownNumber.style.animation = 'countdown-pop 0.8s ease';
      await this._wait(CONFIG.countdownInterval);
    }

    this._hideTransition();
  }

  async _showFinalTransition() {
    this.transitionMessage.textContent = CONFIG.finalTransitionMessage;
    this.countdownEl.classList.add('hidden');
    this.countdownEl.classList.remove('visible');
    this.voiceTransition.classList.remove('hidden');
    this.voiceTransition.classList.add('visible');

    // Hide the voice card now too. The transition overlay's backdrop
    // is semi-transparent, not solid — if we leave the last speaker's
    // card sitting there at full opacity, it becomes visible again
    // right as the overlay itself fades out a moment later, looking
    // like their card "comes back on" briefly before the song scene.
    this.voiceCard.classList.remove('visible');

    await this._wait(CONFIG.finalTransitionDisplayTime);
    this._hideTransition();

    // Let the overlay's own fade-out (1s, see _hideTransition) finish
    // before handing off to the scene change — otherwise the two
    // fades overlap and create the same flash this fix is for.
    await this._wait(1000);
  }

  _hideTransition() {
    this.voiceTransition.classList.remove('visible');
    this.countdownEl.classList.add('hidden');
    this.countdownEl.classList.remove('visible');

    setTimeout(() => {
      if (!this.voiceTransition.classList.contains('visible')) {
        this.voiceTransition.classList.add('hidden');
      }
    }, 1000);
  }

  /* ─── SCENE 4: Song Finale ─── */

  async _runSong() {
    this._resumeAudioContext();

    // Reset progress display each time the scene is (re)entered.
    this.songProgressFill.style.width = '0%';
    this.songTimeCurrent.textContent = '0:00';
    this.songTimeDuration.textContent = '0:00';
    this._resetLyrics();

    try {
      this.songVisualizer.connect(this.audioSong);
    } catch (_) {
      /* already connected */
    }

    this.audioSong.onended = async () => {
      this._setSongPlayState(false);
      this.songVisualizer.stop();
      this._stopSongProgressLoop();
      this.isSongPlaying = false;
      this.isSongPaused = false;
      this._releaseWakeLock();

      if (CONFIG.autoAdvanceAfterSong) {
        await this._goToScene('ending');
      }
    };

    this._playSong();
  }

  async _playSong() {
    if (!this.audioUnlocked) {
      this.pendingPlayback = 'song';
      return;
    }

    this._resumeAudioContext();

    try {
      this.songVisualizer.connect(this.audioSong);
    } catch (_) {
      /* already connected */
    }

    this.songVisualizer.start();

    try {
      await this.audioSong.play();
    } catch (err) {
      const isAutoplayBlocked = err.name === 'NotAllowedError' || err.name === 'AbortError';
      if (isAutoplayBlocked) {
        console.warn('Song autoplay blocked — tap play to start', err);
        this._setSongPlayState(false);
        this.isSongPlaying = false;
        this.isSongPaused = false;
        return;
      }

      console.warn('Song playback failed — tap play to try again', err);
      this._setSongPlayState(false);
      this.isSongPlaying = false;
      this.isSongPaused = false;
      return;
    }

    this.isSongPlaying = true;
    this.isSongPaused = false;
    this._setSongPlayState(true);
    this._requestWakeLock();

    this._startSongProgressLoop();
  }

  _pauseSong() {
    if (!this.audioSong) return;

    this.audioSong.pause();
    this.isSongPlaying = false;
    this.isSongPaused = true;
    this._setSongPlayState(false);
    this.songVisualizer.stop();
    this._stopSongProgressLoop();
    this._releaseWakeLock();
  }

  _toggleSongPlayPause() {
    this._resumeAudioContext();

    // Check the actual audio element rather than our own flag —
    // more robust against any state drift, and makes the button
    // reflect reality regardless of what caused a discrepancy.
    const actuallyPlaying = this.audioSong && !this.audioSong.paused;

    if (actuallyPlaying) {
      this._pauseSong();
    } else {
      this._playSong();
    }
  }

  _setSongPlayState(playing) {
    this.songIconPlay.classList.toggle('hidden', playing);
    this.songIconPause.classList.toggle('hidden', !playing);
  }

  _startSongProgressLoop() {
    this._stopSongProgressLoop();

    const tick = () => {
      if (!this.audioSong) return;

      const { currentTime, duration } = this.audioSong;
      if (duration && isFinite(duration)) {
        const pct = (currentTime / duration) * 100;
        this.songProgressFill.style.width = `${pct}%`;
        this.songTimeCurrent.textContent = this._formatTime(currentTime);
        this.songTimeDuration.textContent = this._formatTime(duration);
        this._updateLyricsHighlight(currentTime, duration);
      }

      this.songProgressRAF = requestAnimationFrame(tick);
    };

    this.songProgressRAF = requestAnimationFrame(tick);
  }

  _stopSongProgressLoop() {
    if (this.songProgressRAF) {
      cancelAnimationFrame(this.songProgressRAF);
      this.songProgressRAF = null;
    }
  }

  /* ─── Utilities ─── */

  _showGestureHint() {
    if (this.gestureHint) {
      this.gestureHint.classList.add('visible');
    }
  }

  _hideGestureHint() {
    if (this.gestureHint) {
      this.gestureHint.classList.remove('visible');
    }
  }

  _resumeAudioContext() {
    if (this.voiceVisualizer?.audioContext?.state === 'suspended') {
      this.voiceVisualizer.audioContext.resume();
    }
    if (this.songVisualizer?.audioContext?.state === 'suspended') {
      this.songVisualizer.audioContext.resume();
    }
  }

  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CinematicExperience();
});
