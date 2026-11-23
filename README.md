# Esnaf Hesap Makinesi

Dükkanlarda ve esnaf kasalarında kullanılan klasik **12 haneli masaüstü hesap makinesi** deneyimini doğrudan tarayıcıya getiren, saf HTML, CSS ve JavaScript ile yazılmış hafif bir web uygulaması. Herhangi bir derleme (build) adımı gerektirmez; doğrudan **GitHub Pages** üzerinden açılabilir.

## Özellikler

- **Klasik Esnaf Tuş Dizilimi:** Büyük `+` tuşu, `00` çift sıfır tuşu, tek hane silme (`▶`), `CE` ve `AC`.
- **GT (Genel Toplam):** Her `=` sonucunu otomatik biriktirir. İlk basışta toplamı gösterir, ikinci basışta sıfırlar.
- **MU (Kâr Marjı):** Maliyetten hedeflenen kâr marjına göre satış fiyatı (`100 ÷ 20 MU` → `125`) veya kâr oranı (`150 − 100 MU` → `%50`) hesabı.
- **KDV+ / KDV−:** Türkiye KDV oranları (**%1, %10, %20**) için anında KDV ekleme ve KDV hariç tutar bulma.
- **Yüzde (`%`) Hesapları:** Zam (`200 + 15 %` → `230`), iskonto (`200 − 15 %` → `170`) ve oran (`200 × 15 %` → `30`).
- **Hafıza (`M+`, `M−`, `MRC`):** İşlem sonuçlarını hafızada toplama, çıkarma, çağırma ve temizleme.
- **Ondalık Anahtarı (`F · 2 · 0`):** Serbest ondalık, 2 kuruş yuvarlaması veya tam sayı modu.
- **Kasa Fişi (İşlem Geçmişi):** Yapılan işlemleri fiş formatında listeler; herhangi bir satıra tıklayarak sonucu ekrana geri alabilir veya tüm fişi kopyalayabilirsiniz.
- **Klavye Desteği ve Tuş Sesi:** Fiziksel klavyeden rakamlar, `+ - * /`, `Enter`, `%`, `Backspace`, `Delete` ve `Esc` ile tam uyum; açılıp kapatılabilen hafif mekanik tuş tıklama sesi.

## GitHub Pages ile Yayınlama

1. GitHub'da bu reponun **Settings → Pages** bölümüne gidin.
2. **Source** altında **Deploy from a branch** seçeneğini seçin.
3. Dal olarak `main`, klasör olarak `/ (root)` seçip **Save** butonuna tıklayın.
4. Kısa süre içinde `https://kaansavukduran.github.io/hesapmakinesi/` adresinde yayına alınacaktır.