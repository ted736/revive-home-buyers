/**
 * REVIVE HOME BUYERS — Landing Page
 * Design: "Calm Authority" — Photography-forward editorial aesthetic
 * Palette: Off-white #F7F5F0, Charcoal #3D4145, Forest Green #2D6A3F
 * Fonts: Cormorant Garamond (display) + Outfit (body)
 * Sections: Nav, Hero, Trust Strip, 3-Step Process, Why Revive, Testimonials,
 *           Service Area Map, FAQ, Final CTA, Footer
 */

import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Phone,
  CheckCircle,
  Home as HomeIcon,
  Calendar,
  DollarSign,
  Users,
  Star,
  Menu,
  X,
  ChevronRight,
  MapPin,
} from "lucide-react";

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
const LOGO_URL = "/manus-storage/logo-white_5163d553.png";

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ─── Lead Form ────────────────────────────────────────────────────────────────
function LeadForm({ dark = false }: { dark?: boolean }) {
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={`flex items-center gap-3 py-4 ${dark ? "text-white" : "text-[#3D4145]"}`}
      >
        <CheckCircle className="text-[#2D6A3F] w-6 h-6 flex-shrink-0" />
        <p className="font-medium text-base">
          Thank you! We'll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your property address"
        className={`flex-1 h-12 text-base rounded-none border-0 border-b-2 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 ${
          dark
            ? "border-white/50 text-white placeholder:text-white/60 focus:border-white"
            : "border-[#3D4145]/30 text-[#3D4145] placeholder:text-[#3D4145]/50 focus:border-[#2D6A3F]"
        }`}
        required
      />
      <button
        type="submit"
        className="h-12 px-8 bg-[#2D6A3F] text-white text-sm font-semibold tracking-widest uppercase hover:bg-[#1F4D2E] active:scale-[0.97] transition-all duration-150 whitespace-nowrap"
      >
        Get Cash Offer
      </button>
    </form>
  );
}

// ─── Logo SVG Mark (inline, scalable) ────────────────────────────────────────
function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 48 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left peak */}
      <polyline points="2,40 16,6 24,22" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Right peak */}
      <polyline points="24,22 32,6 46,40" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      {/* Chimney on left peak */}
      <rect x="8" y="10" width="4" height="7" fill="white" />
      {/* 4-pane window */}
      <rect x="20" y="26" width="8" height="8" fill="#2D6A3F" />
      <line x1="24" y1="26" x2="24" y2="34" stroke="white" strokeWidth="1" />
      <line x1="20" y1="30" x2="28" y2="30" stroke="white" strokeWidth="1" />
    </svg>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "How It Works", href: "#process" },
    { label: "Why Revive", href: "#why" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#3D4145]/95 backdrop-blur-sm shadow-lg" : "bg-[#3D4145]/70 backdrop-blur-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <LogoMark size={36} />
          <div>
            <div className="text-white font-bold text-sm tracking-[0.2em] uppercase leading-none">
              Revive
            </div>
            <div className="text-white/70 text-[9px] tracking-[0.15em] uppercase leading-none mt-0.5">
              Home Buyers
            </div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Phone + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:8018349715"
            className="flex items-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">(801) 834-9715</span>
          </a>
          <a
            href="#hero-form"
            className="bg-[#2D6A3F] text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-[#1F4D2E] transition-colors duration-150"
          >
            Get Offer
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#3D4145] border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-white/80 text-sm py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="tel:8018349715"
            className="flex items-center gap-2 text-white/80 text-sm py-1"
          >
            <Phone className="w-4 h-4" />
            (801) 834-9715
          </a>
          <a
            href="#hero-form"
            className="bg-[#2D6A3F] text-white text-xs font-semibold tracking-widest uppercase px-5 py-3 text-center"
            onClick={() => setOpen(false)}
          >
            Get Cash Offer
          </a>
        </div>
      )}
    </nav>
  );
}

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

// ─── Trust Strip ──────────────────────────────────────────────────────────────
function TrustStrip() {
  const items = [
    { value: "500+", label: "Homes Purchased" },
    { value: "A+", label: "BBB Rating" },
    { value: "4.9★", label: "Google Reviews" },
    { value: "10+", label: "Years in Business" },
    { value: "7 Days", label: "Average Close" },
  ];

  return (
    <section className="bg-[#3D4145] py-6">
      <div className="container">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span
                className="text-white font-semibold text-xl leading-none"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem" }}
              >
                {item.value}
              </span>
              <span className="text-white/50 text-xs tracking-widest uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
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
// ViewBox: 0 0 500 400, bounding box: lon [-117.24,-104.04], lat [37.00,49.00]
const STATE_PATHS = {
  MT: "M 479.8,20.0 L 480.0,54.2 L 479.8,111.7 L 480.0,140.1 L 479.4,140.1 L 414.7,139.9 L 304.4,139.9 L 235.7,139.9 L 235.9,155.7 L 229.6,152.6 L 224.0,147.3 L 216.0,153.6 L 209.0,154.7 L 207.2,153.1 L 199.0,154.4 L 194.3,152.9 L 186.2,155.6 L 175.4,155.4 L 171.7,158.2 L 167.7,156.5 L 163.2,146.8 L 155.9,146.5 L 151.9,144.1 L 152.1,138.3 L 147.9,136.2 L 142.2,130.1 L 138.7,124.3 L 139.7,121.9 L 133.4,118.9 L 129.9,122.2 L 121.4,126.3 L 113.9,123.2 L 115.6,119.9 L 113.1,116.8 L 119.4,113.5 L 115.8,108.9 L 116.8,101.8 L 121.7,90.7 L 111.6,90.8 L 111.2,88.8 L 102.1,85.7 L 100.5,82.4 L 87.6,74.4 L 86.8,72.3 L 79.7,70.9 L 73.1,67.3 L 72.9,59.1 L 61.6,50.7 L 61.6,20.0 L 220.0,20.2 L 291.4,20.0 L 479.8,20.0 Z",
  ID: "M 61.6,20.0 L 61.6,50.7 L 72.9,59.1 L 73.1,67.3 L 79.7,70.9 L 86.8,72.3 L 87.6,74.4 L 100.5,82.4 L 102.1,85.7 L 111.2,88.8 L 111.6,90.8 L 121.7,90.7 L 116.8,101.8 L 115.8,108.9 L 119.4,113.5 L 113.1,116.8 L 115.6,119.9 L 113.9,123.2 L 121.4,126.3 L 129.9,122.2 L 133.4,118.9 L 139.7,121.9 L 138.7,124.3 L 142.2,130.1 L 147.9,136.2 L 152.1,138.3 L 151.9,144.1 L 155.9,146.5 L 163.2,146.8 L 167.7,156.5 L 171.7,158.2 L 175.4,155.4 L 186.2,155.6 L 194.3,152.9 L 199.0,154.4 L 207.2,153.1 L 209.0,154.7 L 216.0,153.6 L 224.0,147.3 L 229.6,152.6 L 235.9,155.7 L 235.9,230.0 L 196.9,230.2 L 131.5,230.2 L 27.4,230.0 L 27.4,175.1 L 32.0,165.2 L 29.2,162.8 L 22.5,162.3 L 20.0,158.2 L 27.1,147.5 L 30.7,146.5 L 34.3,142.1 L 33.7,139.3 L 37.8,135.7 L 39.9,130.4 L 47.1,121.5 L 44.2,117.4 L 36.0,115.3 L 31.3,110.2 L 31.1,104.9 L 26.5,99.7 L 27.1,97.2 L 26.9,57.1 L 27.3,20.0 L 61.6,20.0 Z",
  UT: "M 196.9,230.2 L 235.9,230.0 L 235.9,260.1 L 305.5,260.1 L 305.4,316.2 L 305.2,341.7 L 305.7,345.0 L 305.7,380.0 L 255.0,379.8 L 131.3,380.0 L 131.5,230.2 L 196.9,230.2 Z",
};

function ServiceArea() {
  const cities = [
    { name: "Salt Lake City", state: "UT", x: 206.4, y: 267.2 },
    { name: "Provo", state: "UT", x: 214.5, y: 283.0 },
    { name: "Ogden", state: "UT", x: 203.7, y: 253.3 },
    { name: "Boise", state: "ID", x: 56.3, y: 181.5 },
    { name: "Idaho Falls", state: "ID", x: 201.4, y: 185.2 },
    { name: "Twin Falls", state: "ID", x: 116.8, y: 213.1 },
    { name: "Billings", state: "MT", x: 324.5, y: 116.5 },
    { name: "Missoula", state: "MT", x: 132.5, y: 83.8 },
    { name: "Great Falls", state: "MT", x: 227.0, y: 65.0 },
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
                the Mountain West.
              </em>
            </h2>
            <p className="text-[#3D4145]/65 text-sm leading-relaxed font-light mb-8">
              Our local team operates across Utah, Idaho, and Montana — with
              deep knowledge of each market and relationships with local title
              companies for fast, smooth closings.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Utah", "Idaho", "Montana"].map((state) => (
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
                viewBox="0 0 500 400"
                className="w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Montana */}
                <path
                  d={STATE_PATHS.MT}
                  fill="#2D6A3F"
                  fillOpacity="0.15"
                  stroke="#2D6A3F"
                  strokeWidth="1"
                />
                <text x="254.9" y="86" textAnchor="middle" fill="#2D6A3F" fontSize="10" fontFamily="Outfit" fontWeight="600" letterSpacing="2">MONTANA</text>

                {/* Idaho */}
                <path
                  d={STATE_PATHS.ID}
                  fill="#2D6A3F"
                  fillOpacity="0.15"
                  stroke="#2D6A3F"
                  strokeWidth="1"
                />
                <text x="90" y="200" textAnchor="middle" fill="#2D6A3F" fontSize="10" fontFamily="Outfit" fontWeight="600" letterSpacing="2">IDAHO</text>

                {/* Utah */}
                <path
                  d={STATE_PATHS.UT}
                  fill="#2D6A3F"
                  fillOpacity="0.15"
                  stroke="#2D6A3F"
                  strokeWidth="1"
                />
                <text x="210" y="310" textAnchor="middle" fill="#2D6A3F" fontSize="10" fontFamily="Outfit" fontWeight="600" letterSpacing="2">UTAH</text>

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

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const faqs = [
    {
      q: "Will I get a fair price?",
      a: "Our offers are based on real comparable sales data and current market conditions — not a formula designed to lowball you. We're transparent about how we arrive at our number, and we'll walk you through it. Our goal is a deal that works for both of us.",
    },
    {
      q: "What if my house needs work?",
      a: "That's exactly why sellers come to us. We buy homes in any condition — foundation issues, outdated kitchens, deferred maintenance, fire damage, you name it. You don't fix a thing. We handle it after closing.",
    },
    {
      q: "How is this different from using a realtor?",
      a: "A realtor lists your home and waits for a buyer — which can take months, requires repairs and showings, and costs 5–6% in commissions. We buy directly, close fast, and charge zero fees. The tradeoff is our offer may be slightly below full retail — but many sellers find the certainty and savings more than make up for it.",
    },
    {
      q: "Are you investors or flippers?",
      a: "We're a local real estate investment company. We buy homes, renovate them, and either resell or hold them as rentals. We're transparent about this — we're not pretending to be something we're not. What we offer is speed, certainty, and zero hassle.",
    },
    {
      q: "What if I owe more than the house is worth?",
      a: "We can still help. We have experience with short sales and can work with your lender directly. Give us a call and we'll talk through your specific situation — there's no obligation.",
    },
    {
      q: "How fast can we close?",
      a: "As fast as 7 days from the time you accept our offer, depending on title work in your county. Most closings happen within 10–21 days. If you need more time, we can accommodate up to 30 days or more.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="container">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
          <div className="reveal">
            <span className="green-rule" />
            <span className="section-label">FAQ</span>
            <h2
              className="text-[#3D4145] mt-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.15,
              }}
            >
              Common
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>
                questions.
              </em>
            </h2>
            <p className="text-[#3D4145]/60 text-sm leading-relaxed font-light mt-4">
              Still have questions? Call us directly at{" "}
              <a
                href="tel:8018349715"
                className="text-[#2D6A3F] underline underline-offset-2"
              >
                (801) 834-9715
              </a>
              .
            </p>
          </div>

          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b border-[#3D4145]/10 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-[#3D4145] font-medium py-5 hover:no-underline hover:text-[#2D6A3F] transition-colors text-sm [&>svg]:text-[#2D6A3F]">
                    <span style={{ fontFamily: "'Outfit', sans-serif" }}>{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-[#3D4145]/65 text-sm leading-relaxed font-light pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
              href="tel:8018349715"
              className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
            >
              (801) 834-9715
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#2A2D30] py-14">
      <div className="container">
        <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <LogoMark size={32} />
              <div>
                <div className="text-white font-bold text-sm tracking-[0.2em] uppercase leading-none">
                  Revive
                </div>
                <div className="text-white/50 text-[9px] tracking-[0.15em] uppercase leading-none mt-0.5">
                  Home Buyers
                </div>
              </div>
            </div>
            <p className="text-white/45 text-xs leading-relaxed font-light max-w-xs">
              The smarter way to sell. We buy homes for cash across Utah, Idaho,
              and Montana — fast, fair, and hassle-free.
            </p>
            <p className="text-white/30 text-xs mt-4">
              Licensed Real Estate Investor · America Home Restoration LLC
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-white/45 text-xs">
              <div>
                <a
                  href="tel:8018349715"
                  className="hover:text-white transition-colors"
                >
                  (801) 834-9715
                </a>
              </div>
              <div>
                <a
                  href="mailto:info@revivehomebuyers.com"
                  className="hover:text-white transition-colors"
                >
                  info@revivehomebuyers.com
                </a>
              </div>
              <div className="pt-2 leading-relaxed">
                Serving Utah · Idaho · Montana
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <div className="space-y-2 text-white/45 text-xs">
              {[
                ["How It Works", "#process"],
                ["Why Revive", "#why"],
                ["Testimonials", "#testimonials"],
                ["FAQ", "#faq"],
                ["Get Cash Offer", "#hero-form"],
              ].map(([label, href]) => (
                <div key={label}>
                  <a href={href} className="hover:text-white transition-colors">
                    {label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-white/25 text-xs">
          <p>© {new Date().getFullYear()} America Home Restoration LLC · All rights reserved.</p>
          <p>
            Revive Home Buyers is not a licensed real estate brokerage. We are
            a direct cash buyer.
          </p>
        </div>
      </div>
    </footer>
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
