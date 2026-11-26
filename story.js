(function (global) {
  "use strict";

  const EPISODES = [
    /* =====================================================================
       EPISODE 1: SIRADAN BİR SALI / JUST ANOTHER TUESDAY
       Teaches: +, −, ×, =, 00, ▶, CE, AC, KDV+ (first taste), decimal (0,01)
       ===================================================================== */
    {
      id: "ep1",
      num: 1,
      defaultTheme: "shop-day",
      keysTaught: ["+", "−", "×", "00", "▶", "CE", "KDV+"],
      title: {
        tr: "Bölüm 1: Sıradan Bir Salı",
        en: "Episode 1: Just Another Tuesday",
      },
      subtitle: {
        tr: "Mahalle bakkalında normal başlayan bir gün… ve kaderi değiştiren 1 kuruş.",
        en: "A quiet morning at the corner shop… and a single cent that changes everything.",
      },
      location: {
        tr: "Mahalle Bakkalı · 08:00",
        en: "Corner Shop · 08:00 AM",
      },
      scenes: [
        {
          id: "e1_intro",
          type: "cutscene",
          theme: "shop-day",
          mood: "shop",
          portrait: "clara",
          badge: { tr: "BÖLÜM 1 · AÇILIŞ", en: "EPISODE 1 · OPENING" },
          speaker: { tr: "Tezgâh Başı · Salı Sabahı", en: "Behind the Counter · Tuesday Morning" },
          role: { tr: "Mahalle Bakkalı", en: "Neighborhood Shop" },
          text: {
            tr: "Kepengi kaldırdın, taze ekmek kokusu dükkâna doldu. Tezgâhta eski dostun ESNAF 120D güneş ışığını yakalayıp ekranını açtı: 0. Sıradan, huzurlu bir gün olacak… öyle sanıyorsun.",
            en: "You roll up the shutter as the smell of warm bread fills the room. On the counter, your trusty ESNAF 120D catches the morning light and wakes up: 0. Just an ordinary, peaceful Tuesday… or so you think.",
          },
        },
        {
          id: "e1_t1",
          type: "task",
          theme: "shop-day",
          mood: "shop",
          portrait: "clara",
          speaker: { tr: "Emine Teyze", en: "Mrs. Clara" },
          role: { tr: "İlk Müşteri", en: "First Customer" },
          dialogue: {
            tr: "Günaydın evladım! İki taze ekmek, bir de süt aldım. Al şu 100'lüğü, üstünü hesaplayıver.",
            en: "Good morning, dear! Just two loaves of bread and a bottle of milk. Here's 100—give me my change, please.",
          },
          items: [
            { label: { tr: "2 × Ekmek (15)", en: "2 × Bread (15)" }, amountText: { tr: "30 ₺", en: "$30" } },
            { label: { tr: "1 × Günlük Süt", en: "1 × Fresh Milk" }, amountText: { tr: "45 ₺", en: "$45" } },
          ],
          cashGiven: 100,
          ask: {
            tr: "Sepet toplamını bul ve 100 ₺'den para üstünü ver.",
            en: "Find the basket total and return the change from $100.",
          },
          expected: 25,
          timeLimit: 0,
          submitLabelKey: "btnSubmitCash",
          highlightKeys: ["key-add", "key-sub", "key-eq"],
          hint: {
            tr: "Önce 30 + 45 = 75 bul. Sonra 100 − 75 = 25 yaz ve Kasadan Ver'e (Space) bas.",
            en: "First compute 30 + 45 = 75. Then calculate 100 − 75 = 25 and press Hand Over (Space).",
          },
          successReply: {
            tr: "Ellerine sağlık evladım, bereketli işlerin olsun!",
            en: "Thank you kindly! Have a wonderful shift!",
          },
          wrongReply: {
            tr: "Ay dur evladım, bu para üstü eksik mi fazla mı oldu? Bir daha bakıver.",
            en: "Hold on dear, that change doesn't look right. Could you check again?",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e1_m1",
          type: "master",
          theme: "shop-day",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Hesap makinesi sadece sayı toplamaz evlat. O, kaosun ortasındaki adalettir. Tek tek sıfır kovalayan ömründen yer—büyük düşünen '00' tuşuna basar.",
            en: "A calculator does not merely add numbers, kid. It is justice carved from chaos. Chasing zeroes one by one steals your youth—those who think big strike '00'.",
          },
          lesson: {
            tr: "USTA DERSİ: Yüzlük ve binlik rakamları hızla yazmak için alttaki [00] tuşunu kullan.",
            en: "MASTER'S LESSON: Use the [00] key at the bottom to enter hundreds and thousands at double speed.",
          },
          highlightKeys: ["key-00"],
        },
        {
          id: "e1_t2",
          type: "task",
          theme: "shop-day",
          mood: "shop",
          portrait: "sam",
          speaker: { tr: "Kahveci Hasan", en: "Barista Sam" },
          role: { tr: "Toptan Sipariş", en: "Bulk Order" },
          dialogue: {
            tr: "Ustam kolay gelsin! Dükkâna 12 koli kahve lazım, kolisi 250'den. Nakit 5.000 bıraktım, üstünü hızlıca çıkaralım.",
            en: "Morning! I need 12 crates of coffee beans at 250 each. Here's 5,000 cash—let's get that change fast.",
          },
          items: [
            { label: { tr: "12 × Kahve Kolisi", en: "12 × Coffee Crates" }, amountText: { tr: "250 ₺ / adet", en: "$250 / ea" } },
          ],
          cashGiven: 5000,
          ask: {
            tr: "12 × 250 toplamını 5.000'den düşüp para üstünü ver.",
            en: "Multiply 12 × 250, subtract from 5,000, and return the change.",
          },
          expected: 2000,
          timeLimit: 45,
          submitLabelKey: "btnSubmitCash",
          highlightKeys: ["key-mul", "key-00"],
          bonusKeys: ["00"],
          hint: {
            tr: "12 × 250 = 3.000. Sonra 5000 (5 + 0 + 00) − 3000 = 2.000!",
            en: "12 × 250 = 3,000. Then type 5000 (using 00) − 3000 = 2,000!",
          },
          successReply: {
            tr: "Şimşek gibisin maşallah! Bir çayını içerim sonra.",
            en: "Lightning fast! First espresso is on me later.",
          },
          wrongReply: {
            tr: "Hop kardeş, kahveler pahalı ama o kadar da değil! Tekrar çarp.",
            en: "Whoa there, beans are pricey, not THAT pricey! Multiply again.",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e1_m2",
          type: "master",
          theme: "shop-day",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "İnsan hata yapar evlat. Mühim olan bütün defteri yakmamaktır. '▶' son hatanı siler, 'CE' sadece o anki yanlış girişi temizler. Ama 'AC' bütün ömrü sıfırlar.",
            en: "Everyone slips, kid. Wisdom is knowing not to burn the whole ledger. '▶' erases the last digit, 'CE' clears only the current entry—but 'AC' wipes your entire life.",
          },
          lesson: {
            tr: "USTA DERSİ: Bir toplama sırasında ikinci sayıyı yanlış yazarsan [AC] yerine [CE] bas; ilk sayın ve işlemin korunur!",
            en: "MASTER'S LESSON: If you mistype the second number mid-calculation, press [CE] instead of [AC]—your first number stays safe!",
          },
          highlightKeys: ["key-ce", "key-backspace"],
        },
        {
          id: "e1_t3",
          type: "task",
          theme: "shop-day",
          mood: "rush",
          portrait: "pete",
          speaker: { tr: "Aceleci Selim", en: "Rushed Pete" },
          role: { tr: "Uçağa Yetişen Müşteri", en: "Late for a Flight" },
          dialogue: {
            tr: "Pardon pardon! Ekrana '150 + 999' yazmışsın ama o ikinci ürün 999 değil 85'ti! Sakın baştaki 150'yi silme, uçağım kalkıyor!",
            en: "Wait, stop! You typed '150 + 999' on the screen, but the second item is 85, not 999! Don't wipe the 150—my flight is boarding!",
          },
          items: [
            { label: { tr: "İlk Kalem (Ekranda Hazır)", en: "First Item (Already Entered)" }, amountText: { tr: "150 ₺", en: "$150" } },
            { label: { tr: "Düzeltilecek İkinci Kalem", en: "Corrected Second Item" }, amountText: { tr: "85 ₺", en: "$85" } },
          ],
          ask: {
            tr: "CE tuşuyla 999'u temizleyip 85 ekle ve toplamı ver.",
            en: "Clear 999 with CE, enter 85, hit = and submit the total.",
          },
          presetKeys: ["1", "5", "0", "+", "9", "9", "9"],
          expected: 235,
          timeLimit: 38,
          submitLabelKey: "btnSubmitCash",
          highlightKeys: ["key-ce"],
          bonusKeys: ["ce", "backspace"],
          hint: {
            tr: "Doğrudan CE tuşuna bas (150 + korunur), sonra 85 ve = tuşuna bas → 235.",
            en: "Press CE (keeps 150 + intact), then press 85 and = → 235.",
          },
          successReply: {
            tr: "Oh be, yetiştirdin beni! Bu hızla borsaya girsen batmazsın!",
            en: "Lifesaver! With fingers like that you belong on Wall Street!",
          },
          wrongReply: {
            tr: "Saatime bakıyorum, hâlâ yanlış tutar görünüyor! 150 + 85 olacak!",
            en: "Clock is ticking, that's still wrong! It needs to be 150 + 85!",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e1_t4",
          type: "task",
          theme: "shop-day",
          mood: "rush",
          portrait: "sam",
          speaker: { tr: "Öğle Kuyruğu", en: "Lunch Rush Customer" },
          role: { tr: "Zamana Karşı Kasa", en: "Beat the Clock" },
          dialogue: {
            tr: "Kuyruk kapıdan taştı! 3 tost (tanesi 65) ve 2 ayran (tanesi 25). 300 uzattım, çabuk para üstü!",
            en: "Line's out the door! 3 sandwiches at 65 each plus 2 drinks at 25 each. Here's 300—quick change!",
          },
          items: [
            { label: { tr: "3 × Tost (65)", en: "3 × Sandwich (65)" }, amountText: { tr: "195 ₺", en: "$195" } },
            { label: { tr: "2 × Ayran (25)", en: "2 × Drink (25)" }, amountText: { tr: "50 ₺", en: "$50" } },
          ],
          cashGiven: 300,
          ask: {
            tr: "Toplamı (195 + 50) 300'den düşüp para üstünü ver.",
            en: "Subtract the total (195 + 50) from 300 and hand over the change.",
          },
          expected: 55,
          timeLimit: 30,
          submitLabelKey: "btnSubmitCash",
          hint: {
            tr: "195 + 50 = 245. Ardından 300 − 245 = 55.",
            en: "195 + 50 = 245. Then 300 − 245 = 55.",
          },
          successReply: {
            tr: "Helal olsun, kuyruk eridi gitti!",
            en: "Nailed it—line's moving again!",
          },
          wrongReply: {
            tr: "Arkadakiler söyleniyor, hesabı bir daha kontrol et!",
            en: "People behind me are groaning—recheck that math!",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e1_t5",
          type: "task",
          theme: "shop-day",
          mood: "rush",
          portrait: "ken",
          speaker: { tr: "Toptancı Kemal", en: "Wholesaler Ken" },
          role: { tr: "Fatura & KDV", en: "Invoice & Tax" },
          dialogue: {
            tr: "Malı indirdik kardeş. 1.250'lik faturaya %20 KDV ekleyiver de irsaliyeyi kesip kaçayım.",
            en: "Unloaded the crates, pal. Slap 20% TAX onto this 1,250 invoice so I can sign off and roll.",
          },
          items: [
            { label: { tr: "Toptan Mal Bedeli (KDV Hariç)", en: "Wholesale Goods (Pre-Tax)" }, amountText: { tr: "1.250 ₺", en: "$1,250" } },
            { label: { tr: "KDV Oranı", en: "Tax Rate" }, amountText: { tr: "%20", en: "20%" } },
          ],
          ask: {
            tr: "1.250 tutarına %20 KDV ekle (KDV+ tuşuyla tek hamlede!).",
            en: "Add 20% TAX to 1,250 (one tap with TAX+!).",
          },
          expected: 1500,
          timeLimit: 35,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["kdv-20", "key-kdv-plus"],
          bonusKeys: ["kdv-plus"],
          hint: {
            tr: "Üstteki KDV anahtarı %20'de olsun. 1250 yazıp doğrudan [KDV+] tuşuna bas → 1.500!",
            en: "Ensure the TAX switch is at 20%. Type 1250 and hit [TAX+] directly → 1,500!",
          },
          successReply: {
            tr: "Tek tuşla KDV! İşte gerçek esnaf refleksi!",
            en: "One-tap tax! Now that's a pro shopkeeper!",
          },
          wrongReply: {
            tr: "Yok be kardeşim, %20 KDV dahil bu tutar etmez. 1250 yazıp KDV+ dene!",
            en: "No way pal, 20% tax on 1,250 isn't that. Type 1250 and press TAX+!",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e1_storm_intro",
          type: "cutscene",
          theme: "shop-storm",
          mood: "storm",
          sfx: "thunder",
          portrait: "shade",
          badge: { tr: "AKŞAMÜSTÜ · FIRTINA", en: "DUSK · THE STORM" },
          speaker: { tr: "Bay Gölge", en: "Mr. Shade" },
          role: { tr: "Esrarengiz Müşteri #7", en: "Mysterious Customer #7" },
          text: {
            tr: "Saat 18:45. Dışarıda birden gök yarıldı. Kapı çanı tuhaf bir tınıyla çaldı; içeri siyah pardösülü, fötr şapkalı bir adam girdi. Gözlük camları şimşeği yansıtıyordu. Tezgâha mum mühürlü bir zarf bıraktı.",
            en: "6:45 PM. Thunder cracks outside. The door chime rings strangely as a man in a black trench coat and fedora steps in, lightning flashing across his glasses. He lays a wax-sealed envelope on your counter.",
          },
        },
        {
          id: "e1_t6",
          type: "task",
          theme: "shop-storm",
          mood: "storm",
          portrait: "shade",
          speaker: { tr: "Bay Gölge", en: "Mr. Shade" },
          role: { tr: "Esrarengiz Müşteri", en: "Mysterious Customer" },
          dialogue: {
            tr: "Bu zarfın bedeli tam 999,99. Tezgâha 1.000 bıraktım. Bana kalan hakkımı… tek kuruşunu bile atlamadan ver. Çünkü bir kuruş, dünyaları devirir.",
            en: "This envelope costs exactly 999.99. I have placed 1,000 on the counter. Give me my exact change—down to the very last cent. For a single cent can topple worlds.",
          },
          items: [
            { label: { tr: "Mühürlü Zarf Bedeli", en: "Wax-Sealed Envelope" }, amountText: { tr: "999,99 ₺", en: "$999.99" } },
          ],
          cashGiven: 1000,
          ask: {
            tr: "1.000 − 999,99 hesabını virgüle dikkat ederek yap ve teslim et.",
            en: "Calculate 1,000 − 999.99 carefully using the decimal key and submit.",
          },
          expected: 0.01,
          tolerance: 0.0005,
          timeLimit: 32,
          submitLabelKey: "btnSubmitCash",
          highlightKeys: ["key-dot", "key-sub"],
          hint: {
            tr: "1000 − 999,99 = 0,01. Ondalık için virgül (,) tuşunu kullan!",
            en: "1000 − 999.99 = 0.01. Use the decimal key (.)!",
          },
          successReply: {
            tr: "…Tam 0,01. Mükemmel. Şimdi patronum seni görmek istiyor.",
            en: "…Exactly 0.01. Impeccable. Now my employer would like a word with you.",
          },
          wrongReply: {
            tr: "Yanlış. Bir kuruşun bile hesabı sorulur. Tekrar dene: 1000 − 999,99.",
            en: "Incorrect. Every single cent is accounted for. Try again: 1000 − 999.99.",
          },
          onSuccessEffect: "glitch",
        },
        {
          id: "e1_cliffhanger",
          type: "cutscene",
          theme: "shop-storm",
          mood: "mafia",
          sfx: "doorSlam",
          portrait: "enforcer",
          badge: { tr: "KAÇIRILMA · BÖLÜM SONU", en: "ABDUCTION · CLIFFHANGER" },
          speaker: { tr: "Siyah Minibüs Adamları", en: "Black Van Enforcers" },
          role: { tr: "Don Kuruş'un Ekibi", en: "Don Penny's Crew" },
          text: {
            tr: "0,01'i bastığın an kasa kilitlendi, LCD ekran garip bir parazitle titredi! Dışarıda lastikler cıyakladı, kapı tekmeyle açıldı. İki iri adam koluna girdi: 'Don Kuruş'un 1 kuruşluk kasa açığını sen mi çıkardın?! Makineni de al, bodruma gidiyoruz!'",
            en: "The instant you enter 0.01, the cash drawer jams and your LCD glitches! Tires screech outside; the door flies open. Two towering figures grab your arms: 'You're the clerk who tripped Don Penny's one-cent ledger?! Grab your calculator—you're coming to the basement!'",
          },
        },
        {
          id: "e1_m_outro",
          type: "master",
          theme: "mafia-basement",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Korkma evlat… Sıradan bir bakkal tezgâhında başlayan hesap, yakında bütün kuralları yıkacak. ESNAF 120D'ni sıkı tut—asıl sınav bodrumda başlıyor.",
            en: "Do not fear, kid… A tally begun at a humble corner shop will soon shatter every rule. Hold tight to your ESNAF 120D—the real trial begins in the basement.",
          },
        },
      ],
    },

    /* =====================================================================
       EPISODE 2: BODRUMDAKİ MUHASEBE / BASEMENT LEDGER
       Teaches: % (discount & surcharge), KDV− (tax strip), GT (Grand Total)
       ===================================================================== */
    {
      id: "ep2",
      num: 2,
      defaultTheme: "mafia-basement",
      keysTaught: ["%", "KDV−", "KDV %10", "GT"],
      title: {
        tr: "Bölüm 2: Bodrumdaki Muhasebe",
        en: "Episode 2: Basement Ledger",
      },
      subtitle: {
        tr: "Sallanan tek bir ampul altında mafyanın psikolojik muhasebe işkencesi.",
        en: "Under a swinging bare bulb, the mob subjects you to relentless accounting torture.",
      },
      location: {
        tr: "Rutubetli Depo · 01:15",
        en: "Damp Basement · 01:15 AM",
      },
      scenes: [
        {
          id: "e2_intro",
          type: "cutscene",
          theme: "mafia-basement",
          mood: "mafia",
          sfx: "doorSlam",
          portrait: "don",
          badge: { tr: "BÖLÜM 2 · SORGULAMA", en: "EPISODE 2 · INTERROGATION" },
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Yeraltı Patronu", en: "Underworld Boss" },
          text: {
            tr: "Gözlerini açtın. Üstünde sallanan tek bir sarı ampul, önünde sadece ESNAF 120D. Karşında elinde madeni bir kuruş çeviren Don Kuruş gülümsüyor: 'Biz kaba kuvvet sevmeyiz kasiyer. Çok daha korkunç bir işkencemiz var… sabaha kadar bizim defterleri tutacaksın! Hata yaparsan ampul söner!'",
            en: "You wake beneath a single swinging bulb, your ESNAF 120D set squarely in front of you. Across the steel table, Don Penny flips a coin: 'We're civilized people, clerk. No bruises—something far worse. You'll balance our books till dawn! Miss a digit, and the light goes out!'",
          },
        },
        {
          id: "e2_t1",
          type: "task",
          theme: "mafia-basement",
          mood: "mafia",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "İşkence #1 · Haraç İskontosu", en: "Torture #1 · Mob Cut" },
          dialogue: {
            tr: "Rıhtımdan gelen 2.400'lük maldan %15 'liman kesintisi' düş! Ama yavaş hesaplama—vaktim dar!",
            en: "Take a 15% 'dockside cut' off this 2,400 shipment! And don't keep me waiting!",
          },
          items: [
            { label: { tr: "Sevkiyat Tutarı", en: "Shipment Value" }, amountText: { tr: "2.400 ₺", en: "$2,400" } },
            { label: { tr: "Kesinti Oranı", en: "Deduction Rate" }, amountText: { tr: "−%15", en: "−15%" } },
          ],
          ask: {
            tr: "2.400 − 15 % hesabını yap ve kalan tutarı teslim et.",
            en: "Compute 2,400 − 15 % and submit the net amount.",
          },
          expected: 2040,
          timeLimit: 36,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-sub", "key-pct"],
          bonusKeys: ["percent"],
          hint: {
            tr: "2400 − 15 ve doğrudan [%] tuşuna bas (eşittire bile gerek yok) → 2.040!",
            en: "Type 2400 − 15 and hit [%] directly (no equals needed) → 2,040!",
          },
          successReply: {
            tr: "Hmph… parmakların titremiyor. İlginç.",
            en: "Hmph… steady fingers. Interesting.",
          },
          wrongReply: {
            tr: "YANLIŞ! Limandaki adamlarımı mı kazıklayacaksın?! 2400 − 15 %!",
            en: "WRONG! Trying to shortchange my dock crew?! 2400 − 15 %!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e2_m1",
          type: "master",
          theme: "mafia-basement",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Gölgelerin arasında saklanan sayıları 'KDV−' soyup ortaya çıkarır evlat. Ve şunu aklına kazı: 'GT' tuşu vicdan gibidir—yaptığın her '=' ve '%' sonucu onda sessizce birikir.",
            en: "What hides inside shadows is stripped bare by 'TAX−', kid. And engrave this on your mind: 'GT' is like conscience—every '=' and '%' you strike quietly gathers inside it.",
          },
          lesson: {
            tr: "USTA DERSİ: Vergi oranını üst anahtardan [%10] seçip [KDV−] basarak vergisiz saf tutarı bul. [GT] tuşu ise biriken sonuçların genel toplamını tek tıkla verir!",
            en: "MASTER'S LESSON: Flip the top switch to [10%] and tap [TAX−] to strip embedded tax. And [GT] recalls the grand total of all accumulated results!",
          },
          highlightKeys: ["kdv-10", "key-kdv-minus", "key-gt"],
        },
        {
          id: "e2_t2",
          type: "task",
          theme: "mafia-basement",
          mood: "mafia",
          portrait: "enforcer",
          speaker: { tr: "Kasa Görevlisi Bruno", en: "Bruno the Enforcer" },
          role: { tr: "İşkence #2 · Vergi Ayıklama", en: "Torture #2 · Tax Stripping" },
          dialogue: {
            tr: "Bu 1.320'lik faturanın içine %10 KDV saklamışlar! Üst anahtarı %10 yap, KDV HARİÇ saf parayı çıkar!",
            en: "Someone hid 10% TAX inside this 1,320 invoice! Flip the switch to 10% and strip the tax clean!",
          },
          items: [
            { label: { tr: "KDV Dahil Fatura", en: "Tax-Included Invoice" }, amountText: { tr: "1.320 ₺", en: "$1,320" } },
            { label: { tr: "İçindeki Oran", en: "Embedded Rate" }, amountText: { tr: "%10 (Çıkar)", en: "10% (Strip)" } },
          ],
          ask: {
            tr: "KDV oranını %10 seçip 1.320'den KDV− ile vergisiz tutarı bul.",
            en: "Select 10% TAX, type 1320, and press TAX− to find the pre-tax base.",
          },
          expected: 1200,
          timeLimit: 34,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["kdv-10", "key-kdv-minus"],
          bonusKeys: ["kdv-minus"],
          hint: {
            tr: "Üstten [%10] düğmesine tıkla. 1320 yaz ve [KDV−] tuşuna bas → 1.200!",
            en: "Click [10%] on the top switch. Type 1320 and press [TAX−] → 1,200!",
          },
          successReply: {
            tr: "Vay canına, tek hamlede ayıkladı! Patron bunu beğenecek.",
            en: "Whoa, stripped clean in one tap! The Boss is gonna like this.",
          },
          wrongReply: {
            tr: "Üstteki KDV anahtarını %10 yaptın mı?! 1320 yaz, sonra KDV− bas!",
            en: "Did you flip the top TAX switch to 10%?! Type 1320, then TAX−!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e2_t3",
          type: "task",
          theme: "mafia-basement",
          mood: "mafia",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "İşkence #3 · Çanta 1/2 (GT Başlıyor)", en: "Torture #3 · Bag 1/2 (GT Chain)" },
          dialogue: {
            tr: "Şimdi iki çanta sayacağız ve sonunda GENEL TOPLAMI isteyeceğim! Birinci çanta: 8 deste, her biri 450. Çabuk hesapla!",
            en: "Now we count two bags—and I'll demand the GRAND TOTAL at the end! Bag one: 8 bundles of 450. Compute it now!",
          },
          items: [
            { label: { tr: "Çanta #1", en: "Bag #1" }, amountText: { tr: "8 × 450", en: "8 × 450" } },
          ],
          ask: {
            tr: "8 × 450 = işlemini yap ve teslim et (GT otomatik kaydedecek).",
            en: "Compute 8 × 450 = and submit (GT will store it automatically).",
          },
          resetCalc: "clear-gt",
          expected: 3600,
          timeLimit: 26,
          submitLabelKey: "btnSubmit",
          hint: {
            tr: "8 × 450 = 3.600. Ekranda GT ışığının yandığını göreceksin!",
            en: "8 × 450 = 3,600. Notice the GT indicator light up on the LCD!",
          },
          successReply: {
            tr: "3.600 kaydedildi. Sakın nefes alma, ikinci çanta geliyor!",
            en: "3,600 logged. Don't breathe—here comes bag two!",
          },
          wrongReply: {
            tr: "Sekiz kere dört yüz elli! Bu kadar basit bir çarpma için ampulü mü kırayım?",
            en: "Eight times four-fifty! Don't make me smash the light bulb!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e2_t4",
          type: "task",
          theme: "mafia-basement",
          mood: "mafia",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "İşkence #4 · Çanta 2/2", en: "Torture #4 · Bag 2/2" },
          dialogue: {
            tr: "İkinci çanta: 600'ün üzerine %25 gece komisyonu ekle (600 + 25 %)! Çabuk!",
            en: "Bag two: Add a 25% midnight surcharge onto 600 (600 + 25 %)! Move it!",
          },
          items: [
            { label: { tr: "Çanta #2", en: "Bag #2" }, amountText: { tr: "600 + %25", en: "600 + 25%" } },
          ],
          ask: {
            tr: "600 + 25 % işlemini yap ve teslim et.",
            en: "Compute 600 + 25 % and submit.",
          },
          resetCalc: "keep-gt",
          expected: 750,
          timeLimit: 24,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-add", "key-pct"],
          bonusKeys: ["percent"],
          hint: {
            tr: "600 + 25 [%] → 750. GT arka planda 3.600 + 750'yi topladı bile!",
            en: "600 + 25 [%] → 750. Behind the scenes, GT already added 3,600 + 750!",
          },
          successReply: {
            tr: "750! Şimdi büyük an geldi kasiyer…",
            en: "750! Now for the moment of truth, clerk…",
          },
          wrongReply: {
            tr: "600'ün %25 fazlası! 600 + 25 % yaz!",
            en: "600 plus 25 percent! Punch 600 + 25 %!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e2_t5",
          type: "task",
          theme: "mafia-basement",
          mood: "mafia",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Final Sınavı · GT Genel Toplam", en: "Final Test · GT Grand Total" },
          dialogue: {
            tr: "İki çantanın GENEL TOPLAMI kaç ediyor?! Tek tuşla çıkar—sadece 18 saniyen var!",
            en: "What's the GRAND TOTAL of both bags?! Pull it in one tap—you've got 18 seconds!",
          },
          items: [
            { label: { tr: "Çanta #1 + Çanta #2", en: "Bag #1 + Bag #2" }, amountText: { tr: "3.600 + 750", en: "3,600 + 750" } },
          ],
          ask: {
            tr: "GT tuşuna basıp genel toplamı (4.350) teslim et!",
            en: "Press GT to recall the grand total (4,350) and submit!",
          },
          resetCalc: "keep-gt",
          expected: 4350,
          timeLimit: 18,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-gt"],
          bonusKeys: ["gt"],
          hint: {
            tr: "Sadece sol üstteki [GT] tuşuna bir kez bas! (Veya 3600 + 750 = 4350).",
            en: "Just tap [GT] at the top-left once! (Or compute 3600 + 750 = 4350).",
          },
          successReply: {
            tr: "4.350!! Tek tuşla!! Bruno, çöz şu çocuğun sandalyesini!",
            en: "4,350!! In a single keystroke!! Bruno, untie the chair!",
          },
          wrongReply: {
            tr: "GT'ye bas, GT'ye! 3.600 + 750 = 4.350!",
            en: "Hit GT! 3,600 + 750 = 4,350!",
          },
          onSuccessEffect: "cash",
        },
        {
          id: "e2_outro",
          type: "cutscene",
          theme: "mafia-basement",
          mood: "syndicate",
          portrait: "don",
          badge: { tr: "TERFİ · BÖLÜM 2 SONU", en: "PROMOTION · END OF EPISODE 2" },
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Etkilenmiş Patron", en: "Impressed Boss" },
          text: {
            tr: "Don Kuruş masaya yaslanıp seni süzdü: 'Yirmi yıldır böyle temiz bir GT parmağı görmedim. Seni bu bodrumda çürütmek günah olur. Takım elbise getirin—yarın Altın Oran Sendikası'nın Baş Hesapçısı sensin!'",
            en: "Don Penny leans back, stunned: 'Twenty years in this business and I've never seen a GT finger that sharp. Wasting you in a cellar is a crime. Fetch a suit—tomorrow, you're Chief Accountant of the Golden Ratio Syndicate!'",
          },
        },
      ],
    },

    /* =====================================================================
       EPISODE 3: ALTIN ORAN SENDİKASI / THE GOLDEN RATIO SYNDICATE
       Teaches: MU (Mark-Up), M+, M−, MRC (Memory), +/− (Sign) + PLOT TWIST #1
       ===================================================================== */
    {
      id: "ep3",
      num: 3,
      defaultTheme: "syndicate-vault",
      keysTaught: ["MU", "M+", "M−", "MRC", "+/−"],
      title: {
        tr: "Bölüm 3: Altın Oran Sendikası",
        en: "Episode 3: The Golden Ratio Syndicate",
      },
      subtitle: {
        tr: "Yeraltı finans imparatorluğu, gizli koliler ve ilk büyük sır.",
        en: "An underground finance empire, suspicious crates, and the first huge twist.",
      },
      location: {
        tr: "Sendika Kasa Odası · 23:40",
        en: "Syndicate Vault · 11:40 PM",
      },
      scenes: [
        {
          id: "e3_m1",
          type: "master",
          theme: "syndicate-vault",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Bakkal tezgâhından yeraltı kasasına yükseldin evlat. Ama unutma: 'MU' tuşunu bilen sadece kâr etmez, gerçek değerin bedelini görür. Gözün rakamlarda değil, arkasındaki gerçeğin peşinde olsun.",
            en: "From a corner counter to an underground vault, kid. Remember: one who masters 'MU' does not merely profit—they see the true price behind the curtain. Watch what these crates really are.",
          },
          lesson: {
            tr: "USTA DERSİ: Net %20 kâr marjlı satış fiyatı için [Maliyet ÷ 20 MU] bas! İki fiyat arası kâr yüzdesi için [Satış − Maliyet MU]!",
            en: "MASTER'S LESSON: For a 20% margin sell price, press [Cost ÷ 20 MU]! For profit rate between sell and cost, press [Sell − Cost MU]!",
          },
          highlightKeys: ["key-mu"],
        },
        {
          id: "e3_t1",
          type: "task",
          theme: "syndicate-vault",
          mood: "syndicate",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Sendika Lideri", en: "Syndicate Chief" },
          dialogue: {
            tr: "Hoş geldin Baş Hesapçı! Maliyeti 800 olan bu 'süper bakır bobin' paketine net %20 kâr marjı koyup satış fiyatını çıkar. MU tuşunu konuştur!",
            en: "Welcome, Chief Accountant! Price this 'super copper coil' crate—cost is 800, we want a clean 20% profit margin. Work that MU key!",
          },
          items: [
            { label: { tr: "Bobin Maliyeti", en: "Coil Cost" }, amountText: { tr: "800 ₺", en: "$800" } },
            { label: { tr: "Hedef Kâr Marjı", en: "Target Margin" }, amountText: { tr: "%20 (MU)", en: "20% (MU)" } },
          ],
          ask: {
            tr: "800 ÷ 20 MU ile satış fiyatını bul (800 / 0,80 = 1.000).",
            en: "Calculate the selling price with 800 ÷ 20 MU (800 / 0.80 = 1,000).",
          },
          expected: 1000,
          timeLimit: 34,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-div", "key-mu"],
          bonusKeys: ["mu"],
          hint: {
            tr: "800 ÷ 20 ve doğrudan [MU] tuşuna bas → 1.000!",
            en: "Press 800 ÷ 20 then [MU] → 1,000!",
          },
          successReply: {
            tr: "Tam 1.000! (Bekle… niye bakır bobin alıyoruz diye sorma!)",
            en: "1,000 on the nose! (And don't ask why we're buying copper coils!)",
          },
          wrongReply: {
            tr: "Marj hesabı zam değildir! 800 ÷ 20 MU tuşuna bas!",
            en: "Margin isn't simple addition! Hit 800 ÷ 20 MU!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e3_t2",
          type: "task",
          theme: "syndicate-vault",
          mood: "syndicate",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Kâr Analizi", en: "Profit Check" },
          dialogue: {
            tr: "Bir de şuna bak: 120'ye aldığımız 'kuvars sensörü' 180'e okuttuk. Yüzde kaç kâr etmişiz?",
            en: "Quick check: we bought a 'quartz sensor' for 120 and moved it for 180. What's our markup percentage?",
          },
          items: [
            { label: { tr: "Satış Fiyatı", en: "Sell Price" }, amountText: { tr: "180 ₺", en: "$180" } },
            { label: { tr: "Alış Maliyeti", en: "Purchase Cost" }, amountText: { tr: "120 ₺", en: "$120" } },
          ],
          ask: {
            tr: "180 − 120 MU ile kâr yüzdesini bul.",
            en: "Find the profit percentage using 180 − 120 MU.",
          },
          expected: 50,
          timeLimit: 30,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-sub", "key-mu"],
          bonusKeys: ["mu"],
          hint: {
            tr: "180 − 120 ve [MU] tuşuna bas → 50 (%50 kâr)!",
            en: "Press 180 − 120 then [MU] → 50 (50% profit)!",
          },
          successReply: {
            tr: "%50 kâr! Bu hızla tüneli bu ay bitiririz—şey, yani depoyu!",
            en: "50% profit! At this rate we'll finish the tunnel—uh, I mean the warehouse!",
          },
          wrongReply: {
            tr: "180 − 120 MU yap, yüzde 50 çıkacak!",
            en: "Punch 180 − 120 MU—it should give 50!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e3_m2",
          type: "master",
          theme: "syndicate-vault",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Zihin yorulur, defter kaybolur evlat… ama hafıza tuşları unutmaz. Geliri 'M+' ile sakla, gideri 'M−' ile eksilt, zamanı gelince 'MRC' ile gerçeği çağır.",
            en: "Minds tire and ledgers burn, kid… yet memory endures. Store gains with 'M+', subtract losses with 'M−', and summon the truth with 'MRC'.",
          },
          lesson: {
            tr: "USTA DERSİ: Birden fazla çarpma/işlemi kağıt kalemsiz toplamak için her sonucun ardından [M+] (ekle) veya [M−] (çıkar) bas, en son [MRC] ile toplamı gör!",
            en: "MASTER'S LESSON: To combine separate calculations without paper, hit [M+] (add) or [M−] (subtract) after each step, then [MRC] to recall!",
          },
          highlightKeys: ["key-m-plus", "key-m-minus", "key-mrc"],
        },
        {
          id: "e3_t3",
          type: "task",
          theme: "syndicate-vault",
          mood: "syndicate",
          portrait: "enforcer",
          speaker: { tr: "Bruno", en: "Bruno" },
          role: { tr: "Üçlü Kasa Dengesi · Hafıza", en: "Triple Vault · Memory" },
          dialogue: {
            tr: "Kâğıt kalem yasak, her şey hafızadan! Kasa A (15 × 400) ekle, Kasa B (8 × 250) ekle, 1.500 gideri çıkar! Net kaç kalıyor?",
            en: "No pen or paper allowed—memory keys only! Add Vault A (15 × 400), add Vault B (8 × 250), subtract 1,500 expense! What's the net balance?",
          },
          items: [
            { label: { tr: "Kasa A (Ekle: M+)", en: "Vault A (Add: M+)" }, amountText: { tr: "15 × 400", en: "15 × 400" } },
            { label: { tr: "Kasa B (Ekle: M+)", en: "Vault B (Add: M+)" }, amountText: { tr: "8 × 250", en: "8 × 250" } },
            { label: { tr: "Lazer Gideri (Çıkar: M−)", en: "Laser Expense (Sub: M−)" }, amountText: { tr: "−1.500", en: "−1,500" } },
          ],
          ask: {
            tr: "M+, M− ve MRC kullanarak net bakiyeyi (6.500) bul.",
            en: "Use M+, M−, and MRC to compute the net balance (6,500).",
          },
          resetCalc: "clear-all-mem",
          expected: 6500,
          timeLimit: 38,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-m-plus", "key-m-minus", "key-mrc"],
          bonusKeys: ["m-plus", "m-minus", "mrc"],
          hint: {
            tr: "15 × 400 [M+] (6.000) → 8 × 250 [M+] (+2.000) → 1500 [M−] → [MRC] = 6.500!",
            en: "15 × 400 [M+] (6,000) → 8 × 250 [M+] (+2,000) → 1500 [M−] → [MRC] = 6,500!",
          },
          successReply: {
            tr: "6.500! (Bu arada 'Lazer Gideri' derken yanlış okudum, 'Lüks Yemek'ti o…)",
            en: "6,500! (And uh, 'Laser Expense' was a typo… meant 'Luxury Dinner'…)",
          },
          wrongReply: {
            tr: "Hafızayı karıştırdın! MRC'ye iki kez basıp temizle ve baştan dene: 6000 + 2000 − 1500.",
            en: "Memory got tangled! Double-tap MRC to clear and retry: 6000 + 2000 − 1500.",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e3_t4",
          type: "task",
          theme: "syndicate-vault",
          mood: "syndicate",
          portrait: "don",
          speaker: { tr: "Don Kuruş", en: "Don Penny" },
          role: { tr: "Sıfırın Altı · +/− İşaret", en: "Sub-Zero · +/− Sign" },
          dialogue: {
            tr: "Son fatura: Sıvı helyum soğutucusu −270 derecede çalışıyor! Üzerine +45 derece sapma eklendi. Yeni sıcaklık kaç?! (+/− tuşunu kullan!)",
            en: "Last invoice: our liquid helium cryostat sits at −270 degrees! A +45 drift just hit it. What's the new reading?! (Use +/−!)",
          },
          items: [
            { label: { tr: "Başlangıç Sıcaklığı", en: "Base Cryo Temp" }, amountText: { tr: "−270 °C", en: "−270 °C" } },
            { label: { tr: "Isı Sapması", en: "Thermal Drift" }, amountText: { tr: "+45 °C", en: "+45 °C" } },
          ],
          ask: {
            tr: "270 yaz, +/− ile eksiye çevir, + 45 = yap (−225).",
            en: "Type 270, flip sign with +/−, then + 45 = (−225).",
          },
          expected: -225,
          timeLimit: 26,
          submitLabelKey: "btnSubmit",
          highlightKeys: ["key-sign", "key-add"],
          bonusKeys: ["sign"],
          hint: {
            tr: "270 yaz → [+/−] tuşuna bas (−270 olur) → + 45 = → −225!",
            en: "Type 270 → press [+/−] (becomes −270) → + 45 = → −225!",
          },
          successReply: {
            tr: "−225! Bekle… ağzımdan sıvı helyum kaçtı, değil mi?",
            en: "−225! Wait… I just said 'liquid helium' out loud, didn't I?",
          },
          wrongReply: {
            tr: "Eksi işareti nerede?! 270 yazıp +/− tuşuna bas, sonra + 45 =!",
            en: "Where's the minus sign?! Type 270, tap +/−, then + 45 =!",
          },
          onSuccessEffect: "glitch",
        },
        {
          id: "e3_twist1",
          type: "cutscene",
          theme: "cern-lab",
          mood: "cern",
          sfx: "doorSlam",
          portrait: "don_cern",
          badge: { tr: "PLOT TWIST #1 · GERÇEK ORTAYA ÇIKIYOR", en: "PLOT TWIST #1 · THE REVEAL" },
          speaker: { tr: "Prof. Kuruş (eski CERN Fizikçisi)", en: "Prof. Penny (Ex-CERN Physicist)" },
          role: { tr: "Kaçak Parçacık Fizikçisi", en: "Rogue Particle Physicist" },
          text: {
            tr: "Don Kuruş takım ceketini açtı—altından beyaz CERN laboratuvar önlüğü çıktı! 'İtiraf ediyorum evlat! Ben mafya değilim! CERN beni teorilerim fazla absürt diye kovdu; ben de kara borsadan kendi parçacık hızlandırıcımı topluyordum!' O saniyede tavan camları patladı! İsviçre Özel Bilim Timi içeri indi: 'Profesör tutuklu—ama o kasiyeri ve 12 haneli hesap makinesini derhal Cenevre'ye götürüyoruz! Reaktör kontrolden çıktı!'",
            en: "Don Penny throws open his pinstripe jacket—revealing a white CERN lab coat underneath! 'Alright, I confess! I'm no mobster! CERN fired me for being too absurd, so I financed my own particle collider through black-market accounting!' Suddenly the skylight shatters! Swiss Science Ops rappel in: 'Arrest the Professor—and extract the clerk with the 12-digit calculator to Geneva immediately! The collider is failing!'",
          },
        },
      ],
    },

    /* =====================================================================
       EPISODE 4: CENEVRE'DE 12 HANE / 12 DIGITS IN GENEVA (CERN)
       Teaches: F · 2 · 0 rounding switches, chain combos, memory under pressure
       ===================================================================== */
    {
      id: "ep4",
      num: 4,
      defaultTheme: "cern-lab",
      keysTaught: ["F", "2", "0", "MRC", "%"],
      title: {
        tr: "Bölüm 4: Cenevre'de 12 Hane",
        en: "Episode 4: 12 Digits in Geneva",
      },
      subtitle: {
        tr: "CERN süper bilgisayarları çöktü. Radyasyona tek dayanan cihaz: senin bakkal makinen.",
        en: "CERN's supercomputers fried. The only machine immune to radiation: your corner-shop calculator.",
      },
      location: {
        tr: "CERN · Yeraltı Tüneli (−100m)",
        en: "CERN · Underground Tunnel (−100m)",
      },
      scenes: [
        {
          id: "e4_intro",
          type: "cutscene",
          theme: "cern-lab",
          mood: "cern",
          sfx: "glitch",
          portrait: "elena",
          badge: { tr: "BÖLÜM 4 · CERN ACİL DURUM", en: "EPISODE 4 · CERN EMERGENCY" },
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "CERN Başfizikçisi", en: "CERN Chief Physicist" },
          text: {
            tr: "Cenevre'de yerin 100 metre altındasın. Bütün dev bilgisayarlar mavi ekranda! Dr. Elena nefes nefese: 'Kuantum darbesi tüm dijital sunucularımızı çökertti. Güneş panelli, basit 12 haneli devresi sayesinde radyasyondan etkilenmeyen TEK cihaz senin ESNAF 120D'n! Çarpıştırıcıyı seninle dengeleyeceğiz!'",
            en: "You stand 100 meters beneath Geneva. Every supercomputer wall is dead. Dr. Elena rushes up: 'A quantum pulse fried all digital mainframes. Thanks to its simple solar 12-digit circuit, your ESNAF 120D is the ONLY working computer in the facility! You have to stabilize the collider!'",
          },
        },
        {
          id: "e4_m1",
          type: "master",
          theme: "cern-lab",
          mood: "master",
          portrait: "master",
          quote: {
            tr: "Bozuk bir CERN monitöründen bile sesim ulaşır evlat. Sonsuz küsuratlar makineyi de aklı da boğar. Üstteki 'F · 2 · 0' anahtarı kaderin hassasiyet ayarıdır: ne zaman serbest bırakacağını, ne zaman iki hanede keseceğini bil.",
            en: "Even through a dead CERN monitor my voice reaches you, kid. Endless decimals drown both circuits and minds. The 'F · 2 · 0' switch is the dial of precision—know when to float, when to round to two, and when to cut whole.",
          },
          lesson: {
            tr: "USTA DERSİ: Ekranın hemen altındaki Ondalık anahtarını [2] yapınca tüm sonuçlar 2 haneye, [0] yapınca tam sayıya yuvarlanır, [F] serbest bırakır!",
            en: "MASTER'S LESSON: Below the LCD, flip Decimal to [2] for 2-decimal rounding, [0] for whole integers, or [F] for full floating precision!",
          },
          highlightKeys: ["dec-f", "dec-2", "dec-0"],
        },
        {
          id: "e4_t1",
          type: "task",
          theme: "cern-lab",
          mood: "cern",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Işın Kalibrasyonu · Mod [2]", en: "Beam Calibration · Mode [2]" },
          dialogue: {
            tr: "Proton ışını 100 ÷ 3 frekansında titreşiyor! Sistem tam 2 ondalık istiyor—üstteki Ondalık anahtarını '2'ye al ve sonucu gönder!",
            en: "The proton beam is oscillating at 100 ÷ 3! The relay demands exactly 2 decimal places—flip the Decimal switch to '2' and transmit!",
          },
          items: [
            { label: { tr: "Işın Denklemi", en: "Beam Ratio" }, amountText: { tr: "100 ÷ 3", en: "100 ÷ 3" } },
            { label: { tr: "Gerekli Ondalık Modu", en: "Required Decimal Switch" }, amountText: { tr: "[2] Hane", en: "[2] Places" } },
          ],
          ask: {
            tr: "Ondalık anahtarını [2] yap, 100 ÷ 3 = (33,33) sonucunu gönder.",
            en: "Set Decimal switch to [2], compute 100 ÷ 3 = (33.33), and transmit.",
          },
          requiredDecMode: "2",
          expected: 33.33,
          tolerance: 0.001,
          timeLimit: 32,
          submitLabelKey: "btnSubmitCern",
          highlightKeys: ["dec-2", "key-div"],
          hint: {
            tr: "Önce ekranın altından [2] düğmesine tıkla. Sonra 100 ÷ 3 = → 33,33!",
            en: "First click [2] on the Decimal switch under the LCD. Then 100 ÷ 3 = → 33.33!",
          },
          successReply: {
            tr: "33,33! Işın hizalandı! İnanamıyorum, bir bakkal makinesi LHC'yi tutuyor!",
            en: "33.33! Beam aligned! Unbelievable—a corner-shop calculator is holding the LHC!",
          },
          wrongReply: {
            tr: "Olmadı! Ondalık anahtarı [2] konumunda olmalı ve sonuç 33,33 çıkmalı!",
            en: "Rejected! Make sure Decimal is at [2] and the screen reads 33.33!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e4_t2",
          type: "task",
          theme: "cern-lab",
          mood: "cern",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Manyetik Kalkan · Mod [0]", en: "Magnetic Shield · Mode [0]" },
          dialogue: {
            tr: "Kalkan bobinleri küsurat kabul etmiyor! Ondalık anahtarını '0' (tam sayı) konumuna getir ve 1.750 ÷ 4 değerini yuvarlanmış tam sayı olarak yolla!",
            en: "The shield coils reject fractions! Flip the Decimal switch to '0' (integer) and transmit 1,750 ÷ 4 rounded whole!",
          },
          items: [
            { label: { tr: "Bobin Dağılımı", en: "Coil Split" }, amountText: { tr: "1.750 ÷ 4", en: "1,750 ÷ 4" } },
            { label: { tr: "Gerekli Ondalık Modu", en: "Required Decimal Switch" }, amountText: { tr: "[0] Tam Sayı", en: "[0] Integer" } },
          ],
          ask: {
            tr: "Ondalık anahtarını [0] yap, 1.750 ÷ 4 = (438) sonucunu gönder.",
            en: "Set Decimal switch to [0], compute 1,750 ÷ 4 = (438), and transmit.",
          },
          requiredDecMode: "0",
          expected: 438,
          timeLimit: 28,
          submitLabelKey: "btnSubmitCern",
          highlightKeys: ["dec-0", "key-div"],
          hint: {
            tr: "Ondalık anahtarından [0] seç. 1750 ÷ 4 = → 437,5 otomatik 438'e yuvarlanır!",
            en: "Select [0] on the Decimal switch. 1750 ÷ 4 = → 437.5 automatically rounds to 438!",
          },
          successReply: {
            tr: "438 bobin aktif! Manyetik kalkan yeşil yakıyor!",
            en: "438 coils engaged! Magnetic shield is green!",
          },
          wrongReply: {
            tr: "Anahtarı [0] yapmayı unutma! 1750 ÷ 4 tam sayı olarak 438 etmeli!",
            en: "Don't forget to flip to [0]! 1750 ÷ 4 must round to 438!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e4_t3",
          type: "task",
          theme: "cern-lab",
          mood: "cern",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Çekirdek Soğutma · Mod [F] & %", en: "Core Cooling · Mode [F] & %" },
          dialogue: {
            tr: "Anahtarı [F] (serbest) moduna geri al! 4.500 MW çekirdek gücünü acilen %12 düşür (4.500 − 12 %), yoksa eriyecek!",
            en: "Flip back to [F] (floating)! Drop the 4,500 MW core load by 12% immediately (4,500 − 12 %) or it melts!",
          },
          items: [
            { label: { tr: "Çekirdek Gücü", en: "Core Power" }, amountText: { tr: "4.500 MW", en: "4,500 MW" } },
            { label: { tr: "Güç Azaltma", en: "Power Throttle" }, amountText: { tr: "−%12", en: "−12%" } },
          ],
          ask: {
            tr: "Ondalık [F] iken 4.500 − 12 % (3.960) sonucunu gönder.",
            en: "With Decimal on [F], transmit 4,500 − 12 % (3,960).",
          },
          requiredDecMode: "F",
          expected: 3960,
          timeLimit: 26,
          submitLabelKey: "btnSubmitCern",
          highlightKeys: ["dec-f", "key-pct"],
          bonusKeys: ["percent"],
          hint: {
            tr: "Önce [F] seç, sonra 4500 − 12 [%] → 3.960!",
            en: "Flip to [F], then type 4500 − 12 [%] → 3,960!",
          },
          successReply: {
            tr: "3.960 MW! Sıcaklık düşüyor—ama dur, dedektörlerde anomali var!",
            en: "3,960 MW! Temps dropping—wait, detectors are spiking!",
          },
          wrongReply: {
            tr: "Anahtarı [F] yap ve 4500 − 12 % hesapla!",
            en: "Switch to [F] and punch 4500 − 12 %!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e4_t4",
          type: "task",
          theme: "cern-lab",
          mood: "cern",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Çift Dedektör Akısı · MRC", en: "Dual Detector Flux · MRC" },
          dialogue: {
            tr: "Kuzey Dedektörü (320 × 15) pozitif akı veriyor, Güney Dedektörü (140 × 10) ters akı çekiyor! Hafızayla net akıyı çıkar!",
            en: "North Detector pulses positive (320 × 15), South pulls negative (140 × 10)! Use memory to send the net flux!",
          },
          items: [
            { label: { tr: "Kuzey (M+)", en: "North (M+)" }, amountText: { tr: "320 × 15", en: "320 × 15" } },
            { label: { tr: "Güney (M−)", en: "South (M−)" }, amountText: { tr: "−(140 × 10)", en: "−(140 × 10)" } },
          ],
          ask: {
            tr: "M+, M− ve MRC ile net akıyı (3.400) gönder.",
            en: "Use M+, M−, and MRC to transmit the net flux (3,400).",
          },
          resetCalc: "clear-all-mem",
          expected: 3400,
          timeLimit: 32,
          submitLabelKey: "btnSubmitCern",
          highlightKeys: ["key-m-plus", "key-m-minus", "key-mrc"],
          bonusKeys: ["m-plus", "m-minus", "mrc"],
          hint: {
            tr: "320 × 15 [M+] (4.800) → 140 × 10 [M−] (−1.400) → [MRC] = 3.400!",
            en: "320 × 15 [M+] (4,800) → 140 × 10 [M−] (−1,400) → [MRC] = 3,400!",
          },
          successReply: {
            tr: "3.400! Ama… tünelin ortasındaki ışık bükülüyor! Bu imkânsız!",
            en: "3,400! Wait… light is bending in the middle of the tunnel! That's impossible!",
          },
          wrongReply: {
            tr: "4.800'den 1.400 çıkaracağız! M+, M−, MRC ile 3.400!",
            en: "We need 4,800 minus 1,400! Hit M+, M−, MRC for 3,400!",
          },
          onSuccessEffect: "glitch",
        },
        {
          id: "e4_outro",
          type: "cutscene",
          theme: "spacetime-rift",
          mood: "spacetime",
          sfx: "glitch",
          portrait: "void",
          badge: { tr: "ANOMALİ · UZAY-ZAMAN YIRTILDI", en: "ANOMALY · SPACETIME TORN" },
          speaker: { tr: "CERN Tüneli · Olay Ufku", en: "CERN Tunnel · Event Horizon" },
          role: { tr: "Kritik Seviye", en: "Critical Breach" },
          text: {
            tr: "Bir anda laboratuvardaki kahve kupaları havalandı, duvar saati geriye doğru dönmeye başladı! Tünelin ortasında parlayan bir mikro kara delik açıldı. Havada mahalle bakkalından kopup gelmiş kasa fişleri süzülüyor! Dr. Elena haykırıyor: 'Uzay-zaman yırtıldı! Dengeleme Kapsülü'nü uzaya fırlatmalıyız—tek umudumuz o hesap makinesi!'",
            en: "Suddenly coffee mugs float off desks and wall clocks spin backward! A glowing micro black hole tears open in the tunnel—and paper receipts from your corner shop drift through zero gravity! Dr. Elena shouts: 'Spacetime is ripping apart! We must launch the Stabilizer Capsule into orbit—your calculator is our only hope!'",
          },
        },
      ],
    },

    /* =====================================================================
       EPISODE 5: UZAY-ZAMAN FİŞİ / THE SPACETIME RECEIPT
       Teaches: Full mastery gauntlet + BIG PLOT TWIST #2 (Master = Future You!)
       ===================================================================== */
    {
      id: "ep5",
      num: 5,
      defaultTheme: "spacetime-rift",
      keysTaught: ["MU", "KDV+", "+/−", "MRC", "00", "TÜMÜ"],
      title: {
        tr: "Bölüm 5: Uzay-Zaman Fişi",
        en: "Episode 5: The Spacetime Receipt",
      },
      subtitle: {
        tr: "Kara delik, yörünge fırlatması ve 1 kuruşluk paradoksun sırrı.",
        en: "A micro black hole, an orbital launch, and the truth behind the one-cent paradox.",
      },
      location: {
        tr: "Olay Ufku · Zaman Dışı",
        en: "Event Horizon · Out of Time",
      },
      scenes: [
        {
          id: "e5_t1",
          type: "task",
          theme: "spacetime-rift",
          mood: "spacetime",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Fırlatma #1 · Yakıt Marjı (MU)", en: "Launch #1 · Fuel Margin (MU)" },
          dialogue: {
            tr: "Kapsülün çekirdek yakıtı 640 ton, ama kara deliğin çekimi %20 kayıp yaratıyor! Net %20 güvenlik marjlı toplam yakıtı MU ile hesapla!",
            en: "Core fuel is 640 tons, but the singularity drains a 20% margin! Use MU to calculate the total required fuel!",
          },
          items: [
            { label: { tr: "Çekirdek Yakıt", en: "Base Fuel" }, amountText: { tr: "640 ton", en: "640 tons" } },
            { label: { tr: "Çekim Marjı", en: "Gravity Margin" }, amountText: { tr: "%20 (MU)", en: "20% (MU)" } },
          ],
          ask: {
            tr: "640 ÷ 20 MU ile toplam yakıtı (800) onayla.",
            en: "Compute total fuel with 640 ÷ 20 MU (800) and confirm.",
          },
          expected: 800,
          timeLimit: 28,
          submitLabelKey: "btnSubmitSpace",
          highlightKeys: ["key-div", "key-mu"],
          bonusKeys: ["mu"],
          hint: {
            tr: "640 ÷ 20 [MU] → 800 ton!",
            en: "640 ÷ 20 [MU] → 800 tons!",
          },
          successReply: {
            tr: "800 ton yakıt yüklendi! Motorlar ateşlenmeye hazır!",
            en: "800 tons loaded! Thrusters priming!",
          },
          wrongReply: {
            tr: "Kara delik büyüyor! 640 ÷ 20 MU bas!",
            en: "The rift is widening! Hit 640 ÷ 20 MU!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e5_t2",
          type: "task",
          theme: "spacetime-rift",
          mood: "spacetime",
          portrait: "elena",
          speaker: { tr: "Dr. Elena Vance", en: "Dr. Elena Vance" },
          role: { tr: "Fırlatma #2 · Atmosfer Vergisi (KDV+)", en: "Launch #2 · Orbital Tax (TAX+)" },
          dialogue: {
            tr: "Atmosfer çıkışı tam %20 enerji vergisi kesiyor! 1.500 birimlik itiş gücüne %20 (KDV+) ekle—hızlı!",
            en: "Atmospheric drag levies an exact 20% energy tax! Add 20% (TAX+) to 1,500 thrust units—hurry!",
          },
          items: [
            { label: { tr: "Taban İtiş Gücü", en: "Base Thrust" }, amountText: { tr: "1.500 kN", en: "1,500 kN" } },
            { label: { tr: "Atmosfer Payı", en: "Drag Tax" }, amountText: { tr: "+%20 (KDV+)", en: "+20% (TAX+)" } },
          ],
          ask: {
            tr: "KDV %20 seçiliyken 1.500 KDV+ (1.800) değerini onayla.",
            en: "With TAX at 20%, enter 1500 TAX+ (1,800) and confirm.",
          },
          expected: 1800,
          timeLimit: 24,
          submitLabelKey: "btnSubmitSpace",
          highlightKeys: ["kdv-20", "key-kdv-plus"],
          bonusKeys: ["kdv-plus"],
          hint: {
            tr: "Üstten [%20] seçili olsun. 1500 yaz ve [KDV+] bas → 1.800!",
            en: "Make sure [20%] is active. Type 1500 and hit [TAX+] → 1,800!",
          },
          successReply: {
            tr: "1.800 kN kilitlendi! Kapsül fırlatma rampasında titriyor!",
            en: "1,800 kN locked! Capsule shaking on the launch rail!",
          },
          wrongReply: {
            tr: "KDV anahtarını %20'ye getir, 1500 yazıp KDV+ bas!",
            en: "Flip TAX to 20%, type 1500, hit TAX+!",
          },
          onSuccessEffect: "correct",
        },
        {
          id: "e5_t3",
          type: "task",
          theme: "spacetime-rift",
          mood: "spacetime",
          portrait: "void",
          speaker: { tr: "Olay Ufku Sensörü", en: "Event Horizon Telemetry" },
          role: { tr: "Fırlatma #3 · Ters Vektör (+/− & MRC)", en: "Launch #3 · Anti-Gravity (+/− & MRC)" },
          dialogue: {
            tr: "UYARI: Kara delik −950 negatif çekim uyguluyor! −950'yi hafızaya at (M+), +1.450 itiş ekle (M+), 300 sürtünme düş (M−) ve MRC ile net vektörü kilitle!",
            en: "ALERT: Singularity pulls at −950! Store −950 (M+), add +1,450 thrust (M+), subtract 300 drag (M−), and lock net vector with MRC!",
          },
          items: [
            { label: { tr: "Kara Delik Çekimi (M+)", en: "Singularity Pull (M+)" }, amountText: { tr: "−950", en: "−950" } },
            { label: { tr: "Kapsül İtişi (M+)", en: "Capsule Thrust (M+)" }, amountText: { tr: "+1.450", en: "+1,450" } },
            { label: { tr: "Uzay Sürtünmesi (M−)", en: "Drift Drag (M−)" }, amountText: { tr: "−300", en: "−300" } },
          ],
          ask: {
            tr: "+/−, M+, M− ve MRC ile net vektörü (200) onayla.",
            en: "Use +/−, M+, M−, and MRC to confirm the net vector (200).",
          },
          resetCalc: "clear-all-mem",
          expected: 200,
          timeLimit: 32,
          submitLabelKey: "btnSubmitSpace",
          highlightKeys: ["key-sign", "key-m-plus", "key-m-minus", "key-mrc"],
          bonusKeys: ["sign", "mrc"],
          hint: {
            tr: "950 [+/−] [M+] → 1450 [M+] → 300 [M−] → [MRC] = 200!",
            en: "950 [+/−] [M+] → 1450 [M+] → 300 [M−] → [MRC] = 200!",
          },
          successReply: {
            tr: "Net vektör +200! Yırtığın içinden… birisi yürüyerek çıkıyor?!",
            en: "Net vector +200! Wait… someone is stepping OUT of the rift?!",
          },
          wrongReply: {
            tr: "−950 + 1450 − 300 = 200 olmalı! MRC'ye iki kez basıp sıfırla ve tekrar dene.",
            en: "−950 + 1450 − 300 must equal 200! Double-tap MRC to clear and retry.",
          },
          onSuccessEffect: "glitch",
        },
        {
          id: "e5_twist2",
          type: "master",
          isTwist: true,
          theme: "spacetime-rift",
          mood: "master",
          portrait: "master_future",
          quote: {
            tr: "Beni hâlâ tanıyamadın mı evlat? Aynaya 40 yıl sonrasından bakıyorsun… BEN, SENİN GELECEKTEKİ HALİNİM! Salı akşamı dükkândaki o 0,01 kuruşluk açığı ve Bay Gölge'nin zarfını bizzat ben kurguladım. Sıradan bir kasiyer olarak kalsaydın, bugün 12 haneli bu makineyle evreni kurtaracak ustalığa asla erişemeyecektin.",
            en: "Still don't recognize me, kid? You're looking into a mirror 40 years ahead… I AM YOUR FUTURE SELF! I staged that 0.01-cent discrepancy and sent Mr. Shade to your Tuesday counter. Had you stayed an ordinary clerk, you would never have forged the mastery needed to save spacetime today.",
          },
          lesson: {
            tr: "SON GÖREV: Zaman büküldüğünde süper bilgisayarlar ağlar, ama güneş enerjili 12 haneli bir esnaf makinesi asla eğilmez. Şimdi son koordinatı hesapla ve o meşhur 0,01 kuruşu ekleyip döngüyü kapat!",
            en: "FINAL MISSION: When spacetime bends, supercomputers weep—yet a 12-digit solar shop calculator never yields. Compute the final coordinate, add that fateful 0.01 cent, and close the loop!",
          },
          highlightKeys: ["key-00", "key-dot", "key-eq"],
        },
        {
          id: "e5_t4_final",
          type: "task",
          theme: "spacetime-rift",
          mood: "spacetime",
          portrait: "master_future",
          speaker: { tr: "Usta (Gelecekteki Sen)", en: "The Master (Future You)" },
          role: { tr: "SON FIRLATMA KODU · ZAMANA KARŞI", en: "FINAL LAUNCH CODE · BEAT THE RIFT" },
          dialogue: {
            tr: "Son hesap evlat! Yörünge koordinatı: 12.000 × 10 + 120… ve zaman döngüsünü mühürlemek için o meşhur + 0,01 kuruşu ekle! Fırlat!",
            en: "One last calculation! Orbital lock: 12,000 × 10 + 120… plus that fateful + 0.01 cent to seal the loop! Launch it!",
          },
          items: [
            { label: { tr: "1. Yörünge Çarpanı", en: "1. Orbital Factor" }, amountText: { tr: "12.000 × 10", en: "12,000 × 10" } },
            { label: { tr: "2. 120D Rezonansı", en: "2. 120D Resonance" }, amountText: { tr: "+ 120", en: "+ 120" } },
            { label: { tr: "3. Kader Kuruşu", en: "3. The Fateful Cent" }, amountText: { tr: "+ 0,01", en: "+ 0.01" } },
          ],
          ask: {
            tr: "Ondalık [F] iken 12.000 × 10 + 120 + 0,01 = 120.120,01 kodunu onayla!",
            en: "With Decimal on [F], compute 12,000 × 10 + 120 + 0.01 = 120,120.01 and launch!",
          },
          requiredDecMode: "F",
          expected: 120120.01,
          tolerance: 0.0005,
          timeLimit: 28,
          submitLabelKey: "btnSubmitSpace",
          highlightKeys: ["key-00", "key-dot", "key-eq"],
          bonusKeys: ["00"],
          hint: {
            tr: "12000 × 10 + 120 + 0,01 = → 120.120,01 ve Fırlatmayı Onayla (Space)!",
            en: "12000 × 10 + 120 + 0.01 = → 120,120.01 and press Confirm Launch (Space)!",
          },
          successReply: {
            tr: "120.120,01!! KAPSÜL FIRLADI!! KARA DELİK KAPANIYOR!!",
            en: "120,120.01!! LAUNCH CONFIRMED!! THE SINGULARITY IS COLLAPSING!!",
          },
          wrongReply: {
            tr: "Zaman dağılıyor! Dikkatli ol: 12000 × 10 = 120000, + 120 = 120120, + 0,01 = 120120,01!",
            en: "Time is unraveling! Focus: 12000 × 10 = 120000, + 120 = 120120, + 0.01 = 120120.01!",
          },
          onSuccessEffect: "launch",
        },
        {
          id: "e5_epilogue",
          type: "cutscene",
          theme: "shop-day",
          mood: "shop",
          sfx: "cashRegister",
          portrait: "clara",
          badge: { tr: "EPİLOG · SALI SABAHI 08:00", en: "EPILOGUE · TUESDAY 08:00 AM" },
          speaker: { tr: "Mahalle Bakkalı · Yeni Başlangıç", en: "The Corner Shop · Full Circle" },
          role: { tr: "Evreni Kurtaran Kasiyer", en: "The Clerk Who Saved Spacetime" },
          text: {
            tr: "Göz kamaştıran altın bir ışık… Gözlerini açtığında güneş yüzüne vuruyor. Salı sabahı saat 08:00. Mahalle bakkalındasın, taze ekmek kokuyor. Emine Teyze kapıdan gülümseyerek giriyor. Kasayı kontrol ediyorsun: tam 0,00 açık. Sadece tezgâhın kenarında yıldız tozlu sıcak bir kasa fişi duruyor: 'GENEL TOPLAM (GT): EVREN KURTARILDI — 0,01 ÖDENDİ.'",
            en: "A blinding flash of gold… You blink awake to warm sunlight. Tuesday, 8:00 AM. You're back behind the corner shop counter; fresh bread fills the air as Mrs. Clara smiles through the door. You check the drawer: variance 0.00. Resting beside your ESNAF 120D is a single warm receipt dusted with starlight: 'GRAND TOTAL (GT): UNIVERSE SAVED — 0.01 PAID IN FULL.'",
          },
        },
      ],
    },
  ];

  const api = { EPISODES };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    global.EsnafStory = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
