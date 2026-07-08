/**
 * Typewriter — emotional text reveal with keyboard click sounds
 */
class Typewriter {
  constructor(textEl, cursorEl, options = {}) {
    this.textEl = textEl;
    this.cursorEl = cursorEl;
    this.speed = options.speed || 55;
    this.pauseBetween = options.pauseBetween || 2200;
    this.onComplete = options.onComplete || (() => {});
    this.audioContext = null;
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
    if (!this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);

    gain.gain.setValueAtTime(0.04, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.05);
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
    await this._wait(3000);
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
          setTimeout(tick, this.speed + Math.random() * 30);
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
