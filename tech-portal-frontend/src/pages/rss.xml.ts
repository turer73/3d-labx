import type { APIRoute } from 'astro';

export const prerender = false;

const API_BASE = "https://tech-portal-api.turgut-d01.workers.dev";

type Language = 'tr' | 'en' | 'de';

interface Post {
  id: number;
  title: string;
  title_tr?: string;
  title_en?: string;
  title_de?: string;
  summary: string;
  summary_tr?: string;
  summary_en?: string;
  summary_de?: string;
  slug: string;
  category: string;
  image_url?: string;
  created_at: string;
}

function getLanguage(request: Request): Language {
  const host = request.headers.get("host") || "";
  if (host.startsWith("en.")) return "en";
  if (host.startsWith("de.")) return "de";
  return "tr";
}

function getTitle(post: Post, lang: Language): string {
  if (lang === "en") return post.title_en || post.title || post.title_tr || "";
  if (lang === "de") return post.title_de || post.title || post.title_tr || "";
  return post.title_tr || post.title || "";
}

function getSummary(post: Post, lang: Language): string {
  if (lang === "en") return post.summary_en || post.summary || post.summary_tr || "";
  if (lang === "de") return post.summary_de || post.summary || post.summary_tr || "";
  return post.summary_tr || post.summary || "";
}

function getBaseUrl(lang: Language): string {
  if (lang === "en") return "https://en.3d-labx.com";
  if (lang === "de") return "https://de.3d-labx.com";
  return "https://3d-labx.com";
}

function getCategoryPath(category: string, lang: Language): string {
  const paths: Record<Language, Record<string, string>> = {
    tr: { "3d-baski": "3d-baski", "rehberler": "rehberler", "sorun-cozumleri": "sorun-cozumleri", "incelemeler": "incelemeler" },
    en: { "3d-baski": "news", "rehberler": "guides", "sorun-cozumleri": "troubleshooting", "incelemeler": "reviews" },
    de: { "3d-baski": "nachrichten", "rehberler": "anleitungen", "sorun-cozumleri": "fehlerbehebung", "incelemeler": "bewertungen" }
  };
  return paths[lang][category] || category;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const lang = getLanguage(request);
    const langParam = lang !== "tr" ? `&lang=${lang}` : "";

    // Fetch latest posts from all categories
    const [baskinRes, rehberRes, sorunRes, incelemeRes] = await Promise.all([
      fetch(`${API_BASE}/api/posts?category=3d-baski&limit=10${langParam}`),
      fetch(`${API_BASE}/api/posts?category=rehberler&limit=10${langParam}`),
      fetch(`${API_BASE}/api/posts?category=sorun-cozumleri&limit=10${langParam}`),
      fetch(`${API_BASE}/api/posts?category=incelemeler&limit=10${langParam}`),
    ]);

    const allPosts: Post[] = [];

    if (baskinRes.ok) {
      const data = await baskinRes.json();
      allPosts.push(...(data.posts || []));
    }
    if (rehberRes.ok) {
      const data = await rehberRes.json();
      allPosts.push(...(data.posts || []));
    }
    if (sorunRes.ok) {
      const data = await sorunRes.json();
      allPosts.push(...(data.posts || []));
    }
    if (incelemeRes.ok) {
      const data = await incelemeRes.json();
      allPosts.push(...(data.posts || []));
    }

    // Sort by date, newest first
    allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Take only top 30
    const recentPosts = allPosts.slice(0, 30);

    const categoryNames: Record<Language, Record<string, string>> = {
      tr: { '3d-baski': '3D Baskı', 'rehberler': 'Rehberler', 'sorun-cozumleri': 'Sorun Çözümleri', 'incelemeler': 'İncelemeler' },
      en: { '3d-baski': '3D Printing News', 'rehberler': 'Guides', 'sorun-cozumleri': 'Troubleshooting', 'incelemeler': 'Reviews' },
      de: { '3d-baski': '3D-Druck Nachrichten', 'rehberler': 'Anleitungen', 'sorun-cozumleri': 'Fehlerbehebung', 'incelemeler': 'Bewertungen' }
    };

    const siteInfo: Record<Language, { title: string; description: string; language: string }> = {
      tr: { title: "3D-labX - Türkiye'nin 3D Baskı Rehberi", description: "3D yazıcı ayarları, filament rehberleri, sorun çözümleri ve ürün incelemeleri.", language: "tr-TR" },
      en: { title: "3D-labX - Your 3D Printing Guide", description: "3D printer settings, filament guides, troubleshooting and product reviews.", language: "en-US" },
      de: { title: "3D-labX - Ihr 3D-Druck Ratgeber", description: "3D-Drucker-Einstellungen, Filament-Leitfäden, Fehlerbehebung und Produktbewertungen.", language: "de-DE" }
    };

    const baseUrl = getBaseUrl(lang);
    const info = siteInfo[lang];

    const escapeXml = (str: string) => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const items = recentPosts.map(post => {
      const categoryPath = getCategoryPath(post.category, lang);
      const link = `${baseUrl}/${categoryPath}/${post.slug}`;
      const pubDate = new Date(post.created_at).toUTCString();
      const category = categoryNames[lang][post.category] || post.category;
      const title = getTitle(post, lang);
      const summary = getSummary(post, lang);

      return `
    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(summary)}</description>
      <category>${escapeXml(category)}</category>
      <pubDate>${pubDate}</pubDate>
      ${post.image_url ? `<enclosure url="${escapeXml(post.image_url)}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(info.title)}</title>
    <description>${escapeXml(info.description)}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>${info.language}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>${baseUrl}/favicon.svg</url>
      <title>3D-labX</title>
      <link>${baseUrl}</link>
    </image>
    ${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return new Response('RSS feed generation failed', { status: 500 });
  }
};
