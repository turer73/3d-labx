import type { APIRoute } from 'astro';

export const prerender = false;

const API_BASE = "https://tech-portal-api.turgut-d01.workers.dev";

interface Post {
  id: number;
  title_tr: string;
  summary_tr: string;
  slug: string;
  category: string;
  image_url?: string;
  created_at: string;
}

export const GET: APIRoute = async () => {
  try {
    // Fetch latest posts from all categories
    const [baskinRes, rehberRes, sorunRes, incelemeRes] = await Promise.all([
      fetch(`${API_BASE}/api/posts?category=3d-baski&limit=10`),
      fetch(`${API_BASE}/api/posts?category=rehberler&limit=10`),
      fetch(`${API_BASE}/api/posts?category=sorun-cozumleri&limit=10`),
      fetch(`${API_BASE}/api/posts?category=incelemeler&limit=10`),
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

    const categoryNames: Record<string, string> = {
      '3d-baski': '3D Baskı',
      'rehberler': 'Rehberler',
      'sorun-cozumleri': 'Sorun Çözümleri',
      'incelemeler': 'İncelemeler',
    };

    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const items = recentPosts.map(post => {
      const link = `https://3d-labx.com/${post.category}/${post.slug}`;
      const pubDate = new Date(post.created_at).toUTCString();
      const category = categoryNames[post.category] || post.category;

      return `
    <item>
      <title>${escapeXml(post.title_tr)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.summary_tr)}</description>
      <category>${escapeXml(category)}</category>
      <pubDate>${pubDate}</pubDate>
      ${post.image_url ? `<enclosure url="${escapeXml(post.image_url)}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>3D-labX - Türkiye'nin 3D Baskı Rehberi</title>
    <description>3D yazıcı ayarları, filament rehberleri, sorun çözümleri ve ürün incelemeleri.</description>
    <link>https://3d-labx.com</link>
    <atom:link href="https://3d-labx.com/rss.xml" rel="self" type="application/rss+xml"/>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>https://3d-labx.com/favicon.svg</url>
      <title>3D-labX</title>
      <link>https://3d-labx.com</link>
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
