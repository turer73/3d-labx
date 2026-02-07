-- Post 458: Cura Slicer Ustalık Rehberi
UPDATE posts SET
title_tr = 'Cura Slicer: Ustalık Rehberi - Başlangıçtan İleri Seviyeye',
title_en = 'Cura Slicer: Master Guide - From Beginner to Advanced',
title_de = 'Cura Slicer: Meisterhandbuch - Vom Anfänger zum Fortgeschrittenen',
summary_tr = 'Ultimaker Cura ile 3D baskı kalitesini maksimize etmek için kapsamlı ayar rehberi.',
summary_en = 'Comprehensive settings guide to maximize 3D print quality with Ultimaker Cura.',
summary_de = 'Umfassender Einstellungsleitfaden zur Maximierung der 3D-Druckqualität mit Ultimaker Cura.',
content_tr = '<!-- Multi-language Content -->
<style>
.lang-content { display: none; }
.lang-content.active { display: block; }
.lang-tabs { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.lang-tab { padding: 8px 16px; border: 1px solid var(--border-soft, #e5e7eb); border-radius: 8px; cursor: pointer; background: var(--bg-hover, #f3f4f6); transition: all 0.2s; }
.lang-tab.active { background: var(--accent, #3b82f6); color: white; border-color: var(--accent, #3b82f6); }
.lang-tab:hover { border-color: var(--accent, #3b82f6); }
.settings-section { background: var(--bg-card, #f9fafb); border: 1px solid var(--border-soft, #e5e7eb); border-radius: 12px; padding: 20px; margin-bottom: 20px; }
.settings-title { font-size: 1.2rem; font-weight: 600; color: var(--text-main, #111827); margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
.settings-icon { font-size: 1.5rem; }
.param-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
.param-table th, .param-table td { padding: 10px; text-align: left; border-bottom: 1px solid var(--border-soft, #e5e7eb); }
.param-table th { background: var(--bg-main, #f3f4f6); font-weight: 600; }
.tip-box { background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 12px; margin: 12px 0; }
.warning-box { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 12px 0; }
.pro-tip { background: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 12px; margin: 12px 0; }
</style>

<div class="lang-tabs">
  <button class="lang-tab active" onclick="switchLang(''tr'')">🇹🇷 Türkçe</button>
  <button class="lang-tab" onclick="switchLang(''en'')">🇬🇧 English</button>
  <button class="lang-tab" onclick="switchLang(''de'')">🇩🇪 Deutsch</button>
</div>

<!-- TÜRKÇE -->
<div id="content-tr" class="lang-content active">
<h2>🎯 Cura Slicer Ustalık Rehberi</h2>

<p>Ultimaker Cura, en popüler ve güçlü ücretsiz dilimleyici yazılımlarından biridir. Bu rehberde, temel ayarlardan ileri seviye optimizasyonlara kadar her şeyi öğreneceksiniz.</p>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🖨️</span> Temel Kalite Ayarları</div>

<table class="param-table">
<tr><th>Ayar</th><th>PLA</th><th>PETG</th><th>ABS</th></tr>
<tr><td>Katman Yüksekliği</td><td>0.2mm (standart)</td><td>0.2mm</td><td>0.2mm</td></tr>
<tr><td>İlk Katman Yüksekliği</td><td>0.3mm</td><td>0.3mm</td><td>0.3mm</td></tr>
<tr><td>Çizgi Genişliği</td><td>0.4mm</td><td>0.42mm</td><td>0.4mm</td></tr>
<tr><td>Duvar Çizgi Sayısı</td><td>2-3</td><td>3</td><td>3-4</td></tr>
<tr><td>Üst/Alt Katman Sayısı</td><td>3-4</td><td>4</td><td>4-5</td></tr>
</table>

<div class="tip-box">💡 <strong>İpucu:</strong> Detaylı baskılar için 0.12mm, hızlı prototip için 0.28mm katman yüksekliği kullanın.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🌡️</span> Sıcaklık Ayarları</div>

<table class="param-table">
<tr><th>Filament</th><th>Nozzle</th><th>Tabla</th><th>Fan</th></tr>
<tr><td>PLA</td><td>200-215°C</td><td>60°C</td><td>%100</td></tr>
<tr><td>PLA+</td><td>210-225°C</td><td>60°C</td><td>%100</td></tr>
<tr><td>PETG</td><td>230-250°C</td><td>70-80°C</td><td>%50-70</td></tr>
<tr><td>ABS</td><td>230-250°C</td><td>100-110°C</td><td>%0-30</td></tr>
<tr><td>TPU</td><td>220-240°C</td><td>40-60°C</td><td>%50</td></tr>
</table>

<div class="warning-box">⚠️ <strong>Önemli:</strong> PETG için fanı yüksek tutmayın, katmanlar arası yapışma zayıflar.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">⚡</span> Hız Optimizasyonu</div>

<table class="param-table">
<tr><th>Ayar</th><th>Kalite</th><th>Standart</th><th>Hızlı</th></tr>
<tr><td>Baskı Hızı</td><td>40mm/s</td><td>60mm/s</td><td>80-100mm/s</td></tr>
<tr><td>İlk Katman Hızı</td><td>20mm/s</td><td>25mm/s</td><td>30mm/s</td></tr>
<tr><td>Dolgu Hızı</td><td>60mm/s</td><td>80mm/s</td><td>120mm/s</td></tr>
<tr><td>Duvar Hızı</td><td>30mm/s</td><td>40mm/s</td><td>60mm/s</td></tr>
<tr><td>Seyahat Hızı</td><td>150mm/s</td><td>180mm/s</td><td>200mm/s</td></tr>
</table>

<div class="pro-tip">🚀 <strong>Pro İpucu:</strong> Input Shaper destekli yazıcılarda 150mm/s''e kadar çıkabilirsiniz.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔳</span> Dolgu (Infill) Ayarları</div>

<p><strong>Dolgu Yoğunluğu Önerileri:</strong></p>
<ul>
<li><strong>%10-15:</strong> Dekoratif objeler, hafif parçalar</li>
<li><strong>%20-30:</strong> Genel kullanım, fonksiyonel parçalar</li>
<li><strong>%40-50:</strong> Mekanik parçalar, dayanıklılık gereken yerler</li>
<li><strong>%100:</strong> Çok küçük parçalar veya maksimum dayanıklılık</li>
</ul>

<p><strong>Dolgu Desenleri:</strong></p>
<ul>
<li><strong>Cubic:</strong> Dengeli dayanıklılık (önerilen)</li>
<li><strong>Gyroid:</strong> Esnek parçalar için ideal</li>
<li><strong>Lightning:</strong> Üst yüzey desteği için minimum dolgu</li>
<li><strong>Tri-Hexagon:</strong> Yüksek dikey dayanıklılık</li>
</ul>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔙</span> Geri Çekme (Retraction) Ayarları</div>

<table class="param-table">
<tr><th>Yazıcı Tipi</th><th>Mesafe</th><th>Hız</th></tr>
<tr><td>Bowden (Ender 3)</td><td>5-7mm</td><td>45mm/s</td></tr>
<tr><td>Direct Drive</td><td>0.5-2mm</td><td>35mm/s</td></tr>
<tr><td>All-Metal Hotend</td><td>Bowden -1mm</td><td>35-40mm/s</td></tr>
</table>

<div class="tip-box">💡 <strong>Stringing sorunu?</strong> Geri çekme mesafesini 0.5mm artırın, sıcaklığı 5°C düşürün.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🏗️</span> Destek Yapısı (Support)</div>

<p><strong>Destek Türleri:</strong></p>
<ul>
<li><strong>Normal:</strong> Standart destek, çıkarması kolay</li>
<li><strong>Tree:</strong> Organik şekiller için, daha az iz bırakır</li>
</ul>

<p><strong>Önerilen Ayarlar:</strong></p>
<ul>
<li><strong>Destek Açısı:</strong> 45-55°</li>
<li><strong>Destek Yoğunluğu:</strong> %15-20</li>
<li><strong>Z Mesafesi:</strong> 0.2mm (katman yüksekliği)</li>
<li><strong>XY Mesafesi:</strong> 0.7mm</li>
</ul>
</div>
</div>

<!-- ENGLISH -->
<div id="content-en" class="lang-content">
<h2>🎯 Cura Slicer Master Guide</h2>

<p>Ultimaker Cura is one of the most popular and powerful free slicing software. In this guide, you will learn everything from basic settings to advanced optimizations.</p>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🖨️</span> Basic Quality Settings</div>

<table class="param-table">
<tr><th>Setting</th><th>PLA</th><th>PETG</th><th>ABS</th></tr>
<tr><td>Layer Height</td><td>0.2mm (standard)</td><td>0.2mm</td><td>0.2mm</td></tr>
<tr><td>Initial Layer Height</td><td>0.3mm</td><td>0.3mm</td><td>0.3mm</td></tr>
<tr><td>Line Width</td><td>0.4mm</td><td>0.42mm</td><td>0.4mm</td></tr>
<tr><td>Wall Line Count</td><td>2-3</td><td>3</td><td>3-4</td></tr>
<tr><td>Top/Bottom Layers</td><td>3-4</td><td>4</td><td>4-5</td></tr>
</table>

<div class="tip-box">💡 <strong>Tip:</strong> Use 0.12mm for detailed prints, 0.28mm for quick prototypes.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🌡️</span> Temperature Settings</div>

<table class="param-table">
<tr><th>Filament</th><th>Nozzle</th><th>Bed</th><th>Fan</th></tr>
<tr><td>PLA</td><td>200-215°C</td><td>60°C</td><td>100%</td></tr>
<tr><td>PLA+</td><td>210-225°C</td><td>60°C</td><td>100%</td></tr>
<tr><td>PETG</td><td>230-250°C</td><td>70-80°C</td><td>50-70%</td></tr>
<tr><td>ABS</td><td>230-250°C</td><td>100-110°C</td><td>0-30%</td></tr>
<tr><td>TPU</td><td>220-240°C</td><td>40-60°C</td><td>50%</td></tr>
</table>

<div class="warning-box">⚠️ <strong>Important:</strong> Do not run fan high for PETG, layer adhesion weakens.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">⚡</span> Speed Optimization</div>

<table class="param-table">
<tr><th>Setting</th><th>Quality</th><th>Standard</th><th>Fast</th></tr>
<tr><td>Print Speed</td><td>40mm/s</td><td>60mm/s</td><td>80-100mm/s</td></tr>
<tr><td>Initial Layer Speed</td><td>20mm/s</td><td>25mm/s</td><td>30mm/s</td></tr>
<tr><td>Infill Speed</td><td>60mm/s</td><td>80mm/s</td><td>120mm/s</td></tr>
<tr><td>Wall Speed</td><td>30mm/s</td><td>40mm/s</td><td>60mm/s</td></tr>
<tr><td>Travel Speed</td><td>150mm/s</td><td>180mm/s</td><td>200mm/s</td></tr>
</table>

<div class="pro-tip">🚀 <strong>Pro Tip:</strong> With Input Shaper enabled printers, you can go up to 150mm/s.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔳</span> Infill Settings</div>

<p><strong>Infill Density Recommendations:</strong></p>
<ul>
<li><strong>10-15%:</strong> Decorative objects, lightweight parts</li>
<li><strong>20-30%:</strong> General use, functional parts</li>
<li><strong>40-50%:</strong> Mechanical parts, high durability needed</li>
<li><strong>100%:</strong> Very small parts or maximum strength</li>
</ul>

<p><strong>Infill Patterns:</strong></p>
<ul>
<li><strong>Cubic:</strong> Balanced strength (recommended)</li>
<li><strong>Gyroid:</strong> Ideal for flexible parts</li>
<li><strong>Lightning:</strong> Minimum infill for top surface support</li>
<li><strong>Tri-Hexagon:</strong> High vertical strength</li>
</ul>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔙</span> Retraction Settings</div>

<table class="param-table">
<tr><th>Printer Type</th><th>Distance</th><th>Speed</th></tr>
<tr><td>Bowden (Ender 3)</td><td>5-7mm</td><td>45mm/s</td></tr>
<tr><td>Direct Drive</td><td>0.5-2mm</td><td>35mm/s</td></tr>
<tr><td>All-Metal Hotend</td><td>Bowden -1mm</td><td>35-40mm/s</td></tr>
</table>

<div class="tip-box">💡 <strong>Stringing issues?</strong> Increase retraction by 0.5mm, reduce temperature by 5°C.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🏗️</span> Support Structure</div>

<p><strong>Support Types:</strong></p>
<ul>
<li><strong>Normal:</strong> Standard support, easy to remove</li>
<li><strong>Tree:</strong> For organic shapes, leaves less marks</li>
</ul>

<p><strong>Recommended Settings:</strong></p>
<ul>
<li><strong>Support Angle:</strong> 45-55°</li>
<li><strong>Support Density:</strong> 15-20%</li>
<li><strong>Z Distance:</strong> 0.2mm (layer height)</li>
<li><strong>XY Distance:</strong> 0.7mm</li>
</ul>
</div>
</div>

<!-- DEUTSCH -->
<div id="content-de" class="lang-content">
<h2>🎯 Cura Slicer Meisterhandbuch</h2>

<p>Ultimaker Cura ist eine der beliebtesten und leistungsfähigsten kostenlosen Slicing-Softwares. In diesem Leitfaden lernen Sie alles von den Grundeinstellungen bis zu fortgeschrittenen Optimierungen.</p>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🖨️</span> Grundlegende Qualitätseinstellungen</div>

<table class="param-table">
<tr><th>Einstellung</th><th>PLA</th><th>PETG</th><th>ABS</th></tr>
<tr><td>Schichthöhe</td><td>0,2mm (Standard)</td><td>0,2mm</td><td>0,2mm</td></tr>
<tr><td>Erste Schichthöhe</td><td>0,3mm</td><td>0,3mm</td><td>0,3mm</td></tr>
<tr><td>Linienbreite</td><td>0,4mm</td><td>0,42mm</td><td>0,4mm</td></tr>
<tr><td>Wandlinienanzahl</td><td>2-3</td><td>3</td><td>3-4</td></tr>
<tr><td>Oben/Unten Schichten</td><td>3-4</td><td>4</td><td>4-5</td></tr>
</table>

<div class="tip-box">💡 <strong>Tipp:</strong> Verwenden Sie 0,12mm für detaillierte Drucke, 0,28mm für schnelle Prototypen.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🌡️</span> Temperatureinstellungen</div>

<table class="param-table">
<tr><th>Filament</th><th>Düse</th><th>Bett</th><th>Lüfter</th></tr>
<tr><td>PLA</td><td>200-215°C</td><td>60°C</td><td>100%</td></tr>
<tr><td>PLA+</td><td>210-225°C</td><td>60°C</td><td>100%</td></tr>
<tr><td>PETG</td><td>230-250°C</td><td>70-80°C</td><td>50-70%</td></tr>
<tr><td>ABS</td><td>230-250°C</td><td>100-110°C</td><td>0-30%</td></tr>
<tr><td>TPU</td><td>220-240°C</td><td>40-60°C</td><td>50%</td></tr>
</table>

<div class="warning-box">⚠️ <strong>Wichtig:</strong> Lüfter für PETG nicht zu hoch einstellen, Schichthaftung wird schwächer.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">⚡</span> Geschwindigkeitsoptimierung</div>

<table class="param-table">
<tr><th>Einstellung</th><th>Qualität</th><th>Standard</th><th>Schnell</th></tr>
<tr><td>Druckgeschwindigkeit</td><td>40mm/s</td><td>60mm/s</td><td>80-100mm/s</td></tr>
<tr><td>Erste Schicht Geschw.</td><td>20mm/s</td><td>25mm/s</td><td>30mm/s</td></tr>
<tr><td>Füllungsgeschwindigkeit</td><td>60mm/s</td><td>80mm/s</td><td>120mm/s</td></tr>
<tr><td>Wandgeschwindigkeit</td><td>30mm/s</td><td>40mm/s</td><td>60mm/s</td></tr>
<tr><td>Fahrgeschwindigkeit</td><td>150mm/s</td><td>180mm/s</td><td>200mm/s</td></tr>
</table>

<div class="pro-tip">🚀 <strong>Profi-Tipp:</strong> Mit Input Shaper können Sie bis zu 150mm/s erreichen.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔳</span> Füllungseinstellungen (Infill)</div>

<p><strong>Empfohlene Fülldichte:</strong></p>
<ul>
<li><strong>10-15%:</strong> Dekorative Objekte, leichte Teile</li>
<li><strong>20-30%:</strong> Allgemeiner Gebrauch, funktionale Teile</li>
<li><strong>40-50%:</strong> Mechanische Teile, hohe Haltbarkeit erforderlich</li>
<li><strong>100%:</strong> Sehr kleine Teile oder maximale Festigkeit</li>
</ul>

<p><strong>Füllungsmuster:</strong></p>
<ul>
<li><strong>Cubic:</strong> Ausgewogene Festigkeit (empfohlen)</li>
<li><strong>Gyroid:</strong> Ideal für flexible Teile</li>
<li><strong>Lightning:</strong> Minimale Füllung für Oberflächen-Support</li>
<li><strong>Tri-Hexagon:</strong> Hohe vertikale Festigkeit</li>
</ul>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🔙</span> Rückzugseinstellungen (Retraction)</div>

<table class="param-table">
<tr><th>Druckertyp</th><th>Distanz</th><th>Geschwindigkeit</th></tr>
<tr><td>Bowden (Ender 3)</td><td>5-7mm</td><td>45mm/s</td></tr>
<tr><td>Direct Drive</td><td>0,5-2mm</td><td>35mm/s</td></tr>
<tr><td>All-Metal Hotend</td><td>Bowden -1mm</td><td>35-40mm/s</td></tr>
</table>

<div class="tip-box">💡 <strong>Stringing-Probleme?</strong> Rückzug um 0,5mm erhöhen, Temperatur um 5°C senken.</div>
</div>

<div class="settings-section">
<div class="settings-title"><span class="settings-icon">🏗️</span> Stützstruktur (Support)</div>

<p><strong>Support-Typen:</strong></p>
<ul>
<li><strong>Normal:</strong> Standard-Support, leicht zu entfernen</li>
<li><strong>Tree:</strong> Für organische Formen, hinterlässt weniger Spuren</li>
</ul>

<p><strong>Empfohlene Einstellungen:</strong></p>
<ul>
<li><strong>Support-Winkel:</strong> 45-55°</li>
<li><strong>Support-Dichte:</strong> 15-20%</li>
<li><strong>Z-Abstand:</strong> 0,2mm (Schichthöhe)</li>
<li><strong>XY-Abstand:</strong> 0,7mm</li>
</ul>
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
WHERE id = 458;
