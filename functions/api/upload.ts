/**
 * Cloudflare Pages Function: POST /api/upload
 * Stores an uploaded image in the R2 bucket bound as `BUCKET`
 * and returns its public URL.
 *
 * Required Pages project settings:
 *   - R2 binding:  BUCKET -> your R2 bucket
 *   - Env vars:    PUBLIC_R2_URL (e.g. https://pub-xxxx.r2.dev)
 *                  SUPABASE_URL, SUPABASE_ANON_KEY (to verify the admin login)
 */
interface Env {
  BUCKET: R2Bucket;
  PUBLIC_R2_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface R2Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
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

  // 1. Verify the Supabase session token (admin must be signed in)
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return json({ error: "Not signed in." }, 401);

  const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_ANON_KEY,
    },
  });
  if (!userRes.ok) return json({ error: "Invalid session." }, 401);

  // The user must be a registered site admin (site_admins table).
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

  // 2. Read the uploaded file
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "No file provided." }, 400);
  if (file.size > 10 * 1024 * 1024)
    return json({ error: "File too large (max 10 MB)." }, 400);
  const ALLOWED: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  if (!ALLOWED[file.type])
    return json({ error: "Only JPEG / PNG / WebP / GIF images are allowed." }, 400);

  // 3. Store in R2 under a unique key (extension derived from type, not filename)
  const ext = ALLOWED[file.type];
  const key = `uploads/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  await env.BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  const base = env.PUBLIC_R2_URL.replace(/\/$/, "");
  return json({ url: `${base}/${key}` });
};
