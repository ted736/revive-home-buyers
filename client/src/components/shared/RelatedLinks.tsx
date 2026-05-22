/**
 * RelatedLinks — bidirectional SEO internal linking widget.
 * Used on city pages (linking to blog posts) and blog posts (linking to city pages).
 */
import { Link } from "wouter";
import { ArrowRight, FileText, MapPin } from "lucide-react";
import type { InternalLink } from "@/data/internalLinks";

type Props = {
  links: InternalLink[];
  heading?: string;
};

export default function RelatedLinks({ links, heading }: Props) {
  if (links.length === 0) return null;

  return (
    <aside className="mt-10 pt-8 border-t border-[#3D4145]/10">
      <h4
        className="text-[#3D4145] mb-4"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.1rem",
          fontWeight: 500,
        }}
      >
        {heading ?? "Related resources"}
      </h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group inline-flex items-start gap-2.5 text-sm text-[#3D4145]/70 hover:text-[#2D6A3F] transition-colors duration-150"
            >
              {link.type === "blog" ? (
                <FileText size={14} className="shrink-0 mt-0.5 text-[#2D6A3F]" />
              ) : (
                <MapPin size={14} className="shrink-0 mt-0.5 text-[#2D6A3F]" />
              )}
              <span className="leading-snug font-light group-hover:underline underline-offset-2">
                {link.label}
              </span>
              <ArrowRight size={12} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
