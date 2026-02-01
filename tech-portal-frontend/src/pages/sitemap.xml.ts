import type { APIRoute } from "astro";
import { getApiBase } from "../lib/api";

export const GET: APIRoute = async ({ request }) => {
  const API_BASE = getApiBase(request);

  // API'den tüm postları al (sayfalama ile birlikte döner)
  const res = await fetch(`${API_BASE}/api/posts?limit=500`);
  const data = await res.json();
  const posts = data.posts || [];

  const siteUrl = "https://3d-labx.com";

  // Ana statik sayfalar
  const staticPages = [
    "",
    "/3d-baski",
    "/rehberler",
    "/sorun-cozumleri",
    "/incelemeler",
    "/topluluk",
    "/filamentler",
    "/hakkimizda",
    "/iletisim",
  ];

  // Marka bazlı sorun giderme rehberleri (yüksek öncelikli)
  const brandGuides = [
    "/sorun-cozumleri/bambu-lab-sorun-giderme",
    "/sorun-cozumleri/creality-sorun-giderme",
    "/sorun-cozumleri/elegoo-sorun-giderme",
    "/sorun-cozumleri/anycubic-sorun-giderme",
  ];

  // Malzeme rehberleri
  const materialPages = [
    "/3d-baski/malzemeler",
  ];

  // Topluluk alt sayfaları
  const communityPages = [
    "/topluluk/forum",
    "/topluluk/projeler",
    "/topluluk/basarisizliklar",
    "/topluluk/harita",
  ];

  const urls = [
    // Ana sayfalar (en yüksek öncelik)
    ...staticPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`
    ),

    // Marka sorun giderme rehberleri (yüksek öncelik)
    ...brandGuides.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    ),

    // Malzeme sayfaları
    ...materialPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),

    // Topluluk sayfaları
    ...communityPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`
    ),

    // Dinamik blog/rehber içerikleri
    ...posts.map(
      (post: any) => `
  <url>
    <loc>${siteUrl}/${post.category}/${post.slug}</loc>
    <lastmod>${post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
