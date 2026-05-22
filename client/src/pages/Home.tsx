/**
 * REVIVE HOME BUYERS — Landing Page
 * Design: "Calm Authority" — Photography-forward editorial aesthetic
 * Palette: Off-white #F7F5F0, Charcoal #3D4145, Forest Green #2D6A3F
 * Fonts: Cormorant Garamond (display) + Outfit (body)
 * Sections: Nav, Hero, Trust Strip, 3-Step Process, Why Revive, Testimonials,
 *           Service Area Map, FAQ, Final CTA, Footer
 *
 * Nav / Footer / TrustStrip / FAQ / LeadForm live in components/shared/
 * so the city landing pages can share them.
 */

import {
  Home as HomeIcon,
  Calendar,
  DollarSign,
  Users,
  Star,
  MapPin,
} from "lucide-react";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import TrustStrip from "@/components/shared/TrustStrip";
import FAQ from "@/components/shared/FAQ";
import LeadForm from "@/components/shared/LeadForm";
import QuickCaptureForm from "@/components/shared/QuickCaptureForm";
import { useReveal } from "@/hooks/useReveal";
import { Link } from "wouter";

// ─── Asset URLs ──────────────────────────────────────────────────────────────
const HERO_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/hero-home-jBz6RHRR8Wk4ds9shb6M9f.png";
const CTA_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/cta-bg-GaREANhVxNmfArvC8TB8qL.png";
const T1_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/testimonial-1-fHCBXd9h2RqYBCc4ANfepM.png";
const T2_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/testimonial-2-Rn92DvP4tZtojhvYqdSDwm.png";
const T3_IMG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663302016813/QyqrbgfqY69HNHAj7ykVt6/testimonial-3-HP5NPHPffiZmmJCcMYGMqA.png";

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      />
      {/* Gradient overlay — dark on left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3D4145]/85 via-[#3D4145]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3D4145]/40 via-transparent to-transparent" />

      <div className="relative container pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-2xl">
          {/* Cash Home Buyers — elevated eyebrow label */}
          <div className="inline-flex items-center gap-2 mb-5">
            <span
              className="inline-block px-3 py-1 text-xs font-bold tracking-[0.22em] uppercase"
              style={{
                backgroundColor: "#2D6A3F",
                color: "#ffffff",
                letterSpacing: "0.2em",
              }}
            >
              Cash Home Buyers
            </span>
          </div>
          <h1
            className="text-white leading-[1.05] mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              fontWeight: 500,
            }}
          >
            Sell Your Home
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>
              with Confidence.
            </em>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg font-light">
            Cash offer in 24 hours. Close in as few as 7 days. No repairs,
            no fees, no uncertainty — just a fair offer from a local team
            you can actually meet.
          </p>
          <div id="hero-form">
            <LeadForm dark />
          </div>
          <p className="text-white/50 text-xs mt-4 tracking-wide">
            No obligation · No fees · 100% confidential
          </p>
          <p className="text-white/40 text-xs mt-3 tracking-wide">
            Cash buyer?{" "}
            <a href="#cash-buyers" className="text-[#3d8a55] hover:text-white underline underline-offset-2 transition-colors">
              Get off-market deal alerts →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Buyer Email Capture Band ─────────────────────────────────────────────────
function BuyerEmailCapture() {
  return (
    <section id="cash-buyers" className="py-10 md:py-12 bg-[#2D6A3F]">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
          <div className="shrink-0 md:max-w-xs">
            <p className="text-white/70 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
              For Cash Buyers
            </p>
            <p className="text-white font-bold text-xl leading-snug mb-1">
              Get Off-Market Deal Alerts.
            </p>
            <p className="text-white/70 text-sm font-light">
              Exclusive properties before they hit the MLS — sent directly to your inbox.
            </p>
            <a
              href="/deals"
              className="inline-flex items-center gap-1.5 mt-3 text-white/80 hover:text-white text-xs font-semibold tracking-widest uppercase underline underline-offset-4 transition-colors"
            >
              View Full Buyer Portal →
            </a>
          </div>
          <div className="flex-1">
            <QuickCaptureForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3-Step Process ───────────────────────────────────────────────────────────
function Process() {
  const steps = [
    {
      num: "01",
      title: "Tell Us About Your Home",
      desc: "Enter your address and answer a few quick questions. No showings, no open houses, no strangers walking through.",
    },
    {
      num: "02",
      title: "Receive a Fair Cash Offer",
      desc: "We'll review your property and send a no-obligation cash offer within 24 hours — based on real market data, not lowball guesses.",
    },
    {
      num: "03",
      title: "You Choose the Closing Date",
      desc: "Close in as few as 7 days or take up to 30. We work around your schedule, not ours.",
    },
  ];

  return (
    <section id="process" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container">
        <div className="mb-16 reveal">
          <span className="green-rule" />
          <span className="section-label">How It Works</span>
          <h2
            className="text-[#3D4145] mt-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            Three steps to your
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>
              cash offer.
            </em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div
                className="text-[#EDE9E1] font-bold leading-none mb-4 select-none"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "5rem",
                  lineHeight: 1,
                }}
              >
                {step.num}
              </div>
              <div className="w-8 h-px bg-[#2D6A3F] mb-4" />
              <h3
                className="text-[#3D4145] mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                }}
              >
                {step.title}
              </h3>
              <p className="text-[#3D4145]/65 text-sm leading-relaxed font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Revive ───────────────────────────────────────────────────────────────
function WhyRevive() {
  const reasons = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "No Fees or Commissions",
      desc: "You keep every dollar of your offer. No agent commissions, no closing costs, no hidden fees — ever.",
    },
    {
      icon: <HomeIcon className="w-5 h-5" />,
      title: "No Repairs Needed",
      desc: "Sell as-is. We buy homes in any condition — no cleaning, no staging, no fixing anything.",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Pick Your Close Date",
      desc: "Need to close fast? Done. Need a few weeks to move? No problem. You set the timeline.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Local Team You Can Meet",
      desc: "We're not a national algorithm. We're a local team based in the West — you can meet us in person.",
    },
  ];

  return (
    <section id="why" className="py-24 md:py-32 bg-[#3D4145]">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: heading */}
          <div className="reveal">
            <span className="green-rule" style={{ backgroundColor: "#3d8a55" }} />
            <span className="section-label" style={{ color: "#3d8a55" }}>
              Why Revive
            </span>
            <h2
              className="text-white mt-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
              }}
            >
              Different from every
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>
                other cash buyer.
              </em>
            </h2>
            <p className="text-white/60 mt-6 text-sm leading-relaxed font-light max-w-sm">
              The cash-buying industry has a reputation problem. We built
              Revive to be the exception — transparent, local, and fair.
            </p>
          </div>

          {/* Right: reasons grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {reasons.map((r, i) => (
              <div
                key={i}
                className="reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="w-10 h-10 border border-[#2D6A3F] flex items-center justify-center text-[#2D6A3F] mb-4">
                  {r.icon}
                </div>
                <h3
                  className="text-white mb-2"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.15rem",
                    fontWeight: 500,
                  }}
                >
                  {r.title}
                </h3>
                <p className="text-white/55 text-sm leading-relaxed font-light">
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    {
      img: T1_IMG,
      name: "Karen M.",
      location: "Ogden, UT",
      stars: 5,
      quote:
        "Inherited my mom's house after she passed and had no idea what to do with it. Revive made the whole thing simple — they explained everything clearly, didn't pressure me, and closed in 14 days. They paid $12k more than the other cash buyer who lowballed me.",
    },
    {
      img: T2_IMG,
      name: "Dale H.",
      location: "Boise, ID",
      stars: 5,
      quote:
        "I was behind on payments and facing foreclosure. Called Revive on a Tuesday, had a cash offer by Wednesday morning, and closed before the bank could act. These guys saved my credit. I can't say enough good things.",
    },
    {
      img: T3_IMG,
      name: "Melissa R.",
      location: "Billings, MT",
      stars: 5,
      quote:
        "Relocating for work with a tight timeline. My house needed a new roof and I didn't have time or money to fix it. Revive bought it as-is, let me pick my closing date, and the whole process took 18 days. Exactly what they promised.",
    },
  ];

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container">
        <div className="mb-16 reveal">
          <span className="green-rule" />
          <span className="section-label">Testimonials</span>
          <h2
            className="text-[#3D4145] mt-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1.15,
            }}
          >
            Real sellers,
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>
              real results.
            </em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-8 reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 fill-[#2D6A3F] text-[#2D6A3F]"
                  />
                ))}
              </div>
              <p className="text-[#3D4145]/75 text-sm leading-relaxed mb-6 font-light italic">
                "{r.quote}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[#EDE9E1]">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-[#3D4145] text-sm font-semibold">
                    {r.name}
                  </div>
                  <div className="text-[#3D4145]/50 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {r.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Recent Cash Offers ──────────────────────────────────────────────────────
// Privacy: addresses intentionally omitted. Show property type + city/state only.
// ARV is optional — surface a range when we have one; otherwise leave blank.
const RECENT_OFFERS = [
  { propertyType: "Single-family residence", city: "West Valley City", state: "UT", arv: "" },
  { propertyType: "Single-family residence", city: "Rupert", state: "ID", arv: "" },
  { propertyType: "Single-family residence", city: "Kalispell", state: "MT", arv: "" },
  { propertyType: "Single-family residence", city: "Sandpoint", state: "ID", arv: "" },
  { propertyType: "Single-family residence", city: "Roosevelt", state: "UT", arv: "" },
  { propertyType: "Single-family residence", city: "Polson", state: "MT", arv: "" },
  { propertyType: "Single-family residence", city: "Caldwell", state: "ID", arv: "" },
  { propertyType: "Single-family residence", city: "Elk Ridge", state: "UT", arv: "" },
];

function RecentOffers() {
  return (
    <section className="py-20 md:py-24 bg-[#3D4145] overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 reveal">
          <div>
            <span className="green-rule" />
            <span className="section-label" style={{ color: "#3d8a55" }}>
              Recent Cash Purchases
            </span>
            <h2
              className="text-white mt-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
                fontWeight: 500,
                lineHeight: 1.15,
              }}
            >
              Homes we've recently
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>
                purchased across the region.
              </em>
            </h2>
          </div>
          <p className="text-white/45 text-sm font-light max-w-xs leading-relaxed md:pb-1">
            Real properties, real sellers — closed for cash, as-is, on their
            timeline.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 reveal" style={{ transitionDelay: "80ms" }}>
          {RECENT_OFFERS.map(({ propertyType, city, state, arv }, idx) => (
            <div
              key={`${city}-${state}-${idx}`}
              className="bg-white/05 border border-white/10 px-4 py-3 hover:border-[#2D6A3F]/50 hover:bg-white/08 transition-colors duration-150"
            >
              <div
                className="text-[#2D6A3F] text-[10px] font-semibold tracking-[0.18em] uppercase mb-1"
              >
                Cash Offer Accepted
              </div>
              <div className="text-white/85 text-sm font-medium leading-tight">
                {propertyType}
              </div>
              <div className="text-white/40 text-xs mt-0.5">
                {city}, {state}
              </div>
              {arv && (
                <div className="text-[#2D6A3F]/80 text-xs mt-1 font-medium">
                  ARV {arv}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-white/10 reveal" style={{ transitionDelay: "140ms" }}>
          <p className="text-white/35 text-xs tracking-wide">
            Property details shown with seller permission · Updated periodically
          </p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 h-10 bg-[#2D6A3F] text-white text-xs font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] transition-colors duration-150 shrink-0"
          >
            Want to see more? Join our buyer list →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Service Area Map (SVG) ───────────────────────────────────────────────────
// State paths generated from US Census Bureau TIGER GeoJSON via PublicaMundi/MappingAPI
// Equirectangular projection — ViewBox: 0 0 560 480
// Bounding box: lon [-120.00, -102.04], lat [31.33, 49.00]
const STATE_PATHS = {
  MT: "M 482.0,20.0 L 482.1,48.4 L 482.0,96.1 L 482.1,119.7 L 481.6,119.7 L 427.9,119.6 L 336.2,119.6 L 279.1,119.6 L 279.3,132.7 L 274.1,130.1 L 269.5,125.7 L 262.8,130.9 L 256.9,131.8 L 255.5,130.5 L 248.7,131.6 L 244.7,130.3 L 238.1,132.5 L 229.0,132.4 L 226.0,134.7 L 222.7,133.3 L 218.9,125.3 L 212.8,125.0 L 209.5,123.0 L 209.7,118.2 L 206.2,116.4 L 201.4,111.4 L 198.6,106.6 L 199.4,104.6 L 194.1,102.1 L 191.3,104.8 L 184.1,108.2 L 178.0,105.7 L 179.4,102.9 L 177.3,100.3 L 182.5,97.6 L 179.5,93.8 L 180.3,87.9 L 184.5,78.6 L 176.0,78.8 L 175.7,77.1 L 168.1,74.6 L 166.8,71.8 L 156.1,65.1 L 155.4,63.4 L 149.6,62.3 L 144.0,59.3 L 143.9,52.5 L 134.5,45.5 L 134.5,20.0 L 266.1,20.1 L 325.4,20.0 L 482.0,20.0 Z",
  ID: "M 134.5,20.0 L 134.5,45.5 L 143.9,52.5 L 144.0,59.3 L 149.6,62.3 L 155.4,63.4 L 156.1,65.1 L 166.8,71.8 L 168.1,74.6 L 175.7,77.1 L 176.0,78.8 L 184.5,78.6 L 180.3,87.9 L 179.5,93.8 L 182.5,97.6 L 177.3,100.3 L 179.4,102.9 L 178.0,105.7 L 184.1,108.2 L 191.3,104.8 L 194.1,102.1 L 199.4,104.6 L 198.6,106.6 L 201.4,111.4 L 206.2,116.4 L 209.7,118.2 L 209.5,123.0 L 212.8,125.0 L 218.9,125.3 L 222.7,133.3 L 226.0,134.7 L 229.0,132.4 L 238.1,132.5 L 244.7,130.3 L 248.7,131.6 L 255.5,130.5 L 256.9,131.8 L 262.8,130.9 L 269.5,125.7 L 274.1,130.1 L 279.3,132.7 L 279.3,194.3 L 246.9,194.4 L 192.5,194.4 L 106.1,194.3 L 106.1,148.8 L 109.9,140.6 L 107.5,138.5 L 102.0,138.1 L 99.9,134.7 L 105.8,125.8 L 108.8,125.0 L 111.8,121.3 L 111.3,119.0 L 114.7,116.0 L 116.4,111.7 L 122.4,104.3 L 120.1,100.9 L 113.2,99.1 L 109.3,94.9 L 109.1,90.5 L 105.3,86.2 L 105.8,84.1 L 105.6,50.8 L 106.0,20.0 L 134.5,20.0 Z",
  UT: "M 246.9,194.4 L 279.3,194.3 L 279.3,219.3 L 337.2,219.3 L 337.0,265.9 L 336.9,287.1 L 337.3,289.8 L 337.3,318.8 L 295.1,318.7 L 192.4,318.8 L 192.5,194.4 L 246.9,194.4 Z",
  NV: "M 106.1,194.3 L 192.5,194.4 L 192.4,318.8 L 192.4,338.9 L 189.4,343.1 L 186.5,343.2 L 183.0,340.2 L 172.4,341.2 L 174.1,355.8 L 176.5,360.6 L 177.2,365.2 L 175.4,368.6 L 140.2,344.5 L 120.2,331.2 L 92.5,313.4 L 57.3,291.4 L 20.0,269.1 L 20.2,237.5 L 20.0,194.4 L 57.7,194.6 L 106.1,194.3 Z",
  AZ: "M 337.3,318.8 L 337.2,460.0 L 278.5,460.0 L 244.6,450.7 L 170.2,431.1 L 172.9,425.5 L 178.6,424.5 L 180.2,422.4 L 178.6,417.7 L 174.6,417.6 L 172.7,408.3 L 178.6,404.8 L 179.4,401.1 L 178.3,395.2 L 181.8,390.8 L 186.4,389.2 L 189.8,385.9 L 184.1,382.4 L 180.2,375.8 L 175.4,371.8 L 175.4,368.6 L 177.2,365.2 L 176.5,360.6 L 174.1,355.8 L 172.4,341.2 L 183.0,340.2 L 186.5,343.2 L 189.4,343.1 L 192.4,338.9 L 192.4,318.8 L 295.1,318.7 L 337.3,318.8 Z",
  CO: "M 369.8,219.1 L 433.3,219.3 L 481.8,219.1 L 539.7,219.1 L 539.7,244.1 L 540.0,319.0 L 512.2,318.8 L 473.6,319.0 L 400.3,319.0 L 384.3,318.8 L 337.3,318.8 L 337.3,289.8 L 336.9,287.1 L 337.0,265.9 L 337.2,219.3 L 369.8,219.1 Z",
};

function ServiceArea() {
  // City dot coordinates projected from real lon/lat using the same equirectangular
  // projection as STATE_PATHS above (lon [-120.00,-102.04], lat [31.33,49.00], 560×480 viewBox)
  const cities = [
    { name: "Salt Lake City", state: "UT", x: 254.9, y: 225.2 },
    { name: "Provo",          state: "UT", x: 261.6, y: 238.3 },
    { name: "Ogden",          state: "UT", x: 252.4, y: 213.7 },
    { name: "Boise",          state: "ID", x: 130.0, y: 154.1 },
    { name: "Idaho Falls",    state: "ID", x: 250.7, y: 157.2 },
    { name: "Twin Falls",     state: "ID", x: 180.4, y: 180.3 },
    { name: "Billings",       state: "MT", x: 353.0, y: 100.1 },
    { name: "Missoula",       state: "MT", x: 194.0, y: 73.0  },
    { name: "Great Falls",    state: "MT", x: 272.0, y: 57.4  },
    { name: "Denver",         state: "CO", x: 454.7, y: 250.6 },
    { name: "Las Vegas",      state: "NV", x: 160.9, y: 339.4 },
    { name: "Reno",           state: "NV", x: 25.5,  y: 255.9 },
    { name: "Phoenix",        state: "AZ", x: 249.6, y: 407.3 },
    { name: "Tucson",         state: "AZ", x: 282.8, y: 437.8 },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#EDE9E1]">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="green-rule" />
            <span className="section-label">Service Area</span>
            <h2
              className="text-[#3D4145] mt-3 mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
              }}
            >
              We buy homes across
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>
                the West.
              </em>
            </h2>
            <p className="text-[#3D4145]/65 text-sm leading-relaxed font-light mb-8">
              Our local team operates across Utah, Idaho, Montana, Nevada, Arizona, and Colorado — with deep knowledge of each market and relationships with local title companies for fast, smooth closings.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Utah", "Idaho", "Montana", "Nevada", "Arizona", "Colorado"].map((state) => (
                <span
                  key={state}
                  className="border border-[#2D6A3F] text-[#2D6A3F] text-xs font-semibold tracking-widest uppercase px-4 py-2"
                >
                  {state}
                </span>
              ))}
            </div>
          </div>

          {/* SVG Map — geographically accurate paths from GeoJSON */}
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <div className="relative bg-[#F7F5F0] p-4 shadow-sm">
              <svg
                viewBox="0 0 560 480"
                className="w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Montana — label centroid: x=308.3, y=77.4 */}
                <path d={STATE_PATHS.MT} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="308.3" y="77.4" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">MONTANA</text>

                {/* Idaho — label centroid: x=189.6, y=107.2 */}
                <path d={STATE_PATHS.ID} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="189.6" y="107.2" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">IDAHO</text>

                {/* Utah — label centroid: x=264.9, y=256.6 */}
                <path d={STATE_PATHS.UT} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="264.9" y="256.6" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">UTAH</text>

                {/* Nevada — label centroid: x=106.3, y=281.5 */}
                <path d={STATE_PATHS.NV} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="106.3" y="281.5" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">NEVADA</text>

                {/* Arizona — label centroid: x=253.8, y=389.3 */}
                <path d={STATE_PATHS.AZ} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="253.8" y="389.3" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">ARIZONA</text>

                {/* Colorado — label centroid: x=438.4, y=269.1 */}
                <path d={STATE_PATHS.CO} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="438.4" y="269.1" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">COLORADO</text>

                {/* City dots */}
                {cities.map((city) => (
                  <g key={city.name}>
                    <circle cx={city.x} cy={city.y} r="3.5" fill="#2D6A3F" />
                    <circle cx={city.x} cy={city.y} r="6.5" fill="#2D6A3F" fillOpacity="0.2" />
                    <text
                      x={city.x + 9}
                      y={city.y + 3.5}
                      fill="#3D4145"
                      fontSize="7.5"
                      fontFamily="Outfit"
                      fontWeight="500"
                    >
                      {city.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${CTA_BG})` }}
      />
      <div className="absolute inset-0 bg-[#3D4145]/80" />
      <div className="relative container text-center">
        <div className="max-w-2xl mx-auto reveal">
          <span className="green-rule mx-auto" style={{ backgroundColor: "#3d8a55" }} />
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 500,
              lineHeight: 1.1,
            }}
          >
            Get your no-obligation
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 300 }}>
              cash offer in 24 hours.
            </em>
          </h2>
          <p className="text-white/65 text-sm mb-10 font-light">
            No repairs. No fees. No pressure. Just a fair offer from a local team.
          </p>
          <div className="flex justify-center">
            <LeadForm dark />
          </div>
          <p className="text-white/40 text-xs mt-5 tracking-wide">
            Or call us directly:{" "}
            <a
              href="tel:8017832011"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              (801) 783-2011
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  useReveal();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
      <Nav />
      <Hero />
      <BuyerEmailCapture />
      <TrustStrip />
      <Process />
      <WhyRevive />
      <Testimonials />
      <RecentOffers />
      <ServiceArea />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
