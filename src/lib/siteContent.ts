import { useQuery } from "@tanstack/react-query";
import { getSupabase, supabaseEnabled } from "./supabase";

export interface HomeContent {
  headerSubtitle: string;
  footerText: string;
  noticeTitle: string;
  noticeItems: string[];
  aboutTitle: string;
  aboutParagraphs: string[];
}

export const defaultHomeContent: HomeContent = {
  headerSubtitle:
    "Essential information for international visitors — Select your country",
  footerText: "Before Trip to Japan · For informational purposes only",
  noticeTitle: "Please note before you visit",
  noticeItems: [
    "Please avoid wearing strong perfume or fragrance, out of consideration for those around you.",
    "Please do not sit on the ground or pavement in public places.",
    "Please speak in a quiet voice on trains and subways.",
    "Please be mindful of your manners in public spaces — including your posture and where you rest your feet.",
    "Shinto is deeply rooted in Japanese culture. Please show respect at shrines and toward local religious customs.",
  ],
  aboutTitle: "About this site",
  aboutParagraphs: [
    "This site provides practical information for visitors travelling to Japan for the first time. Topics covered include visa requirements, transportation, money, culture, and safety — presented in each country's language where possible.",
    "Information was last reviewed in March 2026. Please verify critical details such as visa requirements with official government sources before travelling.",
  ],
};

const HOME_KEY = "home";

function normalize(value: Partial<HomeContent> | null | undefined): HomeContent {
  if (!value) return defaultHomeContent;
  return {
    headerSubtitle:
      value.headerSubtitle?.trim() || defaultHomeContent.headerSubtitle,
    footerText: value.footerText?.trim() || defaultHomeContent.footerText,
    noticeTitle: value.noticeTitle?.trim() || defaultHomeContent.noticeTitle,
    noticeItems:
      Array.isArray(value.noticeItems) && value.noticeItems.length > 0
        ? value.noticeItems
        : defaultHomeContent.noticeItems,
    aboutTitle: value.aboutTitle?.trim() || defaultHomeContent.aboutTitle,
    aboutParagraphs:
      Array.isArray(value.aboutParagraphs) && value.aboutParagraphs.length > 0
        ? value.aboutParagraphs
        : defaultHomeContent.aboutParagraphs,
  };
}

export async function fetchHomeContent(): Promise<HomeContent> {
  if (!supabaseEnabled) return defaultHomeContent;
  const { data, error } = await getSupabase()
    .from("site_content")
    .select("value")
    .eq("key", HOME_KEY)
    .maybeSingle();
  if (error) throw error;
  return normalize(data?.value as Partial<HomeContent> | undefined);
}

export async function saveHomeContent(content: HomeContent): Promise<void> {
  const { error } = await getSupabase()
    .from("site_content")
    .upsert({ key: HOME_KEY, value: content }, { onConflict: "key" });
  if (error) throw error;
}

export function useHomeContent() {
  return useQuery({
    queryKey: ["site-content", HOME_KEY],
    queryFn: fetchHomeContent,
    placeholderData: defaultHomeContent,
    staleTime: 60_000,
  });
}
