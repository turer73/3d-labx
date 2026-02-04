const urls = [
  // Footer Links
  '/3d-baski',
  '/rehberler', 
  '/sorun-cozumleri',
  '/incelemeler',
  '/topluluk',
  '/hakkimizda',
  '/iletisim',
  '/gizlilik',
  
  // Menüde var ama eksik olabilecekler
  '/3d-baski/malzemeler',
  
  // Sitemap'te var ama pages'ta yok olabilecekler
  '/Rehberler/magaza-rehberi-urunlerinizi-nasil-satarsiniz',  // Büyük R
  
  // Forum kategorileri
  '/topluluk/forum/3d-baski',
  '/topluluk/forum/yazilim',
  '/topluluk/forum/filament',
  '/topluluk/forum/teknik-destek',
  
  // Proje paylaşım formu
  '/topluluk/forum/proje-paylas',
  
  // Rehber interaktif
  '/rehberler/cura-slicer-interaktif-rehber',
  
  // Dinamik yazı örnekleri (slug bazlı)
  '/rehberler/hiz-canavari-klipper-input-shaping-ve-pressure-advance-ayarlari-nasil-yapilir-ml0y1c07',
  '/rehberler/sifirdan-zirveye-klipper-kurulum-rehberi-kiauh-yontemi-mkzk8u26',
  
  // 3D Baskı dinamik
  '/3d-baski/nozzle-tikanikligi-nasil-acilir-mkyii5bw',
  
  // İncelemeler dinamik  
  '/incelemeler/bambu-lab-p1s-3d-yazici-i-ncelemesi-hiz-ve-yetenek-bir-arada-mkxb0htx',
  
  // Sorun çözümleri dinamik
  '/sorun-cozumleri/3d-baskida-i-lk-katman-yapisma-sorununa-kokten-cozum-rehberi-mkxazxot',
  
  // Malzeme detay sayfası
  '/3d-baski/malzemeler/pla',
  '/3d-baski/malzemeler/abs',
  '/3d-baski/malzemeler/petg',
  
  // RSS
  '/rss.xml',
  '/robots.txt',
  '/sitemap.xml',
];

async function checkUrl(url) {
  const fullUrl = 'https://3d-labx.com' + url;
  try {
    const res = await fetch(fullUrl, { method: 'GET', redirect: 'follow' });
    return { url, status: res.status, ok: res.status < 400 };
  } catch (err) {
    return { url, status: 'ERROR', ok: false, error: err.message };
  }
}

async function main() {
  console.log('Checking ' + urls.length + ' URLs...\n');
  
  const results = [];
  for (const url of urls) {
    const result = await checkUrl(url);
    results.push(result);
    console.log((result.ok ? '✓' : '✗') + ' ' + result.status + ' ' + url);
  }
  
  const working = results.filter(r => r.ok);
  const broken = results.filter(r => !r.ok);
  
  console.log('\n=== SUMMARY ===');
  console.log('Working: ' + working.length);
  console.log('Broken: ' + broken.length);
  
  if (broken.length > 0) {
    console.log('\n=== BROKEN URLS ===');
    broken.forEach(r => console.log('  ' + r.url + ' (' + r.status + ')'));
  }
}

main();
