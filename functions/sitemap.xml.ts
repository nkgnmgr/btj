/**
 * Cloudflare Pages Function: GET /sitemap.xml
 * Builds the sitemap dynamically from published pages in Supabase,
 * so newly added country pages are indexed automatically.
 */
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const FALLBACK_SLUGS = ["us-gb", "fr", "it", "in", "tr", "cn", "kr", "other"];

export const onRequestGet = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;
  const origin = new URL(request.url).origin;

  let entries: { slug: string; updatedAt?: string }[] = FALLBACK_SLUGS.map(
    (slug) => ({ slug }),
  );

  try {
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      const res = await fetch(
        `${env.SUPABASE_URL}/rest/v1/pages?select=slug,updated_at&published=eq.true&order=sort.asc`,
        { headers: { apikey: env.SUPABASE_ANON_KEY } },
      );
      if (res.ok) {
        const rows = (await res.json()) as { slug: string; updated_at: string }[];
        if (rows.length > 0) {
          entries = rows
            .filter((r) => !r.slug.startsWith("_"))
            .map((r) => ({ slug: r.slug, updatedAt: r.updated_at }));
        }
      }
    }
  } catch {
    // fall back to bundled slugs
  }

  const urls = [
    `  <url><loc>${origin}/</loc></url>`,
    ...entries.map(
      (e) =>
        `  <url><loc>${origin}/country/${e.slug}</loc>${
          e.updatedAt
            ? `<lastmod>${e.updatedAt.slice(0, 10)}</lastmod>`
            : ""
        }</url>`,
    ),
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
