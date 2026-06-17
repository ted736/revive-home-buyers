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
// Google Ads conversion tracking. AW-ID + label come from the conversion tag
// email Google emits when you create a Conversion Action in the Ads UI.
// Lead-form conversion is the only one wired in this first ship; downstream
// conversions (Qualified Call, Contract Signed, Closed Deal) need their own
// labels + values via the OCT API once the CRM stage-transition wiring lands.
const GADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const GADS_CONVERSION_LEAD = import.meta.env.VITE_GADS_CONVERSION_LEAD as string | undefined;

// GCLID capture: keep the click ID around for 90 days so any downstream
// conversion (the lead-form ping below, plus future OCT pushes from the
// CRM) can be attributed back to the original ad click. Survives full-page
// reloads via localStorage.
const GCLID_KEY = "rb_gclid";
const GCLID_TTL_MS = 90 * 24 * 60 * 60 * 1000;

// UTM capture: mirror the GCLID pattern so per-campaign/city/keyword
// attribution survives multi-page browsing before a lead submits the form.
// Added 2026-06-17 alongside the 63-city Google Ads launch — without this,
// CRM rows had no way to identify which campaign produced the lead.
const UTM_KEY = "rb_utm";
const UTM_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
export type UtmParams = Partial<Record<(typeof UTM_FIELDS)[number], string>>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: (...args: unknown[]) => void };
    _fbq: typeof window.fbq;
  }
}

// ─── GA4 + Google Ads Init ───────────────────────────────────────────────────
// One gtag.js loader serves BOTH GA4 + Google Ads — Google's gtag library
// multiplexes by ID. We use the GA4 measurement ID as the loader src (since
// it's almost always set), then issue `config` calls for each product.
export function initGA4() {
  if (typeof document === "undefined") return;
  if (!GA4_ID && !GADS_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  if (GA4_ID) window.gtag("config", GA4_ID, { send_page_view: true });
  if (GADS_ID) {
    window.gtag("config", GADS_ID, { send_page_view: true });
    // Explicit remarketing page_view so the Google Ads audience grows
    // independent of the GA4 <-> Ads link being healthy.
    window.gtag("event", "page_view", { send_to: GADS_ID });
  }

  const loaderId = GA4_ID || GADS_ID;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${loaderId}`;
  document.head.appendChild(script);

  // GCLID capture from the URL (Google appends ?gclid=... on ad clicks)
  captureGclidFromUrl();
  // UTM capture from the URL (Google Ads tracking_url_template appends
  // utm_source, utm_medium, utm_campaign, utm_content, utm_term on click)
  captureUtmFromUrl();
}

// ─── GCLID capture + retrieval ──────────────────────────────────────────────
function captureGclidFromUrl() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid");
    if (gclid) {
      window.localStorage.setItem(
        GCLID_KEY,
        JSON.stringify({ gclid, ts: Date.now() })
      );
    }
  } catch {
    // localStorage disabled (private mode / SSR) — no-op
  }
}

export function getStoredGclid(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(GCLID_KEY);
    if (!raw) return null;
    const { gclid, ts } = JSON.parse(raw) as { gclid: string; ts: number };
    if (Date.now() - ts > GCLID_TTL_MS) {
      window.localStorage.removeItem(GCLID_KEY);
      return null;
    }
    return gclid || null;
  } catch {
    return null;
  }
}

// ─── UTM capture + retrieval ─────────────────────────────────────────────────
function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: UtmParams = {};
    for (const k of UTM_FIELDS) {
      const v = params.get(k);
      if (v) utm[k] = v;
    }
    if (Object.keys(utm).length > 0) {
      window.localStorage.setItem(
        UTM_KEY,
        JSON.stringify({ utm, ts: Date.now() })
      );
    }
  } catch {
    // localStorage disabled (private mode / SSR) — no-op
  }
}

export function getStoredUtms(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(UTM_KEY);
    if (!raw) return {};
    const { utm, ts } = JSON.parse(raw) as { utm: UtmParams; ts: number };
    if (Date.now() - ts > UTM_TTL_MS) {
      window.localStorage.removeItem(UTM_KEY);
      return {};
    }
    return utm ?? {};
  } catch {
    return {};
  }
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

  // Google Ads conversion ping — fires on every form-submit. Smart Bidding
  // trains on this. Value=1.0 USD is a placeholder until per-stage values
  // (qualified call / contract / closed) land via the OCT backend.
  if (GADS_ID && GADS_CONVERSION_LEAD && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: `${GADS_ID}/${GADS_CONVERSION_LEAD}`,
      value: 1.0,
      currency: "USD",
    });
  }
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
