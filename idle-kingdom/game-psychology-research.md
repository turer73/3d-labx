# Idle/Incremental Oyun Tasarimi icin Psikoloji Arastirmasi

## Hazirlanma Amaci
Bu belge, bir idle kingdom oyunu tasarimi icin insan psikolojisi, renk psikolojisi ve bilissel yanliliklari (cognitive biases) bilimsel temelleriyle incelemekte ve her birinin somut uygulama orneklerini sunmaktadir.

---

# BOLUM 1: INSAN PSIKOLOJISI VE OYUN TASARIMI

---

## 1.1 Dopamin Donguleri ve Degisken Oranli Pekistirme Programlari
### (Dopamine Loops & Variable Ratio Reinforcement Schedules)

### Bilimsel Aciklama
Dopamin, beyindeki odul sistemiyle iliskili bir norotransmitterdir. Onemli bir nokta: dopamin aslinda odulun kendisinden degil, **odul beklentisinden** salgılanir. Belirsizlik iceren durumlarda dopamin salgilanmasi daha da artar. Bu, evrimsel olarak insanlarin belirsiz ama potansiyel olarak odul iceren davranislari tekrarlamasini saglayan bir mekanizmadir.

Degisken oranli pekistirme programi (variable ratio reinforcement schedule), bir davranisiin ortalama belirli bir sayida tekrardan sonra, ama her seferinde farkli aralikta odullendirilmesidir. Bu program, en yuksek ve en surdurulebilir davranis oranlari uretir. Kumar makineleri bu prensibin en bilinen ornegidir.

Neden bu kadar etkili? Cunku beyin her denemede "belki bu sefer" dusuncesiyle dopamin salgilar. Sabit oranli (her 10 aksiyonda bir odul) veya sabit aralikli (her 5 dakikada bir odul) programlara kiyasla, degisken oranli program cok daha direncli davranis kaliplari olusturur -- yani oyuncu odulsuz kaldigi donemlerde bile oynamaya devam eder.

### Idle/Incremental Oyunlara Uygulanisi
Idle oyunlar dogalari geregi tekrarli mekanikler uzerine kuruludur. Degisken oranli pekistirme, bu tekrari bagimlilık yaratan bir deneyime donusturur:

- **Loot/Ganimet Sistemleri**: Dusman olduruldugunde her seferinde ayni seyi degil, rastgele kalitede esya dusmesi
- **Kritik Vurus Mekanikleri**: Belirli bir olasilikla ekstra hasar veya ekstra kaynak kazanma
- **Gizemli Sandiklarr**: Acildiginda ne cikacagi belli olmayan odul kutulari
- **Uretim Bonuslari**: Uretim binalarinin rastgele zamanlarda 2x-5x bonus uretmesi

### Somut Uygulama Ornegi (Idle Kingdom)
**"Kraliyet Hazine Sandigi" Sistemi:**
- Oyuncu her 50-150 monster oldurdugunde (degisken aralik) bir sandik dusuyor
- Sandigin icindeki odul %60 bronz, %25 gumus, %10 altin, %4 elmas, %1 efsanevi
- Sandik acilirken 2 saniyelik animasyon: sandik titrer, parlak isiklar cikar, renk degisir
- Acilma animasyonu sirasinda beyin "ne cikacak?" sorusuyla maksimum dopamin uretir
- Efsanevi esya ciktiginda ekran parlar, konfeti efekti, ozel ses efekti calir

---

## 1.2 B.F. Skinner'in Operant Kosullanmasi
### (Skinner's Operant Conditioning)

### Bilimsel Aciklama
B.F. Skinner'in operant kosullanma teorisi, davranislarin sonuclari tarafindan sekillendirildlgini one surer. Dort temel mekanizma vardir:

1. **Pozitif Pekistirme (Positive Reinforcement)**: Davranisa hosnut edici bir sey eklenir (odul verilir)
2. **Negatif Pekistirme (Negative Reinforcement)**: Davranisla rahatsiz edici bir sey kaldirilir (acidan kurtulma)
3. **Pozitif Ceza (Positive Punishment)**: Davranisa rahatsiz edici bir sey eklenir
4. **Negatif Ceza (Negative Punishment)**: Davranisla hosnut edici bir sey kaldirilir

Skinner, "Skinner Kutusu" deneyleriyle gostermistir ki, hayvanlar (ve insanlar) odul ve ceza kaliplarina gore davranislarini sistematik olarak degistirirler. Ozellikle intermittent (aralikli) pekistirme, surekli pekistirmeden cok daha guclu davranis kaliplari olusturur.

### Idle/Incremental Oyunlara Uygulanisi
Idle oyunlarin tamamlanmis bir Skinner Kutusu olarak gorulmesi mumkundur:

- **Pozitif Pekistirme**: Tiklama = altin kazanma, upgrade = daha fazla altin, prestij = daha hizli ilerleme
- **Negatif Pekistirme**: Oyuna donme = birikimis kaynaklari toplama (kayip korkusundan kurtulma)
- **Negatif Ceza**: Uzun sure girmezsen askerler aclıktan guc kaybeder (FOMO yaratir)
- **Degisken Pekistirme Programi**: Boss savaslari, sandik odul sistemi, rastgele etkinlikler

### Somut Uygulama Ornegi (Idle Kingdom)
**Cok Katmanli Pekistirme Sistemi:**
```
Katman 1 (Surekli): Her tiklama = +1 altin (aninda geri bildirim)
Katman 2 (Sabit Oranli): Her 100 altin = yeni bina acilir
Katman 3 (Degisken Oranli): Rastgele olasilikla "Altin Yagmuru" eventi
Katman 4 (Sabit Aralikli): Her 4 saatte "Gunluk Hazine"
Katman 5 (Degisken Aralikli): 2-6 saat araliginda "Gezgin Tuccar" gelir
```
Bu katmanli yaklasim, oyuncunun her an en az bir pekistirme dongusunun icsinde olmasini saglar.

---

## 1.3 Akis Durumu Teorisi (Flow State - Csikszentmihalyi)

### Bilimsel Aciklama
Mihaly Csikszentmihalyi'nin Akis (Flow) teorisi, insanlarin bir aktiviteye tamamen daldigi, zaman algisinin degistigi ve ic motivasyonun doruk noktasina ulastigi optimal deneyim durumunu tanimlar.

Akis durumunun gerektirdigi kosullar:
1. **Beceri-Zorluk Dengesi**: Gorev ne cok kolay (sikinti) ne cok zor (kaygi) olmali
2. **Net Hedefler**: Oyuncu ne yapmasi gerektigini bilmeli
3. **Aninda Geri Bildirim**: Her aksiyonun sonucu hemen gorunmeli
4. **Kontrol Hissi**: Oyuncu durumu kontrol ettigini hissetmeli
5. **Dikkat Yogunlasmasi**: Dikkat dagitici unsurlar minimize edilmeli
6. **Ic Motivasyon**: Aktivite kendi basina tatmin edici olmali

Akis durumunda prefrontal korteksin aktivitesi degisir (transient hypofrontality), zamana ve benlige dair farkindalik azalir. Bu durum bagimlilık yapici derecede tatmin edicidir.

### Idle/Incremental Oyunlara Uygulanisi
Idle oyunlarin paradoksu: basit mekaniklerle akis durumu nasil yaratilir?

- **Dinamik Zorluk**: Oyuncunun seviyesine gore dusman gucu otomatik ayarlama
- **Katmanli Karmasiklik**: Basit basla, yeni mekanikler kademeli olarak ac
- **Optimizasyon Akisi**: Oyuncuya hangi upgrade'in en verimli oldugunu hesaplama firsati ver
- **Mikro ve Makro Hedefler**: Anlik hedefler (bir sonraki upgrade) + uzun vadeli hedefler (prestij)
- **Otomatik Hiz Ayari**: Ilerleme yavaskayinca yeni mekanik ac, hızlaninca zorlugu artir

### Somut Uygulama Ornegi (Idle Kingdom)
**Adaptif Zorluk ve Katmanli Hedef Sistemi:**
- Baslangic: Sadece "tiklayarak altin topla" (basit, anlasilir)
- 2 dakika sonra: "Oduncu kulubesi in et" kilidisi acilir (yeni mekanik)
- 5 dakika: "Madenci" acilir, kaynak cesitliligi artar
- 15 dakika: "Savasc gonder" mekanigi (aktif karar verme)
- 30 dakika: "Buyucu Kulesi" - sinerji bonuslari baslar (optimizasyon akisi)
- Eger oyuncu cok hizli ilerliyorsa: daha guclu dusmanlar ve daha karmasik kaynak gereksinimleri
- Eger oyuncu yavaslyorsa: "Kraliyet Yardimi" pop-up ile boost teklifi

---

## 1.4 Kayiptan Kacinma ve Batik Maliyet Yanilgisi
### (Loss Aversion & Sunk Cost Fallacy)

### Bilimsel Aciklama
**Kayiptan Kacinma (Loss Aversion)**: Daniel Kahneman ve Amos Tversky'nin Beklenti Teorisi'ne (Prospect Theory, 1979) gore, insanlar kaybetmenin acisini, ayni miktarda kazanmanin sevincinden yaklasik 2-2.5 kat daha siddetli hisseder. Yani 100 TL kaybetmenin yarattigi olumsuz duygu, 100 TL kazanmanin yarattigi olumlu duygudan cok daha buyuktur.

**Batik Maliyet Yanilgisi (Sunk Cost Fallacy)**: Insanlar, geri alinamayacak yatirimlari (zaman, para, emek) gozonune alarak gelecek kararlari etkilerler. Rasyonel olarak gecmis yatirimlar gelecek kararlari etkilememeli, ama insanlar "bu kadar emek verdim, simdi birakamayi" diye dusunur.

Bu iki bias birlikte calisir: oyuncu hem kaybetmekten korkar hem de harcadigi zamani "bosa gitmis" hissetmek istemez.

### Idle/Incremental Oyunlara Uygulanisi
- **Streak Sistemleri**: Gunluk giris serisi -- bozulursa sifirdan baslar (kayip korkusu)
- **Decay Mekanikleri**: Girilmezse kaynaklarin azalmasi
- **Prestij Trade-off**: Ilerlemeyi sifirlamak ama kalici bonus kazanmak (kayip + kazanc dengelemesi)
- **Toplama Koleksiyonlari**: %90 tamamlanmis koleksiyon birakma isteksizligi
- **Zaman Yatirimi Gostergesi**: "Bu kralliga 47 saat harcadin" gostergesi (batik maliyet hatirlatici)

### Somut Uygulama Ornegi (Idle Kingdom)
**"Kraliyet Mirasi" Streak Sistemi:**
- Her gun giris yapan oyuncuya artan oduller: Gun 1: 100 altin, Gun 7: 1000 altin + nadir esya, Gun 30: Efsanevi kahraman
- Streak bozulursa: "Kralliginiz sizi ozledi! 3 gun icinde donun, streak korunur" (kayip azaltma penceresi)
- Prestij sistemi: "Krallığı yıkıp yeniden kur, ama her seferinde %25 daha hızlı basla"
- Profil ekraninda: "Toplam oynama suresi: 120 saat | Toplanan kaynak: 15M | Yenilen boss: 234"

---

## 1.5 FOMO - Kacirma Korkusu (Fear of Missing Out)

### Bilimsel Aciklama
FOMO, baskalari bir deneyimi yasarken kendisinin disarida kalma korkusudur. Sosyal psikolojide "social comparison theory" (Leon Festinger, 1954) ve "self-determination theory"deki iliskilenme (relatedness) ihtiyaciyla baglantilidir.

Norobilimsel olarak FOMO, amygdala (korku merkezi) ve anterior insular cortex (sosyal aci) aktivasyonuyla iliskilidir. Beyni icin sosyal dislanma fiziksel aci ile ayni bolgeleri aktive eder (Eisenberger, 2003).

FOMO, ozellikle sinirli sureli firsatlar ve sosyal karsilastirma ortamlarinda guclu bir motivator olarak calisir.

### Idle/Incremental Oyunlara Uygulanisi
- **Sinirli Sureli Etkinlikler**: "Kis Festivali - sadece 7 gun!" ile ozel oduller
- **Kacan Firsatlar**: Belirli saatlerde ortaya cikan ve kacirilirsa giden teklifler
- **Sosyal Siralamalar**: "Arkadaslarin arasinda 5. siradasin" gostergesi
- **Ozel Sezon Icerikleri**: Sadece belirli donemlerde erisilebilir kahramanlar/binalar

### Somut Uygulama Ornegi (Idle Kingdom)
**"Gezgin Tuccar" Zamana Duyarli Sistemi:**
- Her 4-8 saatte bir "Gizemli Tuccar" kralliga gelir
- Sadece 30 dakika kalir, sonra gider
- Normalde satin alinamayan ozel esyalar satar (ornek: "Ejderha Yumurtasi - sadece bugun!")
- Bildirim: "Gezgin Tuccar kralligina geldi! 28 dakika kaldi..."
- Gittikten sonra: "Gezgin Tuccar gitti. Ejderha Yumurtasini kacirdin." (hafif pismanlik)
- Haftalik ozel boss: "Buz Krali bu hafta sonu saldiriyor! Yenmezsen 1 ay daha gelmez."

---

## 1.6 Sahiplik Etkisi (Endowment Effect)

### Bilimsel Aciklama
Richard Thaler tarafindan tanimlanan sahiplik etkisi, insanlarin sahip olduklari seylere, sahip olmadiklarindan daha yuksek deger bicmesidir. Klasik deneyde, bir bardak verilen kisiler onu satmak icin ~7$ isterken, ayni bardagi almak isteyenler sadece ~3$ odemeye raziydi.

Bu etki, kayiptan kacinma ile yakindan iliskilidir: bir seye sahip oldugumuzda, onu kaybetmek kayip olarak kodlanir. "Status quo bias" ile de baglantidir -- mevcut durumu degistirmeye direniyoruz cunku mevcut durumda "sahip oldugumuz" seyleri kaybetmekten korkuyoruz.

### Idle/Incremental Oyunlara Uygulanisi
- **Kisisellestirme**: Oyuncu kralligini/sehirini kendi zevkine gore tasarlarsa, ona daha fazla baglanir
- **Isimlendirme**: Kahramanlara ve binalara isim verme olanagi
- **Ilerleme Gorsellestirmesi**: Kraliyet haritasinda buyumeyi gormek ("bu benim kraligim!")
- **Deneme Sureli Premium**: 3 gunluk premium ozellik ver, sonra geri al (kaybetme acisi)

### Somut Uygulama Ornegi (Idle Kingdom)
**"Kendi Kraligini Tasarla" Sistemi:**
- Oyuncu kralligin adini koyar: "Ejderha Vadisi Kralligi"
- Binalarin yerini harita uzerinde kendisi secer
- Kahraman isimleri ve kiyafetleri ozellestirilebilir
- 7 gunluk "Kraliyet VIP" deneme surumu: x2 kazanc, ozel bina skinleri, VIP tuccar erisimi
- 7 gun sonra: "VIP suren doldu. x2 kazancin ve ozel gorunumler kaldiriliyor..."
- Bu noktada oyuncu "kendi" ozelliklerini kaybetmemek icin satin alma motivasyonu yuksektir

---

## 1.7 Zeigarnik Etkisi (Tamamlanmamis Gorev Motivasyonu)

### Bilimsel Aciklama
Sovyet psikolog Bluma Zeigarnik 1927'de kesfetti ki insanlar tamamlanmamis gorevleri, tamamlanmis gorevlerden %90 daha iyi hatirlar. Bunun nedeni, tamamlanmamis bir gorev zihinsel bir "acik dongu" yaratir ve beyin bu donguyu kapatmak icin surekli bir durtü hisseder.

Bu etki, calisan bellekteki (working memory) acik gorev temsilleriyle ilgilidir. Gorev tamamlanmadigi surece, beyin onu aktif tutar ve "bitirme" durtüsü yaratir. Bu, televizyon dizilerinin bolum sonu "cliffhanger"lariyla ayni psikolojik mekanizmadir.

### Idle/Incremental Oyunlara Uygulanisi
- **Gorev Zincirleri**: Bir gorevi bitirince bir sonraki hemen gorunur (hep bir "acik dongu" olsun)
- **Koleksiyon Sistemleri**: 9/10 tamamlanmis koleksiyon, son parcayi bulma dutrüsü yaratir
- **Ilerleme Cubuklari**: %87 tamamlanmis bir upgrade cubugu gormek, bitirme ihtiyaci doğurur
- **Bolum Sonu Ipuclari**: "Bir sonraki bolgede ejderhalar var..." gibi acik uclu ipuclari

### Somut Uygulama Ornegi (Idle Kingdom)
**"Kraliyet Gorev Defteri" Sistemi:**
- Ana gorev zinciri: Her gorev tamamlaninca sonraki gorev kilidi acilir + ipucu gosterilir
  - "Oduncu Kulubesi yap" -> (tamamlandi) -> "Tahta Kale yap" -> ??? (kilit ikonu + "Gizemli yapı...")
- Koleksiyon kitabi: "Orman Yaratiklari: 7/10 kesfedildi" -- bos slotlar soru isaretli
- Her oturumda "Yarim Kalan Gorevler" pop-up'i: "Boss Saldirisi %73 tamamlandi - bitirmek ister misin?"
- Haftalik gorev cubugu: Pazartesi baslayan 7 gorev, her biri tamamlandikca cubuk dolar
- Oyundan cikarken: "Madenin %89 dolu - biraz daha bekle, altin tasiyor!"

---

## 1.8 Nir Eyal'in Hook Modeli
### (Trigger -> Action -> Variable Reward -> Investment)

### Bilimsel Aciklama
Nir Eyal "Hooked: How to Build Habit-Forming Products" (2014) kitabinda dort adimli bir aliskanlik dongüsü modeli sunmustur:

1. **Tetikleyici (Trigger)**: Davranisi baslatan uyarici
   - Dis tetikleyiciler: Bildirimler, e-postalar, reklamlar
   - Ic tetikleyiciler: Sikinti, yalnizlik, belirsizlik, FOMO
2. **Aksiyon (Action)**: Odul beklentisiyle yapilan en basit davranis (BJ Fogg'un davranis modeli: Motivasyon + Yetenek + Tetikleyici)
3. **Degisken Odul (Variable Reward)**: Uc tur odul
   - Avci Odulu (Rewards of the Hunt): Bilgi, kaynak arama (scrolling, arama)
   - Suru Odulu (Rewards of the Tribe): Sosyal onay, begeniler, statü
   - Benlik Odulu (Rewards of the Self): Ustalasmma, tamamlama, yeterlilik hissi
4. **Yatirim (Investment)**: Kullanicinin sisteme bir sey katmasi (zaman, veri, emek, para, sosyal sermaye)

Yatirim asamasi kritiktir cunku:
- Bir sonraki tetikleyiciyi yukler
- Batik maliyet yaratir
- Sahiplik etkisini gucelendirir
- Sistemi kisisellestirir

### Idle/Incremental Oyunlara Uygulanisi

| Hook Asamasi | Idle Oyun Uygulamasi |
|---|---|
| Tetikleyici (Dis) | "Kaynalklarin dolu!" push bildirimi |
| Tetikleyici (Ic) | "Acaba ne kadar birikmistir?" merak duygusu |
| Aksiyon | Oyunu ac, bir tiklama yap |
| Degisken Odul | Ne kadar kaynak biriktigini gor (bazen surpriz bonus) |
| Yatirim | Yeni bina in et, upgrade yap, kahraman egit |

### Somut Uygulama Ornegi (Idle Kingdom)
**Tam Hook Dongüsü Tasarimi:**
```
DONGU 1 (5 dakikalik):
  Tetikleyici: "Maden dolu!" bildirimi
  Aksiyon: Oyunu ac, madene tikla
  Degisken Odul: 500-2000 arasi rastgele altin + %10 nadir tas sansi
  Yatirim: Altinla yeni maden seviyesi yukselt

DONGU 2 (Saatlik):
  Tetikleyici: "Gezgin Tuccar geldi!" bildirimi
  Aksiyon: Tuccara git, esyalari incele
  Degisken Odul: Her seferinde farkli, bazen cok degerli esyalar
  Yatirim: Esya satin al, kahramana tak (kisiselestirme)

DONGU 3 (Gunluk):
  Tetikleyici: "Gunluk gorev yenilendi" + streak korkusu (ic)
  Aksiyon: Gunluk gorevi baslat
  Degisken Odul: Gorev odulu + bonus sandik + streak odulu
  Yatirim: Streak sayacı artar, koleksiyon ilerler

DONGU 4 (Haftalik):
  Tetikleyici: "Haftalik Boss saldiriyor!" + sosyal siralama (ic)
  Aksiyon: Orduyu hazirla, boss'a saldır
  Degisken Odul: Boss loot (degisken kalite) + siralama puani
  Yatirim: Skor tablosu pozisyonu, klan katkilari
```

---

## 1.9 Yakin Iskalama Etkisi (Near-Miss Effect)

### Bilimsel Aciklama
Yakin iskalama etkisi, bir hedefi "neredeyse" basarmanin, tamamen kaybetmekten daha fazla motivasyon yarattigi olgusudur. Norobilimsel arastirmalar gosteriyor ki yakin iskalamalarda beyin, kazanma durumuna benzer dopamin aktivasyonu gosterir (Clark et al., 2009). Kumar makinelerindeki "iki kiraz geldi, ucuncusu gelmedi" durumu bunun klasik ornegidir.

Beyin yakin iskalamay "neredeyse basardim, bir daha denesem basaririm" olarak yorumlar. Bu, aslinda tamamen rastgele bir olayda bile yetenek/ilerleme algilanmasina neden olur. Sonuc: oyuncu denemey birakmak yerine tekrar dener.

### Idle/Incremental Oyunlara Uygulanisi
- **Boss Savaslari**: Boss'un %2 canla kalmasi ("az kaldi!")
- **Gacha/Cekilis Sistemleri**: Efsanevi esyanin bir altindaki seviyenin daha sik cikmasi
- **Upgrade Denemeleri**: "%85 basari sansi" olan upgrade'in ara sira basarisiz olmasi
- **Siralama Tablolari**: "1. siraya 50 puan kaldi!" gostergesi

### Somut Uygulama Ornegi (Idle Kingdom)
**"Ejderha Boss" Yakin Iskalama Sistemi:**
- Boss saglik cubugu: Oyuncu yenildiginde boss'un kalan cani gosterilir
- Eger oyuncu yenilirse ve boss'un cani %15'in altindaysa: "AZ KALDI! Boss'un sadece %12 cani kalmisti!"
- Yenilgi ekraninda: "Savascilarini 1 seviye yukseltsen kazanirdin!" onerisi
- "Intikam Saldirisi" butonu: Hemen tekrar savas, +%10 bonus gucle (hic para odemeden)
- Sonraki giriste: "Ejderha hala yaralı! %12 canla bekliyor. Simdis ans!" hatirlatmasi

---

## 1.10 Baglilik Tirmandirmasi (Escalation of Commitment)

### Bilimsel Aciklama
Barry Staw'in (1976) kavramsallastirdigi baglilik tirmandirmasi, bir karar yoluna ne kadar kaynak (zaman, para, emek) yatirilmissa, basarisizlik iskareti olsa bile o yola devam etme egiliminin artmasidir. "Concorde Yanilgisi" olarak da bilinir (Concorde ucagı projesi zarar ediyordu ama yatirildigi icin devam edildi).

Psikolojik mekanizmalar:
- **Oz-dogrulama ihtiyaci**: "Kararim yanlisti" kabul etmek ego icin acı vericidir
- **Batik maliyet**: Gecmis yatirimi kurtarma cabasii
- **Belirsizlik azaltma**: Devam etmek, vazgecmekten daha az bilissel celiski (cognitive dissonance) yaratir
- **Toplumsal baski**: Baskalarina karsi "kararimi dogrulamaliyim" hissi

### Idle/Incremental Oyunlara Uygulanisi
- **Uzun Vadeli Projeler**: 7 gunluk "Mega Kale" insasi -- 5 gun gecmisken birakılmaz
- **Sezon Passlari**: 100 seviyeli sezon pass, 60. seviyeye gelmis oyuncu birakamaz
- **Guild/Klan Baglilik**: Klan icin harcanan emek, klandan ayrilmayi zorlastirir
- **Prestij Zinciri**: Her prestij sureci oncekinden daha uzun ama daha odullü

### Somut Uygulama Ornegi (Idle Kingdom)
**"Antik Piramit" Uzun Sureli Proje Sistemi:**
- Piramit insasi: 14 gun sürer, her gun malzeme gerekir
- Gun 1-3: Temel atma (kolay malzeme)
- Gun 4-7: Duvarlar (orta zorlukta)
- Gun 8-12: Ic mekanlar (zor, nadir malzeme)
- Gun 13-14: Altin kaplama (cok nadir malzeme)
- Her asama tamamlandiginda gorsel olarak piramit buyur
- 10. gunde birakma: "Piramidin %70'i tamam! Sadece 4 gun daha!"
- Odul sadece tam tamamlandiginda verilir: Efsanevi "Firavun Tacı" + kalici %15 uretim bonusu
- Yari birakanlar: Tamamlanmamis piramit haritada "yikin" olarak kalir (gorsel hatirlatici)

---

# BOLUM 2: RENK PSIKOLOJISI VE GORSEL ETKILER

---

## 2.1 Harcama Davranisini Tetikleyen Renkler

### Bilimsel Aciklama
Renk psikolojisi arastirmalari (ozellikle pazarlama baglaminda) belirli renklerin belirli duygusal ve davranissal tepkilerle iliskilendigini gostermistir. Bu iliski hem kulturel hem de biyolojik kokenlidir.

Harcama davranisini etkileyen temel renk ilkeleri:
- **Sicak renkler** (kirmizi, turuncu, sari) metabolizma ve kalp atisini arttirir, dürtüsel (impulsive) davranisi tesvik eder
- **Soguk renkler** (mavi, yesil) rahatlatici etki yaratir, güven ve sadakat olusturur
- **Kontrast ve Parlaklik**: Yüksek kontrast dikkat ceker, parlak renkler aciliyet hissi yaratir

Arastirmalar gosteriyor ki restoran ve magaza tasarimlarinda kirmizi/turuncu kullanimi musteri harcamasini artirabilir, cunku bu renkler dürtüsel karar vermeyi tesvik eder.

### Idle/Incremental Oyunlara Uygulanisi
Renk stratejisi, oyunun her katmaninda bilineli olarak kullanilmalidir:
- **Satin Alma Butonlari**: Sicak renkler (turuncu, kirmizi-turuncu) -- dürtüsel tiklama
- **Premium Iccerik**: Altin ve mor -- lüks ve nadirlik algilam
- **Kaynak Gostergeleri**: Yesil (saglikli/büyüme) -- pozitif geri bildirim
- **Arka Plan**: Koyu-mavi veya koyu tonlar -- premium his, kontrast artisi

### Somut Uygulama Ornegi (Idle Kingdom)
**Renk Paleti Haritasi:**
```
SATIN ALMA ALANI:
  - "Satin Al" butonu: #FF6B35 (canli turuncu) -- dürtüsel tiklama
  - Indirimli fiyat: #FF0000 (kirmizi) -- aciliyet
  - Premium ozellik cercevesi: #FFD700 (altin) + #9B59B6 (mor) gradyan

OYUN ALANI:
  - Altin gostergesi: #FFD700 (altin) -- deger
  - Saglik cubugu: #2ECC71 (yesil) -- canlilik
  - Hasar sayilari: #FF4444 (kirmizi) -- guc hissi
  - XP cubugu: #3498DB (mavi) -- ilerleme ve güven
  - Nadir esya parlamasi: #E74C3C (kirmizi) -> #F39C12 (turuncu) animasyon

ANA MENU:
  - Arka plan: #1A1A2E (koyu lacivert) -- derinlik, premium
  - Aktif butonlar: #E94560 (koyu pembe-kirmizi) -- dikkat cekici
  - Pasif butonlar: #5C5C7A (gri-mor) -- ikincil
```

---

## 2.2 Aciliyet Yaratan Renkler (Kirmizi ve Turuncu)

### Bilimsel Aciklama
Kirmizi renk, insan fizyolojisi uzerinde olculebilir etkilere sahiptir:
- Kalp atisini hizlandirir
- Adrenal aktivasyonu arttirir
- Dikkat ve uyarilma (arousal) seviyesini yükseltir
- Zaman algisini bozar (zamani daha hizli gecer gibi hissettirir)

Turuncu, kirmizinin aciliyetini sarinin iyimserligiyle birlestirir. Pazarlama arastirmalarinda "call to action" butonlari icin en etkili renklerden biri olarak gorulmustur. Amazon'un "Add to Cart" butonu turuncu, YouTube'un abone butonu kirmizidir -- bu tesadufi degildir.

Andrew Elliot ve Markus Maier'in (2007) arastirmalari, kirmizinin "kacinma motivasyonu" (avoidance motivation) yarattioini -- yani kirmizi bir sinyal goruldugunde beyin "hemen harekete gec, yoksa kaybedersin" mesaji aldigini gostermistir.

### Idle/Incremental Oyunlara Uygulanisi
- **Sinirli Sure Sayaclari**: Kirmizi renkte geri sayim ("02:34 kaldi!")
- **Boss Uyarilari**: Ekran kenarlari kirmiziya doner ("Boss saldiriyor!")
- **Son Sansa Teklilfleri**: Turuncu arka planli pop-up ("Son 5 dakika! %50 indirim!")
- **Kaynak Azalmasi**: Kaynak cubuklari azaldikca yesil -> sari -> kirmizi renk degistirir

### Somut Uygulama Ornegi (Idle Kingdom)
**Kirmizi/Turuncu Aciliyet Sistemi:**
- Tuccar timer: Yesil (>20dk) -> Sari (10-20dk) -> Turuncu (5-10dk) -> Kirmizi yanip sonen (<5dk)
- Boss saldirisi: Ekran kenarlari kirmizi "pulse" efekti, her 3 saniyede bir parlama
- Sinirli teklif pop-up: Turuncu (#FF8C00) arka plan, beyaz metin, "FIRSAT!" etiketi kirmizi (#FF0000)
- Geri sayim sayaci: Son 60 saniyede rakamlar kirmizi yaner ve sallanma animasyonu yapar
- Stok gostergesi: "Sadece 3 tane kaldi!" kirmizi metin, yanip sonen arka plan

---

## 2.3 Güven Yaratan Renkler (Mavi)

### Bilimsel Aciklama
Mavi, dünya genelinde en cok sevilen ve güven uyandiran renk olarak kabul edilir. Bunun nedenleri:
- Mavi gokyuzu ve temiz su ile evrimsel olarak guvenli ortam cagrisimi yapar
- Kalp atisini yavaslatir, sakinlestirici etki yaratir
- Profesyonellik ve guvenilirlik algilanir (Facebook, Twitter, LinkedIn, Samsung, IBM -- hepsi mavi)
- "Cool" (soguk) renk olarak rasyonel düsünceyi tesvik eder

Arastirmalar gosteriyor ki mavi, ozellikle finansal islemlerde ve kisisel bilgi paylasiminda güveni artirir. E-ticaret sitelerindeki "guvenli odeme" badgeleri genellikle mavi tonlarinda olur.

### Idle/Incremental Oyunlara Uygulanisi
- **Satin Alma Onay Ekranlari**: Mavi arka plan -- "guvenli islem" hissi
- **Hesap ve Kayit**: Mavi tonlar -- kisisel bilgilerin güvende oldugu mesaji
- **Ilerleme ve Istatistik Panelleri**: Mavi -- rasyonel, bilgi temelli his
- **Uzun Vadeli Hedefler**: Mavi tonlarda -- sabirli, güvenilir ilerleme

### Somut Uygulama Ornegi (Idle Kingdom)
**Mavi Güven Alanlari:**
- Satin alma onay diyalogu: Mavi (#2196F3) cerceve, "Guvenli Islem" ikonu (kalkan + onay isareti)
- Kaydetme gostergesi: Mavi animasyonlu "Oyun Kaydedildi ✓" bilirimi
- Istatistik paneli: Koyu mavi (#1565C0) arka plan, beyaz/acık mavi grafikler
- "Banka" binasi: Mavi tema, "Altinlarin güvende!" mesaji
- Premium magaza: Mavi-mor gradyan alt alan ("Güvenli Odeme" rozeti)

---

## 2.4 Altin/Sari ve Odul Algisi

### Bilimsel Aciklama
Altin renk, insanlik tarihinin en eski deger semboludr. Psikolojik etkileri:
- **Deger ve Zenginlik**: Altin, binlerce yildir servet ve statü ile iliskilendirilmistir
- **Basari ve Zafer**: Altin madalyalar, kupalar, taçlar -- birinciligin rengi
- **Nadirlik Algisi**: Altin degerli metal oldugu icin altin renk otomatik olarak nadirlik sinyali verir
- **Dikkat Cekme**: Sari-altin tonlari gorsel hiyerarsidde en yuksek dikkat cekiclige sahiptir
- **Iyimserlik ve Enerji**: Sarinin sicakligi + altinin prestiji birlikte pozitif duygu yaratir

Nörobilimsel olarak, altin renginde bir odul gorumu beynin ventral striatum'unda (odul merkezi) aktivasyon yaratir. Oyun tasariminda altin renk "bu degerli" evrensel mesajidir.

### Idle/Incremental Oyunlara Uygulanisi
- **Para Birimi**: Ana para birimi altin renginde gosterilir
- **Odul Animasyonlari**: Altin parcacik efektleri, parlama
- **Seviye Atlama**: Altin arka plan parlama efekti
- **Nadir/Efsanevi Esyalar**: Altin cerceve, altin pariltili arka plan
- **Basari Rozeti**: Altin renkli badge'ler ve ikonlar

### Somut Uygulama Ornegi (Idle Kingdom)
**Altin Odul Hiyerarsisi:**
```
KAYNAK GOSTERIMI:
  - Altin (para): Parlayan #FFD700 ikon, sayı artarken altin parcaciklar cikar
  - Elmas (premium): #B9F2FF (parlak cyan) -- altından bile üstün hissi

ODUL ANIMASYONLARI:
  - Altin kazanma: Sari->altin parcacik patlamasi (particle burst)
  - Seviye atlama: Ekran ortasinda altin daire genisleyerek acilir
  - Efsanevi esya: Altin isik huzmesi asagidan yukari, yavaş donme animasyonu
  - Basari odulu: Altin madalya havadan duser, ziplama fizigi (bounce effect)

ESYA KALITE RENKLERI:
  Siradan: #AAAAAA (gri)
  Yesil: #2ECC71 (uncommon)
  Mavi: #3498DB (rare)
  Mor: #9B59B6 (epic)
  Altin: #FFD700 (legendary) + parlama animasyonu
  Kirmizi-altin: #FF4500 gradient (mythic) + ates parcacik efekti
```

---

## 2.5 Yesil - Büyüme ve Ilerleme Cagrisimlari

### Bilimsel Aciklama
Yesil, dogada en yaygin renklerden biridir ve evrimsel olarak güclü cagrisimlar tasir:
- **Büyüme ve Canlilik**: Bitkiler, ormanlar, ilkbahar -- yasam ve gelisim
- **Güvenlik ve Onay**: Trafik lambasi yesil = "devam et", onay isareti yesil
- **Saglik ve Refah**: Saglikli gida, eczaneler, hastane kosullari
- **Para ve Zenginlik**: Amerikan dolari yesil, borsada artis yesil
- **Rahatlama**: Yesil ortamlar stresi azaltir (biophilia hipotezi)

Oyun tasariminda yesil, "olumlu ilerleme" ve "saglikli durum" evrensel sinyalidir. Oyuncunun beyni yesil gordugunde "iyi gidiyorum" mesajini otomatik olarak kodlar.

### Idle/Incremental Oyunlara Uygulanisi
- **Ilerleme Cubuklari**: Yesil dolma -- saglikli ilerleme
- **Pozitif Istatistikler**: "+15% uretim artisi" yesil metin
- **Saglik/Can Cubuklari**: Yesil (tam) -> sari -> kirmizi (dusuk)
- **Upgrade Onay**: Yesil "Upgrade Basarili!" animasyonu

### Somut Uygulama Ornegi (Idle Kingdom)
**Yesil Büyüme Gostergesi Sistemi:**
- Kraliyet haritasi: Bos alanlar kahverengi/gri, gelistirilmis alanlar yesil
- Uretim artisi: "+250/sn" yesil yukarı ok ile gosterilir
- Bina insa: Yesil ilerleme cubugu, tamamlaninca yesil parlama
- Orman bolgesi: Oduncu kulübesi gelistikce etraf daha yesil olur (gorsel geri bildirim)
- "Kraliginin Büyüme Raporu" paneli: Yesil grafiklerle gunluk/haftalik istatistikler

---

## 2.6 Parcacik Efektleri ve Dopamin Yaniti

### Bilimsel Aciklama
Gorsel parcacik efektleri (parlama, patlama, konfeti, isik huzmesi) beyinde birden fazla sistemi aynı anda aktive eder:

1. **Gorsel Islem Merkezi (Oksipital Lob)**: Hareketli, parlak parcaciklar dikkat sistemini yakalar
2. **Odul Sistemi (Ventral Striatum)**: Parcacik efektleri, odul anini "buyutur" ve daha tatmin edici hale getirir
3. **Norokimyasal Yanit**: Gorsel zenginlik -> dopamin + endorfin salgilanmasi
4. **Duygusal Bellek (Amygdala)**: Gorselle zenginlesmis anlar daha güclü kaydedilir

Arastirmalar gosteriyor ki mobil oyunlardaki "juice" (gorsel ve isitsel geri bildirim zenginligi), ayni mekaniğin "kuru" versiyonuna kiyasla oynama süresini %30-40 artirabilir.

### Idle/Incremental Oyunlara Uygulanisi
Her onemli aksiyonun gorsel bir "kutlama"si olmalidir:
- **Kaynak Toplama**: Altin/kaynak parcaciklari sagilir
- **Seviye Atlama**: Büyük parcacik patlamasi + ekran titremesi (screen shake)
- **Odul Acma**: Isik huzmesi + parlayan parcaciklar
- **Kritik Vurus**: Büyük sayi + ekran flash + parcacik efekti

### Somut Uygulama Ornegi (Idle Kingdom)
**Katmanli Gorsel Geri Bildirim Sistemi:**
```
TIKLAMA (her tiklama):
  - Kucuk altin parcacik (3-5 adet), tiklama noktasindan yayilir
  - "+1" sayi yukarı ucar ve solar (fade out)
  - Hafif "bling" ses efekti

KAYNAK TOPLAMA (havuz doldugunda):
  - Bina uzerinden altin parcacik cascading efekti
  - Kaynak sayisi hizla artar (counting animation)
  - Hafif ekran titremesi (0.5px, 0.2sn)
  - "Shing!" ses efekti

SEVIYE ATLAMA:
  - Beyaz ekran flash (0.3sn)
  - Altin daire genislemesi (outward ring)
  - Konfeti parcaciklari (renkli, yerçekimli)
  - Sayi büyüyerek ortaya cikar: "SEVIYE 15!"
  - Trompet/fanfar ses efekti
  - 2sn boyunca arka planda altin parcaciklar yagiyor

EFSANEVI ESYA ELDE ETME:
  - 1sn karanlik (suspense)
  - Altin isik huzmesi tabandan tivana
  - Esya yavasce donarak belirir
  - Mor + altin parcacik spirali
  - Ekran titremesi (2px, 1sn)
  - Epik muzik crescendo
  - Parcaciklar 3sn devam eder
```

---

## 2.7 Ekran Flash Efektleri ve Heyecan

### Bilimsel Aciklama
Ani ekran parlamalari (flash effects) "startle response" denilen bir refleksi tetikler:
- Sympathetic sinir sistemi aktive olur (fight-or-flight)
- Adrenalin salgilanir
- Dikkat aninda odaklanir
- Zaman algisi yavaslar (o an daha uzun hissedilir)
- Daha sonra parasempatik sistem devreye girer (rahatlama = tatmin)

Bu "heyecan -> rahatlama" dongusu, bungee jumping veya roller coaster gibi deneyimlerdeki ayni mekanizmadir. Flash efekti aninda dikkat yakalar, sonrasinda gelen odul daha tatmin edici hissedilir.

Önemli: Epilepsi riski nedeniyle flash efektleri dikkatli kullanilmalidir. Saniyede 3'ten fazla flash, hassas bireylerde nobet tetikleyebilir. Erisim ayarlarında flash azaltma secenegi bulunmalidir.

### Idle/Incremental Oyunlara Uygulanisi
- **Kritik Anlar**: Boss olumu, mega jackpot, efsanevi drop
- **Prestij Anı**: Kralligi yikip yeniden kurarken beyaz flash
- **Basari Kilidi**: Zor bir basari acildiginda kisa flash
- **Combo Patlamasi**: Uzun combo zincirinin sonunda flash

### Somut Uygulama Ornegi (Idle Kingdom)
**Flash Efekti Hiyerarsisi:**
```
SEVIYE 1 (Sik, hafif):
  Kritik vurus: Sari flash, %30 opacity, 0.1sn
  Kullanim: Her 5-10 saniyede olabilir

SEVIYE 2 (Orta siklik):
  Boss hasar alma: Kirmizi flash, %50 opacity, 0.2sn
  Kullanim: Boss savasi boyunca birkac kez

SEVIYE 3 (Nadir, güclü):
  Boss oldurme: Beyaz flash, %80 opacity, 0.4sn + ekran sarsintisi
  Kullanim: Her 30-60 dakikada bir

SEVIYE 4 (Cok nadir, maksimum etki):
  Prestij/Efsanevi odul: Beyaz flash %100, 0.6sn + yavaslama efekti
  Kullanim: Gunde 1-2 kez

ERİSİLEBİLİRLİK:
  Ayarlar -> "Flash efektlerini azalt" secenegi
  Acikken: Flash yerine yavas parlama (glow) efekti kullanilir
```

---

## 2.8 Sayi Animasyonu ve Tatmin

### Bilimsel Aciklama
Sayilarin artisini "gormek", soyut bir kazanici somut ve hissedilebilir hale getirir. Bu "counting up" efekti birkac psikolojik mekanizmadan faydalanir:

1. **Somutlastirma (Concreteness Effect)**: Soyut "kazanc" kavramini gorsel/sayisal olarak deneyimlemek daha tatmin edicidir
2. **Temporal Extension**: Odul "anlik" degil "süreçli" olarak yasanir, tatmin süresi uzar
3. **Kontrol Algisi**: Sayilarin artisini izlemek, "ben bunu basardim" hissi verir
4. **Buyuklük Algisi**: 1000'den 1500'e sayi animasyonla artarken, beyin 500'u "kazanma süreci" olarak deneyimler

Cookie Clicker gibi oyunlar bu mekanigi merkeze koyar: buyuk sayilarin sürekli artmasi, "anlamsiz" bir aktiviteyi bagimlilık yapici kilar. Insan beyni buyuk sayilar ve hızlı artis gormekten dogal bir tatmin alir.

### Idle/Incremental Oyunlara Uygulanisi
- **Kaynak Sayaclari**: Sayilar aninda degil, "counting up" animasyonla degismeli
- **Hasar Sayilari**: Dusmanin uzerinde ucan buyuk sayilar
- **Kazanc Ozeti**: Oturum sonu "bu seans kazancin" ekrani
- **Karsilastirma**: "Onceki: 100/sn -> Simdi: 350/sn" (artis hissi)

### Somut Uygulama Ornegi (Idle Kingdom)
**Sayi Animasyon Sistemi:**
```
KAYNAK SAYACI:
  Artis hizi: 0.5sn icinde hedefe ulaš (easing: ease-out)
  Buyuk artislar: Sayi boyutu gecici olarak büyür (%120)
  Renk: Normal beyaz -> artis sirasinda yesil -> tekrar beyaz
  1000'den fazla artis: Yaninda yesil yukarı ok ikonu

HASAR SAYILARI:
  Normal hasar: Beyaz, orta boy, 0.8sn gorunur
  Kritik hasar: Kirmizi, büyük boy, sarsinti efektiyle, 1.2sn
  Ozel hasar: Altin, ekstra buyuk, 1.5sn, parcacik efektli

IDLE KAZANC EKRANI (oyuna donuste):
  "Yokken kazandigin:" basligi
  Her kaynak satir satir belirir (0.3sn arayla)
  Her satirdaki sayi 0'dan gerçek degere "counting up" (1sn)
  Alt toplam: Buyuk font, altin renk, son olarak belirir
  "Toplayarak devam et!" butonu turuncu (#FF6B35)

PRESTIJ OZETI:
  "Bu kralliktaki basarilarin:" basligi
  Toplam altin: counting up 3sn (cok buyuk sayi)
  Toplam dusnan: counting up 2sn
  Toplam sure: counting up 1.5sn
  Multiplier: "x2.5 -> x3.1" animasyonlu artis (altin renk)
```

---

## 2.9 Ilerleme Cubugu Psikolojisi

### Bilimsel Aciklama
Ilerleme cubuklari (progress bars) birkac güclü psikolojik mekanizmadan faydalanir:

1. **Hedef Gradyani Etkisi (Goal Gradient Effect)**: Clark Hull'un kesfettigi bu ilke, hedefe yaklasiikca motivasyonun artigini belirtir. Fareler labirentte hedefe yaklastikca daha hizli kosar. Insanlar da %80 dolu bir cubugu gormek, %20 dolu olana kiyasla cok daha motive edicidir.

2. **Endowed Progress Effect**: Joseph Nunes ve Xavier Dreze'nin (2006) arastirmasi gosteriyor ki, %0 ile baslayan 8 adimlik kart yerine, 2 adimi onceden doldurulmus 10 adimlik kart verirseniz, tamamlama orani %34'ten %82'ye cikiyor. Yani "baslangiç avantaji" motivasyonu dramatik olarak artirir.

3. **Tamamlama Dürtüsü**: %99 dolu bir ilerleme cubugu gormek, beyinde neredeyse fiziksel bir "bitirme ihtiyaci" yaratir (Zeigarnik etkisiyle baglantili).

4. **Belirsizlik Azaltma**: Ilerleme cubugu, "ne kadar kaldi?" belirsizligini ortadan kaldirir.

### Idle/Incremental Oyunlara Uygulanisi
- **Her Yerde Ilerleme Cubugu**: Bina insasi, upgrade, kahraman eğitimi, arastirma, koleksiyon
- **Baslangic Avantaji**: Yeni bir gorev verirken cubugu %10 dolu goster
- **Son %10'da Hizlanma**: Cubuk son %10'da gorsel olarak daha hizli doluyor gibi hissettirilir
- **Ic Ice Cubuklar**: Büyük hedef cubugu icinde kucuk hedef cubuklari

### Somut Uygulama Ornegi (Idle Kingdom)
**Cok Katmanli Ilerleme Sistemi:**
```
BINA UPGRADE CUBUGU:
  - Baslangic: Cubuk %8 dolu baslar ("Temel atildi!")
  - Dolma: Sol -> saga yesil dolma, parlak kenarlı
  - %90 uzerinde: Cubuk altin renge doner, parlama efekti
  - %100: Patlama efekti + "TAMAMLANDI!" yazisi

KAHRAMAN DENEYIM CUBUGU:
  - Ana cubuk: Mevcut seviyedeki XP ilerlemesi
  - Mini isaret: Her %25'te kucuk odul ikonu
  - Seviye atlama animasyonu: Cubuk dolunca parlayarak sifirlanir

KOLEKSIYON ILERLEMESI:
  - "Orman Yaratiklari: ████████░░ 8/10"
  - Her dolu slot gorsel ikon + isim
  - Bos slotlar: "?" isareti + hafif parlama ("beni bul!")
  - %90+: "Neredeyse tamam!" altin badge

ANA HEDEF SISTEMI:
  Buyuk cubuk: "Kraliyet Seviyesi 15" (%73 dolu)
  Icindeki mini hedefler:
    ✓ 5 bina in et
    ✓ 1000 dusnan yen
    ○ 3 boss oldur (2/3)  <-- "sadece 1 tane daha!"
    ○ 500K altin topla (420K/500K) <-- "%84 tamamlandi!"
```

---

# BOLUM 3: INSAN DOGASININ ZAAFLARI

---

## 3.1 Tamamlama Yanilgisi / Koleksiyon Tamamlama Dürtüsü
### (Completion Bias / Collection Completion Drive)

### Bilimsel Aciklama
Insanlar tamamlanmamis koleksiyonlari ve gorevleri tamamlama konusunda güclü bir ic dürtü hisseder. Bu, birkac psikolojik mekanizmayla aciklanir:

- **Bilissel Kapanis Ihtiyaci (Need for Cognitive Closure)**: Arie Kruglanski'nin teorisine gore, insanlar belirsizlikten hoslanmaz ve "kapanma" (tamamlanma) ararlar
- **Zeigarnik Etkisi**: Tamamlanmamis görevler zihinsel kaynakları mesgul etmeye devam eder
- **Set Completion Effect**: Ozlem Sandikci ve arkadaşlarının araştırması gösteriyor ki insanlar bir koleksiyonun %50'sinden fazlasına sahip olduklarında tamamlama motivasyonu dramatik olarak artar
- **Hedonic Completionism**: Tamamlama anının kendisi dopamin salgılatır

Pokemon'un "Gotta Catch 'Em All!" slogani bu dürtünün en ünlü oyun uygulamasidir.

### Idle/Incremental Oyunlara Uygulanisi
- **Yaratik Koleksiyonu**: Her bolgede bulunacak yaratik seti
- **Basari Sistemi**: Sayisiz basari rozeti, bazi gizli
- **Kart Toplama**: Kahraman kartlari, her birinin farkli nadirlik seviyesi
- **Bina Koleksiyonu**: Tum bina turlerini insa etme hedefi
- **Tarif/Blueprint Koleksiyonu**: Uretim tarifleri kesfetme

### Somut Uygulama Ornegi (Idle Kingdom)
**"Kraliyet Ansiklopedisi" Koleksiyon Sistemi:**
```
YARATIK ANSIKLOPEDISI:
  Orman Bolumu: 15/20 yaratik kesfedildi
  Maagra Bolumu: 8/15 yaratik kesfedildi
  Ejderha Vadisi: 2/10 yaratik kesfedildi

  Her yaratik karti:
  - Kesfedilmis: Renkli resim + isim + istatistikler
  - Kesfedilmemis: Siyah siluet + "???" + ipucu ("Gece vakti ormanda gorunur")

BINA KOLEKSIYONU:
  Askeri: 5/7 bina (████████░░░░░░)
  Ekonomi: 8/10 bina (████████████████░░░░)  <-- "Sadece 2 tane daha!"
  Büyü: 3/8 bina (████████░░░░░░░░░░░░)

ODUL: Her kategori %100 tamamlaninca:
  - Özel "Koleksiyoncu" basarı rozeti (altin)
  - Kalici bonus: +%10 o kategori üretimi
  - Özel gorunum kilidi acilir (bina teması)

MEGA KOLEKSIYON:
  Tum koleksiyonlar tamamlaninca: "Büyük Koleksiyoncu" unvani
  Profilde altin cerceve + ozel parcacık efekti
```

---

## 3.2 Sosyal Kanit (Social Proof)

### Bilimsel Aciklama
Robert Cialdini'nin "Influence" (1984) kitabinda tanimlanan sosyal kanit, belirsizlik durumlarinda baskallarinin davranislarini referans alma egilimimizdir. "Bu kadar insan yapiyorsa dogru olmali" mantigi.

Türleri:
1. **Uzman Sosyal Kaniti**: Otorite figürlerinin onayı
2. **Kullanici Sosyal Kaniti**: Diger kullanlarin deneyimleri (yorumlar, puanlar)
3. **Kalabalik Bilgeligri**: "10 milyon kisi oynuyor!" gibi buyuk sayilar
4. **Arkadasin Kaniti**: Tanidiginniz kisilerin davranislari (en guclusu)
5. **Sertifika Kaniti**: Oduller, rozetler, resmi onaylar

Solomon Asch'in uyum deneyleri gosteriyor ki insanlar, acikca yanlis olan bir cevabi bile, gruptaki herkes ayni seyi soylediginde kabul edebiliyor.

### Idle/Incremental Oyunlara Uygulanisi
- **Oyuncu Sayisi Gostergesi**: "Simdi 45,231 kisi oynuyor!"
- **Populer Secimler**: "Oyuncularin %73'u bu upgrade'i secti"
- **Sosyal Siralamalar**: Liderlik tablolari, klan siralamalari
- **Paylaism Mekanlikleri**: Basarilari sosyal medyada paylasma
- **Inceleme/Puan**: Magaza icinde olumlu kullanici gorusleri

### Somut Uygulama Ornegi (Idle Kingdom)
**Sosyal Kanit Sistemi:**
```
GIRIS EKRANI:
  "Bugun 127,453 kral kraligını ziyaret etti!"
  "Son 1 saatte 2,340 ejderha olduruldu!"

UPGRADE SECIMI:
  Her upgrade yaninda: "⚡ Populer" rozeti (en cok secilen)
  "Oyuncularin %68'i once Kılıc Ustasını yükseltti"

SATIN ALMA EKRANI:
  "Bu paketi son 24 saatte 1,893 kral satin aldi"
  "En cok satan paket! ★★★★★ (4.8/5, 12K degerlendirme)"

SIRALAMA TABLOSU:
  Haftalik en guclu kraller listesi
  Oyuncunun sirasini vurgula: "Sen 1,245. siradasin - ilk 1000'e 340 puan!"
  Arkadaslar siralamaasi: "Ahmet seni 2 sira gecti bu hafta!"

KLAN SISTEMI:
  "Ejderha Kartallari klanina 32 kral katildi!"
  "Klanin bu hafta 5. sirada! İlk 3'e az kaldi!"
```

---

## 3.3 Capa Etkisi (Anchoring Bias)

### Bilimsel Aciklama
Tversky ve Kahneman (1974) tarafindan tanimlanan capa etkisi, insanlarin karar verirken ilk aldiklari bilgiye (capa) orantisiz derecede baglanma egilimidir.

Ornek: Bir urunun "normal fiyati 200 TL, simdi 80 TL" gosterilirse, 80 TL uygun gorulur. Oysa ayni urun 80 TL olarak tek basina gosterilse, pahali bulunabilir. 200 TL "capa" gorevi gormustur.

Capa etkisi son derece direnclidir -- insanlar bunun farkinda olsalar bile etkisinden tam olarak kurtulamazlar. Beyin ilk sayiyi isler ve sonraki tum degerlendirmeleri bu referans noktasina gore yapar.

### Idle/Incremental Oyunlara Uygulanisi
- **Fiyatlandirma**: Premium paketlerde once en pahali paketi goster
- **Indirim Gosterimi**: Ustu cizili eski fiyat + yeni fiyat
- **Deger Karsilastirmasi**: "Normal: 100 elmas icin 5$, MEGA PAKET: 1000 elmas icin 20$!"
- **Ilk Teklif Yüksek**: Tuccar once pahali esyayi gosterir, sonra uygun olani
- **Istatistik Capasi**: "En iyi oyuncunun hasari: 1M/sn -- Senin hasarin: 10K/sn"

### Somut Uygulama Ornegi (Idle Kingdom)
**Capa Odakli Magaza Tasarimi:**
```
ELMAS PAKETLERI (soldan saga):
  1. "Hazine Kasasi" - 5000 elmas = 99.99$ (CAPA - kimse almaz, ama digerlerini ucuz gosterir)
  2. "Altin Kese" - 1200 elmas = 29.99$ (ortanca secenek)
  3. "Gumus Kese" - 500 elmas = 9.99$ (EN COK SATAN rozeti) <-- gercek hedef
  4. "Baslangic" - 100 elmas = 1.99$

GEZGIN TUCCAR:
  "Bu kilicin degeri: 5000 altin!" (ustu cizili)
  "Ozel fiyat: Sadece 1500 altin!"
  "Tasarruf: 3500 altin!" (yesil, buyuk font)

SEZON PASSI:
  "Tum oduller ayri ayri: ~15,000 elmas degeri"
  "Sezon Pass fiyati: 500 elmas"
  "30x deger!" rozeti (altin, parlayan)
```

---

## 3.4 Kitlik Ilkesi (Scarcity Principle)

### Bilimsel Aciklama
Robert Cialdini'nin tanimladigi kitlik ilkesi, bir seyin az bulunur veya kisitli oldugu algisinin onun algilanan degerini artirmasidir.

Psikolojik mekanizmalar:
- **Reaktans Teorisi (Jack Brehm)**: Ozgurlugumuz kisitlandiginda (bir seye erisimimiz sinirlandığında), o seyi daha cok isteriz
- **Kayiptan Kacinma**: Sinirli bir firsati kacirmak = kayip
- **Nadirlik = Kalite Sezgisi**: Nadir olan degerlidir heuristic'i
- **Rekabet Dürtüsü**: Herkes istiyorsa ve az varsa, ben de almaliyim

Kitlik iki sekilde uygulanir:
1. **Miktar Kitligi**: "Sadece 3 tane kaldi!"
2. **Zaman Kitligi**: "Bu teklif 2 saat icinde sona erer!"

### Idle/Incremental Oyunlara Uygulanisi
- **Sinirli Sureli Etkinlikler**: Mevsimsel eventler, bayram etkinlikleri
- **Sinirli Stoklu Tuccar**: "Bu esyadan sadece 1 tane var!"
- **Sezonluk Kahramanlar**: "Kış Savascisi sadece Aralik ayinda!"
- **VIP Teklifleri**: "Bu teklif sadece sana, 1 kez!"
- **Sinirli Klan Kontenjanları**: "Bu klanda sadece 2 yer kaldi!"

### Somut Uygulama Ornegi (Idle Kingdom)
**Kitlik Sistemi:**
```
GEZGIN TUCCAR STOKLARI:
  "Ejderha Kalkanı x1" (kirmizi "SON 1!" rozeti)
  "Büyülü Iksir x3" (sari "Az Kaldi!" rozeti)
  "Altin Kilici x10" (yesil "Stokta" rozeti)

  Her satista stok azalir ve renk degisir:
  x10 -> x5 (yesil -> sari) -> x2 (sari -> turuncu) -> x1 (turuncu -> kirmizi)

SEZONLUK ICERIK:
  "❄️ KIS FESTIVALI - 12 gun kaldi!"
  Ozel binalar: "Buzdan Kale" -- sadece festival sirasinda insa edilebilir
  Ozel kahraman: "Buz Kraliçesi" -- sadece festival boyunca elde edilebilir
  Festival bittikten sonra: Kilitlenen icerik gri olur + "Gelecek yil tekrar!"

FLASH TEKLIF:
  Rastgele zamanlarda belirir (günde 2-3 kez)
  "⚡ FLASH FIRSAT! 15 dakika! ⚡"
  "500 Elmas = 200 altin yerine 100 altin! (%50 indirim)"
  Geri sayim: Kirmizi, saniye saniye azalir
  Geri sayim bittikten sonra: Pop-up kapanir, bir daha ayni teklif gelmez
```

---

## 3.5 Karsiliiklilik Ilkesi (Reciprocity Principle)

### Bilimsel Aciklama
Cialdini'nin bir diger ilkesi olan karsiliklilik, bize bir iyilik yapildiginda geri odeme dürtüsü hissetmemizdir. Bu evrimsel bir mekanizmadir -- sosyal turler olarak karsilikli yardim hayatta kalma sansimnizi artirmistir.

Dennis Regan'in (1971) klasik deneyi gosteriyor ki: Bir kisi size bedava bir soda verirse, sizden iyilik istediklerinde uymasi olasilığınız %2 kat artar. Ustelik, geri odeme dürtüsü genellikle alinan iyilikten DAHA BUYUK olur.

Pazarlamada: Bedava numune, bedava deneme, hediye urun -> satin alma motivasyonu artar.

### Idle/Incremental Oyunlara Uygulanisi
- **Bedava Hediye**: Giris yapitktan "Hos geldin hediyesi!" (buyuk degerli)
- **Günlük Bedava**: Her gun bedava sandik/odul (ama premium daha iyi)
- **Yardim Mekaniigi**: Oyun zor aninda bedava boost teklifi
- **İlk Satin Alma Bonusu**: İlk gercek parayla alimda x3 bonus (ilk adimi attirmak icin)

### Somut Uygulama Ornegi (Idle Kingdom)
**Karsiliklilik Dongüsü:**
```
GIRIS ASAMASI:
  Gun 1: "Hos geldin! Sana 500 altin + 1 nadir kahraman hediye!" (buyuk, gösterisli)
  Gun 2: "Seni yine gordugumize sevindik! Al, 1 bedava sandık!"
  Gun 3: "Sadık bir kralsın! Bugüne özel 2x kazanç boost'u!"
  Gun 4: "Sana özel VIP teklifi: Normal 500 elmas, SEN 500+250 BONUS!"
  (Bu noktada oyuncu 3 gunluk "bedava seyler" almis, satin alma bariyeri düsmüs)

ZOR AN YARDIMI:
  Boss'a 3 kez yenilince: "Kraliyet Büyücüsü yardım teklif ediyor! Bedava %50 güç artisi!"
  (Oyuncu boss'u yener, sisteme minnet duyar)
  Hemen sonra: "Kraliyet Büyücüsü'nün KALICI güc artisi: sadece 200 elmas!"

BEDAVA GUNLUK SANDIK:
  Her gun 1 bedava sandık (genellikle siradan odul)
  Sandigin yaninda: "Premium Sandik: 3x daha iyi oduller! (50 elmas)"
  Bedava sandik acma animasyonu 3sn... premium sandik acma animasyonu 5sn + ekstra efektler
  (Bedava versiyonun yetersizligini hissettir, premium'a yonlendir)
```

---

## 3.6 Kumarbaz Yanilgisi (Gambler's Fallacy)

### Bilimsel Aciklama
Kumarbaz yanilgisi, bagimsiz rastgele olaylarin birbirini etkiledigine inanma egilimimizdir. "Yazı-tura atisinda 5 kez üst üste yazı geldiyse, bir sonraki tura gelir" düsüncesi. Gercekte her atis bagimsizdir ve olasilik hep %50'dir.

Bu yanilgi "temsililik heuristic'i" (representativeness heuristic) ile ilgilidir -- küçük orneklemlerin büyük orneklemleri temsil etmesi gerektigine inanma egilimi. "5 kez yazı geldi, bu normal degil, tura gelmeli" diye düsünürüz cunku kücük orneklemin bile %50-%50 olmasi gerektigine inaniyoruz.

Ayni zamanda "hot hand fallacy" de vardir: "3 kez basardim, demek ki iyi gidiyorum, devam edersem yine basaririm." (Her iki yonde de yanilis.)

### Idle/Incremental Oyunlara Uygulanisi
- **Çekilis Sistemleri**: "5 kez siradan çıktı, bir sonraki kesin nadir olur!" (gerçekte olasilik ayni)
- **Basari/Basarisizlik Serileri**: "Pity timer" sistemi (aslinda kumarbaz yanilgisini DOGRULAYARAK bagimlilik yaratir)
- **Upgrade Denemeleri**: "%70 basari, 3 kez basarisiz oldu, simdi kesin olur!" diye düsünme
- **Boss Drop**: "Bu boss'u 10 kez oldurdüm hala nadir esya düsmedi, bir sonraki kesin!"

### Somut Uygulama Ornegi (Idle Kingdom)
**"Pity Timer" Garantili Çekilis Sistemi:**
```
KAHRAMAN CEKILIS SISTEMI:
  Normal olasilik: %2 efsanevi kahraman sansi

  AMA: Pity Timer sistemi (kumarbaz yanilgisini DOGRULAR):
  - 50 basarisiz çekisten sonra: Efsanevi garanti!
  - Oyuncuya gösterim: "Efsanevi Garantisi: 37/50"
  (Cubuk doldukca heyecan artar, "50'ye ulasinca kesin!" motivasyonu)

  GORSEL TASARIM:
  - Her cekilis: Dönen tekerlek animasyonu
  - Nadir esyaya "yakin iskalama": Tekerlek efsanevi slotun HEMEN yaninda durur
  - "Az kalsın!" mesajı popup (near-miss + gambler's fallacy birlikte)

  SAYAC GOSTERIMI:
  "Son efsanevin: 23 cekilis once"
  "Ortalama: Her 50 cekiste 1 efsanevi"
  (Oyuncu: "23 oldu, 27 daha yaparssam kesin gelir!" diye düsünür)

  ONEMLI NOT: Pity timer aslinda oyuncunun yararina calisir ve hayal kirikligi
  sinirini kontrol eder. Amaç sömürü degil, tatmin edici deneyim tasarimidir.
```

---

## 3.7 Statü Arayisi ve Hiyerarsi Ihtiyaci
### (Status Seeking / Hierarchy Needs)

### Bilimsel Aciklama
Abraham Maslow'un ihtiyaçlar hiyerarsisinde "sayginlik ihtiyaci" (esteem needs) dort temel sosyal ihtiyaçtan biridir. Insanlar dogal olarak:
- Baskalari tarafindan taninmak ve saygi görmek ister
- Sosyal hiyerarside yükselmek ister
- Beceri ve yeterliliklkleri gorünür olsun ister
- Bir grubun "en iyisi" olmak veya üst siniflara ait olmak ister

Thorstein Veblen'in "gösterisci tüketim" (conspicuous consumption) kavramı, insanların statülerini göstermek için kaynak harcadığını açıklar. Lüks markalar, pahalı arabalar, özel üyelikler hep bu ihtiyaca hitap eder.

Oyunlarda: Nadir kosmetik esyalar, özel ünvanlar, liderlik tablolari ve özel erisim alanlari bu ihtiyaci karsılar.

### Idle/Incremental Oyunlara Uygulanisi
- **Ünvan Sistemi**: "Çaylak Kral" -> "Bronz Kral" -> "Gümüs Kral" -> "Altin Kral" -> "Elmas Kral"
- **Profil Cerceveleri**: Nadirlik seviyesine göre farkli cerceveler
- **VIP Seviyeleri**: Harcamaya göre VIP katmanlari (sinifsallik)
- **Özel Chatlar**: Sadece üst seviye oyuncularin eristigi sohbet odalari
- **Liderlik Tablolari**: Haftalik, aylık, tüm zamanlar siralamalari

### Somut Uygulama Ornegi (Idle Kingdom)
**Hiyerarsi ve Statü Sistemi:**
```
KRAL UNVANLARI (ilerlemeye göre):
  Seviye 1-10: "Köy Muhtari" (gri cerceve)
  Seviye 11-25: "Baron" (yesil cerceve)
  Seviye 26-50: "Kont" (mavi cerceve)
  Seviye 51-75: "Dük" (mor cerceve)
  Seviye 76-99: "Kral" (altin cerceve)
  Seviye 100: "Imparator" (kirmizi-altin animasyonlu cerceve)

PROFIL GÖSTERISI:
  - Ünvan baskalari tarafindan görülür
  - Klan sohbetinde ismin yaninda cerceve ve rozet
  - Liderlik tablosunda özel efektler (ilk 10: ates efekti)

VIP KATMANLARI:
  VIP 0: Normal (herkes)
  VIP 1: Bronz yildiz (harcama >= 5$) -> +%5 kazanc
  VIP 2: Gümüs yildiz (>= 20$) -> +%10 kazanc + özel tuccar
  VIP 3: Altin yildiz (>= 50$) -> +%20 kazanc + özel bina skinleri
  VIP 4: Elmas yildiz (>= 100$) -> +%30 kazanc + VIP sohbet + özel kahraman

GORÜNÜRLÜK:
  Liderlik tablosunda VIP yildizi görünür
  Klan sohbetinde VIP'ler özel renkte yazar
  VIP giriş animasyonu: "⭐ VIP Kral [isim] kralligini ziyaret etti!"
```

---

## 3.8 Anlik Tatmin vs Gecikmis Ödüller
### (Instant Gratification vs Delayed Rewards)

### Bilimsel Aciklama
Walter Mischel'in ünlü "marshmallow deneyi" göstermistir ki insanlar (ozellikle cocuklar) anlik ödül ile daha büyük ama gecikmis ödül arasinda secim yapmakta zorlanir.

**Hiperbolik Iskontolama (Hyperbolic Discounting)**: Insanlar gelecekteki ödüllerin degerini "hiperbolik" olarak düsürür. Yani "simdi 50 TL" tercihi "1 hafta sonra 60 TL"ye karsi güclüdür, ama "52 hafta sonra 50 TL" vs "53 hafta sonra 60 TL" arasinda rahatca 60 TL'yi seceriz. Zamandaki yakinlik, dürtüsel karar almayai tetikler.

Oyun tasariminda bu ikilem stratejik olarak kullanilir: Anlik tatmin oyuncuyu baglı tutar, gecikmis ödüller uzun vadeli baglilik yaratir.

### Idle/Incremental Oyunlara Uygulanisi
- **Anlik Tiklama Ödülü**: Her tiklama = aninda altin (instant gratification)
- **Birikme Mekaniigi**: Idle kaynak birikimi = gecikmis ama daha büyük ödül
- **Hizlandirma Teklifi**: "2 saat bekle VEYA 50 elmas öde simdi al" (anlik tatmin fiyati)
- **Prestij Sistemi**: Simdi sifirla = uzun vadede daha hizli ilerle

### Somut Uygulama Ornegi (Idle Kingdom)
**Anlik vs Gecikmis Ödül Dengeleme:**
```
ANLIK TATMIN KATMANI:
  - Her tiklama: Altin parcacik + ses + sayi animasyonu (50ms gecikme bile yok)
  - Her dusnan: Aninda XP + loot gosterimi
  - Her upgrade: Aninda gorsel degisiklik + "güc artisi" animasyonu

KISA VADELI GECIKMIS ÖDÜL:
  - Maden birikimi: 30dk sonra "Madenin doldu!" (bekleme -> büyük toplama tatmini)
  - Bina insasi: 5-30dk timer, tamamlaninca büyük kutlama
  - Kahraman eğitimi: 1-4 saat, sonunda güclenmis kahraman

UZUN VADELI GECIKMIS ÖDÜL:
  - Haftalık boss: 7 gün hazirlik, büyük ödül
  - Sezon passi: 30 gün boyunca günlük ilerleme, sonunda mega ödül
  - Piramit insasi: 14 gün, efsanevi ödül

HIZLANDIRMA KARARI:
  "Kale insası: 4 saat kaldi"
  [Bekle] butonu (gri, büyük)  vs  [Hizlandir: 30 elmas] butonu (turuncu, parlak)

  Tasarim notu: Turuncu buton görsel olarak daha cazip ama
  bedava secenek de kolay erisilebilir olmali (etik tasarim)
```

---

## 3.9 IKEA Etkisi (Kisisel Emek Degeri)

### Bilimsel Aciklama
Michael Norton, Daniel Mochon ve Dan Ariely'nin (2012) kavramsallastirdigi IKEA etkisi, insanlarin kendi emekleriyle yarattiklari seylere orantisiz derecede yüksek deger bicmesidir. IKEA mobilyasini kendiniz montaj edince, hazir satın alinan ayni mobilyadan daha degerli bulursunuz.

Mekanizmalar:
- **Yetkinlik Sinyali**: "Bunu ben yaptim" = "Ben yetkinim" hissi
- **Emek-Deger Baglantisi**: Harcanan emek = algilanan deger (aslinda bunlar bagimsiz olmali)
- **Sahiplik Etkisinin Güclenmesi**: Kendiniz yapınca sahiplik hissi katllanir
- **Bilissel Celiski Azaltma**: "Bu kadar emek verdim, degerli olmali" düsüncesi

Önemli: IKEA etkisinin çalismasi icin gorev basariyla tamamlanmaldir. Tamamlanamayan projeler hayal kırıklığı yaratir.

### Idle/Incremental Oyunlara Uygulanisi
- **Özellesltirme**: Oyuncunun her seyi kendi seçmesi/tasarlamasi
- **Crafting Sistemi**: Malzeme topla + birlestiir = ozel esya (kendi yaratin)
- **Bina Yerlestirme**: Krallık düzenini oyuncu belirler
- **Kahraman Yetistirme**: Sifirdan büyütülen kahraman, hazir alinan kahramandan deger daha degerli hissedilir
- **Strateji Seçimi**: Oyuncunun "kendi build'i" olusturmasi

### Somut Uygulama Ornegi (Idle Kingdom)
**Emek-Deger Sistemi:**
```
CRAFTING ATÖLYESI:
  Malzeme toplama: Madenlerden demir, ormanlardan odun, bosslardan nadir tas
  Tarif kesfetme: Malzemeleri deneyerek yeni tarifler bul
  Üretim: 3x demir + 2x odun + 1x ates tası = "Alev Kilici"

  ONEMLI: Oyuncu tarifi KENDISI kesfettiyse, o esyaya %20 ekstra bağlanir
  Craft edilen esyada "Kral [isim] tarafindan imal edildi" yazisi
  Craft esyalar satilabilir ama "Emin misin? Bunu kendin yaptin!" uyarisi

KALE TASARIMI:
  Grid-based harita: Oyuncu binalari kendisi yerlestirir
  Dekorasyon: Bayraklar, heykeller, bahceler eklenebilir
  "Kralligin Güzellik Puani": Düzenleme ve dekorasyona göre bonus
  Diger oyuncular ziyaret edebilir: "Güzel krallik! ⭐" geri bildirimi

KAHRAMAN YETISTIRME:
  - Yumurtadan/bebekten büyütme mekaniği
  - Oyuncu yetenekleri seçer (skill tree)
  - Isim ve görünüm kisisellestirilir
  - "Senin yetistirdigin kahraman" etiketi
  - Kahraman diger oyunculara gösterılebilir

STRATEJI PLANI:
  "Kraliyet Strateji Tahtasi" -- oyuncu hangi binalari, hangi siraya
  göre gelistirecegini planlayabilir. Plan basarili olunca:
  "Strateji Basarili! Senin planin ise yaradi!" mesaji
```

---

## 3.10 Secim Mimarisi ve Dürtme
### (Choice Architecture / Nudging)

### Bilimsel Aciklama
Richard Thaler ve Cass Sunstein'in "Nudge" (2008) kitabinda tanimlanan kavram, secimlerin NASIL sunuldugunun, secimin kendisini degistirmeden sonucu dramatik olarak etkiledigini gösterir.

Temel dürtme (nudge) teknikleri:
1. **Varsayilan Secenek (Default Option)**: Insanlarin çoğu varsayilani degistirmez (organ bağışı ornegi: opt-in vs opt-out ülkeleri arasinda bağıs orani farki %15 vs %90+)
2. **Secim Sayisi**: Çok fazla secenek = "seçim felci" (Sheena Iyengar, jam study). 6 secenek sunulan tezgahta %30 satın alma, 24 secenek sunulandan sadece %3.
3. **Secim Siralamas**: Ilk ve son sunulan secenekler daha cok secilir (primacy/recency)
4. **Çerçeveleme (Framing)**: Ayni bilginin farkli sunumu: "%90 yağsız" vs "%10 yağlı" -- ayni sey, farkli algı
5. **Varsayılan Büyüklük**: "Küçük, Orta, Büyük" yerine "Orta, Büyük, Ekstra Büyük" dersen ortalama satıs büyüklüğü artar

### Idle/Incremental Oyunlara Uygulanisi
- **3 Secenek Sunumu**: Her zaman 3 paket sun, ortancasi "en iyi deger" olarak isaretle
- **Varsayilan Secim**: Upgrade/satin alma ekraninda "önerilen" secenek ön-secili
- **Sinirlı Secenek**: Oyuncuya 2-4 net secenek sun, kafa karisikligi önle
- **Çerçeveleme**: "Günde 1 TL" vs "Yillik 365 TL" -- ayni sey, farklı algı
- **Kolay Yol Tasarimi**: Istenen aksiyonun butonu büyük ve parlak, digerieri kücük ve sönük

### Somut Uygulama Ornegi (Idle Kingdom)
**Seçim Mimarisi Tasarimi:**
```
ELMAS MAGAZA (3 Secenek Kurali):
  [Küçük Kese]          [Kraliyet Kesesi]        [Devasa Hazine]
  100 elmas              500 elmas                 2000 elmas
  1.99$                  4.99$                     19.99$
                         ★ EN IYI DEGER ★
                         (kirmizi serit, büyük font)

  Ortanca secenek: Altin cerceve, "En Populer" rozeti, hafif parlama
  Bu tasarimda çoğu oyuncu ortancayı secer (capa + sosyal kanit + gorsel vurgu)

UPGRADE KARARI:
  Boss yenilgi sonrasi 3 secenek:
  [Tekrar Dene]           [Güçlendir: 200 altin]    [Mega Boost: 50 elmas]
  (gri, küçük buton)      (yesil, orta buton)        (altin, büyük buton)

  Varsayilan vurgu: Ortancadaki yesil buton (para harcamaz ama oyunda ilerletir)
  Bu, oyuncuyu altin harcamaya nazikçe yönlendirir

GÜNLÜK ODUL SECIMI:
  "Bugünün ödülünü sec!"
  [Sandik A]    [Sandik B]    [Sandik C]
  (kapalı)      (kapalı)       (kapalı)

  Secim hep 3: Karar vermek kolay
  Secilmeyen sandiklar acilmaz (FOMO + "keske digerini secseydim")
  Bu yarin tekrar gelmesine motivasyon yaratir

BILDIRIM SECIMI:
  Varsayilan: Bildirimler AÇIK (opt-out)
  "Bildirimleri kapat" secenegi mevcut ama ayarlar menusu icinde (kolay erisemez)
  "Bildir beni" butonu büyük ve yesil
  "Bildirim istemiyorum" kücük ve gri metin
```

---

# SONUC VE TASARIM ILKELERI OZETI

## Temel Tasarim Felsefesi

1. **Kisa Donguler + Uzun Donguler**: Oyuncu her 5 saniyede bir mikro-ödül, her 5 dakikada orta ödül, her 5 saatte büyük ödül, her 5 günde mega ödül almali

2. **Belirsizlik + Kontrol Dengesi**: Oyuncu kendini kontolde hissetmeli ama tam olarak ne olacagini bilmemeli

3. **Kayip + Kazanc Çerçevelemesi**: Her mekanik hem kazanç hem potansiyel kayip içermeli (streak bozulmasi, tuccar kacirmasi, stok bitmesi)

4. **Sosyal + Kisisel Denge**: Sosyal karsilastirma motivasyon yaratir ama kisisel basari da onemli

5. **Emek + Ödül Orantisi**: Oyuncunun harcadigi emek karsiliginda tatmin edici ödül almasi SART. Sömürü degil, tatmin edici deneyim hedeflenmelidir.

## Etik Tasarim Notu

Bu belgedeki psikolojik ilkeler güclü araçlardir. Bunlarin ETIK kullanimi:
- Oyuncuya gercekten keyif veren bir deneyim yaratmak
- Oyuncunun zamanina ve parasina saygi gostermek
- Harcama limitleri ve uyarilar sunmak
- "Pay to win" degil "pay to enjoy" modeli benimsemek
- Cocuk oyuncular icin ek koruma mekanizmalari eklemek
- Bagimlilık belirtileri gösteren oyunculara mola hatirlatmalari yapmak

Psikolojik manipülasyon ile psikolojik tasarim arasindaki fark, OYUNCUNUN CIKARININ gözetilip gözetilmedigindedir.

---

*Bu arastirma belgesi, bilimsel psikoloji, davranissal ekonomi ve oyun tasarimi literatürüne dayanmaktadir.*
*Temel kaynaklar: Kahneman & Tversky (Prospect Theory), Cialdini (Influence), Csikszentmihalyi (Flow), Nir Eyal (Hooked), Skinner (Operant Conditioning), Thaler & Sunstein (Nudge), Norton et al. (IKEA Effect)*
