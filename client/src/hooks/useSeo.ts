/**
 * Lightweight per-page SEO: sets <title>, <meta name="description">,
 * <link rel="canonical">, and injects a JSON-LD schema block into <head>.
 *
 * Cleans up on unmount so SPA navigation between pages doesn't leak stale tags.
 */
import { useEffect } from "react";

type SeoArgs = {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, unknown>;
};

export function useSeo({ title, description, canonical, jsonLd }: SeoArgs) {
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

    // Canonical link
    let canonicalEl: HTMLLinkElement | null = null;
    let prevCanonical: string | null = null;
    if (canonical) {
      canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalEl) {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalEl);
      }
      prevCanonical = canonicalEl.getAttribute("href");
      canonicalEl.setAttribute("href", canonical);
    }

    // JSON-LD schema
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
      if (canonicalEl) {
        if (prevCanonical !== null) {
          canonicalEl.setAttribute("href", prevCanonical);
        } else {
          canonicalEl.parentNode?.removeChild(canonicalEl);
        }
      }
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, canonical, jsonLd]);
}
