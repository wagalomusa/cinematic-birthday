/**
 * NightSky — realistic canvas starfield for the intro scene.
 *
 * Performance note: glow effects are pre-rendered once onto small
 * offscreen sprite canvases at startup, then just stamped onto the
 * main canvas each frame with drawImage() + globalAlpha. This avoids
 * live shadowBlur recalculation (one of the most expensive canvas
 * operations) on every star, every frame — which is what was making
 * the whole page feel heavy and causing the typewriter next to it to
 * stutter, since both were fighting for the same main thread.
 *
 * Layers, all drawn on one canvas:
 *  1. Twinkling stars in white / soft pink / lavender / warm gold,
 *     each flickering on its own sine-wave phase so it never looks
 *     mechanical or repeating.
 *  2. Drifting "fireflies" — small glowing particles in blush pink
 *     and gold that rise slowly with a gentle side-to-side sway,
 *     fading in and out.
 *  3. Occasional shooting stars that streak across at random
 *     intervals with a soft fading trail.
 *
 * Only animates while the intro scene is active, so it doesn't
 * burn CPU once the experience moves on to later scenes.
 */
class NightSky {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.stars = [];
    this.fireflies = [];
    this.shootingStars = [];

    this.shootingTimer = 0;
    this.nextShootingIn = this._randomShootingDelay();
    this.lastTime = performance.now();

    this._buildGlowSprites();

    this._resize();
    window.addEventListener('resize', () => {
      this._resize();
      this._generateStars();
      this._generateFireflies();
    });

    this._generateStars();
    this._generateFireflies();

    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  /* ─── Pre-rendered glow sprites (built once, reused every frame) ─── */

  _buildGlowSprites() {
    const hues = {
      white: '255,255,255',
      pink: '255,214,229',
      lavender: '221,207,255',
      gold: '255,238,204',
    };

    this.glowSprites = {};
    const size = 48;

    Object.entries(hues).forEach(([hue, rgb]) => {
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext('2d');

      const gradient = sctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      gradient.addColorStop(0, `rgba(${rgb},0.9)`);
      gradient.addColorStop(0.35, `rgba(${rgb},0.35)`);
      gradient.addColorStop(1, `rgba(${rgb},0)`);

      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, size, size);

      this.glowSprites[hue] = sprite;
    });

    // Firefly glow sprites (warmer, slightly smaller falloff)
    const fireflyHues = { pink: '255,190,215', gold: '255,224,170' };
    this.fireflyGlowSprites = {};

    Object.entries(fireflyHues).forEach(([hue, rgb]) => {
      const sprite = document.createElement('canvas');
      sprite.width = size;
      sprite.height = size;
      const sctx = sprite.getContext('2d');

      const gradient = sctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      gradient.addColorStop(0, `rgba(${rgb},0.85)`);
      gradient.addColorStop(0.4, `rgba(${rgb},0.3)`);
      gradient.addColorStop(1, `rgba(${rgb},0)`);

      sctx.fillStyle = gradient;
      sctx.fillRect(0, 0, size, size);

      this.fireflyGlowSprites[hue] = sprite;
    });
  }

  _resize() {
    // Capped at 1.5 (rather than 2) — a meaningful drop in fill-rate
    // cost on high-DPI phones with negligible visible difference for
    // a soft, glowy starfield like this.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = rect.width;
    this.height = rect.height;
  }

  /* ─── Stars ─── */

  _generateStars() {
    // Slightly lower density than before — fewer, more deliberate
    // stars reads just as rich but costs meaningfully less per frame.
    const density = 1 / 3800;
    const count = Math.max(50, Math.floor(this.width * this.height * density));
    this.stars = [];

    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let radius, speed, baseAlpha;

      if (roll < 0.6) {
        radius = 0.5 + Math.random() * 0.5;
        baseAlpha = 0.25 + Math.random() * 0.3;
        speed = 0.4 + Math.random() * 0.5;
      } else if (roll < 0.9) {
        radius = 0.9 + Math.random() * 0.6;
        baseAlpha = 0.45 + Math.random() * 0.3;
        speed = 0.6 + Math.random() * 0.6;
      } else {
        radius = 1.4 + Math.random() * 0.8;
        baseAlpha = 0.65 + Math.random() * 0.3;
        speed = 0.8 + Math.random() * 0.8;
      }

      const paletteRoll = Math.random();
      let hue;
      if (paletteRoll < 0.55) hue = 'white';
      else if (paletteRoll < 0.75) hue = 'pink';
      else if (paletteRoll < 0.92) hue = 'lavender';
      else hue = 'gold';

      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.92,
        radius,
        baseAlpha,
        speed,
        phase: Math.random() * Math.PI * 2,
        hue,
        // Only the brighter/larger third of stars get a glow sprite
        // drawn behind them — small dim stars don't need one, and
        // skipping it for most stars is a big chunk of the savings.
        glow: roll >= 0.9,
      });
    }
  }

  _colorFor(hue, alpha) {
    switch (hue) {
      case 'pink': return `rgba(255,214,229,${alpha})`;
      case 'lavender': return `rgba(221,207,255,${alpha})`;
      case 'gold': return `rgba(255,238,204,${alpha})`;
      default: return `rgba(255,255,255,${alpha})`;
    }
  }

  _drawStars(t) {
    const ctx = this.ctx;

    this.stars.forEach((star) => {
      const flicker = Math.sin(t * star.speed + star.phase) * 0.5 + 0.5;
      const alpha = star.baseAlpha * (0.55 + 0.45 * flicker);

      if (star.glow) {
        const sprite = this.glowSprites[star.hue];
        const glowSize = star.radius * 10;
        ctx.globalAlpha = alpha;
        ctx.drawImage(
          sprite,
          star.x - glowSize / 2,
          star.y - glowSize / 2,
          glowSize,
          glowSize
        );
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      ctx.fillStyle = this._colorFor(star.hue, alpha);
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ─── Fireflies ─── */

  _generateFireflies() {
    const count = Math.max(6, Math.floor(this.width / 240));
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push(this._spawnFirefly(true));
    }
  }

  _spawnFirefly(randomStart) {
    return {
      x: Math.random() * this.width,
      y: randomStart ? Math.random() * this.height : this.height + 20,
      radius: 1 + Math.random() * 1.6,
      alpha: 0,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: 0.3 + Math.random() * 0.4,
      swayAmp: 12 + Math.random() * 22,
      riseSpeed: 5 + Math.random() * 9,
      hue: Math.random() < 0.5 ? 'pink' : 'gold',
      age: 0,
      fadeIn: 1.5 + Math.random(),
      lifespan: 12 + Math.random() * 10,
    };
  }

  _updateFireflies(dt) {
    for (let i = 0; i < this.fireflies.length; i++) {
      const f = this.fireflies[i];
      f.age += dt;
      f.y -= f.riseSpeed * dt;
      f.swayPhase += dt * f.swaySpeed;

      const fadeOutStart = f.lifespan - 2.5;
      let targetAlpha;
      if (f.age < f.fadeIn) {
        targetAlpha = Math.min(1, f.age / f.fadeIn) * 0.7;
      } else if (f.age > fadeOutStart) {
        targetAlpha = Math.max(0, (f.lifespan - f.age) / 2.5) * 0.7;
      } else {
        targetAlpha = 0.7;
      }
      f.alpha = targetAlpha;

      if (f.age > f.lifespan || f.y < -20) {
        this.fireflies[i] = this._spawnFirefly(false);
      }
    }
  }

  _drawFireflies() {
    const ctx = this.ctx;

    this.fireflies.forEach((f) => {
      const sway = Math.sin(f.swayPhase) * f.swayAmp;
      const x = f.x + sway;
      const sprite = this.fireflyGlowSprites[f.hue];
      const glowSize = f.radius * 12;

      ctx.globalAlpha = f.alpha;
      ctx.drawImage(sprite, x - glowSize / 2, f.y - glowSize / 2, glowSize, glowSize);
      ctx.globalAlpha = 1;

      const coreColor = f.hue === 'pink'
        ? `rgba(255,225,235,${f.alpha})`
        : `rgba(255,240,220,${f.alpha})`;

      ctx.beginPath();
      ctx.fillStyle = coreColor;
      ctx.arc(x, f.y, f.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ─── Shooting stars ─── */

  _randomShootingDelay() {
    return 4 + Math.random() * 7;
  }

  _maybeSpawnShootingStar(dt) {
    this.shootingTimer += dt;
    if (this.shootingTimer < this.nextShootingIn) return;

    this.shootingTimer = 0;
    this.nextShootingIn = this._randomShootingDelay();

    const startX = Math.random() * this.width * 0.6;
    const startY = Math.random() * this.height * 0.35;
    const angle = (20 + Math.random() * 15) * (Math.PI / 180);
    const speed = 700 + Math.random() * 300;

    this.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 0.9 + Math.random() * 0.4,
      length: 100 + Math.random() * 80,
    });
  }

  _updateShootingStars(dt) {
    this.shootingStars = this.shootingStars.filter((s) => {
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      return s.life < s.maxLife && s.x < this.width + 200 && s.y < this.height + 200;
    });
  }

  _drawShootingStars() {
    // Shooting stars are rare (every 4-11s, one at a time) so a
    // gradient stroke here is cheap — no shadowBlur needed either.
    const ctx = this.ctx;

    this.shootingStars.forEach((s) => {
      const progress = s.life / s.maxLife;
      const alpha = progress < 0.15
        ? progress / 0.15
        : 1 - (progress - 0.15) / 0.85;

      const angle = Math.atan2(s.vy, s.vx);
      const tailX = s.x - Math.cos(angle) * s.length;
      const tailY = s.y - Math.sin(angle) * s.length;

      const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
      gradient.addColorStop(0.4, `rgba(255,225,235,${alpha * 0.6})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /* ─── Main loop ─── */

  _loop(now) {
    requestAnimationFrame(this._loop);

    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    // Only draw while the intro scene is on screen — saves CPU
    // for the rest of the experience.
    const introScene = document.getElementById('scene-intro');
    const active = !introScene || introScene.classList.contains('active');
    if (!active) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    const t = now / 1000;
    this._drawStars(t);

    this._updateFireflies(dt);
    this._drawFireflies();

    this._maybeSpawnShootingStar(dt);
    this._updateShootingStars(dt);
    this._drawShootingStars();
  }
}

window.NightSky = NightSky;

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('nightsky-canvas');
  if (canvas) {
    new NightSky(canvas);
  }
});
