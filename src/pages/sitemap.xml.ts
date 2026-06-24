import type { APIRoute } from "astro";
import {
  getAUPostcodeGroups,
  getAULocalityGroups,
  getAUStateGroups,
  getNZPostcodeGroups,
  getNZLocalityGroups,
  getNZRegionGroups,
} from "../lib/data";

export const GET: APIRoute = async () => {
  const site = "https://anzpostcode.com";

  const staticPages = [
    "", "/au", "/nz", "/search", "/about", "/contact",
    "/privacy-policy", "/terms", "/disclaimer", "/data-sources",
    "/au/postcodes", "/au/suburbs", "/au/a-z",
    "/nz/postcodes", "/nz/localities", "/nz/a-z",
  ];

  const auPostcodes = Array.from(getAUPostcodeGroups().keys());
  const auStates = getAUStateGroups().map((s) => `/au/state/${s.slug}`);
  const nzPostcodes = Array.from(getNZPostcodeGroups().keys());
  const nzRegions = getNZRegionGroups().map((r) => `/nz/region/${r.slug}`);

  const allPaths = [
    ...staticPages,
    ...auPostcodes.map((p) => `/au/postcode/${p}`),
    ...auStates,
    ...nzPostcodes.map((p) => `/nz/postcode/${p}`),
    ...nzRegions,
  ];

  const urls = allPaths.map(
    (path) => `
  <url>
    <loc>${site}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
