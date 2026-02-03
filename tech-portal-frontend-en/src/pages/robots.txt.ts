import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const body = `
User-agent: *
Allow: /

# Admin ve API yollarını engelle
Disallow: /admin/
Disallow: /admin
Disallow: /api/
Disallow: /_astro/

# Arama ve filtreleme parametrelerini engelle
Disallow: /*?search=
Disallow: /*?page=
Disallow: /*?q=

# Auth sayfalarını engelle
Disallow: /auth/

# Crawl hızını ayarla
Crawl-delay: 1

Sitemap: https://3d-labx.com/sitemap.xml
`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
