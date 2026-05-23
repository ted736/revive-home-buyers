import { useEffect, useState } from "react";
import { Phone, Menu, X, Tag, Hammer } from "lucide-react";
import LogoMark from "./LogoMark";

const NAV_LINKS = [
  { label: "How It Works", anchor: "#process" },
  { label: "Why Revive", anchor: "#why" },
  { label: "Testimonials", anchor: "#testimonials" },
  { label: "FAQ", anchor: "#faq" },
];

export default function Nav({ onHome = true }: { onHome?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Hash links resolve to /#anchor when not on the homepage, so they actually navigate.
  const hrefFor = (anchor: string) => (onHome ? anchor : `/${anchor}`);
  // City pages have their own #hero-form, so always scroll to the local form.
  // Only the homepage needs to navigate to itself first.
  const ctaHref = "#hero-form";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#3D4145]/95 backdrop-blur-sm shadow-lg" : "bg-[#3D4145]/70 backdrop-blur-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 shrink-0">
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
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={hrefFor(l.anchor)}
              className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}

          {/* Our Projects */}
          <a
            href="/our-projects"
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold tracking-widest uppercase transition-colors duration-150"
          >
            <Hammer className="w-3 h-3" />
            Our Work
          </a>

          {/* Cash Buyers — distinct pill treatment */}
          <a
            href="/deals"
            className="flex items-center gap-1.5 border border-[#2D6A3F] text-[#3d8a55] hover:bg-[#2D6A3F] hover:text-white text-xs font-semibold tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
          >
            <Tag className="w-3 h-3" />
            Cash Buyers
          </a>
        </div>

        {/* Phone + CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:8017832011"
            className="flex items-center gap-2 text-white/90 hover:text-white text-sm transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="font-medium">(801) 783-2011</span>
          </a>
          <a
            href={ctaHref}
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={hrefFor(l.anchor)}
              className="text-white/80 text-sm py-1"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}

          {/* Our Projects — mobile */}
          <a
            href="/our-projects"
            className="flex items-center gap-2 text-white/70 text-sm font-semibold py-1"
            onClick={() => setOpen(false)}
          >
            <Hammer className="w-4 h-4" />
            Our Work
          </a>

          {/* Cash Buyers — highlighted row in mobile menu */}
          <a
            href="/deals"
            className="flex items-center gap-2 border border-[#2D6A3F] text-[#3d8a55] text-sm font-semibold py-2 px-3"
            onClick={() => setOpen(false)}
          >
            <Tag className="w-4 h-4" />
            Cash Buyers — Off-Market Deals
          </a>

          <a href="tel:8017832011" className="flex items-center gap-2 text-white/80 text-sm py-1">
            <Phone className="w-4 h-4" />
            (801) 783-2011
          </a>
          <a
            href={ctaHref}
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
