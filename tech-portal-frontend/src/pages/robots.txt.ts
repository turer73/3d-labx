import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  const body = `
User-agent: *
Allow: /

Sitemap: https://3d-labx.com/sitemap.xml
`;

  return new Response(body.trim(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
