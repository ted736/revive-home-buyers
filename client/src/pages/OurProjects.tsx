import { useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import { useSeo } from "@/hooks/useSeo";
import { PROJECTS, SCOPE_FILTERS, STATE_FILTERS, type Project } from "@/data/projects";
import { ArrowRight, MapPin, TrendingUp, CheckCircle, Building2 } from "lucide-react";

// ─── Before/After Slider ──────────────────────────────────────────────────────
function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-col-resize group"
      onMouseDown={(e) => { dragging.current = true; updatePos(e.clientX); }}
      onMouseMove={(e) => { if (dragging.current) updatePos(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchStart={(e) => { dragging.current = true; updatePos(e.touches[0].clientX); }}
      onTouchMove={(e) => { if (dragging.current) updatePos(e.touches[0].clientX); }}
      onTouchEnd={() => { dragging.current = false; }}
    >
      {/* After (base) */}
      <img src={after} alt="After renovation" className="absolute inset-0 w-full h-full object-cover" />
      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before renovation" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} />
      </div>
      {/* Divider */}
      <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-[#3D4145]/60" />
            <div className="w-0.5 h-4 bg-[#3D4145]/60" />
          </div>
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-2 bg-[#3D4145]/70 text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-1">Before</span>
      <span className="absolute top-2 right-2 bg-[#2D6A3F]/80 text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-1">After</span>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasAfter = project.after_photo_urls.length > 0;
  const hasBefore = project.before_photo_urls.length > 0;
  const showSlider = project.display_mode === "before_after" && hasAfter && hasBefore;
  const primaryImg = hasAfter ? project.after_photo_urls[imgIdx] : null;

  const arvFormatted = project.arv
    ? `$${(project.arv / 1000).toFixed(0)}K`
    : null;

  const velocityStat = project.days_to_sell
    ? `Sold in ${project.days_to_sell} days${project.offer_count ? ` · ${project.offer_count} offers` : ""}`
    : null;

  return (
    <Link href={`/our-projects/${project.slug}`}>
      <article className="group cursor-pointer bg-white border border-[#3D4145]/10 hover:border-[#2D6A3F]/40 hover:shadow-lg transition-all duration-300">
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#3D4145]/10">
          {showSlider ? (
            <BeforeAfterSlider before={project.before_photo_urls[0]} after={project.after_photo_urls[0]} />
          ) : primaryImg ? (
            <>
              <img
                src={primaryImg}
                alt={`${project.city}, ${project.state} — ${project.scope_summary}`}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {/* Thumbnail strip if multiple after photos */}
              {project.after_photo_urls.length > 1 && (
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {project.after_photo_urls.slice(0, 5).map((_, i) => (
                    <button
                      key={i}
                      className={`w-5 h-1 transition-all duration-150 ${i === imgIdx ? "bg-white" : "bg-white/40"}`}
                      onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-[#3D4145]/20" />
              <span className="sr-only">Photos coming soon</span>
            </div>
          )}

          {/* Velocity badge */}
          {velocityStat && (
            <div className="absolute top-2 right-2 bg-[#2D6A3F] text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-1 shadow">
              {velocityStat}
            </div>
          )}

          {/* Wholesale badge */}
          {project.project_type === "ahr_wholesale_to_investor" && (
            <div className="absolute top-2 left-2 bg-[#3D4145]/80 text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-1">
              Wholesale
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[#3D4145]/50 text-xs mb-1">
                <MapPin className="w-3 h-3" />
                <span>{project.city}, {project.state}</span>
                <span className="text-[#3D4145]/30">·</span>
                <span>{project.year_completed}</span>
              </div>
              <p className="text-[#3D4145] text-sm font-medium leading-snug line-clamp-2">
                {project.scope_summary}
              </p>
            </div>
            {arvFormatted && (
              <div className="shrink-0 text-right">
                <div className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/40 mb-0.5">ARV</div>
                <div className="text-[#2D6A3F] font-semibold text-sm">{arvFormatted}</div>
              </div>
            )}
          </div>

          {/* Scope tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.scope_tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[9px] font-semibold tracking-widest uppercase bg-[#F7F5F0] text-[#3D4145]/60 px-2 py-0.5">
                {tag}
              </span>
            ))}
            {project.scope_tags.length > 4 && (
              <span className="text-[9px] text-[#3D4145]/40">+{project.scope_tags.length - 4}</span>
            )}
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between border-t border-[#3D4145]/8 pt-3">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#2D6A3F] group-hover:gap-2 flex items-center gap-1 transition-all duration-150">
              View Project <ArrowRight className="w-3 h-3" />
            </span>
            {project.was_code_violation && (
              <span className="flex items-center gap-1 text-[9px] text-[#3D4145]/40">
                <CheckCircle className="w-3 h-3 text-[#2D6A3F]" />
                Code violation resolved
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Aggregate Stats ──────────────────────────────────────────────────────────
function ImpactStrip() {
  const visible = PROJECTS.filter((p) => p.status !== "wip");
  const totalArv = visible.reduce((s, p) => s + (p.arv ?? 0), 0);
  const cities = new Set(visible.map((p) => p.city)).size;
  const codeViolations = visible.filter((p) => p.was_code_violation).length;

  return (
    <div className="bg-[#2D6A3F] text-white py-8">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${visible.length}+`, label: "Properties Restored" },
            { value: `$${(totalArv / 1_000_000).toFixed(1)}M`, label: "In Restored Value" },
            { value: `${cities}`, label: "Cities Served" },
            { value: `${codeViolations}`, label: "Code Violations Resolved" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="font-bold text-3xl md:text-4xl mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {value}
              </div>
              <div className="text-white/65 text-xs font-semibold tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OurProjects() {
  useSeo({
    title: "Our Projects — Revive Home Buyers | Before & After Gallery",
    description: "See the homes we've restored across Utah, Idaho, and Montana. Before & after transformations, real project stories, and community impact from every Revive fix-flip.",
    canonical: "https://revivebuyers.com/our-projects",
  });

  const [stateFilter, setStateFilter] = useState<string | null>(null);
  const [scopeFilter, setScopeFilter] = useState<string | null>(null);

  const filtered = PROJECTS.filter((p) => {
    if (stateFilter && p.state !== stateFilter) return false;
    if (scopeFilter && !p.scope_tags.includes(scopeFilter)) return false;
    return true;
  }).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="bg-[#F7F5F0] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Nav onHome={false} />

      {/* Hero */}
      <section className="bg-[#3D4145] pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-[0.22em] uppercase bg-[#2D6A3F] text-white">
                Our Work
              </span>
            </div>
            <h1
              className="text-white leading-[1.05] mb-5"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 500 }}
            >
              We Don't Just Buy Houses —<br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>We Transform Them.</em>
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xl">
              Every property we acquire is an opportunity to restore something — for the seller, the neighborhood, and the next family who calls it home.
            </p>
          </div>
        </div>
      </section>

      {/* Impact strip */}
      <ImpactStrip />

      {/* Filters + Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          {/* Filter bar */}
          <div className="flex flex-wrap gap-2 mb-8">
            {/* State filters */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3D4145]/40">State</span>
            </div>
            <button
              onClick={() => setStateFilter(null)}
              className={`text-xs font-semibold tracking-widest uppercase px-3 py-1.5 border transition-all duration-150 ${
                stateFilter === null
                  ? "bg-[#3D4145] text-white border-[#3D4145]"
                  : "bg-transparent text-[#3D4145]/60 border-[#3D4145]/20 hover:border-[#3D4145]/50"
              }`}
            >
              All
            </button>
            {STATE_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStateFilter(stateFilter === key ? null : key)}
                className={`text-xs font-semibold tracking-widest uppercase px-3 py-1.5 border transition-all duration-150 ${
                  stateFilter === key
                    ? "bg-[#3D4145] text-white border-[#3D4145]"
                    : "bg-transparent text-[#3D4145]/60 border-[#3D4145]/20 hover:border-[#3D4145]/50"
                }`}
              >
                {label}
              </button>
            ))}

            <div className="w-px bg-[#3D4145]/15 mx-1 self-stretch" />

            {/* Scope filters */}
            <div className="flex items-center gap-1.5 mr-1">
              <TrendingUp className="w-3 h-3 text-[#3D4145]/40" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#3D4145]/40">Scope</span>
            </div>
            {SCOPE_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setScopeFilter(scopeFilter === key ? null : key)}
                className={`text-xs font-semibold tracking-widest uppercase px-3 py-1.5 border transition-all duration-150 ${
                  scopeFilter === key
                    ? "bg-[#2D6A3F] text-white border-[#2D6A3F]"
                    : "bg-transparent text-[#3D4145]/60 border-[#3D4145]/20 hover:border-[#2D6A3F]/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-[#3D4145]/45 text-xs font-semibold tracking-widest uppercase mb-6">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            {stateFilter ? ` in ${stateFilter}` : ""}
            {scopeFilter ? ` · ${scopeFilter}` : ""}
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-[#3D4145]/40">
              <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No projects match those filters yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seller CTA band */}
      <section className="bg-[#3D4145] py-14">
        <div className="container text-center">
          <p className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-3">Sell Your Home</p>
          <h2
            className="text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 500 }}
          >
            Want a Cash Offer on Yours?
          </h2>
          <p className="text-white/55 text-sm mb-7 max-w-md mx-auto">
            We close in as few as 7 days — no repairs, no agent fees, no hassle.
          </p>
          <a
            href="/#hero-form"
            className="inline-flex items-center gap-2 bg-[#2D6A3F] text-white text-xs font-semibold tracking-widest uppercase px-8 py-4 hover:bg-[#1F4D2E] transition-colors duration-150"
          >
            Get My Cash Offer <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
