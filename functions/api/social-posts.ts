import { parseSocialUrl } from "../../src/lib/socialLinks.ts";

interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const url = context.env.SUPABASE_URL ?? context.env.VITE_SUPABASE_URL;
  const key =
    context.env.SUPABASE_ANON_KEY ?? context.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return json({ error: "Link submissions are not configured." }, 501);

  let input: { url?: unknown; caption?: unknown };
  try {
    input = await context.request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (typeof input.url !== "string" || input.url.length > 2048)
    return json({ error: "Paste a valid social link." }, 400);
  if (input.caption !== undefined && typeof input.caption !== "string")
    return json({ error: "Invalid description." }, 400);

  let normalizedUrl: string;
  try {
    normalizedUrl = parseSocialUrl(input.url).url;
  } catch (error) {
    return json({ error: (error as Error).message }, 400);
  }
  const caption = (input.caption ?? "").trim().slice(0, 500);

  const response = await fetch(
    `${url}/rest/v1/social_posts?select=id,url,caption,added_at`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ url: normalizedUrl, caption }),
    },
  );

  if (response.status === 409)
    return json({ error: "This link is already on the timeline." }, 409);
  if (!response.ok)
    return json({ error: "The link could not be added. Please try again." }, 502);

  const rows = await response.json() as Array<{
    id: string;
    url: string;
    caption: string;
    added_at: string;
  }>;
  const post = rows[0];
  if (!post) return json({ error: "The link could not be added." }, 502);
  return json({
    id: post.id,
    url: post.url,
    caption: post.caption,
    addedAt: post.added_at,
  }, 201);
};