(function (global) {
  "use strict";

  const STORAGE_KEY = "esnaf_calc_lang_v2";

  const DICT = {
    tr: {
      appVersion: "v2.0.0",
      pageTitle: "KASA 120D — Esnaf Hesap Makinesi & Hikâye Oyunu",
      brandTitle: "Esnaf Hesap Makinesi",
      brandSubtitle: "KASA 120D · Hikâye & Masaüstü",
      brandSpec: "12 Haneli Masaüstü",
      modeStory: "Hikâye",
      modeFree: "Serbest",
      btnMusic: "Müzik",
      btnSound: "Ses",
      btnReceipt: "Kasa Fişi",
      btnGuide: "Rehber",
      switchDec: "Ondalık",
      switchTax: "KDV",
      keyTaxMinus: "KDV−",
      keyTaxPlus: "KDV+",
      flagTax: "KDV",
      receiptTitle: "Kasa Fişi",
      receiptEmpty: "Henüz işlem yok.<br />Yaptığınız hesaplar burada fiş gibi sıralanır.",
      receiptGtLabel: "GENEL TOPLAM (GT)",
      receiptCopy: "Fişi Kopyala",
      receiptClear: "Temizle",
      copied: "Kopyalandı ✓",
      errDisplay: "HATA",
      deskHintFree: "Klavyeden rakamlar, <strong>+ − × / Enter</strong> ve <strong>Esc</strong> ile doğrudan kullanabilirsiniz · Sonucu kopyalamak için ekrana tıklayın",
      deskHintStory: "Hesap makinesini klavyeyle kullanın (<strong>Enter</strong> = Eşittir), sonucu teslim etmek için <strong>Boşluk (Space)</strong> tuşuna basın",

      // Guide modal
      guideTitle: "Esnaf Hesap Makinesi Tuş Rehberi",
      guideItems: [
        { kbd: "GT", html: "<strong>Genel Toplam:</strong> Her <code>=</code> sonucu otomatik birikir. 1. basışta toplamı gösterir, 2. basışta sıfırlar." },
        { kbd: "MU", html: "<strong>Kâr Marjı:</strong> Maliyet <code>100 ÷ 20 MU</code> = <code>125</code> (%20 kârlı satış fiyatı). Satış <code>150 − 100 MU</code> = <code>50</code> (%50 kâr oranı)." },
        { kbd: "KDV+ / −", html: "Üstten seçilen <strong>%1, %10 veya %20</strong> KDV oranını anında ekler ya da KDV dahil fiyattan çıkarır." },
        { kbd: "%", html: "Zam / İskonto: <code>200 + 15 %</code> = <code>230</code>, <code>200 − 15 %</code> = <code>170</code>, <code>200 × 15 %</code> = <code>30</code>." },
        { kbd: "MRC", html: "<strong>Hafıza:</strong> <code>M+</code> ekler, <code>M−</code> çıkarır. <code>MRC</code> ilk basışta hafızayı çağırır, ikinci basışta siler." },
        { kbd: "CE / AC", coral: true, html: "<code>CE</code> sadece yazdığınız sayıyı siler; <code>AC</code> mevcut işlemi sıfırlar." },
        { kbd: "F · 2 · 0", html: "Ondalık anahtarı: <strong>F</strong> serbest, <strong>2</strong> kuruşlu yuvarlama, <strong>0</strong> tam sayı." },
      ],
      guideNote: "<strong>Klavye kısayolları:</strong> Rakamlar, <code>+ - * /</code>, <code>Enter</code> (=), <code>%</code>, <code>Backspace</code> (▶), <code>Delete</code> (CE), <code>Esc</code> (AC). Hikâye modunda <code>Space</code> sonucu teslim eder.",

      // Story UI
      hubBadge: "ESNAF 120D · 5 BÖLÜM · TR / EN",
      gameTitle: "KASA 120D: Bir Kuruşun Kaderi",
      gameTagline: "Sıradan bir mahalle kasiyerliğinden mafya bodrumuna, CERN çarpıştırıcısından uzay-zaman bükülmesine uzanan 5 bölümlük hesap makinesi ustalık hikâyesi.",
      btnStartStory: "Hikâyeye Başla",
      btnContinueStory: "Kaldığın Yerden Devam Et",
      btnEpisodes: "Bölümler",
      btnBackHub: "Bölüm Seç",
      btnSubmit: "Teslim Et",
      btnSubmitCash: "Kasadan Ver",
      btnSubmitCern: "Kodu Gönder",
      btnSubmitSpace: "Fırlatmayı Onayla",
      btnHint: "İpucu",
      btnNext: "Devam Et",
      btnRetry: "Tekrar Dene",
      btnNextEpisode: "Sonraki Bölüme Geç",
      btnPlayAgain: "Baştan Oyna",
      btnFreeMode: "Serbest Hesap Makinesi",
      labelScore: "Puan",
      labelScene: "Sahne",
      labelKeys: "Öğretilen Tuşlar",
      labelAccuracy: "Doğruluk",
      labelMasterBonus: "Usta Onayı",
      labelTimeLeft: "Süre",
      labelEndless: "Süresiz",
      statusCompleted: "Tamamlandı",
      statusReady: "Oynanabilir",
      masterBadge: "12 HANELİ BİLGE · USTA",
      masterContinue: "Anladım Usta",
      masterNodToast: "Usta başını salladı: Doğru tuş kullanımı! (+50)",
      wrongToast: "Hesap tutmadı! Tekrar kontrol et.",
      decModeWarn: "Dikkat! Üstteki Ondalık anahtarını ({mode}) konumuna al!",
      timeoutTitle: "Süre Doldu!",
      timeoutMsg: "Tansiyon tavan yaptı ve süre bitti. Derin bir nefes al, parmaklarını tuşlara koy.",
      livesOutTitle: "Hesap Şaştı!",
      livesOutMsg: "Üst üste hatalar ortalığı karıştırdı. Usta diyor ki: 'AC'ye basmak yenilgi değil, yeni başlangıçtır.'",
      episodeClearTitle: "Bölüm Tamamlandı!",
      campaignClearTitle: "EVREN KURTARILDI!",
      campaignClearSub: "Salı sabahı saat 08:00. Bakkalın kepengi açık. Kasada tam 0,00 ₺ açık var. Tezgâhta yıldız tozlu tek bir fiş duruyor...",
      calcCurrentPrefix: "Ekrandaki Değer",
      givenCashLabel: "Verilen Nakit",
      targetAskLabel: "İstenen Hesap",
      stepProgress: "Adım {cur}/{total}",
      currencySymbol: "₺",
      currencyAfter: true,
    },

    en: {
      appVersion: "v2.0.0",
      pageTitle: "CALC 120D — Shop Calculator & Story Game",
      brandTitle: "Shop Calculator",
      brandSubtitle: "CALC 120D · Story & Desktop",
      brandSpec: "12-Digit Desktop",
      modeStory: "Story",
      modeFree: "Free Calc",
      btnMusic: "Music",
      btnSound: "SFX",
      btnReceipt: "Receipt",
      btnGuide: "Guide",
      switchDec: "Decimal",
      switchTax: "TAX",
      keyTaxMinus: "TAX−",
      keyTaxPlus: "TAX+",
      flagTax: "TAX",
      receiptTitle: "Receipt Tape",
      receiptEmpty: "No entries yet.<br />Your calculations will appear here like a register tape.",
      receiptGtLabel: "GRAND TOTAL (GT)",
      receiptCopy: "Copy Tape",
      receiptClear: "Clear",
      copied: "Copied ✓",
      errDisplay: "ERROR",
      deskHintFree: "Type directly on your keyboard: digits, <strong>+ − × / Enter</strong>, and <strong>Esc</strong> · Click the LCD screen to copy",
      deskHintStory: "Use your keyboard on the calculator (<strong>Enter</strong> = Equals), press <strong>Space</strong> to submit the displayed result",

      // Guide modal
      guideTitle: "Desktop Calculator Key Guide",
      guideItems: [
        { kbd: "GT", html: "<strong>Grand Total:</strong> Automatically accumulates every <code>=</code> result. Press once to view, twice to reset." },
        { kbd: "MU", html: "<strong>Mark-Up:</strong> Cost <code>100 ÷ 20 MU</code> = <code>125</code> (20% margin sell price). Sell <code>150 − 100 MU</code> = <code>50</code> (50% profit rate)." },
        { kbd: "TAX+ / −", html: "Instantly adds or strips the selected <strong>1%, 10%, or 20%</strong> tax rate from the top switch." },
        { kbd: "%", html: "Markup / Discount: <code>200 + 15 %</code> = <code>230</code>, <code>200 − 15 %</code> = <code>170</code>, <code>200 × 15 %</code> = <code>30</code>." },
        { kbd: "MRC", html: "<strong>Memory:</strong> <code>M+</code> adds, <code>M−</code> subtracts. Press <code>MRC</code> once to recall, twice to clear." },
        { kbd: "CE / AC", coral: true, html: "<code>CE</code> clears only the current entry; <code>AC</code> resets the entire calculation." },
        { kbd: "F · 2 · 0", html: "Decimal switch: <strong>F</strong> floating, <strong>2</strong> two decimal places (cents), <strong>0</strong> whole numbers." },
      ],
      guideNote: "<strong>Keyboard shortcuts:</strong> Digits, <code>+ - * /</code>, <code>Enter</code> (=), <code>%</code>, <code>Backspace</code> (▶), <code>Delete</code> (CE), <code>Esc</code> (AC). Press <code>Space</code> in Story Mode to submit.",

      // Story UI
      hubBadge: "CALC 120D · 5 EPISODES · TR / EN",
      gameTitle: "CALC 120D: The Fate of One Cent",
      gameTagline: "A 5-episode absurd thriller teaching real desktop calculator mastery — from a corner-shop register to a mafia basement, CERN's collider, and the edge of spacetime.",
      btnStartStory: "Start Story",
      btnContinueStory: "Continue Story",
      btnEpisodes: "Episodes",
      btnBackHub: "Episodes",
      btnSubmit: "Submit",
      btnSubmitCash: "Hand Over",
      btnSubmitCern: "Transmit Value",
      btnSubmitSpace: "Confirm Launch",
      btnHint: "Hint",
      btnNext: "Continue",
      btnRetry: "Try Again",
      btnNextEpisode: "Next Episode",
      btnPlayAgain: "Play From Start",
      btnFreeMode: "Free Calculator",
      labelScore: "Score",
      labelScene: "Scene",
      labelKeys: "Keys Mastered",
      labelAccuracy: "Accuracy",
      labelMasterBonus: "Master's Nod",
      labelTimeLeft: "Time",
      labelEndless: "No Limit",
      statusCompleted: "Completed",
      statusReady: "Playable",
      masterBadge: "THE 12-DIGIT SAGE · MASTER",
      masterContinue: "Understood, Master",
      masterNodToast: "The Master nods: True key mastery! (+50)",
      wrongToast: "Numbers don't add up! Check your screen.",
      decModeWarn: "Watch the Decimal switch! Flip it to ({mode}) first!",
      timeoutTitle: "Time's Up!",
      timeoutMsg: "Tension peaked and the clock ran out. Breathe, reset your fingers, and strike clean.",
      livesOutTitle: "Register Jammed!",
      livesOutMsg: "Too many mistakes rattled the room. As the Master says: 'Pressing AC is not defeat—it is rebirth.'",
      episodeClearTitle: "Episode Complete!",
      campaignClearTitle: "THE UNIVERSE IS SAVED!",
      campaignClearSub: "Tuesday, 8:00 AM. The corner shop shutter is open. Register variance: exactly $0.00. Only a stardust-coated receipt sits on the counter...",
      calcCurrentPrefix: "LCD Value",
      givenCashLabel: "Cash Given",
      targetAskLabel: "Required Calculation",
      stepProgress: "Step {cur}/{total}",
      currencySymbol: "$",
      currencyAfter: false,
    },
  };

  function detectInitialLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "tr" || saved === "en") return saved;
    } catch (_) {}
    const nav = (typeof navigator !== "undefined" && navigator.language) ? navigator.language.toLowerCase() : "tr";
    return nav.startsWith("tr") ? "tr" : "tr"; // Default TR as primary user language; 1-click toggle to EN
  }

  let currentLang = detectInitialLang();
  const listeners = [];

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang !== "tr" && lang !== "en") return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    listeners.forEach((fn) => {
      try { fn(lang); } catch (_) {}
    });
  }

  function onLangChange(fn) {
    listeners.push(fn);
  }

  function t(key, vars) {
    const pack = DICT[currentLang] || DICT.tr;
    let val = pack[key];
    if (val === undefined) val = DICT.tr[key] || key;
    if (typeof val === "string" && vars) {
      Object.keys(vars).forEach((k) => {
        val = val.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      });
    }
    return val;
  }

  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[currentLang] !== undefined ? obj[currentLang] : (obj.tr || obj.en || "");
  }

  function formatNumber(num, decimals) {
    if (!Number.isFinite(num)) return t("errDisplay");
    const loc = currentLang === "en" ? "en-US" : "tr-TR";
    const opts = typeof decimals === "number"
      ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
      : { maximumFractionDigits: 6 };
    return new Intl.NumberFormat(loc, opts).format(num);
  }

  function formatMoney(num, decimals) {
    const str = formatNumber(num, decimals);
    const pack = DICT[currentLang] || DICT.tr;
    return pack.currencyAfter ? `${str} ${pack.currencySymbol}` : `${pack.currencySymbol}${str}`;
  }

  const api = {
    getLang,
    setLang,
    onLangChange,
    t,
    pick,
    formatNumber,
    formatMoney,
    DICT,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafI18n = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
