UPDATE posts SET 
  content_tr = '<p class="intro">Bambu Lab yazıcılar (X1 Carbon, P1S, P1P, A1, A1 Mini) yüksek kaliteli baskılar üretir ancak bazı yaygın sorunlarla karşılaşabilirsiniz. Bu rehberde en sık görülen 4 sorunu ve doğrulanmış çözümlerini bulacaksınız.</p>

<h2>1. Nozzle (Meme) Tıkanıklığı</h2>

<p>Filament çıkışı tamamen durduysa veya ince/kesik kesik geliyorsa nozzle tıkanmış olabilir.</p>

<figure style="margin:20px 0;text-align:center;">
<img src="https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev/images/1769944005866-9kf1vp.webp" alt="Bambu Lab A1 Nozzle Tıkanıklığı ve Temizleme" style="max-width:100%;border-radius:12px;" />
<figcaption style="color:#888;font-size:0.85em;margin-top:10px;">Bambu Lab A1 hotend - Nozzle tıkanıklığı temizleme talimatları</figcaption>
</figure>

<h3>Çözüm Yöntemleri:</h3>

<ul>
<li><strong>Soğuk Çekme (Cold Pull):</strong> Nozzle''ı ısıtın, filamenti yükleyin, 100°C''ye soğutun ve hızla çekin. Bu işlem tıkanıklığı temizler.</li>
<li><strong>İğne Yöntemi:</strong> Nozzle sıcakken ince temizleme iğnesi (0.3-0.4mm) ile ucunu açın.</li>
<li><strong>Isı Sürünmesi (Heat Creep) Önlemi:</strong> Kapalı kasada PLA basarken üst kapağı açın, aksi halde hotend''deki ısı yükselir ve filament erken yumuşar.</li>
</ul>

<h2>2. Tablaya Yapışmama / Warping</h2>

<p>İlk katman tablaya tutunmuyor veya köşelerden kalkma (warping) yapıyor.</p>

<figure style="margin:20px 0;text-align:center;">
<img src="https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev/images/1769944015328-q7zkbb.jpg" alt="Bambu Lab P1 Tool Head" style="max-width:100%;border-radius:12px;" />
<figcaption style="color:#888;font-size:0.85em;margin-top:10px;">Bambu Lab P1 serisi tool head - Düzgün kalibrasyon önemlidir</figcaption>
</figure>

<h3>Çözüm Yöntemleri:</h3>

<ul>
<li><strong>Doğru Temizlik:</strong> Tablayı IPA yerine <strong>bulaşık deterjanı ve sıcak su</strong> ile yıkayın. IPA yağı tam temizlemez.</li>
<li><strong>Tabla Seçimi:</strong> Bambu Studio''da seçili tabla tipi ile fiziksel tablanın eşleştiğinden emin olun (Cool Plate, High Temp Plate, Engineering Plate vb.).</li>
<li><strong>Tutkal Kullanımı:</strong> Cool Plate veya Engineering Plate kullanıyorsanız mutlaka glue stick sürün. Textured PEI için genellikle gerekmez.</li>
</ul>

<h2>3. AMS Geri Çekme Hatası</h2>

<p>AMS, filamenti geri saramıyor veya "Motor Overload" hatası veriyor.</p>

<figure style="margin:20px 0;text-align:center;">
<img src="https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev/images/1769944017033-iexnhj.jpg" alt="Bambu Lab AMS Ünitesi" style="max-width:100%;border-radius:12px;" />
<figcaption style="color:#888;font-size:0.85em;margin-top:10px;">Bambu Lab AMS 2 - Automatic Material System</figcaption>
</figure>

<h3>Çözüm Yöntemleri:</h3>

<ul>
<li><strong>PTFE Boru Kontrolü:</strong> AMS''den yazıcıya giden PTFE boru kıvrımları çok keskin olmamalıdır. Boruyu düzgün yerleştirin.</li>
<li><strong>Karton Makaralar İçin:</strong> Karton makaralar AMS''de kayma yapar. Kenarlarına plastik halka takın (Spool Adapter) veya Bambu Lab orijinal makaralarına aktarın.</li>
<li><strong>Filament Ucu:</strong> Kesilen filament ucu düzgün değilse takılabilir. Ucu düzgün ve açılı kesin.</li>
</ul>

<h2>4. Katman Kayması (Layer Shift)</h2>

<p>Baskı sırasında katmanlar hizasını kaybediyor ve merdiven gibi kayıyor.</p>

<figure style="margin:20px 0;text-align:center;">
<img src="https://pub-9142f11355e84e1da1dd96a4c14e4afb.r2.dev/images/1769944018769-r69826.webp" alt="Layer Shift ve Stringing Sorunu" style="max-width:100%;border-radius:12px;" />
<figcaption style="color:#888;font-size:0.85em;margin-top:10px;">Layer shift ve stringing - başarısız baskı örneği</figcaption>
</figure>

<h3>Çözüm Yöntemleri:</h3>

<ul>
<li><strong>Kayış Gerginliği:</strong> Bambu Lab yazıcılarda kayış gevşetme/sıkma vidalarını kullanarak gerginlik kalibrasyonu yapın. Device > Calibration menüsünden "Belt Tension" testini çalıştırın.</li>
<li><strong>Dolgu Tipi Değiştirin:</strong> Nozzle dolguya çarpabilir. "Grid" yerine <strong>"Gyroid"</strong> veya <strong>"Cross Hatch"</strong> dolgu kullanın.</li>
<li><strong>Hız Modunu Düşürün:</strong> "Ludicrous" modunda mekanik limitler aşılabilir. Sorunlu modellerde "Sport" veya "Standard" moda geçin.</li>
</ul>

<div class="warning-box" style="background:#fff3cd;padding:15px;border-radius:8px;margin:20px 0;border-left:4px solid #f1c40f;">
<p>⚠️ <strong>Önemli Uyarı:</strong> Karbon çubukları asla gres veya yağ ile yağlamayın! Sadece kuru mikrofiber bez ile temizleyin. Yağ toz çeker ve çubuklara zarar verir.</p>
</div>

<h2>Bonus: Genel Bakım İpuçları</h2>

<ul>
<li>Her 100 saat baskıda nozzle''ı kontrol edin</li>
<li>AMS nemlendiricisini (desiccant) düzenli değiştirin</li>
<li>Tabla yüzeyini her baskı öncesi kontrol edin</li>
<li>Firmware güncellemelerini takip edin</li>
</ul>

<p style="margin-top:30px;padding:15px;background:rgba(0,174,66,0.1);border-radius:8px;font-size:0.9em;"><strong>Kaynak:</strong> Bu rehber <a href="https://wiki.bambulab.com" target="_blank" rel="noopener">Bambu Lab Wiki</a> ve topluluk deneyimlerinden derlenmiştir.</p>'
WHERE id = 449;
