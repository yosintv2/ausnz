import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: https://anzpostcode.com/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain" } }
  );
};
