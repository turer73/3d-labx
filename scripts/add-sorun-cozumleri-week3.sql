-- Sorun Çözümleri Week 3 - 3D Printing Troubleshooting Articles
-- 5 comprehensive Turkish articles for the posts table

-- Article 1: Flow (Akış) Kalibrasyonu Rehberi
INSERT INTO posts (title_tr, title_en, title_de, slug, summary_tr, summary_en, summary_de, content_tr, content_en, content_de, category, post_type, image_url, published, status, language, created_at, updated_at) VALUES (
  'Flow (Akış) Kalibrasyonu Rehberi: Mükemmel Baskı İçin Ekstrüzyon Ayarı',
  'Flow Calibration Guide: Extrusion Adjustment for Perfect Prints',
  'Flow-Kalibrierungsanleitung: Extrusionseinstellung für perfekte Drucke',
  'flow-akis-kalibrasyonu-rehberi',
  'Flow rate kalibrasyonu ile 3D baskılarınızın boyut doğruluğunu, yüzey kalitesini ve mekanik dayanıklılığını optimize edin. Tek duvar küp testi, filament bazlı ayarlar ve slicer yapılandırmaları.',
  'Optimize dimensional accuracy, surface quality and mechanical strength of your 3D prints with flow rate calibration. Single wall cube test, filament-based settings and slicer configurations.',
  'Optimieren Sie die Maßgenauigkeit, Oberflächenqualität und mechanische Festigkeit Ihrer 3D-Drucke mit der Flow-Rate-Kalibrierung.',
  '## 🔧 Flow (Akış) Kalibrasyonu Rehberi

> **TL;DR:** Flow rate, ekstrüderden çıkan filament miktarını kontrol eder. Varsayılan %100 değeri çoğu yazıcıda doğru sonuç vermez. Tek duvar küp testi yaparak, dijital kumpasla ölçüm alarak ve basit bir formülle doğru flow değerini bulabilirsiniz. PLA için genellikle %92-98, PETG için %90-95, ABS için %95-100 aralığında olur.

---

## 📋 İçindekiler
1. Flow Rate Nedir?
2. Neden Kalibrasyon Gerekli?
3. Tek Duvar Küp Test Yöntemi
4. Hesaplama Formülü ve Pratik Örnekler
5. Filament Bazlı Flow Ayarları
6. E-Step Kalibrasyonu ile Farkı
7. Slicer Ayarları
8. Yazıcıya Göre Özel Notlar
9. İleri Seviye: Pressure Advance
10. SSS (Sıkça Sorulan Sorular)

---

## 🔍 Flow Rate Nedir?

Flow rate (akış oranı), 3D yazıcınızın ekstrüderinden çıkan filament miktarını kontrol eden temel parametredir. Slicer yazılımınızda genellikle yüzde (%) olarak ifade edilir ve varsayılan değeri %100''dür.

Flow rate, yazıcınızın ne kadar plastik eritip nozzle''dan dışarı iteceğini belirler. Bu değer doğru ayarlanmadığında:

- **Fazla flow:** Parçalar olması gerekenden büyük olur, yüzeyde fazla malzeme birikir, katmanlar arasında sızma görülür
- **Düşük flow:** Katmanlar arasında boşluklar oluşur, parçalar zayıf olur, yüzeyde çukurlar ve eksiklikler meydana gelir

### ⚙️ Flow Rate''i Etkileyen Faktörler

| Faktör | Etki |
|--------|------|
| Filament çapı toleransı | ±0.05mm sapma bile %2-3 flow farkı yaratır |
| Nozzle aşınması | Zamanla nozzle genişler, flow artar |
| Ekstrüder tipi | Direct drive vs Bowden farklı davranır |
| Filament malzemesi | PLA, PETG, ABS farklı flow ister |
| Baskı sıcaklığı | Yüksek sıcaklık = daha akışkan plastik |
| Baskı hızı | Yüksek hız = yetersiz erime süresi |

---

## 🎯 Neden Kalibrasyon Gerekli?

Varsayılan %100 flow rate neden her zaman doğru değildir? Bunun birkaç önemli nedeni var:

### 1. Filament Çap Toleransları
Filament üreticileri genellikle 1.75mm ±0.05mm tolerans belirtir. Ancak ucuz filamentlerde bu sapma ±0.10mm''ye kadar çıkabilir. 1.75mm yerine 1.80mm çapında bir filament kullanıyorsanız, yazıcınız farkında olmadan %5-6 daha fazla malzeme ekstrüde eder.

### 2. Nozzle Geometrisi
Her nozzle üreticisi aynı iç geometriyi üretmez. Özellikle hardened steel ve ruby nozzle''lar, brass nozzle''lardan farklı akış karakteristiği gösterir. Nozzle''ın iç çapı, koniklik açısı ve uzunluğu flow''u etkiler.

### 3. Ekstrüder Dişli Aşınması
Zamanla ekstrüder dişlisi aşınır ve filamenti kavrama gücü değişir. Bu da tutarsız ekstrüzyon miktarına yol açar. Özellikle abrasif filamentler (karbon fiber, glow-in-the-dark) bu aşınmayı hızlandırır.

### 4. Firmware Varsayılanları
Yazıcı firmware''leri genellikle ideal koşullar için ayarlanmıştır. Gerçek dünyada her yazıcının kendine özgü mekanik toleransları vardır ve bu toleranslar flow kalibrasyonuyla telafi edilmelidir.

### Kalibre Edilmemiş Flow''un Sonuçları

- **Boyut doğruluğu bozulur:** 20mm olması gereken parça 20.5mm çıkar
- **Yüzey kalitesi düşer:** Fazla ekstrüzyon "fil ayağı" ve pürüzlü yüzey yaratır
- **Mekanik güç azalır:** Yetersiz ekstrüzyon katmanlar arası bağı zayıflatır
- **Parçalar birbirine uymaz:** Montajlı tasarımlarda tolerans sorunları oluşur
- **Stringing artar:** Fazla flow, ipliklenme sorununu şiddetlendirir

---

## 🛠️ Tek Duvar (Single Wall) Küp Test Yöntemi

Bu yöntem, flow kalibrasyonunun en güvenilir ve yaygın yöntemidir. Adım adım uygulayalım:

### Gerekli Malzemeler
- 3D yazıcı (kalibre edilmiş tabla ve nozzle ile)
- Dijital kumpas (0.01mm hassasiyetli)
- Test filamenti (kalibre etmek istediğiniz filament)
- Slicer yazılımı (Cura, PrusaSlicer veya OrcaSlicer)
- 20x20x20mm küp STL dosyası

### Adım 1: Test Modelini Hazırla

Thingiverse veya Printables''dan 20x20x20mm kalibrasyon küpü indirin. Alternatif olarak slicer''ınızda basit bir küp oluşturabilirsiniz.

### Adım 2: Slicer Ayarlarını Yapılandır

Bu ayarlar **kritik** öneme sahiptir:

```
Duvar sayısı (Wall count): 1
Dolgu (Infill): %0
Üst katman (Top layers): 0
Alt katman (Bottom layers): 1-2
Katman yüksekliği: 0.2mm
Nozzle çapı: 0.4mm (veya kullandığınız nozzle)
Çizgi genişliği (Line width): 0.4mm (nozzle çapıyla aynı)
Flow: %100 (başlangıç değeri)
Hız: 40-50 mm/s (düşük tutun)
Sıcaklık: Filament önerisi
```

### Adım 3: Baskıyı Yap

- Tablanın temiz ve düzgün seviyeli olduğundan emin olun
- İlk katman yapışmasını kontrol edin
- Baskıyı tamamlayın (yaklaşık 15-20 dakika sürer)
- Baskıyı tabladan dikkatli çıkarın

### Adım 4: Ölçüm Yap

Dijital kumpasla her duvardaki kalınlığı ölçün:

1. **X ekseni** duvarlarını ölçün (ön ve arka)
2. **Y ekseni** duvarlarını ölçün (sol ve sağ)
3. Her duvardan en az 3 farklı yükseklikte ölçüm alın
4. Alt 2-3mm''yi atlayın (fil ayağı etkisi)
5. Tüm ölçümlerin **ortalamasını** alın

⚠️ **Önemli:** Ölçümü küpün alt kısmından değil, orta ve üst kısımlarından yapın. Alt kısım fil ayağı etkisinden dolayı yanıltıcı olabilir.

### Adım 5: Hesaplama

**Flow Kalibrasyonu Formülü:**

```
Yeni Flow = (Beklenen Kalınlık / Ölçülen Kalınlık) × Mevcut Flow
```

---

## 📊 Pratik Hesaplama Örnekleri

### Örnek 1: Tipik Over-Extrusion
- Nozzle çapı: 0.4mm
- Beklenen duvar kalınlığı: 0.4mm
- Ölçülen duvar kalınlığı: 0.45mm
- Mevcut flow: %100

```
Yeni Flow = (0.4 / 0.45) × 100 = %88.9
```

Slicer''da flow değerini **%89** olarak ayarlayın.

### Örnek 2: Hafif Over-Extrusion
- Nozzle çapı: 0.4mm
- Beklenen duvar kalınlığı: 0.4mm
- Ölçülen duvar kalınlığı: 0.42mm
- Mevcut flow: %100

```
Yeni Flow = (0.4 / 0.42) × 100 = %95.2
```

Slicer''da flow değerini **%95** olarak ayarlayın.

### Örnek 3: Under-Extrusion
- Nozzle çapı: 0.4mm
- Beklenen duvar kalınlığı: 0.4mm
- Ölçülen duvar kalınlığı: 0.37mm
- Mevcut flow: %100

```
Yeni Flow = (0.4 / 0.37) × 100 = %108.1
```

⚠️ **Dikkat:** %105''in üzerinde bir sonuç çıkıyorsa, önce E-step kalibrasyonunu kontrol edin. Mekanik bir sorun olabilir.

### Doğrulama Testi

Flow değerini ayarladıktan sonra aynı testi tekrarlayın. Ölçülen değer beklenen değere ±0.02mm yakın olmalıdır. Değilse ince ayar yapın.

---

## 🧵 Filament Bazlı Flow Ayarları

Her filament malzemesi farklı akış karakteristiği gösterir. Aşağıdaki değerler **başlangıç noktası** olarak kullanılabilir, ancak her durumda test yapmanız önerilir:

| Filament | Tipik Flow Aralığı | Notlar |
|----------|-------------------|--------|
| **PLA** | %92-98 | En öngörülebilir malzeme |
| **PLA+** | %93-97 | PLA''ya benzer, biraz daha akışkan |
| **PETG** | %90-95 | Genellikle daha düşük flow gerektirir |
| **ABS** | %95-100 | Sıcaklığa bağlı olarak değişir |
| **ASA** | %95-100 | ABS''ye benzer davranır |
| **TPU** | %100-110 | Esnek malzemeler daha fazla flow isteyebilir |
| **Nylon** | %95-100 | Nem durumuna göre değişir |
| **CF-PLA** | %95-100 | Abrasif, nozzle aşınmasını kontrol edin |

### Filament Markasına Göre Farklılıklar

Türkiye''de popüler filament markaları arasında bile flow değerleri farklılık gösterebilir:

- **Filamix PLA:** Genellikle %94-96 aralığında
- **Porima PLA:** Genellikle %93-97 aralığında
- **Elas3D PLA:** Genellikle %95-98 aralığında
- **eSUN PLA+:** Genellikle %93-96 aralığında
- **Polymaker PLA:** Genellikle %94-97 aralığında

⚠️ **Önemli:** Aynı marka ve malzemenin farklı renkleri bile farklı flow değerleri gerektirebilir. Özellikle beyaz ve açık renkler ile koyu renkler arasında fark olabilir.

---

## ⚙️ E-Step Kalibrasyonu ile Farkı

E-step (extruder steps) kalibrasyonu ve flow kalibrasyonu sıklıkla karıştırılır. İkisi farklı şeyleri düzeltir:

### E-Step Kalibrasyonu
- **Ne yapar:** Ekstrüder motorunun adım sayısını düzeltir
- **Donanım seviyesinde** bir kalibrasyon
- **Bir kez yapılır** ve tüm filamentler için geçerli
- Filament yüklenmeden, boşta ekstrüzyon ile test edilir
- 100mm filament ilerlet komutu verilir, gerçekte kaç mm ilerlediği ölçülür

### Flow Kalibrasyonu
- **Ne yapar:** Slicer''daki ekstrüzyon çarpanını ayarlar
- **Yazılım seviyesinde** bir kalibrasyon
- **Her filament için ayrı** yapılması önerilir
- Gerçek baskı yapılarak test edilir
- Nozzle, sıcaklık ve malzeme etkisini de kapsar

### Doğru Sıralama

1. **Önce** E-step kalibrasyonu yapın (bir kez)
2. **Sonra** flow kalibrasyonu yapın (her filament için)

E-step kalibrasyonu doğru yapıldıysa, flow değeriniz %90-110 aralığında olmalıdır. Bu aralığın dışındaysa önce E-step''i kontrol edin.

---

## 🖥️ Slicer Ayarları

### Cura
- **Flow** ayarı: Print Settings → Material → Flow
- Değer yüzde olarak girilir (örn: 95)
- Her malzeme profili için ayrı flow değeri kaydedilebilir
- İlk katman flow''u ayrıca ayarlanabilir: Initial Layer Flow

### PrusaSlicer / OrcaSlicer
- **Extrusion Multiplier** ayarı: Filament Settings → Filament → Extrusion multiplier
- Değer ondalık olarak girilir (örn: 0.95 = %95)
- Her filament profili için ayrı kayıt yapılabilir

### Bambu Studio
- **Flow Ratio** ayarı: Filament → Flow ratio
- Değer ondalık olarak girilir (örn: 0.95)
- AMS kullanıcıları her slot için ayrı profil oluşturabilir

---

## 🖨️ Yazıcıya Göre Özel Notlar

### Bambu Lab (X1C, P1S, A1)
- Bambu Lab yazıcıları fabrika kalibrasyonlu gelir
- Auto-calibration özelliği flow''u otomatik ayarlar
- Yine de manuel test yapmanız önerilir
- AMS kullanıyorsanız her filament için ayrı flow profili oluşturun
- Bambu Studio''da "Flow Dynamics Calibration" özelliğini kullanın

### Creality (Ender 3, Ender 5, K1)
- Ender serisi genellikle %92-96 flow aralığında çalışır
- Bowden tube uzunluğu flow''u etkiler (kısa tutun)
- K1 serisi Direct Drive olduğu için daha hassas
- Creality Print veya Cura''da flow ayarını yapın

### Prusa (MK3S+, MK4, Mini+)
- Prusa yazıcıları genellikle %95-100 aralığında çalışır
- Input Shaper ile birlikte flow kalibrasyonu yapın
- PrusaSlicer''da Extrusion Multiplier kullanın
- Her filament profili için ayrı değer kaydedin

---

## 🚀 İleri Seviye: Pressure Advance / Linear Advance

Flow kalibrasyonu yapıldıktan sonra, baskı kalitesini daha da artırmak için Pressure Advance (PA) veya Linear Advance (LA) kalibrasyonu yapılabilir.

### Pressure Advance Nedir?
Ekstrüder motoru hareket yönü değiştirdiğinde, nozzle''daki basınç ani olarak değişir. Bu durum köşelerde fazla malzeme birikmesine ve düz hatlarda eksik malzemeye neden olur. PA/LA bu basınç değişimini telafi eder.

### Kalibrasyonu
1. PA test modelini indirin veya oluşturun
2. Farklı PA değerleriyle (0.01-0.10 aralığı) test baskısı yapın
3. En temiz köşeleri ve en düzgün çizgileri veren değeri seçin
4. Firmware ayarlarına kaydedin

### Tipik PA Değerleri
- **Direct Drive:** 0.02-0.06
- **Bowden:** 0.3-1.0
- **Bambu Lab:** Otomatik kalibrasyon mevcut

---

## ❓ SSS (Sıkça Sorulan Sorular)

### S: Flow kalibrasyonunu ne sıklıkla yapmalıyım?
**C:** Her yeni filament rulosu açtığınızda yapmanız önerilir. Aynı marka ve renk olsa bile partiler arasında fark olabilir.

### S: Flow değerim %85''in altında çıkıyorsa ne yapmalıyım?
**C:** Bu genellikle mekanik bir sorun işaret eder. Önce ekstrüder dişlisini, PTFE tube''u ve nozzle''ı kontrol edin. E-step kalibrasyonunu da doğrulayın.

### S: İlk katman flow''u ayrı mı ayarlanmalı?
**C:** Evet, ilk katman genellikle daha yüksek flow ile basılır (%100-110). Bu, tablaya yapışmayı artırır. Ancak çok yüksek tutmak fil ayağı sorununa yol açar.

### S: Vase mode (spiral mode) baskılarda flow ayarı nasıl olmalı?
**C:** Vase mode zaten tek duvar olduğu için flow kalibrasyonu ekstra önemlidir. Standart flow testinizin sonucunu doğrudan kullanabilirsiniz.

### S: Farklı katman yükseklikleri için farklı flow gerekir mi?
**C:** Teorik olarak evet, ama pratikte fark çok küçüktür. 0.2mm katman yüksekliğinde yapılan kalibrasyon çoğu durumda 0.1mm ve 0.3mm için de geçerlidir.

### S: Flow kalibrasyonu bridging performansını etkiler mi?
**C:** Evet, fazla flow bridging kalitesini düşürür. Doğru flow ile köprüler daha düzgün ve sarkmasız olur.

---

## 📚 İlgili Rehberler

- [PETG Baskı Sorunları ve Çözüm Rehberi](/rehber/petg-baski-sorunlari-ve-cozumleri-rehberi)
- [Brim, Raft ve Skirt Rehberi](/rehber/brim-raft-skirt-ne-zaman-kullanilir-rehberi)
- [Destek Yapıları Optimizasyonu](/rehber/destek-yapilari-support-optimizasyonu-rehberi)
- [Çok Renkli Baskı Sorunları](/rehber/cok-renkli-baski-sorunlari-ve-cozumleri-rehberi)

---

*Bu rehber 3D-labX topluluğu tarafından hazırlanmıştır. Sorularınız için [Topluluk Forumu](/topluluk) sayfamızı ziyaret edin.*',
  'Comprehensive guide to flow rate calibration for 3D printers. Covers single wall cube test method, calculation formula, filament-specific settings, and slicer configurations for Cura, PrusaSlicer, and OrcaSlicer.',
  'Umfassende Anleitung zur Flow-Rate-Kalibrierung für 3D-Drucker. Behandelt die Einzelwand-Würfel-Testmethode, Berechnungsformel und Slicer-Konfigurationen.',
  'sorun-cozumleri',
  'rehber',
  'https://images.unsplash.com/photo-1642969164999-979483e21601?w=800&auto=format&fit=crop',
  1,
  'published',
  'tr',
  datetime('now'),
  datetime('now')
);

-- Article 2: Brim, Raft ve Skirt: Ne Zaman Kullanılır?
INSERT INTO posts (title_tr, title_en, title_de, slug, summary_tr, summary_en, summary_de, content_tr, content_en, content_de, category, post_type, image_url, published, status, language, created_at, updated_at) VALUES (
  'Brim, Raft ve Skirt: Ne Zaman Kullanılır? Yapışma Yardımcıları Rehberi',
  'Brim, Raft and Skirt: When to Use? Adhesion Helpers Guide',
  'Brim, Raft und Skirt: Wann verwenden? Haftungshilfen-Anleitung',
  'brim-raft-skirt-ne-zaman-kullanilir-rehberi',
  'Brim, raft ve skirt arasındaki farkları öğrenin. Her birinin ne zaman kullanılacağını, avantaj ve dezavantajlarını, slicer ayarlarını ve pratik karar rehberini keşfedin.',
  'Learn the differences between brim, raft and skirt. Discover when to use each, their pros and cons, slicer settings and practical decision guide.',
  'Erfahren Sie die Unterschiede zwischen Brim, Raft und Skirt. Entdecken Sie wann man welches verwendet.',
  '## 🔧 Brim, Raft ve Skirt: Ne Zaman Kullanılır?

> **TL;DR:** Skirt sadece nozzle''ı hazırlar ve seviye kontrol sağlar. Brim, baskının taban kenarına eklenen düz şeritle warping''i önler ve küçük parçaların yapışmasını artırır. Raft ise baskının altına tam bir platform ekler ve en iyi yapışmayı sağlar ama alt yüzey kalitesini düşürür. Çoğu baskı için brim yeterlidir; raft''ı sadece ciddi yapışma sorunlarında kullanın.

---

## 📋 İçindekiler
1. Yapışma Yardımcıları Nedir?
2. Skirt Detaylı İnceleme
3. Brim Detaylı İnceleme
4. Raft Detaylı İnceleme
5. Karşılaştırma Tablosu
6. Karar Ağacı: Hangisini Seçmeli?
7. Slicer Ayarları
8. Yazıcıya Göre Özel Notlar
9. SSS (Sıkça Sorulan Sorular)

---

## 🔍 Yapışma Yardımcıları Nedir?

3D baskıda en temel sorunlardan biri, baskının tablaya düzgün yapışmasıdır. Yapışma yetersiz olduğunda parça tableden kopabilir, köşeleri kalkabilir (warping) veya baskı tamamen başarısız olabilir.

Yapışma yardımcıları (adhesion helpers), slicer yazılımınızın baskınızın etrafına veya altına eklediği ek yapılardır. Üç temel tür vardır:

- **Skirt:** Baskı etrafında çizilen çerçeve çizgileri
- **Brim:** Baskının tabanına eklenen düz kenar
- **Raft:** Baskının altına eklenen tam platform

Her birinin kendine özgü avantajları, dezavantajları ve ideal kullanım senaryoları vardır.

---

## 📏 Skirt Detaylı İnceleme

### Skirt Nedir?
Skirt, baskınızın etrafında çizilen bir veya birkaç çerçeve çizgisidir. Baskıya **dokunmaz** ve yapışma sağlamaz. Tamamen hazırlık amaçlıdır.

### Skirt Ne İşe Yarar?

1. **Nozzle Hazırlama (Priming):** Baskı başlamadan önce nozzle''dan filament akışını başlatır. Bu sayede asıl baskının ilk katmanı düzgün olur.

2. **Tabla Seviyesi Kontrolü:** Skirt çizgileri tablanın her bölgesindeki yapışmayı gözlemlemenizi sağlar. Bir köşede çizgi yapışmıyorsa, seviyeyi düzeltme şansınız olur.

3. **Filament Akışı Doğrulama:** Ekstrüzyon sorunlarını (tıkanma, yetersiz akış) baskıdan önce tespit edebilirsiniz.

### Skirt Ayarları

| Ayar | Önerilen Değer | Açıklama |
|------|----------------|----------|
| Çizgi sayısı | 2-3 | Nozzle hazırlamak için yeterli |
| Mesafe (Offset) | 3-10mm | Baskıdan ne kadar uzak |
| Katman sayısı | 1 | Genellikle tek katman yeterli |

### Skirt Ne Zaman Kullanılır?
- **Her baskıda** kullanılabilir (varsayılan olarak aktif olmalıdır)
- Yapışma sorunu olmayan baskılarda tek başına yeterlidir
- Geniş tabanlı, warping riski düşük parçalarda idealdir

### Skirt Ne Zaman Yetmez?
- Küçük taban alanlı parçalarda
- Uzun ve ince parçalarda
- Warping''e eğilimli malzemelerde (ABS, ASA)
- Tabla yapışması zaten sorunlu ise

---

## 🔲 Brim Detaylı İnceleme

### Brim Nedir?
Brim, baskınızın taban kenarına eklenen düz bir şerittir. Baskının ilk katmanıyla **aynı seviyede** ve **baskıya dokunur** şekilde basılır. Bir şapkanın kenarı gibi düşünebilirsiniz.

### Brim Ne Zaman Kullanılır?

1. **Warping Riski Yüksek Olduğunda:**
   - ABS, ASA, Nylon gibi malzemeler
   - Büyük ve düz taban alanları
   - Kapalı ortam olmayan yazıcılar

2. **Küçük Taban Alanı Olduğunda:**
   - İnce bacaklı modeller
   - Küçük parçalar
   - Tablaya az temas eden geometriler

3. **Uzun ve İnce Parçalarda:**
   - Yüksek boy/taban oranı
   - Kaldıraç etkisiyle tabladan kopma riski

4. **Birden Fazla Küçük Parça Basarken:**
   - Her parçanın ayrı ayrı yapışmasını garantiler

### Brim Genişliği Rehberi

| Durum | Önerilen Brim Genişliği |
|-------|------------------------|
| Hafif warping riski | 3-5mm |
| Orta warping riski | 5-8mm |
| Yüksek warping riski | 8-15mm |
| Küçük taban alanı | 5-10mm |
| Çok ince/uzun parçalar | 10-15mm |

### Brim Türleri

#### Outside Only (Sadece Dış)
- Brim sadece baskının dış kenarına eklenir
- Delikler ve iç boşluklar etkilenmez
- **Önerilen:** Çoğu durumda bu seçenek yeterlidir
- Kaldırması daha kolaydır

#### Everywhere (Her Yerde)
- Brim hem iç hem dış kenarlara eklenir
- Delik ve boşlukların içine de brim eklenir
- Çok zor yapışma durumlarında kullanılır
- Kaldırması daha zordur

### Brim Kaldırma Teknikleri

1. **Bıçak ile:** İnce bir maket bıçağı veya spatula ile brim''i baskıdan ayırın
2. **Pense ile:** Brim kenarını pense ile tutup yavaşça sökün
3. **Zımpara ile:** Kalan brim izlerini ince zımpara (220-400 grit) ile temizleyin
4. **Deburring aracı:** Plastik kenar temizleme aracı çok etkilidir

💡 **İpucu:** Bazı slicer''larda "Brim Gap" (brim boşluğu) ayarı vardır. 0.1-0.2mm boşluk bırakarak brim''in daha kolay sökülmesini sağlayabilirsiniz.

---

## 🏗️ Raft Detaylı İnceleme

### Raft Nedir?
Raft, baskınızın altına eklenen çok katmanlı tam bir platformdur. Baskı, raft''ın üzerine basılır ve baskı bittikten sonra raft sökülerek atılır.

### Raft Yapısı

Raft genellikle üç bölümden oluşur:

1. **Base Layer (Taban Katmanı):** Kalın çizgilerle tablaya yapışır
2. **Middle Layers (Orta Katmanlar):** Raft''ın gövdesini oluşturur
3. **Top Layers (Üst Katmanlar):** Baskının oturacağı düz yüzey

### Raft Ne Zaman Kullanılır?

1. **Çok kötü tabla yapışması:** Tabla düzgün değilse veya yüzey hasarlıysa
2. **ABS/ASA baskı:** Yüksek warping eğilimli malzemelerde
3. **Düzensiz tabla:** Cam tabla kırık veya eğriyse
4. **Çok küçük taban alanı:** Brim bile yeterli yapışma sağlamıyorsa
5. **Hassas alt yüzey gerekmiyorsa:** Alt yüzey kalitesi önemli değilse

### Raft Avantajları
- ✅ Mükemmel yapışma sağlar
- ✅ Warping''i büyük ölçüde önler
- ✅ Tabla düzensizliklerini telafi eder
- ✅ İlk katman sorunlarını ortadan kaldırır

### Raft Dezavantajları
- ❌ Malzeme israfı (önemli miktarda filament harcanır)
- ❌ Baskı süresi uzar
- ❌ Alt yüzey kalitesi düşer (raft dokusu kalır)
- ❌ Kaldırması zor olabilir
- ❌ Boyut doğruluğu azalabilir

### Raft Ayarları

| Ayar | Önerilen Değer | Açıklama |
|------|----------------|----------|
| Air Gap (Hava Boşluğu) | 0.15-0.25mm | Raft ile baskı arası mesafe |
| Top Layers | 2-3 | Üst katman sayısı |
| Base Layers | 1-2 | Taban katman sayısı |
| Raft Extra Margin | 3-5mm | Baskıdan taşma miktarı |

⚠️ **Air Gap çok önemlidir:** Çok düşük = raft sökmek imkansız. Çok yüksek = baskı raft''tan kopabilir.

---

## 📊 Karşılaştırma Tablosu

| Özellik | Skirt | Brim | Raft |
|---------|-------|------|------|
| Yapışma desteği | ❌ Yok | ✅ Orta-İyi | ✅ Çok İyi |
| Warping önleme | ❌ Yok | ✅ İyi | ✅ Çok İyi |
| Malzeme israfı | Çok az | Az | Çok |
| Ek süre | ~1 dk | ~3-5 dk | ~10-20 dk |
| Alt yüzey etkisi | Yok | Minimal | Belirgin |
| Kaldırma zorluğu | Kaldırılmaz | Kolay-Orta | Orta-Zor |
| Nozzle hazırlama | ✅ Evet | ✅ Evet | ✅ Evet |
| Seviye kontrolü | ✅ Evet | ✅ Evet | Kısıtlı |

---

## 🎯 Karar Ağacı: Hangisini Seçmeli?

Aşağıdaki karar sürecini takip edin:

### 1. Tabla yapışması iyi mi?
- **Evet** → Skirt kullanın
- **Hayır** → Sonraki soruya geçin

### 2. Warping riski var mı?
- **Hayır** → Skirt yeterli
- **Hafif-Orta** → Brim kullanın (5-8mm)
- **Yüksek** → Geniş brim (10-15mm) veya raft kullanın

### 3. Parçanın taban alanı küçük mü?
- **Hayır** → Skirt veya ince brim
- **Evet** → Brim (8-10mm) kullanın

### 4. Alt yüzey kalitesi önemli mi?
- **Evet** → Brim tercih edin (raft alt yüzeyi bozar)
- **Hayır** → Raft kullanılabilir

### 5. Tabla düzgün mü?
- **Evet** → Brim yeterli
- **Hayır** → Raft kullanın (tabla düzensizliğini telafi eder)

### Malzemeye Göre Genel Öneri

| Malzeme | Varsayılan Öneri |
|---------|-----------------|
| PLA | Skirt (sorun varsa brim) |
| PETG | Skirt veya brim |
| ABS | Brim (kapalı ortamda) veya raft |
| ASA | Brim veya raft |
| TPU | Skirt (yapışması genellikle iyi) |
| Nylon | Brim veya raft |

---

## 🖥️ Slicer Ayarları

### Cura
- **Build Plate Adhesion Type:** None / Skirt / Brim / Raft
- Skirt ayarları: Skirt Line Count, Skirt Distance
- Brim ayarları: Brim Width, Brim Line Count, Brim Only on Outside
- Raft ayarları: Raft Air Gap, Raft Top Layers, Raft Extra Margin

### PrusaSlicer / OrcaSlicer
- **Brim type:** No brim / Outer brim only / Inner brim only / Outer and inner brim
- Brim genişliği: mm cinsinden ayarlanır
- Skirt: Skirt loops, Skirt distance, Skirt height
- Raft ayarları: Raft layers, Raft contact distance

### Bambu Studio
- **Brim type:** Auto / No brim / Outer brim / Inner and outer brim
- Auto seçeneği modele göre otomatik karar verir
- Raft ayarları PrusaSlicer ile benzerdir

---

## 🖨️ Yazıcıya Göre Özel Notlar

### Bambu Lab (X1C, P1S, A1)
- Bambu Lab''ın PEI tablası çoğu malzeme için mükemmel yapışma sağlar
- PLA için genellikle skirt yeterlidir
- PETG için brim önerilir (PEI''ye çok yapışabilir, glue stick kullanın)
- Auto brim özelliği genellikle doğru karar verir
- Cool plate''de yapışma zorsa textured PEI plate kullanın

### Creality (Ender 3, Ender 5, K1)
- Cam tabla kullanıyorsanız yapışma yardımcısı (glue stick, hairspray) gerekebilir
- PEI tablaya geçiş yapışma sorunlarını büyük ölçüde çözer
- Ender 3''te tabla düzgünlüğü sorunlu olabilir → raft kullanılabilir
- K1 serisi otomatik leveling ile brim genellikle yeterlidir

### Prusa (MK3S+, MK4, Mini+)
- Prusa''nın textured ve smooth PEI tablaları harika yapışma sağlar
- Smooth PEI''de PETG doğrudan basmayın (yapışıp tabla hasar görebilir)
- PLA için genellikle skirt yeterlidir
- MK4''ün input shaper''ı ile brim genellikle daha iyi sonuç verir

---

## 💡 Yapışma İyileştirme İpuçları

Brim veya raft''a ihtiyaç duymadan yapışmayı artırmak için:

1. **Tabla temizliği:** IPA (izopropil alkol) ile düzenli temizleyin
2. **Tabla sıcaklığı:** Malzemeye uygun sıcaklık kullanın
3. **İlk katman hızı:** Düşük tutun (15-25 mm/s)
4. **İlk katman yüksekliği:** 0.2-0.3mm kullanın
5. **İlk katman flow:** %100-110 aralığında
6. **Z-offset:** İlk katman squish''ini doğru ayarlayın
7. **Yapışma yardımcıları:** Glue stick, hairspray veya özel 3D baskı yapıştırıcıları

---

## ❓ SSS (Sıkça Sorulan Sorular)

### S: Brim ile raft arasında kararsızım, hangisini seçeyim?
**C:** Önce brim deneyin. Brim çoğu durumda yeterlidir ve daha az malzeme harcar. Brim işe yaramıyorsa raft''a geçin.

### S: Skirt yerine her zaman brim kullansam olmaz mı?
**C:** Olur, ama gereksiz malzeme israfı ve kaldırma zahmeti olur. Yapışma sorunu yoksa skirt yeterlidir.

### S: Brim baskının boyutunu etkiler mi?
**C:** Brim baskının dışına eklenir, boyutunu etkilemez. Ancak kaldırırken dikkatli olmazsanız taban kenarını çizebilirsiniz.

### S: Raft''ın alt yüzeye etkisi nasıl minimize edilir?
**C:** Air gap değerini artırarak (0.2-0.3mm) raft izini azaltabilirsiniz. Ayrıca raft top layers sayısını artırmak (3-4) daha düz bir yüzey sağlar.

### S: PLA için raft gerekli mi?
**C:** Genellikle hayır. PLA, warping eğilimi en düşük malzemedir. Temiz bir PEI tablada skirt bile yeterlidir. Sadece çok küçük taban alanı olan parçalarda brim düşünebilirsiniz.

### S: Brim gap nedir?
**C:** Brim ile baskı arasında bırakılan küçük boşluktur (0.1-0.2mm). Bu boşluk sayesinde brim çok daha kolay sökülebilir. Cura''da "Brim Gap" olarak, PrusaSlicer''da henüz resmi destek yoktur.

---

## 📚 İlgili Rehberler

- [Flow Kalibrasyonu Rehberi](/rehber/flow-akis-kalibrasyonu-rehberi)
- [Destek Yapıları Optimizasyonu](/rehber/destek-yapilari-support-optimizasyonu-rehberi)
- [PETG Baskı Sorunları ve Çözüm Rehberi](/rehber/petg-baski-sorunlari-ve-cozumleri-rehberi)
- [Çok Renkli Baskı Sorunları](/rehber/cok-renkli-baski-sorunlari-ve-cozumleri-rehberi)

---

*Bu rehber 3D-labX topluluğu tarafından hazırlanmıştır. Sorularınız için [Topluluk Forumu](/topluluk) sayfamızı ziyaret edin.*',
  'Complete guide to brim, raft and skirt adhesion helpers in 3D printing. Covers when to use each type, comparison table, decision tree, and slicer settings for Cura, PrusaSlicer, and OrcaSlicer.',
  'Vollständige Anleitung zu Brim, Raft und Skirt Haftungshilfen beim 3D-Druck. Behandelt Vergleichstabelle und Slicer-Einstellungen.',
  'sorun-cozumleri',
  'rehber',
  'https://images.unsplash.com/photo-1611505908502-5b67e53e3a76?w=800&auto=format&fit=crop',
  1,
  'published',
  'tr',
  datetime('now'),
  datetime('now')
);

-- Article 3: Destek Yapıları (Support) Optimizasyonu
INSERT INTO posts (title_tr, title_en, title_de, slug, summary_tr, summary_en, summary_de, content_tr, content_en, content_de, category, post_type, image_url, published, status, language, created_at, updated_at) VALUES (
  'Destek Yapıları (Support) Optimizasyonu: Kolay Söküm ve Temiz Yüzey Rehberi',
  'Support Structure Optimization: Easy Removal and Clean Surface Guide',
  'Stützstruktur-Optimierung: Einfache Entfernung und saubere Oberflächen-Anleitung',
  'destek-yapilari-support-optimizasyonu-rehberi',
  'Support yapıları optimizasyonu rehberi. Tree support, organic support, paint-on support, interface katmanları, çözünür malzemeler ve destek ihtiyacını azaltma teknikleri.',
  'Support structure optimization guide. Tree support, organic support, paint-on support, interface layers, soluble materials and techniques to reduce support needs.',
  'Leitfaden zur Optimierung von Stützstrukturen. Tree-Support, organischer Support und Techniken zur Reduzierung des Stützbedarfs.',
  '## 🔧 Destek Yapıları (Support) Optimizasyonu Rehberi

> **TL;DR:** 45 dereceden daha dik açılı çıkıntılar (overhang) destek yapısı gerektirir. Tree support, düz yüzeylerde iz bırakmaz ve daha az malzeme kullanır. Interface katmanları (1-2 adet) destek ile baskı arasındaki yüzey kalitesini artırır. Support Z distance''ı 0.15-0.2mm tutarak kolay söküm sağlayabilirsiniz. Destek ihtiyacını azaltmak için modeli döndürmeyi ve chamfer eklemeyi düşünün.

---

## 📋 İçindekiler
1. Support Nedir ve Neden Gerekli?
2. 45 Derece Kuralı
3. Support Türleri
4. Interface Katmanları
5. Support Density ve Mesafe Ayarları
6. Kolay Söküm İpuçları
7. Çözünür Destek Malzemeleri
8. Destek İhtiyacını Azaltma
9. Slicer Ayarları
10. Yazıcıya Göre Özel Notlar
11. SSS

---

## 🔍 Support Nedir ve Neden Gerekli?

3D yazıcılar katman katman baskı yapar ve her yeni katman, altındaki katmanın üzerine yerleşir. Ancak bazı tasarımlarda katmanın altında hiçbir şey yoktur - bu duruma **overhang** (çıkıntı) denir.

Plastik havada asılı kalamayacağı için, bu boşluktaki bölgelere geçici destek yapıları eklenir. Baskı tamamlandıktan sonra bu destekler sökülerek atılır.

### Support Olmadan Ne Olur?
- Sarkan plastik spaghetti gibi dağılır
- Yüzey kalitesi ciddi şekilde bozulur
- Parça yapısal olarak zayıf olur
- Köprü (bridge) mesafesi aşıldığında çökme meydana gelir

---

## 📐 45 Derece Kuralı

3D baskıda genel kural: **45 dereceden daha dik açılı çıkıntılar destek gerektirir.**

### Neden 45 Derece?

Her yeni katman, alttaki katmandan belirli bir miktar dışarı taşabilir. 45 derecelik açıda, yeni katmanın yaklaşık %50''si alttaki katmanla örtüşür. Bu, çoğu malzeme ve yazıcı için yeterli destek sağlar.

### Açıya Göre Davranış

| Açı | Durum | Support Gerekli mi? |
|-----|-------|-------------------|
| 0-25° | Hafif eğim | ❌ Hayır |
| 25-45° | Orta eğim | ⚠️ Genellikle hayır |
| 45-60° | Dik eğim | ✅ Önerilir |
| 60-90° | Çok dik / dikey | ✅ Kesinlikle gerekli |
| 90°+ | Ters çıkıntı | ✅ Zorunlu |

### Malzemeye Göre Farklar

- **PLA:** 50-55° ye kadar desteksiz basabilir (soğuk durumda sert)
- **PETG:** 40-45° sınır (PLA''dan daha yumuşak)
- **ABS:** 45° standart sınır
- **TPU:** 35-40° (esnek malzeme daha erken sarkar)

---

## 🌳 Support Türleri

### 1. Normal / Lines Support (Çizgi Destek)

En temel destek türüdür. Düz çizgiler veya grid (ızgara) şeklinde oluşturulur.

**Avantajları:**
- Basit ve güvenilir
- Her slicer''da mevcuttur
- Hesaplaması hızlı

**Dezavantajları:**
- Çok malzeme kullanır
- Yüzeyde belirgin izler bırakır
- Sökmesi zor olabilir
- İç boşluklara erişim zorluğu

### 2. Tree Support (Ağaç Destek)

Bir ağacın dalları gibi tabandan başlayıp çıkıntılara ulaşan yapılardır. Cura''da popülerleşmiş, artık çoğu slicer''da mevcuttur.

**Avantajları:**
- ✅ Düz yüzeylere değmez (iz bırakmaz)
- ✅ Daha az malzeme kullanır (%30-50 tasarruf)
- ✅ Sökmesi çok daha kolay
- ✅ İç boşluklara dallanarak ulaşabilir

**Dezavantajları:**
- ❌ Slicelama süresi daha uzun
- ❌ Çok geniş düz overhang''lerde yetersiz kalabilir
- ❌ Bazı geometrilerde kararsız olabilir

### 3. Organic Support (Organik Destek)

PrusaSlicer ve OrcaSlicer''da bulunan gelişmiş destek türüdür. Tree support''un evrimleşmiş halidir.

**Avantajları:**
- ✅ Çok az malzeme kullanır
- ✅ Sökmesi en kolay destek türü
- ✅ Yüzey izleri minimal
- ✅ Estetik olarak daha düzgün

**Dezavantajları:**
- ❌ Slicelama süresi en uzun
- ❌ Her geometri için uygun değil
- ❌ Bazı durumlarda stabilitesi düşük

### 4. Paint-on Support (Manuel Destek)

Kullanıcının 3D model üzerinde fırça ile support bölgelerini belirlemesidir.

**Avantajları:**
- ✅ Tam kontrol sağlar
- ✅ Gereksiz supportları ortadan kaldırır
- ✅ Kritik yüzeyleri koruyabilirsiniz
- ✅ Support blocker ile birlikte çok güçlü

**Dezavantajları:**
- ❌ Zaman alır
- ❌ Deneyim gerektirir
- ❌ Her parça için manuel ayar

**Kullanım:** PrusaSlicer/OrcaSlicer''da modele sağ tıklayıp "Paint-on supports" seçin. Yeşil fırça ile support ekleyin, kırmızı fırça ile support''u engelleyin.

---

## 🔗 Interface (Arayüz) Katmanları

Interface katmanları, support yapısı ile asıl baskı arasında yer alan özel katmanlardır. Bu katmanlar daha yoğun basılır ve daha düz bir yüzey oluşturur.

### Neden Önemli?

Normal support, seyrek çizgilerden oluşur. Bu çizgilerin arasında boşluklar vardır. Baskının ilk katmanı bu boşlukların üzerine oturduğunda, boşluklara sarkar ve pürüzlü bir yüzey oluşur. Interface katmanları bu boşlukları doldurur.

### Önerilen Ayarlar

| Ayar | Değer | Açıklama |
|------|-------|----------|
| Interface katman sayısı | 1-2 | Genellikle 2 yeterli |
| Interface yoğunluğu | %80-100 | Düz yüzey için yüksek |
| Interface pattern | Lines veya Concentric | Düz yüzey sağlar |
| Top interface | ✅ Açık | Baskı-support arası |
| Bottom interface | İsteğe bağlı | Support-baskı arası |

### Interface İle ve Olmadan Fark

- **Interface olmadan:** Pürüzlü, dalgalı yüzey. Support izleri çok belirgin.
- **1 katman interface:** Belirgin iyileşme, hafif pürüz.
- **2 katman interface:** Düzgün yüzey, minimal iz.

---

## 📏 Support Density ve Mesafe Ayarları

### Support Density (Yoğunluk)

Support yoğunluğu, destek yapısının ne kadar dolu olduğunu belirler.

| Yoğunluk | Kullanım | Avantaj | Dezavantaj |
|-----------|----------|---------|------------|
| %5-10 | Kolay geometriler | Az malzeme, kolay söküm | Yetersiz destek olabilir |
| %15-20 | Genel kullanım | Dengeli | - |
| %25-30 | Zor geometriler | Güçlü destek | Sökmesi zor |
| %40+ | Kritik yüzeyler | Mükemmel destek | Çok malzeme, zor söküm |

**Genel öneri:** %15-20 çoğu baskı için idealdir.

### Support Z Distance (Z Mesafesi)

Support''un üst yüzeyi ile baskının alt yüzeyi arasındaki dikey mesafedir. Bu ayar, destek sökümünü en çok etkileyen parametredir.

| Z Distance | Sonuç |
|-----------|-------|
| 0.05-0.1mm | Çok sıkı yapışma, zor söküm, iyi yüzey |
| 0.15-0.2mm | Dengeli, kolay söküm, kabul edilebilir yüzey |
| 0.25-0.3mm | Çok kolay söküm, yüzey kalitesi düşer |

**Önerilen:** Genellikle 1 katman yüksekliği (0.2mm) idealdir.

### Support X/Y Distance

Support''un baskıdan yatay eksendeki mesafesidir.

- **Küçük mesafe (0.4-0.6mm):** Daha iyi destek, sökmesi zor
- **Büyük mesafe (0.8-1.2mm):** Kolay söküm, destek yetersiz kalabilir
- **Önerilen:** 0.6-0.8mm (2x nozzle çapı)

---

## 🛠️ Kolay Söküm İçin İpuçları

### 1. Doğru Z Distance Kullanın
- En etkili yöntem: Z distance''ı 1 katman yüksekliğine eşitleyin
- PLA için 0.2mm genellikle mükemmeldir
- PETG için 0.25mm daha iyi olabilir (yapışkan malzeme)

### 2. Interface Katmanları Kullanın
- 1-2 interface katmanı hem yüzey kalitesini artırır hem de daha temiz ayrılma sağlar
- Interface malzemesi farklı olabilir (çözünür malzeme)

### 3. Düşük Yoğunluk Tercih Edin
- %15-20 yoğunluk çoğu durumda yeterli
- Daha az malzeme = daha az yapışma noktası = kolay söküm

### 4. Support Blocker Kullanın
- Kritik yüzeylerde support''u engelleyin
- Yazıcının köprü (bridge) yapabildiği mesafelerde support gereksiz
- PrusaSlicer/OrcaSlicer: Sağ tık → Add support blocker

### 5. Söküm Araçları
- İğne burunlu pense
- Küçük düz tornavida
- Plastik spatula
- Deburring aracı (kenar temizleme)
- Jilet veya maket bıçağı (dikkatli kullanın)

### 6. Soğutma Yöntemi
- Baskıyı donduruculara koyun (30 dk)
- Soğuyan plastik büzülür ve support gevşer
- Özellikle PETG ve ABS için etkili

---

## 💧 Çözünür Destek Malzemeleri

### PVA (Polyvinyl Alcohol)
- **Çözücü:** Su (ılık su, 40-60°C)
- **Uyumlu:** PLA, PETG
- **Çözünme süresi:** 4-24 saat (geometriye bağlı)
- **Avantaj:** Mükemmel yüzey, sıfır söküm zahmeti
- **Dezavantaj:** Pahalı, neme hassas, yavaş baskı

### HIPS (High Impact Polystyrene)
- **Çözücü:** D-Limonene
- **Uyumlu:** ABS, ASA
- **Çözünme süresi:** 12-48 saat
- **Avantaj:** ABS ile mükemmel uyum
- **Dezavantaj:** D-Limonene pahalı ve kokulu

### Kullanım Şartları
- Dual extruder veya multi-material yazıcı gerekli
- Bambu Lab AMS ile PVA kullanılabilir
- Prusa MMU ile HIPS veya PVA
- Çözünür malzeme genellikle sadece interface katmanı olarak kullanılır (maliyet tasarrufu)

---

## 🔄 Destek İhtiyacını Azaltma

En iyi support, hiç support kullanmamaktır. Aşağıdaki tekniklerle support ihtiyacını minimize edebilirsiniz:

### 1. Model Yönlendirme (Orientation)
Modeli tablada farklı açılarda konumlandırarak overhang''leri azaltabilirsiniz. Slicer''da modeli döndürerek en az support gerektiren yönü bulun.

**Örnek:** Bir "T" şeklindeki parçayı dik basmak yerine yatay basarsanız support gerekmez.

### 2. 45° Kuralını Tasarımda Kullanın
Model tasarlarken tüm açıları 45° altında tutmaya çalışın. Dik kenarları 45° chamfer ile yumuşatın.

### 3. Köprü (Bridge) Tercih Edin
İki destek noktası arasındaki mesafe kısaysa, yazıcı köprü yapabilir. Çoğu yazıcı 30-50mm arasını desteksiz köprüleyebilir.

**Bridge ayarları:**
- Fan: %100 (maksimum soğutma)
- Hız: 20-30 mm/s (yavaş)
- Flow: %90-95 (hafif düşük)

### 4. Chamfer ve Fillet Kullanın
- **Chamfer:** 45° açılı kenar kesimi (support ihtiyacını ortadan kaldırır)
- **Fillet:** Yuvarlatılmış kenar (kısmen support azaltır)

### 5. Modeli Parçalara Bölün
Karmaşık bir modeli support gerektirmeyen parçalara bölüp ayrı basın, sonra yapıştırın.

---

## 🖥️ Slicer Ayarları

### Cura
- Support Type: Normal / Tree
- Support Density: %15-20
- Support Z Distance: 0.2mm
- Support X/Y Distance: 0.7mm
- Support Interface: Enable
- Support Interface Density: %80
- Support Overhang Angle: 45-50°

### PrusaSlicer / OrcaSlicer
- Support Style: Grid / Snug / Organic
- Support on build plate only / Everywhere
- Support Density: %15-20
- Contact Z Distance: 0.2mm (1 katman)
- Support Interface Layers: 2
- Support Interface Pattern: Rectilinear
- Paint-on Supports: Sağ tık → Paint-on supports

### Bambu Studio
- Support Type: Normal / Tree (Auto)
- Support Threshold Angle: 45°
- Support Density: %15
- Support Interface: Enable (2 katman)
- Tree support branch angle, diameter ayarlanabilir

---

## 🖨️ Yazıcıya Göre Özel Notlar

### Bambu Lab (X1C, P1S, A1)
- Tree support mükemmel çalışır (hızlı işlemci)
- AMS ile PVA çözünür support kullanılabilir
- Bambu Studio''daki auto support genellikle doğru kararlar verir
- X1C''de çok malzemeli support için AMS avantajı büyük
- Organic support hızlı slicelenir (güçlü donanım)

### Creality (Ender 3, Ender 5, K1)
- Cura''da tree support önerilir
- Ender 3''te çözünür support için dual extruder gerekli (donanım yükseltmesi)
- K1 serisi hızlı baskı ile tree support iyi sonuç verir
- Part cooling fanının yeterli olduğundan emin olun (overhang kalitesi için)

### Prusa (MK3S+, MK4, Mini+)
- PrusaSlicer''da organic support mükemmel
- MMU2S ile PVA/HIPS çözünür support
- Paint-on support özelliği çok gelişmiş
- MK4''te input shaper ile support baskı hızı artırılabilir

---

## ❓ SSS (Sıkça Sorulan Sorular)

### S: Tree support mu normal support mu kullanmalıyım?
**C:** Genel kural: düz geniş overhang''ler için normal support, karmaşık geometriler ve iç boşluklar için tree support. Yüzey kalitesi öncelikse tree support.

### S: Support sökerken parça kırıldı, ne yapmalıyım?
**C:** Z distance''ı artırın (0.25-0.3mm), yoğunluğu azaltın (%10-15), ve support sökerken parçayı sıcak suya batırın (PLA için ~60°C).

### S: "Support on build plate only" ne zaman kullanılır?
**C:** Model''in alt kısımlarında support gerekiyorsa ve üst kısımlarda support istemiyorsanız. Ancak iç boşluklardaki overhang''ler desteksiz kalır.

### S: Support interface ne kadar fark yaratır?
**C:** Çok büyük fark. Interface olmadan yüzey pürüzlü ve dalgalı olur. 2 katman interface ile neredeyse normal yüzey kalitesi elde edilir.

### S: Çözünür support maliyetine değer mi?
**C:** Karmaşık geometrilerde ve seri üretimde kesinlikle evet. Hobi kullanımında, tree support + iyi Z distance çoğu durumda yeterlidir.

### S: Support pattern olarak hangisini seçmeliyim?
**C:** Lines/Rectilinear en yaygın ve güvenilir. Grid daha güçlü ama sökmesi zor. Zig-zag sökmesi kolay ama daha az dayanıklı.

---

## 📚 İlgili Rehberler

- [Flow Kalibrasyonu Rehberi](/rehber/flow-akis-kalibrasyonu-rehberi)
- [Brim, Raft ve Skirt Rehberi](/rehber/brim-raft-skirt-ne-zaman-kullanilir-rehberi)
- [PETG Baskı Sorunları ve Çözüm Rehberi](/rehber/petg-baski-sorunlari-ve-cozumleri-rehberi)
- [Çok Renkli Baskı Sorunları](/rehber/cok-renkli-baski-sorunlari-ve-cozumleri-rehberi)

---

*Bu rehber 3D-labX topluluğu tarafından hazırlanmıştır. Sorularınız için [Topluluk Forumu](/topluluk) sayfamızı ziyaret edin.*',
  'Comprehensive guide to support structure optimization in 3D printing. Covers tree support, organic support, paint-on support, interface layers, soluble materials, and techniques to reduce support needs.',
  'Umfassende Anleitung zur Optimierung von Stützstrukturen beim 3D-Druck. Behandelt Tree-Support, organischen Support und Techniken zur Reduzierung des Stützbedarfs.',
  'sorun-cozumleri',
  'rehber',
  'https://images.unsplash.com/photo-1610081574260-e61e93e6e1aa?w=800&auto=format&fit=crop',
  1,
  'published',
  'tr',
  datetime('now'),
  datetime('now')
);

-- Article 4: Çok Renkli (Multi-Color) Baskı Sorunları ve Çözümleri
INSERT INTO posts (title_tr, title_en, title_de, slug, summary_tr, summary_en, summary_de, content_tr, content_en, content_de, category, post_type, image_url, published, status, language, created_at, updated_at) VALUES (
  'Çok Renkli (Multi-Color) Baskı Sorunları ve Çözüm Rehberi',
  'Multi-Color 3D Printing Problems and Solutions Guide',
  'Mehrfarbiger 3D-Druck: Probleme und Lösungsanleitung',
  'cok-renkli-baski-sorunlari-ve-cozumleri-rehberi',
  'Çok renkli 3D baskıda karşılaşılan sorunlar ve çözümleri. AMS, MMU, ERCF sistemleri, renk geçişi kirlenmesi, purge tower optimizasyonu ve filament uyumu.',
  'Problems and solutions in multi-color 3D printing. AMS, MMU, ERCF systems, color bleeding, purge tower optimization and filament compatibility.',
  'Probleme und Lösungen beim mehrfarbigen 3D-Druck. AMS, MMU, ERCF-Systeme und Purge-Tower-Optimierung.',
  '## 🎨 Çok Renkli (Multi-Color) Baskı Sorunları ve Çözüm Rehberi

> **TL;DR:** Çok renkli baskıda en yaygın sorun renk geçişlerinde kirlenme (color bleeding)dir. Purge tower boyutunu ve flush volume''u optimize ederek malzeme israfını %30-50 azaltabilirsiniz. Açık renkten koyu renge geçiş daha az purge gerektirir. AMS''de filament takılması genellikle PTFE tube bağlantısından kaynaklanır. Farklı malzeme türlerini (PLA+PETG) aynı baskıda karıştırmaktan kaçının.

---

## 📋 İçindekiler
1. Çok Renkli Baskı Yöntemleri
2. Renk Geçişlerinde Kirlenme
3. Filament Uyumu Sorunları
4. AMS Spesifik Sorunlar (Bambu Lab)
5. MMU Spesifik Sorunlar (Prusa)
6. Purge Tower Optimizasyonu
7. Slicer Ayarları
8. İleri Seviye: Renk Sırası Optimizasyonu
9. Yazıcıya Göre Özel Notlar
10. SSS

---

## 🔍 Çok Renkli Baskı Yöntemleri

### 1. AMS (Automatic Material System) - Bambu Lab
Bambu Lab''ın geliştirdiği otomatik filament değiştirme sistemidir. Dört filament yuvası içerir ve baskı sırasında otomatik olarak filament değiştirir.

**Uyumlu yazıcılar:** X1C, P1S, P1P, A1 (AMS Lite)
**Kapasite:** 4 filament (2 AMS bağlanarak 8, 4 AMS ile 16)
**Avantaj:** Kullanımı kolay, güvenilir, humidity kontrol (X1C)
**Dezavantaj:** Uzun PTFE tube, Bowden sistemi

### 2. MMU (Multi Material Upgrade) - Prusa
Prusa''nın çok malzemeli baskı çözümüdür. MMU2S ve MMU3 versiyonları mevcuttur.

**Uyumlu yazıcılar:** MK3S+, MK4 (MMU3)
**Kapasite:** 5 filament
**Avantaj:** Açık kaynak, topluluk desteği güçlü
**Dezavantaj:** Kurulumu ve kalibrasyonu zor, güvenilirlik sorunları (MMU2S)

### 3. ERCF (Enraged Rabbit Carrot Feeder) - Voron/Klipper
Açık kaynak topluluk projesidir. Klipper firmware kullanan yazıcılar için tasarlanmıştır.

**Uyumlu yazıcılar:** Klipper çalıştıran tüm yazıcılar
**Kapasite:** 6-12 filament (versiyona göre)
**Avantaj:** Tamamen açık kaynak, özelleştirilebilir
**Dezavantaj:** Kendin yap projesi, teknik bilgi gerektirir

### 4. Manuel Filament Değişimi
Slicer''da belirli katmanlarda baskıyı durdurarak kullanıcının filamenti değiştirmesi.

**Uyumlu yazıcılar:** Tüm yazıcılar
**Avantaj:** Ek donanım gerektirmez, ücretsiz
**Dezavantaj:** Sadece katman bazlı renk değişimi, operatör gerektirir

---

## 🔴 Renk Geçişlerinde Kirlenme (Color Bleeding)

### Sorun Nedir?
Bir renkten diğerine geçildiğinde, eski rengin kalıntıları yeni renke karışır. Özellikle koyu renkten açık renge geçişte çok belirgindir.

### Neden Oluşur?
1. **Nozzle''da kalan eski filament:** Nozzle''ın iç duvarlarına yapışan eski renk kalıntıları
2. **Melt zone''da karışım:** Eritme bölgesinde iki rengin karışması
3. **Yetersiz purge:** Eski rengi temizlemek için yeterli filament akıtılmaması
4. **PTFE tube''daki filament artıkları:** Uzun Bowden yollarında filament parçacıkları

### Çözüm: Purge (Temizleme) Optimizasyonu

#### Purge Miktarı Matrisi

Renk geçişinin yönü, gereken purge miktarını belirler:

| Geçiş | Gereken Purge | Açıklama |
|-------|--------------|----------|
| Açık → Koyu | Az (70-100mm³) | Koyu renk açık kalıntıyı maskeler |
| Koyu → Açık | Çok (150-300mm³) | Açık renkte koyu leke çok belirgin |
| Benzer renkler | Az (50-80mm³) | Karışım fark edilmez |
| Beyaz → Siyah | Az (60-80mm³) | Siyah her şeyi örter |
| Siyah → Beyaz | En çok (250-350mm³) | En zor geçiş |
| Renkli → Şeffaf | Çok (200-300mm³) | Şeffaf her kirliliği gösterir |

#### Purge into Infill Seçeneği
Purge malzemesini ayrı bir tower yerine baskının iç dolgu (infill) bölgesine yönlendirme seçeneğidir.

**Avantajları:**
- Purge tower''a gerek kalmaz (alan tasarrufu)
- Malzeme israfı azalır
- Baskı süresi kısalır

**Dezavantajları:**
- İç dolgu renkleri karışık olur
- Şeffaf parçalarda kullanılamaz
- Yapısal güç etkilenebilir

### Flush Volume Matrisi (Bambu Studio)

Bambu Studio''da her renk çifti için ayrı flush volume ayarı yapılabilir. Bu matris sayesinde gereksiz purge''u azaltabilirsiniz.

**Nasıl ayarlanır:**
1. Bambu Studio''da baskı ayarlarına gidin
2. "Flush volumes" bölümünü açın
3. Her renk çiftinin geçiş miktarını ayarlayın
4. Açık→koyu geçişleri azaltın, koyu→açık geçişleri artırın

---

## 🧵 Filament Uyumu Sorunları

### Farklı Markalar Arası Gerilim
Farklı markaların PLA''ları bile farklı katkı maddeleri içerir. Bu farklılıklar:
- Farklı erime sıcaklıkları
- Farklı büzülme oranları
- Katmanlar arası yapışma farklılıkları
- Renk karışım sorunları

**Çözüm:** Mümkünse aynı marka ve serinin farklı renklerini kullanın.

### Farklı Malzeme Türleri

⚠️ **DİKKAT:** Farklı malzeme türlerini çok renkli baskıda karıştırmak çoğu durumda sorun yaratır!

| Kombinasyon | Uyumluluk | Notlar |
|-------------|-----------|--------|
| PLA + PLA | ✅ İyi | Farklı renkler sorunsuz |
| PETG + PETG | ✅ İyi | Aynı marka önerilir |
| PLA + PVA | ✅ İyi | Çözünür support için ideal |
| PLA + PETG | ❌ Kötü | Yapışma ve sıcaklık uyumsuzluğu |
| ABS + HIPS | ✅ İyi | Çözünür support için ideal |
| ABS + PLA | ❌ Kötü | Sıcaklık farkı çok büyük |
| TPU + PLA | ⚠️ Zor | Sadece ileri seviye |

### Sıcaklık Uyumsuzluğu
Farklı malzemelerin farklı baskı sıcaklıkları gerekir. Çok renkli baskıda nozzle sıcaklığını her filament değişiminde ayarlamak gerekir.

- **Bambu Studio:** Her filament için ayrı sıcaklık profili otomatik uygulanır
- **PrusaSlicer:** Filament değişiminde sıcaklık geçişi G-code ile yönetilir
- **Sıcaklık bekleme süresi:** Baskı süresini önemli ölçüde uzatır

---

## 📦 AMS Spesifik Sorunlar (Bambu Lab)

### 1. Filament Takılması
**Belirtiler:** AMS filamenti yükleyemez veya geri çekemez
**Nedenler:**
- PTFE tube bükülmesi veya ezilmesi
- Filament ucu şekil bozukluğu (tip forming hatası)
- AMS hub''daki bağlantı gevşekliği

**Çözümler:**
- PTFE tube''u kontrol edin, bükülme varsa düzeltin
- Filament ucunu temiz kesin (45° açılı kesim)
- AMS hub bağlantılarını sıkılaştırın
- "Retry" seçeneğini kullanın, genellikle ikinci denemede çalışır

### 2. PTFE Tube Bağlantıları
**Sorun:** Uzun PTFE yolu sürtünme yaratır
**Çözümler:**
- PTFE tube''ları düzenli aralıklarla değiştirin
- Tube''ları mümkün olduğunca düz tutun
- Capricorn PTFE tube''a yükseltme yapın (daha düşük sürtünme)

### 3. Humidity (Nem) Kontrolü
AMS''nin kapalı yapısı filamentleri nemden kısmen korur, ancak:
- X1C AMS''de aktif nem kontrolü vardır
- P1S/A1 AMS''de pasif koruma
- Neme hassas filamentler (Nylon, TPU, PVA) için ek kurutma gerekebilir
- Silica gel paketlerini düzenli değiştirin

### 4. Buffer Sorunları
**Sorun:** Filament geri çekilirken buffer''da takılma
**Çözümler:**
- Buffer tube''un düzgün yerleştiğinden emin olun
- AMS''yi yazıcının üstüne yerleştirin (yerçekimi yardımı)
- Filament yolunda kıvrım olmadığını kontrol edin

---

## 🔧 MMU Spesifik Sorunlar (Prusa)

### 1. Filament Yükleme/Boşaltma
**Sorun:** MMU filamenti yükleyemez veya boşaltamaz
**Çözümler:**
- Filament uçlarını temiz ve düz kesin
- PTFE tube''ları kontrol edin
- Ekstrüder giriş dişlisini temizleyin
- Selector sorunlarını kontrol edin

### 2. Selector Sorunları
**Sorun:** Selector doğru filament yuvasını seçemez
**Çözümler:**
- Selector''ın mekanik hareketini kontrol edin
- Homing kalibrasyonu yapın
- Selector blade''i temizleyin
- SuperFINDA sensörünü kontrol edin

### 3. IR Sensör Kalibrasyonu
**Sorun:** IR sensör filamenti algılayamıyor
**Çözümler:**
- Sensör penceresini temizleyin
- Kalibrasyon testini çalıştırın
- Filament yolunun temiz olduğundan emin olun
- Şeffaf veya çok açık filamentlerde algılama sorunu olabilir

### MMU3 İyileştirmeleri
Prusa MMU3, MMU2S''ye göre önemli iyileştirmeler getirmiştir:
- Daha güvenilir filament algılama
- Gelişmiş tip forming (uç şekillendirme)
- Daha az takılma
- Kolay kurulum ve bakım

---

## 🗼 Purge Tower Optimizasyonu

Purge tower, çok renkli baskının en büyük malzeme israfı kaynağıdır. Optimizasyon ile israfı %30-50 azaltabilirsiniz.

### Boyut Küçültme
- Purge tower''ın boyutunu minimum tutun
- Çok küçük yaparsanız stabilite kaybeder (devrilir)
- Önerilen minimum boyut: 10x10mm

### Stabilite Artırma
- Brim ekleyin (purge tower''a özel)
- Köşeleri yuvarlatın
- Her katmanda tam doldurma yapın

### Purge Miktarı Azaltma
1. **Flush volume matrisini kullanın:** Her renk çifti için minimum değerleri test edin
2. **Renk sırasını optimize edin:** Benzer renkler ardışık gelsin
3. **Purge into infill:** Mümkünse purge''u iç dolguya yönlendirin
4. **Purge into support:** Support kullanıyorsanız purge''u support''a yönlendirin

### Pratik Purge Volume Değerleri (Bambu Lab AMS)

| Geçiş Türü | Önerilen Volume |
|-------------|----------------|
| Beyaz → Siyah | 60-80mm³ |
| Siyah → Beyaz | 250-300mm³ |
| Açık → Orta | 80-120mm³ |
| Orta → Koyu | 60-100mm³ |
| Koyu → Açık | 200-280mm³ |
| Benzer renkler | 40-60mm³ |

---

## 🖥️ Slicer Ayarları

### Bambu Studio
- Multi-color baskı: Plate → Add filament ile renk ekleyin
- Flush volume: Filament → Flush volumes matrix
- Purge tower: Others → Prime tower
- Purge into infill: Flush into objects → Flush into this object''s infill
- Filament sıcaklıkları: Her filament profili için ayrı ayar
- Wipe tower rotation: Purge tower''ı her katmanda döndürme

### PrusaSlicer
- Multi-color: Printer Settings → General → Extruders: 1 (MMU ile)
- Wipe tower: Print Settings → Multiple Extruders → Enable Wipe tower
- Purge volume: Wipe tower → Purging volumes → Filament color specific
- Ramming: Print Settings → Multiple Extruders → Ramming settings

### OrcaSlicer
- Bambu Studio ile benzer arayüz
- Flush volume matrisi mevcut
- Prime tower ayarları detaylı
- Çoklu yazıcı desteği

---

## 🚀 İleri Seviye: Filament Renk Sırası Optimizasyonu

Çok renkli baskıda filament değişim sayısını ve purge miktarını azaltmak için renk sırasını optimize edebilirsiniz.

### Strateji 1: Benzer Renkleri Grupla
Aynı tonlardaki renkleri ardışık kullanın. Örneğin: açık mavi → koyu mavi → siyah

### Strateji 2: Koyu → Açık Geçişlerini Minimize Et
En çok purge gerektiren geçiş koyu→açık''tır. Baskınızı bu geçişler minimum olacak şekilde planlayın.

### Strateji 3: Purge Objesi Kullan
Purge tower yerine, aynı anda bastığınız küçük bir objeyi purge objesi olarak kullanabilirsiniz. Bu obje karışık renklerle basılır ama ana baskınız temiz olur.

### Strateji 4: Katman Bazlı Renk Planlaması
Mümkünse tasarımınızı katman bazlı renk değişimine uygun yapın. Bu şekilde aynı katmanda minimum renk değişimi olur.

---

## 🖨️ Yazıcıya Göre Özel Notlar

### Bambu Lab (X1C, P1S, A1)
- AMS güvenilirliği genel olarak yüksek
- X1C''de kapalı ortam + AMS humidity kontrolü en iyi kombinasyon
- A1 Mini + AMS Lite ile uygun fiyatlı çok renkli baskı
- Bambu Studio''daki flush volume matrisi çok güçlü bir araç
- LAN modu''nda AMS bazen yavaşlayabilir

### Creality
- Creality''nin CFS (Creality Filament System) yeni bir çözüm
- K1 serisi ile uyumlu
- AMS''ye alternatif olarak geliştirilmekte
- Topluluk desteği henüz sınırlı

### Prusa (MK3S+, MK4)
- MMU3 önceki versiyonlara göre çok daha güvenilir
- MMU2S kullanıcıları MMU3''e yükseltme yapabilir
- PrusaSlicer''daki wipe tower ayarları detaylı
- Açık kaynak topluluk iyileştirmeleri mevcut

---

## ❓ SSS (Sıkça Sorulan Sorular)

### S: Çok renkli baskı ne kadar daha fazla filament harcar?
**C:** Purge tower nedeniyle genellikle %20-40 daha fazla filament harcanır. Purge into infill kullanarak bu oranı %10-20''ye düşürebilirsiniz.

### S: AMS''siz çok renkli baskı yapabilir miyim?
**C:** Evet, manuel filament değişimi ile katman bazlı renk değişikliği yapabilirsiniz. Slicer''da "Color Change" G-code ekleyerek baskıyı durdurur ve filamenti değiştirirsiniz.

### S: Farklı marka PLA''ları AMS''de karıştırabilir miyim?
**C:** Evet, ancak aynı marka kullanmak daha iyi sonuç verir. Farklı markaların farklı erime sıcaklıkları renk geçişini etkileyebilir.

### S: Purge tower çok büyük, nasıl küçültürüm?
**C:** Flush volume değerlerini düşürün, purge into infill kullanın, ve renk sırasını optimize edin. Ancak tower''ı çok küçültürseniz stabilite kaybeder.

### S: Çok renkli baskıda hangi filament türü en iyi sonuç verir?
**C:** PLA en kolay ve güvenilir sonuç verir. PETG de uygun ama stringing riski daha yüksek. ABS kapalı ortam gerektirir.

### S: AMS''de filament sürekli takılıyorsa ne yapmalıyım?
**C:** PTFE tube''ları kontrol edin, filament uçlarını temiz kesin, AMS hub bağlantılarını sıkılaştırın. Sorun devam ederse Bambu Lab destek ekibine başvurun.

---

## 📚 İlgili Rehberler

- [Flow Kalibrasyonu Rehberi](/rehber/flow-akis-kalibrasyonu-rehberi)
- [Brim, Raft ve Skirt Rehberi](/rehber/brim-raft-skirt-ne-zaman-kullanilir-rehberi)
- [Destek Yapıları Optimizasyonu](/rehber/destek-yapilari-support-optimizasyonu-rehberi)
- [PETG Baskı Sorunları ve Çözüm Rehberi](/rehber/petg-baski-sorunlari-ve-cozumleri-rehberi)

---

*Bu rehber 3D-labX topluluğu tarafından hazırlanmıştır. Sorularınız için [Topluluk Forumu](/topluluk) sayfamızı ziyaret edin.*',
  'Comprehensive guide to multi-color 3D printing problems and solutions. Covers AMS, MMU, ERCF systems, color bleeding, purge tower optimization, and filament compatibility issues.',
  'Umfassende Anleitung zu Problemen und Lösungen beim mehrfarbigen 3D-Druck. Behandelt AMS, MMU, ERCF-Systeme und Purge-Tower-Optimierung.',
  'sorun-cozumleri',
  'rehber',
  'https://images.unsplash.com/photo-1702863361902-93c51bfbd923?w=800&auto=format&fit=crop',
  1,
  'published',
  'tr',
  datetime('now'),
  datetime('now')
);

-- Article 5: PETG Baskı Sorunları ve Çözüm Rehberi
INSERT INTO posts (title_tr, title_en, title_de, slug, summary_tr, summary_en, summary_de, content_tr, content_en, content_de, category, post_type, image_url, published, status, language, created_at, updated_at) VALUES (
  'PETG Baskı Sorunları ve Çözüm Rehberi: Stringing''den Yapışmaya Her Şey',
  'PETG Printing Problems and Solutions Guide: From Stringing to Adhesion',
  'PETG-Druckprobleme und Lösungsanleitung: Von Stringing bis Haftung',
  'petg-baski-sorunlari-ve-cozumleri-rehberi',
  'PETG filament ile 3D baskıda karşılaşılan tüm sorunlar ve çözümleri. Stringing, tablaya fazla yapışma, nem hassasiyeti, retraction ayarları ve optimal baskı parametreleri.',
  'All problems and solutions when 3D printing with PETG filament. Stringing, over-adhesion, moisture sensitivity, retraction settings and optimal print parameters.',
  'Alle Probleme und Lösungen beim 3D-Drucken mit PETG-Filament. Stringing, Feuchtigkeitsempfindlichkeit und optimale Druckparameter.',
  '## 🔧 PETG Baskı Sorunları ve Çözüm Rehberi

> **TL;DR:** PETG, PLA''nın kolay baskısı ile ABS''nin dayanıklılığını birleştirir. En büyük sorunu stringing''dir (ipliklenme) - retraction ayarlarını optimize edin (Direct Drive: 1-3mm, Bowden: 4-6mm) ve sıcaklığı 225-235°C aralığında tutun. Tablaya fazla yapışma sorunu için glue stick veya Z-offset artırma uygulayın. PETG neme hassastır, kurutma (65°C, 4-6 saat) ve kuru saklama şarttır.

---

## 📋 İçindekiler
1. PETG Nedir?
2. PETG''nin Avantajları ve Karşılaştırma
3. Stringing (İpliklenme) Sorunu
4. Tablaya Fazla Yapışma
5. Nem Hassasiyeti
6. Yüzey Kalitesi Sorunları
7. Optimal PETG Ayarları
8. Slicer Ayarları
9. Yazıcıya Göre Özel Notlar
10. Türkiye''de Popüler PETG Markalar
11. SSS

---

## 🔍 PETG Nedir?

PETG (Polyethylene Terephthalate Glycol-modified), PET plastik ailesinin 3D baskı için modifiye edilmiş halidir. Günlük hayatta su şişeleri ve gıda ambalajlarında kullanılan PET''in glikol eklenmiş versiyonudur.

PETG, 3D baskı dünyasında "en iyi iki dünyanın birleşimi" olarak kabul edilir: PLA''nın kolay baskı özelliklerini ve ABS''nin mekanik dayanıklılığını bir araya getirir.

### PETG''nin Temel Özellikleri

| Özellik | Değer |
|---------|-------|
| Baskı sıcaklığı | 220-250°C |
| Tabla sıcaklığı | 70-85°C |
| Cam geçiş sıcaklığı | ~80°C |
| Çekme dayanımı | ~50 MPa |
| Kopma uzaması | %15-20 |
| Yoğunluk | 1.27 g/cm³ |
| Nem emme | Orta-Yüksek |

---

## ⚡ PETG''nin Avantajları ve Karşılaştırma

### PETG''nin Avantajları

1. **Mekanik Dayanıklılık:** PLA''dan %30-40 daha güçlü, darbe direnci yüksek
2. **Kimyasal Direnç:** Birçok asit, baz ve solvente dayanıklı
3. **Esneklik:** PLA gibi kırılgan değil, bükülme ve darbelere karşı dayanıklı
4. **Gıdaya Uygunluk:** FDA onaylı versiyonları gıda temasına uygun
5. **UV Direnci:** ABS''den daha iyi UV dayanımı
6. **Düşük Büzülme:** ABS''ye göre çok daha az warping
7. **Kokusuz Baskı:** ABS gibi kötü koku yaymaz
8. **Kapalı Ortam Gerektirmez:** Açık yazıcılarda sorunsuz basılabilir

### Karşılaştırma Tablosu

| Özellik | PLA | PETG | ABS |
|---------|-----|------|-----|
| Baskı kolaylığı | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Dayanıklılık | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Esneklik | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Isı direnci | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Warping | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Stringing | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| Yüzey kalitesi | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Koku | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Fiyat | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

---

## 🕸️ Stringing (İpliklenme) Sorunu

PETG''nin en yaygın ve en sinir bozucu sorunu stringing''dir. İnce iplik şeklinde plastik telleri, baskı parçaları arasında ve travel (boş hareket) yolları boyunca oluşur.

### Neden PLA''dan Daha Kötü?

1. **Düşük viskozite:** PETG erimiş halde PLA''dan daha akışkandır
2. **Yüksek nem emme:** Nemli PETG çok daha fazla string yapar
3. **Geniş sıcaklık aralığı:** Yüksek sıcaklık = daha fazla akışkanlık = daha fazla string
4. **Yapışkan doğası:** PETG eritilmiş halde yapışkan bir malzemedir

### Çözüm 1: Retraction Ayarlarını Optimize Edin

Retraction, nozzle travel yaparken filamenti geri çekerek akışı durdurma işlemidir.

#### Direct Drive Ekstrüder

| Ayar | Başlangıç | Optimum Aralık |
|------|-----------|---------------|
| Retraction Distance | 1.5mm | 1-3mm |
| Retraction Speed | 35mm/s | 25-45mm/s |
| Retraction Prime Speed | 30mm/s | 20-35mm/s |
| Z Hop | 0.2mm | 0.1-0.4mm |

#### Bowden Ekstrüder

| Ayar | Başlangıç | Optimum Aralık |
|------|-----------|---------------|
| Retraction Distance | 5mm | 4-6mm |
| Retraction Speed | 40mm/s | 30-50mm/s |
| Retraction Prime Speed | 35mm/s | 25-40mm/s |
| Z Hop | 0.2mm | 0.1-0.4mm |

⚠️ **DİKKAT:** PETG''de retraction distance''ı çok yüksek tutmak heat break''te tıkanmaya yol açabilir. Özellikle all-metal hotend kullanıyorsanız dikkatli olun.

### Çözüm 2: Sıcaklığı Düşürün

PETG''nin önerilen aralığı 220-250°C''dir, ancak stringing için:

1. Sıcaklık kulesi (temperature tower) basın
2. 5°C aralıklarla test edin (245°C → 240°C → 235°C → 230°C → 225°C)
3. En az stringing yapan ve hala iyi katman yapışması olan sıcaklığı seçin
4. Genellikle **225-235°C** aralığı en iyi sonucu verir

### Çözüm 3: Travel Speed Artırın

Hızlı travel, nozzle''ın boş hareketlerde daha az süre geçirmesini sağlar ve string oluşumunu azaltır.

- **Önerilen travel speed:** 150-250 mm/s
- Bambu Lab yazıcılarda 300+ mm/s travel mümkün
- Çok yüksek travel ivme sorunlarına dikkat

### Çözüm 4: Wiping ve Coasting

**Wiping (Silme):** Nozzle, retraction yapmadan önce baskının kenarında hareket ederek fazla malzemeyi siler.
- Cura: "Wipe Distance" ayarı
- PrusaSlicer: "Wipe while retracting" seçeneği

**Coasting (Serbest Akış):** Ekstrüzyon, hattın sonundan biraz önce durdurulur. Nozzle''daki basınç kalan yolu tamamlar.
- Cura: "Coasting" ayarı (0.1-0.3mm³)
- Stringing''i azaltır ama çok yüksek değer eksik ekstrüzyona yol açar

---

## 🔒 Tablaya Fazla Yapışma Sorunu

### Neden Sorun?

PETG, PEI tablalara çok güçlü yapışabilir. Bu durumda:
- Parçayı çıkarırken tabla yüzeyi hasar görebilir
- PEI kaplama soyulabilir
- Parça kırılabilir (tabladan sökerken)
- Cam tabla kırılabilir

### Çözüm 1: Yapışma Yüzeyi Seçimi

| Yüzey | PETG Uyumu | Notlar |
|-------|-----------|--------|
| Smooth PEI | ⚠️ Çok yapışır | **Asla doğrudan basmayın!** |
| Textured PEI | ✅ İdeal | En iyi seçenek |
| Cam + Glue Stick | ✅ İyi | Glue stick ayırıcı görevi görür |
| Cam + Hairspray | ✅ İyi | İnce bir kat yeterli |
| BuildTak / PEX | ✅ İyi | Alternatif yüzey |

⚠️ **KRİTİK UYARI:** PETG''yi smooth PEI tablaya doğrudan basmak tablayı kalıcı olarak hasar verebilir! Mutlaka glue stick veya hairspray kullanın.

### Çözüm 2: Z-Offset Ayarı

PETG için Z-offset, PLA''dan biraz daha yüksek tutulmalıdır:
- PLA Z-offset: Standart (squish)
- PETG Z-offset: +0.02 ile +0.05mm daha yüksek
- İlk katman çok ezilmemeli, hafif yapışma yeterli
- "Baby stepping" ile baskı sırasında ince ayar yapın

### Çözüm 3: İlk Katman Sıcaklığı

İlk katman tabla sıcaklığını biraz düşürmek yapışmayı kontrol altına alabilir:
- Normal tabla sıcaklığı: 80°C
- İlk katman: 75°C
- Sonraki katmanlar: 80°C

### Parça Çıkarma İpuçları
1. Tablayı soğumaya bırakın (oda sıcaklığına)
2. Spring steel plate''i esnetin
3. Plastik spatula kullanın (metal spatula tablayı çizer)
4. IPA (izopropil alkol) ile kenarları gevşetin
5. Dondurucu yöntemi: Tablayı 15 dk buzluğa koyun

---

## 💧 Nem Hassasiyeti

### PETG''nin Nem Emme Hızı

PETG, PLA''dan daha hızlı nem emer. Nemli PETG ile baskı yapmak ciddi kalite sorunlarına yol açar:

| Durum | Sonuç |
|-------|-------|
| Kuru PETG | Temiz yüzey, minimal stringing |
| Hafif nemli | Artmış stringing, küçük kabarcıklar |
| Nemli | Çok fazla stringing, pürüzlü yüzey, patlama sesleri |
| Çok nemli | Kullanılamaz, sürekli patlama ve bozuk katmanlar |

### Nem Belirtileri
- Baskı sırasında "çıtırtı" veya "patlama" sesleri
- Nozzle''dan buhar çıkması
- Aşırı stringing
- Kabarcıklı ve pürüzlü yüzey
- Zayıf katman yapışması
- Filament gevrek ve kırılgan

### Kurutma Ayarları

| Yöntem | Sıcaklık | Süre | Notlar |
|--------|----------|------|--------|
| Filament kurutucu | 65°C | 4-6 saat | En güvenilir yöntem |
| Fırın (düşük) | 60-65°C | 4-6 saat | Sıcaklığı kontrol edin! |
| Gıda kurutucu | 65°C | 6-8 saat | Yavaş ama etkili |
| Yazıcı tabla | 70-80°C | 4-6 saat | Rulo tablanın üzerinde |

⚠️ **DİKKAT:** 70°C''nin üzerinde kurutma PETG''yi deforme edebilir!

### Saklama Önerileri
1. **Vakumlu poşet + silica gel:** En ekonomik yöntem
2. **Kuru kutu (dry box):** Hygrometer ile nem takibi
3. **PETG nem hedefi:** %15''in altında bağıl nem
4. **Açık bırakma süresi:** Maksimum 24-48 saat (nemli ortamda)
5. **AMS kullanıyorsanız:** AMS''nin nem koruması sınırlı, ek önlem alın

---

## 🔍 Yüzey Kalitesi Sorunları

### Blob ve Zit (Lekeler ve Sivilceler)

PETG''de blob (damla) ve zit (sivilce) oluşumu PLA''dan daha yaygındır.

**Nedenler:**
- Retraction sonrası fazla prime
- Seam (dikiş) noktasında fazla malzeme
- Çok yüksek sıcaklık

**Çözümler:**
- Retraction prime amount''u azaltın
- "Wipe" ve "Coast" ayarlarını aktifleştirin
- Seam pozisyonunu "Aligned" veya "Rear" yapın
- Sıcaklığı 5°C düşürün

### Kötü Overhang Performansı

PETG''nin overhang performansı PLA''dan belirgin şekilde düşüktür.

**Nedenler:**
- Daha yüksek baskı sıcaklığı
- Daha yavaş soğuma
- Daha düşük viskozite

**Çözümler:**
- Fan hızını artırın (%50-70, ancak %100 katman yapışmasını zayıflatır)
- Overhang bölgelerinde hızı düşürün
- Support kullanın (45° yerine 40° eşik açısı)
- Baskı sıcaklığını düşürün

### Parlak vs Mat Yüzey
- **Parlak yüzey:** Düşük fan (%20-30), yüksek sıcaklık (240-245°C)
- **Mat yüzey:** Yüksek fan (%60-80), düşük sıcaklık (225-230°C)
- Katman çizgileri PETG''de PLA''dan daha belirgin olabilir

---

## 📊 Optimal PETG Ayarları Tablosu

### Temel Ayarlar

| Parametre | Önerilen Aralık | Başlangıç Değeri |
|-----------|----------------|-----------------|
| **Nozzle sıcaklığı** | 225-245°C | 230°C |
| **Tabla sıcaklığı** | 70-85°C | 80°C |
| **Fan hızı** | %30-60 | %50 |
| **İlk katman fan** | %0-10 | %0 |
| **Baskı hızı** | 40-60 mm/s | 50 mm/s |
| **İlk katman hızı** | 15-25 mm/s | 20 mm/s |
| **Travel hızı** | 150-250 mm/s | 200 mm/s |
| **Retraction (DD)** | 1-3mm | 2mm |
| **Retraction (Bowden)** | 4-6mm | 5mm |
| **Retraction hızı** | 25-45 mm/s | 35 mm/s |
| **Flow rate** | %90-95 | %93 |
| **Katman yüksekliği** | 0.15-0.3mm | 0.2mm |

### İleri Seviye Ayarlar

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| Coast | 0.1-0.2mm³ | Stringing azaltma |
| Wipe distance | 2-5mm | Nozzle silme |
| Z-hop | 0.2-0.4mm | Nozzle kaldırma |
| Combing mode | Not in skin | Yüzey kalitesi |
| Minimum layer time | 10-15s | Soğuma süresi |
| Bridge flow | %90-95 | Köprü akışı |
| Bridge speed | 20-30 mm/s | Köprü hızı |
| Bridge fan | %100 | Maksimum soğutma |

---

## 🖥️ Slicer Ayarları

### Cura
- Material: Generic PETG profili başlangıç noktası
- Retraction Distance: 2mm (DD) / 5mm (Bowden)
- Retraction Speed: 35mm/s
- Print Temperature: 230°C
- Build Plate Temperature: 80°C
- Fan Speed: %50
- Coasting: Enable (0.1mm³)
- Z Hop: 0.2mm
- Combing Mode: Not in Skin

### PrusaSlicer / OrcaSlicer
- Filament: Prusament PETG profili başlangıç noktası
- Nozzle Temperature: 230°C (first layer 235°C)
- Bed Temperature: 80°C (first layer 85°C)
- Cooling: Min fan %30, Max fan %60
- Retraction Length: 0.8mm (DD, Prusa MK4) / 4mm (Bowden)
- Retraction Speed: 35mm/s
- Wipe While Retracting: Enable
- Lift Z: 0.2mm

### Bambu Studio
- Filament: PETG profili seçin veya oluşturun
- Nozzle Temperature: 230-240°C
- Plate Temperature: 80°C
- Fan Speed: %40-60
- Retraction: Otomatik (genellikle 0.8-1.2mm)
- Flow Ratio: 0.93-0.95

---

## 🖨️ Yazıcıya Göre Özel Notlar

### Bambu Lab (X1C, P1S, A1)
- **Textured PEI plate PETG için ideal** (smooth plate''de glue stick kullanın)
- Direct drive ekstrüder ile düşük retraction yeterli
- Bambu PETG Basic profili iyi bir başlangıç noktası
- AMS''de PETG kullanırken nem kontrolüne dikkat
- X1C kapalı ortamda PETG mükemmel sonuç verir
- Flow dynamics calibration PETG için de yapılmalı

### Creality (Ender 3, Ender 5, K1)
- **Ender 3 cam tablada glue stick zorunlu**
- Bowden tube ile retraction 5-6mm önerilir
- Stock Ender 3 hotend PETG için yeterli (all-metal daha iyi)
- K1 serisi direct drive ile PETG performansı iyi
- K1''de Creality Print PETG profili kullanılabilir
- Part cooling fanı PETG''de %40-50 yeterli

### Prusa (MK3S+, MK4, Mini+)
- **Smooth PEI''de PETG basmayın!** Textured PEI veya satin kullanın
- MK4 direct drive ile retraction 0.8mm yeterli
- PrusaSlicer''daki Prusament PETG profili mükemmel başlangıç
- Mini+ Bowden ile retraction 3.5-4.5mm
- Input shaper ile PETG hızı artırılabilir (60-80 mm/s)

---

## 🇹🇷 Türkiye''de Popüler PETG Markalar

### Filamix PETG
- **Fiyat aralığı:** Orta
- **Renk seçenekleri:** Geniş
- **Baskı sıcaklığı:** 230-240°C
- **Kalite:** Tutarlı çap, az stringing
- **Özel notlar:** Türkiye''nin en yaygın yerli markası

### Porima PETG
- **Fiyat aralığı:** Orta-Üst
- **Renk seçenekleri:** Orta
- **Baskı sıcaklığı:** 225-240°C
- **Kalite:** İyi çap toleransı
- **Özel notlar:** İstanbul merkezli üretim

### Elas3D PETG
- **Fiyat aralığı:** Orta
- **Renk seçenekleri:** Sınırlı
- **Baskı sıcaklığı:** 230-245°C
- **Kalite:** Mekanik dayanıklılık yüksek
- **Özel notlar:** Endüstriyel uygulamalara uygun

### İthal Markalar
- **eSUN PETG:** Uygun fiyat, iyi kalite, geniş renk seçeneği
- **Polymaker PolyLite PETG:** Premium kalite, düşük stringing
- **Prusament PETG:** En iyi çap toleransı (±0.02mm)
- **Bambu Lab PETG Basic:** AMS ile optimum uyum

---

## 💡 Genel Önleme İpuçları

1. **Her zaman kuru filament kullanın:** Kurutucu veya kuru kutu şart
2. **Sıcaklık testi yapın:** Her yeni rulo için temperature tower basın
3. **Z-offset''i ayrı kaydedin:** PLA ve PETG için farklı Z-offset
4. **İlk katmanı gözleyin:** PETG''de ilk katman PLA''dan daha kritik
5. **Glue stick bulundurun:** Acil yapışma sorunları için
6. **Travel hızını yüksek tutun:** Stringing''in en kolay çözümü
7. **Fan''ı aşırı kullanmayın:** Katman yapışmasını zayıflatır
8. **Sabırlı olun:** PETG, PLA''dan daha yavaş basılmalıdır

---

## ❓ SSS (Sıkça Sorulan Sorular)

### S: PETG mi ABS mi kullanmalıyım?
**C:** Kapalı ortamınız (enclosed printer) yoksa PETG. PETG warping yapmaz, kokusuz ve ABS''ye yakın dayanıklılıktadır. ABS sadece yüksek ısı direnci (>80°C) gerektiğinde tercih edilmelidir.

### S: PLA yazıcımda PETG basabilir miyim?
**C:** Çoğu PLA yazıcısı PETG de basabilir. 250°C''ye çıkabilen hotend ve 80°C tabla yeterlidir. All-metal hotend önerilir ama PTFE lined hotend 240°C''ye kadar dayanır.

### S: PETG gıdaya uygun mu?
**C:** Ham PETG malzemesi gıdaya uygundur ancak FDM baskıda katmanlar arası mikro boşluklar bakteri üremesine uygun ortam yaratır. Gıda teması için food-safe epoksi kaplama önerilir.

### S: PETG dış mekanda kullanılabilir mi?
**C:** Evet, PETG UV direnci PLA ve ABS''den daha iyidir. Ancak uzun süreli doğrudan güneş ışığında zaman içinde bozulma görülebilir. ASA dış mekan için daha iyidir.

### S: Stringing''i tamamen ortadan kaldırmak mümkün mü?
**C:** Tamamen ortadan kaldırmak çok zordur. Ancak doğru retraction, düşük sıcaklık, kuru filament ve yüksek travel hızıyla %90+ azaltma mümkündür. Kalan küçük string''ler ısı tabancası ile temizlenebilir.

### S: PETG ile köprü (bridge) yapılabilir mi?
**C:** Evet ama PLA kadar iyi değildir. Fan''ı %100''e çıkarın, hızı 20-25 mm/s''ye düşürün ve flow''u %90-95 yapın. 20-30mm köprü mesafesi genellikle sorunsuz.

### S: PETG neden PLA''dan daha pahalı?
**C:** Ham madde maliyeti, üretim sürecinin karmaşıklığı ve daha sıkı kalite kontrolü PETG''yi PLA''dan %15-30 daha pahalı yapar. Ancak dayanıklılık farkı göz önüne alındığında uzun vadede ekonomik olabilir.

---

## 📚 İlgili Rehberler

- [Flow Kalibrasyonu Rehberi](/rehber/flow-akis-kalibrasyonu-rehberi)
- [Brim, Raft ve Skirt Rehberi](/rehber/brim-raft-skirt-ne-zaman-kullanilir-rehberi)
- [Destek Yapıları Optimizasyonu](/rehber/destek-yapilari-support-optimizasyonu-rehberi)
- [Çok Renkli Baskı Sorunları](/rehber/cok-renkli-baski-sorunlari-ve-cozumleri-rehberi)

---

*Bu rehber 3D-labX topluluğu tarafından hazırlanmıştır. Sorularınız için [Topluluk Forumu](/topluluk) sayfamızı ziyaret edin.*',
  'Comprehensive guide to PETG 3D printing problems and solutions. Covers stringing, bed adhesion, moisture sensitivity, retraction settings, optimal print parameters, and popular PETG brands in Turkey.',
  'Umfassende Anleitung zu PETG 3D-Druckproblemen und Lösungen. Behandelt Stringing, Haftung, Feuchtigkeitsempfindlichkeit und optimale Druckparameter.',
  'sorun-cozumleri',
  'rehber',
  'https://images.unsplash.com/photo-1597765206558-6f4e06954f2f?w=800&auto=format&fit=crop',
  1,
  'published',
  'tr',
  datetime('now'),
  datetime('now')
);
