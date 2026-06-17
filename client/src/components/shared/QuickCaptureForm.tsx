/**
 * QuickCaptureForm — Tier 1 (interested) low-friction buyer capture.
 * Horizontal on desktop: [First Name] [Email] [Phone] [Get on List →]
 * Stacked on mobile.
 * Posts to buyers-create Edge Function with tier='interested'.
 */
import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { BUYERS_EDGE_FN, SUPABASE_ANON_KEY } from "@/lib/supabase";
import { getStoredGclid, getStoredUtms } from "@/lib/analytics";

export default function QuickCaptureForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !phone.trim()) return;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Enter a valid email.");
      return;
    }
    setLoading(true);
    setError("");
    // ─── Attribution payload (added 2026-06-17) ──────────────────────────────
    // Mirror the seller-side LeadForm pattern: pull GCLID + UTM params captured
    // at page load (analytics.ts persists them in localStorage on URL hit,
    // 90-day TTL) and include them in the POST. Without this the CRM has no
    // way to attribute a buyer signup back to the campaign/city/keyword that
    // produced it — Google Ads dashboard would still show conversions, but
    // per-city ROI inside crm/public.buyers would be invisible.
    const gclid = getStoredGclid();
    const utm = getStoredUtms();
    try {
      const res = await fetch(BUYERS_EDGE_FN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          tier: "interested",
          source: "homepage quick capture",
          gclid: gclid ?? undefined,
          utm_source: utm.utm_source,
          utm_medium: utm.utm_medium,
          utm_campaign: utm.utm_campaign,
          utm_content: utm.utm_content,
          utm_term: utm.utm_term,
          landing_page: typeof window !== "undefined" ? window.location.pathname : undefined,
          referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok && !json.duplicate) {
        setError(json.error ?? "Something went wrong — try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center justify-center gap-3 py-3">
        <div className="w-7 h-7 bg-[#2D6A3F] rounded-full flex items-center justify-center shrink-0">
          <CheckCircle className="text-white w-4 h-4" />
        </div>
        <p className="text-[#3D4145] text-sm font-light">
          <strong className="font-semibold">You're on the list.</strong>{" "}
          Check your inbox — we'll send your first deal alert when we have a match.
        </p>
      </div>
    );
  }

  const inputCls =
    "h-12 px-4 text-base bg-white border-2 border-[#3D4145]/20 text-[#3D4145] placeholder:text-[#3D4145]/40 outline-none focus:border-[#2D6A3F] transition-colors duration-150 w-full";

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          autoComplete="given-name"
          required
          className={`${inputCls} sm:w-40 shrink-0`}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="Email address"
          autoComplete="email"
          required
          className={`${inputCls} flex-1`}
        />
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
          required
          className={`${inputCls} sm:w-40 shrink-0`}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 px-6 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] transition-colors duration-150 flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Get on List <ArrowRight className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </form>
  );
}
