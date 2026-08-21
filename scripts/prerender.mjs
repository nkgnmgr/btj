/**
 * Post-build prerender script.
 *
 * After `vite build`, this script generates static HTML files for
 * the homepage and every bundled country page so that all crawlers
 * (Bing, social link previews, etc.) receive complete HTML with a
 * unique <title>, meta description and JSON-LD — without executing JS.
 *
 * Content edited later in the admin UI is still applied at runtime by
 * the SPA; these prerendered files are the SEO baseline served first.
 *
 * Usage:  node scripts/prerender.mjs
 * Env:    SITE_URL (optional) — e.g. https://example.pages.dev
 *         Used for canonical URLs and absolute og:image. If omitted,
 *         canonical tags are skipped and og:image stays relative.
 *         VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (optional) —
 *         when set, published pages are fetched from Supabase so pages
 *         added in the admin UI are prerendered too. On any fetch
 *         failure the script falls back to the bundled data.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist", "public");

// Node 24 strips TypeScript types natively, so we can import the
// bundled country data directly.
const { countries: bundledCountries } = await import(
  new URL("../src/lib/countries.ts", import.meta.url).href
);

/**
 * Fetch published pages from Supabase (same table the SPA/admin uses).
 * Returns an array shaped like the bundled `countries` entries, or null
 * when Supabase is not configured or the fetch fails (caller falls back).
 */
async function fetchSupabasePages() {
  const url = (process.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.VITE_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/pages?select=slug,title,flag,native_name,sections&published=eq.true&order=sort.asc`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (!res.ok) {
      console.warn(`Supabase fetch failed (HTTP ${res.status}); using bundled data.`);
      return null;
    }
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("Supabase returned no published pages; using bundled data.");
      return null;
    }
    // Special "_"-prefixed pages (e.g. homepage content) are not country pages.
    return rows
      .filter((r) => typeof r.slug === "string" && /^[a-z0-9][a-z0-9_-]*$/i.test(r.slug) && !r.slug.startsWith("_"))
      .map((r) => ({
        code: r.slug,
        name: r.title,
        flag: r.flag,
        nativeName: r.native_name,
        sections: Array.isArray(r.sections) ? r.sections : [],
      }));
  } catch (err) {
    console.warn(`Supabase fetch failed (${err?.message || err}); using bundled data.`);
    return null;
  }
}

const supabasePages = await fetchSupabasePages();
const countries = supabasePages ?? bundledCountries;
const source = supabasePages ? "Supabase" : "bundled data";

const SITE_URL = (process.env.SITE_URL || "").replace(/\/+$/, "");

const template = await readFile(path.join(outDir, "index.html"), "utf8");

/** Escape text for safe use inside HTML attributes / elements. */
const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Remove the tags we are going to replace from the template head. */
function stripSeoTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/i, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, "")
    .replace(
      /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/i,
      "",
    );
}

const bareTemplate = stripSeoTags(template);

function renderPage({ title, description, pathName, jsonLd }) {
  const canonical = SITE_URL ? `${SITE_URL}${pathName}` : "";
  const ogImage = SITE_URL ? `${SITE_URL}/opengraph.jpg` : "/opengraph.jpg";
  const head = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    canonical ? `<link rel="canonical" href="${esc(canonical)}" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(ogImage)}" />`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
  // Inject after the viewport meta so <meta charset> stays within the
  // first 1024 bytes of the document (HTML spec requirement).
  const anchor = /(<meta\s+name="viewport"[^>]*>)/i;
  if (anchor.test(bareTemplate)) {
    return bareTemplate.replace(anchor, `$1\n    ${head}`);
  }
  return bareTemplate.replace(/<head>/i, `<head>\n    ${head}`);
}

// ---- Homepage ----
const homeHtml = renderPage({
  title: "Before Trip to Japan — Essential Travel Guide for Visitors",
  description:
    "Essential information for international visitors to Japan: visas, transport, money, culture, etiquette and safety — in your own language.",
  pathName: "/",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Before Trip to Japan",
    description:
      "Essential travel information for international visitors to Japan, available in multiple languages.",
    inLanguage: ["en", "fr", "it", "hi", "tr", "zh", "ko"],
    ...(SITE_URL ? { url: `${SITE_URL}/` } : {}),
  },
});
await writeFile(path.join(outDir, "index.html"), homeHtml);

// ---- Country pages ----
let count = 0;
for (const c of countries) {
  const title = `${c.name} — Before Trip to Japan`;
  const description = `Travel information for visitors from ${c.name}: ${c.sections
    .map((s) => s.title)
    .slice(0, 5)
    .join(", ")}.`;
  const pathName = `/country/${c.code}`;
  const html = renderPage({
    title,
    description,
    pathName,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      inLanguage: c.nativeName,
      about: "Travel information for visiting Japan",
      articleSection: c.sections.map((s) => s.title),
      ...(SITE_URL ? { url: `${SITE_URL}${pathName}` } : {}),
    },
  });
  const dir = path.join(outDir, "country", c.code);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html);
  count++;
}

console.log(
  `Prerendered homepage + ${count} country pages into dist/public (source: ${source})`,
);
