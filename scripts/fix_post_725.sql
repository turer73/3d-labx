-- Post 725: Orca Slicer Ustalık Rehberi - Site temasına uyumlu
UPDATE posts SET content_tr = '<!-- Multi-language Content - Site Theme Compatible -->
<style>
.orca-guide { font-family: var(--font-sans, "Inter", system-ui, sans-serif); }
.orca-guide .lang-content { display: none; }
.orca-guide .lang-content.active { display: block; }

/* Language Tabs */
.orca-guide .lang-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 24px;
    padding: 6px;
    background: var(--bg-card, #fff);
    border: 1px solid var(--border-soft, #e2e8f0);
    border-radius: 12px;
    width: fit-content;
}
.orca-guide .lang-tab {
    padding: 8px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: transparent;
    color: var(--text-muted, #64748b);
}
.orca-guide .lang-tab:hover { color: var(--text-main, #0f172a); }
.orca-guide .lang-tab.active {
    background: linear-gradient(135deg, #14b8a6, #0d9488);
    color: white;
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
}

/* Cards & Sections */
.orca-guide .guide-card {
    background: var(--bg-card, #fff);
    border: 1px solid var(--border-soft, #e2e8f0);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
    transition: all 0.3s;
}
.orca-guide .guide-card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(-2px);
}
.orca-guide .guide-card.featured {
    border-left: 4px solid #14b8a6;
    background: linear-gradient(135deg, var(--bg-card, #fff), rgba(20, 184, 166, 0.05));
}

/* Section Headers */
.orca-guide .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
}
.orca-guide .section-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 1.25rem;
}
.orca-guide .section-icon.teal { background: rgba(20, 184, 166, 0.15); color: #0d9488; }
.orca-guide .section-icon.purple { background: rgba(139, 92, 246, 0.15); color: #7c3aed; }
.orca-guide .section-icon.orange { background: rgba(249, 115, 22, 0.15); color: #ea580c; }
.orca-guide .section-icon.green { background: rgba(34, 197, 94, 0.15); color: #16a34a; }

.orca-guide .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-main, #0f172a);
}

/* Code Blocks */
.orca-guide .code-block {
    background: var(--bg-code, #f1f5f9);
    border: 1px solid var(--border-soft, #e2e8f0);
    border-radius: 8px;
    padding: 16px;
    font-family: "JetBrains Mono", monospace;
    font-size: 0.85rem;
    overflow-x: auto;
    color: var(--text-main, #0f172a);
}
.orca-guide .code-block.green { border-left: 3px solid #22c55e; background: rgba(34, 197, 94, 0.05); }

/* Material Cards */
.orca-guide .material-card {
    background: var(--bg-soft, #f8fafc);
    border: 1px solid var(--border-soft, #e2e8f0);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
}
.orca-guide .material-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}
.orca-guide .material-name {
    font-weight: 700;
    color: #0d9488;
    font-size: 1rem;
}
.orca-guide .material-badge {
    font-size: 0.7rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    background: rgba(20, 184, 166, 0.15);
    color: #0d9488;
}

/* Tip/Warning Boxes */
.orca-guide .tip-box {
    background: rgba(139, 92, 246, 0.08);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 0.875rem;
    color: #7c3aed;
}

/* Grid Layout */
.orca-guide .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}
@media (max-width: 768px) {
    .orca-guide .grid-2 { grid-template-columns: 1fr; }
}

/* Lists */
.orca-guide ul { padding-left: 20px; margin: 12px 0; }
.orca-guide li { margin-bottom: 8px; line-height: 1.6; color: var(--text-muted, #64748b); font-size: 0.9rem; }
.orca-guide li strong { color: var(--text-main, #0f172a); }

/* Feature Items */
.orca-guide .feature-item { margin-bottom: 20px; }
.orca-guide .feature-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #7c3aed;
    margin-bottom: 8px;
}
.orca-guide .feature-desc {
    font-size: 0.9rem;
    color: var(--text-muted, #64748b);
    line-height: 1.6;
}

/* Klipper Section */
.orca-guide .klipper-section {
    background: linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(34, 197, 94, 0.08));
    border: 1px solid rgba(20, 184, 166, 0.2);
    border-radius: 16px;
    padding: 24px;
}
.orca-guide .klipper-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 16px;
}
@media (max-width: 768px) {
    .orca-guide .klipper-grid { grid-template-columns: 1fr; }
}
.orca-guide .klipper-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
}
.orca-guide .klipper-icon {
    color: #0d9488;
    font-size: 1.1rem;
    margin-top: 2px;
}
</style>

<div class="orca-guide">
    <div class="lang-tabs">
        <button class="lang-tab active" onclick="switchOrcaLang(''tr'')">🇹🇷 Türkçe</button>
        <button class="lang-tab" onclick="switchOrcaLang(''en'')">🇬🇧 English</button>
        <button class="lang-tab" onclick="switchOrcaLang(''de'')">🇩🇪 Deutsch</button>
    </div>

    <!-- TÜRKÇE İÇERİK -->
    <div id="orca-tr" class="lang-content active">
        <div class="guide-card featured">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 12px;">🌊 Orca Slicer: Mühendislik Odaklı Dilimleme</h2>
            <p style="color: var(--text-muted, #64748b); line-height: 1.7;">PrusaSlicer''ın gücünü ve Bambu Studio''nun modern arayüzünü birleştiren Orca, sadece bir dilimleyici değil, donanım bağımsız (vendor-agnostic) bir optimizasyon merkezidir.</p>
        </div>

        <div class="guide-card">
            <div class="section-header">
                <div class="section-icon teal">📐</div>
                <div class="section-title">Kapsamlı Kalibrasyon Araçları</div>
            </div>
            <div class="grid-2">
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">1. Akış Hızı (Flow Rate)</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Nozuldan çıkan malzemenin teorik hesapla uyumunu sağlar. Hatalı akış, katman boşluklarına veya yüzey bozukluklarına yol açar.</p>
                    <ul>
                        <li><strong>Pass 1:</strong> Kaba ayar. -20 ile +20 arası bloklar basılır.</li>
                        <li><strong>Pass 2:</strong> İnce ayar. -9 ile 0 arası mikron düzeyinde düzeltme.</li>
                    </ul>
                    <div class="code-block">Yeni Akış = Eski Akış × (100 + Değiştirici) / 100</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">2. Basınç İlerlemesi (Pressure Advance)</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Hızlanma ve yavaşlama sırasında oluşan basınç farkını yöneterek köşe şişmelerini engeller.</p>
                    <div class="code-block">PA Değeri = Başlangıç + (Artış Miktarı × Ölçülen Yükseklik)</div>

                    <h4 style="font-weight: 600; color: #0d9488; margin: 16px 0 8px;">3. VFA ve Max Volumetric Speed</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);"><strong>VFA:</strong> Yazıcının rezonansa girdiği hızları tespit eder.<br><strong>Max Vol. Speed:</strong> Hotend''in eritme kapasitesini test eder.</p>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon purple">✨</div>
                    <div class="section-title">İleri Yüzey Teknolojileri</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔗 Scarf Seam (Eşarp Ek Yeri)</div>
                    <div class="feature-desc">Z-dikiş izini yok etmek için katman geçişini rampa şeklinde yapar.</div>
                    <div class="tip-box" style="margin-top: 8px;">💡 <strong>İpucu:</strong> En iyi sonuç için duvar sırasını "Inner/Outer/Inner" yapın.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">📏 Precise Wall (Hassas Duvar)</div>
                    <div class="feature-desc">Boyutsal sapmayı ±0.01 mm seviyesine indirir. Geçme toleransı gerektiren parçalar için kritiktir.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔧 Small Area Flow Compensation</div>
                    <div class="feature-desc">Küçük detaylarda (örneğin yazılar) oluşan yığılmaları önlemek için akış hızını dinamik olarak düşürür.</div>
                </div>
            </div>

            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon orange">🧪</div>
                    <div class="section-title">Malzeme Bazlı Stratejiler</div>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">PETG</span>
                        <span class="material-badge">Yapısal</span>
                    </div>
                    <ul>
                        <li>Fan: %30-50 (Yapışma için düşük tutun)</li>
                        <li>Hız: 40-60mm/s (Termal kararlılık)</li>
                        <li><strong>Önemli:</strong> "Avoid crossing walls" aktif edilmeli.</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">TPU (Esnek)</span>
                        <span class="material-badge">Flex</span>
                    </div>
                    <ul>
                        <li><strong>Max Vol. Speed:</strong> 3-5 mm³/s (Kritik!)</li>
                        <li>Retraction: Kapalı veya çok düşük.</li>
                        <li>Baskı öncesi mutlaka kurutun.</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">ASA / ABS</span>
                        <span class="material-badge">Mühendislik</span>
                    </div>
                    <ul>
                        <li><strong>Ön Isıtma:</strong> Yatak 110°C''de 15dk bekleyerek kabini ısıtın.</li>
                        <li>Fan: %0-20. Sadece köprülerde zorunlu soğutma.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="klipper-section">
            <div class="section-header">
                <div class="section-icon green">💻</div>
                <div class="section-title">Klipper & Makro Entegrasyonu</div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">Orca Slicer, Klipper makrolarına veri göndermek için özel bir söz dizimi kullanır:</p>
            <div class="code-block green">START_PRINT EXTRUDER_TEMP=[nozzle_temperature_initial_layer] BED_TEMP=[bed_temperature_initial_layer_single]</div>
            <div class="klipper-grid">
                <div class="klipper-item">
                    <span class="klipper-icon">📡</span>
                    <div>
                        <strong style="color: #0d9488;">Tam Kontrol</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Device sekmesinden Mainsail/Fluidd arayüzüne erişim.</p>
                    </div>
                </div>
                <div class="klipper-item">
                    <span class="klipper-icon">🎯</span>
                    <div>
                        <strong style="color: #0d9488;">Adaptive Bed Mesh</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Klipper sadece baskı alanını tarar, zamandan tasarruf.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ENGLISH CONTENT -->
    <div id="orca-en" class="lang-content">
        <div class="guide-card featured">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 12px;">🌊 Orca Slicer: Engineering Focused Slicing</h2>
            <p style="color: var(--text-muted, #64748b); line-height: 1.7;">Combining the power of PrusaSlicer with the modern UI of Bambu Studio, Orca is a vendor-agnostic optimization hub.</p>
        </div>

        <div class="guide-card">
            <div class="section-header">
                <div class="section-icon teal">📐</div>
                <div class="section-title">Comprehensive Calibration Tools</div>
            </div>
            <div class="grid-2">
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">1. Flow Rate</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Ensures extruded volume matches theoretical calculations. Prevents over/under extrusion.</p>
                    <ul>
                        <li><strong>Pass 1:</strong> Coarse tuning blocks (-20 to +20).</li>
                        <li><strong>Pass 2:</strong> Fine tuning (-9 to 0) for micron-level precision.</li>
                    </ul>
                    <div class="code-block">New Flow = Old Flow × (100 + Modifier) / 100</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">2. Pressure Advance</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Manages pressure lag during acceleration to prevent bulging corners.</p>
                    <div class="code-block">PA Value = Start + (Step × Measured Height)</div>

                    <h4 style="font-weight: 600; color: #0d9488; margin: 16px 0 8px;">3. VFA & Max Volumetric Speed</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);"><strong>VFA:</strong> Detects resonance speeds causing vertical artifacts.<br><strong>Max Vol. Speed:</strong> Caps speed based on hotend melting capacity.</p>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon purple">✨</div>
                    <div class="section-title">Advanced Surface Tech</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔗 Scarf Seam</div>
                    <div class="feature-desc">Eliminates Z-seam by ramping layer transitions like woodworking joints.</div>
                    <div class="tip-box" style="margin-top: 8px;">💡 <strong>Tip:</strong> Use "Inner/Outer/Inner" wall order for best results.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">📏 Precise Wall</div>
                    <div class="feature-desc">Controls wall overlap to achieve ±0.01 mm dimensional accuracy. Crucial for interference fits.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔧 Small Area Flow Compensation</div>
                    <div class="feature-desc">Dynamically reduces flow on short paths (<10mm) to prevent blobs on small details.</div>
                </div>
            </div>

            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon orange">🧪</div>
                    <div class="section-title">Material Strategies</div>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">PETG</span>
                        <span class="material-badge">Structural</span>
                    </div>
                    <ul>
                        <li>Fan: 30-50% (Low for adhesion)</li>
                        <li>Speed: 40-60mm/s</li>
                        <li><strong>Enable:</strong> "Avoid crossing walls" to stop stringing.</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">TPU (Flex)</span>
                        <span class="material-badge">Flex</span>
                    </div>
                    <ul>
                        <li><strong>Max Vol. Speed:</strong> 3-5 mm³/s (Critical!)</li>
                        <li>Retraction: Off or very low.</li>
                        <li>Must dry filament before printing.</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">ASA / ABS</span>
                        <span class="material-badge">Engineering</span>
                    </div>
                    <ul>
                        <li><strong>Pre-heat:</strong> Heat bed to 110°C for 15m to warm chamber.</li>
                        <li>Fan: 0-20%. Only force cooling on overhangs.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="klipper-section">
            <div class="section-header">
                <div class="section-icon green">💻</div>
                <div class="section-title">Klipper Integration</div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">Use this specific syntax to pass temperature variables to Klipper macros:</p>
            <div class="code-block green">START_PRINT EXTRUDER_TEMP=[nozzle_temperature_initial_layer] BED_TEMP=[bed_temperature_initial_layer_single]</div>
            <div class="klipper-grid">
                <div class="klipper-item">
                    <span class="klipper-icon">📡</span>
                    <div>
                        <strong style="color: #0d9488;">Full Control</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Direct access to Mainsail/Fluidd within the "Device" tab.</p>
                    </div>
                </div>
                <div class="klipper-item">
                    <span class="klipper-icon">🎯</span>
                    <div>
                        <strong style="color: #0d9488;">Adaptive Bed Mesh</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">"Label Objects" support allows Klipper to probe only the print area.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- GERMAN CONTENT -->
    <div id="orca-de" class="lang-content">
        <div class="guide-card featured">
            <h2 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 12px;">🌊 Orca Slicer: Ingenieurorientiertes Slicing</h2>
            <p style="color: var(--text-muted, #64748b); line-height: 1.7;">Kombiniert die Stärke von PrusaSlicer mit der modernen Benutzeroberfläche von Bambu Studio. Ein herstellerunabhängiges Optimierungszentrum.</p>
        </div>

        <div class="guide-card">
            <div class="section-header">
                <div class="section-icon teal">📐</div>
                <div class="section-title">Umfassende Kalibrierungswerkzeuge</div>
            </div>
            <div class="grid-2">
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">1. Flussrate (Flow Rate)</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Stellt sicher, dass das extrudierte Volumen der Theorie entspricht.</p>
                    <ul>
                        <li><strong>Pass 1:</strong> Grobe Abstimmung (-20 bis +20).</li>
                        <li><strong>Pass 2:</strong> Feinabstimmung (-9 bis 0) für Mikron-Präzision.</li>
                    </ul>
                    <div class="code-block">Neuer Fluss = Alter Fluss × (100 + Modifikator) / 100</div>
                </div>
                <div>
                    <h4 style="font-weight: 600; color: #0d9488; margin-bottom: 8px;">2. Pressure Advance</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 12px;">Steuert den Druckausgleich bei Beschleunigung.</p>
                    <div class="code-block">PA-Wert = Start + (Schritt × Gemessene Höhe)</div>

                    <h4 style="font-weight: 600; color: #0d9488; margin: 16px 0 8px;">3. VFA & Max Volumetric Speed</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);"><strong>VFA:</strong> Erkennen von Resonanzgeschwindigkeiten.<br><strong>Max Vol. Speed:</strong> Begrenzt die Geschwindigkeit.</p>
                </div>
            </div>
        </div>

        <div class="grid-2">
            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon purple">✨</div>
                    <div class="section-title">Fortschrittliche Oberflächentechnik</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔗 Scarf Seam</div>
                    <div class="feature-desc">Eliminiert die Z-Naht durch rampenförmige Schichtübergänge.</div>
                    <div class="tip-box" style="margin-top: 8px;">💡 <strong>Tipp:</strong> Wandreihenfolge "Inner/Outer/Inner" verwenden.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">📏 Precise Wall</div>
                    <div class="feature-desc">Kontrolliert Überlappungen für ±0,01 mm Maßhaltigkeit.</div>
                </div>
                <div class="feature-item">
                    <div class="feature-title">🔧 Small Area Flow Compensation</div>
                    <div class="feature-desc">Reduziert den Fluss dynamisch bei kurzen Pfaden (<10mm).</div>
                </div>
            </div>

            <div class="guide-card">
                <div class="section-header">
                    <div class="section-icon orange">🧪</div>
                    <div class="section-title">Materialstrategien</div>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">PETG</span>
                        <span class="material-badge">Strukturell</span>
                    </div>
                    <ul>
                        <li>Lüfter: 30-50% (Niedrig für Haftung)</li>
                        <li>Geschwindigkeit: 40-60mm/s</li>
                        <li><strong>Aktivieren:</strong> "Avoid crossing walls"</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">TPU (Flex)</span>
                        <span class="material-badge">Flexibel</span>
                    </div>
                    <ul>
                        <li><strong>Max Vol. Speed:</strong> 3-5 mm³/s (Kritisch!)</li>
                        <li>Retraction: Aus oder sehr niedrig.</li>
                        <li>Filament muss trocken sein.</li>
                    </ul>
                </div>
                <div class="material-card">
                    <div class="material-header">
                        <span class="material-name">ASA / ABS</span>
                        <span class="material-badge">Ingenieurwesen</span>
                    </div>
                    <ul>
                        <li><strong>Vorheizen:</strong> Bett auf 110°C für 15 Min.</li>
                        <li>Lüfter: 0-20%. Kühlung nur bei Überhängen.</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="klipper-section">
            <div class="section-header">
                <div class="section-icon green">💻</div>
                <div class="section-title">Klipper Integration</div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">Verwenden Sie diese Syntax, um Temperaturvariablen an Klipper-Makros zu übergeben:</p>
            <div class="code-block green">START_PRINT EXTRUDER_TEMP=[nozzle_temperature_initial_layer] BED_TEMP=[bed_temperature_initial_layer_single]</div>
            <div class="klipper-grid">
                <div class="klipper-item">
                    <span class="klipper-icon">📡</span>
                    <div>
                        <strong style="color: #0d9488;">Volle Kontrolle</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Direkter Zugriff auf Mainsail/Fluidd.</p>
                    </div>
                </div>
                <div class="klipper-item">
                    <span class="klipper-icon">🎯</span>
                    <div>
                        <strong style="color: #0d9488;">Adaptive Bed Mesh</strong>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Klipper tastet nur den Druckbereich ab.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function switchOrcaLang(lang) {
    document.querySelectorAll(".orca-guide .lang-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".orca-guide .lang-tab").forEach(el => el.classList.remove("active"));
    document.getElementById("orca-" + lang).classList.add("active");
    document.querySelector(".orca-guide .lang-tab[onclick*=\"" + lang + "\"]").classList.add("active");
}
document.addEventListener("DOMContentLoaded", function() {
    const host = window.location.hostname;
    let lang = "tr";
    if (host.startsWith("en.")) lang = "en";
    else if (host.startsWith("de.")) lang = "de";
    switchOrcaLang(lang);
});
</script>'
WHERE id = 725;
