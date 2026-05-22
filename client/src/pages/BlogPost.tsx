/**
 * REVIVE HOME BUYERS — Blog Post Page
 *
 * Route: /blog/:slug
 * Design: "Calm Authority" — same Manus design tokens as Home and CityPage
 *   - Cormorant Garamond (display) + Outfit (body)
 *   - Forest green #2D6A3F accent, charcoal #3D4145 text, off-white #F7F5F0 bg
 */
import { useParams, Link } from "wouter";
import { ArrowLeft, Clock, Tag, MapPin } from "lucide-react";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import LeadForm from "@/components/shared/LeadForm";
import { getPostBySlug, BLOG_POSTS } from "@/content/blog";
import { useSeo } from "@/hooks/useSeo";
import { useReveal } from "@/hooks/useReveal";
import type { BlogPost as BlogPostType, BlogSection } from "@/types/blog";

const BASE_URL = "https://revivebuyers.com";

function buildJsonLd(post: BlogPostType) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "datePublished": post.publishDate,
    "publisher": {
      "@type": "Organization",
      "name": "Revive Home Buyers",
      "url": BASE_URL,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

// Minimal markdown-like renderer for blog section bodies
// Supports: **bold**, `inline code`, [link text](href), tables (| ... |), lists (- item)
function RenderBody({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.startsWith("|") && i + 1 < lines.length && lines[i + 1].startsWith("|---")) {
      const headers = line.split("|").filter(Boolean).map((h) => h.trim());
      i += 2; // skip separator row
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i].split("|").filter(Boolean).map((c) => c.trim()));
        i++;
      }
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, j) => (
                  <th key={j} className="text-left px-4 py-2 bg-[#3D4145] text-white font-semibold text-xs tracking-widest uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-[#F7F5F0]"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2 text-[#3D4145]/80 border-b border-[#3D4145]/08">
                      <InlineMarkdown text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="my-5 space-y-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-[#3D4145]/75 font-light">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2D6A3F] shrink-0" />
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="my-5 space-y-2 list-decimal list-inside">
          {items.map((item, j) => (
            <li key={j} className="text-[#3D4145]/75 font-light">
              <InlineMarkdown text={item} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line = paragraph break
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-[#3D4145]/75 leading-relaxed font-light mb-5">
        <InlineMarkdown text={line} />
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function InlineMarkdown({ text }: { text: string }) {
  // Process inline: **bold**, `code`, [text](url)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold text-[#3D4145]">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i} className="text-xs font-mono bg-[#3D4145]/08 px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const [, linkText, href] = linkMatch;
          if (href.startsWith("/")) {
            return <Link key={i} href={href} className="text-[#2D6A3F] underline underline-offset-2 hover:text-[#1F4D2E]">{linkText}</Link>;
          }
          return <a key={i} href={href} className="text-[#2D6A3F] underline underline-offset-2 hover:text-[#1F4D2E]">{linkText}</a>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function PostSection({ section, index }: { section: BlogSection; index: number }) {
  return (
    <div className={`reveal ${index > 0 ? "mt-10" : ""}`} style={{ transitionDelay: `${index * 60}ms` }}>
      {section.heading && (
        <h2
          className="text-[#3D4145] mb-4"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {section.heading}
        </h2>
      )}
      <RenderBody text={section.body} />
    </div>
  );
}

function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = BLOG_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="py-16 bg-[#F7F5F0] border-t border-[#3D4145]/10">
      <div className="container">
        <span className="green-rule" />
        <h3
          className="text-[#3D4145] mb-8 mt-3"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
            fontWeight: 500,
          }}
        >
          More seller guides
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {related.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-white p-6 border border-[#3D4145]/10 hover:border-[#2D6A3F]/40 transition-colors duration-150"
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-[#2D6A3F] mb-3 block">
                {post.category}
              </span>
              <h4
                className="text-[#3D4145] mb-2 group-hover:text-[#2D6A3F] transition-colors duration-150"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {post.title}
              </h4>
              <p className="text-xs text-[#3D4145]/55 flex items-center gap-1">
                <Clock size={11} />
                {post.readMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function BlogPostPage() {
  useReveal();
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const post = getPostBySlug(slug);

  useSeo({
    title: post ? post.metaTitle : "Blog | Revive Home Buyers",
    description: post ? post.metaDescription : "Seller guides and resources for Utah, Idaho, and Montana homeowners.",
    canonical: post ? `${BASE_URL}/blog/${post.slug}` : undefined,
    jsonLd: post ? buildJsonLd(post) : undefined,
  });

  if (!post) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
        <Nav onHome={false} />
        <div className="container py-32 text-center">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.5rem", color: "#3D4145" }}>
            Article not found
          </h1>
          <p className="text-[#3D4145]/60 mt-4 mb-8">That article doesn't exist or has moved.</p>
          <Link href="/" className="text-[#2D6A3F] underline">← Back to home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F7F5F0" }}>
      <Nav onHome={false} />

      {/* Hero / Header */}
      <header className="pt-32 pb-16 bg-[#3D4145]">
        <div className="container max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/55 hover:text-white text-xs tracking-widest uppercase mb-8 transition-colors"
          >
            <ArrowLeft size={13} />
            Revive Home Buyers
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-widest uppercase text-[#3d8a55]">
              <Tag size={11} />
              {post.category}
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
              <Clock size={11} />
              {post.readMinutes} min read
            </span>
            {post.cityName && (
              <>
                <span className="text-white/30">·</span>
                <Link
                  href={`/sell-my-house-fast-${post.citySlug}`}
                  className="inline-flex items-center gap-1 text-[11px] text-white/50 hover:text-[#3d8a55] transition-colors"
                >
                  <MapPin size={11} />
                  {post.cityName}, {post.stateAbbr}
                </Link>
              </>
            )}
          </div>

          <h1
            className="text-white leading-[1.1] mb-0"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
              fontWeight: 500,
            }}
          >
            {post.title}
          </h1>
        </div>
      </header>

      {/* Article body + sidebar */}
      <main className="py-16 md:py-20">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_320px] gap-12 items-start max-w-5xl">
            {/* Article */}
            <article>
              {post.sections.map((section, i) => (
                <PostSection key={i} section={section} index={i} />
              ))}
            </article>

            {/* Sticky CTA sidebar */}
            <aside>
              <div className="md:sticky md:top-28 bg-white p-7 shadow-sm border border-[#3D4145]/10 reveal">
                <span className="section-label" style={{ color: "#2D6A3F" }}>
                  Ready to sell?
                </span>
                <h3
                  className="text-[#3D4145] mt-2 mb-5"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  Get a fair cash offer
                  <br />
                  <em style={{ fontStyle: "italic", fontWeight: 300 }}>in 24 hours.</em>
                </h3>
                <LeadForm />
                <p className="text-center text-[#3D4145]/40 text-xs mt-4">
                  No obligation · No fees · 100% confidential
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <RelatedPosts currentSlug={post.slug} />
      <Footer />
    </div>
  );
}
