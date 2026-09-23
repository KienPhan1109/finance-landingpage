import { useEffect, useRef, useState } from "react";

/**
 * Custom hook tracking scroll progress through the sticky pipeline section.
 * Controls horizontal track translation and active station index in 120fps lockstep.
 */
export function usePipelineScroll(stageCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let lastActive = -1;

    const handleScroll = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;

      const rect = container.getBoundingClientRect();
      const maxScroll = container.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));

      // Calculate horizontal translation
      const padding = 160;
      const maxTravel = Math.max(0, track.scrollWidth - window.innerWidth + padding);
      track.style.transform = `translate3d(-${progress * maxTravel}px, 0, 0)`;

      // Determine active stage with hysteresis
      const activeIdx = Math.min(stageCount - 1, Math.floor(progress * stageCount));
      if (activeIdx !== lastActive) {
        lastActive = activeIdx;
        setActiveStage(activeIdx);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [stageCount]);

  return { containerRef, trackRef, activeStage };
}
