import { Link, useParams } from "wouter";
import { usePage } from "@/lib/content";
import ImageLightbox from "@/components/ImageLightbox";
import { useSeo } from "@/lib/seo";
import { useHomeContent, defaultHomeContent } from "@/lib/siteContent";

export default function CountryPage() {
  const params = useParams<{ code: string }>();
  const isSpecial = params.code.startsWith("_");
  const { data: country, isLoading } = usePage(params.code);
  const { data: home } = useHomeContent();
  const footerText = home?.footerText ?? defaultHomeContent.footerText;

  useSeo({
    title: country
      ? `${country.title} — Before Trip to Japan`
      : "Before Trip to Japan",
    description: country
      ? `Travel information for visitors from ${country.title}: ${country.sections
          .map((s) => s.title)
          .slice(0, 5)
          .join(", ")}.`
      : undefined,
    noindex: isSpecial || (!isLoading && !country),
    jsonLd: country
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${country.title} — Before Trip to Japan`,
          inLanguage: country.nativeName,
          about: "Travel information for visiting Japan",
          articleSection: country.sections.map((s) => s.title),
        }
      : undefined,
  });

  if (isSpecial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Country not found.</p>
          <Link href="/">
            <span className="mt-4 inline-block text-sm text-blue-600 hover:underline cursor-pointer">
              ← Back to home
            </span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    );
  }

  if (!country || !country.published) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Country not found.</p>
          <Link href="/">
            <span className="mt-4 inline-block text-sm text-blue-600 hover:underline cursor-pointer">
              ← Back to home
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-4 pl-12">
        <div className="max-w-3xl mx-auto">
          <Link href="/">
            <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              ← Before Trip to Japan
            </span>
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{country.title}</h1>
              {country.nativeName !== country.title && (
                <p className="text-sm text-gray-400">{country.nativeName}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pl-12 py-8">
        {country.sections.length > 1 && (
          <nav className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Contents
            </p>
            <ol className="space-y-1">
              {country.sections.map((section, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(`section-${index}`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex gap-2 text-sm text-gray-700 hover:text-gray-900 hover:underline"
                  >
                    <span className="text-gray-400">{index + 1}.</span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="space-y-8">
          {country.sections.map((section, index) => (
            <section key={index} id={`section-${index}`} className="scroll-mt-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                {section.title}
              </h2>
              {section.imageUrl && (
                <ImageLightbox
                  src={section.imageUrl}
                  alt={section.title}
                  className="mb-4 w-full rounded-lg border border-gray-100 object-cover"
                />
              )}
              <ul className="space-y-2">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-gray-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {index < country.sections.length - 1 && (
                <div className="mt-8 border-b border-gray-100" />
              )}
            </section>
          ))}
        </div>

        <div className="mt-10">
          <Link href="/">
            <span className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
              ← Back to country list
            </span>
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-5 pl-12 text-center text-xs text-gray-400 mt-8">
        {footerText}
      </footer>
    </div>
  );
}
