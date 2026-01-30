async function triggerScrape() {
  console.log('Triggering filament price scrape...');

  const res = await fetch('https://tech-portal-api.turgut-d01.workers.dev/admin/filament-prices/scrape', {
    method: 'POST',
    headers: { 'X-ADMIN-SECRET': 'Tur04520,' }
  });

  const result = await res.json();
  console.log('Scrape result:', JSON.stringify(result, null, 2));

  // Biraz bekle
  await new Promise(r => setTimeout(r, 3000));

  // Yeni fiyatları kontrol et
  console.log('\n--- Yeni Fiyatlar ---');
  const pricesRes = await fetch('https://tech-portal-api.turgut-d01.workers.dev/api/filament-prices');
  const prices = await pricesRes.json();

  // Her tip için en ucuz ürünü göster
  const types = ['PLA', 'PETG', 'ABS', 'ASA'];
  for (const type of types) {
    const typeProducts = prices.prices?.filter(p => p.filament_type === type) || [];
    const cheapest = typeProducts.sort((a, b) => a.price_tl - b.price_tl)[0];
    if (cheapest) {
      console.log(`${type}: ${cheapest.price_tl} TL - ${cheapest.product_name}`);
    } else {
      console.log(`${type}: Ürün bulunamadı`);
    }
  }
}

triggerScrape().catch(console.error);
