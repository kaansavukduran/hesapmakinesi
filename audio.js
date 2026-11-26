(function (global) {
  "use strict";

  const STORAGE_MUSIC = "esnaf_calc_music_v2";
  const STORAGE_SFX = "esnaf_calc_sound_v1";

  function loadBool(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function saveBool(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(Boolean(val)));
    } catch (_) {}
  }

  let ctx = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;

  let musicEnabled = loadBool(STORAGE_MUSIC, true);
  let sfxEnabled = loadBool(STORAGE_SFX, true);
  let currentMood = "off";
  let urgency = 0; // 0..1

  let stepTimer = null;
  let stepIndex = 0;
  let heartTimer = null;
  let droneNodes = null;
  let rainNode = null;
  let noiseBuffer = null;

  function ensureContext() {
    if (!ctx) {
      const Ctx = global.AudioContext || global.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.85;
      masterGain.connect(ctx.destination);

      musicGain = ctx.createGain();
      musicGain.gain.value = musicEnabled ? 0.34 : 0;
      musicGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxEnabled ? 0.65 : 0;
      sfxGain.connect(masterGain);
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function getNoiseBuffer() {
    if (noiseBuffer || !ctx) return noiseBuffer;
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = last * 2.8;
    }
    noiseBuffer = buf;
    return buf;
  }

  function stopDrone() {
    if (droneNodes) {
      try {
        const now = ctx ? ctx.currentTime : 0;
        droneNodes.gain.gain.cancelScheduledValues(now);
        droneNodes.gain.gain.setTargetAtTime(0.0001, now, 0.18);
        const nodes = droneNodes;
        setTimeout(() => {
          try { nodes.osc1.stop(); } catch (_) {}
          try { nodes.osc2.stop(); } catch (_) {}
          try { nodes.lfo.stop(); } catch (_) {}
        }, 650);
      } catch (_) {}
      droneNodes = null;
    }
    if (rainNode) {
      try {
        rainNode.src.stop();
      } catch (_) {}
      rainNode = null;
    }
  }

  function startDrone(baseFreq, detuneRatio, cutoff, vol, withRain) {
    stopDrone();
    if (!musicEnabled || !ensureContext()) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc1.type = "sawtooth";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * detuneRatio, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    filter.Q.setValueAtTime(2.6, now);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.18, now);
    lfoGain.gain.setValueAtTime(cutoff * 0.35, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    droneNodes = { osc1, osc2, filter, gain, lfo };

    if (withRain) {
      const buf = getNoiseBuffer();
      if (buf) {
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(1100, now);
        bp.Q.setValueAtTime(0.8, now);
        const rGain = ctx.createGain();
        rGain.gain.setValueAtTime(0.08, now);
        src.connect(bp);
        bp.connect(rGain);
        rGain.connect(musicGain);
        src.start(now);
        rainNode = { src, gain: rGain };
      }
    }
  }

  function playSynthNote(freq, dur, type, vol, cutoff) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = type || "triangle";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff || 1400, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol || 0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(now + dur + 0.04);
  }

  function playClockTick(accent) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(accent ? 1500 : 1050, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.018);

    gain.gain.setValueAtTime(accent ? 0.045 : 0.024, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  const MOOD_SEQUENCES = {
    shop: {
      interval: 560,
      drone: [110, 1.5, 280, 0.05, false],
      step: (i) => {
        const notes = [261.6, 329.6, 392.0, 329.6, 293.7, 349.2, 440.0, 349.2];
        if (i % 2 === 0) playSynthNote(notes[(i / 2) % notes.length], 0.42, "sine", 0.075, 900);
        playClockTick(i % 4 === 0);
      },
    },
    rush: {
      interval: 340,
      drone: [82.4, 1.498, 360, 0.08, false],
      step: (i) => {
        const bass = [110, 110, 130.8, 123.5, 110, 110, 98.0, 103.8];
        playSynthNote(bass[i % bass.length], 0.22, "sawtooth", 0.08, 520 + urgency * 450);
        playClockTick(i % 2 === 0);
      },
    },
    storm: {
      interval: 460,
      drone: [55, 1.006, 260, 0.14, true],
      step: (i) => {
        const motif = [220, 0, 207.6, 0, 196, 0, 164.8, 0];
        const f = motif[i % motif.length];
        if (f) playSynthNote(f, 0.55, "triangle", 0.09, 680);
        if (i % 4 === 0) playSynthNote(55, 0.3, "sine", 0.15, 180);
      },
    },
    mafia: {
      interval: 380,
      drone: [51.9, 1.005, 290, 0.15, false],
      step: (i) => {
        const bass = [73.4, 0, 73.4, 87.3, 82.4, 0, 69.3, 65.4];
        const f = bass[i % bass.length];
        if (f) playSynthNote(f, 0.28, "sawtooth", 0.11, 420 + urgency * 350);
        if (i % 4 === 0) playClockTick(true);
        if (i % 8 === 6) playSynthNote(293.7, 0.45, "triangle", 0.07, 700);
      },
    },
    syndicate: {
      interval: 290,
      drone: [61.7, 1.498, 350, 0.12, false],
      step: (i) => {
        const arp = [123.5, 146.8, 185.0, 146.8, 130.8, 155.6, 196.0, 155.6];
        playSynthNote(arp[i % arp.length], 0.2, "sawtooth", 0.085, 580 + urgency * 500);
        if (i % 4 === 0) playSynthNote(61.7, 0.24, "sine", 0.14, 220);
      },
    },
    cern: {
      interval: 260,
      drone: [65.4, 1.5, 480, 0.13, false],
      step: (i) => {
        const pulse = [130.8, 196.0, 246.9, 196.0, 138.6, 207.6, 261.6, 207.6];
        playSynthNote(pulse[i % pulse.length], 0.19, "triangle", 0.085, 950 + urgency * 600);
        if (i % 8 === 0) playSynthNote(1046.5, 0.35, "sine", 0.045, 1800);
      },
    },
    spacetime: {
      interval: 220,
      drone: [49.0, 1.498, 520, 0.16, false],
      step: (i) => {
        const seq = [98.0, 146.8, 196.0, 233.1, 196.0, 146.8, 110.0, 164.8];
        playSynthNote(seq[i % seq.length], 0.18, "sawtooth", 0.1, 780 + urgency * 900);
        if (i % 4 === 0) playSynthNote(49.0, 0.22, "sine", 0.18, 200);
      },
    },
    master: {
      interval: 900,
      drone: [146.8, 1.5, 400, 0.08, false],
      step: (i) => {
        const pent = [293.7, 349.2, 440.0, 523.2, 440.0, 392.0];
        playSynthNote(pent[i % pent.length], 1.1, "sine", 0.07, 1100);
      },
    },
  };

  function scheduleHeartbeat() {
    clearTimeout(heartTimer);
    if (!musicEnabled || urgency < 0.45 || currentMood === "off" || currentMood === "master") return;
    if (ctx && ctx.state === "running") {
      const now = ctx.currentTime;
      const playBeat = (offset, amp) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(64, now + offset);
        osc.frequency.exponentialRampToValueAtTime(32, now + offset + 0.11);
        gain.gain.setValueAtTime(amp, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.13);
        osc.connect(gain);
        gain.connect(musicGain);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      };
      const amp = 0.14 + urgency * 0.18;
      playBeat(0, amp);
      playBeat(0.16, amp * 0.65);
    }
    const nextMs = Math.max(380, Math.round(980 - urgency * 540));
    heartTimer = setTimeout(scheduleHeartbeat, nextMs);
  }

  function setMood(mood) {
    if (mood === currentMood && stepTimer) return;
    currentMood = mood || "off";
    clearInterval(stepTimer);
    stepTimer = null;
    clearTimeout(heartTimer);
    stopDrone();

    if (currentMood === "off" || !musicEnabled) return;
    const cfg = MOOD_SEQUENCES[currentMood];
    if (!cfg) return;

    ensureContext();
    if (cfg.drone) {
      startDrone(...cfg.drone);
    }
    stepIndex = 0;
    stepTimer = setInterval(() => {
      if (!musicEnabled || !ctx || ctx.state !== "running") return;
      cfg.step(stepIndex++);
    }, cfg.interval);

    if (urgency >= 0.45) {
      scheduleHeartbeat();
    }
  }

  function setUrgency(val) {
    const prev = urgency;
    urgency = Math.max(0, Math.min(1, Number(val) || 0));
    if (droneNodes && ctx && ctx.state === "running") {
      const baseCut = 260 + urgency * 620;
      droneNodes.filter.frequency.setTargetAtTime(baseCut, ctx.currentTime, 0.2);
    }
    if (urgency >= 0.45 && prev < 0.45) {
      scheduleHeartbeat();
    } else if (urgency < 0.45) {
      clearTimeout(heartTimer);
    }
  }

  function setMusicEnabled(enabled) {
    musicEnabled = Boolean(enabled);
    saveBool(STORAGE_MUSIC, musicEnabled);
    if (musicGain && ctx) {
      musicGain.gain.setTargetAtTime(musicEnabled ? 0.34 : 0.0001, ctx.currentTime, 0.08);
    }
    if (!musicEnabled) {
      clearInterval(stepTimer);
      stepTimer = null;
      clearTimeout(heartTimer);
      stopDrone();
    } else if (currentMood !== "off") {
      const m = currentMood;
      currentMood = "off";
      setMood(m);
    }
  }

  function setSfxEnabled(enabled) {
    sfxEnabled = Boolean(enabled);
    saveBool(STORAGE_SFX, sfxEnabled);
    if (sfxGain && ctx) {
      sfxGain.gain.setTargetAtTime(sfxEnabled ? 0.65 : 0.0001, ctx.currentTime, 0.04);
    }
  }

  /* =========================================================
     SOUND EFFECTS (SFX)
     ========================================================= */
  function keyClick(isHeavy) {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(isHeavy ? 210 : 310, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.024);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  function cashRegister() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    // Metallic drawer slide + dual bell chime
    [1318.5, 1975.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      gain.gain.setValueAtTime(0.001, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.065 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.065 + 0.45);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.48);
    });
  }

  function correct() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.16, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.25);
    });
  }

  function wrong() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [165, 130].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      gain.gain.setValueAtTime(0.18, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.18);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.2);
    });
  }

  function masterGong() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [146.8, 293.7, 440.0, 587.3].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.992, now + 1.6);
      gain.gain.setValueAtTime(0.18 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.7);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 1.75);
    });
  }

  function thunder() {
    if (!sfxEnabled || !ensureContext()) return;
    const buf = getNoiseBuffer();
    if (!buf) return;
    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(220, now);
    lp.frequency.exponentialRampToValueAtTime(55, now + 1.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    src.connect(lp);
    lp.connect(gain);
    gain.connect(sfxGain);
    src.start(now);
    src.stop(now + 1.45);
  }

  function doorSlam() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.22);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.28);
  }

  function glitch() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(220 + Math.random() * 1400, now + i * 0.045);
      gain.gain.setValueAtTime(0.11, now + i * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.04);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + i * 0.045);
      osc.stop(now + i * 0.045 + 0.042);
    }
  }

  function launch() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 1.45);
  }

  function unlock() {
    ensureContext();
    if (musicEnabled && currentMood !== "off" && !stepTimer) {
      const m = currentMood;
      currentMood = "off";
      setMood(m);
    }
  }

  const api = {
    unlock,
    setMood,
    setUrgency,
    setMusicEnabled,
    setSfxEnabled,
    isMusicEnabled: () => musicEnabled,
    isSfxEnabled: () => sfxEnabled,
    keyClick,
    cashRegister,
    correct,
    wrong,
    masterGong,
    thunder,
    doorSlam,
    glitch,
    launch,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafAudio = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
