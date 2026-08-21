import { getSupabase } from "./supabase";

/**
 * Uploads an image via the Cloudflare Pages Function at /api/upload,
 * which stores it in R2. Works on the deployed Cloudflare Pages site.
 */
export async function uploadImage(file: File): Promise<string> {
  const { data } = await getSupabase().auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in.");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    let message = `Upload failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  const body = (await res.json()) as { url: string };
  return body.url;
}
