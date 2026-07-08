/**
 * AudioVisualizer — Web Audio API canvas visualizer
 * Supports bar and wave modes with premium glow styling.
 */
class AudioVisualizer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = options.mode || 'bars';
    this.barCount = options.barCount || 64;
    this.color = options.color || 'rgba(255, 182, 193, 0.8)';
    this.glowColor = options.glowColor || 'rgba(255, 182, 193, 0.3)';
    this.secondaryColor = options.secondaryColor || 'rgba(200, 180, 255, 0.6)';
    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.dataArray = null;
    this.animationId = null;
    this.isRunning = false;
    this._connectedElement = null;

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  connect(audioElement) {
    if (this._connectedElement === audioElement && this.analyser) return;

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (!this._sourceMap) {
      this._sourceMap = new WeakMap();
    }

    if (!this.analyser) {
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(this.audioContext.destination);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    if (!this._sourceMap.has(audioElement)) {
      const source = this.audioContext.createMediaElementSource(audioElement);
      this._sourceMap.set(audioElement, source);
    }

    if (this._activeSource) {
      try { this._activeSource.disconnect(); } catch (_) { /* noop */ }
    }

    this._activeSource = this._sourceMap.get(audioElement);
    this._activeSource.connect(this.analyser);
    this._connectedElement = audioElement;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._draw();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this._clear();
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  _draw() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this._draw());

    if (!this.analyser) {
      this._drawIdle();
      return;
    }

    this.analyser.getByteFrequencyData(this.dataArray);

    if (this.mode === 'bars') {
      this._drawBars();
    } else {
      this._drawWave();
    }
  }

  _drawIdle() {
    this._clear();
    const time = Date.now() * 0.001;
    const points = 60;

    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.secondaryColor);
    gradient.addColorStop(1, this.color);

    this.ctx.beginPath();
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = this.glowColor;

    const sliceWidth = this.width / points;
    let x = 0;

    for (let i = 0; i < points; i++) {
      const t = i / points;
      const wave = Math.sin(t * Math.PI * 2 + time * 1.4) * 0.22
        + Math.cos(t * Math.PI * 4 - time * 0.7) * 0.12
        + 0.5;
      const y = (wave * this.height) / 1.1;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  _drawBars() {
    this._clear();
    const barW = this.width / this.barCount;
    const gap = 2;

    for (let i = 0; i < this.barCount; i++) {
      const index = Math.floor(i * this.dataArray.length / this.barCount);
      const value = this.dataArray[index] / 255;
      const barH = value * this.height * 0.85;
      const x = i * barW;
      const y = this.height - barH;

      const gradient = this.ctx.createLinearGradient(x, y, x, this.height);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.secondaryColor);

      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = this.glowColor;
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x + gap / 2, y, barW - gap, barH);
    }

    this.ctx.shadowBlur = 0;
  }

  _drawWave() {
    this._clear();
    this.analyser.getByteTimeDomainData(this.dataArray);

    const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.secondaryColor);
    gradient.addColorStop(1, this.color);

    this.ctx.beginPath();
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 2.5;
    this.ctx.shadowBlur = 12;
    this.ctx.shadowColor = this.glowColor;

    const sliceWidth = this.width / this.dataArray.length;
    let x = 0;

    for (let i = 0; i < this.dataArray.length; i++) {
      const v = this.dataArray[i] / 128.0;
      const y = (v * this.height) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  destroy() {
    this.stop();
    if (this._activeSource) {
      try { this._activeSource.disconnect(); } catch (_) { /* noop */ }
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

window.AudioVisualizer = AudioVisualizer;
