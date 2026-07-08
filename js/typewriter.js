/**
 * Typewriter — emotional text reveal with keyboard click sounds
 */
class Typewriter {
  constructor(textEl, cursorEl, options = {}) {
    this.textEl = textEl;
    this.cursorEl = cursorEl;
    this.speed = options.speed || 12;
    this.pauseBetween = options.pauseBetween || 800;
    this.messageBaseDelay = options.messageBaseDelay || 560;
    this.characterDelay = options.characterDelay || this.speed;
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
      }
    }

    this.cursorEl.classList.remove('active');
    await this._wait(1000);
    this.onComplete();
  }

  _typeSingle(message) {
    return new Promise((resolve) => {
      this.textEl.classList.remove('line-reveal');
      void this.textEl.offsetWidth;
      this.textEl.innerHTML = message.replace(/\n/g, '<br>');
      this.textEl.classList.add('line-reveal');
      this._playKeySound();

      setTimeout(resolve, this.messageBaseDelay + message.length * this.characterDelay);
    });
  }

  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

window.Typewriter = Typewriter;
