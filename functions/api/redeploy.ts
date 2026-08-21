/**
 * Cloudflare Pages Function: POST /api/redeploy
 * Triggers a Cloudflare Pages Deploy Hook (rebuild & republish)
 * on behalf of a signed-in site admin.
 *
 * Required Pages project env vars:
 *   DEPLOY_HOOK_URL   — the Deploy Hook URL from Cloudflare Pages settings
 *   SUPABASE_URL, SUPABASE_ANON_KEY — to verify the admin login
 */
interface Env {
  DEPLOY_HOOK_URL?: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  if (!env.DEPLOY_HOOK_URL)
    return json({ error: "Deploy hook is not configured." }, 501);

  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return json({ error: "Not signed in." }, 401);

  const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY },
  });
  if (!userRes.ok) return json({ error: "Invalid session." }, 401);

  const adminRes = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc/is_admin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  if (!adminRes.ok || (await adminRes.json()) !== true)
    return json({ error: "Not authorized (admin only)." }, 403);

  const hookRes = await fetch(env.DEPLOY_HOOK_URL, { method: "POST" });
  if (!hookRes.ok)
    return json({ error: `Deploy hook failed (${hookRes.status}).` }, 502);

  return json({ ok: true });
};
