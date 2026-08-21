import { useQuery } from "@tanstack/react-query";
import { getSupabase, supabaseEnabled } from "./supabase";
import { countries as bundledCountries, type Country, type Section } from "./countries";

export interface PageSection extends Section {
  imageUrl?: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  flag: string;
  nativeName: string;
  sort: number;
  published: boolean;
  sections: PageSection[];
  updatedAt?: string;
}

interface PageRow {
  id: string;
  slug: string;
  title: string;
  flag: string;
  native_name: string;
  sort: number;
  published: boolean;
  sections: PageSection[];
  updated_at: string;
}

function rowToPage(row: PageRow): Page {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    flag: row.flag,
    nativeName: row.native_name,
    sort: row.sort,
    published: row.published,
    sections: row.sections ?? [],
    updatedAt: row.updated_at,
  };
}

export function pageToRow(page: Partial<Page>) {
  const row: Record<string, unknown> = {};
  if (page.slug !== undefined) row.slug = page.slug;
  if (page.title !== undefined) row.title = page.title;
  if (page.flag !== undefined) row.flag = page.flag;
  if (page.nativeName !== undefined) row.native_name = page.nativeName;
  if (page.sort !== undefined) row.sort = page.sort;
  if (page.published !== undefined) row.published = page.published;
  if (page.sections !== undefined) row.sections = page.sections;
  return row;
}

function countryToPage(c: Country, index: number): Page {
  return {
    id: c.code,
    slug: c.code,
    title: c.name,
    flag: c.flag,
    nativeName: c.nativeName,
    sort: index,
    published: true,
    sections: c.sections,
  };
}

/** Special slug for the homepage notice / about content (hidden from the country grid). */
export const HOME_SLUG = "_home";

export const bundledHomePage: Page = {
  id: HOME_SLUG,
  slug: HOME_SLUG,
  title: "Top page (notice & about)",
  flag: "🏠",
  nativeName: "Homepage content",
  sort: -1,
  published: true,
  sections: [
    {
      title: "Please note before you visit",
      content: [
        "Please avoid wearing strong perfume or fragrance, out of consideration for those around you.",
        "Please do not sit on the ground or pavement in public places.",
        "Please speak in a quiet voice on trains and subways.",
        "Please be mindful of your manners in public spaces — including your posture and where you rest your feet.",
        "Shinto is deeply rooted in Japanese culture. Please show respect at shrines and toward local religious customs.",
      ],
    },
    {
      title: "About this site",
      content: [
        "This site provides practical information for visitors travelling to Japan for the first time. Topics covered include visa requirements, transportation, money, culture, and safety — presented in each country's language where possible.",
        "Information was last reviewed in March 2026. Please verify critical details such as visa requirements with official government sources before travelling.",
      ],
    },
  ],
};

export const bundledPages: Page[] = [
  bundledHomePage,
  ...bundledCountries.map(countryToPage),
];

/** Country pages only (excludes special "_"-prefixed pages such as the homepage content). */
export function countryPagesOnly(pages: Page[]): Page[] {
  return pages.filter((p) => !p.slug.startsWith("_"));
}

export async function fetchPublishedPages(): Promise<Page[]> {
  if (!supabaseEnabled) return bundledPages;
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error) {
    // Table missing or Supabase unreachable — keep the public site working.
    console.warn("Supabase pages query failed, using bundled content:", error.message);
    return bundledPages;
  }
  // A successful empty result means the CMS is active but has no published
  // pages — honor it (drafts/deletions must stay hidden).
  return ((data ?? []) as PageRow[]).map(rowToPage);
}

export async function fetchAllPages(): Promise<Page[]> {
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .order("sort", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as PageRow[]).map(rowToPage);
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  if (!supabaseEnabled) {
    return bundledPages.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await getSupabase()
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.warn("Supabase page query failed, using bundled content:", error.message);
    return bundledPages.find((p) => p.slug === slug) ?? null;
  }
  // Zero rows on a working table = not found or unpublished. Honor it so
  // unpublishing/deleting a bundled page actually hides it.
  if (!data) return null;
  return rowToPage(data as PageRow);
}

export function usePublishedPages() {
  return useQuery({
    queryKey: ["pages", "published"],
    queryFn: fetchPublishedPages,
    placeholderData: bundledPages,
    staleTime: 60_000,
  });
}

export function useHomeContent() {
  return useQuery({
    queryKey: ["pages", "slug", HOME_SLUG],
    queryFn: async () => (await fetchPageBySlug(HOME_SLUG)) ?? bundledHomePage,
    placeholderData: bundledHomePage,
    staleTime: 60_000,
  });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: ["pages", "slug", slug],
    queryFn: () => fetchPageBySlug(slug),
    staleTime: 60_000,
  });
}
