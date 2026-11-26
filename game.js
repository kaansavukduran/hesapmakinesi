(function (global) {
  "use strict";

  const SAVE_KEY = "esnaf_story_save_v2";
  const MODE_KEY = "esnaf_ui_mode_v2";

  const I18n = global.EsnafI18n;
  const Audio = global.EsnafAudio;
  const Portraits = global.EsnafPortraits;
  const Story = global.EsnafStory;

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return {
            completed: parsed.completed || {},
            bestScores: parsed.bestScores || {},
            lastEpisode: parsed.lastEpisode || "ep1",
          };
        }
      }
    } catch (_) {}
    return { completed: {}, bestScores: {}, lastEpisode: "ep1" };
  }

  function writeSave(save) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (_) {}
  }

  function loadMode() {
    try {
      const m = localStorage.getItem(MODE_KEY);
      if (m === "free" || m === "story") return m;
    } catch (_) {}
    return "story";
  }

  const save = loadSave();

  const state = {
    mode: loadMode(), // "story" | "free"
    view: "hub", // "hub" | "playing" | "episode-clear" | "fail"
    epIndex: 0,
    sceneIndex: 0,
    score: 0,
    lives: 3,
    maxLives: 3,
    attempts: 0,
    correctCount: 0,
    masterNods: 0,
    keysUsedInTask: new Set(),
    hintVisible: false,
    taskSolved: false,
    feedbackText: "",
    feedbackKind: "", // "" | "ok" | "err" | "warn"
    failReason: "", // "timeout" | "lives"
    timeLeft: 0,
    timeTotal: 0,
    timerId: null,
    typeTimerId: null,
    autoAdvanceId: null,
  };

  let typeFinishFn = null;

  /* DOM refs */
  const el = {
    body: document.body,
    workspace: document.querySelector(".workspace"),
    storyStage: document.getElementById("story-stage"),
    btnModeStory: document.getElementById("btn-mode-story"),
    btnModeFree: document.getElementById("btn-mode-free"),
    btnLangTr: document.getElementById("btn-lang-tr"),
    btnLangEn: document.getElementById("btn-lang-en"),
    btnMusic: document.getElementById("btn-music"),
    deskHint: document.getElementById("desk-hint"),
    guideList: document.getElementById("guide-list"),
    guideNote: document.getElementById("guide-note"),
    guideTitle: document.getElementById("guide-title"),
  };

  function currentEpisode() {
    return Story.EPISODES[state.epIndex] || Story.EPISODES[0];
  }

  function currentScene() {
    const ep = currentEpisode();
    return ep.scenes[state.sceneIndex] || null;
  }

  function setTheme(theme) {
    el.body.dataset.theme = theme || "shop-day";
  }

  function stopTimers() {
    clearInterval(state.timerId);
    state.timerId = null;
    clearInterval(state.typeTimerId);
    state.typeTimerId = null;
    typeFinishFn = null;
    clearTimeout(state.autoAdvanceId);
    state.autoAdvanceId = null;
    if (Audio) Audio.setUrgency(0);
  }

  function applyStaticTranslations() {
    document.title = I18n.t("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      node.textContent = I18n.t(key);
    });
    if (el.deskHint) {
      el.deskHint.innerHTML = I18n.t(state.mode === "story" ? "deskHintStory" : "deskHintFree");
    }
    // Render Guide Modal dynamically in active language
    if (el.guideTitle) el.guideTitle.textContent = I18n.t("guideTitle");
    if (el.guideList) {
      const items = I18n.t("guideItems");
      el.guideList.innerHTML = items
        .map(
          (item) =>
            `<li><span class="guide-kbd${item.coral ? " coral" : ""}">${item.kbd}</span><span>${item.html}</span></li>`
        )
        .join("");
    }
    if (el.guideNote) el.guideNote.innerHTML = I18n.t("guideNote");
  }

  function renderTopControls() {
    const isStory = state.mode === "story";
    el.btnModeStory.classList.toggle("active", isStory);
    el.btnModeFree.classList.toggle("active", !isStory);
    el.btnModeStory.setAttribute("aria-pressed", String(isStory));
    el.btnModeFree.setAttribute("aria-pressed", String(!isStory));

    const lang = I18n.getLang();
    el.btnLangTr.classList.toggle("active", lang === "tr");
    el.btnLangEn.classList.toggle("active", lang === "en");

    if (el.btnMusic && Audio) {
      el.btnMusic.setAttribute("aria-pressed", String(Audio.isMusicEnabled()));
    }

    el.body.classList.toggle("mode-story", isStory);
    el.body.classList.toggle("mode-free", !isStory);
    el.storyStage.hidden = !isStory;

    if (el.deskHint) {
      el.deskHint.innerHTML = I18n.t(isStory ? "deskHintStory" : "deskHintFree");
    }
  }

  function setMode(mode) {
    state.mode = mode === "free" ? "free" : "story";
    try { localStorage.setItem(MODE_KEY, state.mode); } catch (_) {}

    if (state.mode === "free") {
      stopTimers();
      setTheme("shop-day");
      if (Audio) Audio.setMood("off");
      if (global.EsnafCalc) global.EsnafCalc.clearHighlights();
    } else {
      if (global.EsnafCalc) global.EsnafCalc.setReceiptOpen(false);
      if (state.view === "playing") {
        enterScene(state.sceneIndex, true);
      } else {
        renderHub();
      }
    }
    renderTopControls();
  }

  /* =========================================================
     CAMPAIGN HUB (EPISODE SELECTOR)
     ========================================================= */
  function renderHub() {
    stopTimers();
    state.view = "hub";
    setTheme("shop-day");
    if (Audio) Audio.setMood("off");
    if (global.EsnafCalc) global.EsnafCalc.clearHighlights();

    const completedCount = Object.keys(save.completed).length;
    const nextEpIdx = Math.min(
      Story.EPISODES.length - 1,
      Math.max(0, Story.EPISODES.findIndex((e) => !save.completed[e.id]))
    );
    const resumeIdx = completedCount === Story.EPISODES.length ? 0 : (nextEpIdx === -1 ? 0 : nextEpIdx);

    const epCardsHtml = Story.EPISODES.map((ep, idx) => {
      const done = Boolean(save.completed[ep.id]);
      const best = save.bestScores[ep.id];
      const keysHtml = ep.keysTaught
        .map((k) => `<span class="ep-key-chip">${k}</span>`)
        .join("");
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

    el.storyStage.innerHTML = `
      <div class="story-card story-hub">
        <div class="hub-hero">
          <div class="hub-badge">${I18n.t("hubBadge")}</div>
          <h2 class="hub-title">${I18n.t("gameTitle")}</h2>
          <p class="hub-tagline">${I18n.t("gameTagline")}</p>
          <div class="hub-cta-row">
            <button type="button" id="btn-hub-play" class="story-btn-primary" data-start-ep="${resumeIdx}">
              ${completedCount > 0 ? I18n.t("btnContinueStory") : I18n.t("btnStartStory")} →
            </button>
            <button type="button" id="btn-hub-free" class="story-btn-ghost">${I18n.t("btnFreeMode")}</button>
          </div>
        </div>
        <div class="ep-list" role="list">
          ${epCardsHtml}
        </div>
      </div>
    `;

    el.storyStage.querySelectorAll("[data-start-ep]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (Audio) Audio.unlock();
        startEpisode(Number(btn.dataset.startEp));
      });
    });

    const freeBtn = document.getElementById("btn-hub-free");
    if (freeBtn) {
      freeBtn.addEventListener("click", () => setMode("free"));
    }
  }

  /* =========================================================
     EPISODE & SCENE ENGINE
     ========================================================= */
  function startEpisode(epIndex) {
    state.epIndex = Math.max(0, Math.min(Story.EPISODES.length - 1, epIndex));
    state.sceneIndex = 0;
    state.score = 0;
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
    state.feedbackText = "";
    state.feedbackKind = "";
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
        if (scene.presetKeys) {
          global.EsnafCalc.runPresetKeys(scene.presetKeys);
        } else {
          global.EsnafCalc.reset(scene.resetCalc || "all");
        }
      }
      if (scene.highlightKeys && scene.highlightKeys.length > 0) {
        global.EsnafCalc.highlightKeys(scene.highlightKeys);
      } else {
        global.EsnafCalc.clearHighlights();
      }
    }

    if (scene.type === "master") {
      renderMasterScene(scene);
    } else if (scene.type === "cutscene") {
      renderCutscene(scene);
    } else {
      renderTaskScene(scene, isRerender);
    }
  }

  function startTypewriter(targetEl, fullText) {
    if (!targetEl) return;
    clearInterval(state.typeTimerId);
    let i = 0;
    targetEl.textContent = "";
    const step = fullText.length > 130 ? 4 : 3;
    typeFinishFn = () => {
      clearInterval(state.typeTimerId);
      state.typeTimerId = null;
      targetEl.textContent = fullText;
      typeFinishFn = null;
    };
    state.typeTimerId = setInterval(() => {
      i = Math.min(fullText.length, i + step);
      targetEl.textContent = fullText.slice(0, i);
      if (i >= fullText.length) {
        typeFinishFn();
      }
    }, 14);
  }

  function advanceOrFinishTypewriter() {
    if (typeFinishFn) {
      typeFinishFn();
      return;
    }
    enterScene(state.sceneIndex + 1, false);
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
          <span class="hud-hearts" title="Kasa Sağlığı">${hearts}</span>
        </div>
      </div>
      <div class="stage-progress-track" aria-hidden="true">
        <div class="stage-progress-fill" style="width:${pct}%"></div>
      </div>
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
        <div class="cutscene-body">
          ${scene.badge ? `<div class="story-badge">${I18n.pick(scene.badge)}</div>` : ""}
          <div class="character-row">
            <div class="portrait-frame">${Portraits.getPortrait(scene.portrait)}</div>
            <div class="speaker-meta">
              <div class="speaker-name">${I18n.pick(scene.speaker)}</div>
              <div class="speaker-role">${I18n.pick(scene.role)}</div>
            </div>
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
    startTypewriter(document.getElementById("cutscene-text"), text);
    document.getElementById("btn-scene-next").addEventListener("click", advanceOrFinishTypewriter);
  }

  function renderMasterScene(scene) {
    const ep = currentEpisode();
    const quote = I18n.pick(scene.quote);
    const lesson = scene.lesson ? I18n.pick(scene.lesson) : "";

    el.storyStage.innerHTML = `
      <div class="story-card story-master ${scene.isTwist ? "is-twist" : ""}">
        ${sceneHeaderHtml(ep)}
        <div class="master-body">
          <div class="master-ribbon">${scene.isTwist ? "PLOT TWIST #2 · " : ""}${I18n.t("masterBadge")}</div>
          <div class="master-portrait-wrap">
            <div class="portrait-frame portrait-master">${Portraits.getPortrait(scene.portrait || "master")}</div>
          </div>
          <blockquote id="master-quote" class="master-quote"></blockquote>
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
    startTypewriter(document.getElementById("master-quote"), `“${quote}”`);
    document.getElementById("btn-scene-next").addEventListener("click", advanceOrFinishTypewriter);
  }

  function renderTaskScene(scene, isRerender) {
    const ep = currentEpisode();
    const itemsHtml = (scene.items || [])
      .map(
        (it) => `
          <div class="ticket-row">
            <span class="ticket-item">${I18n.pick(it.label)}</span>
            <span class="ticket-val">${I18n.pick(it.amountText)}</span>
          </div>
        `
      )
      .join("");

    const cashRow =
      typeof scene.cashGiven === "number"
        ? `<div class="ticket-row ticket-cash">
            <span>${I18n.t("givenCashLabel")}</span>
            <strong>${I18n.formatMoney(scene.cashGiven)}</strong>
          </div>`
        : "";

    const submitLabel = I18n.t(scene.submitLabelKey || "btnSubmit");
    const calcDisplay = global.EsnafCalc ? global.EsnafCalc.getDisplayText() : "0";

    const timerHtml =
      scene.timeLimit > 0
        ? `
          <div class="timer-wrap">
            <div class="timer-head">
              <span>${I18n.t("labelTimeLeft")}</span>
              <strong id="timer-sec">${Math.ceil(isRerender ? state.timeLeft : scene.timeLimit)}s</strong>
            </div>
            <div class="timer-track">
              <div id="timer-bar" class="timer-bar" style="width:100%"></div>
            </div>
          </div>
        `
        : `<div class="timer-relaxed">${I18n.t("labelEndless")}</div>`;

    el.storyStage.innerHTML = `
      <div id="task-card" class="story-card story-task">
        ${sceneHeaderHtml(ep)}
        ${timerHtml}
        <div class="character-row">
          <div class="portrait-frame">${Portraits.getPortrait(scene.portrait)}</div>
          <div class="speaker-meta">
            <div class="speaker-name">${I18n.pick(scene.speaker)}</div>
            <div class="speaker-role">${I18n.pick(scene.role)}</div>
          </div>
        </div>
        <div class="dialogue-bubble" id="task-dialogue">${I18n.pick(scene.dialogue)}</div>
        <div class="order-ticket">
          ${itemsHtml}
          ${cashRow}
          <div class="ticket-ask">
            <span class="ticket-ask-label">${I18n.t("targetAskLabel")}</span>
            <span class="ticket-ask-text">${I18n.pick(scene.ask)}</span>
          </div>
        </div>

        <div id="task-feedback" class="task-feedback" hidden></div>
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

    const submitBtn = document.getElementById("btn-task-submit");
    if (submitBtn) submitBtn.addEventListener("click", submitCurrentTask);

    const hintBtn = document.getElementById("btn-task-hint");
    if (hintBtn) {
      hintBtn.addEventListener("click", () => {
        state.hintVisible = !state.hintVisible;
        const box = document.getElementById("task-hint-box");
        if (box) box.hidden = !state.hintVisible;
      });
    }

    if (scene.timeLimit > 0) {
      if (!isRerender) {
        state.timeTotal = scene.timeLimit;
        state.timeLeft = scene.timeLimit;
      }
      startTaskTimer();
    }
  }

  function startTaskTimer() {
    clearInterval(state.timerId);
    const barEl = document.getElementById("timer-bar");
    const secEl = document.getElementById("timer-sec");
    const updateVisual = () => {
      const ratio = Math.max(0, state.timeLeft / Math.max(1, state.timeTotal));
      if (barEl) {
        barEl.style.width = `${ratio * 100}%`;
        barEl.classList.toggle("danger", ratio <= 0.32);
      }
      if (secEl) secEl.textContent = `${Math.ceil(state.timeLeft)}s`;
      if (Audio) Audio.setUrgency(1 - ratio);
    };
    updateVisual();

    state.timerId = setInterval(() => {
      if (state.taskSolved || state.view !== "playing" || state.mode !== "story") return;
      state.timeLeft = Math.max(0, state.timeLeft - 0.1);
      updateVisual();
      if (state.timeLeft <= 0) {
        clearInterval(state.timerId);
        state.timerId = null;
        handleTaskFailure("timeout");
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
    const scene = currentScene();
    if (!scene || scene.type !== "task" || state.taskSolved) return;
    if (!global.EsnafCalc) return;

    if (Audio) Audio.unlock();

    // Check required decimal switch mode first (educational, doesn't dock a life)
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
      clearInterval(state.timerId);
      state.timerId = null;
      if (Audio) Audio.setUrgency(0);

      let gained = 100;
      if (scene.timeLimit > 0) {
        gained += Math.round((state.timeLeft / scene.timeLimit) * 60);
      }
      let earnedMasterNod = false;
      if (Array.isArray(scene.bonusKeys) && scene.bonusKeys.length > 0) {
        earnedMasterNod = scene.bonusKeys.some((k) => state.keysUsedInTask.has(k));
        if (earnedMasterNod) {
          gained += 50;
          state.masterNods++;
        }
      }
      state.score += gained;

      // Play tailored success effect
      if (scene.onSuccessEffect === "cash") {
        if (Audio) Audio.cashRegister();
      } else if (scene.onSuccessEffect === "glitch") {
        if (Audio) Audio.glitch();
        global.EsnafCalc.triggerGlitch();
      } else if (scene.onSuccessEffect === "launch") {
        if (Audio) Audio.launch();
        global.EsnafCalc.triggerGlitch();
      } else {
        if (Audio) Audio.correct();
      }

      const dialogueEl = document.getElementById("task-dialogue");
      if (dialogueEl && scene.successReply) {
        dialogueEl.textContent = I18n.pick(scene.successReply);
        dialogueEl.classList.add("is-happy");
      }

      const bonusMsg = earnedMasterNod ? ` · ${I18n.t("masterNodToast")}` : "";
      showFeedback(`+${gained} ${I18n.t("labelScore")}${bonusMsg}`, "ok");

      const actionsEl = el.storyStage.querySelector(".task-actions");
      if (actionsEl) {
        actionsEl.innerHTML = `
          <button type="button" id="btn-scene-next" class="story-btn-primary">
            ${I18n.t("btnNext")} (Space / Enter) →
          </button>
        `;
        document.getElementById("btn-scene-next").addEventListener("click", () => {
          enterScene(state.sceneIndex + 1, false);
        });
      }
    } else {
      state.lives = Math.max(0, state.lives - 1);
      if (Audio) Audio.wrong();

      const card = document.getElementById("task-card");
      if (card) {
        card.classList.remove("card-shake");
        void card.offsetWidth;
        card.classList.add("card-shake");
      }

      // Update hearts visually
      const hearts = el.storyStage.querySelectorAll(".hud-hearts .heart");
      hearts.forEach((h, idx) => {
        h.classList.toggle("alive", idx < state.lives);
        h.classList.toggle("lost", idx >= state.lives);
      });

      const dialogueEl = document.getElementById("task-dialogue");
      if (dialogueEl && scene.wrongReply) {
        dialogueEl.textContent = I18n.pick(scene.wrongReply);
      }

      showFeedback(I18n.t("wrongToast"), "err");

      if (state.lives <= 0) {
        handleTaskFailure("lives");
      }
    }
  }

  function handleTaskFailure(reason) {
    stopTimers();
    state.view = "fail";
    state.failReason = reason;
    if (Audio) {
      Audio.wrong();
      Audio.setMood("master");
    }

    const ep = currentEpisode();
    const title = reason === "timeout" ? I18n.t("timeoutTitle") : I18n.t("livesOutTitle");
    const msg = reason === "timeout" ? I18n.t("timeoutMsg") : I18n.t("livesOutMsg");

    el.storyStage.innerHTML = `
      <div class="story-card story-fail">
        ${sceneHeaderHtml(ep)}
        <div class="fail-body">
          <div class="portrait-frame portrait-master">${Portraits.getPortrait("master")}</div>
          <h3 class="fail-title">${title}</h3>
          <p class="fail-msg">${msg}</p>
        </div>
        <div class="story-footer-actions">
          <button type="button" id="btn-retry-scene" class="story-btn-primary">${I18n.t("btnRetry")} ↻</button>
          <button type="button" id="btn-fail-hub" class="story-btn-ghost">${I18n.t("btnBackHub")}</button>
        </div>
      </div>
    `;

    bindBackButton();
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
      <div class="story-card story-clear ${isCampaignEnd ? "is-finale" : ""}">
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

    const nextEpBtn = document.getElementById("btn-next-ep");
    if (nextEpBtn) {
      nextEpBtn.addEventListener("click", () => startEpisode(state.epIndex + 1));
    }
    const playAgainBtn = document.getElementById("btn-play-again");
    if (playAgainBtn) {
      playAgainBtn.addEventListener("click", () => startEpisode(0));
    }
    document.getElementById("btn-clear-hub").addEventListener("click", renderHub);
  }

  /* =========================================================
     CALCULATOR & KEYBOARD HOOKS
     ========================================================= */
  if (global.EsnafCalc) {
    global.EsnafCalc.onAction((ev) => {
      if (state.mode !== "story" || state.view !== "playing") return;
      if (ev.key) state.keysUsedInTask.add(ev.key);
      const preview = document.getElementById("submit-preview");
      if (preview && global.EsnafCalc) {
        preview.textContent = global.EsnafCalc.getDisplayText();
      }
    });
  }

  function handleGlobalKeydown(e) {
    if (state.mode !== "story") return false;

    const scene = currentScene();

    // Advance cutscene / master / solved task with Space or Enter
    if (state.view === "playing" && scene && (scene.type !== "task" || state.taskSolved)) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const nextBtn = document.getElementById("btn-scene-next");
        if (nextBtn) nextBtn.click();
        return true;
      }
    }

    // Submit active task with Space
    if (state.view === "playing" && scene && scene.type === "task" && !state.taskSolved) {
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

  I18n.onLangChange(() => {
    applyStaticTranslations();
    renderTopControls();
    if (state.mode === "story") {
      if (state.view === "hub") renderHub();
      else if (state.view === "playing") enterScene(state.sceneIndex, true);
      else if (state.view === "fail") handleTaskFailure(state.failReason);
      else if (state.view === "episode-clear") finishEpisode();
    }
  });

  /* Public API */
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
  if (state.mode === "story") {
    renderHub();
  } else {
    setTheme("shop-day");
  }
})(typeof window !== "undefined" ? window : globalThis);
