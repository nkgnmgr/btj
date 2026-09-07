import SocialTimeline from "@/components/SocialTimeline";
import { Link } from "wouter";
import {
  usePublishedPages,
  bundledPages,
  countryPagesOnly,
} from "@/lib/content";
import { useSeo } from "@/lib/seo";
import { useHomeContent, defaultHomeContent } from "@/lib/siteContent";

export default function Home() {
  useSeo({
    title: "Before Trip to Japan — Essential Travel Guide for Visitors",
    description:
      "Essential information for international visitors to Japan: visas, transport, money, culture, etiquette and safety — in your own language.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Before Trip to Japan",
      description:
        "Essential travel information for international visitors to Japan, available in multiple languages.",
    },
  });
  const { data } = usePublishedPages();
  const pages = countryPagesOnly(data ?? bundledPages);
  const { data: homeContent } = useHomeContent();
  const home = homeContent ?? defaultHomeContent;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-5 pl-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Before Trip to Japan
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {home.headerSubtitle}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pl-12 py-10">
        <section className="mb-10 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-3">
            {home.noticeTitle}
          </h2>
          <ul className="space-y-2">
            {home.noticeItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-gray-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {pages.length === 0 && (
          <p className="mb-6 text-sm text-gray-400">
            No country pages are published yet.
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pages.map((page) => (
            <Link key={page.slug} href={`/country/${page.slug}`}>
              <div className="group flex flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white p-5 cursor-pointer hover:border-gray-400 hover:shadow-sm transition-all duration-150">
                <span className="text-4xl leading-none">{page.flag}</span>
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {page.title}
                </span>
                <span className="text-xs text-gray-400 text-center leading-tight">
                  {page.nativeName}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <SocialTimeline />

        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
            {home.aboutTitle}
          </h2>
          {home.aboutParagraphs.map((para, i) => (
            <p
              key={i}
              className={`${i > 0 ? "mt-2 " : ""}text-sm text-gray-500 leading-relaxed max-w-2xl`}
            >
              {para}
            </p>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-5 pl-12 text-center text-xs text-gray-400">
        {home.footerText}
      </footer>
    </div>
  );
}
