(function () {
  "use strict";

  const MAX_DIGITS = 12;
  const MAX_VALUE = 999999999999; // 12 nines
  const STORAGE_KEYS = {
    receipt: "esnaf_calc_receipt_v1",
    sound: "esnaf_calc_sound_v1",
    decMode: "esnaf_calc_dec_v1",
    kdvRate: "esnaf_calc_kdv_v1",
  };

  const OP_SYMBOLS = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
  };

  /* =========================================================
     NUMBER & FORMATTING HELPERS (TURKISH STANDARD)
     ========================================================= */
  function roundHalfAwayFromZero(num, decimals) {
    const factor = Math.pow(10, decimals);
    const sign = num < 0 ? -1 : 1;
    return (sign * Math.round(Math.abs(num) * factor + Number.EPSILON * factor)) / factor;
  }

  function cleanFloat(num) {
    if (!Number.isFinite(num)) return NaN;
    if (Math.abs(num) < 1e-11) return 0;
    const precise = Number(num.toPrecision(12));
    return Object.is(precise, -0) ? 0 : precise;
  }

  function applyDecMode(num, decMode) {
    const cleaned = cleanFloat(num);
    if (!Number.isFinite(cleaned)) return NaN;
    if (Math.abs(cleaned) > MAX_VALUE) return NaN;

    if (decMode === "0") {
      const r = roundHalfAwayFromZero(cleaned, 0);
      return Math.abs(r) > MAX_VALUE ? NaN : Object.is(r, -0) ? 0 : r;
    }
    if (decMode === "2") {
      const r = roundHalfAwayFromZero(cleaned, 2);
      return Math.abs(r) > MAX_VALUE ? NaN : Object.is(r, -0) ? 0 : r;
    }

    // Floating 'F' mode: cap decimal digits so total digits <= 12
    const absVal = Math.abs(cleaned);
    const intPart = Math.floor(absVal);
    const intDigits = intPart === 0 ? 1 : String(intPart).length;
    if (intDigits > MAX_DIGITS) return NaN;
    const maxFrac = Math.max(0, MAX_DIGITS - intDigits);
    const rounded = roundHalfAwayFromZero(cleaned, maxFrac);
    return Object.is(rounded, -0) ? 0 : cleanFloat(rounded);
  }

  function addTurkishThousands(intStr) {
    return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  function numberToRawString(num, decMode) {
    const val = applyDecMode(num, decMode);
    if (!Number.isFinite(val)) return null;

    if (decMode === "2") {
      return val.toFixed(2);
    }
    if (decMode === "0") {
      return String(Math.round(val));
    }

    // Floating mode without scientific notation
    const absVal = Math.abs(val);
    const intPart = Math.floor(absVal);
    const intDigits = intPart === 0 ? 1 : String(intPart).length;
    const maxFrac = Math.max(0, MAX_DIGITS - intDigits);
    let fixed = val.toFixed(maxFrac);
    if (fixed.includes(".")) {
      fixed = fixed.replace(/\.?0+$/, "");
    }
    if (fixed === "-0") fixed = "0";
    return fixed;
  }

  function formatTurkishDisplay(rawStr) {
    if (!rawStr) return "0";
    const isNeg = rawStr.startsWith("-");
    const unsigned = isNeg ? rawStr.slice(1) : rawStr;
    const parts = unsigned.split(".");
    const intFormatted = addTurkishThousands(parts[0] || "0");
    const prefix = isNeg ? "−" : "";
    if (parts.length > 1) {
      return `${prefix}${intFormatted},${parts[1]}`;
    }
    return `${prefix}${intFormatted}`;
  }

  function formatNumberCompact(num, decMode) {
    const raw = numberToRawString(num, decMode || "F");
    if (raw === null) return "HATA";
    return formatTurkishDisplay(raw);
  }

  function countDigits(str) {
    return str.replace(/[^0-9]/g, "").length;
  }

  /* =========================================================
     PURE SHOP CALCULATOR ENGINE
     ========================================================= */
  function createCalculatorEngine(initialOptions) {
    const opts = initialOptions || {};
    const state = {
      inputStr: "0",
      isTyping: false,
      accumulator: null,
      pendingOp: null,
      lastOp: null,
      lastOperand: null,
      memory: 0,
      grandTotal: 0,
      lastAction: "",
      error: false,
      subline: "",
      kdvActive: false,
      decMode: opts.decMode || "F",
      kdvRate: opts.kdvRate || 20,
      receipt: Array.isArray(opts.receipt) ? opts.receipt.slice(0, 100) : [],
    };

    function currentVal() {
      const n = parseFloat(state.inputStr);
      return Number.isFinite(n) ? n : 0;
    }

    function setError(message) {
      state.error = true;
      state.pendingOp = null;
      state.accumulator = null;
      state.isTyping = false;
      state.kdvActive = false;
      state.subline = message || "Taşma / Hata";
    }

    function setResultValue(val) {
      const raw = numberToRawString(val, state.decMode);
      if (raw === null) {
        setError("12 hane sınırı aşıldı");
        return null;
      }
      state.inputStr = raw;
      state.isTyping = false;
      return parseFloat(raw);
    }

    function addReceipt(expr, resultNum) {
      const formatted = formatNumberCompact(resultNum, state.decMode);
      state.receipt.unshift({
        expr,
        result: resultNum,
        resultFormatted: formatted,
      });
      if (state.receipt.length > 100) {
        state.receipt.length = 100;
      }
    }

    function addToGrandTotal(val) {
      const nextGt = cleanFloat(state.grandTotal + val);
      if (Number.isFinite(nextGt) && Math.abs(nextGt) <= MAX_VALUE) {
        state.grandTotal = nextGt;
      }
    }

    function computeBinary(lhs, op, rhs) {
      let raw;
      switch (op) {
        case "+":
          raw = lhs + rhs;
          break;
        case "-":
          raw = lhs - rhs;
          break;
        case "*":
          raw = lhs * rhs;
          break;
        case "/":
          if (rhs === 0) return { error: "Sıfıra bölünemez" };
          raw = lhs / rhs;
          break;
        default:
          return { error: "Geçersiz işlem" };
      }
      const rounded = applyDecMode(raw, state.decMode);
      if (!Number.isFinite(rounded)) {
        return { error: "12 hane sınırı aşıldı" };
      }
      return { value: rounded };
    }

    function inputDigit(digit) {
      if (state.error) {
        clearAll();
      }
      state.kdvActive = false;
      state.lastAction = "digit";

      if (!state.isTyping) {
        state.inputStr = digit;
        state.isTyping = true;
        return;
      }

      if (countDigits(state.inputStr) >= MAX_DIGITS) return;

      if (state.inputStr === "0") {
        state.inputStr = digit;
      } else if (state.inputStr === "-0") {
        state.inputStr = "-" + digit;
      } else {
        state.inputStr += digit;
      }
    }

    function inputDoubleZero() {
      if (state.error) {
        clearAll();
      }
      state.kdvActive = false;
      state.lastAction = "digit";

      if (!state.isTyping) {
        state.inputStr = "0";
        state.isTyping = true;
        return;
      }

      if (state.inputStr === "0" || state.inputStr === "-0") return;

      const digits = countDigits(state.inputStr);
      if (digits >= MAX_DIGITS) return;
      if (digits === MAX_DIGITS - 1) {
        state.inputStr += "0";
      } else {
        state.inputStr += "00";
      }
    }

    function inputDecimal() {
      if (state.error) {
        clearAll();
      }
      state.kdvActive = false;
      state.lastAction = "decimal";

      if (!state.isTyping) {
        state.inputStr = "0.";
        state.isTyping = true;
        return;
      }

      if (!state.inputStr.includes(".") && countDigits(state.inputStr) < MAX_DIGITS) {
        state.inputStr += ".";
      }
    }

    function backspace() {
      if (state.error) {
        clearEntry();
        return;
      }
      state.lastAction = "backspace";
      if (!state.isTyping) return;

      let next = state.inputStr.slice(0, -1);
      if (next === "" || next === "-" || next === "-0") {
        next = "0";
      }
      state.inputStr = next;
    }

    function toggleSign() {
      if (state.error) return;
      state.lastAction = "sign";
      if (state.inputStr === "0" || state.inputStr === "0.") return;

      if (state.inputStr.startsWith("-")) {
        state.inputStr = state.inputStr.slice(1);
      } else {
        state.inputStr = "-" + state.inputStr;
      }
    }

    function clearEntry() {
      state.error = false;
      state.inputStr = "0";
      state.isTyping = false;
      state.kdvActive = false;
      state.lastAction = "ce";
      if (state.pendingOp && state.accumulator !== null) {
        state.subline = `${formatNumberCompact(state.accumulator, state.decMode)} ${OP_SYMBOLS[state.pendingOp]}`;
      } else {
        state.subline = "";
      }
    }

    function clearAll() {
      state.error = false;
      state.inputStr = "0";
      state.isTyping = false;
      state.accumulator = null;
      state.pendingOp = null;
      state.lastOp = null;
      state.lastOperand = null;
      state.kdvActive = false;
      state.subline = "";
      state.lastAction = "ac";
    }

    function setOperator(op) {
      if (state.error) return;
      state.kdvActive = false;
      state.lastAction = "op";

      const cur = currentVal();

      if (state.pendingOp !== null && state.isTyping) {
        const res = computeBinary(state.accumulator, state.pendingOp, cur);
        if (res.error) {
          setError(res.error);
          return;
        }
        const saved = setResultValue(res.value);
        if (saved === null) return;
        state.accumulator = saved;
      } else if (state.pendingOp === null) {
        state.accumulator = cur;
        state.isTyping = false;
      }

      state.pendingOp = op;
      state.subline = `${formatNumberCompact(state.accumulator, state.decMode)} ${OP_SYMBOLS[op]}`;
    }

    function equals() {
      if (state.error) return;
      state.kdvActive = false;
      state.lastAction = "equals";

      if (state.pendingOp !== null) {
        const lhs = state.accumulator;
        const rhs = state.isTyping ? currentVal() : state.accumulator;
        const op = state.pendingOp;
        const res = computeBinary(lhs, op, rhs);
        if (res.error) {
          setError(res.error);
          return;
        }

        const expr = `${formatNumberCompact(lhs, state.decMode)} ${OP_SYMBOLS[op]} ${formatNumberCompact(rhs, state.decMode)} =`;
        const saved = setResultValue(res.value);
        if (saved === null) return;

        state.lastOp = op;
        state.lastOperand = rhs;
        state.pendingOp = null;
        state.accumulator = null;
        state.subline = expr;
        addToGrandTotal(saved);
        addReceipt(expr, saved);
        return;
      }

      // Repeat last operation when pressing '=' consecutively
      if (state.lastOp !== null && state.lastOperand !== null) {
        const lhs = currentVal();
        const rhs = state.lastOperand;
        const op = state.lastOp;
        const res = computeBinary(lhs, op, rhs);
        if (res.error) {
          setError(res.error);
          return;
        }

        const expr = `${formatNumberCompact(lhs, state.decMode)} ${OP_SYMBOLS[op]} ${formatNumberCompact(rhs, state.decMode)} =`;
        const saved = setResultValue(res.value);
        if (saved === null) return;

        state.subline = expr;
        addToGrandTotal(saved);
        addReceipt(expr, saved);
      }
    }

    function percent() {
      if (state.error) return;
      state.kdvActive = false;
      state.lastAction = "percent";

      const cur = currentVal();

      if (state.pendingOp === null || state.accumulator === null) {
        const saved = setResultValue(cur / 100);
        if (saved !== null) {
          state.subline = `${formatNumberCompact(cur, state.decMode)}%`;
        }
        return;
      }

      const lhs = state.accumulator;
      const op = state.pendingOp;
      let raw;

      if (op === "+") {
        raw = lhs + (lhs * cur) / 100;
      } else if (op === "-") {
        raw = lhs - (lhs * cur) / 100;
      } else if (op === "*") {
        raw = (lhs * cur) / 100;
      } else if (op === "/") {
        if (cur === 0) {
          setError("Sıfıra bölünemez");
          return;
        }
        raw = (lhs / cur) * 100;
      }

      const expr = `${formatNumberCompact(lhs, state.decMode)} ${OP_SYMBOLS[op]} ${formatNumberCompact(cur, state.decMode)}% =`;
      const saved = setResultValue(raw);
      if (saved === null) return;

      state.pendingOp = null;
      state.accumulator = null;
      state.lastOp = null;
      state.lastOperand = null;
      state.subline = expr;
      addToGrandTotal(saved);
      addReceipt(expr, saved);
    }

    function markup() {
      if (state.error) return;
      state.kdvActive = false;
      state.lastAction = "mu";

      if (state.pendingOp === null || state.accumulator === null) {
        state.subline = "Örn: 100 ÷ 20 MU";
        return;
      }

      const lhs = state.accumulator;
      const rhs = currentVal();
      const op = state.pendingOp;
      let raw;
      let expr;
      let shouldAddGT = true;

      if (op === "/" || op === "+") {
        // Selling price for desired profit margin %: Cost / (1 - Margin/100)
        if (rhs >= 100) {
          setError("Marj %100 olamaz");
          return;
        }
        raw = lhs / (1 - rhs / 100);
        expr = `${formatNumberCompact(lhs, state.decMode)} MU %${formatNumberCompact(rhs, "F")} =`;
      } else if (op === "-") {
        // Markup % between sell price (lhs) and cost (rhs): ((Sell - Cost) / Cost) * 100
        if (rhs === 0) {
          setError("Maliyet 0 olamaz");
          return;
        }
        raw = ((lhs - rhs) / rhs) * 100;
        expr = `${formatNumberCompact(lhs, state.decMode)} − ${formatNumberCompact(rhs, state.decMode)} MU = %`;
        shouldAddGT = false;
      } else if (op === "*") {
        // Add margin % markup on top of cost: Cost * (1 + Margin/100)
        raw = lhs * (1 + rhs / 100);
        expr = `${formatNumberCompact(lhs, state.decMode)} + %${formatNumberCompact(rhs, "F")} MU =`;
      }

      const saved = setResultValue(raw);
      if (saved === null) return;

      state.pendingOp = null;
      state.accumulator = null;
      state.lastOp = null;
      state.lastOperand = null;
      state.subline = expr;
      if (shouldAddGT) {
        addToGrandTotal(saved);
      }
      addReceipt(expr, saved);
    }

    function applyKdv(direction) {
      if (state.error) return;

      // Evaluate pending calculation first if user typed a second operand
      if (state.pendingOp !== null && state.isTyping) {
        const res = computeBinary(state.accumulator, state.pendingOp, currentVal());
        if (res.error) {
          setError(res.error);
          return;
        }
        const savedMid = setResultValue(res.value);
        if (savedMid === null) return;
        state.pendingOp = null;
        state.accumulator = null;
      }

      const base = currentVal();
      const rate = state.kdvRate;
      let resultRaw;
      let taxAmount;
      let expr;
      let sub;

      if (direction === "plus") {
        taxAmount = base * (rate / 100);
        resultRaw = base + taxAmount;
        expr = `${formatNumberCompact(base, state.decMode)} + KDV %${rate} =`;
        sub = `KDV %${rate}: +${formatNumberCompact(taxAmount, state.decMode === "0" ? "0" : "2")}`;
      } else {
        resultRaw = base / (1 + rate / 100);
        taxAmount = base - resultRaw;
        expr = `${formatNumberCompact(base, state.decMode)} − KDV %${rate} =`;
        sub = `KDV %${rate}: −${formatNumberCompact(taxAmount, state.decMode === "0" ? "0" : "2")}`;
      }

      const saved = setResultValue(resultRaw);
      if (saved === null) return;

      state.pendingOp = null;
      state.accumulator = null;
      state.lastOp = null;
      state.lastOperand = null;
      state.kdvActive = true;
      state.lastAction = direction === "plus" ? "kdv-plus" : "kdv-minus";
      state.subline = sub;
      addReceipt(expr, saved);
    }

    function memoryAdd(sign) {
      if (state.error) return;
      state.kdvActive = false;

      let val = currentVal();
      if (state.pendingOp !== null && state.isTyping) {
        const res = computeBinary(state.accumulator, state.pendingOp, val);
        if (res.error) {
          setError(res.error);
          return;
        }
        const saved = setResultValue(res.value);
        if (saved === null) return;
        val = saved;
        state.pendingOp = null;
        state.accumulator = null;
      }

      const nextMem = cleanFloat(state.memory + sign * val);
      if (!Number.isFinite(nextMem) || Math.abs(nextMem) > MAX_VALUE) {
        setError("Hafıza taşması");
        return;
      }

      state.memory = nextMem;
      state.isTyping = false;
      state.lastAction = sign > 0 ? "m-plus" : "m-minus";
      state.subline = `M = ${formatNumberCompact(state.memory, state.decMode)}`;
    }

    function memoryRecallClear() {
      if (state.error) {
        clearEntry();
      }
      state.kdvActive = false;

      if (state.lastAction === "mrc") {
        state.memory = 0;
        state.subline = "Hafıza (M) silindi";
        state.lastAction = "mc";
        return;
      }

      setResultValue(state.memory);
      state.subline = state.memory !== 0 ? "Hafıza (M) · 2. basış siler" : "Hafıza boş";
      state.lastAction = "mrc";
    }

    function grandTotalRecallClear() {
      if (state.error) {
        clearEntry();
      }
      state.kdvActive = false;

      if (state.lastAction === "gt") {
        state.grandTotal = 0;
        state.subline = "Genel Toplam sıfırlandı";
        state.lastAction = "gt-clear";
        return;
      }

      setResultValue(state.grandTotal);
      state.subline = state.grandTotal !== 0 ? "Genel Toplam · 2. basış sıfırlar" : "Genel Toplam: 0";
      state.lastAction = "gt";
    }

    function recallNumber(num) {
      if (state.error) clearAll();
      state.kdvActive = false;
      state.lastAction = "recall";
      const raw = numberToRawString(num, state.decMode);
      if (raw !== null) {
        state.inputStr = raw;
        state.isTyping = true;
        state.subline = "Fişten geri alındı";
      }
    }

    function setDecMode(mode) {
      if (!["F", "2", "0"].includes(mode)) return;
      state.decMode = mode;
      if (!state.error && !state.isTyping) {
        const raw = numberToRawString(currentVal(), mode);
        if (raw !== null) state.inputStr = raw;
      }
    }

    function setKdvRate(rate) {
      const r = Number(rate);
      if (![1, 10, 20].includes(r)) return;
      state.kdvRate = r;
    }

    function clearReceipt() {
      state.receipt = [];
    }

    function getDisplayText() {
      if (state.error) return "HATA";
      return formatTurkishDisplay(state.inputStr);
    }

    return {
      state,
      inputDigit,
      inputDoubleZero,
      inputDecimal,
      backspace,
      toggleSign,
      clearEntry,
      clearAll,
      setOperator,
      equals,
      percent,
      markup,
      applyKdv,
      memoryAdd,
      memoryRecallClear,
      grandTotalRecallClear,
      recallNumber,
      setDecMode,
      setKdvRate,
      clearReceipt,
      getDisplayText,
    };
  }

  /* Export engine for Node unit tests if applicable */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      createCalculatorEngine,
      formatTurkishDisplay,
      formatNumberCompact,
      cleanFloat,
    };
    return;
  }

  /* =========================================================
     TACTILE KEY CLICK SOUND (WEB AUDIO API)
     ========================================================= */
  let audioCtx = null;
  let soundEnabled = loadSetting(STORAGE_KEYS.sound, true);

  function loadSetting(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function saveSetting(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // ignore storage quota errors
    }
  }

  function playKeyClick(isHeavy) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Crisp short plastic keycap click
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      const baseFreq = isHeavy ? 210 : 310;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.024);

      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.028);
    } catch (_) {
      // Audio unavailable
    }
  }

  /* =========================================================
     DOM BINDING & RENDERING
     ========================================================= */
  const engine = createCalculatorEngine({
    decMode: loadSetting(STORAGE_KEYS.decMode, "F"),
    kdvRate: loadSetting(STORAGE_KEYS.kdvRate, 20),
    receipt: loadSetting(STORAGE_KEYS.receipt, []),
  });

  const dom = {
    lcdScreen: document.getElementById("lcd-screen"),
    lcdValue: document.getElementById("lcd-value"),
    lcdOperator: document.getElementById("lcd-operator"),
    lcdSubline: document.getElementById("lcd-subline"),
    flagM: document.getElementById("flag-m"),
    flagGT: document.getElementById("flag-gt"),
    flagKDV: document.getElementById("flag-kdv"),
    flagErr: document.getElementById("flag-err"),

    btnSound: document.getElementById("btn-sound"),
    soundWave1: document.getElementById("sound-wave-1"),
    soundWave2: document.getElementById("sound-wave-2"),
    btnReceipt: document.getElementById("btn-receipt"),
    receiptBadge: document.getElementById("receipt-badge"),
    receiptPanel: document.getElementById("receipt-panel"),
    receiptList: document.getElementById("receipt-list"),
    receiptGtVal: document.getElementById("receipt-gt-val"),
    btnReceiptClose: document.getElementById("btn-receipt-close"),
    btnReceiptCopy: document.getElementById("btn-receipt-copy"),
    btnReceiptClear: document.getElementById("btn-receipt-clear"),

    btnGuide: document.getElementById("btn-guide"),
    guideModal: document.getElementById("guide-modal"),
    btnGuideClose: document.getElementById("btn-guide-close"),

    decButtons: document.querySelectorAll("[data-dec]"),
    kdvButtons: document.querySelectorAll("[data-kdv]"),
    keypad: document.querySelector(".calc-keypad"),
  };

  let copyToastTimer = null;

  function renderDisplay() {
    const s = engine.state;
    const text = engine.getDisplayText();

    dom.lcdValue.textContent = text;
    dom.lcdOperator.textContent = s.pendingOp ? OP_SYMBOLS[s.pendingOp] : "";
    dom.lcdSubline.textContent = s.subline;

    // Responsive digit sizing inside 12-digit LCD
    dom.lcdValue.classList.remove("len-md", "len-lg");
    if (text.length > 13) {
      dom.lcdValue.classList.add("len-lg");
    } else if (text.length > 10) {
      dom.lcdValue.classList.add("len-md");
    }

    dom.flagM.classList.toggle("active", s.memory !== 0);
    dom.flagGT.classList.toggle("active", s.grandTotal !== 0);
    dom.flagKDV.classList.toggle("active", s.kdvActive);
    dom.flagErr.classList.toggle("active", s.error);
  }

  function renderSwitches() {
    const s = engine.state;
    dom.decButtons.forEach((btn) => {
      const isActive = btn.dataset.dec === s.decMode;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", String(isActive));
    });
    dom.kdvButtons.forEach((btn) => {
      const isActive = Number(btn.dataset.kdv) === s.kdvRate;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", String(isActive));
    });
  }

  function renderSoundButton() {
    dom.btnSound.setAttribute("aria-pressed", String(soundEnabled));
    dom.soundWave1.style.opacity = soundEnabled ? "1" : "0.18";
    dom.soundWave2.style.opacity = soundEnabled ? "1" : "0.18";
  }

  function renderReceipt() {
    const items = engine.state.receipt;
    dom.receiptGtVal.textContent = formatNumberCompact(engine.state.grandTotal, engine.state.decMode);

    if (items.length > 0) {
      dom.receiptBadge.textContent = String(items.length);
      dom.receiptBadge.hidden = false;
    } else {
      dom.receiptBadge.hidden = true;
    }

    dom.receiptList.innerHTML = "";
    if (items.length === 0) {
      const empty = document.createElement("li");
      empty.className = "receipt-empty";
      empty.innerHTML = "Henüz işlem yok.<br />Yaptığınız hesaplar burada fiş gibi sıralanır.";
      dom.receiptList.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "receipt-item";
      btn.title = "Bu sonucu ekrana geri almak için tıklayın";

      const exprEl = document.createElement("span");
      exprEl.className = "receipt-expr";
      exprEl.textContent = item.expr;

      const resEl = document.createElement("span");
      resEl.className = "receipt-res";
      resEl.textContent = item.resultFormatted;

      btn.appendChild(exprEl);
      btn.appendChild(resEl);
      btn.addEventListener("click", () => {
        playKeyClick(false);
        engine.recallNumber(item.result);
        renderAll();
      });

      li.appendChild(btn);
      fragment.appendChild(li);
    });
    dom.receiptList.appendChild(fragment);
  }

  function renderAll() {
    renderDisplay();
    renderSwitches();
    renderReceipt();
    saveSetting(STORAGE_KEYS.receipt, engine.state.receipt);
  }

  function handleButtonElement(btn) {
    if (!btn) return;
    const digit = btn.dataset.digit;
    const op = btn.dataset.op;
    const action = btn.dataset.action;

    const isHeavy = action === "equals" || action === "ac" || op === "+";
    playKeyClick(isHeavy);

    if (digit !== undefined) {
      engine.inputDigit(digit);
    } else if (op !== undefined) {
      engine.setOperator(op);
    } else {
      switch (action) {
        case "00":
          engine.inputDoubleZero();
          break;
        case "decimal":
          engine.inputDecimal();
          break;
        case "backspace":
          engine.backspace();
          break;
        case "sign":
          engine.toggleSign();
          break;
        case "ce":
          engine.clearEntry();
          break;
        case "ac":
          engine.clearAll();
          break;
        case "equals":
          engine.equals();
          break;
        case "percent":
          engine.percent();
          break;
        case "mu":
          engine.markup();
          break;
        case "kdv-plus":
          engine.applyKdv("plus");
          break;
        case "kdv-minus":
          engine.applyKdv("minus");
          break;
        case "m-plus":
          engine.memoryAdd(1);
          break;
        case "m-minus":
          engine.memoryAdd(-1);
          break;
        case "mrc":
          engine.memoryRecallClear();
          break;
        case "gt":
          engine.grandTotalRecallClear();
          break;
      }
    }
    renderAll();
  }

  /* Keypad click delegation */
  dom.keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button.key");
    if (!btn) return;
    handleButtonElement(btn);
  });

  /* Switch controls */
  dom.decButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playKeyClick(false);
      engine.setDecMode(btn.dataset.dec);
      saveSetting(STORAGE_KEYS.decMode, engine.state.decMode);
      renderAll();
    });
  });

  dom.kdvButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playKeyClick(false);
      engine.setKdvRate(btn.dataset.kdv);
      saveSetting(STORAGE_KEYS.kdvRate, engine.state.kdvRate);
      renderAll();
    });
  });

  /* Copy displayed value when clicking LCD */
  function copyDisplayToClipboard() {
    if (engine.state.error) return;
    const text = engine.getDisplayText();
    if (!navigator.clipboard || !navigator.clipboard.writeText) return;

    navigator.clipboard.writeText(text).then(() => {
      const prevSub = engine.state.subline;
      dom.lcdSubline.textContent = "Kopyalandı ✓";
      clearTimeout(copyToastTimer);
      copyToastTimer = setTimeout(() => {
        dom.lcdSubline.textContent = engine.state.subline === prevSub ? prevSub : engine.state.subline;
      }, 1300);
    }).catch(() => {});
  }

  dom.lcdScreen.addEventListener("click", copyDisplayToClipboard);
  dom.lcdScreen.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      copyDisplayToClipboard();
    }
  });

  /* Topbar controls */
  dom.btnSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    saveSetting(STORAGE_KEYS.sound, soundEnabled);
    renderSoundButton();
    if (soundEnabled) playKeyClick(false);
  });

  function setReceiptOpen(isOpen) {
    dom.receiptPanel.hidden = !isOpen;
    dom.btnReceipt.setAttribute("aria-pressed", String(isOpen));
  }

  dom.btnReceipt.addEventListener("click", () => {
    setReceiptOpen(dom.receiptPanel.hidden);
  });

  dom.btnReceiptClose.addEventListener("click", () => {
    setReceiptOpen(false);
  });

  dom.btnReceiptClear.addEventListener("click", () => {
    playKeyClick(false);
    engine.clearReceipt();
    renderAll();
  });

  dom.btnReceiptCopy.addEventListener("click", () => {
    const items = engine.state.receipt;
    if (items.length === 0) return;
    const lines = items
      .slice()
      .reverse()
      .map((item) => `${item.expr} ${item.resultFormatted}`);
    lines.push("------------------------");
    lines.push(`GENEL TOPLAM (GT): ${formatNumberCompact(engine.state.grandTotal, engine.state.decMode)}`);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lines.join("\n")).then(() => {
        const orig = dom.btnReceiptCopy.textContent;
        dom.btnReceiptCopy.textContent = "Kopyalandı ✓";
        setTimeout(() => {
          dom.btnReceiptCopy.textContent = orig;
        }, 1400);
      }).catch(() => {});
    }
  });

  /* Help Guide Modal */
  function setGuideOpen(isOpen) {
    dom.guideModal.hidden = !isOpen;
  }

  dom.btnGuide.addEventListener("click", () => setGuideOpen(true));
  dom.btnGuideClose.addEventListener("click", () => setGuideOpen(false));
  dom.guideModal.addEventListener("click", (e) => {
    if (e.target === dom.guideModal) setGuideOpen(false);
  });

  /* Physical Keyboard Support with synchronized visual press */
  const KEY_TO_ID = {
    "0": "key-0",
    "1": "key-1",
    "2": "key-2",
    "3": "key-3",
    "4": "key-4",
    "5": "key-5",
    "6": "key-6",
    "7": "key-7",
    "8": "key-8",
    "9": "key-9",
    ".": "key-dot",
    ",": "key-dot",
    "+": "key-add",
    "-": "key-sub",
    "*": "key-mul",
    "x": "key-mul",
    "X": "key-mul",
    "/": "key-div",
    "%": "key-pct",
    "Enter": "key-eq",
    "=": "key-eq",
    "Backspace": "key-backspace",
    "Delete": "key-ce",
    "Escape": "key-ac",
    "c": "key-ce",
    "C": "key-ce",
  };

  function flashKey(btn) {
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 110);
  }

  document.addEventListener("keydown", (e) => {
    if (!dom.guideModal.hidden) {
      if (e.key === "Escape") setGuideOpen(false);
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const targetId = KEY_TO_ID[e.key];
    if (!targetId) return;

    e.preventDefault();
    const btn = document.getElementById(targetId);
    if (!btn) return;
    flashKey(btn);
    handleButtonElement(btn);
  });

  /* Initial Render */
  renderSoundButton();
  renderAll();
})();
