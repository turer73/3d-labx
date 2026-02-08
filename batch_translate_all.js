// Toplu Çeviri Script
// Kullanım: node batch_translate_all.js YOUR_ADMIN_SECRET

const API_URL = 'https://tech-portal-api.turgut-d01.workers.dev';
const ADMIN_SECRET = process.argv[2];

if (!ADMIN_SECRET) {
  console.log('Kullanım: node batch_translate_all.js YOUR_ADMIN_SECRET');
  process.exit(1);
}

async function translateBatch(lang, limit = 20) {
  const res = await fetch(`${API_URL}/admin/translate-batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-ADMIN-SECRET': ADMIN_SECRET
    },
    body: JSON.stringify({ lang, limit })
  });
  return res.json();
}

async function getTranslationStatus() {
  const res = await fetch(`${API_URL}/admin/translation-status`, {
    headers: { 'X-ADMIN-SECRET': ADMIN_SECRET }
  });
  return res.json();
}

async function main() {
  console.log('🌍 Toplu Çeviri Başlıyor...\n');

  // Mevcut durumu kontrol et
  try {
    const status = await getTranslationStatus();
    console.log('📊 Mevcut Durum:', JSON.stringify(status, null, 2));
  } catch (e) {
    console.log('Status alınamadı, devam ediliyor...');
  }

  let totalEN = 0;
  let totalDE = 0;
  let round = 1;

  // EN çevirileri
  console.log('\n🇬🇧 İngilizce çeviriler başlıyor...');
  while (true) {
    console.log(`  Round ${round}: EN çeviriliyor (20 post)...`);
    const result = await translateBatch('en', 20);

    if (result.error) {
      console.log('  Hata:', result.error);
      break;
    }

    console.log(`  ✓ ${result.translated}/${result.total} çevrildi`);
    totalEN += result.translated;

    if (result.translated === 0 || result.message?.includes('No posts')) {
      console.log('  EN çeviri tamamlandı!');
      break;
    }

    round++;
    // Rate limit için bekle
    await new Promise(r => setTimeout(r, 2000));
  }

  // DE çevirileri
  round = 1;
  console.log('\n🇩🇪 Almanca çeviriler başlıyor...');
  while (true) {
    console.log(`  Round ${round}: DE çeviriliyor (20 post)...`);
    const result = await translateBatch('de', 20);

    if (result.error) {
      console.log('  Hata:', result.error);
      break;
    }

    console.log(`  ✓ ${result.translated}/${result.total} çevrildi`);
    totalDE += result.translated;

    if (result.translated === 0 || result.message?.includes('No posts')) {
      console.log('  DE çeviri tamamlandı!');
      break;
    }

    round++;
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n════════════════════════════════');
  console.log(`✅ TOPLAM: ${totalEN} EN + ${totalDE} DE = ${totalEN + totalDE} çeviri`);
  console.log('════════════════════════════════\n');
}

main().catch(console.error);
