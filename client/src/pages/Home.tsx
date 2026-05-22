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
import { useReveal } from "@/hooks/useReveal";

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
          <span className="section-label text-[#2D6A3F] mb-4 block" style={{ color: "#3d8a55" }}>
            Cash Home Buyers
          </span>
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

// ─── Service Area Map (SVG) ───────────────────────────────────────────────────
// State paths derived from GeoJSON (PublicaMundi/MappingAPI), equirectangular projection
// ViewBox: 0 0 560 480, bounding box: lon [-120.50,-101.54], lat [30.83,49.50]
const STATE_PATHS = {
  MT: "M 471.3,31.8 L 471.5,58.6 L 471.3,103.8 L 471.5,126.1 L 471.0,126.1 L 420.1,126.0 L 333.3,126.0 L 279.2,126.0 L 279.3,138.4 L 274.4,136.0 L 270.0,131.8 L 263.7,136.7 L 258.1,137.6 L 256.8,136.3 L 250.3,137.4 L 246.6,136.2 L 240.3,138.3 L 231.7,138.2 L 228.9,140.3 L 225.7,139.1 L 222.1,131.4 L 216.4,131.2 L 213.2,129.2 L 213.4,124.7 L 210.1,123.0 L 205.6,118.3 L 202.9,113.8 L 203.6,111.8 L 198.7,109.5 L 196.0,112.1 L 189.2,115.3 L 183.3,112.9 L 184.7,110.3 L 182.7,107.8 L 187.7,105.2 L 184.8,101.6 L 185.6,96.1 L 189.5,87.3 L 181.5,87.4 L 181.2,85.9 L 174.0,83.4 L 172.8,80.8 L 162.6,74.5 L 162.0,72.8 L 156.4,71.8 L 151.2,69.0 L 151.0,62.5 L 142.2,55.9 L 142.2,31.8 L 266.9,31.9 L 323.0,31.8 L 471.3,31.8 Z",
  ID: "M 142.2,31.8 L 142.2,55.9 L 151.0,62.5 L 151.2,69.0 L 156.4,71.8 L 162.0,72.8 L 162.6,74.5 L 172.8,80.8 L 174.0,83.4 L 181.2,85.9 L 181.5,87.4 L 189.5,87.3 L 185.6,96.1 L 184.8,101.6 L 187.7,105.2 L 182.7,107.8 L 184.7,110.3 L 183.3,112.9 L 189.2,115.3 L 196.0,112.1 L 198.7,109.5 L 203.6,111.8 L 202.9,113.8 L 205.6,118.3 L 210.1,123.0 L 213.4,124.7 L 213.2,129.2 L 216.4,131.2 L 222.1,131.4 L 225.7,139.1 L 228.9,140.3 L 231.7,138.2 L 240.3,138.3 L 246.6,136.2 L 250.3,137.4 L 256.8,136.3 L 258.1,137.6 L 263.7,136.7 L 270.0,131.8 L 274.4,136.0 L 279.3,138.4 L 279.3,196.8 L 248.7,196.9 L 197.2,196.9 L 115.3,196.8 L 115.3,153.6 L 118.9,145.9 L 116.6,144.0 L 111.4,143.6 L 109.4,140.3 L 115.0,132.0 L 117.8,131.2 L 120.7,127.7 L 120.2,125.5 L 123.4,122.7 L 125.0,118.5 L 130.8,111.6 L 128.5,108.3 L 122.0,106.7 L 118.3,102.7 L 118.1,98.5 L 114.5,94.4 L 115.0,92.5 L 114.8,61.0 L 115.1,31.8 L 142.2,31.8 Z",
  UT: "M 248.7,196.9 L 279.3,196.8 L 279.3,220.4 L 334.2,220.4 L 334.0,264.5 L 333.9,284.5 L 334.3,287.1 L 334.3,314.6 L 294.3,314.5 L 197.0,314.6 L 197.2,196.9 L 248.7,196.9 Z",
  NV: "M 115.3,196.8 L 197.2,196.9 L 197.0,314.6 L 197.0,333.6 L 194.1,337.6 L 191.4,337.7 L 188.1,334.9 L 178.1,335.8 L 179.7,349.6 L 182.0,354.1 L 182.6,358.5 L 180.9,361.7 L 147.6,338.9 L 128.7,326.4 L 102.4,309.4 L 69.0,288.7 L 33.7,267.5 L 33.9,237.7 L 33.7,196.9 L 69.5,197.0 L 115.3,196.8 Z",
  AZ: "M 334.3,314.6 L 334.2,448.2 L 278.6,448.2 L 246.4,439.4 L 176.0,420.8 L 178.5,415.6 L 183.9,414.7 L 185.4,412.6 L 183.9,408.2 L 180.2,408.1 L 178.4,399.3 L 183.9,395.9 L 184.7,392.5 L 183.6,386.9 L 186.9,382.8 L 191.3,381.2 L 194.6,378.1 L 189.2,374.8 L 185.4,368.6 L 180.9,364.7 L 180.9,361.7 L 182.6,358.5 L 182.0,354.1 L 179.7,349.6 L 178.1,335.8 L 188.1,334.9 L 191.4,337.7 L 194.1,337.6 L 197.0,333.6 L 197.0,314.6 L 294.3,314.5 L 334.3,314.6 Z",
  CO: "M 365.1,220.2 L 425.2,220.4 L 471.2,220.2 L 526.0,220.2 L 526.0,243.9 L 526.3,314.7 L 500.0,314.6 L 463.3,314.7 L 393.9,314.7 L 378.8,314.6 L 334.3,314.6 L 334.3,287.1 L 333.9,284.5 L 334.0,264.5 L 334.2,220.4 L 365.1,220.2 Z",
};

function ServiceArea() {
  const cities = [
    { name: "Salt Lake City", state: "UT", x: 256.2, y: 226.0 },
    { name: "Provo", state: "UT", x: 262.6, y: 238.4 },
    { name: "Ogden", state: "UT", x: 254.0, y: 215.1 },
    { name: "Boise", state: "ID", x: 138.0, y: 158.7 },
    { name: "Idaho Falls", state: "ID", x: 252.3, y: 161.6 },
    { name: "Twin Falls", state: "ID", x: 185.7, y: 183.5 },
    { name: "Billings", state: "MT", x: 349.2, y: 107.6 },
    { name: "Missoula", state: "MT", x: 198.0, y: 81.9 },
    { name: "Great Falls", state: "MT", x: 272.4, y: 67.1 },
    { name: "Denver", state: "CO", x: 445.5, y: 250.1 },
    { name: "Las Vegas", state: "NV", x: 167.1, y: 334.1 },
    { name: "Reno", state: "NV", x: 38.9, y: 255.0 },
    { name: "Phoenix", state: "AZ", x: 251.2, y: 398.3 },
    { name: "Tucson", state: "AZ", x: 282.6, y: 427.2 },
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
              Our local team operates across Utah, Idaho, Montana, Nevada, Arizona, Colorado, Wyoming, and Texas — with deep knowledge of each market and relationships with local title companies for fast, smooth closings.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Utah", "Idaho", "Montana", "Nevada", "Arizona", "Colorado", "Wyoming", "Texas"].map((state) => (
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
                {/* Montana */}
                <path d={STATE_PATHS.MT} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="294.3" y="83.6" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">MONTANA</text>

                {/* Idaho */}
                <path d={STATE_PATHS.ID} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="184.6" y="137.9" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">IDAHO</text>

                {/* Utah */}
                <path d={STATE_PATHS.UT} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="248" y="262" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">UTAH</text>

                {/* Nevada */}
                <path d={STATE_PATHS.NV} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="129.8" y="255.7" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">NEVADA</text>

                {/* Arizona */}
                <path d={STATE_PATHS.AZ} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="255" y="390" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">ARIZONA</text>

                {/* Colorado */}
                <path d={STATE_PATHS.CO} fill="#2D6A3F" fillOpacity="0.15" stroke="#2D6A3F" strokeWidth="1" />
                <text x="431.5" y="267.5" textAnchor="middle" fill="#2D6A3F" fontSize="9" fontFamily="Outfit" fontWeight="600" letterSpacing="2">COLORADO</text>

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
      <TrustStrip />
      <Process />
      <WhyRevive />
      <Testimonials />
      <ServiceArea />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
