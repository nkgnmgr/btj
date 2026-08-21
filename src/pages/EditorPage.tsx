import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase, supabaseEnabled } from "@/lib/supabase";
import { useAuth } from "@/lib/useAuth";
import { pageToRow, type Page, type PageSection } from "@/lib/content";
import { uploadImage } from "@/lib/upload";

const EMPTY_PAGE: Page = {
  id: "",
  slug: "",
  title: "",
  flag: "🌏",
  nativeName: "",
  sort: 100,
  published: false,
  sections: [{ title: "", content: [""] }],
};

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onMove,
  onRemove,
}: {
  section: PageSection;
  index: number;
  total: number;
  onChange: (s: PageSection) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadImage(file);
      onChange({ ...section, imageUrl: url });
    } catch (err) {
      setUploadError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <input
          value={section.title}
          onChange={(e) => onChange({ ...section, title: e.target.value })}
          placeholder="Section title (e.g. Visa & Entry)"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium"
        />
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 disabled:opacity-30"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-500 disabled:opacity-30"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
            title="Remove section"
          >
            ✕
          </button>
        </div>
      </div>

      <textarea
        value={section.content.join("\n")}
        onChange={(e) =>
          onChange({ ...section, content: e.target.value.split("\n") })
        }
        rows={Math.max(4, section.content.length + 1)}
        placeholder="One bullet point per line"
        className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm leading-relaxed"
      />
      <p className="mt-1 text-xs text-gray-400">One line = one bullet point.</p>

      <div className="mt-3 flex items-center gap-3">
        {section.imageUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={section.imageUrl}
              alt=""
              className="h-16 w-24 rounded border border-gray-200 object-cover"
            />
            <button
              type="button"
              onClick={() => onChange({ ...section, imageUrl: undefined })}
              className="text-xs text-red-500 hover:underline"
            >
              Remove image
            </button>
          </div>
        ) : (
          <label className="cursor-pointer rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
            {uploading ? "Uploading…" : "Add image"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      {uploadError && (
        <p className="mt-2 text-xs text-red-600">
          {uploadError} — Image upload works on the Cloudflare Pages site
          (requires the R2 bucket to be connected).
        </p>
      )}
    </div>
  );
}

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";
  const { session, loading } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [page, setPage] = useState<Page>(EMPTY_PAGE);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "page", params.id],
    enabled: supabaseEnabled && !isNew,
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from("pages")
        .select("*")
        .eq("id", params.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing) {
      setPage({
        id: existing.id,
        slug: existing.slug,
        title: existing.title,
        flag: existing.flag,
        nativeName: existing.native_name,
        sort: existing.sort,
        published: existing.published,
        sections: existing.sections ?? [],
      });
    }
  }, [existing]);

  if (!supabaseEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Supabase is not configured.
      </div>
    );
  }
  if (loading || (!isNew && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }
  if (!session) {
    navigate("/admin");
    return null;
  }

  function updateSection(i: number, s: PageSection) {
    setPage((p) => {
      const sections = [...p.sections];
      sections[i] = s;
      return { ...p, sections };
    });
  }

  function moveSection(i: number, dir: -1 | 1) {
    setPage((p) => {
      const sections = [...p.sections];
      const j = i + dir;
      if (j < 0 || j >= sections.length) return p;
      [sections[i], sections[j]] = [sections[j], sections[i]];
      return { ...p, sections };
    });
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setSaveError("");
    const toSave: Page = {
      ...page,
      published: publish ?? page.published,
      sections: page.sections
        .map((s) => ({
          ...s,
          content: s.content.map((l) => l.trim()).filter(Boolean),
        }))
        .filter((s) => s.title.trim() || s.content.length > 0 || s.imageUrl),
    };
    if (!toSave.slug.trim() || !toSave.title.trim()) {
      setSaveError("Title and slug are required.");
      setSaving(false);
      return;
    }
    try {
      const row = pageToRow(toSave);
      if (isNew) {
        const { error } = await getSupabase().from("pages").insert(row);
        if (error) throw error;
      } else {
        const { error } = await getSupabase()
          .from("pages")
          .update(row)
          .eq("id", page.id);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
      navigate("/admin");
    } catch (err) {
      setSaveError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-6 py-3 pl-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/admin">
            <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
              ← Admin
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {saveError && (
              <span className="mr-2 text-xs text-red-600">{saveError}</span>
            )}
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="rounded border border-gray-300 px-4 py-1.5 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="rounded bg-gray-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pl-12 py-8">
        <h1 className="text-lg font-semibold text-gray-900">
          {isNew ? "New page" : "Edit page"}
        </h1>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-gray-600">
            Title
            <input
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              placeholder="e.g. Germany"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Slug (URL: /country/…)
            <input
              value={page.slug}
              onChange={(e) =>
                setPage({
                  ...page,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                })
              }
              placeholder="e.g. de"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Icon (emoji)
            <input
              value={page.flag}
              onChange={(e) => setPage({ ...page, flag: e.target.value })}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Subtitle / native name
            <input
              value={page.nativeName}
              onChange={(e) => setPage({ ...page, nativeName: e.target.value })}
              placeholder="e.g. Deutsch"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Sort order (smaller = first)
            <input
              type="number"
              value={page.sort}
              onChange={(e) =>
                setPage({ ...page, sort: Number(e.target.value) || 0 })
              }
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
          Sections
        </h2>
        <div className="space-y-4">
          {page.sections.map((s, i) => (
            <SectionEditor
              key={i}
              section={s}
              index={i}
              total={page.sections.length}
              onChange={(next) => updateSection(i, next)}
              onMove={(dir) => moveSection(i, dir)}
              onRemove={() =>
                setPage((p) => ({
                  ...p,
                  sections: p.sections.filter((_, j) => j !== i),
                }))
              }
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            setPage((p) => ({
              ...p,
              sections: [...p.sections, { title: "", content: [""] }],
            }))
          }
          className="mt-4 rounded border border-dashed border-gray-300 px-4 py-2 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700"
        >
          + Add section
        </button>
      </main>
    </div>
  );
}
