/**
 * Site footer with brand, contact, quick links, and a Service Areas section
 * listing each of the 14 city landing pages.
 *
 * Mirrors the AHR Footer's "Areas We Serve" pattern: links route to
 * /sell-my-house-fast-:slug, where slug matches client/src/data/cities.ts.
 */
import LogoMark from "./LogoMark";
import { CITIES } from "@/data/cities";

export default function Footer() {
  return (
    <footer className="bg-[#2A2D30] py-14">
      <div className="container">
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1.2fr] gap-10 pb-10 border-b border-white/10">
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
              The smarter way to sell. We buy homes for cash across Utah, Idaho, Montana, Nevada,
              Arizona, and Colorado — fast, fair, and hassle-free.
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
                <a href="tel:8017832011" className="hover:text-white transition-colors">
                  (801) 783-2011
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
                Serving Utah · Idaho · Montana · Nevada · Arizona · Colorado
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-4">
              Quick Links
            </h4>
            <div className="space-y-2 text-white/45 text-xs">
              {[
                ["How It Works", "/#process"],
                ["Why Revive", "/#why"],
                ["Testimonials", "/#testimonials"],
                ["FAQ", "/#faq"],
                ["Get Cash Offer", "/#hero-form"],
              ].map(([label, href]) => (
                <div key={label}>
                  <a href={href} className="hover:text-white transition-colors">
                    {label}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas — one link per city landing page.
              Plain <a> on purpose: prior Wouter <Link> + literal-routes
              interaction was unreliable for footer clicks. Full-page
              navigation here is simpler + bulletproof; Vercel's SPA rewrite
              serves index.html on the new URL, the bundle re-mounts, and
              the literal Route matches cleanly. */}
          <div>
            <h4 className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-4">
              Areas We Serve
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-white/75 text-sm">
              {CITIES.map((c) => (
                <a
                  key={c.slug}
                  href={`/sell-my-house-fast-${c.slug}`}
                  className="hover:text-[#3d8a55] transition-colors leading-snug"
                >
                  {c.name}, {c.stateAbbr}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-white/25 text-xs">
          <p>© {new Date().getFullYear()} America Home Restoration LLC · All rights reserved.</p>
          <p>
            Revive Home Buyers is not a licensed real estate brokerage. We are a direct cash buyer.
          </p>
        </div>
      </div>
    </footer>
  );
}
