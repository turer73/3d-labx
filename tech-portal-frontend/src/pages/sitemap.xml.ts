import type { APIRoute } from "astro";
import { getApiBase } from "../lib/api";

export const GET: APIRoute = async ({ request }) => {
  const API_BASE = getApiBase(request);

  // API'den tüm postları al (sayfalama ile birlikte döner)
  const res = await fetch(`${API_BASE}/api/posts?limit=500`);
  const data = await res.json();
  const posts = data.posts || [];

  const siteUrl = "https://3d-labx.com";

  const staticPages = [
    "",
    "/3d-baski",
    "/rehberler",
    "/sorun-cozumleri",
    "/incelemeler",
    "/topluluk",
    "/search",
  ];

  const urls = [
    ...staticPages.map(
      (path) => `
  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    ),

    ...posts.map(
      (post: any) => `
  <url>
    <loc>${siteUrl}/${post.category}/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
