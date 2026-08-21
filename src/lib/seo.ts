import { useEffect } from "react";

/**
 * Lightweight SEO helper: sets document title, meta description,
 * canonical URL and an optional JSON-LD structured-data block
 * for the current page (rich snippets).
 */
export function useSeo(options: {
  title: string;
  description?: string;
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}) {
  const { title, description, jsonLd, noindex } = options;

  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) setMeta("description", description);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");

    // canonical
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.origin + window.location.pathname);

    // JSON-LD
    const ID = "page-jsonld";
    document.getElementById(ID)?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = ID;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      document.getElementById(ID)?.remove();
    };
  }, [title, description, noindex, JSON.stringify(jsonLd)]);
}
