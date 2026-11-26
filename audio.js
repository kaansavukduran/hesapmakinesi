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
      masterGain.gain.value = 0.88;
      masterGain.connect(ctx.destination);

      musicGain = ctx.createGain();
      musicGain.gain.value = musicEnabled ? 0.36 : 0;
      musicGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = sfxEnabled ? 0.68 : 0;
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
        droneNodes.gain.gain.setTargetAtTime(0.0001, now, 0.16);
        const nodes = droneNodes;
        setTimeout(() => {
          try { nodes.osc1.stop(); } catch (_) {}
          try { nodes.osc2.stop(); } catch (_) {}
          try { nodes.lfo.stop(); } catch (_) {}
        }, 620);
      } catch (_) {}
      droneNodes = null;
    }
    if (rainNode) {
      try { rainNode.src.stop(); } catch (_) {}
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
    filter.Q.setValueAtTime(2.2, now);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.18, now);
    lfoGain.gain.setValueAtTime(cutoff * 0.32, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.75);

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
        bp.frequency.setValueAtTime(1150, now);
        bp.Q.setValueAtTime(0.85, now);
        const rGain = ctx.createGain();
        rGain.gain.setValueAtTime(0.095, now);
        src.connect(bp);
        bp.connect(rGain);
        rGain.connect(musicGain);
        src.start(now);
        rainNode = { src, gain: rGain };
      }
    }
  }

  /* =========================================================
     BESPOKE INSTRUMENTS (KOTO, SHAKUHACHI, MANDOLIN, SYNTH)
     ========================================================= */
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

  /* Far Eastern Plucked Koto / Guzheng String */
  function playKoto(freq, vol) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    overtone.type = "triangle";
    // Subtle Japanese pitch inflection (oshide bend)
    osc.frequency.setValueAtTime(freq * 1.015, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.055);
    overtone.frequency.setValueAtTime(freq * 2, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(3400, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + 0.85);
    filter.Q.setValueAtTime(3.2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol || 0.14, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.05);

    osc.connect(filter);
    overtone.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 1.1);
    overtone.stop(now + 1.1);
  }

  /* Far Eastern Breathy Shakuhachi Bamboo Flute */
  function playShakuhachi(freq, dur, vol) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const vib = ctx.createOscillator();
    const vibGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq * 0.96, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.14);

    vib.type = "sine";
    vib.frequency.setValueAtTime(5.2, now);
    vibGain.gain.setValueAtTime(freq * 0.012, now);
    vib.connect(vibGain);
    vibGain.connect(osc.frequency);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(freq * 1.3, now);
    filter.Q.setValueAtTime(1.4, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(vol || 0.11, now + 0.22);
    gain.gain.setValueAtTime((vol || 0.11) * 0.88, now + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    // Subtle bamboo air breath noise
    const buf = getNoiseBuffer();
    if (buf) {
      const air = ctx.createBufferSource();
      air.buffer = buf;
      const abp = ctx.createBiquadFilter();
      abp.type = "bandpass";
      abp.frequency.setValueAtTime(freq * 2.1, now);
      abp.Q.setValueAtTime(3.0, now);
      const aGain = ctx.createGain();
      aGain.gain.setValueAtTime(0.0001, now);
      aGain.gain.linearRampToValueAtTime(0.032, now + 0.18);
      aGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);
      air.connect(abp);
      abp.connect(aGain);
      aGain.connect(musicGain);
      air.start(now);
      air.stop(now + dur + 0.05);
    }

    osc.start(now);
    vib.start(now);
    osc.stop(now + dur + 0.05);
    vib.stop(now + dur + 0.05);
  }

  /* Zen Shishi-odoshi (hollow bamboo knock) */
  function playBambooKnock() {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(195, now + 0.075);
    gain.gain.setValueAtTime(0.085, now);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.12);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  /* Mafia Noir Mandolin Tremolo */
  function playMandolinTremolo(freq, pulses, vol) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const count = pulses || 4;
    for (let k = 0; k < count; k++) {
      const t = now + k * 0.075;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, t);
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(freq * 2.2, t);
      filter.Q.setValueAtTime(1.8, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol || 0.09, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.072);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(musicGain);
      osc.start(t);
      osc.stop(t + 0.08);
    }
  }

  function playClockTick(accent) {
    if (!musicEnabled || !ctx || ctx.state !== "running") return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(accent ? 1500 : 1050, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.018);
    gain.gain.setValueAtTime(accent ? 0.045 : 0.022, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
    osc.connect(gain);
    gain.connect(musicGain);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /* =========================================================
     CHARACTER / FACTION LEITMOTIF SEQUENCES
     ========================================================= */
  const MOOD_SEQUENCES = {
    /* Neighborhood Shop — warm & cozy */
    shop: {
      interval: 520,
      drone: [110, 1.5, 280, 0.045, false],
      step: (i) => {
        const notes = [261.6, 329.6, 392.0, 329.6, 293.7, 349.2, 440.0, 349.2];
        if (i % 2 === 0) playSynthNote(notes[(i / 2) % notes.length], 0.42, "sine", 0.078, 950);
        playClockTick(i % 4 === 0);
      },
    },

    /* Lunch Rush — upbeat clock pressure */
    rush: {
      interval: 320,
      drone: [82.4, 1.498, 360, 0.075, false],
      step: (i) => {
        const bass = [110, 110, 130.8, 123.5, 110, 110, 98.0, 103.8];
        playSynthNote(bass[i % bass.length], 0.2, "sawtooth", 0.078, 540 + urgency * 450);
        playClockTick(i % 2 === 0);
      },
    },

    /* Mr. Shade — Rainy Noir Detective */
    storm: {
      interval: 460,
      drone: [55, 1.006, 250, 0.13, true],
      step: (i) => {
        const noirWalk = [110, 130.8, 146.8, 138.6, 130.8, 123.5, 110, 98.0];
        playSynthNote(noirWalk[i % noirWalk.length], 0.36, "triangle", 0.095, 520);
        const horn = [440, 0, 0, 415.3, 0, 392, 0, 329.6];
        if (horn[i % horn.length]) playSynthNote(horn[i % horn.length], 0.65, "sawtooth", 0.045, 620);
      },
    },

    /* Don Penny & Mafia — Godfather-style Dark Mandolin Noir! */
    mafia: {
      interval: 380,
      drone: [55.0, 1.004, 240, 0.12, false],
      step: (i) => {
        // Classic Mediterranean/Noir minor cadence in A minor (E–A–C–B–A–C–A–B–A–F–G–E)
        const melody = [329.6, 440.0, 523.3, 493.9, 440.0, 523.3, 440.0, 493.9, 440.0, 349.2, 392.0, 329.6];
        const bass = [110, 0, 164.8, 0, 110, 0, 164.8, 0, 87.3, 0, 82.4, 0];
        const m = melody[i % melody.length];
        const b = bass[i % bass.length];
        if (m) playMandolinTremolo(m, 4, 0.082);
        if (b) playSynthNote(b, 0.45, "triangle", 0.15, 320);
      },
    },

    /* Golden Ratio Syndicate — Sleek Heist Synth-Jazz */
    syndicate: {
      interval: 280,
      drone: [61.7, 1.498, 340, 0.11, false],
      step: (i) => {
        const arp = [123.5, 146.8, 185.0, 220.0, 185.0, 146.8, 130.8, 164.8];
        playSynthNote(arp[i % arp.length], 0.2, "sawtooth", 0.08, 600 + urgency * 520);
        if (i % 4 === 0) playSynthNote(61.7, 0.25, "sine", 0.14, 220);
        if (i % 2 === 1) playClockTick(false);
      },
    },

    /* CERN — Interstellar / Sci-Fi Precision Crisis */
    cern: {
      interval: 250,
      drone: [65.4, 1.5, 480, 0.12, false],
      step: (i) => {
        const organ = [130.8, 196.0, 246.9, 196.0, 138.6, 207.6, 261.6, 207.6];
        playSynthNote(organ[i % organ.length], 0.2, "triangle", 0.085, 980 + urgency * 620);
        playClockTick(i % 4 === 0);
        if (i % 8 === 0) playSynthNote(1046.5, 0.36, "sine", 0.042, 1800);
      },
    },

    /* Spacetime Rift — Cosmic Horizon Climax */
    spacetime: {
      interval: 215,
      drone: [49.0, 1.498, 540, 0.16, false],
      step: (i) => {
        const seq = [98.0, 146.8, 196.0, 233.1, 293.7, 233.1, 196.0, 146.8];
        playSynthNote(seq[i % seq.length], 0.19, "sawtooth", 0.095, 820 + urgency * 920);
        if (i % 4 === 0) playSynthNote(49.0, 0.24, "sine", 0.18, 200);
      },
    },

    /* THE MASTER — Far Eastern Zen Sanctuary (Koto + Shakuhachi + Bamboo) */
    master: {
      interval: 540,
      drone: [146.8, 1.5, 360, 0.065, false],
      step: (i) => {
        // Hirajoshi / Yo Japanese Pentatonic in D: D4(293.7) E4(329.6) G4(392) A4(440) B4(493.9) D5(587.3)
        const kotoPhrase = [293.7, 392.0, 440.0, 0, 587.3, 440.0, 392.0, 329.6, 293.7, 0, 329.6, 392.0, 440.0, 0, 329.6, 293.7];
        const k = kotoPhrase[i % kotoPhrase.length];
        if (k) playKoto(k, 0.13);

        // Shakuhachi bamboo flute sings slowly every 4 beats
        const fluteMap = { 0: 587.3, 4: 440.0, 8: 523.2, 12: 392.0 };
        const f = fluteMap[i % 16];
        if (f) playShakuhachi(f, 1.65, 0.11);

        // Shishi-odoshi bamboo water knock every 8 beats
        if (i % 8 === 6) playBambooKnock();
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
    if (cfg.drone) startDrone(...cfg.drone);
    stepIndex = 0;
    // Play first beat immediately so Master/Mafia theme hits instantly!
    if (ctx && ctx.state === "running") {
      try { cfg.step(stepIndex++); } catch (_) {}
    }
    stepTimer = setInterval(() => {
      if (!musicEnabled || !ctx || ctx.state !== "running") return;
      cfg.step(stepIndex++);
    }, cfg.interval);

    if (urgency >= 0.45) scheduleHeartbeat();
  }

  function setUrgency(val) {
    const prev = urgency;
    urgency = Math.max(0, Math.min(1, Number(val) || 0));
    if (droneNodes && ctx && ctx.state === "running") {
      droneNodes.filter.frequency.setTargetAtTime(260 + urgency * 620, ctx.currentTime, 0.2);
    }
    if (urgency >= 0.45 && prev < 0.45) scheduleHeartbeat();
    else if (urgency < 0.45) clearTimeout(heartTimer);
  }

  function setMusicEnabled(enabled) {
    musicEnabled = Boolean(enabled);
    saveBool(STORAGE_MUSIC, musicEnabled);
    if (musicGain && ctx) {
      musicGain.gain.setTargetAtTime(musicEnabled ? 0.36 : 0.0001, ctx.currentTime, 0.08);
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
      sfxGain.gain.setTargetAtTime(sfxEnabled ? 0.68 : 0.0001, ctx.currentTime, 0.04);
    }
  }

  /* =========================================================
     RICH SOUND EFFECTS (SFX)
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

  function doorBell() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [1568, 2093].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.11);
      gain.gain.setValueAtTime(0.14, now + idx * 0.11);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.11 + 0.42);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.11);
      osc.stop(now + idx * 0.11 + 0.45);
    });
  }

  function itemDrop() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.065);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  function cashRegister() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [1318.5, 1975.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      gain.gain.setValueAtTime(0.001, now + idx * 0.065);
      gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.065 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.065 + 0.48);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.52);
    });
  }

  function coinSpin() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    [2400, 3200, 2750].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + idx * 0.045);
      gain.gain.setValueAtTime(0.09, now + idx * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.045 + 0.14);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.045);
      osc.stop(now + idx * 0.045 + 0.16);
    });
  }

  function xrayPing() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(1180, now + 0.09);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  function comboChime(level) {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const base = 440 * Math.pow(1.06, Math.min(8, level || 1));
    [base, base * 1.25, base * 1.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.15, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.24);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.26);
    });
  }

  function correct() {
    comboChime(2);
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
    // Deep bronze temple gong with rich inharmonic partials
    [110.0, 220.0, 311.1, 440.0, 587.3].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.988, now + 2.1);
      gain.gain.setValueAtTime(0.22 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0004, now + 2.2);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now);
      osc.stop(now + 2.25);
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
    lp.frequency.setValueAtTime(240, now);
    lp.frequency.exponentialRampToValueAtTime(50, now + 1.4);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.46, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    src.connect(lp);
    lp.connect(gain);
    gain.connect(sfxGain);
    src.start(now);
    src.stop(now + 1.55);
  }

  function doorSlam() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(115, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 0.24);
    gain.gain.setValueAtTime(0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  function glassBreak() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 9; i++) {
      const t = now + i * 0.025 + Math.random() * 0.02;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1800 + Math.random() * 2800, t);
      gain.gain.setValueAtTime(0.11, t);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.09);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(t);
      osc.stop(t + 0.1);
    }
    doorSlam();
  }

  function siren() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.linearRampToValueAtTime(980, now + 0.32);
    osc.frequency.linearRampToValueAtTime(620, now + 0.64);
    osc.frequency.linearRampToValueAtTime(980, now + 0.96);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1400;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  function glitch() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(220 + Math.random() * 1450, now + i * 0.042);
      gain.gain.setValueAtTime(0.11, now + i * 0.042);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.042 + 0.038);
      osc.connect(gain);
      gain.connect(sfxGain);
      osc.start(now + i * 0.042);
      osc.stop(now + i * 0.042 + 0.042);
    }
  }

  function launch() {
    if (!sfxEnabled || !ensureContext()) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(940, now + 1.3);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.65);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 1.55);
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
    doorBell,
    itemDrop,
    cashRegister,
    coinSpin,
    xrayPing,
    comboChime,
    correct,
    wrong,
    masterGong,
    thunder,
    doorSlam,
    glassBreak,
    siren,
    glitch,
    launch,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafAudio = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
