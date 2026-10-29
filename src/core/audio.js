// Optional sound layer, fully synthesized with the Web Audio API (no audio files).
// Everything fails silently: the game never depends on sound.

class AudioEngine {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.master = null;
    this.loops = new Map();
    this.noiseBuf = null;
  }

  setEnabled(on) {
    this.enabled = !!on;
    if (!this.enabled) {
      this.stopAll();
      this.ctx?.suspend?.().catch(() => {});
    } else if (this.ctx) {
      this.ctx.resume?.().catch(() => {});
    }
  }

  /** Must be called from a user gesture before the first sound (browser autoplay rules). */
  unlock() {
    if (!this.enabled) return false;
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return false;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.55;
        this.master.connect(this.ctx.destination);
        const len = this.ctx.sampleRate * 2;
        this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        const d = this.noiseBuf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return true;
    } catch {
      return false;
    }
  }

  ready() {
    return this.enabled && this.ctx && this.ctx.state !== 'closed';
  }

  noise() {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    return src;
  }

  env(gain, t0, attack, hold, release, peak) {
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    gain.gain.setValueAtTime(peak, t0 + attack + hold);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release);
  }

  tone(freq, { type = 'sine', dur = 0.4, peak = 0.2, attack = 0.01, delay = 0 } = {}) {
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    this.env(g, t, attack, 0, dur, peak);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  burst({ dur = 0.15, peak = 0.15, hp = 1500, lp = 9000, delay = 0 } = {}) {
    const t = this.ctx.currentTime + delay;
    const src = this.noise();
    const h = this.ctx.createBiquadFilter();
    h.type = 'highpass';
    h.frequency.value = hp;
    const l = this.ctx.createBiquadFilter();
    l.type = 'lowpass';
    l.frequency.value = lp;
    const g = this.ctx.createGain();
    this.env(g, t, 0.005, 0, dur, peak);
    src.connect(h).connect(l).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /** One-shot cues. */
  play(name) {
    if (!this.ready()) return;
    try {
      switch (name) {
        case 'click':
          this.burst({ dur: 0.03, peak: 0.08, hp: 2500 });
          break;
        case 'paper':
          this.burst({ dur: 0.18, peak: 0.12, hp: 2000, lp: 7000 });
          this.burst({ dur: 0.12, peak: 0.08, hp: 3000, delay: 0.12 });
          break;
        case 'discover':
          this.tone(523.25, { dur: 0.6, peak: 0.12 });
          this.tone(783.99, { dur: 0.8, peak: 0.09, delay: 0.09 });
          break;
        case 'item':
          this.tone(392, { type: 'triangle', dur: 0.25, peak: 0.12 });
          this.tone(587.33, { type: 'triangle', dur: 0.4, peak: 0.1, delay: 0.08 });
          break;
        case 'unlock':
          this.burst({ dur: 0.05, peak: 0.2, hp: 800, lp: 4000 });
          this.tone(220, { type: 'square', dur: 0.08, peak: 0.05, delay: 0.05 });
          this.tone(659.25, { dur: 0.7, peak: 0.08, delay: 0.12 });
          break;
        case 'solve':
          [392, 493.88, 587.33, 783.99].forEach((f, i) => this.tone(f, { dur: 0.9, peak: 0.08, delay: i * 0.08 }));
          break;
        case 'wrong':
          this.tone(146.83, { type: 'triangle', dur: 0.35, peak: 0.12 });
          this.tone(138.59, { type: 'triangle', dur: 0.45, peak: 0.1, delay: 0.1 });
          break;
        case 'bell':
          [1, 2.76, 5.4, 8.93].forEach((m, i) => this.tone(196 * m, { dur: 2.6 - i * 0.5, peak: 0.12 / (i + 1) }));
          break;
        case 'pour':
          this.burst({ dur: 0.9, peak: 0.05, hp: 900, lp: 3000 });
          break;
        case 'switch':
          this.burst({ dur: 0.04, peak: 0.25, hp: 400, lp: 3000 });
          break;
        default:
          break;
      }
    } catch {
      /* sound is optional */
    }
  }

  /** Looping beds: 'static' (radio) and outdoor/indoor ambience. Returns nothing; use stop(name). */
  loop(name, level = 1) {
    if (!this.ready() || this.loops.has(name)) return;
    try {
      const g = this.ctx.createGain();
      g.gain.value = 0.0001;
      g.connect(this.master);
      const nodes = [];
      const src = this.noise();
      const f = this.ctx.createBiquadFilter();
      if (name === 'static') {
        f.type = 'bandpass';
        f.frequency.value = 2400;
        f.Q.value = 0.6;
      } else if (name === 'wind') {
        f.type = 'lowpass';
        f.frequency.value = 420;
        const lfo = this.ctx.createOscillator();
        const lg = this.ctx.createGain();
        lfo.frequency.value = 0.08;
        lg.gain.value = 180;
        lfo.connect(lg).connect(f.frequency);
        lfo.start();
        nodes.push(lfo);
      } else {
        // 'room': a faint low hum
        f.type = 'lowpass';
        f.frequency.value = 160;
        const hum = this.ctx.createOscillator();
        const hg = this.ctx.createGain();
        hum.frequency.value = 55;
        hg.gain.value = 0.02;
        hum.connect(hg).connect(g);
        hum.start();
        nodes.push(hum);
      }
      src.connect(f).connect(g);
      src.start();
      nodes.push(src);
      const target = (name === 'static' ? 0.09 : name === 'wind' ? 0.07 : 0.04) * level;
      g.gain.exponentialRampToValueAtTime(target, this.ctx.currentTime + 1.2);
      this.loops.set(name, { g, nodes, f });
    } catch {
      /* optional */
    }
  }

  /** Radio tuning: move the static filter and blend in a carrier whistle. */
  tune(x) {
    const l = this.loops.get('static');
    if (!l || !this.ready()) return;
    try {
      l.f.frequency.setTargetAtTime(800 + x * 3200, this.ctx.currentTime, 0.05);
    } catch {
      /* optional */
    }
  }

  setLevel(name, level) {
    const l = this.loops.get(name);
    if (!l || !this.ready()) return;
    try {
      l.g.gain.setTargetAtTime(Math.max(0.0001, level), this.ctx.currentTime, 0.2);
    } catch {
      /* optional */
    }
  }

  stop(name) {
    const l = this.loops.get(name);
    if (!l) return;
    this.loops.delete(name);
    try {
      const t = this.ctx.currentTime;
      l.g.gain.cancelScheduledValues(t);
      l.g.gain.setTargetAtTime(0.0001, t, 0.25);
      l.nodes.forEach((n) => n.stop?.(t + 1.2));
    } catch {
      /* optional */
    }
  }

  stopAll() {
    [...this.loops.keys()].forEach((k) => this.stop(k));
  }
}

export const audio = new AudioEngine();
