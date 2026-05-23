import { useState } from "react";
import { Link, useRoute } from "wouter";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import { useSeo } from "@/hooks/useSeo";
import { PROJECTS } from "@/data/projects";
import NotFound from "@/pages/NotFound";
import {
  MapPin, Calendar, DollarSign, ArrowLeft, ArrowRight,
  CheckCircle, Tag, Building2, ChevronLeft, ChevronRight,
} from "lucide-react";

function PhotoCarousel({ photos, label }: { photos: string[]; label: string }) {
  const [idx, setIdx] = useState(0);
  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/9] bg-[#3D4145]/10 overflow-hidden">
        <img
          src={photos[idx]}
          alt={`${label} — photo ${idx + 1} of ${photos.length}`}
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-6 h-0.5 transition-all duration-150 ${i === idx ? "bg-white" : "bg-white/35"}`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-1">
          {label}
        </div>
      </div>
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-16 h-12 overflow-hidden border-2 transition-all duration-150 ${
                i === idx ? "border-[#2D6A3F]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const [, params] = useRoute("/our-projects/:slug");
  const slug = params?.slug;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) return <NotFound />;

  const arvFormatted = project.arv
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(project.arv)
    : null;

  const currentIdx = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = currentIdx > 0 ? PROJECTS[currentIdx - 1] : null;
  const nextProject = currentIdx < PROJECTS.length - 1 ? PROJECTS[currentIdx + 1] : null;

  useSeo({
    title: `${project.city}, ${project.state} Rehab — Revive Home Buyers | Before & After`,
    description: project.scope_summary,
    canonical: `https://revivebuyers.com/our-projects/${project.slug}`,
  });

  return (
    <div className="bg-[#F7F5F0] min-h-screen" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <Nav onHome={false} />

      <div className="pt-24 md:pt-28">
        {/* Breadcrumb */}
        <div className="container pt-6 pb-4">
          <Link href="/our-projects">
            <a className="inline-flex items-center gap-1.5 text-[#3D4145]/50 hover:text-[#2D6A3F] text-xs font-semibold tracking-widest uppercase transition-colors duration-150">
              <ArrowLeft className="w-3 h-3" />
              All Projects
            </a>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#3D4145] py-10 md:py-14">
          <div className="container">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.project_type === "ahr_wholesale_to_investor" && (
                <span className="text-[9px] font-semibold tracking-widest uppercase bg-white/15 text-white px-2 py-1">
                  Wholesale Assignment
                </span>
              )}
              {project.was_code_violation && (
                <span className="flex items-center gap-1 text-[9px] font-semibold tracking-widest uppercase bg-[#2D6A3F]/80 text-white px-2 py-1">
                  <CheckCircle className="w-3 h-3" />
                  Code Violation Resolved
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
              <MapPin className="w-3 h-3" />
              <span>{project.city}, {project.state}</span>
              <span className="text-white/25">·</span>
              <Calendar className="w-3 h-3" />
              <span>{project.year_completed}</span>
              <span className="text-white/25">·</span>
              <Building2 className="w-3 h-3" />
              <span className="capitalize">{project.property_type.replace("-", " ")}</span>
            </div>

            <h1
              className="text-white leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 500 }}
            >
              {project.city}, {project.state}
              {project.days_to_sell && (
                <span
                  className="ml-4 text-[#2D6A3F] text-base font-normal"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Sold in {project.days_to_sell} days{project.offer_count ? ` · ${project.offer_count} offers` : ""}
                </span>
              )}
            </h1>

            <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
              {project.scope_summary}
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="container py-10 md:py-14">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            {/* Left: Photos */}
            <div className="space-y-8">
              {project.after_photo_urls.length > 0 && (
                <PhotoCarousel photos={project.after_photo_urls} label="After" />
              )}
              {project.before_photo_urls.length > 0 && (
                <PhotoCarousel photos={project.before_photo_urls} label="Before" />
              )}
              {project.during_photo_urls.length > 0 && (
                <PhotoCarousel photos={project.during_photo_urls} label="During" />
              )}

              {project.after_photo_urls.length === 0 && project.before_photo_urls.length === 0 && (
                <div className="aspect-[16/9] bg-[#3D4145]/8 flex flex-col items-center justify-center text-[#3D4145]/30">
                  <Building2 className="w-12 h-12 mb-3" />
                  <p className="text-sm">Photos coming soon</p>
                </div>
              )}

              {/* Story section */}
              {(project.story_situation || project.story_action || project.story_outcome) && (
                <div className="space-y-6 pt-4">
                  <h2
                    className="text-[#3D4145] border-b border-[#3D4145]/10 pb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 500 }}
                  >
                    The Story
                  </h2>
                  {project.story_situation && (
                    <div>
                      <div className="text-[9px] font-semibold tracking-widest uppercase text-[#2D6A3F] mb-2">The Situation</div>
                      <p className="text-[#3D4145]/75 text-sm leading-relaxed">{project.story_situation}</p>
                    </div>
                  )}
                  {project.story_action && (
                    <div>
                      <div className="text-[9px] font-semibold tracking-widest uppercase text-[#2D6A3F] mb-2">What We Did</div>
                      <p className="text-[#3D4145]/75 text-sm leading-relaxed">{project.story_action}</p>
                    </div>
                  )}
                  {project.story_outcome && (
                    <div>
                      <div className="text-[9px] font-semibold tracking-widest uppercase text-[#2D6A3F] mb-2">The Outcome</div>
                      <p className="text-[#3D4145]/75 text-sm leading-relaxed">{project.story_outcome}</p>
                    </div>
                  )}
                  {project.community_impact && (
                    <div className="border-l-2 border-[#2D6A3F] pl-4 py-1">
                      <div className="text-[9px] font-semibold tracking-widest uppercase text-[#2D6A3F] mb-2">Community Impact</div>
                      <p className="text-[#3D4145]/65 text-sm leading-relaxed">{project.community_impact}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Project stats sidebar */}
            <div className="space-y-6">
              {/* Key metrics */}
              <div className="bg-white border border-[#3D4145]/10 p-6 space-y-4">
                <h3 className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/50 border-b border-[#3D4145]/8 pb-3">
                  Project Snapshot
                </h3>

                {arvFormatted && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-[#3D4145]/50 text-xs">
                      <DollarSign className="w-3.5 h-3.5" />
                      After-Repair Value
                    </div>
                    <div className="text-[#2D6A3F] font-semibold text-sm">{arvFormatted}</div>
                  </div>
                )}

                {project.rehab_cost_range && (
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-[#3D4145]/50 text-xs">
                      <DollarSign className="w-3.5 h-3.5" />
                      Rehab Investment
                    </div>
                    <div className="text-[#3D4145] font-medium text-sm">{project.rehab_cost_range}</div>
                  </div>
                )}

                {project.days_to_sell && (
                  <div className="flex items-start justify-between">
                    <div className="text-[#3D4145]/50 text-xs">Days to Sell</div>
                    <div className="text-[#3D4145] font-medium text-sm">{project.days_to_sell} days</div>
                  </div>
                )}

                {project.offer_count && (
                  <div className="flex items-start justify-between">
                    <div className="text-[#3D4145]/50 text-xs">Competing Offers</div>
                    <div className="text-[#3D4145] font-medium text-sm">{project.offer_count} offers</div>
                  </div>
                )}

                {project.final_outcome && (
                  <div className="pt-1 border-t border-[#3D4145]/8">
                    <div className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/40 mb-1">Outcome</div>
                    <div className="text-[#3D4145] text-sm">{project.final_outcome}</div>
                  </div>
                )}
              </div>

              {/* Scope tags */}
              <div className="bg-white border border-[#3D4145]/10 p-6">
                <h3 className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/50 mb-4 flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  Scope of Work
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.scope_tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-semibold tracking-widest uppercase bg-[#F7F5F0] text-[#3D4145]/70 px-2.5 py-1 border border-[#3D4145]/8">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seller CTA */}
              <div className="bg-[#2D6A3F] p-6 text-white">
                <p className="text-white/75 text-xs mb-2">Own a distressed property?</p>
                <p className="font-semibold mb-4 leading-snug" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem" }}>
                  Get a fair cash offer — no repairs needed.
                </p>
                <a
                  href="/#hero-form"
                  className="flex items-center justify-center gap-2 w-full bg-white text-[#2D6A3F] text-xs font-semibold tracking-widest uppercase py-3 hover:bg-[#F7F5F0] transition-colors duration-150"
                >
                  Get My Cash Offer <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="border-t border-[#3D4145]/10">
          <div className="container py-8 grid grid-cols-2 gap-4">
            {prevProject ? (
              <Link href={`/our-projects/${prevProject.slug}`}>
                <a className="flex items-center gap-3 group">
                  <ChevronLeft className="w-4 h-4 text-[#3D4145]/40 group-hover:text-[#2D6A3F] transition-colors shrink-0" />
                  <div>
                    <div className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/35 mb-0.5">Previous</div>
                    <div className="text-[#3D4145] text-sm font-medium group-hover:text-[#2D6A3F] transition-colors">
                      {prevProject.city}, {prevProject.state}
                    </div>
                  </div>
                </a>
              </Link>
            ) : <div />}

            {nextProject ? (
              <Link href={`/our-projects/${nextProject.slug}`}>
                <a className="flex items-center gap-3 justify-end text-right group">
                  <div>
                    <div className="text-[9px] font-semibold tracking-widest uppercase text-[#3D4145]/35 mb-0.5">Next</div>
                    <div className="text-[#3D4145] text-sm font-medium group-hover:text-[#2D6A3F] transition-colors">
                      {nextProject.city}, {nextProject.state}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3D4145]/40 group-hover:text-[#2D6A3F] transition-colors shrink-0" />
                </a>
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
