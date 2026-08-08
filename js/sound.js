/* Soundboard — every sound is synthesized live with the Web Audio API.
   No audio files, works offline. Browsers require a click before audio can
   start, which is fine: every sound here is triggered by a button. */

const Sound = (() => {
  let ctx = null;
  let master = null;
  const active = {}; // loop name -> stop function

  function ensure() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.6;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  const osc = (type, freq) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  };
  const gain = (v) => {
    const g = ctx.createGain();
    g.gain.value = v;
    return g;
  };

  /* ---------- ambience loops ---------- */

  /* The 2:47 hum: two barely-detuned sines beating against each other,
     plus a faint octave and a slow swell. Unsettling by design. */
  function startHum() {
    ensure();
    const g = gain(0);
    g.connect(master);
    const o1 = osc("sine", 54), o2 = osc("sine", 54.7);
    const o3 = osc("sine", 108.5), g3 = gain(0.22);
    o1.connect(g); o2.connect(g);
    o3.connect(g3); g3.connect(g);
    const lfo = osc("sine", 0.13), lg = gain(0.05);
    lfo.connect(lg); lg.connect(g.gain);
    g.gain.setTargetAtTime(0.2, ctx.currentTime, 1.2);
    [o1, o2, o3, lfo].forEach((o) => o.start());
    return () => {
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => [o1, o2, o3, lfo].forEach((o) => o.stop()), 1600);
    };
  }

  /* Suburban night: randomized three-pulse cricket chirps. */
  function startCrickets() {
    ensure();
    const chirp = () => {
      const t0 = ctx.currentTime;
      const freq = 4100 + Math.random() * 400;
      for (let i = 0; i < 3; i++) {
        const o = osc("sine", freq), g = gain(0);
        o.connect(g); g.connect(master);
        const t = t0 + i * 0.07;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.015);
        g.gain.linearRampToValueAtTime(0, t + 0.05);
        o.start(t); o.stop(t + 0.08);
      }
    };
    const timer = setInterval(() => { if (Math.random() < 0.7) chirp(); }, 380);
    return () => clearInterval(timer);
  }

  /* GARY-2's mower. The same strip. For hours. */
  function startMower() {
    ensure();
    const o = osc("sawtooth", 92);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 420;
    const g = gain(0);
    o.connect(f); f.connect(g); g.connect(master);
    const lfo = osc("sine", 9), lg = gain(7);
    lfo.connect(lg); lg.connect(o.frequency);
    g.gain.setTargetAtTime(0.09, ctx.currentTime, 0.5);
    o.start(); lfo.start();
    return () => {
      g.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      setTimeout(() => { o.stop(); lfo.stop(); }, 900);
    };
  }

  /* ---------- one-shot stings ---------- */

  function beam() {
    ensure();
    const t = ctx.currentTime;
    const o = osc("sine", 160), g = gain(0);
    o.connect(g); g.connect(master);
    o.frequency.exponentialRampToValueAtTime(950, t + 2.2);
    g.gain.linearRampToValueAtTime(0.22, t + 0.4);
    g.gain.linearRampToValueAtTime(0, t + 2.6);
    o.start(t); o.stop(t + 2.7);
    // shimmer on top
    const s = osc("sine", 1500), sg = gain(0);
    const vib = osc("sine", 6), vg = gain(45);
    vib.connect(vg); vg.connect(s.frequency);
    s.connect(sg); sg.connect(master);
    sg.gain.linearRampToValueAtTime(0.05, t + 0.5);
    sg.gain.linearRampToValueAtTime(0, t + 2.5);
    s.start(t); vib.start(t);
    s.stop(t + 2.6); vib.stop(t + 2.6);
  }

  function doorbell() {
    ensure();
    const t = ctx.currentTime;
    [[659, 0, 0.5], [523, 0.35, 0.9]].forEach(([freq, at, len]) => {
      const o = osc("triangle", freq), g = gain(0);
      o.connect(g); g.connect(master);
      g.gain.setValueAtTime(0.18, t + at);
      g.gain.exponentialRampToValueAtTime(0.001, t + at + len);
      o.start(t + at); o.stop(t + at + len);
    });
  }

  /* A clone encountering a contradiction. */
  function buffering() {
    ensure();
    const t = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const o = osc("square", i % 2 ? 990 : 880), g = gain(0);
      o.connect(g); g.connect(master);
      const at = t + i * 0.16;
      g.gain.setValueAtTime(0.06, at);
      g.gain.setValueAtTime(0, at + 0.09);
      o.start(at); o.stop(at + 0.1);
    }
    const o = osc("sawtooth", 220), g = gain(0);
    o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.07, t + 1.0);
    o.frequency.exponentialRampToValueAtTime(55, t + 1.5);
    g.gain.linearRampToValueAtTime(0, t + 1.5);
    o.start(t + 1.0); o.stop(t + 1.55);
  }

  /* For Suspicion 10, pod reveals, and the moment Crisp starts unzipping. */
  function sting() {
    ensure();
    const t = ctx.currentTime;
    [110, 116.5, 233].forEach((freq, i) => {
      const o = osc(i === 2 ? "triangle" : "sawtooth", freq), g = gain(0);
      const f = ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 900;
      o.connect(f); f.connect(g); g.connect(master);
      g.gain.linearRampToValueAtTime(0.09, t + 1.6);
      g.gain.linearRampToValueAtTime(0, t + 3.2);
      if (i === 1) o.frequency.linearRampToValueAtTime(freq * 1.06, t + 3.0);
      o.start(t); o.stop(t + 3.3);
    });
  }

  /* ---------- public API ---------- */

  const loops = { hum: startHum, crickets: startCrickets, mower: startMower };
  const shots = { beam, doorbell, buffering, sting };

  function toggle(name) {
    if (active[name]) {
      active[name]();
      delete active[name];
      return false;
    }
    active[name] = loops[name]();
    return true;
  }

  function play(name) { shots[name](); }
  const isLoop = (name) => name in loops;
  function setVolume(v) { ensure(); master.gain.value = v; }

  return { toggle, play, isLoop, setVolume };
})();
