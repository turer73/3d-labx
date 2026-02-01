UPDATE posts SET content_tr = '<p class="intro">Bambu Lab X1, P1 ve A1 serisi yazıcılarda karşılaşabileceğiniz yaygın sorunlar için hızlı başvuru kaynağı. Bu bilgiler resmi Bambu Lab Wiki''den derlenmiştir.</p>

<h2>1. Tabla Yapışma Sorunu</h2>

<p>Baskının ilk katmanının tablaya yapışmaması veya köşelerden kalkması (warping).</p>

<h3>Çözüm Adımları:</h3>

<ul>
<li>Tablayı <strong>sıcak su ve bulaşık deterjanı</strong> ile yıkayın (IPA bazen yağı sadece yayar).</li>
<li>Doğru tabla tipini seçtiğinizden emin olun (Slicer ayarlarında).</li>
<li>Textured PEI plaka için Nozzle sıcaklığını ilk katmanda 5°C artırın.</li>
<li>Cool Plate veya Engineering Plate kullanıyorsanız <strong>Glue Stick</strong> tazeleyin.</li>
</ul>

<h2>2. Nozzle Tıkanıklığı</h2>

<p>Filamentin akmaması veya extruder''dan tık tık ses gelmesi.</p>

<h3>Çözüm Adımları:</h3>

<ul>
<li><strong>Cold Pull (Soğuk Çekme):</strong> Nozzle''ı ısıtıp filamenti manuel itip soğutarak çekin.</li>
<li>İğne aracı (Unclogging Pin) ile nozzle ucunu temizleyin.</li>
<li>Extruder dişlilerini kontrol edin, filament kalıntısı olabilir.</li>
<li>Heat creep (ısı sürünmesi) olmaması için kapalı kasalı yazıcılarda PLA basarken üst kapağı aralayın.</li>
</ul>

<h2>3. İpliklenme (Stringing)</h2>

<p>Modelin parçaları arasında örümcek ağı gibi ince filament iplikleri oluşması.</p>

<h3>Çözüm Adımları:</h3>

<ul>
<li><strong>Filamenti Kurutun:</strong> En yaygın sebep nemli filamenttir. Özellikle PETG ve TPU.</li>
<li>Nozzle sıcaklığını 5-10°C düşürün.</li>
<li>"Retraction" (Geri çekme) ayarlarını kontrol edin.</li>
<li>Z-Hop ayarını kontrol edin, gereksizse kapatın.</li>
</ul>

<h2>4. AMS Geri Çekme Hatası</h2>

<p>Filament değiştirirken "Failed to pull back filament" hatası.</p>

<h3>Çözüm Adımları:</h3>

<ul>
<li>Makarayı elinizle hafifçe geri sararak motorlara yardımcı olun.</li>
<li>Filamentin makarada sıkışıp sıkışmadığını (düğüm) kontrol edin.</li>
<li>PTFE tüplerinin (özellikle Toolhead üzerindeki eğimin) çok keskin olmadığından emin olun.</li>
<li>Karton makaraların kenarına bant yapıştırmak sürtünmeyi artırabilir, plastik adaptör kullanın.</li>
</ul>

<h2>5. Yüzey Kalitesi Sorunları (Ghosting / VFA)</h2>

<p>Düz yüzeylerde dalgalanmalar veya dikey ince çizgiler (VFA - Vertical Fine Artifacts).</p>

<h3>Çözüm Adımları:</h3>

<ul>
<li><strong>Kayış Gerginliği:</strong> Arkadaki vidaları gevşetip, kafayı hareket ettirip tekrar sıkarak kayışları gerin (Wiki prosedürünü izleyin).</li>
<li>Yazıcıyı sağlam, sallanmayan bir zemine koyun veya anti-vibrasyon ayakları kullanın.</li>
<li>"Calibration" menüsünden "Flow Dynamics" ve "Vibration Compensation" kalibrasyonlarını tekrar yapın.</li>
</ul>

<div class="warning-box" style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #f1c40f;">
<p>⚠️ <strong>Önemli Uyarı:</strong> Cihazınıza müdahale etmeden önce garanti koşullarını kontrol ediniz. Karmaşık elektronik arızalar veya parça değişimi için resmi Wiki''ye başvurun.</p>
</div>

<h2>Bonus: Genel Bakım İpuçları</h2>

<ul>
<li>Her 100 saat baskıda nozzle''ı kontrol edin</li>
<li>AMS nemlendiricisini (desiccant) düzenli değiştirin</li>
<li>Tabla yüzeyini her baskı öncesi kontrol edin</li>
<li>Firmware güncellemelerini takip edin</li>
<li>Kayış gerginliğini düzenli olarak kalibre edin</li>
</ul>

<p style="margin-top:30px;padding:15px;background:rgba(0,174,66,0.1);border-radius:8px;font-size:0.9em;"><strong>Kaynak:</strong> Bu rehber <a href="https://wiki.bambulab.com/en/home" target="_blank" rel="noopener">Bambu Lab Resmi Wiki</a> ve topluluk deneyimlerinden derlenmiştir.</p>',
summary_tr = 'Bambu Lab X1, P1 ve A1 serisi yazıcılarda en sık karşılaşılan 5 sorun: Tabla yapışma, nozzle tıkanıklığı, ipliklenme, AMS hatası ve yüzey kalitesi. Her biri için detaylı çözüm adımları.'
WHERE id = 449;
