(function (global) {
  "use strict";

  const DOJO_MODULES = [
    {
      id: "d_00",
      badge: "00",
      keys: ["key-00"],
      title: { tr: "Çift Sıfır Hızı", en: "Double-Zero Speed" },
      realLife: {
        tr: "Yüzlük ve binlik tutarlarda [00] kullanmak hızını %40 artırır ve eksik sıfır hatasını önler.",
        en: "Using [00] for hundreds and thousands boosts speed by 40% and prevents missing-zero typos.",
      },
      drills: [
        { ask: { tr: "2.500 + 1.500 = ?", en: "2,500 + 1,500 = ?" }, expected: 4000, bonusKeys: ["00"], hint: { tr: "25 [00] + 15 [00] = 4.000", en: "25 [00] + 15 [00] = 4,000" } },
        { ask: { tr: "10.000 − 3.200 = ?", en: "10,000 − 3,200 = ?" }, expected: 6800, bonusKeys: ["00"], hint: { tr: "1 [00] [00] − 32 [00] = 6.800", en: "1 [00] [00] − 32 [00] = 6,800" } },
        { ask: { tr: "400 × 15 = ?", en: "400 × 15 = ?" }, expected: 6000, bonusKeys: ["00"], hint: { tr: "4 [00] × 15 = 6.000", en: "4 [00] × 15 = 6,000" } },
      ],
    },
    {
      id: "d_ce",
      badge: "▶ · CE",
      keys: ["key-ce", "key-backspace"],
      title: { tr: "Paniksiz Hata Düzeltme", en: "Zero-Panic Error Recovery" },
      realLife: {
        tr: "20 ürünlük toplamda son sayıyı yanlış yazarsan [AC] basıp her şeyi silme! [CE] sadece son girişi temizler, [▶] son rakamı siler.",
        en: "Mistype the 20th item? Never wipe everything with [AC]! [CE] clears only the current number; [▶] removes one digit.",
      },
      drills: [
        { ask: { tr: "Ekranda '250 + 888' var. [CE] ile 888'i silip 50 ekle!", en: "'250 + 888' is entered. Clear 888 with [CE], then add 50!" }, presetKeys: ["2", "5", "0", "+", "8", "8", "8"], expected: 300, bonusKeys: ["ce"], hint: { tr: "[CE] → 50 → [=] = 300", en: "[CE] → 50 → [=] = 300" } },
        { ask: { tr: "Ekranda '455' yazıyor. [▶] ile son 5'i sil ve 45 teslim et!", en: "Screen shows '455'. Tap [▶] once to make it 45!" }, presetKeys: ["4", "5", "5"], expected: 45, bonusKeys: ["backspace"], hint: { tr: "Sadece [▶] (Backspace) bas → 45", en: "Just press [▶] (Backspace) → 45" } },
        { ask: { tr: "'1.000 − 777' hazır. [CE] ile 777'yi silip 250 çıkar!", en: "'1,000 − 777' is queued. Press [CE] and subtract 250!" }, presetKeys: ["1", "0", "0", "0", "-", "7", "7", "7"], expected: 750, bonusKeys: ["ce"], hint: { tr: "[CE] → 250 → [=] = 750", en: "[CE] → 250 → [=] = 750" } },
      ],
    },
    {
      id: "d_pct",
      badge: "%",
      keys: ["key-pct"],
      title: { tr: "Zam & İskonto Refleksi", en: "Instant Markup & Discount" },
      realLife: {
        tr: "Esnaf makinelerinde '500 − 20 %' yazdığında '=' basmadan doğrudan indirimli fiyatı (400) görürsün!",
        en: "On desktop calculators, '500 − 20 %' jumps straight to the discounted total (400) without hitting '='!",
      },
      drills: [
        { ask: { tr: "500'den %20 iskonto düş (500 − 20 %).", en: "Take 20% off 500 (500 − 20 %)." }, expected: 400, bonusKeys: ["percent"], hint: { tr: "500 − 20 [%] → 400", en: "500 − 20 [%] → 400" } },
        { ask: { tr: "400'e %15 zam ekle (400 + 15 %).", en: "Add 15% markup to 400 (400 + 15 %)." }, expected: 460, bonusKeys: ["percent"], hint: { tr: "400 + 15 [%] → 460", en: "400 + 15 [%] → 460" } },
        { ask: { tr: "800'ün %25'i kaçtır? (800 × 25 %).", en: "What is 25% of 800? (800 × 25 %)." }, expected: 200, bonusKeys: ["percent"], hint: { tr: "800 × 25 [%] → 200", en: "800 × 25 [%] → 200" } },
      ],
    },
    {
      id: "d_kdv",
      badge: { tr: "KDV+/−", en: "TAX+/−" },
      keys: ["key-kdv-plus", "key-kdv-minus", "kdv-10", "kdv-20"],
      title: { tr: "KDV / Vergi Fatura Ustası", en: "Tax-In / Tax-Out Mastery" },
      realLife: {
        tr: "KDV dahil 1.200'ün içindeki %20 KDV, 240 değil 200'dür (1.200 ÷ 1,20 = 1.000). [KDV−] bunu tek tuşla hatasız ayıklar!",
        en: "20% tax inside 1,200 is 200—not 240 (1,200 ÷ 1.20 = 1,000). [TAX−] strips it flawlessly in one tap!",
      },
      drills: [
        { ask: { tr: "500 tutarına %20 KDV ekle ([%20] → KDV+).", en: "Add 20% TAX to 500 ([20%] → TAX+)." }, expected: 600, bonusKeys: ["kdv-plus"], hint: { tr: "[%20] seç → 500 → [KDV+] = 600", en: "Select [20%] → 500 → [TAX+] = 600" } },
        { ask: { tr: "2.200 içindeki %10 KDV'yi çıkar ([%10] → KDV−).", en: "Strip 10% TAX from 2,200 ([10%] → TAX−)." }, expected: 2000, bonusKeys: ["kdv-minus"], hint: { tr: "[%10] seç → 2200 → [KDV−] = 2.000", en: "Select [10%] → 2200 → [TAX−] = 2,000" } },
        { ask: { tr: "2.400 içindeki %20 KDV'yi çıkar ([%20] → KDV−).", en: "Strip 20% TAX from 2,400 ([20%] → TAX−)." }, expected: 2000, bonusKeys: ["kdv-minus"], hint: { tr: "[%20] seç → 2400 → [KDV−] = 2.000", en: "Select [20%] → 2400 → [TAX−] = 2,000" } },
      ],
    },
    {
      id: "d_gt",
      badge: "GT",
      keys: ["key-gt"],
      title: { tr: "Genel Toplam Zinciri", en: "Grand Total (GT) Chaining" },
      realLife: {
        tr: "Her '=' sonucu gizlice GT haznesinde birikir. Ayrı faturaları hesaplayıp sonunda [GT] basarak kâğıtsız genel toplam alırsın!",
        en: "Every '=' silently gathers inside GT. Tally separate invoices, then tap [GT] for an instant grand total!",
      },
      drills: [
        { ask: { tr: "10 × 50 = (500) sonra 20 × 30 = (600) yapıp [GT] ile toplamı (1.100) çıkar!", en: "Compute 10 × 50 = then 20 × 30 = then tap [GT] (1,100)!" }, resetCalc: "clear-gt", expected: 1100, bonusKeys: ["gt"], hint: { tr: "10 × 50 = (500) → 20 × 30 = (600) → [GT] = 1.100!", en: "10 × 50 = (500) → 20 × 30 = (600) → [GT] = 1,100!" } },
        { ask: { tr: "150 + 50 = ardından 300 + 100 = yap ve [GT] bas (600)!", en: "Compute 150 + 50 = then 300 + 100 = then press [GT] (600)!" }, resetCalc: "clear-gt", expected: 600, bonusKeys: ["gt"], hint: { tr: "150 + 50 = → 300 + 100 = → [GT] = 600!", en: "150 + 50 = → 300 + 100 = → [GT] = 600!" } },
        { ask: { tr: "5 × 120 = ardından 4 × 250 = yapıp [GT] çağır (1.600)!", en: "Compute 5 × 120 = then 4 × 250 = then recall [GT] (1,600)!" }, resetCalc: "clear-gt", expected: 1600, bonusKeys: ["gt"], hint: { tr: "5 × 120 = (600) → 4 × 250 = (1.000) → [GT] = 1.600!", en: "5 × 120 = (600) → 4 × 250 = (1,000) → [GT] = 1,600!" } },
      ],
    },
    {
      id: "d_mu",
      badge: "MU",
      keys: ["key-mu"],
      title: { tr: "Esnaf Kâr Marjı (MU)", en: "True Profit Margin (MU)" },
      realLife: {
        tr: "Maliyete '× 1,20' eklemek sadece %16,6 kâr marjı verir! Satış fiyatından tam %20 net marj bırakmak için [Maliyet ÷ 20 MU] basılır.",
        en: "Multiplying cost by 1.20 only gives 16.6% margin! For true 20% selling margin, punch [Cost ÷ 20 MU].",
      },
      drills: [
        { ask: { tr: "400 maliyetten %20 kâr marjlı satış fiyatı: 400 ÷ 20 [MU].", en: "20% margin sell price on 400 cost: 400 ÷ 20 [MU]." }, expected: 500, bonusKeys: ["mu"], hint: { tr: "400 ÷ 20 [MU] → 500!", en: "400 ÷ 20 [MU] → 500!" } },
        { ask: { tr: "750 maliyetten %25 kâr marjlı satış fiyatı: 750 ÷ 25 [MU].", en: "25% margin sell price on 750 cost: 750 ÷ 25 [MU]." }, expected: 1000, bonusKeys: ["mu"], hint: { tr: "750 ÷ 25 [MU] → 1.000!", en: "750 ÷ 25 [MU] → 1,000!" } },
        { ask: { tr: "200'e alınan ürün 250'ye satıldı. Kâr yüzdesi: 250 − 200 [MU].", en: "Bought at 200, sold at 250. Profit %: 250 − 200 [MU]." }, expected: 25, bonusKeys: ["mu"], hint: { tr: "250 − 200 [MU] → 25 (%25)!", en: "250 − 200 [MU] → 25 (25%)!" } },
      ],
    },
    {
      id: "d_mem",
      badge: "M+ · MRC",
      keys: ["key-m-plus", "key-m-minus", "key-mrc"],
      title: { tr: "Kâğıtsız Hafıza Sanatı", en: "Paperless Memory Ledger" },
      realLife: {
        tr: "M+ ve M− tuşları çarpmaları otomatik hesaplayıp hafızaya ekler veya çıkarır. İki ayrı sepetin farkını kâğıt kalemsiz bulursun!",
        en: "M+ and M− evaluate products automatically and add/subtract from memory—compute complex net totals without paper!",
      },
      drills: [
        { ask: { tr: "(10 × 45) + (5 × 30) hesabını M+ ve MRC ile bul (600)!", en: "Compute (10 × 45) + (5 × 30) using M+ and MRC (600)!" }, resetCalc: "clear-all-mem", expected: 600, bonusKeys: ["m-plus", "mrc"], hint: { tr: "10 × 45 [M+] → 5 × 30 [M+] → [MRC] = 600!", en: "10 × 45 [M+] → 5 × 30 [M+] → [MRC] = 600!" } },
        { ask: { tr: "(20 × 50) − (10 × 25) hesabını M+, M−, MRC ile bul (750)!", en: "Compute (20 × 50) − (10 × 25) with M+, M−, MRC (750)!" }, resetCalc: "clear-all-mem", expected: 750, bonusKeys: ["m-minus", "mrc"], hint: { tr: "20 × 50 [M+] → 10 × 25 [M−] → [MRC] = 750!", en: "20 × 50 [M+] → 10 × 25 [M−] → [MRC] = 750!" } },
        { ask: { tr: "Hafızaya 1.200 [M+] ekle, 350 [M−] çıkar, [MRC] çağır (850)!", en: "Add 1,200 [M+], subtract 350 [M−], recall [MRC] (850)!" }, resetCalc: "clear-all-mem", expected: 850, bonusKeys: ["mrc"], hint: { tr: "1200 [M+] → 350 [M−] → [MRC] = 850!", en: "1200 [M+] → 350 [M−] → [MRC] = 850!" } },
      ],
    },
    {
      id: "d_dec",
      badge: "F · 2 · 0",
      keys: ["dec-f", "dec-2", "dec-0"],
      title: { tr: "Ondalık & Yuvarlama Anahtarı", en: "Decimal & Rounding Switch" },
      realLife: {
        tr: "Kuruşlu faturalarda [2] modu küsuratı temizce iki haneye yuvarlar, koli/adet sayımında [0] tam sayı verir, [F] serbest bırakır.",
        en: "Use [2] to round currency cleanly to cents, [0] for whole-unit counts, and [F] for full floating decimals.",
      },
      drills: [
        { ask: { tr: "Anahtarı [2] yap ve 50 ÷ 3 = (16,67) sonucunu bul!", en: "Flip Decimal to [2] and compute 50 ÷ 3 = (16.67)!" }, requiredDecMode: "2", expected: 16.67, tolerance: 0.001, hint: { tr: "[2] seç → 50 ÷ 3 = → 16,67!", en: "Select [2] → 50 ÷ 3 = → 16.67!" } },
        { ask: { tr: "Anahtarı [0] yap ve 25 ÷ 2 = (13) tam sayısını bul!", en: "Flip Decimal to [0] and round 25 ÷ 2 = (13)!" }, requiredDecMode: "0", expected: 13, hint: { tr: "[0] seç → 25 ÷ 2 = → 13!", en: "Select [0] → 25 ÷ 2 = → 13!" } },
        { ask: { tr: "Anahtarı [F] yap ve 10 ÷ 8 = (1,25) tam değerini bul!", en: "Flip Decimal to [F] and compute 10 ÷ 8 = (1.25)!" }, requiredDecMode: "F", expected: 1.25, tolerance: 0.001, hint: { tr: "[F] seç → 10 ÷ 8 = → 1,25!", en: "Select [F] → 10 ÷ 8 = → 1.25!" } },
      ],
    },
  ];

  /* =========================================================
     TROPHY RECEIPT ACHIEVEMENTS
     ========================================================= */
  const ACHIEVEMENTS = [
    { id: "ep1_clear", icon: "🪙", title: { tr: "1 Kuruşun Efendisi", en: "Master of One Cent" }, desc: { tr: "Bölüm 1'i tamamla", en: "Complete Episode 1" } },
    { id: "ep2_clear", icon: "💡", title: { tr: "Mafyanın Gözdesi", en: "Mob's Favorite" }, desc: { tr: "Bölüm 2'yi tamamla", en: "Complete Episode 2" } },
    { id: "ep3_clear", icon: "📈", title: { tr: "MU Gurusu", en: "MU Guru" }, desc: { tr: "Bölüm 3'ü tamamla", en: "Complete Episode 3" } },
    { id: "ep4_clear", icon: "⚛️", title: { tr: "Kuantum Bakkal", en: "Quantum Clerk" }, desc: { tr: "Bölüm 4'ü tamamla", en: "Complete Episode 4" } },
    { id: "ep5_clear", icon: "🚀", title: { tr: "Evrenin Kasiyeri", en: "Savior of Spacetime" }, desc: { tr: "Tüm 5 bölümü bitir", en: "Complete all 5 episodes" } },
    { id: "combo_3", icon: "🔥", title: { tr: "Seri Usta", en: "Combo Master" }, desc: { tr: "3+ seri kombo yakala", en: "Hit a 3× combo streak" } },
    { id: "dojo_1", icon: "🥋", title: { tr: "Atölye Çırağı", en: "Dojo Disciple" }, desc: { tr: "1 Tuş Atölyesi modülü bitir", en: "Master 1 Key Dojo module" } },
    { id: "rush_500", icon: "⚡", title: { tr: "Esnaf Rush Yıldızı", en: "Arcade Rush Star" }, desc: { tr: "Esnaf Rush'ta 500+ puan yap", en: "Score 500+ in Esnaf Rush" } },
  ];

  /* =========================================================
     INFINITE ESNAF RUSH (ARCADE TASK GENERATOR)
     ========================================================= */
  function pickRand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateRushTask(wave) {
    const timeLimit = Math.max(14, 28 - Math.floor(wave / 2) * 2);
    const pool = wave < 2 ? ["change", "mul"] : wave < 4 ? ["change", "pct", "kdv_plus"] : ["change", "pct", "kdv_plus", "kdv_minus", "mu", "mem"];
    const kind = pickRand(pool);

    if (kind === "change") {
      const a = pickRand([15, 25, 35, 45, 65]);
      const b = pickRand([20, 30, 40, 55, 75]);
      const total = a + b;
      const cash = total <= 100 ? 100 : 200;
      return {
        portrait: pickRand(["clara", "sam", "pete"]),
        backdrop: "shop-day",
        theme: "shop-day",
        mood: "rush",
        props: ["bread", "milk"],
        speaker: { tr: `Müşteri #${wave + 1}`, en: `Customer #${wave + 1}` },
        dialogue: { tr: `İki ürün aldım: ${a} ve ${b}. Al şu ${cash}'lüğü, çabuk para üstü!`, en: `Two items: ${a} and ${b}. Here's ${cash}—quick change!` },
        ask: { tr: `${cash} − (${a} + ${b}) para üstünü ver!`, en: `Return change: ${cash} − (${a} + ${b})!` },
        cashGiven: cash,
        expected: cash - total,
        timeLimit,
        onSuccessEffect: "cash",
      };
    }

    if (kind === "mul") {
      const qty = pickRand([4, 6, 8, 12, 15]);
      const price = pickRand([150, 200, 250, 300, 400]);
      return {
        portrait: "sam",
        backdrop: "shop-day",
        theme: "shop-day",
        mood: "rush",
        props: ["coffee"],
        speaker: { tr: "Kahveci Hasan", en: "Barista Sam" },
        dialogue: { tr: `Acil sipariş! ${qty} koli × ${price} toplamı kaç ediyor?`, en: `Rush order! Total for ${qty} crates × ${price}?` },
        ask: { tr: `${qty} × ${price} toplamını ver!`, en: `Submit ${qty} × ${price}!` },
        expected: qty * price,
        timeLimit,
        bonusKeys: ["00"],
        onSuccessEffect: "cash",
      };
    }

    if (kind === "pct") {
      const base = pickRand([200, 400, 600, 800, 1200, 2000]);
      const pct = pickRand([10, 15, 20, 25]);
      const isAdd = Math.random() > 0.5;
      const expected = isAdd ? base + (base * pct) / 100 : base - (base * pct) / 100;
      return {
        portrait: "don",
        backdrop: "mafia-basement",
        theme: "mafia-basement",
        mood: "mafia",
        props: ["moneybag"],
        speaker: { tr: "Don Kuruş", en: "Don Penny" },
        dialogue: isAdd
          ? { tr: `${base} tutarına %${pct} gece komisyonu ekle!`, en: `Add ${pct}% midnight fee to ${base}!` }
          : { tr: `${base} tutarından %${pct} liman kesintisi düş!`, en: `Deduct ${pct}% dock cut from ${base}!` },
        ask: { tr: `${base} ${isAdd ? "+" : "−"} ${pct} [%] hesapla!`, en: `Compute ${base} ${isAdd ? "+" : "−"} ${pct} [%]!` },
        expected,
        timeLimit,
        bonusKeys: ["percent"],
        onSuccessEffect: "correct",
      };
    }

    if (kind === "kdv_plus") {
      const base = pickRand([500, 1000, 1500, 2000, 2500]);
      return {
        portrait: "ken",
        backdrop: "shop-day",
        theme: "shop-day",
        mood: "rush",
        props: ["invoice"],
        speaker: { tr: "Toptancı Kemal", en: "Wholesaler Ken" },
        dialogue: { tr: `${base} tutarındaki irsaliyeye %20 KDV ekle!`, en: `Add 20% TAX to this ${base} invoice!` },
        ask: { tr: `[%20] seçiliyken ${base} [KDV+] yap!`, en: `With [20%] selected, punch ${base} [TAX+]!` },
        expected: base * 1.2,
        timeLimit,
        bonusKeys: ["kdv-plus"],
        onSuccessEffect: "cash",
      };
    }

    if (kind === "kdv_minus") {
      const base = pickRand([1000, 1200, 1500, 2000]);
      const gross = Math.round(base * 1.1);
      return {
        portrait: "enforcer",
        backdrop: "mafia-basement",
        theme: "mafia-basement",
        mood: "mafia",
        props: ["invoice", "tea"],
        speaker: { tr: "Bruno", en: "Bruno" },
        dialogue: { tr: `${gross} faturanın içindeki %10 KDV'yi ayıkla!`, en: `Strip embedded 10% TAX from ${gross}!` },
        ask: { tr: `[%10] seçip ${gross} [KDV−] yap!`, en: `Flip to [10%] and punch ${gross} [TAX−]!` },
        expected: base,
        timeLimit,
        bonusKeys: ["kdv-minus"],
        onSuccessEffect: "correct",
      };
    }

    if (kind === "mu") {
      const cost = pickRand([400, 600, 800, 1200]);
      return {
        portrait: "don",
        backdrop: "syndicate-vault",
        theme: "syndicate-vault",
        mood: "syndicate",
        props: ["coil"],
        speaker: { tr: "Prof. Kuruş", en: "Prof. Penny" },
        dialogue: { tr: `${cost} maliyetli bobinden net %20 kâr marjlı satış fiyatını [MU] ile bul!`, en: `Find the 20% margin sell price on ${cost} cost using [MU]!` },
        ask: { tr: `${cost} ÷ 20 [MU] hesapla!`, en: `Compute ${cost} ÷ 20 [MU]!` },
        expected: cost / 0.8,
        timeLimit,
        bonusKeys: ["mu"],
        onSuccessEffect: "correct",
      };
    }

    // mem (CERN)
    const a = pickRand([10, 15, 20]);
    const b = pickRand([100, 200, 300]);
    const c = pickRand([200, 400, 500]);
    return {
      portrait: "elena",
      backdrop: "cern-lab",
      theme: "cern-lab",
      mood: "cern",
      props: ["core"],
      speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
      dialogue: { tr: `Acil CERN akısı! (${a} × ${b}) ekle [M+], ${c} çıkar [M−], [MRC] ile yolla!`, en: `CERN flux alert! (${a} × ${b}) [M+], subtract ${c} [M−], transmit [MRC]!` },
      ask: { tr: `(${a} × ${b}) − ${c} net akıyı gönder!`, en: `Transmit net flux (${a} × ${b}) − ${c}!` },
      resetCalc: "clear-all-mem",
      expected: a * b - c,
      timeLimit: timeLimit + 4,
      bonusKeys: ["mrc"],
      onSuccessEffect: "correct",
    };
  }

  const api = {
    DOJO_MODULES,
    ACHIEVEMENTS,
    generateRushTask,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafDojo = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
