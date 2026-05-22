/**
 * Intersection-observer-based scroll reveal.
 * Add `className="reveal"` to any element and it'll fade in when scrolled into view.
 * The visibility transition itself is defined in index.css (.reveal / .reveal.visible).
 */
import { useEffect } from "react";

export function useReveal() {
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
