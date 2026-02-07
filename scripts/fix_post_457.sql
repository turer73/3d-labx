-- Post 457: Creality Yazıcılarda Sık Karşılaşılan Sorunlar ve Çözümleri
UPDATE posts SET
title_tr = 'Creality Yazıcılarda Sık Karşılaşılan Sorunlar ve Çözümleri (Ender 3, CR-10)',
title_en = 'Common Creality Printer Problems and Solutions (Ender 3, CR-10)',
title_de = 'Häufige Creality-Drucker-Probleme und Lösungen (Ender 3, CR-10)',
summary_tr = 'Creality Ender 3, CR-10 ve diğer yazıcılarda yaşanan yaygın sorunlar ve adım adım çözümleri.',
summary_en = 'Common issues with Creality Ender 3, CR-10 and other printers with step-by-step solutions.',
summary_de = 'Häufige Probleme mit Creality Ender 3, CR-10 und anderen Druckern mit schrittweisen Lösungen.',
content_tr = '<!-- Multi-language Content -->
<style>
.lang-content { display: none; }
.lang-content.active { display: block; }
.lang-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.lang-tab { padding: 8px 16px; border: 1px solid var(--border-soft, #e5e7eb); border-radius: 8px; cursor: pointer; background: var(--bg-hover, #f3f4f6); transition: all 0.2s; }
.lang-tab.active { background: var(--accent, #3b82f6); color: white; border-color: var(--accent, #3b82f6); }
.lang-tab:hover { border-color: var(--accent, #3b82f6); }
.problem-card { background: var(--bg-card, #f9fafb); border: 1px solid var(--border-soft, #e5e7eb); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.problem-title { font-size: 1.2rem; font-weight: 600; color: var(--text-main, #111827); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
.problem-icon { font-size: 1.5rem; }
.solution-steps { list-style: decimal; padding-left: 20px; }
.solution-steps li { margin-bottom: 8px; line-height: 1.6; }
.warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 12px 0; }
.tip-box { background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 12px; margin: 12px 0; }
</style>

<div class="lang-tabs">
  <button class="lang-tab active" onclick="switchLang(''tr'')">🇹🇷 Türkçe</button>
  <button class="lang-tab" onclick="switchLang(''en'')">🇬🇧 English</button>
  <button class="lang-tab" onclick="switchLang(''de'')">🇩🇪 Deutsch</button>
</div>

<!-- TÜRKÇE -->
<div id="content-tr" class="lang-content active">
<h2>🔧 Creality Yazıcı Sorun Giderme Rehberi</h2>

<p>Creality Ender 3, Ender 3 V2, CR-10 ve diğer popüler modellerde yaşanan yaygın sorunların çözümleri.</p>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔥</span> Isıtma Problemleri</div>
<p><strong>Belirti:</strong> Hotend veya tabla ısınmıyor, hedef sıcaklığa ulaşamıyor.</p>
<p><strong>Olası Nedenler:</strong></p>
<ol class="solution-steps">
<li><strong>Termistör arızası:</strong> Termistör kablosunu kontrol edin, gevşek bağlantı olabilir.</li>
<li><strong>Isıtıcı kartuş sorunu:</strong> Multimetre ile direnci ölçün (genellikle 10-15 ohm olmalı).</li>
<li><strong>MOSFET arızası:</strong> Anakart üzerindeki MOSFET yanmış olabilir.</li>
<li><strong>Güç kaynağı yetersizliği:</strong> PSU voltajını kontrol edin (12V veya 24V).</li>
</ol>
<div class="tip-box">💡 <strong>İpucu:</strong> Termistör değişimi sonrası firmware''de termistör tipini doğru ayarlayın.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">📏</span> İlk Katman Yapışma Sorunu</div>
<p><strong>Belirti:</strong> Baskı tablaya yapışmıyor, köşeler kalkıyor.</p>
<ol class="solution-steps">
<li><strong>Tabla seviyesi:</strong> Kağıt testi ile tablanızı yeniden seviyelendirin.</li>
<li><strong>Z-offset ayarı:</strong> Nozzle tabla arasındaki mesafeyi 0.1-0.2mm olarak ayarlayın.</li>
<li><strong>Tabla temizliği:</strong> IPA (%90+) ile tablanızı temizleyin.</li>
<li><strong>Tabla sıcaklığı:</strong> PLA için 60°C, PETG için 70-80°C kullanın.</li>
<li><strong>İlk katman hızı:</strong> %50''ye düşürün (15-25mm/s).</li>
</ol>
<div class="warning-box">⚠️ <strong>Uyarı:</strong> Cam tabla kullanıyorsanız, soğuk tablaya asla baskı yapmayın.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔄</span> Ekstrüzyon Problemleri</div>
<p><strong>Belirti:</strong> Filament gelmiyor, eksik ekstrüzyon, tıkanma.</p>
<ol class="solution-steps">
<li><strong>Nozzle tıkanması:</strong> Cold pull yöntemi veya acupuncture iğnesi ile temizleyin.</li>
<li><strong>Bowden tüp sorunu:</strong> PTFE tüpü kontrol edin, hotend girişinde yanık olabilir.</li>
<li><strong>Extruder gear aşınması:</strong> Brass gear yerine hardened steel gear kullanın.</li>
<li><strong>Tension ayarı:</strong> Extruder yayının gerginliğini ayarlayın.</li>
<li><strong>Sıcaklık yetersizliği:</strong> +5-10°C artırarak deneyin.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">〰️</span> Layer Shifting (Katman Kayması)</div>
<p><strong>Belirti:</strong> Katmanlar birbirine göre kaymış, merdiven etkisi.</p>
<ol class="solution-steps">
<li><strong>Kayış gerginliği:</strong> X ve Y eksen kayışlarını sıkın (parmakla bastırınca 5-6mm sehim).</li>
<li><strong>Kayış dişlisi:</strong> Grub vidalarının sıkı olduğundan emin olun.</li>
<li><strong>Motor sürücü akımı:</strong> Vref değerlerini kontrol edin.</li>
<li><strong>Hız ayarları:</strong> Baskı hızını %80''e düşürün.</li>
<li><strong>Mekanik engel:</strong> Kablo yönetimini kontrol edin, takılma olmasın.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🌡️</span> Termal Kaçak Hatası (Thermal Runaway)</div>
<p><strong>Belirti:</strong> "Thermal Runaway" hatası ve yazıcı durması.</p>
<ol class="solution-steps">
<li><strong>Termistör bağlantısı:</strong> Kablo sıkışması veya kırılma kontrolü.</li>
<li><strong>Isıtıcı silikon:</strong> Silikon çorabın düzgün takılı olduğunu kontrol edin.</li>
<li><strong>Fan yönlendirmesi:</strong> Part cooling fan''ın hotend''e değil baskıya yönlendiğinden emin olun.</li>
<li><strong>PID tuning:</strong> Yeni PID kalibrasyonu yapın: <code>M303 E0 S200 C8</code></li>
</ol>
<div class="warning-box">⚠️ <strong>Kritik:</strong> Thermal runaway koruması kapatılmamalıdır, yangın riski!</div>
</div>
</div>

<!-- ENGLISH -->
<div id="content-en" class="lang-content">
<h2>🔧 Creality Printer Troubleshooting Guide</h2>

<p>Solutions for common issues with Creality Ender 3, Ender 3 V2, CR-10 and other popular models.</p>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔥</span> Heating Problems</div>
<p><strong>Symptom:</strong> Hotend or bed not heating, cannot reach target temperature.</p>
<p><strong>Possible Causes:</strong></p>
<ol class="solution-steps">
<li><strong>Thermistor failure:</strong> Check thermistor cable, may have loose connection.</li>
<li><strong>Heater cartridge issue:</strong> Measure resistance with multimeter (should be 10-15 ohm).</li>
<li><strong>MOSFET failure:</strong> MOSFET on mainboard may be burned.</li>
<li><strong>Power supply insufficient:</strong> Check PSU voltage (12V or 24V).</li>
</ol>
<div class="tip-box">💡 <strong>Tip:</strong> After thermistor replacement, set correct thermistor type in firmware.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">📏</span> First Layer Adhesion Issues</div>
<p><strong>Symptom:</strong> Print not sticking to bed, corners lifting.</p>
<ol class="solution-steps">
<li><strong>Bed leveling:</strong> Re-level your bed using paper test.</li>
<li><strong>Z-offset:</strong> Adjust nozzle-bed gap to 0.1-0.2mm.</li>
<li><strong>Bed cleaning:</strong> Clean bed with IPA (90%+).</li>
<li><strong>Bed temperature:</strong> Use 60°C for PLA, 70-80°C for PETG.</li>
<li><strong>First layer speed:</strong> Reduce to 50% (15-25mm/s).</li>
</ol>
<div class="warning-box">⚠️ <strong>Warning:</strong> Never print on cold glass bed.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔄</span> Extrusion Problems</div>
<p><strong>Symptom:</strong> No filament flow, under-extrusion, clogging.</p>
<ol class="solution-steps">
<li><strong>Nozzle clog:</strong> Clean with cold pull method or acupuncture needle.</li>
<li><strong>Bowden tube issue:</strong> Check PTFE tube, may be burned at hotend entrance.</li>
<li><strong>Extruder gear wear:</strong> Use hardened steel gear instead of brass.</li>
<li><strong>Tension adjustment:</strong> Adjust extruder spring tension.</li>
<li><strong>Temperature too low:</strong> Try increasing by +5-10°C.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">〰️</span> Layer Shifting</div>
<p><strong>Symptom:</strong> Layers shifted relative to each other, staircase effect.</p>
<ol class="solution-steps">
<li><strong>Belt tension:</strong> Tighten X and Y axis belts (5-6mm deflection when pressed).</li>
<li><strong>Pulley grub screws:</strong> Ensure grub screws are tight.</li>
<li><strong>Motor driver current:</strong> Check Vref values.</li>
<li><strong>Speed settings:</strong> Reduce print speed to 80%.</li>
<li><strong>Mechanical obstruction:</strong> Check cable management for snags.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🌡️</span> Thermal Runaway Error</div>
<p><strong>Symptom:</strong> "Thermal Runaway" error and printer halts.</p>
<ol class="solution-steps">
<li><strong>Thermistor connection:</strong> Check for pinched or broken cables.</li>
<li><strong>Heater silicone:</strong> Ensure silicone sock is properly installed.</li>
<li><strong>Fan direction:</strong> Ensure part cooling fan points at print, not hotend.</li>
<li><strong>PID tuning:</strong> Run new PID calibration: <code>M303 E0 S200 C8</code></li>
</ol>
<div class="warning-box">⚠️ <strong>Critical:</strong> Never disable thermal runaway protection - fire hazard!</div>
</div>
</div>

<!-- DEUTSCH -->
<div id="content-de" class="lang-content">
<h2>🔧 Creality-Drucker Fehlerbehebungs-Anleitung</h2>

<p>Lösungen für häufige Probleme mit Creality Ender 3, Ender 3 V2, CR-10 und anderen beliebten Modellen.</p>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔥</span> Heizprobleme</div>
<p><strong>Symptom:</strong> Hotend oder Bett heizt nicht, erreicht Zieltemperatur nicht.</p>
<p><strong>Mögliche Ursachen:</strong></p>
<ol class="solution-steps">
<li><strong>Thermistor-Fehler:</strong> Thermistorkabel prüfen, möglicherweise lose Verbindung.</li>
<li><strong>Heizpatrone-Problem:</strong> Widerstand mit Multimeter messen (sollte 10-15 Ohm sein).</li>
<li><strong>MOSFET-Fehler:</strong> MOSFET auf der Hauptplatine könnte durchgebrannt sein.</li>
<li><strong>Netzteil unzureichend:</strong> PSU-Spannung prüfen (12V oder 24V).</li>
</ol>
<div class="tip-box">💡 <strong>Tipp:</strong> Nach Thermistor-Austausch korrekten Thermistor-Typ in Firmware einstellen.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">📏</span> Erste Schicht Haftungsprobleme</div>
<p><strong>Symptom:</strong> Druck haftet nicht am Bett, Ecken heben sich.</p>
<ol class="solution-steps">
<li><strong>Bett-Nivellierung:</strong> Bett mit Papiertest neu nivellieren.</li>
<li><strong>Z-Offset:</strong> Düse-Bett-Abstand auf 0,1-0,2mm einstellen.</li>
<li><strong>Bett-Reinigung:</strong> Bett mit IPA (90%+) reinigen.</li>
<li><strong>Bett-Temperatur:</strong> 60°C für PLA, 70-80°C für PETG verwenden.</li>
<li><strong>Erste Schicht Geschwindigkeit:</strong> Auf 50% reduzieren (15-25mm/s).</li>
</ol>
<div class="warning-box">⚠️ <strong>Warnung:</strong> Niemals auf kaltem Glasbett drucken.</div>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🔄</span> Extrusionsprobleme</div>
<p><strong>Symptom:</strong> Kein Filamentfluss, Unter-Extrusion, Verstopfung.</p>
<ol class="solution-steps">
<li><strong>Düsenverstopfung:</strong> Mit Cold-Pull-Methode oder Akupunkturnadel reinigen.</li>
<li><strong>Bowden-Schlauch-Problem:</strong> PTFE-Schlauch prüfen, am Hotend-Eingang verbrannt.</li>
<li><strong>Extruder-Zahnrad verschlissen:</strong> Gehärtetes Stahlzahnrad statt Messing verwenden.</li>
<li><strong>Spannungsanpassung:</strong> Extruder-Federspannung einstellen.</li>
<li><strong>Temperatur zu niedrig:</strong> +5-10°C erhöhen versuchen.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">〰️</span> Schichtverschiebung (Layer Shifting)</div>
<p><strong>Symptom:</strong> Schichten zueinander verschoben, Treppeneffekt.</p>
<ol class="solution-steps">
<li><strong>Riemenspannung:</strong> X- und Y-Achsen-Riemen spannen (5-6mm Durchhang).</li>
<li><strong>Riemenscheiben-Schrauben:</strong> Madenschrauben fest angezogen.</li>
<li><strong>Motor-Treiber-Strom:</strong> Vref-Werte prüfen.</li>
<li><strong>Geschwindigkeit:</strong> Druckgeschwindigkeit auf 80% reduzieren.</li>
<li><strong>Mechanische Hindernisse:</strong> Kabelmanagement auf Verhaken prüfen.</li>
</ol>
</div>

<div class="problem-card">
<div class="problem-title"><span class="problem-icon">🌡️</span> Thermal Runaway Fehler</div>
<p><strong>Symptom:</strong> "Thermal Runaway" Fehler und Drucker stoppt.</p>
<ol class="solution-steps">
<li><strong>Thermistor-Anschluss:</strong> Eingeklemmte oder gebrochene Kabel prüfen.</li>
<li><strong>Heizungs-Silikon:</strong> Silikonhülle korrekt installiert.</li>
<li><strong>Lüfter-Richtung:</strong> Teile-Kühlung auf Druck, nicht auf Hotend.</li>
<li><strong>PID-Tuning:</strong> Neue PID-Kalibrierung: <code>M303 E0 S200 C8</code></li>
</ol>
<div class="warning-box">⚠️ <strong>Kritisch:</strong> Thermal Runaway Schutz niemals deaktivieren - Brandgefahr!</div>
</div>
</div>

<script>
function switchLang(lang) {
    document.querySelectorAll(".lang-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".lang-tab").forEach(el => el.classList.remove("active"));
    document.getElementById("content-" + lang).classList.add("active");
    document.querySelector(".lang-tab[onclick*=\"" + lang + "\"]").classList.add("active");
}
document.addEventListener("DOMContentLoaded", function() {
    const host = window.location.hostname;
    let lang = "tr";
    if (host.startsWith("en.")) lang = "en";
    else if (host.startsWith("de.")) lang = "de";
    switchLang(lang);
});
</script>'
WHERE id = 457;
