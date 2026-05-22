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
  ogImage?: string;   // absolute URL to 1200x630 og:image PNG
  jsonLd?: Record<string, unknown>;
};

function getOrCreate(selector: string, tag: string, attrs: Record<string, string>): Element {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  return el;
}

export function useSeo({ title, description, canonical, ogImage, jsonLd }: SeoArgs) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const metaDesc = getOrCreate('meta[name="description"]', "meta", { name: "description" });
    const prevDesc = metaDesc.getAttribute("content");
    metaDesc.setAttribute("content", description);

    // OG tags
    const ogTitle = getOrCreate('meta[property="og:title"]', "meta", { property: "og:title" });
    const prevOgTitle = ogTitle.getAttribute("content");
    ogTitle.setAttribute("content", title);

    const ogDesc = getOrCreate('meta[property="og:description"]', "meta", { property: "og:description" });
    const prevOgDesc = ogDesc.getAttribute("content");
    ogDesc.setAttribute("content", description);

    const ogType = getOrCreate('meta[property="og:type"]', "meta", { property: "og:type" });
    ogType.setAttribute("content", "website");

    let ogImgEl: Element | null = null;
    let prevOgImg: string | null = null;
    if (ogImage) {
      ogImgEl = getOrCreate('meta[property="og:image"]', "meta", { property: "og:image" });
      prevOgImg = ogImgEl.getAttribute("content");
      ogImgEl.setAttribute("content", ogImage);
      ogImgEl.setAttribute("data-seo-injected", "true");
    }

    // Twitter card
    const twCard = getOrCreate('meta[name="twitter:card"]', "meta", { name: "twitter:card" });
    twCard.setAttribute("content", ogImage ? "summary_large_image" : "summary");

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
      if (prevOgTitle !== null) ogTitle.setAttribute("content", prevOgTitle);
      if (prevOgDesc !== null) ogDesc.setAttribute("content", prevOgDesc);
      if (ogImgEl && prevOgImg !== null) ogImgEl.setAttribute("content", prevOgImg);
      if (canonicalEl) {
        if (prevCanonical !== null) {
          canonicalEl.setAttribute("href", prevCanonical);
        } else {
          canonicalEl.parentNode?.removeChild(canonicalEl);
        }
      }
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [title, description, canonical, ogImage, jsonLd]);
}
