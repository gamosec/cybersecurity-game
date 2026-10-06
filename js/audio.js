/* مؤثرات صوتية مولّدة عبر Web Audio API (بدون ملفات خارجية) */
(function () {
  'use strict';

  const Sound = {
    enabled: true,
    ctx: null,

    ensure() {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) return null;
        this.ctx = new C();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },

    tone(freq, dur, type, delay, vol) {
      if (!this.enabled) return;
      const ctx = this.ensure();
      if (!ctx) return;
      const t = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol || 0.15, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },

    click() { this.tone(700, 0.07, 'triangle', 0, 0.12); },
    open() { this.tone(520, 0.08, 'sine', 0, 0.12); this.tone(780, 0.1, 'sine', 0.06, 0.1); },
    correct() {
      this.tone(660, 0.14, 'sine', 0, 0.16);
      this.tone(880, 0.16, 'sine', 0.12, 0.16);
      this.tone(1320, 0.28, 'sine', 0.24, 0.14);
    },
    wrong() {
      this.tone(240, 0.22, 'sawtooth', 0, 0.07);
      this.tone(170, 0.32, 'sawtooth', 0.18, 0.07);
    },
    tick() { this.tone(1100, 0.05, 'square', 0, 0.04); },
    finish() {
      [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.25, 'triangle', i * 0.13, 0.13));
    },
    timeUp() {
      [440, 370, 311].forEach((f, i) => this.tone(f, 0.3, 'triangle', i * 0.2, 0.12));
    }
  };

  window.CyberEscape.Sound = Sound;
})();
