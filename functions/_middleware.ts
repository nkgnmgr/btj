/**
 * Cloudflare Pages middleware:
 *  1. Blocks known AI-training / bulk-scraping crawlers at the edge
 *     (robots.txt is advisory only — this enforces it).
 *  2. Applies a light per-IP rate limit to the API endpoints.
 *
 * Search engine crawlers (Googlebot, Bingbot, etc.) are NOT blocked.
 */

const BLOCKED_UA = [
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "ccbot",
  "google-extended",
  "anthropic-ai",
  "claudebot",
  "claude-web",
  "perplexitybot",
  "perplexity-user",
  "bytespider",
  "amazonbot",
  "meta-externalagent",
  "facebookbot",
  "applebot-extended",
  "cohere-ai",
  "diffbot",
  "omgili",
  "imagesiftbot",
  "timpibot",
];

// Simple in-memory rate limiter (per isolate). Real DDoS protection is
// handled by Cloudflare itself; this just slows down abusive API use.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_API_REQUESTS = 30;

export const onRequest = async (context: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> => {
  const { request, next } = context;
  const ua = (request.headers.get("User-Agent") ?? "").toLowerCase();

  if (BLOCKED_UA.some((bot) => ua.includes(bot))) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now > entry.reset) {
      hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    } else if (++entry.count > MAX_API_REQUESTS) {
      return new Response(JSON.stringify({ error: "Too many requests." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((entry.reset - now) / 1000)),
        },
      });
    }
    if (hits.size > 10_000) hits.clear();
  }

  return next();
};
