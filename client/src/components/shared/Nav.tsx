/**
 * Top navigation bar. Sticky, semi-transparent dark over hero, opaque on scroll.
 * Extracted from Home.tsx for reuse on city landing pages.
 *
 * On non-home pages, hash links point back to the homepage (e.g. /#process)
 * so users land in the right section.
 */
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
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
  const ctaHref = onHome ? "#hero-form" : "/#hero-form";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#3D4145]/95 backdrop-blur-sm shadow-lg" : "bg-[#3D4145]/70 backdrop-blur-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
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
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={hrefFor(l.anchor)}
              className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
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
