/**
 * REVIVE HOME BUYERS — Cash Buyers Registration
 * Route: /access-deals
 * Purpose: capture cash investor leads to build proprietary buyer list
 * Design: "Calm Authority" — Cormorant Garamond + Outfit + forest green
 */
import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle, MapPin, Bell, Eye, FileText, Users, ArrowRight, Star } from "lucide-react";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import { CITIES } from "@/data/cities";
import { useSeo } from "@/hooks/useSeo";
import { trackFormSubmitted } from "@/lib/analytics";
import { BUYERS_EDGE_FN, SUPABASE_ANON_KEY as SUPA_ANON_KEY } from "@/lib/supabase";

const EDGE_FN = BUYERS_EDGE_FN;

const PROPERTY_TYPES = ["SFR", "Multi-Family", "Land", "Condo", "Other"];
const FINANCING_OPTIONS = ["All cash", "Hard money", "Conventional", "Other"];
const POF_OPTIONS = ["Have POF ready", "Can get within 24h", "Need 1–2 weeks"];
const PRICE_RANGES = [
  { label: "Under $150k", min: 0, max: 150000 },
  { label: "$150k – $250k", min: 150000, max: 250000 },
  { label: "$250k – $400k", min: 250000, max: 400000 },
  { label: "$400k – $600k", min: 400000, max: 600000 },
  { label: "$600k – $1M", min: 600000, max: 1000000 },
  { label: "Over $1M", min: 1000000, max: 5000000 },
];

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cities_of_interest: string[];
  price_range: string;
  property_types: string[];
  financing: string;
  pof_status: string;
  source: string;
};

const EMPTY: FormData = {
  first_name: "", last_name: "", email: "", phone: "",
  cities_of_interest: [], price_range: "",
  property_types: [], financing: "", pof_status: "", source: "",
};

// ─── Confirmation page ────────────────────────────────────────────────────────
function Confirmed({ data }: { data: FormData }) {
  const cityNames = data.cities_of_interest
    .map((slug) => CITIES.find((c) => c.slug === slug)?.name)
    .filter(Boolean)
    .slice(0, 5)
    .join(", ");
  const priceLabel = PRICE_RANGES.find((r) => `${r.min}-${r.max}` === data.price_range)?.label ?? data.price_range;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
      <Nav onHome={false} />
      <div className="container py-32 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#2D6A3F] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-white w-8 h-8" />
        </div>
        <h1
          className="text-[#3D4145] mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 500 }}
        >
          Welcome to the list,
          <br />
          <em style={{ fontStyle: "italic", fontWeight: 300 }}>{data.first_name}.</em>
        </h1>
        <p className="text-[#3D4145]/65 text-base leading-relaxed mb-8 font-light max-w-lg mx-auto">
          You're now on our exclusive buyer list. We'll reach out the moment we have an off-market deal that matches your criteria — no spam, just deals.
        </p>

        {(cityNames || priceLabel) && (
          <div className="bg-white border border-[#3D4145]/10 p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="text-[#3D4145] font-semibold text-sm tracking-widest uppercase mb-4">Your Criteria</h3>
            {cityNames && (
              <div className="flex items-start gap-2 mb-2">
                <MapPin size={14} className="text-[#2D6A3F] mt-0.5 shrink-0" />
                <span className="text-sm text-[#3D4145]/70 font-light">{cityNames}</span>
              </div>
            )}
            {priceLabel && (
              <div className="flex items-start gap-2">
                <span className="text-[#2D6A3F] font-semibold text-xs mt-0.5">$</span>
                <span className="text-sm text-[#3D4145]/70 font-light">{priceLabel}</span>
              </div>
            )}
          </div>
        )}

        <Link href="/" className="inline-flex items-center gap-2 text-[#2D6A3F] text-sm hover:underline">
          ← Back to Revive Home Buyers
        </Link>
      </div>
      <Footer />
    </div>
  );
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function BuyerForm() {
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const set = (field: keyof FormData, value: unknown) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setApiError("");
  };

  const toggleArrayItem = (field: "cities_of_interest" | "property_types", value: string) => {
    setData((d) => {
      const arr = d[field] as string[];
      return { ...d, [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!data.first_name.trim()) e.first_name = "Required";
    if (!data.last_name.trim()) e.last_name = "Required";
    if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!data.phone.trim()) e.phone = "Required";
    if (data.cities_of_interest.length === 0) e.cities_of_interest = "Select at least one city";
    if (!data.financing) e.financing = "Required";
    if (!data.pof_status) e.pof_status = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    const range = PRICE_RANGES.find((r) => `${r.min}-${r.max}` === data.price_range);

    try {
      const res = await fetch(EDGE_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPA_ANON_KEY}`,
        },
        body: JSON.stringify({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          cities_of_interest: data.cities_of_interest,
          price_min: range?.min,
          price_max: range?.max,
          property_types: data.property_types,
          financing: data.financing,
          pof_status: data.pof_status,
          source: data.source,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? "Submission failed — please try again.");
        return;
      }

      trackFormSubmitted(undefined, "buyer_signup");
      setSubmittedData(data);
      setSubmitted(true);
    } catch {
      setApiError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted && submittedData) return <Confirmed data={submittedData} />;

  const inputCls = (field: keyof FormData) =>
    `w-full h-12 px-4 text-base bg-white border-2 text-[#3D4145] placeholder:text-[#3D4145]/40 outline-none transition-colors duration-150 focus:border-[#2D6A3F] ${errors[field] ? "border-red-400" : "border-[#3D4145]/20"}`;

  const errCls = "text-red-500 text-xs mt-1";
  const labelCls = "text-xs font-semibold tracking-widest uppercase text-[#3D4145]/55 mb-1.5 block";

  return (
    <form onSubmit={submit} className="space-y-7">
      {/* Name row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>First Name *</label>
          <input value={data.first_name} onChange={(e) => set("first_name", e.target.value)} placeholder="John" autoComplete="given-name" className={inputCls("first_name")} />
          {errors.first_name && <p className={errCls}>{errors.first_name}</p>}
        </div>
        <div>
          <label className={labelCls}>Last Name *</label>
          <input value={data.last_name} onChange={(e) => set("last_name", e.target.value)} placeholder="Smith" autoComplete="family-name" className={inputCls("last_name")} />
          {errors.last_name && <p className={errCls}>{errors.last_name}</p>}
        </div>
      </div>

      {/* Contact row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" autoComplete="email" className={inputCls("email")} />
          {errors.email && <p className={errCls}>{errors.email}</p>}
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(801) 555-0100"
            className={inputCls("phone")}
          />
          {errors.phone && <p className={errCls}>{errors.phone}</p>}
        </div>
      </div>

      {/* Cities of interest */}
      <div>
        <label className={labelCls}>Cities of Interest * (select all that apply)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CITIES.map((city) => {
            const selected = data.cities_of_interest.includes(city.slug);
            return (
              <button
                key={city.slug}
                type="button"
                onClick={() => toggleArrayItem("cities_of_interest", city.slug)}
                className={`px-3 py-2 text-xs font-medium text-left border-2 transition-colors duration-150 ${
                  selected
                    ? "border-[#2D6A3F] bg-[#2D6A3F] text-white"
                    : "border-[#3D4145]/15 bg-white text-[#3D4145]/70 hover:border-[#2D6A3F]/40"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={10} className={selected ? "text-white" : "text-[#2D6A3F]"} />
                  {city.name}, {city.stateAbbr}
                </span>
              </button>
            );
          })}
        </div>
        {errors.cities_of_interest && <p className={errCls}>{errors.cities_of_interest}</p>}
      </div>

      {/* Investment criteria */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Price range */}
        <div>
          <label className={labelCls}>Price Range</label>
          <div className="space-y-1.5">
            {PRICE_RANGES.map((r) => {
              const val = `${r.min}-${r.max}`;
              const sel = data.price_range === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => set("price_range", sel ? "" : val)}
                  className={`w-full px-4 py-2.5 text-sm text-left border-2 transition-colors duration-150 ${sel ? "border-[#2D6A3F] bg-[#2D6A3F] text-white" : "border-[#3D4145]/15 bg-white text-[#3D4145]/70 hover:border-[#2D6A3F]/30"}`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property types + financing + POF */}
        <div className="space-y-5">
          <div>
            <label className={labelCls}>Property Types</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((t) => {
                const sel = data.property_types.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleArrayItem("property_types", t)}
                    className={`px-3 py-1.5 text-xs font-medium border-2 transition-colors duration-150 ${sel ? "border-[#2D6A3F] bg-[#2D6A3F] text-white" : "border-[#3D4145]/15 bg-white text-[#3D4145]/70 hover:border-[#2D6A3F]/30"}`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className={labelCls}>Financing *</label>
            <div className="space-y-1.5">
              {FINANCING_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => set("financing", data.financing === f ? "" : f)}
                  className={`w-full px-4 py-2.5 text-sm text-left border-2 transition-colors duration-150 ${data.financing === f ? "border-[#2D6A3F] bg-[#2D6A3F] text-white" : "border-[#3D4145]/15 bg-white text-[#3D4145]/70 hover:border-[#2D6A3F]/30"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            {errors.financing && <p className={errCls}>{errors.financing}</p>}
          </div>

          <div>
            <label className={labelCls}>Proof of Funds *</label>
            <div className="space-y-1.5">
              {POF_OPTIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set("pof_status", data.pof_status === p ? "" : p)}
                  className={`w-full px-4 py-2.5 text-sm text-left border-2 transition-colors duration-150 ${data.pof_status === p ? "border-[#2D6A3F] bg-[#2D6A3F] text-white" : "border-[#3D4145]/15 bg-white text-[#3D4145]/70 hover:border-[#2D6A3F]/30"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {errors.pof_status && <p className={errCls}>{errors.pof_status}</p>}
          </div>
        </div>
      </div>

      {/* How did you hear */}
      <div>
        <label className={labelCls}>How did you hear about us? (optional)</label>
        <input
          value={data.source}
          onChange={(e) => set("source", e.target.value)}
          placeholder="Referral, Google, social media, etc."
          className={inputCls("source")}
        />
      </div>

      {apiError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 h-14 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>Access the Deal Pipeline <ArrowRight className="w-4 h-4" /></>
        )}
      </button>

      <p className="text-center text-[#3D4145]/35 text-xs leading-relaxed">
        No spam. No junk. Just exclusive off-market deals that match your criteria.
        <br />We typically send 2–4 deal alerts per month.
      </p>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AccessDeals() {
  useSeo({
    title: "Access Exclusive Off-Market Cash Deals | Revive Home Buyers",
    description: "Join our private cash buyer list. Get first look at off-market properties in Utah, Idaho, and Montana before they hit the MLS. Free — takes 2 minutes.",
    canonical: "https://revivebuyers.com/access-deals",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
      <Nav onHome={false} />

      {/* Hero */}
      <section className="py-24 md:py-32 bg-[#3D4145]">
        <div className="container max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 border border-white/20 text-[#3d8a55] text-[10px] font-semibold tracking-[0.2em] uppercase">
            <Eye size={11} />
            Exclusive · Off-Market · Cash Deals
          </div>
          <h1
            className="text-white leading-[1.1] mb-5"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500 }}
          >
            Access exclusive off-market
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>cash deals from Revive Buyers</em>
          </h1>
          <p className="text-white/65 text-lg font-light max-w-xl mx-auto mb-6">
            Join our private buyer list. Get first access to pre-listed properties in Utah, Idaho, and Montana — before they hit the MLS.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D6A3F]/15 border border-[#2D6A3F]/40 text-[#3d8a55] text-sm font-semibold tracking-wide">
            <span className="text-base">30–50%</span>
            <span className="text-white/70 font-normal">below market value</span>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-5 bg-white border-b border-[#3D4145]/08">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: <CheckCircle size={14} />, text: "500+ homes purchased" },
              { icon: <Star size={14} />, text: "4.9★ Google rating" },
              { icon: <MapPin size={14} />, text: "Local team — Salt Lake City" },
              { icon: <Users size={14} />, text: "Serious sellers only — no tire kickers" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#3D4145]/55 uppercase">
                <span className="text-[#2D6A3F]">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll get + Form */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-[360px_1fr] gap-12 items-start max-w-5xl mx-auto">
            {/* Left: what you get */}
            <div className="md:sticky md:top-24">
              <span className="green-rule" />
              <span className="section-label text-[#2D6A3F] block mb-3">What you'll get</span>
              <h2
                className="text-[#3D4145] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 500, lineHeight: 1.15 }}
              >
                First look at our
                <br />
                <em style={{ fontStyle: "italic", fontWeight: 300 }}>off-market pipeline.</em>
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: <Bell size={16} />, title: "Weekly deal alerts", desc: "Properties matched to your criteria, sent before they're listed anywhere else." },
                  { icon: <Eye size={16} />, title: "First look at our pipeline", desc: "See what we're under contract on and make an offer before we take it public." },
                  { icon: <FileText size={16} />, title: "Full property details", desc: "Address, photos, ARV estimates, and our acquisition cost — no guessing." },
                  { icon: <Users size={16} />, title: "Exclusive to cash-ready buyers", desc: "We only work with buyers who can close. Your competition is small and qualified." },
                ].map(({ icon, title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-[#2D6A3F]/10 flex items-center justify-center shrink-0 text-[#2D6A3F] mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#3D4145] mb-0.5">{title}</p>
                      <p className="text-xs text-[#3D4145]/55 font-light leading-relaxed">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="bg-white p-8 border border-[#3D4145]/10 shadow-sm">
              <h3
                className="text-[#3D4145] mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 500 }}
              >
                Join the buyer list
              </h3>
              <p className="text-[#3D4145]/50 text-sm font-light mb-6">
                Takes 2 minutes. Free. Deals start flowing when we have a match.
              </p>
              <BuyerForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
