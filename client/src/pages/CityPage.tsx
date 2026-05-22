/**
 * REVIVE HOME BUYERS — City Landing Page
 *
 * Route: /sell-my-house-fast-:city (where :city matches a slug in data/cities.ts)
 *
 * Mirrors the AHR CityPage structure (hero → trust strip → city body → FAQ → CTA)
 * but uses the Revive "Calm Authority" design language:
 *  - Cormorant Garamond (display) + Outfit (body)
 *  - Forest green #2D6A3F primary, charcoal #3D4145 accent, off-white #F7F5F0 bg
 *  - Photography-forward hero with gradient overlay
 *
 * Reuses Home.tsx's LeadForm, Nav, Footer, TrustStrip, and FAQ via the
 * shared components in client/src/components/shared/. Do NOT inline-duplicate
 * the form — another track is wiring Google Places autocomplete into it.
 */
import { useParams, Link } from "wouter";
import { CheckCircle, MapPin, Phone, ArrowRight } from "lucide-react";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import TrustStrip from "@/components/shared/TrustStrip";
import FAQ from "@/components/shared/FAQ";
import LeadForm from "@/components/shared/LeadForm";
import RelatedLinks from "@/components/shared/RelatedLinks";
import { getCityBySlug, CITIES, type CityData } from "@/data/cities";
import { CITY_TO_BLOG } from "@/data/internalLinks";
import { useReveal } from "@/hooks/useReveal";
import { useSeo } from "@/hooks/useSeo";

const BASE_URL = "https://revivebuyers.com";

const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/hero-home-jBz6RHRR8Wk4ds9shb6M9f.png";
const CTA_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/cta-bg-GaREANhVxNmfArvC8TB8qL.png";

// ─── Fallback for unknown slugs ──────────────────────────────────────────────
function fallbackCityData(slug: string): CityData {
  const stateMap: Record<string, { full: string; abbr: string }> = {
    utah: { full: "Utah", abbr: "UT" },
    idaho: { full: "Idaho", abbr: "ID" },
    montana: { full: "Montana", abbr: "MT" },
    nevada: { full: "Nevada", abbr: "NV" },
    arizona: { full: "Arizona", abbr: "AZ" },
    colorado: { full: "Colorado", abbr: "CO" },
  };
  const parts = slug.split("-");
  const last = parts[parts.length - 1].toLowerCase();
  const stateInfo = stateMap[last] ?? { full: "Utah", abbr: "UT" };
  const cityParts = stateMap[last] ? parts.slice(0, -1) : parts;
  const name = cityParts
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    slug,
    name,
    state: stateInfo.full,
    stateAbbr: stateInfo.abbr,
    lat: 40.7608,
    lng: -111.8910,
    headline: `Sell Your ${name} Home for Cash in 24 Hours`,
    subheadline: `A fair, no-obligation cash offer from a local team.`,
    body1: `Looking to sell your house fast in ${name}, ${stateInfo.full}? Revive Home Buyers purchases homes throughout ${name} for cash — as-is, on your timeline. No agents. No fees. No repairs.`,
    body2: `Call us at (801) 783-2011 or fill out the form and we'll send a fair cash offer within 24 hours. If you take it, we can close in as few as 7 days through a local title company.`,
    situations: [
      "Foreclosure or behind on payments",
      "Inherited property",
      "Divorce or separation",
      "Rental property burnout",
      "Major repairs needed",
      "Out-of-state relocation",
    ],
    nearbyAreas: [],
    nearbyCities: [],
    metaTitle: `Sell My House Fast ${name}, ${stateInfo.abbr} | Cash in 24 Hours | Revive Home Buyers`,
    metaDescription: `We buy houses in ${name}, ${stateInfo.full} for cash. As-is, no fees, close in 7 days. Fair offer in 24 hours. Call (801) 783-2011.`,
  };
}

// ─── Schema.org @graph (LocalBusiness + BreadcrumbList) ──────────────────────
function buildJsonLd(city: CityData) {
  const pageUrl = `${BASE_URL}/sell-my-house-fast-${city.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "RealEstateAgent"],
        "@id": pageUrl,
        "name": `Revive Home Buyers — ${city.name}`,
        "image": HERO_IMG,
        "url": pageUrl,
        "telephone": "+1-801-783-2011",
        "priceRange": "$$",
        "description": city.metaDescription,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.name,
          "addressRegion": city.stateAbbr,
          "addressCountry": "US",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": city.lat,
          "longitude": city.lng,
        },
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": city.lat,
            "longitude": city.lng,
          },
          "geoRadius": "50000",
        },
        "sameAs": [
          "https://www.facebook.com/revivehomebuyers",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL + "/",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `Sell My House Fast ${city.name}, ${city.stateAbbr}`,
            "item": pageUrl,
          },
        ],
      },
    ],
  };
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function CityHero({ city }: { city: CityData }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#3D4145]/85 via-[#3D4145]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D4145]/40 via-transparent to-transparent" />

      <div className="relative container pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-2xl">
          {/* City pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 border border-white/25 text-white/85 text-[10px] font-semibold tracking-[0.18em] uppercase">
            <MapPin className="w-3 h-3" />
            {city.name}, {city.stateAbbr}
          </div>

          <span className="section-label mb-4 block" style={{ color: "#3d8a55" }}>
            Cash Home Buyers
          </span>
          <h1
            className="text-white leading-[1.05] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5.4vw, 4.4rem)",
              fontWeight: 500,
            }}
          >
            {city.headline}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-3 max-w-lg font-light">
            {city.subheadline}
          </p>
          <p className="text-white/65 text-sm leading-relaxed mb-8 max-w-lg font-light">
            No realtors. No fees. No repairs. Close in as few as{" "}
            <span className="text-white font-medium">7 days</span>.
          </p>
          <div id="hero-form">
            <LeadForm dark />
          </div>
          <div className="flex items-center gap-4 mt-5 text-white/55 text-xs tracking-wide">
            <span>No obligation · No fees · 100% confidential</span>
          </div>
          <a
            href="tel:8017832011"
            className="inline-flex items-center gap-2 mt-6 text-white/80 hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">(801) 783-2011</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── City Body ───────────────────────────────────────────────────────────────
function CityBody({ city }: { city: CityData }) {
  const nearbyCityData = city.nearbyCities
    .map((slug) => getCityBySlug(slug))
    .filter((c): c is CityData => !!c);

  return (
    <section className="py-24 md:py-28 bg-[#F7F5F0]">
      <div className="container">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12 md:gap-16 items-start">
          {/* Left: copy */}
          <div className="reveal">
            <span className="green-rule" />
            <span className="section-label">Local Cash Buyers</span>
            <h2
              className="text-[#3D4145] mt-3 mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
                fontWeight: 500,
                lineHeight: 1.2,
              }}
            >
              {city.name} cash home buyers
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>you can trust.</em>
            </h2>

            <p className="text-[#3D4145]/75 text-base leading-relaxed font-light mb-5">
              {city.body1}
            </p>
            <p className="text-[#3D4145]/75 text-base leading-relaxed font-light mb-10">
              {city.body2}
            </p>

            <h3
              className="text-[#3D4145] mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                fontWeight: 500,
              }}
            >
              We buy {city.name} homes in any situation
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 mb-10">
              {city.situations.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-[#3D4145]/75 font-light">
                  <CheckCircle
                    size={16}
                    className="shrink-0 text-[#2D6A3F] mt-0.5"
                    aria-hidden="true"
                  />
                  {s}
                </li>
              ))}
            </ul>

            {city.nearbyAreas.length > 0 && (
              <>
                <h3
                  className="text-[#3D4145] mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                  }}
                >
                  Nearby areas we also serve
                </h3>
                <div className="flex flex-wrap gap-2 mb-10">
                  {city.nearbyAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#3D4145]/70 border border-[#3D4145]/15 bg-white"
                    >
                      <MapPin size={11} className="text-[#2D6A3F]" aria-hidden="true" />
                      {area}
                    </span>
                  ))}
                </div>
              </>
            )}

            {nearbyCityData.length > 0 && (
              <>
                <h3
                  className="text-[#3D4145] mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.25rem",
                    fontWeight: 500,
                  }}
                >
                  Also serving nearby cities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {nearbyCityData.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/sell-my-house-fast-${c.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#2D6A3F] border border-[#2D6A3F]/30 bg-white hover:bg-[#2D6A3F] hover:text-white transition-colors duration-150"
                    >
                      <MapPin size={11} aria-hidden="true" />
                      Sell My House Fast {c.name}, {c.stateAbbr}
                    </Link>
                  ))}
                </div>
              </>
            )}

            {city.homesPurchased && (
              <p className="mt-10 pt-6 border-t border-[#3D4145]/10 text-xs uppercase tracking-widest text-[#2D6A3F] font-semibold">
                {city.homesPurchased}
              </p>
            )}

            <RelatedLinks
              links={CITY_TO_BLOG[city.slug] ?? []}
              heading="Helpful guides for sellers"
            />
          </div>

          {/* Right: sticky form */}
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <div className="md:sticky md:top-28 bg-white p-7 shadow-sm border border-[#3D4145]/10">
              <span className="section-label" style={{ color: "#2D6A3F" }}>
                Get Your Offer
              </span>
              <h3
                className="text-[#3D4145] mt-2 mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                Fair cash offer
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 300 }}>in 24 hours.</em>
              </h3>
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Bottom CTA ──────────────────────────────────────────────────────────────
function CityCTA({ city }: { city: CityData }) {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CTA_BG})` }}
      />
      <div className="absolute inset-0 bg-[#3D4145]/85" />
      <div className="relative container text-center">
        <div className="max-w-2xl mx-auto reveal">
          <span className="green-rule mx-auto" style={{ backgroundColor: "#3d8a55" }} />
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            Ready to sell your
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>
              {city.name} home?
            </em>
          </h2>
          <p className="text-white/70 text-sm mb-10 font-light">
            Fair cash offer in 24 hours. Close in 7 days. No fees, no repairs, no pressure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#hero-form"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#hero-form")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-8 h-12 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] transition-colors duration-150"
            >
              Get My Cash Offer <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="tel:8017832011"
              className="inline-flex items-center gap-2 px-8 h-12 border border-white/30 text-white text-sm font-semibold tracking-widest uppercase hover:bg-white/10 transition-colors duration-150"
            >
              <Phone className="w-4 h-4" />
              (801) 783-2011
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CityPage() {
  useReveal();
  const params = useParams<{ city: string }>();
  const slug = params.city ?? "salt-lake-city-utah";
  const city = getCityBySlug(slug) ?? fallbackCityData(slug);
  const canonical = `${BASE_URL}/sell-my-house-fast-${city.slug}`;
  const ogImage = `${BASE_URL}/og/${city.slug}.png`;

  useSeo({
    title: city.metaTitle,
    description: city.metaDescription,
    canonical,
    ogImage,
    jsonLd: buildJsonLd(city),
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
      <Nav onHome={false} />
      <CityHero city={city} />
      <TrustStrip />
      <CityBody city={city} />
      <FAQ />
      <CityCTA city={city} />
      <Footer />
    </div>
  );
}
