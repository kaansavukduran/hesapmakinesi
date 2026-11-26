(function (global) {
  "use strict";

  const SAVE_KEY = "esnaf_story_save_v3";
  const MODE_KEY = "esnaf_ui_mode_v3";

  const I18n = global.EsnafI18n;
  const Audio = global.EsnafAudio;
  const Stage = global.EsnafStage;
  const Story = global.EsnafStory;
  const Dojo = global.EsnafDojo;

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem("esnaf_story_save_v2");
      if (raw) {
        const p = JSON.parse(raw);
        if (p && typeof p === "object") {
          return {
            completed: p.completed || {},
            bestScores: p.bestScores || {},
            dojoStars: p.dojoStars || {},
            rushBest: p.rushBest || 0,
            achievements: p.achievements || {},
            lastEpisode: p.lastEpisode || "ep1",
          };
        }
      }
    } catch (_) {}
    return { completed: {}, bestScores: {}, dojoStars: {}, rushBest: 0, achievements: {}, lastEpisode: "ep1" };
  }

  function writeSave(s) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (_) {}
  }

  function loadMode() {
    try {
      const m = localStorage.getItem(MODE_KEY);
      if (["story", "dojo", "rush", "free"].includes(m)) return m;
    } catch (_) {}
    return "story";
  }

  const save = loadSave();

  const state = {
    mode: loadMode(), // "story" | "dojo" | "rush" | "free"
    view: "hub", // "hub" | "playing" | "episode-clear" | "fail" | "dojo-hub" | "dojo-drill" | "rush-hub" | "rush-play" | "rush-over"
    epIndex: 0,
    sceneIndex: 0,
    score: 0,
    combo: 0,
    lives: 3,
    maxLives: 3,
    attempts: 0,
    correctCount: 0,
    masterNods: 0,
    strokesInTask: 0,
    keysUsedInTask: new Set(),
    guidedIndex: 0,
    masterChoicePicked: false,
    hintVisible: false,
    taskSolved: false,
    failReason: "",
    timeLeft: 0,
    timeTotal: 0,
    timerId: null,
    typeTimerId: null,
    xrayEnabled: true,
    xrayNote: "",

    // Dojo state
    dojoModIndex: 0,
    dojoDrillIndex: 0,
    dojoErrors: 0,

    // Rush state
    rushWave: 0,
    rushScore: 0,
    rushLives: 3,
    rushCombo: 0,
    rushTask: null,
  };

  let typeFinishFn = null;
  let stageCtrl = null;

  /* DOM refs */
  const el = {
    body: document.body,
    calculator: document.querySelector(".calculator"),
    storyStage: document.getElementById("story-stage"),
    btnModeStory: document.getElementById("btn-mode-story"),
    btnModeDojo: document.getElementById("btn-mode-dojo"),
    btnModeRush: document.getElementById("btn-mode-rush"),
    btnModeFree: document.getElementById("btn-mode-free"),
    btnLangTr: document.getElementById("btn-lang-tr"),
    btnLangEn: document.getElementById("btn-lang-en"),
    btnMusic: document.getElementById("btn-music"),
    btnXray: document.getElementById("btn-xray"),
    xrayBar: document.getElementById("xray-bar"),
    xrayMemVal: document.getElementById("xray-mem-val"),
    xrayGtVal: document.getElementById("xray-gt-val"),
    xrayPendVal: document.getElementById("xray-pend-val"),
    xrayNoteEl: document.getElementById("xray-note"),
    trophyToast: document.getElementById("trophy-toast"),
    deskHint: document.getElementById("desk-hint"),
    guideList: document.getElementById("guide-list"),
    guideNote: document.getElementById("guide-note"),
    guideTitle: document.getElementById("guide-title"),
  };

  function currentEpisode() {
    return Story.EPISODES[state.epIndex] || Story.EPISODES[0];
  }

  function currentScene() {
    return currentEpisode().scenes[state.sceneIndex] || null;
  }

  function setTheme(theme) {
    el.body.dataset.theme = theme || "shop-day";
    if (el.calculator) {
      el.calculator.classList.toggle("calc-zero-g", theme === "spacetime-rift");
    }
  }

  function stopTimers() {
    clearInterval(state.timerId);
    state.timerId = null;
    clearInterval(state.typeTimerId);
    state.typeTimerId = null;
    typeFinishFn = null;
    if (Audio) Audio.setUrgency(0);
  }

  /* =========================================================
     ACHIEVEMENT / TROPHY RECEIPT SYSTEM
     ========================================================= */
  let toastTimer = null;
  function unlockAchievement(id) {
    if (save.achievements[id]) return;
    const ach = Dojo.ACHIEVEMENTS.find((a) => a.id === id);
    if (!ach) return;
    save.achievements[id] = true;
    writeSave(save);

    if (el.trophyToast) {
      el.trophyToast.innerHTML = `
        <div class="trophy-icon">${ach.icon}</div>
        <div class="trophy-copy">
          <div class="trophy-kicker">${I18n.t("trophyUnlocked")}</div>
          <div class="trophy-name">${I18n.pick(ach.title)}</div>
        </div>
      `;
      el.trophyToast.hidden = false;
      el.trophyToast.classList.remove("show");
      void el.trophyToast.offsetWidth;
      el.trophyToast.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        el.trophyToast.classList.remove("show");
        setTimeout(() => { el.trophyToast.hidden = true; }, 260);
      }, 3200);
    }
  }

  /* =========================================================
     MASTER'S EYE (LIVE X-RAY MEMORY BAR)
     ========================================================= */
  function updateXrayBar(ev) {
    if (!el.xrayBar || !global.EsnafCalc) return;
    const s = global.EsnafCalc.engine.state;
    const fmt = (n) => I18n.formatNumber(n);

    if (el.xrayMemVal) {
      const prev = el.xrayMemVal.textContent;
      const next = fmt(s.memory);
      el.xrayMemVal.textContent = next;
      if (prev !== next) pulseNode(el.xrayMemVal.parentElement);
    }
    if (el.xrayGtVal) {
      const prev = el.xrayGtVal.textContent;
      const next = fmt(s.grandTotal);
      el.xrayGtVal.textContent = next;
      if (prev !== next) pulseNode(el.xrayGtVal.parentElement);
    }
    if (el.xrayPendVal) {
      const OP = { "+": "+", "-": "−", "*": "×", "/": "÷" };
      el.xrayPendVal.textContent =
        s.pendingOp && s.accumulator !== null ? `${fmt(s.accumulator)} ${OP[s.pendingOp]}` : "—";
    }

    if (ev && ev.key) {
      if (ev.key === "ce") state.xrayNote = I18n.t("xrayCeShield");
      else if (ev.key === "mu") state.xrayNote = I18n.t("xrayMuExplain");
      else if (ev.key === "kdv-plus" || ev.key === "kdv-minus") state.xrayNote = I18n.t("xrayKdvExplain");
      else if (ev.key === "gt") {
        state.xrayNote = I18n.t("xrayGtExplain");
        if (Audio) Audio.xrayPing();
      } else if (ev.key === "m-plus" || ev.key === "m-minus" || ev.key === "mrc") {
        state.xrayNote = I18n.t("xrayMemExplain");
        if (Audio) Audio.xrayPing();
      }
    }

    if (el.xrayNoteEl) {
      el.xrayNoteEl.textContent = state.xrayNote || I18n.t("xrayIdle");
    }
  }

  function pulseNode(node) {
    if (!node) return;
    node.classList.remove("xray-pulse");
    void node.offsetWidth;
    node.classList.add("xray-pulse");
  }

  /* =========================================================
     TRANSLATIONS & TOP CONTROLS
     ========================================================= */
  function applyStaticTranslations() {
    document.title = I18n.t("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = I18n.t(node.dataset.i18n);
    });
    if (el.deskHint) {
      el.deskHint.innerHTML = I18n.t(state.mode === "free" ? "deskHintFree" : "deskHintStory");
    }
    if (el.guideTitle) el.guideTitle.textContent = I18n.t("guideTitle");
    if (el.guideList) {
      el.guideList.innerHTML = I18n.t("guideItems")
        .map((it) => `<li><span class="guide-kbd${it.coral ? " coral" : ""}">${it.kbd}</span><span>${it.html}</span></li>`)
        .join("");
    }
    if (el.guideNote) el.guideNote.innerHTML = I18n.t("guideNote");
    updateXrayBar();
  }

  function renderTopControls() {
    const map = {
      story: el.btnModeStory,
      dojo: el.btnModeDojo,
      rush: el.btnModeRush,
      free: el.btnModeFree,
    };
    Object.keys(map).forEach((m) => {
      const b = map[m];
      if (!b) return;
      const active = state.mode === m;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    const lang = I18n.getLang();
    el.btnLangTr.classList.toggle("active", lang === "tr");
    el.btnLangEn.classList.toggle("active", lang === "en");

    if (el.btnMusic && Audio) {
      el.btnMusic.setAttribute("aria-pressed", String(Audio.isMusicEnabled()));
    }
    if (el.btnXray) {
      el.btnXray.setAttribute("aria-pressed", String(state.xrayEnabled));
    }
    if (el.xrayBar) {
      el.xrayBar.hidden = !state.xrayEnabled;
    }

    const isFree = state.mode === "free";
    el.body.classList.toggle("mode-story", !isFree);
    el.body.classList.toggle("mode-free", isFree);
    el.storyStage.hidden = isFree;

    if (el.deskHint) {
      el.deskHint.innerHTML = I18n.t(isFree ? "deskHintFree" : "deskHintStory");
    }
  }

  function setMode(mode) {
    state.mode = ["story", "dojo", "rush", "free"].includes(mode) ? mode : "story";
    try { localStorage.setItem(MODE_KEY, state.mode); } catch (_) {}

    stopTimers();
    if (global.EsnafCalc) {
      global.EsnafCalc.clearHighlights();
      if (state.mode !== "free") global.EsnafCalc.setReceiptOpen(false);
    }

    if (state.mode === "free") {
      setTheme("shop-day");
      if (Audio) Audio.setMood("off");
    } else if (state.mode === "story") {
      if (state.view === "playing") enterScene(state.sceneIndex, true);
      else renderHub();
    } else if (state.mode === "dojo") {
      renderDojoHub();
    } else if (state.mode === "rush") {
      renderRushHub();
    }
    renderTopControls();
  }

  /* =========================================================
     SHARED STAGE MOUNT & TYPEWRITER
     ========================================================= */
  function mountStageBox() {
    const box = document.getElementById("live-stage-mount");
    if (!box) return null;
    stageCtrl = Stage.createStageController(box);
    return stageCtrl;
  }

  function startTypewriter(targetEl, fullText) {
    if (!targetEl) return;
    clearInterval(state.typeTimerId);
    let i = 0;
    targetEl.textContent = "";
    if (stageCtrl) stageCtrl.setCharacterState("talking");
    const step = fullText.length > 130 ? 4 : 3;
    typeFinishFn = () => {
      clearInterval(state.typeTimerId);
      state.typeTimerId = null;
      targetEl.textContent = fullText;
      typeFinishFn = null;
      if (stageCtrl) stageCtrl.setCharacterState("idle");
    };
    state.typeTimerId = setInterval(() => {
      i = Math.min(fullText.length, i + step);
      targetEl.textContent = fullText.slice(0, i);
      if (i >= fullText.length) typeFinishFn();
    }, 15);
  }

  function advanceOrFinishTypewriter() {
    if (typeFinishFn) {
      typeFinishFn();
      return;
    }
    enterScene(state.sceneIndex + 1, false);
  }

  /* =========================================================
     STORY HUB (5 EPISODES + TROPHY RECEIPTS)
     ========================================================= */
  function renderHub() {
    stopTimers();
    state.view = "hub";
    setTheme("shop-day");
    if (Audio) Audio.setMood("off");
    if (global.EsnafCalc) global.EsnafCalc.clearHighlights();

    const completedCount = Object.keys(save.completed).length;
    const nextEpIdx = Story.EPISODES.findIndex((e) => !save.completed[e.id]);
    const resumeIdx = nextEpIdx === -1 ? 0 : nextEpIdx;

    const epCardsHtml = Story.EPISODES.map((ep, idx) => {
      const done = Boolean(save.completed[ep.id]);
      const best = save.bestScores[ep.id];
      const keysHtml = ep.keysTaught.map((k) => `<span class="ep-key-chip">${k}</span>`).join("");
      return `
        <button type="button" class="ep-card ${done ? "is-done" : ""}" data-start-ep="${idx}">
          <div class="ep-card-top">
            <span class="ep-num">EP ${ep.num}</span>
            <span class="ep-loc">${I18n.pick(ep.location)}</span>
            <span class="ep-status">${done ? "★ " + (best || 0) : I18n.t("statusReady")}</span>
          </div>
          <div class="ep-card-title">${I18n.pick(ep.title)}</div>
          <div class="ep-card-sub">${I18n.pick(ep.subtitle)}</div>
          <div class="ep-keys">${keysHtml}</div>
        </button>
      `;
    }).join("");

    const trophiesHtml = Dojo.ACHIEVEMENTS.map((a) => {
      const unlocked = Boolean(save.achievements[a.id]);
      return `<span class="trophy-chip ${unlocked ? "unlocked" : ""}" title="${I18n.pick(a.desc)}">${a.icon} ${I18n.pick(a.title)}</span>`;
    }).join("");

    el.storyStage.innerHTML = `
      <div class="story-card story-hub">
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="hub-hero">
          <div class="hub-badge">${I18n.t("hubBadge")}</div>
          <h2 class="hub-title">${I18n.t("gameTitle")}</h2>
          <p class="hub-tagline">${I18n.t("gameTagline")}</p>
          <div class="hub-cta-row">
            <button type="button" id="btn-hub-play" class="story-btn-primary" data-start-ep="${resumeIdx}">
              ${completedCount > 0 ? I18n.t("btnContinueStory") : I18n.t("btnStartStory")} →
            </button>
            <button type="button" id="btn-hub-dojo" class="story-btn-gold">${I18n.t("modeDojo")}</button>
            <button type="button" id="btn-hub-rush" class="story-btn-ghost">${I18n.t("modeRush")}</button>
          </div>
        </div>
        <div class="ep-list" role="list">${epCardsHtml}</div>
        <div class="trophy-shelf">
          <div class="trophy-shelf-title">${I18n.t("trophiesTitle")}</div>
          <div class="trophy-chips">${trophiesHtml}</div>
        </div>
      </div>
    `;

    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: "shop-day",
        character: "clara",
        props: ["bread", "milk"],
        location: I18n.pick(Story.EPISODES[0].location),
        walkIn: false,
      });
    }

    el.storyStage.querySelectorAll("[data-start-ep]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (Audio) Audio.unlock();
        startEpisode(Number(btn.dataset.startEp));
      });
    });
    document.getElementById("btn-hub-dojo").addEventListener("click", () => setMode("dojo"));
    document.getElementById("btn-hub-rush").addEventListener("click", () => setMode("rush"));
  }

  /* =========================================================
     STORY EPISODE ENGINE
     ========================================================= */
  function startEpisode(epIndex) {
    state.epIndex = Math.max(0, Math.min(Story.EPISODES.length - 1, epIndex));
    state.sceneIndex = 0;
    state.score = 0;
    state.combo = 0;
    state.lives = state.maxLives;
    state.attempts = 0;
    state.correctCount = 0;
    state.masterNods = 0;
    state.view = "playing";
    save.lastEpisode = currentEpisode().id;
    writeSave(save);

    if (global.EsnafCalc) {
      global.EsnafCalc.reset("clear-all-mem");
      global.EsnafCalc.setDecMode("F");
      global.EsnafCalc.setKdvRate(20);
    }
    enterScene(0, false);
  }

  function enterScene(idx, isRerender) {
    stopTimers();
    const ep = currentEpisode();
    if (idx >= ep.scenes.length) {
      finishEpisode();
      return;
    }

    state.sceneIndex = idx;
    const scene = ep.scenes[idx];
    state.view = "playing";
    state.hintVisible = false;
    state.taskSolved = false;
    state.strokesInTask = 0;
    state.guidedIndex = 0;
    state.masterChoicePicked = false;
    state.keysUsedInTask = new Set();

    setTheme(scene.theme || ep.defaultTheme);

    if (Audio) {
      Audio.unlock();
      Audio.setMood(scene.mood || "shop");
      if (!isRerender) {
        if (scene.type === "master") Audio.masterGong();
        else if (scene.sfx && typeof Audio[scene.sfx] === "function") Audio[scene.sfx]();
      }
    }

    if (global.EsnafCalc) {
      if (!isRerender && scene.type === "task") {
        if (scene.presetKeys) global.EsnafCalc.runPresetKeys(scene.presetKeys);
        else global.EsnafCalc.reset(scene.resetCalc || "all");
      }
      if (scene.guidedSteps && scene.guidedSteps.length > 0 && scene.guidedSteps[0].buttonId) {
        global.EsnafCalc.highlightKeys([scene.guidedSteps[0].buttonId]);
      } else if (scene.highlightKeys && scene.highlightKeys.length > 0) {
        global.EsnafCalc.highlightKeys(scene.highlightKeys);
      } else {
        global.EsnafCalc.clearHighlights();
      }
      updateXrayBar();
    }

    if (scene.type === "master") renderMasterScene(scene);
    else if (scene.type === "cutscene") renderCutscene(scene);
    else renderTaskScene(scene, isRerender);
  }

  function sceneHeaderHtml(ep) {
    const pct = Math.round(((state.sceneIndex + 1) / ep.scenes.length) * 100);
    const hearts = Array.from({ length: state.maxLives }, (_, i) =>
      `<span class="heart ${i < state.lives ? "alive" : "lost"}" aria-hidden="true">●</span>`
    ).join("");
    return `
      <div class="stage-hud">
        <button type="button" id="btn-stage-hub" class="hud-back">← ${I18n.t("btnBackHub")}</button>
        <div class="hud-meta">
          <span class="hud-ep">EP ${ep.num}</span>
          <span class="hud-step">${I18n.t("stepProgress", { cur: state.sceneIndex + 1, total: ep.scenes.length })}</span>
          <span class="hud-score">${I18n.t("labelScore")}: <strong>${state.score}</strong></span>
          <span class="hud-hearts">${hearts}</span>
        </div>
      </div>
      <div class="stage-progress-track"><div class="stage-progress-fill" style="width:${pct}%"></div></div>
    `;
  }

  function bindBackButton() {
    const back = document.getElementById("btn-stage-hub");
    if (back) back.addEventListener("click", renderHub);
  }

  function renderCutscene(scene) {
    const ep = currentEpisode();
    const text = I18n.pick(scene.text);

    el.storyStage.innerHTML = `
      <div class="story-card story-cutscene">
        ${sceneHeaderHtml(ep)}
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="cutscene-body">
          ${scene.badge ? `<div class="story-badge">${I18n.pick(scene.badge)}</div>` : ""}
          <div class="speaker-bar">
            <span class="speaker-name">${I18n.pick(scene.speaker)}</span>
            <span class="speaker-role">${I18n.pick(scene.role)}</span>
          </div>
          <p id="cutscene-text" class="cutscene-text"></p>
        </div>
        <div class="story-footer-actions">
          <button type="button" id="btn-scene-next" class="story-btn-primary">
            ${I18n.t("btnNext")} (Space / Enter) →
          </button>
        </div>
      </div>
    `;

    bindBackButton();
    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: scene.backdrop || ep.defaultBackdrop,
        character: scene.portrait,
        props: scene.props,
        location: I18n.pick(ep.location),
        walkIn: true,
      });
      sc.setCombo(state.combo);
      if (scene.specialEvent) setTimeout(() => sc.playSpecialEvent(scene.specialEvent), 160);
    }

    startTypewriter(document.getElementById("cutscene-text"), text);
    document.getElementById("btn-scene-next").addEventListener("click", advanceOrFinishTypewriter);
  }

  function renderMasterScene(scene) {
    const ep = currentEpisode();
    const quote = I18n.pick(scene.quote);
    const lesson = scene.lesson ? I18n.pick(scene.lesson) : "";
    const choicesHtml = Array.isArray(scene.choices)
      ? `<div id="master-choices" class="master-choices">
          ${scene.choices
            .map((c, idx) => `<button type="button" class="master-choice-btn" data-choice="${idx}">“${I18n.pick(c.label)}”</button>`)
            .join("")}
        </div>`
      : "";

    el.storyStage.innerHTML = `
      <div class="story-card story-master ${scene.isTwist ? "is-twist" : ""}">
        ${sceneHeaderHtml(ep)}
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="master-body">
          <div class="master-ribbon">${scene.isTwist ? "PLOT TWIST #2 · " : ""}${I18n.t("masterBadge")}</div>
          <blockquote id="master-quote" class="master-quote"></blockquote>
          ${choicesHtml}
          ${lesson ? `<div class="master-lesson">${lesson}</div>` : ""}
        </div>
        <div class="story-footer-actions">
          <button type="button" id="btn-scene-next" class="story-btn-gold">
            ${I18n.t("masterContinue")} →
          </button>
        </div>
      </div>
    `;

    bindBackButton();
    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: scene.backdrop || "master-dojo",
        character: scene.portrait || "master",
        props: [],
        location: scene.isTwist ? "2066 · 120D" : "Zen Dojo · 120D",
        walkIn: true,
      });
    }

    const quoteEl = document.getElementById("master-quote");
    startTypewriter(quoteEl, `“${quote}”`);

    el.storyStage.querySelectorAll("[data-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.choice);
        const choice = scene.choices[idx];
        if (!choice) return;
        state.masterChoicePicked = true;
        if (Audio) Audio.xrayPing();
        const box = document.getElementById("master-choices");
        if (box) box.innerHTML = `<div class="master-player-said">› “${I18n.pick(choice.label)}”</div>`;
        startTypewriter(quoteEl, `“${I18n.pick(choice.reply)}”`);
      });
    });

    document.getElementById("btn-scene-next").addEventListener("click", advanceOrFinishTypewriter);
  }

  function renderTaskScene(scene, isRerender) {
    const ep = currentEpisode();
    const itemsHtml = (scene.items || [])
      .map(
        (it) => `<div class="ticket-row"><span class="ticket-item">${I18n.pick(it.label)}</span><span class="ticket-val">${I18n.pick(it.amountText)}</span></div>`
      )
      .join("");

    const cashRow =
      typeof scene.cashGiven === "number"
        ? `<div class="ticket-row ticket-cash"><span>${I18n.t("givenCashLabel")}</span><strong>${I18n.formatMoney(scene.cashGiven)}</strong></div>`
        : "";

    const submitLabel = I18n.t(scene.submitLabelKey || "btnSubmit");
    const calcDisplay = global.EsnafCalc ? global.EsnafCalc.getDisplayText() : "0";

    const timerHtml =
      scene.timeLimit > 0
        ? `<div class="timer-wrap">
            <div class="timer-head"><span>${I18n.t("labelTimeLeft")}</span><strong id="timer-sec">${Math.ceil(isRerender ? state.timeLeft : scene.timeLimit)}s</strong></div>
            <div class="timer-track"><div id="timer-bar" class="timer-bar" style="width:100%"></div></div>
          </div>`
        : `<div class="timer-relaxed">${I18n.t("labelEndless")}</div>`;

    const guidedHtml =
      scene.guidedSteps && scene.guidedSteps[state.guidedIndex]
        ? `<div id="guided-banner" class="guided-banner">${I18n.pick(scene.guidedSteps[state.guidedIndex].text)}</div>`
        : "";

    el.storyStage.innerHTML = `
      <div id="task-card" class="story-card story-task">
        ${sceneHeaderHtml(ep)}
        <div id="live-stage-mount" class="stage-mount"></div>
        ${timerHtml}
        <div class="speaker-bar">
          <span class="speaker-name">${I18n.pick(scene.speaker)}</span>
          <span class="speaker-role">${I18n.pick(scene.role)}</span>
        </div>
        <div class="dialogue-bubble" id="task-dialogue">${I18n.pick(scene.dialogue)}</div>
        ${guidedHtml}
        <div class="order-ticket">
          ${itemsHtml}
          ${cashRow}
          <div class="ticket-ask">
            <span class="ticket-ask-label">${I18n.t("targetAskLabel")}</span>
            <span class="ticket-ask-text">${I18n.pick(scene.ask)}</span>
          </div>
        </div>
        <div id="task-feedback" class="task-feedback" hidden></div>
        <div id="real-life-tip" class="real-life-tip" hidden></div>
        <div id="task-hint-box" class="task-hint-box" ${state.hintVisible ? "" : "hidden"}>
          ${scene.hint ? I18n.pick(scene.hint) : ""}
        </div>
        <div class="task-actions">
          <button type="button" id="btn-task-submit" class="story-btn-primary">
            <span>${submitLabel}</span>
            <span id="submit-preview" class="submit-preview">${calcDisplay}</span>
          </button>
          ${scene.hint ? `<button type="button" id="btn-task-hint" class="story-btn-ghost">${I18n.t("btnHint")}</button>` : ""}
        </div>
      </div>
    `;

    bindBackButton();
    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: scene.backdrop || ep.defaultBackdrop,
        character: scene.portrait,
        props: scene.props,
        cashLabel: typeof scene.cashGiven === "number" ? I18n.formatMoney(scene.cashGiven) : "",
        location: I18n.pick(ep.location),
        walkIn: !isRerender,
      });
      sc.setCombo(state.combo);
    }

    document.getElementById("btn-task-submit").addEventListener("click", submitCurrentTask);
    const hintBtn = document.getElementById("btn-task-hint");
    if (hintBtn) {
      hintBtn.addEventListener("click", () => {
        state.hintVisible = !state.hintVisible;
        const box = document.getElementById("task-hint-box");
        if (box) box.hidden = !state.hintVisible;
      });
    }

    if (scene.timeLimit > 0) {
      if (!isRerender || state.timeLeft <= 0) {
        state.timeTotal = scene.timeLimit;
        state.timeLeft = scene.timeLimit;
      }
      startTaskTimer(() => handleTaskFailure("timeout"));
    }
  }

  function startTaskTimer(onExpire) {
    clearInterval(state.timerId);
    const barEl = document.getElementById("timer-bar");
    const secEl = document.getElementById("timer-sec");
    let panicked = false;
    const updateVisual = () => {
      const ratio = Math.max(0, state.timeLeft / Math.max(1, state.timeTotal));
      if (barEl) {
        barEl.style.width = `${ratio * 100}%`;
        barEl.classList.toggle("danger", ratio <= 0.35);
      }
      if (secEl) secEl.textContent = `${Math.ceil(state.timeLeft)}s`;
      if (Audio) Audio.setUrgency(1 - ratio);
      if (ratio <= 0.35 && !panicked) {
        panicked = true;
        if (stageCtrl) stageCtrl.setCharacterState("impatient");
      }
    };
    updateVisual();

    state.timerId = setInterval(() => {
      if (state.taskSolved) return;
      state.timeLeft = Math.max(0, state.timeLeft - 0.1);
      updateVisual();
      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        state.timerId = null;
        onExpire();
      }
    }, 100);
  }

  function showFeedback(text, kind) {
    const fb = document.getElementById("task-feedback");
    if (!fb) return;
    fb.textContent = text;
    fb.className = `task-feedback is-${kind}`;
    fb.hidden = false;
  }

  function submitCurrentTask() {
    if (state.mode === "dojo" && state.view === "dojo-drill") {
      submitDojoDrill();
      return;
    }
    if (state.mode === "rush" && state.view === "rush-play") {
      submitRushTask();
      return;
    }

    const scene = currentScene();
    if (!scene || scene.type !== "task" || state.taskSolved || !global.EsnafCalc) return;
    if (Audio) Audio.unlock();

    if (scene.requiredDecMode && global.EsnafCalc.getDecMode() !== scene.requiredDecMode) {
      if (Audio) Audio.wrong();
      showFeedback(I18n.t("decModeWarn", { mode: scene.requiredDecMode }), "warn");
      return;
    }

    state.attempts++;
    const val = global.EsnafCalc.getNumericValue();
    const tol = scene.tolerance || 0.005;
    const isCorrect = Number.isFinite(val) && Math.abs(val - scene.expected) <= tol;

    if (isCorrect) {
      state.taskSolved = true;
      state.correctCount++;
      state.combo++;
      clearInterval(state.timerId);
      state.timerId = null;
      if (Audio) Audio.setUrgency(0);
      if (state.combo >= 3) unlockAchievement("combo_3");

      let gained = 100 + (state.combo > 1 ? state.combo * 15 : 0);
      if (scene.timeLimit > 0) gained += Math.round((state.timeLeft / scene.timeLimit) * 60);
      let earnedMasterNod = false;
      if (Array.isArray(scene.bonusKeys) && scene.bonusKeys.length > 0) {
        earnedMasterNod = scene.bonusKeys.some((k) => state.keysUsedInTask.has(k));
        if (earnedMasterNod) {
          gained += 50;
          state.masterNods++;
        }
      }
      state.score += gained;

      // Audio & Stage Juice FX
      if (scene.onSuccessEffect === "cash") {
        if (Audio) Audio.cashRegister();
        if (stageCtrl) stageCtrl.playPayOut(`+${gained}`, true);
      } else if (scene.onSuccessEffect === "glitch") {
        if (Audio) Audio.glitch();
        global.EsnafCalc.triggerGlitch();
        if (stageCtrl) stageCtrl.playPayOut(`+${gained}`, false);
      } else if (scene.onSuccessEffect === "launch") {
        if (Audio) Audio.launch();
        global.EsnafCalc.triggerGlitch();
        if (stageCtrl) {
          stageCtrl.playSpecialEvent("rocket-launch");
          stageCtrl.spawnFloatingText("120.120,01!", "score");
        }
      } else {
        if (Audio) Audio.comboChime(state.combo);
        if (stageCtrl) stageCtrl.playPayOut(`+${gained}`, false);
      }
      if (stageCtrl) stageCtrl.setCombo(state.combo);

      const dialogueEl = document.getElementById("task-dialogue");
      if (dialogueEl && scene.successReply) {
        dialogueEl.textContent = I18n.pick(scene.successReply);
        dialogueEl.classList.add("is-happy");
      }

      const parPart = scene.parStrokes && state.strokesInTask > 0
        ? ` · ${I18n.t("parToast", { strokes: state.strokesInTask, par: scene.parStrokes })}`
        : "";
      const bonusPart = earnedMasterNod ? ` · ${I18n.t("masterNodToast")}` : "";
      showFeedback(`+${gained} ${I18n.t("labelScore")}${bonusPart}${parPart}`, "ok");

      if (scene.realLifeTip) {
        const tipEl = document.getElementById("real-life-tip");
        if (tipEl) {
          tipEl.innerHTML = `<strong>${I18n.t("realLifeLabel")}:</strong> ${I18n.pick(scene.realLifeTip)}`;
          tipEl.hidden = false;
        }
      }

      const actionsEl = el.storyStage.querySelector(".task-actions");
      if (actionsEl) {
        actionsEl.innerHTML = `<button type="button" id="btn-scene-next" class="story-btn-primary">${I18n.t("btnNext")} (Space / Enter) →</button>`;
        document.getElementById("btn-scene-next").addEventListener("click", () => enterScene(state.sceneIndex + 1, false));
      }
    } else {
      state.combo = 0;
      state.lives = Math.max(0, state.lives - 1);
      if (Audio) Audio.wrong();
      if (stageCtrl) {
        stageCtrl.setCombo(0);
        stageCtrl.playErrorEffect();
      }
      const card = document.getElementById("task-card");
      if (card) {
        card.classList.remove("card-shake");
        void card.offsetWidth;
        card.classList.add("card-shake");
      }
      el.storyStage.querySelectorAll(".hud-hearts .heart").forEach((h, i) => {
        h.classList.toggle("alive", i < state.lives);
        h.classList.toggle("lost", i >= state.lives);
      });
      const dialogueEl = document.getElementById("task-dialogue");
      if (dialogueEl && scene.wrongReply) dialogueEl.textContent = I18n.pick(scene.wrongReply);
      showFeedback(I18n.t("wrongToast"), "err");

      if (state.lives <= 0) handleTaskFailure("lives");
    }
  }

  function handleTaskFailure(reason) {
    stopTimers();
    state.view = "fail";
    state.failReason = reason;
    state.combo = 0;
    if (Audio) {
      Audio.wrong();
      Audio.setMood("master");
    }
    const ep = currentEpisode();
    el.storyStage.innerHTML = `
      <div class="story-card story-fail">
        ${sceneHeaderHtml(ep)}
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="fail-body">
          <h3 class="fail-title">${reason === "timeout" ? I18n.t("timeoutTitle") : I18n.t("livesOutTitle")}</h3>
          <p class="fail-msg">${reason === "timeout" ? I18n.t("timeoutMsg") : I18n.t("livesOutMsg")}</p>
        </div>
        <div class="story-footer-actions">
          <button type="button" id="btn-retry-scene" class="story-btn-primary">${I18n.t("btnRetry")} ↻</button>
          <button type="button" id="btn-fail-hub" class="story-btn-ghost">${I18n.t("btnBackHub")}</button>
        </div>
      </div>
    `;
    bindBackButton();
    const sc = mountStageBox();
    if (sc) sc.setScene({ backdrop: "master-dojo", character: "master", walkIn: false });
    document.getElementById("btn-retry-scene").addEventListener("click", () => {
      state.lives = state.maxLives;
      enterScene(state.sceneIndex, false);
    });
    document.getElementById("btn-fail-hub").addEventListener("click", renderHub);
  }

  function finishEpisode() {
    stopTimers();
    state.view = "episode-clear";
    const ep = currentEpisode();
    save.completed[ep.id] = true;
    save.bestScores[ep.id] = Math.max(save.bestScores[ep.id] || 0, state.score);
    writeSave(save);

    unlockAchievement(`${ep.id}_clear`);
    const isCampaignEnd = state.epIndex === Story.EPISODES.length - 1;
    const accuracy = state.attempts > 0 ? Math.round((state.correctCount / state.attempts) * 100) : 100;

    if (Audio) {
      Audio.setMood("master");
      if (isCampaignEnd) Audio.cashRegister();
      else Audio.correct();
    }
    if (global.EsnafCalc) global.EsnafCalc.clearHighlights();

    const keysHtml = ep.keysTaught.map((k) => `<span class="ep-key-chip">${k}</span>`).join("");

    el.storyStage.innerHTML = `
      <div class="story-card story-clear">
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="clear-badge">EP ${ep.num} / 5</div>
        <h2 class="clear-title">${isCampaignEnd ? I18n.t("campaignClearTitle") : I18n.t("episodeClearTitle")}</h2>
        <p class="clear-sub">${isCampaignEnd ? I18n.t("campaignClearSub") : I18n.pick(ep.title)}</p>
        <div class="clear-stats">
          <div class="stat-box"><span>${I18n.t("labelScore")}</span><strong>${state.score}</strong></div>
          <div class="stat-box"><span>${I18n.t("labelAccuracy")}</span><strong>%${accuracy}</strong></div>
          <div class="stat-box"><span>${I18n.t("labelMasterBonus")}</span><strong>${state.masterNods}</strong></div>
        </div>
        <div class="clear-keys-wrap">
          <div class="clear-keys-label">${I18n.t("labelKeys")}</div>
          <div class="ep-keys">${keysHtml}</div>
        </div>
        <div class="story-footer-actions">
          ${
            !isCampaignEnd
              ? `<button type="button" id="btn-next-ep" class="story-btn-primary">${I18n.t("btnNextEpisode")} →</button>`
              : `<button type="button" id="btn-play-again" class="story-btn-gold">${I18n.t("btnPlayAgain")} ↻</button>`
          }
          <button type="button" id="btn-clear-hub" class="story-btn-ghost">${I18n.t("btnBackHub")}</button>
        </div>
      </div>
    `;
    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: isCampaignEnd ? "shop-day" : "master-dojo",
        character: isCampaignEnd ? "clara" : "master",
        props: isCampaignEnd ? ["receipt_star", "bread"] : [],
        walkIn: false,
      });
    }
    const nextEpBtn = document.getElementById("btn-next-ep");
    if (nextEpBtn) nextEpBtn.addEventListener("click", () => startEpisode(state.epIndex + 1));
    const againBtn = document.getElementById("btn-play-again");
    if (againBtn) againBtn.addEventListener("click", () => startEpisode(0));
    document.getElementById("btn-clear-hub").addEventListener("click", renderHub);
  }

  /* =========================================================
     MASTER'S KEY DOJO (8 CALCULATOR SKILL MODULES)
     ========================================================= */
  function renderDojoHub() {
    stopTimers();
    state.view = "dojo-hub";
    setTheme("master-zen");
    if (Audio) {
      Audio.unlock();
      Audio.setMood("master");
    }
    if (global.EsnafCalc) global.EsnafCalc.clearHighlights();

    const cards = Dojo.DOJO_MODULES.map((m, idx) => {
      const stars = save.dojoStars[m.id] || 0;
      const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
      return `
        <button type="button" class="dojo-card ${stars > 0 ? "is-done" : ""}" data-dojo="${idx}">
          <div class="dojo-card-top">
            <span class="dojo-badge">${I18n.pick(m.badge)}</span>
            <span class="dojo-stars">${starStr}</span>
          </div>
          <div class="dojo-card-title">${I18n.pick(m.title)}</div>
          <div class="dojo-card-tip">${I18n.pick(m.realLife)}</div>
        </button>
      `;
    }).join("");

    el.storyStage.innerHTML = `
      <div class="story-card story-master">
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="hub-hero">
          <div class="master-ribbon">${I18n.t("masterBadge")}</div>
          <h2 class="hub-title">${I18n.t("dojoTitle")}</h2>
          <p class="hub-tagline" style="color:#dfd3c0">${I18n.t("dojoSub")}</p>
        </div>
        <div class="dojo-grid">${cards}</div>
      </div>
    `;
    const sc = mountStageBox();
    if (sc) sc.setScene({ backdrop: "master-dojo", character: "master", location: "Key Dojo · 8 Skills", walkIn: false });

    el.storyStage.querySelectorAll("[data-dojo]").forEach((b) => {
      b.addEventListener("click", () => startDojoModule(Number(b.dataset.dojo)));
    });
  }

  function startDojoModule(idx) {
    state.dojoModIndex = idx;
    state.dojoDrillIndex = 0;
    state.dojoErrors = 0;
    state.view = "dojo-drill";
    enterDojoDrill(false);
  }

  function enterDojoDrill(isRerender) {
    const mod = Dojo.DOJO_MODULES[state.dojoModIndex];
    const drill = mod.drills[state.dojoDrillIndex];
    state.taskSolved = false;
    state.hintVisible = false;
    state.keysUsedInTask = new Set();

    if (global.EsnafCalc) {
      if (!isRerender) {
        if (drill.presetKeys) global.EsnafCalc.runPresetKeys(drill.presetKeys);
        else global.EsnafCalc.reset(drill.resetCalc || "clear-all-mem");
      }
      global.EsnafCalc.highlightKeys(mod.keys);
      updateXrayBar();
    }

    const calcDisplay = global.EsnafCalc ? global.EsnafCalc.getDisplayText() : "0";
    el.storyStage.innerHTML = `
      <div id="task-card" class="story-card story-master">
        <div class="stage-hud">
          <button type="button" id="btn-dojo-back" class="hud-back">← ${I18n.t("dojoBack")}</button>
          <div class="hud-meta">
            <span class="hud-ep">${I18n.pick(mod.badge)}</span>
            <span>${I18n.t("dojoDrillProgress", { cur: state.dojoDrillIndex + 1, total: mod.drills.length })}</span>
          </div>
        </div>
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="master-lesson"><strong>${I18n.t("realLifeLabel")}:</strong> ${I18n.pick(mod.realLife)}</div>
        <div class="order-ticket">
          <div class="ticket-ask" style="border:none;padding:0;margin:0">
            <span class="ticket-ask-label">${I18n.pick(mod.title)}</span>
            <span class="ticket-ask-text">${I18n.pick(drill.ask)}</span>
          </div>
        </div>
        <div id="task-feedback" class="task-feedback" hidden></div>
        <div id="task-hint-box" class="task-hint-box" hidden>${I18n.pick(drill.hint)}</div>
        <div class="task-actions">
          <button type="button" id="btn-task-submit" class="story-btn-gold">
            <span>${I18n.t("btnSubmit")}</span>
            <span id="submit-preview" class="submit-preview">${calcDisplay}</span>
          </button>
          <button type="button" id="btn-task-hint" class="story-btn-ghost">${I18n.t("btnHint")}</button>
        </div>
      </div>
    `;
    const sc = mountStageBox();
    if (sc) sc.setScene({ backdrop: "master-dojo", character: "master", location: I18n.pick(mod.title), walkIn: false });
    document.getElementById("btn-dojo-back").addEventListener("click", renderDojoHub);
    document.getElementById("btn-task-submit").addEventListener("click", submitDojoDrill);
    document.getElementById("btn-task-hint").addEventListener("click", () => {
      const box = document.getElementById("task-hint-box");
      if (box) box.hidden = !box.hidden;
    });
  }

  function submitDojoDrill() {
    const mod = Dojo.DOJO_MODULES[state.dojoModIndex];
    const drill = mod.drills[state.dojoDrillIndex];
    if (!drill || state.taskSolved || !global.EsnafCalc) return;

    if (drill.requiredDecMode && global.EsnafCalc.getDecMode() !== drill.requiredDecMode) {
      if (Audio) Audio.wrong();
      showFeedback(I18n.t("decModeWarn", { mode: drill.requiredDecMode }), "warn");
      return;
    }

    const val = global.EsnafCalc.getNumericValue();
    const tol = drill.tolerance || 0.005;
    if (Number.isFinite(val) && Math.abs(val - drill.expected) <= tol) {
      state.taskSolved = true;
      if (Audio) Audio.correct();
      if (stageCtrl) stageCtrl.playPayOut("✓", false);
      showFeedback(I18n.t("dojoComplete"), "ok");

      setTimeout(() => {
        if (state.mode !== "dojo" || state.view !== "dojo-drill") return;
        if (state.dojoDrillIndex + 1 < mod.drills.length) {
          state.dojoDrillIndex++;
          enterDojoDrill(false);
        } else {
          const stars = state.dojoErrors === 0 ? 3 : state.dojoErrors === 1 ? 2 : 1;
          save.dojoStars[mod.id] = Math.max(save.dojoStars[mod.id] || 0, stars);
          writeSave(save);
          unlockAchievement("dojo_1");
          renderDojoHub();
        }
      }, 650);
    } else {
      state.dojoErrors++;
      if (Audio) Audio.wrong();
      if (stageCtrl) stageCtrl.playErrorEffect();
      showFeedback(I18n.t("wrongToast"), "err");
    }
  }

  /* =========================================================
     ESNAF RUSH (ENDLESS ARCADE MODE)
     ========================================================= */
  function renderRushHub() {
    stopTimers();
    state.view = "rush-hub";
    setTheme("shop-day");
    if (Audio) Audio.setMood("off");
    if (global.EsnafCalc) global.EsnafCalc.clearHighlights();

    el.storyStage.innerHTML = `
      <div class="story-card story-clear">
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="clear-badge">ARCADE · ${I18n.t("rushBest")}: ${save.rushBest}</div>
        <h2 class="clear-title">${I18n.t("rushTitle")}</h2>
        <p class="clear-sub">${I18n.t("rushSub")}</p>
        <div class="story-footer-actions">
          <button type="button" id="btn-rush-go" class="story-btn-primary">${I18n.t("rushStart")}</button>
        </div>
      </div>
    `;
    const sc = mountStageBox();
    if (sc) sc.setScene({ backdrop: "shop-day", character: "sam", props: ["coffee", "bread"], location: "ESNAF RUSH", walkIn: false });
    document.getElementById("btn-rush-go").addEventListener("click", () => {
      if (Audio) Audio.unlock();
      state.rushWave = 0;
      state.rushScore = 0;
      state.rushLives = 3;
      state.rushCombo = 0;
      state.view = "rush-play";
      nextRushWave();
    });
  }

  function nextRushWave() {
    stopTimers();
    state.taskSolved = false;
    state.keysUsedInTask = new Set();
    const task = Dojo.generateRushTask(state.rushWave);
    state.rushTask = task;

    setTheme(task.theme || "shop-day");
    if (Audio) {
      Audio.setMood(task.mood || "rush");
      Audio.doorBell();
    }
    if (global.EsnafCalc) {
      global.EsnafCalc.reset(task.resetCalc || "all");
      global.EsnafCalc.setDecMode("F");
      updateXrayBar();
    }

    const hearts = Array.from({ length: 3 }, (_, i) =>
      `<span class="heart ${i < state.rushLives ? "alive" : "lost"}">●</span>`
    ).join("");
    const calcDisplay = global.EsnafCalc ? global.EsnafCalc.getDisplayText() : "0";

    el.storyStage.innerHTML = `
      <div id="task-card" class="story-card story-task">
        <div class="stage-hud">
          <button type="button" id="btn-rush-exit" class="hud-back">← Rush</button>
          <div class="hud-meta">
            <span class="hud-ep">${I18n.t("rushWave", { n: state.rushWave + 1 })}</span>
            <span>${I18n.t("labelScore")}: <strong>${state.rushScore}</strong></span>
            <span class="hud-hearts">${hearts}</span>
          </div>
        </div>
        <div id="live-stage-mount" class="stage-mount"></div>
        <div class="timer-wrap">
          <div class="timer-head"><span>${I18n.t("labelTimeLeft")}</span><strong id="timer-sec">${task.timeLimit}s</strong></div>
          <div class="timer-track"><div id="timer-bar" class="timer-bar" style="width:100%"></div></div>
        </div>
        <div class="speaker-bar"><span class="speaker-name">${I18n.pick(task.speaker)}</span></div>
        <div class="dialogue-bubble">${I18n.pick(task.dialogue)}</div>
        <div class="order-ticket">
          <div class="ticket-ask" style="border:none;padding:0;margin:0">
            <span class="ticket-ask-label">${I18n.t("targetAskLabel")}</span>
            <span class="ticket-ask-text">${I18n.pick(task.ask)}</span>
          </div>
        </div>
        <div id="task-feedback" class="task-feedback" hidden></div>
        <div class="task-actions">
          <button type="button" id="btn-task-submit" class="story-btn-primary">
            <span>${I18n.t("btnSubmit")}</span>
            <span id="submit-preview" class="submit-preview">${calcDisplay}</span>
          </button>
        </div>
      </div>
    `;

    const sc = mountStageBox();
    if (sc) {
      sc.setScene({
        backdrop: task.backdrop,
        character: task.portrait,
        props: task.props,
        cashLabel: task.cashGiven ? I18n.formatMoney(task.cashGiven) : "",
        location: `RUSH #${state.rushWave + 1}`,
        walkIn: true,
      });
      sc.setCombo(state.rushCombo);
    }

    document.getElementById("btn-rush-exit").addEventListener("click", renderRushHub);
    document.getElementById("btn-task-submit").addEventListener("click", submitRushTask);

    state.timeTotal = task.timeLimit;
    state.timeLeft = task.timeLimit;
    startTaskTimer(() => {
      state.rushLives--;
      state.rushCombo = 0;
      if (state.rushLives <= 0) renderRushOver();
      else nextRushWave();
    });
  }

  function submitRushTask() {
    const task = state.rushTask;
    if (!task || state.taskSolved || !global.EsnafCalc) return;
    const val = global.EsnafCalc.getNumericValue();
    if (Number.isFinite(val) && Math.abs(val - task.expected) <= 0.01) {
      state.taskSolved = true;
      clearInterval(state.timerId);
      state.rushCombo++;
      const gained = 100 + Math.round((state.timeLeft / state.timeTotal) * 60) + state.rushCombo * 20;
      state.rushScore += gained;
      if (state.rushScore > save.rushBest) {
        save.rushBest = state.rushScore;
        writeSave(save);
      }
      if (state.rushCombo >= 3) unlockAchievement("combo_3");
      if (state.rushScore >= 500) unlockAchievement("rush_500");

      if (Audio) task.onSuccessEffect === "cash" ? Audio.cashRegister() : Audio.comboChime(state.rushCombo);
      if (stageCtrl) {
        stageCtrl.playPayOut(`+${gained}`, task.onSuccessEffect === "cash");
        stageCtrl.setCombo(state.rushCombo);
      }
      setTimeout(() => {
        if (state.mode !== "rush" || state.view !== "rush-play") return;
        state.rushWave++;
        nextRushWave();
      }, 650);
    } else {
      state.rushCombo = 0;
      state.rushLives--;
      if (Audio) Audio.wrong();
      if (stageCtrl) {
        stageCtrl.setCombo(0);
        stageCtrl.playErrorEffect();
      }
      showFeedback(I18n.t("wrongToast"), "err");
      if (state.rushLives <= 0) {
        setTimeout(renderRushOver, 400);
      } else {
        el.storyStage.querySelectorAll(".hud-hearts .heart").forEach((h, i) => {
          h.classList.toggle("alive", i < state.rushLives);
          h.classList.toggle("lost", i >= state.rushLives);
        });
      }
    }
  }

  function renderRushOver() {
    stopTimers();
    state.view = "rush-over";
    if (Audio) Audio.setMood("master");
    el.storyStage.innerHTML = `
      <div class="story-card story-clear">
        <div class="clear-badge">ESNAF RUSH · ${I18n.t("rushBest")}: ${save.rushBest}</div>
        <h2 class="clear-title">${I18n.t("rushOverTitle")}</h2>
        <p class="clear-sub">${I18n.t("rushOverSub", { waves: state.rushWave })}</p>
        <div class="clear-stats">
          <div class="stat-box"><span>${I18n.t("labelScore")}</span><strong>${state.rushScore}</strong></div>
          <div class="stat-box"><span>${I18n.t("rushBest")}</span><strong>${save.rushBest}</strong></div>
          <div class="stat-box"><span>${I18n.t("modeRush")}</span><strong>#${state.rushWave}</strong></div>
        </div>
        <div class="story-footer-actions">
          <button type="button" id="btn-rush-again" class="story-btn-primary">${I18n.t("btnRetry")} ↻</button>
          <button type="button" id="btn-rush-story" class="story-btn-ghost">${I18n.t("modeStory")}</button>
        </div>
      </div>
    `;
    document.getElementById("btn-rush-again").addEventListener("click", () => {
      state.rushWave = 0;
      state.rushScore = 0;
      state.rushLives = 3;
      state.rushCombo = 0;
      state.view = "rush-play";
      nextRushWave();
    });
    document.getElementById("btn-rush-story").addEventListener("click", () => setMode("story"));
  }

  /* =========================================================
     CALCULATOR & KEYBOARD HOOKS
     ========================================================= */
  if (global.EsnafCalc) {
    global.EsnafCalc.onAction((ev) => {
      updateXrayBar(ev);
      if (state.mode === "free") return;

      if (ev.key) {
        state.keysUsedInTask.add(ev.key);
        state.strokesInTask++;
      }

      const preview = document.getElementById("submit-preview");
      if (preview) preview.textContent = global.EsnafCalc.getDisplayText();

      // Advance step-by-step guided walkthrough if present!
      if (state.mode === "story" && state.view === "playing") {
        const scene = currentScene();
        if (scene && scene.guidedSteps && state.guidedIndex < scene.guidedSteps.length) {
          const curStep = scene.guidedSteps[state.guidedIndex];
          if (ev.key === curStep.key) {
            state.guidedIndex++;
            const banner = document.getElementById("guided-banner");
            if (state.guidedIndex < scene.guidedSteps.length) {
              const nextStep = scene.guidedSteps[state.guidedIndex];
              if (banner) banner.textContent = I18n.pick(nextStep.text);
              if (nextStep.buttonId) global.EsnafCalc.highlightKeys([nextStep.buttonId]);
            } else {
              if (banner) banner.hidden = true;
              global.EsnafCalc.clearHighlights();
            }
          }
        }
      }
    });
  }

  function handleGlobalKeydown(e) {
    if (state.mode === "free") return false;

    if (state.mode === "story" && state.view === "playing") {
      const scene = currentScene();
      if (scene && (scene.type !== "task" || state.taskSolved)) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          const nextBtn = document.getElementById("btn-scene-next");
          if (nextBtn) nextBtn.click();
          return true;
        }
      }
      if (scene && scene.type === "task" && !state.taskSolved && e.key === " ") {
        e.preventDefault();
        submitCurrentTask();
        return true;
      }
    }

    if ((state.mode === "dojo" && state.view === "dojo-drill") || (state.mode === "rush" && state.view === "rush-play")) {
      if (e.key === " ") {
        e.preventDefault();
        submitCurrentTask();
        return true;
      }
    }

    return false;
  }

  /* =========================================================
     TOP BAR EVENT WIRING & BOOTSTRAP
     ========================================================= */
  el.btnModeStory.addEventListener("click", () => setMode("story"));
  el.btnModeDojo.addEventListener("click", () => setMode("dojo"));
  el.btnModeRush.addEventListener("click", () => setMode("rush"));
  el.btnModeFree.addEventListener("click", () => setMode("free"));

  el.btnLangTr.addEventListener("click", () => I18n.setLang("tr"));
  el.btnLangEn.addEventListener("click", () => I18n.setLang("en"));

  if (el.btnMusic && Audio) {
    el.btnMusic.addEventListener("click", () => {
      Audio.unlock();
      Audio.setMusicEnabled(!Audio.isMusicEnabled());
      renderTopControls();
    });
  }

  if (el.btnXray) {
    el.btnXray.addEventListener("click", () => {
      state.xrayEnabled = !state.xrayEnabled;
      renderTopControls();
      updateXrayBar();
    });
  }

  I18n.onLangChange(() => {
    applyStaticTranslations();
    renderTopControls();
    if (state.mode === "story") {
      if (state.view === "hub") renderHub();
      else if (state.view === "playing") enterScene(state.sceneIndex, true);
      else if (state.view === "fail") handleTaskFailure(state.failReason);
      else if (state.view === "episode-clear") finishEpisode();
    } else if (state.mode === "dojo") {
      if (state.view === "dojo-drill") enterDojoDrill(true);
      else renderDojoHub();
    } else if (state.mode === "rush") {
      if (state.view === "rush-hub") renderRushHub();
      else if (state.view === "rush-over") renderRushOver();
    }
  });

  global.EsnafGame = {
    state,
    setMode,
    startEpisode,
    renderHub,
    handleGlobalKeydown,
  };

  /* Init */
  applyStaticTranslations();
  renderTopControls();
  if (state.mode === "story") renderHub();
  else if (state.mode === "dojo") renderDojoHub();
  else if (state.mode === "rush") renderRushHub();
  else setTheme("shop-day");
})(typeof window !== "undefined" ? window : globalThis);
