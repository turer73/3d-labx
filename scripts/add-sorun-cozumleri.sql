-- Sorun Çözümleri Makaleleri - Batch Insert
-- 5 yeni makale: Katman Kayması, Under-extrusion, Over-extrusion, Ghosting, Elephant Foot

-- 1. Katman Kayması (Layer Shifting)
INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status, language)
VALUES (
  '3D Baskıda Katman Kayması (Layer Shifting): Nedenleri ve Kesin Çözümler',
  'Baskınız yarıda kayıp merdiven gibi mi görünüyor? Katman kaymasının 7 ana nedeni ve her biri için kanıtlanmış çözüm adımları. Kayış gerginliğinden motor akımına, hız ayarından mekanik kontrole kadar eksiksiz rehber.',
  '## Hızlı Çözüm (TL;DR)

Katman kayması genellikle **gevşek kayışlar**, **aşırı baskı hızı** veya **motor sorunları** kaynaklıdır. İlk adım olarak X ve Y kayışlarınızı kontrol edin, baskı hızını %20 düşürün ve motorların aşırı ısınıp ısınmadığına bakın.

---

## Katman Kayması Nedir?

Katman kayması (Layer Shifting), 3D baskı sırasında yazıcının baskı kafasının olması gereken konumdan sapması sonucu oluşan bir hatadır. Baskı, belirli bir katmandan sonra X veya Y ekseninde kaymış gibi görünür — sanki biri modeli yandan itmiş gibi.

Bu sorun hem estetik hem yapısal olarak baskıyı kullanılamaz hale getirir.

### Belirtileri
- Baskının ortasından itibaren katmanlar yana kayar
- Merdiven basamağı görünümü oluşur
- Genellikle tek eksende (X veya Y) kayma olur
- Bazen baskı tamamen sola/sağa kayar ve devam eder

---

## 7 Temel Neden ve Çözümleri

### 1. 🔩 Gevşek Kayışlar

**En yaygın neden.** Kayışlar zamanla gevşer ve motor hareketi baskı kafasına tam iletilmez.

**Kontrol:** Kayışa parmağınızla bastırın. Eğer 5mm''den fazla hareket ediyorsa gevşektir.

**Çözüm Adımları:**
1. Yazıcıyı kapatın
2. X ve Y ekseni kayışlarını bulun
3. Gergi vidasını sıkarak kayışı gerginleştirin
4. Kayış parmakla çekildiğinde "tıng" sesi çıkarmalı
5. Aşırı sıkmayın — kayış kopabilir veya rulmanlar zorlanabilir

**Yazıcıya Göre Not:**
- **Ender 3:** Kayış gergisi alüminyum upgrade ile değiştirilebilir
- **Bambu Lab:** Kayışlar fabrikada ayarlanmıştır, nadiren sorun olur
- **Prusa:** Kayış gerginliği firmware üzerinden ölçülebilir

---

### 2. ⚡ Aşırı Baskı Hızı

Çok hızlı baskıda motor adımları kaçırabilir. Özellikle ağır direct drive hotend''lerde sorun büyür.

**Çözüm Adımları:**
1. Baskı hızını %20-30 düşürün
2. İvmelenme (acceleration) değerini 500-1000 mm/s² yapın
3. Jerk/junction deviation değerlerini düşürün
4. Sorun devam ederse hızı 40-50 mm/s''e indirin ve artırarak test edin

**Slicer Ayarları:**
- **Cura:** Print Speed → 50 mm/s, Acceleration → 500 mm/s²
- **PrusaSlicer:** Speed → Perimeters: 45, Infill: 60
- **OrcaSlicer:** Speed → Outer wall: 40, Inner wall: 60

---

### 3. 🌡️ Motor ve Sürücü Aşırı Isınması

Step motor sürücüleri aşırı ısınırsa termal koruma devreye girer ve motor adım kaçırır.

**Belirtiler:** Baskının ilerleyen saatlerinde kayma başlar, ilk katmanlar normal görünür.

**Çözüm Adımları:**
1. Anakart üzerindeki motor sürücülerini kontrol edin (parmakla dokunun — yakıcı sıcaksa sorun budur)
2. Anakart fanının çalıştığını kontrol edin
3. Anakart kasası havalandırmasını iyileştirin
4. TMC2209 gibi modern sessiz sürücülere geçiş yapın (Ender 3 için)

---

### 4. 🔌 Kablo Takılması veya Sürtünmesi

Baskı kafası kabloları bir yere takılırsa hareket engellenir ve kayma oluşur.

**Çözüm Adımları:**
1. Baskı sırasında kabloları gözlemleyin
2. Kablo kanalı veya kablo zinciri takın
3. Kabloların çerçeveye veya modele sürtmediğinden emin olun
4. Kabloları zip-tie ile düzenleyin ama çok sıkmayın

---

### 5. 🪨 Mekanik Engel veya Yabancı Cisim

Raylarda veya kayış yolunda bir engel varsa kafa takılır.

**Çözüm Adımları:**
1. Yazıcıyı kapatın ve kafayı elle X/Y''de hareket ettirin
2. Herhangi bir tutukluk hissediyorsanız rayları temizleyin
3. Lineer raylara uygun yağ (beyaz lityum gres) sürün
4. Vida veya somun düşmüş mü kontrol edin

---

### 6. ⚙️ Motor Akım Yetersizliği (Vref Ayarı)

Motor sürücü akımı (Vref) düşükse motor yeterli tork üretemez.

**Çözüm Adımları:**
1. Anakart üzerindeki sürücü potansiyometrelerini bulun
2. Multimetre ile Vref değerini ölçün
3. Tipik değerler:
   - A4988: 0.6-0.9V
   - TMC2208/2209: 0.8-1.2V
4. Küçük tornavida ile potansiyometreyi saat yönünde çevirerek artırın
5. Çok artırmayın — motor aşırı ısınır

**⚠️ Uyarı:** Bambu Lab ve Prusa kullanıcıları bu ayarı yapmamalıdır, firmware otomatik yönetir.

---

### 7. 📐 Çarpışma Algılama Sorunu (Bambu Lab)

Bambu Lab yazıcılarda "vibration compensation" veya çarpışma algılama bazen yanlış tetiklenir.

**Çözüm Adımları:**
1. Bambu Studio''da "Flow Dynamics Calibration" yapın
2. "Vibration Compensation" değerlerini kontrol edin
3. Bambu Handy App > Cihaz Ayarları > Çarpışma Algılama kapatın (test için)
4. Sorun düzelirse, tekrar açıp hassasiyeti ayarlayın

---

## Önleme İpuçları

✅ Her 100 saat baskıda kayış gerginliğini kontrol edin
✅ Baskı hızını modele göre ayarlayın (ince detaylar = düşük hız)
✅ Motor sürücü fanının temiz ve çalışır durumda olduğundan emin olun
✅ Kabloları düzenli tutun
✅ Rayları ayda bir temizleyin ve yağlayın

---

## Sıkça Sorulan Sorular

**S: Katman kayması hep aynı yükseklikte mi olur?**
Her zaman değil. Kayış gevşekliğinde rastgele olur, kablo takılmasında belirli bir yükseklikte tekrarlar.

**S: Tek eksende kayma var, diğeri normal. Neden?**
Sorun sadece kayan eksenin kayışı, motoru veya kablolarındadır. Diğer eksene dokunmanıza gerek yok.

**S: Katman kayması ve Z-wobble aynı şey mi?**
Hayır. Katman kayması X/Y ekseninde olur. Z-wobble ise Z eksenindeki dalgalanmadır ve farklı nedenleri vardır.

---

## İlgili Rehberler
- [3D Yazıcı Bakımı: Kapsamlı Rehber](/rehberler/3d-yazici-bakimi-kapsamli-rehber-mkx2ntzt)
- [Nozzle Tıkanıklığı Çözüm Rehberi](/sorun-cozumleri/3d-yazici-nozzle-tikanikligi-kabustan-kurtulmanin-kesin-yollari-2026-rehberi-mkyiw0om)
- [İlk Katman Yapışma Sorunu](/sorun-cozumleri/3d-baskida-i-lk-katman-yapisma-sorununa-kokten-cozum-rehberi-mkxazxot)',
  '3d-baskida-katman-kaymasi-layer-shifting-nedenleri-ve-kesin-cozumler',
  'sorun-cozumleri',
  'rehber',
  'https://www.simplify3d.com/wp-content/uploads/2019/04/Layer-Shifting.jpg',
  1, 0, 'published', 'tr'
);

-- 2. Yetersiz Ekstrüzyon (Under-extrusion)
INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status, language)
VALUES (
  '3D Baskıda Yetersiz Ekstrüzyon (Under-Extrusion): Tanı ve Çözüm Rehberi',
  'Duvarlar ince mi kalıyor, infill kopuk mu görünüyor? Yetersiz ekstrüzyonun 8 ana nedeni: nozzle tıkanıklığından E-step kalibrasyonuna, sıcaklık ayarından filament kalitesine kadar adım adım çözüm.',
  '## Hızlı Çözüm (TL;DR)

Yetersiz ekstrüzyon genellikle **kısmi nozzle tıkanıklığı**, **düşük sıcaklık** veya **yanlış E-step değeri** kaynaklıdır. İlk adım: nozzle sıcaklığını 5-10°C artırın. Düzelmezse E-step kalibrasyonu yapın.

---

## Yetersiz Ekstrüzyon Nedir?

Yetersiz ekstrüzyon (Under-extrusion), yazıcının olması gerekenden **daha az filament** çıkarması durumudur. Sonuç: ince duvarlar, görünür boşluklar, zayıf katman yapışması ve kırılgan baskılar.

### Belirtileri
- Duvarlar olması gerekenden ince
- İnfill hatları arasında boşluk var
- Katmanlar arası yapışma zayıf (elle koparılabilir)
- Üst yüzey tam kapanmıyor (delikli görünüm)
- Baskı genel olarak zayıf ve kırılgan

---

## 8 Temel Neden ve Çözümleri

### 1. 🔥 Düşük Nozzle Sıcaklığı

Sıcaklık yetersizse filament tam eriyemez ve akış azalır.

**Çözüm Adımları:**
1. Nozzle sıcaklığını **5-10°C artırın**
2. Sıcaklık kulesi (temp tower) testi yapın
3. Filament üreticisinin önerdiği aralığın üst sınırını deneyin

**Filament Bazlı Öneriler:**
| Filament | Minimum | Önerilen | Maksimum |
|----------|---------|----------|----------|
| PLA | 190°C | 205-215°C | 230°C |
| PETG | 220°C | 235-245°C | 260°C |
| ABS | 220°C | 240-250°C | 270°C |
| TPU | 210°C | 225-235°C | 250°C |

---

### 2. 🧹 Kısmi Nozzle Tıkanıklığı

Nozzle tamamen tıkanmamış ama içinde kalıntı var. Filament geçiyor ama akış kısıtlı.

**Belirtiler:** Bazen normal, bazen az ekstrüzyon. Düzensiz hatlar.

**Çözüm Adımları:**
1. **Cold Pull (Atom Çekme):** Nozzle''ı 250°C''ye ısıtın → filament itin → 90°C''ye düşürün → hızla çekin
2. 3-5 kez tekrarlayın (çıkan filament temiz ve sivriyse tıkanıklık gitti)
3. Temizleme iğnesi (0.3-0.4mm) ile nozzle ucunu temizleyin
4. Sorun devam ederse nozzle değiştirin

---

### 3. ⚙️ Yanlış E-step Kalibrasyonu

Extruder''ın motor başına ne kadar filament itmesi gerektiğini tanımlayan E-step değeri yanlışsa sürekli az/çok ekstrüzyon olur.

**E-step Kalibrasyonu Adımları:**
1. Filamenti nozzle girişinden 120mm yukarıda işaretleyin
2. Terminalde: `G1 E100 F100` (100mm filament it komutu)
3. Kalan mesafeyi ölçün. Örnek: 15mm kaldıysa 105mm itmiş demek
4. Mevcut E-step değerini okuyun: `M503` → `M92` satırına bakın
5. Yeni değer = Mevcut E-step × (100 / Gerçek ölçüm)
6. Kaydedin: `M92 E[yeni_değer]` → `M500`

**Örnek Hesaplama:**
- Mevcut E-step: 93
- İstenen: 100mm, Gerçek: 95mm
- Yeni = 93 × (100/95) = **97.89**

---

### 4. 📏 Yanlış Filament Çapı Ayarı

Slicer''da filament çapı 2.85mm ayarlıysa ama 1.75mm filament kullanıyorsanız, yazıcı çok az filament iter.

**Çözüm:**
1. Slicer''da filament çapını kontrol edin
2. **Cura:** Settings → Material → Diameter: 1.75
3. **PrusaSlicer:** Filament Settings → Filament → Diameter: 1.75
4. Dijital kumpas ile gerçek filament çapını ölçün (3 farklı noktadan)
5. Ortalama değeri slicer''a girin (örn: 1.73mm)

---

### 5. 🦷 Aşınmış Extruder Dişlisi

Extruder dişlisi zamanla aşınır ve filamenti kavrayamaz hale gelir.

**Belirtiler:**
- Extruder''dan "tık-tık" sesi gelir
- Filament üzerinde ezilme/yontulma izleri
- Filament tozu birikimi

**Çözüm Adımları:**
1. Extruder dişlisini çıkarın ve inceleyin
2. Dişler düzleşmişse yeni dişli takın
3. Çelik dişli yerine **hardened steel** veya **dual-gear** extruder upgrade yapın
4. Dişli basıncını (tension) kontrol edin — çok sıkı filamenti ezer, gevşek kavrayamaz

---

### 6. 🔄 Bowden Tube Sorunu

Bowden tube''da boşluk, bükülme veya aşınma varsa filament direnci artar.

**Çözüm Adımları:**
1. Bowden tube''u çıkarın ve düz bir yüzeyde kontrol edin
2. İç çapın düzgün olduğunu kontrol edin (filament rahatça kaymalı)
3. Uçları temiz ve düz kesilmiş olmalı — **Capricorn tube** kesici kullanın
4. Tube hotend''e tam oturmalı — boşluk tıkanıklığa yol açar
5. Capricorn PTFE tube''a geçiş yapın (daha dar tolerans, daha az sürtünme)

---

### 7. 💨 Yetersiz Soğutma (Heat Creep)

Hotend üst kısmının aşırı ısınması filamenti erken eritir ve tıkanıklık yaratır.

**Belirtiler:** Uzun baskılarda sorun başlar. İlk 1-2 saat normal, sonra azalır.

**Çözüm Adımları:**
1. Hotend fanının (küçük fan) çalışıp çalışmadığını kontrol edin
2. Heat break''in temiz ve düzgün takılı olduğunu doğrulayın
3. Termal macun yenileyin
4. All-metal hotend kullanıyorsanız retraction mesafesini 1-2mm''de tutun
5. Ortam sıcaklığı çok yüksekse (35°C+) ek fan ekleyin

---

### 8. 🌀 Flow Rate Düşüklüğü

Slicer''daki flow rate (akış oranı) çok düşükse yetersiz ekstrüzyon olur.

**Çözüm Adımları:**
1. Flow rate''i kontrol edin — varsayılan %100 olmalı
2. Test küpü basın: tek duvar, 0.4mm nozzle → duvar kalınlığı 0.4mm olmalı
3. Ölçüm 0.36mm geliyorsa: Yeni flow = 100 × (0.4/0.36) = %111
4. Filament bazlı flow ayarı yapın (PETG genelde %95-98 ister)

---

## Hızlı Teşhis Akış Şeması

1. Sıcaklık doğru mu? → Hayır → **5-10°C artır**
2. Cold pull temiz çıkıyor mu? → Hayır → **Nozzle temizle/değiştir**
3. E-step kalibre mi? → Hayır → **E-step kalibrasyonu yap**
4. Extruder tık-tık yapıyor mu? → Evet → **Dişli ve basınç kontrol**
5. Bowden tube düzgün mü? → Hayır → **Tube değiştir**
6. Uzun baskılarda mı oluyor? → Evet → **Heat creep kontrol**

---

## Önleme İpuçları

✅ Her yeni filament rulosunda sıcaklık testi yapın
✅ 6 ayda bir E-step kalibrasyonu kontrol edin
✅ Nozzle''ı her 500 saat baskıda değiştirin (pirinç nozzle)
✅ Hardened steel nozzle kullanıyorsanız sıcaklığı 5-10°C artırın
✅ Filamentleri kuru ortamda saklayın

---

## Sıkça Sorulan Sorular

**S: Under-extrusion sadece belirli katmanlarda oluyorsa?**
Büyük olasılıkla kısmi tıkanıklık veya filament kalite sorunu. Cold pull ve farklı filament deneyin.

**S: Yeni nozzle taktım ama hala az ekstrüzyon var?**
E-step ve flow rate kalibrasyonu yapın. Ayrıca yeni nozzle''ın doğru boyutta olduğunu doğrulayın.

**S: PETG''de sürekli under-extrusion yaşıyorum?**
PETG daha yüksek sıcaklık ister (235-245°C). Ayrıca baskı hızını PLA''ya göre %10-15 düşürün.

---

## İlgili Rehberler
- [Nozzle Tıkanıklığı Çözüm Rehberi](/sorun-cozumleri/3d-yazici-nozzle-tikanikligi-kabustan-kurtulmanin-kesin-yollari-2026-rehberi-mkyiw0om)
- [PLA, PETG ve ABS Karşılaştırması](/rehberler/3d-yazici-filament-karsilastirmasi-pla-petg-ve-abs-mkxaz8x0)
- [3D Yazıcı Bakımı Rehberi](/rehberler/3d-yazici-bakimi-kapsamli-rehber-mkx2ntzt)',
  '3d-baskida-yetersiz-ekstruzyon-under-extrusion-tani-ve-cozum-rehberi',
  'sorun-cozumleri',
  'rehber',
  'https://www.simplify3d.com/wp-content/uploads/2019/04/Under-Extrusion.jpg',
  1, 0, 'published', 'tr'
);

-- 3. Fazla Ekstrüzyon (Over-extrusion)
INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status, language)
VALUES (
  '3D Baskıda Fazla Ekstrüzyon (Over-Extrusion): Nedenleri ve Çözüm Rehberi',
  'Baskınız şişkin mi görünüyor, köşeler yuvarlanıyor mu? Fazla ekstrüzyonun 5 ana nedeni ve çözümleri. Flow kalibrasyonundan E-step ayarına, sıcaklık optimizasyonundan slicer ayarlarına kadar detaylı rehber.',
  '## Hızlı Çözüm (TL;DR)

Fazla ekstrüzyon genellikle **yüksek flow rate**, **yüksek sıcaklık** veya **yanlış E-step** kaynaklıdır. İlk adım: flow rate''i %95''e düşürün. Düzelmezse sıcaklığı 5°C azaltın.

---

## Fazla Ekstrüzyon Nedir?

Fazla ekstrüzyon (Over-extrusion), yazıcının olması gerekenden **fazla filament** çıkarmasıdır. Sonuç: şişkin duvarlar, kötü boyut doğruluğu, blob''lar, ve katmanlar arası fazlalık.

### Belirtileri
- Duvarlar olması gerekenden kalın
- Köşeler yuvarlanmış (keskin değil)
- Yüzeyde küçük tümsekler/blob''lar
- Katmanlar arası fazla malzeme taşması
- Parçalar montaj deliklerine oturmuyor (boyut büyük)
- İlk katman "fili ayağı" gibi yayılmış

---

## 5 Temel Neden ve Çözümleri

### 1. 📊 Yüksek Flow Rate

En yaygın neden. Slicer flow rate değeri %100''ün üzerinde veya filamente göre ayarlanmamış.

**Flow Kalibrasyon Testi:**
1. **Tek duvar kalibrasyon küpü** indirin (20x20x20mm, tek duvar)
2. Flow rate %100, nozzle 0.4mm ile basın
3. Dijital kumpas ile duvar kalınlığını 3 noktadan ölçün
4. Ortalama 0.44mm geldiyse: Yeni flow = 100 × (0.4/0.44) = **%90.9**
5. Yeni değerle tekrar test edin

**Slicer Ayarları:**
- **Cura:** Material → Flow: %95 (genel başlangıç)
- **PrusaSlicer:** Print Settings → Advanced → Extrusion multiplier: 0.95
- **OrcaSlicer:** Quality → Flow ratio: 0.95

**Filament Bazlı Öneriler:**
| Filament | Önerilen Flow |
|----------|--------------|
| PLA | %95-100 |
| PETG | %93-97 |
| ABS | %95-100 |
| TPU | %100-105 |

---

### 2. 🌡️ Aşırı Nozzle Sıcaklığı

Çok yüksek sıcaklık filamenti aşırı akışkan yapar. Kontrol edilemez akış oluşur.

**Çözüm Adımları:**
1. Sıcaklığı **5°C azaltın**
2. Sıcaklık kulesi (temp tower) testi yapın
3. Filament üreticisinin önerdiği aralığın **alt-orta** kısmını kullanın
4. Yaz aylarında ortam sıcaklığı yüksekse nozzle sıcaklığını 5°C düşürün

---

### 3. ⚙️ Yanlış E-step Kalibrasyonu

E-step değeri yüksekse motor fazla filament iter.

**Kontrol ve Çözüm:**
1. Terminalde `M503` komutu → E değerini okuyun
2. 100mm kalibrasyon testi yapın (Under-extrusion makalesindeki yöntem)
3. Ölçüm 100mm''den fazla çıkıyorsa E-step düşürün
4. Yeni değer = Mevcut × (100 / Gerçek ölçüm)

---

### 4. 📏 Yanlış Filament Çapı

Filament çapı slicer''da gerçek değerden küçük girilmişse, yazıcı fazla filament hesaplar.

**Çözüm:**
1. Dijital kumpas ile filamenti 3 farklı noktadan ölçün
2. Ortalamayı slicer''a girin (genellikle 1.73-1.76mm arası)
3. Ucuz filamentlerde çap değişkenliği fazla olabilir — kaliteli marka kullanın

---

### 5. 🔩 Nozzle Yatağa Çok Yakın (İlk Katman)

İlk katmanda over-extrusion genellikle Z-offset sorundur, flow değil.

**Çözüm Adımları:**
1. Z-offset''i 0.02mm artırarak nozzle''ı tabladan uzaklaştırın
2. İlk katman ayrı flow rate ile kontrol edin
3. **Cura:** Initial Layer Flow: %90-95
4. **PrusaSlicer:** First layer extrusion width: %100 (auto yerine)
5. Kağıt testi yapın: A4 kağıt nozzle altında hafif sürtünme ile geçmeli

---

## Hızlı Teşhis Akış Şeması

1. Flow rate %100''ün üzerinde mi? → Evet → **%95''e düşür**
2. Sıcaklık önerilen aralığın üst sınırında mı? → Evet → **5°C düşür**
3. E-step kalibre mi? → Kontrol et → **100mm testi yap**
4. Sadece ilk katmanda mı? → Evet → **Z-offset ayarla**
5. Filament çapı doğru mu? → Ölç ve kontrol et

---

## Önleme İpuçları

✅ Her yeni filament rulosunda flow kalibrasyon testi yapın
✅ Sıcaklık kulesi ile optimum sıcaklığı belirleyin
✅ Boyut hassasiyeti önemli parçalarda flow''u %95 ile başlayın
✅ Kalibrasyon küpü basarak boyut doğruluğunu kontrol edin

---

## Sıkça Sorulan Sorular

**S: Over ve under extrusion aynı baskıda olabilir mi?**
Evet! Kısmi nozzle tıkanıklığında bazı katmanlar fazla, bazıları az ekstrüzyon gösterebilir.

**S: PETG neden hep fazla ekstrüzyon yapıyor gibi görünüyor?**
PETG doğası gereği daha "akışkan"dır. Flow rate''i %93-97 yapın ve sıcaklığı alt sınıra yakın tutun.

**S: Flow rate ile extrusion multiplier aynı şey mi?**
Evet, farklı slicer''ların aynı ayar için kullandığı farklı isimler. Cura: Flow, PrusaSlicer: Extrusion Multiplier.

---

## İlgili Rehberler
- [Yetersiz Ekstrüzyon Rehberi](/sorun-cozumleri/3d-baskida-yetersiz-ekstruzyon-under-extrusion-tani-ve-cozum-rehberi)
- [İlk Katman Yapışma Rehberi](/sorun-cozumleri/3d-baskida-i-lk-katman-yapisma-sorununa-kokten-cozum-rehberi-mkxazxot)
- [Filament Karşılaştırması](/rehberler/3d-yazici-filament-karsilastirmasi-pla-petg-ve-abs-mkxaz8x0)',
  '3d-baskida-fazla-ekstruzyon-over-extrusion-nedenleri-ve-cozum-rehberi',
  'sorun-cozumleri',
  'rehber',
  'https://www.simplify3d.com/wp-content/uploads/2019/04/Over-Extrusion.jpg',
  1, 0, 'published', 'tr'
);

-- 4. Ghosting/Ringing (Titreşim İzleri)
INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status, language)
VALUES (
  '3D Baskıda Ghosting ve Ringing (Titreşim İzleri): Çözüm Rehberi',
  'Köşelerde dalga deseni mi görüyorsunuz? Ghosting/ringing sorununun 6 ana nedeni ve çözümleri. Kayış gerginliğinden Input Shaping''e, hız ayarından çerçeve sağlamlaştırmaya kadar eksiksiz rehber.',
  '## Hızlı Çözüm (TL;DR)

Ghosting/ringing genellikle **aşırı hız/ivme**, **gevşek kayışlar** veya **titreşim** kaynaklıdır. İlk adım: baskı hızını 40mm/s''e düşürün. Düzelirse sorun mekanik. Klipper kullanıyorsanız **Input Shaping** etkinleştirin.

---

## Ghosting/Ringing Nedir?

Ghosting (hayalet görüntü) veya Ringing (çınlama), baskı yüzeyinde köşeler ve kenarlar çevresinde oluşan **dalga benzeri tekrarlayan desenlerdir**. Yazıcı ani yön değiştirdiğinde oluşan titreşimlerin baskıya yansımasıdır.

### Belirtileri
- Köşelerden sonra yüzeyde dalgalanma
- Keskin kenarlar çevresinde "gölge" deseni
- Yazı ve logolar çevresinde yankı görüntüsü
- Genellikle X veya Y ekseninde daha belirgin
- Yüksek hızlarda artar, düşük hızlarda azalır

---

## 6 Temel Neden ve Çözümleri

### 1. ⚡ Aşırı Baskı Hızı ve İvme

En yaygın neden. Yüksek hız + yüksek ivme = daha fazla titreşim.

**Çözüm Adımları:**
1. Baskı hızını **40-50mm/s**''e düşürün (test için)
2. İvmelendirme (Acceleration) değerini düşürün:
   - Başlangıç: 500 mm/s²
   - Orta: 1000 mm/s²
   - Agresif: 2000+ mm/s² (ghosting riski yüksek)
3. Jerk değerini düşürün (Marlin): 7-10 mm/s
4. Junction Deviation (Klipper): 0.01-0.02

**Slicer Ayarları:**
- **Cura:** Speed → Print Speed: 50, Acceleration: 500
- **PrusaSlicer:** Print Settings → Speed → Perimeters: 40
- **OrcaSlicer:** Quality → Outer wall speed: 40, Acceleration: 500

---

### 2. 🔩 Gevşek Kayışlar

Gevşek kayışlar titreşimleri absorbe edemez, aksine artırır.

**Çözüm Adımları:**
1. Kayışları kontrol edin — gitar teli gibi gergin olmalı
2. Parmakla çekildiğinde net bir "tıng" sesi çıkarmalı
3. X ve Y kayışlarını eşit gerginlikte ayarlayın
4. GT2 kayışların dişlerinin aşınmadığını kontrol edin
5. Alüminyum kayış gergisi upgrade yapın (Ender 3 için)

---

### 3. 🏗️ Zayıf Çerçeve/Yapı

Yazıcı çerçevesi titreşiyorsa bu baskıya yansır.

**Çözüm Adımları:**
1. Yazıcıyı **sert ve düz** bir yüzeye yerleştirin
2. Titreşim sönümleme ayakları takın (silikon/kauçuk)
3. Ağır beton plaka veya fayans üzerine koyun
4. Çerçeve vidalarını sıkın (özellikle köşe bağlantıları)
5. V-slot tekerleklerini kontrol edin — eksantrik somunu ayarlayın

**Pro İpucu:** Yazıcıyı yere yakın koyun. Masa titreşimi baskıyı etkiler.

---

### 4. 🎯 Input Shaping (Klipper Kullanıcıları)

Klipper firmware''in Input Shaping özelliği ghosting''i **neredeyse tamamen ortadan kaldırır**.

**Kurulum Adımları:**
1. ADXL345 ivmeölçer sensörü edinin
2. Raspberry Pi''ye bağlayın
3. Klipper config''e ADXL345 tanımı ekleyin
4. `SHAPER_CALIBRATE` komutunu çalıştırın
5. Sistem otomatik olarak en iyi shaper tipini ve frekansını belirler
6. Sonuçları printer.cfg''ye kaydedin

**Shaper Tipleri:**
| Tip | Etki | Hız Kaybı |
|-----|------|-----------|
| ZV | Düşük | En az |
| MZV | Orta | Az |
| EI | Yüksek | Orta |
| 2HUMP_EI | En Yüksek | En fazla |

---

### 5. ⚖️ Ağır Baskı Kafası

Direct drive extruder''lar veya ağır hotend''ler daha fazla titreşim üretir.

**Çözüm Adımları:**
1. Baskı kafası üzerindeki gereksiz ağırlıkları kaldırın
2. Bowden sisteme geçiş düşünün (ağırlık azalır)
3. Direct drive kullanıyorsanız hız ve ivmeyi düşük tutun
4. Hafif nozzle kullanın (çelik yerine pirinç — ama aşınır)

---

### 6. 📐 Pressure Advance / Linear Advance

Basınç dengeleme, ekstrüzyon gecikmesini kompanze eder ve köşelerde kaliteyi artırır.

**Klipper - Pressure Advance:**
1. `SET_VELOCITY_LIMIT SQUARE_CORNER_VELOCITY=1 ACCEL=500` ile test başlatın
2. `TUNING_TOWER COMMAND=SET_PRESSURE_ADVANCE PARAMETER=ADVANCE START=0 FACTOR=.005` komutu çalıştırın
3. Test küpünü basın ve en temiz köşeyi bulun
4. Hesaplama: pressure_advance = START + (en_iyi_yükseklik × FACTOR)
5. printer.cfg''ye kaydedin: `pressure_advance: 0.05` (örnek değer)

**Marlin - Linear Advance:**
1. Linear Advance kalibrasyon sayfasını kullanın
2. K-factor testi basın
3. En düzgün çizgiyi bulduktan sonra: `M900 K0.05`
4. Firmware''e kaydedin: `M500`

---

## Hızlı Teşhis Tablosu

| Belirti | Olası Neden | İlk Adım |
|---------|-------------|----------|
| Her iki eksende | Titreşim/çerçeve | Sağlam yüzey, ayaklar |
| Sadece X ekseni | X kayışı veya X motoru | X kayışını ger |
| Sadece Y ekseni | Y kayışı veya yatak ağırlığı | Y kayışını ger |
| Yüksek hızda | İvme/hız fazla | Hızı düşür |
| Tüm hızlarda | Mekanik sorun | Kayış + vida kontrolü |

---

## Önleme İpuçları

✅ Kayış gerginliğini düzenli kontrol edin
✅ Dış duvar hızını iç duvardan düşük tutun (yarısı ideal)
✅ Klipper kullanıyorsanız Input Shaping mutlaka aktifleştirin
✅ Yazıcıyı sert, düz ve titreşimsiz bir yüzeye koyun
✅ V-slot tekerleklerini ve lineer rulmanları düzenli kontrol edin

---

## Sıkça Sorulan Sorular

**S: Ghosting ve ringing farklı şeyler mi?**
Teknik olarak ikisi de aynı soruna işaret eder. Ghosting daha çok "gölge" görünümü, ringing daha çok "dalga" deseni için kullanılır.

**S: Bambu Lab yazıcılarda ghosting olur mu?**
Bambu Lab''ın kendi Input Shaping sistemi var (Vibration Compensation). Fabrika kalibrasyonlu gelir ama flow dynamics calibration yaparak optimize edebilirsiniz.

**S: Input Shaping baskı hızımı düşürür mü?**
Çok az. EI shaper ile hızda %5-10 kayıp olabilir, ZV ile neredeyse hiç kayıp olmaz. Ama kalite kazancı çok büyüktür.

---

## İlgili Rehberler
- [Klipper Input Shaping Rehberi](/rehberler/hiz-canavari-klipper-input-shaping-ve-pressure-advance-ayarlari-nasil-yapilir-ml0y1c07)
- [Katman Kayması Çözüm Rehberi](/sorun-cozumleri/3d-baskida-katman-kaymasi-layer-shifting-nedenleri-ve-kesin-cozumler)
- [3D Yazıcı Bakımı Rehberi](/rehberler/3d-yazici-bakimi-kapsamli-rehber-mkx2ntzt)',
  '3d-baskida-ghosting-ve-ringing-titresim-izleri-cozum-rehberi',
  'sorun-cozumleri',
  'rehber',
  'https://help.prusa3d.com/wp-content/uploads/2023/05/ringing.jpg',
  1, 0, 'published', 'tr'
);

-- 5. Fil Ayağı (Elephant Foot)
INSERT INTO posts (title_tr, summary_tr, content_tr, slug, category, post_type, image_url, published, ai_generated, status, language)
VALUES (
  '3D Baskıda Fil Ayağı (Elephant Foot): Nedenleri ve Çözüm Rehberi',
  'Baskının alt kısmı dışa doğru mı taşıyor? Fil ayağı sorununun 5 ana nedeni ve çözümleri. Z-offset ayarından tabla sıcaklığına, slicer kompanzasyonundan ilk katman optimizasyonuna kadar detaylı rehber.',
  '## Hızlı Çözüm (TL;DR)

Fil ayağı genellikle **nozzle''ın tablaya çok yakın olması** veya **yüksek tabla sıcaklığı** kaynaklıdır. İlk adım: Z-offset''i 0.02-0.05mm artırın (nozzle''ı uzaklaştırın). Düzelmezse tabla sıcaklığını 5°C düşürün.

---

## Fil Ayağı Nedir?

Fil ayağı (Elephant Foot), baskının ilk birkaç katmanının dışa doğru taşarak **tabandan şişkin** görünmesidir. İsim, tam olarak bir filin ayağına benzemesinden gelir. Özellikle montaj parçalarında ciddi boyut sorunları yaratır.

### Belirtileri
- İlk 1-3 katman dışa doğru taşmış
- Parça tabanı olması gerekenden geniş
- Montaj delikleri veya yuvaları daralmış
- Üstteki katmanlar normal, sadece alt kısım şişkin
- Taban kenarı keskin değil, yuvarlanmış

---

## 5 Temel Neden ve Çözümleri

### 1. 📐 Nozzle Tablaya Çok Yakın (Z-Offset)

En yaygın neden. Nozzle çok yakınsa ilk katman fazla ezilir ve yana doğru taşar.

**Çözüm Adımları:**
1. Z-offset değerini **+0.02mm** artırın
2. Kağıt testi yapın: A4 kağıt nozzle altında hafif sürtünmeyle geçmeli
3. İlk katmanı gözlemleyin:
   - **Çok yakın:** Katman şeffaf/çok ince, kenarlar taşar
   - **İdeal:** Hafif ezilmiş, hatlar birbirine yapışmış ama düz
   - **Çok uzak:** Hatlar yuvarlak, birbirine yapışmamış
4. 0.02mm''lik adımlarla ayarlayın

**Yazıcıya Göre Z-Offset:**
- **Bambu Lab:** Bambu Studio > Calibration > First Layer
- **Creality:** Ekrandan Prepare > Move Axis > Z
- **Prusa:** LCD > Live Adjust Z
- **Klipper:** `SET_GCODE_OFFSET Z_ADJUST=0.02`

---

### 2. 🌡️ Yüksek Tabla Sıcaklığı

Çok sıcak tabla alt katmanları yumuşatır. Üstteki katmanların ağırlığı alt katmanları yana iter.

**Çözüm Adımları:**
1. Tabla sıcaklığını **5°C düşürün**
2. İlk katmandan sonra tabla sıcaklığını düşüren ayar kullanın

**Filament Bazlı Tabla Sıcaklıkları:**
| Filament | Önerilen Tabla | Fil Ayağı Riski |
|----------|---------------|----------------|
| PLA | 50-60°C | Düşük |
| PETG | 70-80°C | Orta |
| ABS | 95-110°C | Yüksek |
| TPU | 40-50°C | Düşük |

**Slicer Ayarı (İlk katman sonrası düşürme):**
- **Cura:** Build Plate Temperature Initial Layer: 60 → Build Plate Temperature: 55
- **PrusaSlicer:** Filament Settings → Bed → First layer: 60, Other layers: 55

---

### 3. 🛠️ Slicer Elephant Foot Compensation

Modern slicer''lar bu sorunu otomatik düzeltebilir.

**Cura:**
- Initial Layer Horizontal Expansion: **-0.2mm** (negatif değer = içe çekme)
- Bu ayar sadece ilk katmanı etkiler

**PrusaSlicer / OrcaSlicer:**
- Print Settings → Advanced → Elephant foot compensation: **0.2mm**
- Otomatik olarak ilk katmanı içe çeker

**Bambu Studio:**
- Quality → First Layer → Elephant foot compensation: **0.1-0.2mm**

**Dikkat:** Bu değeri çok yüksek yaparsanız ilk katman çok küçük olur ve yapışma sorunu başlar. 0.1mm ile başlayıp 0.05mm artırarak test edin.

---

### 4. ⬇️ İlk Katman Ayarları

İlk katmanın doğru ayarlanması fil ayağını büyük ölçüde önler.

**Optimum İlk Katman Ayarları:**
1. **İlk katman yüksekliği:** 0.2-0.3mm (kalın = iyi yapışma)
2. **İlk katman hızı:** 20-25mm/s (yavaş = daha kontrollü)
3. **İlk katman flow:** %95-100 (çok yüksek yapma)
4. **İlk katman genişliği:** %100-120 (slicer auto genelde iyi)
5. **Fan:** İlk 1-3 katmanda kapalı veya %30 (PLA için)

---

### 5. 🏋️ Parça Ağırlığı ve Doluluk

Ağır parçalar alt katmanları ezer. Özellikle %100 infill büyük parçalarda.

**Çözüm Adımları:**
1. Doluluk oranını düşürün (%20-40 çoğu parça için yeterli)
2. Duvar sayısını artırın (infill yerine duvar ile dayanıklılık)
3. Çok ağır parçalarda baskıyı döndürerek tabana daha az yük bindirin

---

## Boyut Doğruluğu Testi

Fil ayağı düzeltmenizin doğruluğunu test etmek için:

1. 20×20×10mm kalibrasyon küpü basın
2. Kumpas ile ölçün:
   - Taban (ilk katman): X ve Y boyutu
   - Orta: X ve Y boyutu
   - Üst: X ve Y boyutu
3. Taban ölçümü orta/üst ile aynıysa → Fil ayağı yok ✅
4. Taban 0.2mm+ büyükse → Elephant foot compensation artırın

---

## Hızlı Teşhis

| Soru | Evet → | Hayır → |
|------|--------|---------|
| Sadece ilk 1-2 katmanda mı? | Z-offset veya tabla sıcaklığı | Genel over-extrusion |
| Tabla çok sıcak mı? | Sıcaklığı 5°C düşür | Z-offset kontrol et |
| Slicer''da compensation var mı? | Değeri artır (0.1-0.3mm) | Etkinleştir |
| İlk katman çok ezik mi? | Z-offset artır (+0.02mm) | Flow rate kontrol et |

---

## Önleme İpuçları

✅ Her tabla değişikliğinde (cam, PEI, manyetik) Z-offset yeniden kalibre edin
✅ Elephant foot compensation''ı slicer profilinize ekleyin
✅ İlk katman fan hızını düşük tutun ama sıfır yapmayın (PLA için %30)
✅ Montaj parçalarında 0.15mm elephant foot compensation standart kullanın
✅ Taban boyutu kritikse brim kullanın (brim kaldırılınca kenar temiz kalır)

---

## Sıkça Sorulan Sorular

**S: Elephant foot sadece FDM''de mi olur?**
Hayır, SLA/DLP baskılarda da olur. Sebebi farklı — reçinenin ilk katmanında aşırı maruz kalma (over-exposure). Çözüm: ilk katman exposure süresini kısaltmak.

**S: Brim kullanınca fil ayağı artar mı?**
Hayır, aksine brim tablaya yapışmayı artırır ve warping''i önler. Brim kaldırılınca iz kalabilir ama fil ayağı brim''den kaynaklanmaz.

**S: Raft kullanınca fil ayağı olur mu?**
Raft ile fil ayağı olmaz çünkü parça doğrudan tablaya değil raft üzerine basılır. Ama raft alt yüzeyini bozar.

**S: Glass/cam tabla fil ayağını etkiler mi?**
Cam tabla çok düz olduğu için ilk katman mükemmel yapışır ama Z-offset hassas ayarlanmazsa fil ayağı daha belirgin olur. Advantage: cam soğuyunca parça kendiliğinden ayrılır.

---

## İlgili Rehberler
- [İlk Katman Yapışma Rehberi](/sorun-cozumleri/3d-baskida-i-lk-katman-yapisma-sorununa-kokten-cozum-rehberi-mkxazxot)
- [3D Yazıcı Tabla Ayarı ve Kalibrasyon](/rehberler/3d-yazici-tabla-ayari-ve-i-lk-katman-kalibrasyonu-kapsamli-rehber-mkx2n99b)
- [ABS Warping ve Çatlama Çözümleri](/sorun-cozumleri/3d-yazicida-abs-filament-ile-baskida-catlama-ve-warping-sorunlarina-cozum-mkxazkpg)',
  '3d-baskida-fil-ayagi-elephant-foot-nedenleri-ve-cozum-rehberi',
  'sorun-cozumleri',
  'rehber',
  'https://www.simplify3d.com/wp-content/uploads/2019/04/Elephant-Foot.jpg',
  1, 0, 'published', 'tr'
);
