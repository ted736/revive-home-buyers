/**
 * Revive Home Buyers — Analytics & Conversion Tracking
 *
 * Conditionally loads GA4 and Meta Pixel based on VITE_GA4_ID and
 * VITE_META_PIXEL_ID environment variables. Both are no-ops when the
 * env vars are not set, so the code is safe to ship before credentials exist.
 *
 * GA4 Measurement ID: set VITE_GA4_ID=G-XXXXXXXXXX in Vercel env vars
 * Meta Pixel ID:      set VITE_META_PIXEL_ID=XXXXXXXXXX in Vercel env vars
 *
 * Conversion events tracked:
 *   address_entered         — user selects an address from the autocomplete
 *   contact_step_completed  — user completes the name/phone step
 *   situation_step_completed — user selects a situation
 *   form_submitted          — lead form submitted successfully
 *   phone_clicked           — user taps/clicks a phone number
 *   blog_read_complete      — user scrolls 80%+ of a blog post
 */

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: (...args: unknown[]) => void };
    _fbq: typeof window.fbq;
  }
}

// ─── GA4 Init ────────────────────────────────────────────────────────────────
export function initGA4() {
  if (!GA4_ID || typeof document === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    send_page_view: true,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);
}

// ─── Meta Pixel Init ──────────────────────────────────────────────────────────
export function initMetaPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined") return;

  // Standard Meta Pixel base code
  (function (f: Window, b: Document) {
    if (f.fbq) return;
    const n = (f.fbq = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        n.queue.push(args);
      }
    }) as typeof window.fbq;
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement("script") as HTMLScriptElement;
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    const s = b.getElementsByTagName("script")[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

// ─── Event helpers ────────────────────────────────────────────────────────────
function ga4Event(name: string, params?: Record<string, unknown>) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", name, params);
}

function metaEvent(name: string, params?: Record<string, unknown>) {
  if (!META_PIXEL_ID || !window.fbq) return;
  window.fbq("track", name, params);
}

function metaCustomEvent(name: string, params?: Record<string, unknown>) {
  if (!META_PIXEL_ID || !window.fbq) return;
  window.fbq("trackCustom", name, params);
}

// ─── Page view (SPA navigation) ──────────────────────────────────────────────
export function trackPageView(url: string) {
  ga4Event("page_view", { page_location: url });
  metaEvent("PageView");
}

// ─── Conversion events ───────────────────────────────────────────────────────
export function trackAddressEntered(city?: string) {
  ga4Event("address_entered", { city });
  metaCustomEvent("address_entered", { city });
}

export function trackContactStepCompleted() {
  ga4Event("contact_step_completed");
  metaCustomEvent("contact_step_completed");
}

export function trackSituationStepCompleted(situation?: string) {
  ga4Event("situation_step_completed", { situation });
  metaCustomEvent("situation_step_completed", { situation });
}

export function trackFormSubmitted(citySlug?: string, source?: string) {
  ga4Event("form_submitted", { city_slug: citySlug, source });
  ga4Event("generate_lead", { city_slug: citySlug, source });
  metaEvent("Lead", { content_name: citySlug, content_category: source });
}

export function trackPhoneClicked(location?: string) {
  ga4Event("phone_clicked", { location });
  metaCustomEvent("phone_clicked", { location });
}

export function trackBlogReadComplete(slug?: string) {
  ga4Event("blog_read_complete", { blog_slug: slug });
  metaCustomEvent("blog_read_complete", { blog_slug: slug });
}

// ─── Scroll depth tracking ───────────────────────────────────────────────────
export function initScrollDepthTracking(slug?: string) {
  if (typeof window === "undefined") return;

  const thresholds = [25, 50, 75, 90];
  const fired = new Set<number>();

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = Math.round((scrollTop / docHeight) * 100);

    for (const threshold of thresholds) {
      if (pct >= threshold && !fired.has(threshold)) {
        fired.add(threshold);
        ga4Event("scroll_depth", { percent: threshold, page_slug: slug });
        if (threshold === 90 && slug?.includes("blog")) {
          trackBlogReadComplete(slug);
        }
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
