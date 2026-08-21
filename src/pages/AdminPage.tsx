import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase, supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { useSeo } from "@/lib/seo";
import { fetchAllPages, bundledPages, pageToRow } from "@/lib/content";
import {
  fetchHomeContent,
  saveHomeContent,
  type HomeContent,
} from "@/lib/siteContent";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    setBusy(false);
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6"
      >
        <h1 className="text-lg font-semibold text-gray-900">Admin Login</h1>
        <p className="mt-1 text-xs text-gray-500">
          Sign in with your Supabase admin account.
        </p>
        <label className="mt-4 block text-xs font-medium text-gray-600">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-xs font-medium text-gray-600">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <Link href="/">
          <span className="mt-4 block text-center text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
            ← Back to site
          </span>
        </Link>
      </form>
    </div>
  );
}

function HomeContentEditor() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site-content", "home"],
    queryFn: fetchHomeContent,
  });

  const [headerSubtitle, setHeaderSubtitle] = useState("");
  const [footerText, setFooterText] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeItems, setNoticeItems] = useState("");
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutParagraphs, setAboutParagraphs] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data) return;
    setHeaderSubtitle(data.headerSubtitle);
    setFooterText(data.footerText);
    setNoticeTitle(data.noticeTitle);
    setNoticeItems(data.noticeItems.join("\n"));
    setAboutTitle(data.aboutTitle);
    setAboutParagraphs(data.aboutParagraphs.join("\n\n"));
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const content: HomeContent = {
        headerSubtitle: headerSubtitle.trim(),
        footerText: footerText.trim(),
        noticeTitle: noticeTitle.trim(),
        noticeItems: noticeItems
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        aboutTitle: aboutTitle.trim(),
        aboutParagraphs: aboutParagraphs
          .split(/\n\s*\n/)
          .map((s) => s.replace(/\s*\n\s*/g, " ").trim())
          .filter(Boolean),
      };
      await saveHomeContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site-content", "home"] });
      queryClient.invalidateQueries({ queryKey: ["site-content", "home"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading home content…</p>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      {error && (
        <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
          Could not load saved home content: {(error as Error).message}
          <p className="mt-1">
            Make sure the site_content table has been created (see setup SQL).
            Saving below will fail until it exists.
          </p>
        </div>
      )}
      <label className="block text-xs font-medium text-gray-600">
        Header subtitle
        <input
          value={headerSubtitle}
          onChange={(e) => setHeaderSubtitle(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-gray-600">
        Footer text
        <input
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-gray-600">
        Notice section title
        <input
          value={noticeTitle}
          onChange={(e) => setNoticeTitle(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-gray-600">
        Notice items (one per line)
        <textarea
          value={noticeItems}
          onChange={(e) => setNoticeItems(e.target.value)}
          rows={6}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-gray-600">
        About section title
        <input
          value={aboutTitle}
          onChange={(e) => setAboutTitle(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="mt-4 block text-xs font-medium text-gray-600">
        About paragraphs (separate with a blank line)
        <textarea
          value={aboutParagraphs}
          onChange={(e) => setAboutParagraphs(e.target.value)}
          rows={6}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed"
        />
      </label>
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="rounded bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : "Save home page"}
        </button>
        {saved && <span className="text-xs text-green-600">Saved.</span>}
        {save.isError && (
          <span className="text-xs text-red-600">
            {(save.error as Error).message}
          </span>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { data: pages, isLoading, error } = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: fetchAllPages,
  });

  const seed = useMutation({
    mutationFn: async () => {
      const rows = bundledPages.map((p, i) =>
        pageToRow({ ...p, sort: i, published: true }),
      );
      const { error } = await getSupabase()
        .from("pages")
        .upsert(rows, { onConflict: "slug" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "pages"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabase().from("pages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });

  const redeploy = useMutation({
    mutationFn: async () => {
      const { data } = await getSupabase().auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Not signed in.");
      const res = await fetch("/api/redeploy", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 501)
        throw new Error(
          "Deploy Hook is not configured yet (see DEPLOY.md step for the Deploy Hook).",
        );
      if (!res.ok) throw new Error(body.error ?? `Failed (${res.status}).`);
    },
  });

  async function signOut() {
    await getSupabase().auth.signOut();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4 pl-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Site Admin</h1>
            <p className="text-xs text-gray-500">Before Trip to Japan — pages</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="text-xs text-gray-500 hover:text-gray-800 cursor-pointer">
                View site
              </span>
            </Link>
            <button
              onClick={() => redeploy.mutate()}
              disabled={redeploy.isPending}
              title="Rebuild the pre-generated HTML for search engines"
              className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {redeploy.isPending
                ? "Republishing…"
                : redeploy.isSuccess
                  ? "✓ Republish started"
                  : "Republish site"}
            </button>
            <button
              onClick={signOut}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pl-12 py-8">
        {redeploy.isError && (
          <p className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {(redeploy.error as Error).message}
          </p>
        )}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            Pages
          </h2>
          <button
            onClick={() => navigate("/admin/edit/new")}
            className="rounded bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700"
          >
            + New page
          </button>
        </div>

        {isLoading && <p className="text-sm text-gray-500">Loading…</p>}
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load pages: {(error as Error).message}
            <p className="mt-1 text-xs text-red-500">
              Make sure the Supabase table has been created (see setup SQL).
            </p>
          </div>
        )}

        {pages && pages.length === 0 && (
          <div className="rounded border border-gray-200 bg-white p-6 text-center">
            <p className="text-sm text-gray-600">
              No pages in the database yet.
            </p>
            <button
              onClick={() => seed.mutate()}
              disabled={seed.isPending}
              className="mt-3 rounded bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {seed.isPending ? "Importing…" : "Import current site content"}
            </button>
            {seed.isError && (
              <p className="mt-2 text-xs text-red-600">
                {(seed.error as Error).message}
              </p>
            )}
          </div>
        )}

        {pages && pages.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3">
                      <span className="mr-2">{p.flag}</span>
                      <span className="font-medium text-gray-800">{p.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">/country/{p.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.published
                            ? "rounded bg-green-50 px-2 py-0.5 text-xs text-green-700"
                            : "rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                        }
                      >
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/edit/${p.id}`)}
                        className="mr-3 text-xs text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${p.title}"?`)) {
                            remove.mutate(p.id);
                          }
                        }}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10">
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Home page
          </h2>
          <HomeContentEditor />
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  useSeo({ title: "Admin — Before Trip to Japan", noindex: true });
  const { session, loading } = useAuth();

  if (!supabaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
          <h1 className="text-base font-semibold text-gray-900">
            Admin is not configured yet
          </h1>
          <p className="mt-2 leading-relaxed">
            Supabase settings (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are
            missing, so the admin panel is disabled. The public site works with
            built-in content.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  return session ? <Dashboard /> : <LoginForm />;
}
