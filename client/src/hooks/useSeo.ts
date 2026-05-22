/**
 * Lightweight per-page SEO: sets <title>, <meta name="description">, and
 * (optionally) injects a JSON-LD LocalBusiness schema block into <head>.
 *
 * Cleans up on unmount so SPA navigation between pages doesn't leak stale tags.
 */
import { useEffect } from "react";

type SeoArgs = {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
};

export function useSeo({ title, description, jsonLd }: SeoArgs) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const metaDesc =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    const prevDesc = metaDesc.getAttribute("content");
    metaDesc.setAttribute("content", description);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      script.dataset.seoInjected = "true";
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) metaDesc.setAttribute("content", prevDesc);
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, jsonLd]);
}
