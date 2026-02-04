const urls = [
  // Ana Sayfalar
  '/',
  '/3d-baski',
  '/rehberler',
  '/sorun-cozumleri',
  '/incelemeler',
  '/topluluk',
  '/filamentler',
  '/hakkimizda',
  '/iletisim',
  '/gizlilik',
  '/search',
  
  // Alt Sayfalar
  '/3d-baski/malzemeler',
  '/topluluk/forum',
  '/topluluk/projeler',
  '/topluluk/basarisizliklar',
  '/topluluk/harita',
  
  // Statik Sorun Giderme Sayfaları
  '/sorun-cozumleri/bambu-lab-sorun-giderme',
  '/sorun-cozumleri/creality-sorun-giderme',
  '/sorun-cozumleri/elegoo-sorun-giderme',
  '/sorun-cozumleri/anycubic-sorun-giderme',
  
  // Auth Sayfaları
  '/auth/giris',
  '/auth/kayit',
  '/auth/sifremi-unuttum',
  '/auth/reset-password',
  '/auth/verify',
  '/auth/dogrulama-gonder',
  
  // Profil Sayfaları
  '/profil',
  '/profil/ayarlar',
  
  // Admin Sayfaları
  '/admin',
  '/admin/dashboard',
  '/admin/posts',
  '/admin/new',
  '/admin/rss',
  '/admin/users',
  '/admin/content-boxes',
  
  // Yasal Sayfalar
  '/yasal/kvkk',
  '/yasal/sorumluluk-reddi',
  
  // AI Araçlar
  '/ai-araclar',
  
  // Topluluk Alt Sayfalar
  '/topluluk/forum/yeni',
  '/topluluk/projeler/paylas',
  '/topluluk/basarisizliklar/paylas',
  '/topluluk/harita/profil',
  
  // Rehber - Cura Slicer
  '/rehberler/cura-slicer-interaktif-rehber',
  
  // Filament Test
  '/filamentler/test-paylas',
];

async function checkUrl(url) {
  const fullUrl = 'https://3d-labx.com' + url;
  try {
    const res = await fetch(fullUrl, { method: 'HEAD', redirect: 'follow' });
    return { url, status: res.status, ok: res.ok };
  } catch (err) {
    return { url, status: 'ERROR', ok: false, error: err.message };
  }
}

async function main() {
  console.log('Checking ' + urls.length + ' URLs...\n');
  
  const results = await Promise.all(urls.map(checkUrl));
  
  const working = results.filter(r => r.ok);
  const broken = results.filter(r => !r.ok);
  
  console.log('=== WORKING PAGES (' + working.length + ') ===');
  working.forEach(r => console.log('✓ ' + r.status + ' ' + r.url));
  
  console.log('\n=== BROKEN/ISSUES (' + broken.length + ') ===');
  broken.forEach(r => console.log('✗ ' + r.status + ' ' + r.url + (r.error ? ' - ' + r.error : '')));
  
  console.log('\n=== SUMMARY ===');
  console.log('Working: ' + working.length);
  console.log('Broken: ' + broken.length);
}

main();
