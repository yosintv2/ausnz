import { useState, useEffect } from "react";
import { titleCase, slugify } from "../lib/utils";
import type { LocalityGroup } from "../types";

export default function LocalityView() {
  const [lg, setLg] = useState<LocalityGroup | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const slug = path.replace("/nz/locality/", "").replace(/\/$/, "");
    if (!slug) { setLoading(false); return; }

    import("../lib/data").then((m) => {
      const found = m.getNZLocality(slug);
      setLg(found);
      setLoading(false);
      if (found) {
        document.title = `${titleCase(found.locality)} – Postcode ${found.postcodes.join(", ")}, ${found.state} | ANZ Postcode`;
      }
    });
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-[#6B7280]">Loading...</div>;
  }

  if (!lg) {
    return (
      <div className="text-center py-24 px-4">
        <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold text-[#0B2545] mb-4">Locality not found</h1>
        <p className="text-[#6B7280] mb-8">Try searching for a locality instead.</p>
        <a href="/search" className="inline-flex px-6 py-3 bg-[#2D6A4F] text-white font-semibold rounded-xl hover:bg-[#1B4332] transition-colors">Search</a>
      </div>
    );
  }

  const hasMap = lg.lat !== 0 && lg.lng !== 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-2xl border border-[#E2E6ED] p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-[#2D6A4F] text-white text-xs font-semibold px-2.5 py-1 rounded-full">🇳🇿 New Zealand</span>
          <span className="bg-[#F4F6F9] text-[#6B7280] text-xs font-medium px-2.5 py-1 rounded-full">{lg.state}</span>
        </div>
        <h1 className="font-[family-name:var(--font-sora)] text-4xl font-bold text-[#0B2545] mb-2">{titleCase(lg.locality)}</h1>
        <p className="text-[#6B7280] mb-6">Postcode {lg.postcodes.join(", ")} · {lg.state}</p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Locality", value: titleCase(lg.locality) },
            { label: "Country", value: "New Zealand 🇳🇿" },
            { label: "Region", value: lg.state },
            { label: "Postcode", value: lg.postcodes.join(", ") },
            ...(hasMap ? [
              { label: "Latitude", value: lg.lat.toFixed(6) },
              { label: "Longitude", value: lg.lng.toFixed(6) },
            ] : []),
          ].map((row) => (
            <div key={row.label} className="bg-[#F4F6F9] rounded-xl p-4">
              <dt className="text-[#6B7280] text-xs uppercase tracking-wider mb-1">{row.label}</dt>
              <dd className="font-semibold text-[#1A1A2E] text-sm">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 text-center">
        <a href={`/nz/postcode/${lg.postcodes[0]}`} className="text-[#2D6A4F] hover:underline font-medium">
          View postcode {lg.postcodes[0]} details →
        </a>
      </div>
    </div>
  );
}
