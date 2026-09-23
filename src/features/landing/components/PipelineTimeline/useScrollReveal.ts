import { useEffect, useRef } from "react";

/**
 * Custom hook that uses Intersection Observer to trigger
 * scroll-reveal animations on a container element.
 * Adds "pipeline-visible" class when the element enters viewport.
 */
export function useScrollReveal(threshold = 0.15) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    /* Respect reduced motion preference */
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      node.classList.add("pipeline-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("pipeline-visible");
            observer.unobserve(node);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { sectionRef };
}
