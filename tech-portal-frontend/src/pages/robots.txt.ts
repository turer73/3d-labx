import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const body = `# 3D-labX Robots.txt
# https://3d-labx.com

User-agent: *
Allow: /

# Admin ve API yollarını engelle
Disallow: /admin/
Disallow: /admin
Disallow: /api/
Disallow: /_astro/

# Auth sayfalarını engelle
Disallow: /auth/

# Arama ve filtreleme parametrelerini engelle
Disallow: /*?search=
Disallow: /*?page=
Disallow: /*?q=

# Önemli statik dosyalara izin ver
Allow: /favicon.svg
Allow: /og.png
Allow: /brand-logos/
Allow: /slicer-logos/

# Crawl-delay
Crawl-delay: 1

# Sitemap locations for all languages
Sitemap: https://3d-labx.com/sitemap.xml
Sitemap: https://en.3d-labx.com/sitemap.xml
Sitemap: https://de.3d-labx.com/sitemap.xml
`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
