import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');

// ===== WORDQUEST OG IMAGE (1200x630) =====
async function createWordQuestOG() {
    const width = 1200;
    const height = 630;

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0f172a"/>
                <stop offset="50%" style="stop-color:#1e293b"/>
                <stop offset="100%" style="stop-color:#0f172a"/>
            </linearGradient>
            <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#8b5cf6"/>
            </linearGradient>
            <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#f59e0b"/>
                <stop offset="100%" style="stop-color:#f97316"/>
            </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bg)"/>

        <!-- Decorative circles -->
        <circle cx="100" cy="80" r="200" fill="#3b82f6" opacity="0.06"/>
        <circle cx="1100" cy="550" r="250" fill="#8b5cf6" opacity="0.06"/>
        <circle cx="600" cy="300" r="350" fill="#3b82f6" opacity="0.03"/>

        <!-- Grid pattern -->
        <g opacity="0.04">
            ${Array.from({length: 20}, (_, i) => `<line x1="${i*65}" y1="0" x2="${i*65}" y2="${height}" stroke="#fff" stroke-width="0.5"/>`).join('')}
            ${Array.from({length: 10}, (_, i) => `<line x1="0" y1="${i*65}" x2="${width}" y2="${i*65}" stroke="#fff" stroke-width="0.5"/>`).join('')}
        </g>

        <!-- Top accent line -->
        <rect x="0" y="0" width="${width}" height="4" fill="url(#accent)"/>

        <!-- Book icon area -->
        <rect x="80" y="180" width="120" height="120" rx="24" fill="#1e40af" opacity="0.3"/>
        <text x="140" y="270" text-anchor="middle" font-size="72">📚</text>

        <!-- Title -->
        <text x="230" y="230" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">WordQuest</text>

        <!-- Subtitle -->
        <text x="230" y="280" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#94a3b8">ÖSYM Formatında İngilizce Kelime Oyunu</text>

        <!-- Exam badges -->
        <rect x="80" y="340" width="100" height="40" rx="20" fill="url(#accent)"/>
        <text x="130" y="366" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">YDS</text>

        <rect x="200" y="340" width="100" height="40" rx="20" fill="url(#accent)"/>
        <text x="250" y="366" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">YKS</text>

        <rect x="320" y="340" width="100" height="40" rx="20" fill="url(#accent)"/>
        <text x="370" y="366" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">YDT</text>

        <rect x="440" y="340" width="130" height="40" rx="20" fill="url(#accent)"/>
        <text x="505" y="366" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">YÖKDİL</text>

        <!-- Stats boxes -->
        <g transform="translate(700, 160)">
            <rect x="0" y="0" width="200" height="90" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="100" y="40" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="url(#gold)">460+</text>
            <text x="100" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#94a3b8">Soru</text>

            <rect x="220" y="0" width="200" height="90" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="320" y="40" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="url(#gold)">7</text>
            <text x="320" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#94a3b8">Soru Tipi</text>
        </g>

        <g transform="translate(700, 270)">
            <rect x="0" y="0" width="200" height="90" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="100" y="40" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="#22c55e">Ücretsiz</text>
            <text x="100" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#94a3b8">Kayıt Gereksiz</text>

            <rect x="220" y="0" width="200" height="90" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="320" y="40" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="bold" fill="#f472b6">Meydan Oku</text>
            <text x="320" y="70" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#94a3b8">Arkadaşlarına</text>
        </g>

        <!-- Features line -->
        <text x="80" y="440" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#64748b">🧠 Leitner Tekrar  ·  ⚔️ Meydan Okuma  ·  📊 İstatistikler  ·  🏆 XP Sistemi</text>

        <!-- Bottom bar -->
        <rect x="0" y="530" width="${width}" height="100" fill="#0c1322"/>
        <text x="80" y="580" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#475569">3d-labx.com/wordquest</text>

        <!-- CTA -->
        <rect x="870" y="548" width="250" height="50" rx="25" fill="url(#accent)"/>
        <text x="995" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">Hemen Oyna ▶</text>

        <!-- 3D-labX logo text -->
        <text x="1120" y="520" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#475569">3D-labX</text>
    </svg>`;

    const outputPath = resolve(rootDir, 'public/wordquest/og-image.png');
    await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outputPath);
    console.log('✅ WordQuest OG image created:', outputPath);
}

// ===== WORDQUEST PWA ICON (512x512) =====
async function createWordQuestIcon(size = 512) {
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e40af"/>
                <stop offset="100%" style="stop-color:#3b82f6"/>
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size*0.18}" fill="url(#bg)"/>
        <text x="${size/2}" y="${size*0.42}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size*0.45}" font-weight="bold" fill="#ffffff">W</text>
        <text x="${size/2}" y="${size*0.72}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size*0.14}" font-weight="bold" fill="#93c5fd">QUEST</text>
        <rect x="${size*0.2}" y="${size*0.78}" width="${size*0.6}" height="${size*0.04}" rx="${size*0.02}" fill="#f59e0b" opacity="0.8"/>
    </svg>`;

    const sizes = [192, 512];
    for (const s of sizes) {
        const outputPath = resolve(rootDir, `public/wordquest/icons/icon-${s}.png`);
        await sharp(Buffer.from(svg)).resize(s, s).png().toFile(outputPath);
        console.log(`✅ WordQuest icon-${s}.png created`);
    }
}

// ===== KELIME FETHI OG IMAGE (1200x630) =====
async function createKelimeFethiOG() {
    const width = 1200;
    const height = 630;

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0f172a"/>
                <stop offset="50%" style="stop-color:#1a1a2e"/>
                <stop offset="100%" style="stop-color:#0f172a"/>
            </linearGradient>
            <linearGradient id="green" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#22c55e"/>
                <stop offset="100%" style="stop-color:#16a34a"/>
            </linearGradient>
            <linearGradient id="yellow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#eab308"/>
                <stop offset="100%" style="stop-color:#f59e0b"/>
            </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="${width}" height="${height}" fill="url(#bg2)"/>

        <!-- Decorative -->
        <circle cx="150" cy="100" r="200" fill="#22c55e" opacity="0.05"/>
        <circle cx="1050" cy="530" r="250" fill="#eab308" opacity="0.05"/>

        <!-- Top accent line -->
        <rect x="0" y="0" width="${width}" height="4" fill="url(#green)"/>

        <!-- Wordle-style letter boxes -->
        <g transform="translate(80, 140)">
            <!-- K -->
            <rect x="0" y="0" width="80" height="80" rx="8" fill="#22c55e"/>
            <text x="40" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">K</text>
            <!-- E -->
            <rect x="90" y="0" width="80" height="80" rx="8" fill="#22c55e"/>
            <text x="130" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">E</text>
            <!-- L -->
            <rect x="180" y="0" width="80" height="80" rx="8" fill="#eab308"/>
            <text x="220" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">L</text>
            <!-- İ -->
            <rect x="270" y="0" width="80" height="80" rx="8" fill="#64748b"/>
            <text x="310" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">İ</text>
            <!-- M -->
            <rect x="360" y="0" width="80" height="80" rx="8" fill="#22c55e"/>
            <text x="400" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">M</text>
            <!-- E -->
            <rect x="450" y="0" width="80" height="80" rx="8" fill="#eab308"/>
            <text x="490" y="56" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">E</text>
        </g>

        <!-- Title -->
        <text x="80" y="310" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="bold" fill="#ffffff">Kelime Fethi</text>

        <!-- Subtitle -->
        <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#94a3b8">Türkçe Wordle · Günlük Kelime Bulmaca Oyunu</text>

        <!-- Features -->
        <g transform="translate(700, 140)">
            <rect x="0" y="0" width="420" height="80" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="30" y="36" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="url(#yellow)">1005</text>
            <text x="125" y="36" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8">Kelime</text>
            <text x="30" y="64" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b">Zengin kelime havuzu</text>
        </g>

        <g transform="translate(700, 240)">
            <rect x="0" y="0" width="420" height="80" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="30" y="36" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="url(#green)">81 Şehir</text>
            <text x="30" y="64" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b">Fetih haritası ile Türkiye turu</text>
        </g>

        <g transform="translate(700, 340)">
            <rect x="0" y="0" width="420" height="80" rx="16" fill="#1e293b" stroke="#334155" stroke-width="1"/>
            <text x="30" y="36" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="bold" fill="#f472b6">3 Zorluk</text>
            <text x="30" y="64" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b">Kolay · Normal · Zor</text>
        </g>

        <!-- Tags -->
        <text x="80" y="430" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#64748b">🎯 Günlük Bulmaca  ·  🗺️ Harita  ·  ⚔️ Meydan Okuma  ·  🏆 Liderlik Tablosu</text>

        <!-- Bottom bar -->
        <rect x="0" y="530" width="${width}" height="100" fill="#0c1322"/>
        <text x="80" y="580" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#475569">3d-labx.com/kelime-fethi</text>

        <!-- CTA -->
        <rect x="870" y="548" width="250" height="50" rx="25" fill="url(#green)"/>
        <text x="995" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="bold" fill="#ffffff">Hemen Oyna ▶</text>

        <text x="1120" y="520" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#475569">3D-labX</text>
    </svg>`;

    const outputPath = resolve(rootDir, 'public/kelime-fethi/og-image.png');
    await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outputPath);
    console.log('✅ Kelime Fethi OG image created:', outputPath);
}

// ===== KELIME FETHI PWA ICON (512x512) =====
async function createKelimeFethiIcon(size = 512) {
    const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#15803d"/>
                <stop offset="100%" style="stop-color:#22c55e"/>
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size*0.18}" fill="url(#bg3)"/>

        <!-- 5 letter boxes -->
        <g transform="translate(${size*0.08}, ${size*0.3})">
            ${[0,1,2,3,4].map(i => {
                const bw = size*0.15;
                const gap = size*0.02;
                const x = i * (bw + gap);
                return `<rect x="${x}" y="0" width="${bw}" height="${bw}" rx="${size*0.02}" fill="rgba(255,255,255,0.25)"/>`;
            }).join('')}
        </g>

        <text x="${size/2}" y="${size*0.22}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size*0.11}" font-weight="bold" fill="#ffffff">KELİME</text>
        <text x="${size/2}" y="${size*0.72}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${size*0.12}" font-weight="bold" fill="#ffffff">FETHİ</text>
        <rect x="${size*0.25}" y="${size*0.78}" width="${size*0.5}" height="${size*0.04}" rx="${size*0.02}" fill="#fbbf24" opacity="0.8"/>
    </svg>`;

    // Kelime Fethi icons directory
    const iconsDir = resolve(rootDir, 'public/kelime-fethi/icons');
    if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true });

    const sizes = [192, 512];
    for (const s of sizes) {
        const outputPath = resolve(rootDir, `public/kelime-fethi/icons/icon-${s}.png`);
        await sharp(Buffer.from(svg)).resize(s, s).png().toFile(outputPath);
        console.log(`✅ Kelime Fethi icon-${s}.png created`);
    }
}

// Run all
async function main() {
    try {
        await createWordQuestOG();
        await createWordQuestIcon();
        await createKelimeFethiOG();
        await createKelimeFethiIcon();
        console.log('\n🎉 All images generated successfully!');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

main();
