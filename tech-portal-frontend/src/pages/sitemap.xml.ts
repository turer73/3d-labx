import type { APIRoute } from "astro";
import { getApiBase, getLanguage } from "../lib/api";

// Helper function to generate hreflang tags
function hreflangTags(path: string): string {
  return `
    <xhtml:link rel="alternate" hreflang="tr" href="https://3d-labx.com${path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://en.3d-labx.com${path}"/>
    <xhtml:link rel="alternate" hreflang="de" href="https://de.3d-labx.com${path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://3d-labx.com${path}"/>`;
}

export const GET: APIRoute = async ({ request }) => {
  const API_BASE = getApiBase(request);
  const lang = getLanguage(request);

  // Determine base URL based on language subdomain
  let siteUrl = "https://3d-labx.com";
  if (lang === "en") siteUrl = "https://en.3d-labx.com";
  if (lang === "de") siteUrl = "https://de.3d-labx.com";

  // API'den tüm postları al
  const res = await fetch(`${API_BASE}/api/posts?limit=500`);
  const data = await res.json();
  const posts = data.posts || [];

  const today = new Date().toISOString().split('T')[0];

  // Ana statik sayfalar
  const staticPages = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "/3d-baski", priority: "0.9", changefreq: "daily" },
    { path: "/rehberler", priority: "0.9", changefreq: "weekly" },
    { path: "/sorun-cozumleri", priority: "0.9", changefreq: "weekly" },
    { path: "/incelemeler", priority: "0.8", changefreq: "weekly" },
    { path: "/topluluk", priority: "0.8", changefreq: "daily" },
    { path: "/filamentler", priority: "0.8", changefreq: "weekly" },
    { path: "/hakkimizda", priority: "0.5", changefreq: "monthly" },
    { path: "/iletisim", priority: "0.5", changefreq: "monthly" },
  ];

  // Marka bazlı sorun giderme rehberleri (yüksek öncelikli)
  const brandGuides = [
    "/sorun-cozumleri/bambu-lab-sorun-giderme",
    "/sorun-cozumleri/creality-sorun-giderme",
    "/sorun-cozumleri/elegoo-sorun-giderme",
    "/sorun-cozumleri/anycubic-sorun-giderme",
  ];

  // İnteraktif slicer rehberleri (yüksek öncelikli)
  const interactiveGuides = [
    "/rehberler/cura-slicer-interaktif-rehber",
    "/rehberler/orca-slicer-rehberi",
    "/rehberler/bambu-slicer-rehberi",
    "/rehberler/prusaslicer-rehberi",
  ];

  // Yasal ve bilgi sayfaları
  const legalPages = [
    "/gizlilik",
    "/yasal/kvkk",
    "/yasal/sorumluluk-reddi",
  ];

  // AI araçları
  const toolPages = [
    "/ai-araclar",
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
    // Ana sayfalar (en yüksek öncelik) - hreflang ile
    ...staticPages.map(
      (page) => `
  <url>
    <loc>${siteUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${hreflangTags(page.path)}
  </url>`
    ),

    // Marka sorun giderme rehberleri (yüksek öncelik) - hreflang ile
    ...brandGuides.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${hreflangTags(path)}
  </url>`
    ),

    // İnteraktif slicer rehberleri (yüksek öncelik) - hreflang ile
    ...interactiveGuides.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${hreflangTags(path)}
  </url>`
    ),

    // AI araçları - hreflang ile
    ...toolPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${hreflangTags(path)}
  </url>`
    ),

    // Yasal sayfalar (düşük öncelik)
    ...legalPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`
    ),

    // Malzeme sayfaları - hreflang ile
    ...materialPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${hreflangTags(path)}
  </url>`
    ),

    // Topluluk sayfaları - hreflang ile
    ...communityPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>${hreflangTags(path)}
  </url>`
    ),

    // Dinamik blog/rehber içerikleri - hreflang ile
    ...posts.map(
      (post: any) => {
        const postPath = `/${post.category}/${post.slug}`;
        const postDate = post.created_at ? new Date(post.created_at).toISOString().split('T')[0] : today;
        return `
  <url>
    <loc>${siteUrl}${postPath}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${hreflangTags(postPath)}
  </url>`;
      }
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // 1 saat cache
    },
  });
};
