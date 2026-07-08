/**
 * Typewriter — emotional text reveal with keyboard click sounds
 */
class Typewriter {
  constructor(textEl, cursorEl, options = {}) {
    this.textEl = textEl;
    this.cursorEl = cursorEl;
    this.speed = options.speed || 38;
    this.pauseBetween = options.pauseBetween || 1400;
    this.onComplete = options.onComplete || (() => {});
    this.audioContext = null;
    this.voiceEnabled = options.voiceEnabled !== false;
    this.chaos = options.chaos || 0.18;
  }

  _initAudio() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      /* audio unavailable */
    }
  }

  _playKeySound() {
    if (!this.voiceEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(720 + Math.random() * 180, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.008, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0005, this.audioContext.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.04);
  }

  async typeMessages(messages) {
    this._initAudio();
    this.textEl.classList.add('visible');
    this.cursorEl.classList.add('active');

    for (let m = 0; m < messages.length; m++) {
      await this._typeSingle(messages[m]);

      if (m < messages.length - 1) {
        await this._wait(this.pauseBetween);
        this.textEl.textContent = '';
      }
    }

    this.cursorEl.classList.remove('active');
    await this._wait(1400);
    this.onComplete();
  }

  _typeSingle(message) {
    return new Promise((resolve) => {
      let i = 0;
      this.textEl.textContent = '';

      const tick = () => {
        if (i < message.length) {
          this.textEl.textContent += message[i];
          this._playKeySound();
          i++;
          const jitter = (Math.random() - 0.5) * this.chaos * 40;
          setTimeout(tick, this.speed + jitter);
        } else {
          resolve();
        }
      };

      tick();
    });
  }

  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

window.Typewriter = Typewriter;
