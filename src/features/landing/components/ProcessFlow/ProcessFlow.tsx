import { useEffect, useRef } from "react";
import type { ProcessFlowProps } from "../../types";
import { JellySphere, type OrbColorConfig } from "./JellySphere";
import "./ProcessFlow.css";

// 5 Color configurations exactly matching the horizontal spectrum of the 3D background wave
const ORB_CONFIGS: ReadonlyArray<OrbColorConfig> = [
  // 1. Left Silk Dune: Vibrant Neon Lime
  {
    primary: [0.74, 0.95, 0.39],
    secondary: [0.52, 0.80, 0.09],
    dark: [0.10, 0.22, 0.06],
    glow: [0.65, 0.96, 0.25],
    light: [0.96, 1.0, 0.85],
    badgeColor: "#bef264",
    auraCSS: "rgba(190, 242, 100, 0.55)",
  },
  // 2. Left-Center Slope: Lime to Mint / Emerald Teal
  {
    primary: [0.20, 0.83, 0.60],
    secondary: [0.06, 0.72, 0.51],
    dark: [0.04, 0.20, 0.14],
    glow: [0.15, 0.88, 0.68],
    light: [0.85, 1.0, 0.94],
    badgeColor: "#34d399",
    auraCSS: "rgba(52, 211, 153, 0.50)",
  },
  // 3. Center Valley: Electric Cyan
  {
    primary: [0.13, 0.83, 0.93],
    secondary: [0.02, 0.71, 0.83],
    dark: [0.04, 0.18, 0.24],
    glow: [0.10, 0.85, 0.98],
    light: [0.85, 0.98, 1.0],
    badgeColor: "#22d3ee",
    auraCSS: "rgba(6, 182, 212, 0.55)",
  },
  // 4. Right-Center Slope: Sky Blue & Indigo
  {
    primary: [0.51, 0.55, 0.97],
    secondary: [0.39, 0.40, 0.94],
    dark: [0.09, 0.10, 0.26],
    glow: [0.45, 0.50, 0.98],
    light: [0.90, 0.93, 1.0],
    badgeColor: "#818cf8",
    auraCSS: "rgba(99, 102, 241, 0.50)",
  },
  // 5. Right Dune Crest: Deep Cyber Violet / Purple
  {
    primary: [0.75, 0.52, 0.99],
    secondary: [0.55, 0.36, 0.96],
    dark: [0.15, 0.06, 0.26],
    glow: [0.72, 0.42, 0.98],
    light: [0.97, 0.90, 1.0],
    badgeColor: "#c084fc",
    auraCSS: "rgba(192, 132, 252, 0.55)",
  },
];

export function ProcessFlow({ stages }: ProcessFlowProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const cards = container.querySelectorAll<HTMLElement>(".jelly-sphere-card");
    if (cards.length === 0) return;

    // Reveal thresholds: 5 stages distributed along scroll progress
    // Start at progress 0.02 and finish at 0.88, leaving 0.88 - 1.00 to view all 5 spheres
    const START_P = 0.02;
    const END_P = 0.88;
    const STAGE_SPAN = (END_P - START_P) / cards.length;

    let rafId = 0;

    const updateCards = () => {
      const rect = section.getBoundingClientRect();
      const totalScrollable = section.offsetHeight - window.innerHeight;

      // On mobile/tablet, disable sticky scrubbing and keep all cards visible
      const isMobile = window.innerWidth <= 1100;
      if (isMobile || totalScrollable <= 0) {
        cards.forEach((card) => {
          card.style.opacity = "1";
          card.style.filter = "none";
          card.style.transform = "none";
          card.style.pointerEvents = "auto";
        });
        return;
      }

      // Distance scrolled into this pinned section (0 when top locks at viewport top)
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      cards.forEach((card, idx) => {
        const stageStart = START_P + idx * STAGE_SPAN;
        const stageEnd = stageStart + STAGE_SPAN;

        let rawFactor = 0;
        if (progress <= stageStart) {
          rawFactor = 0;
        } else if (progress >= stageEnd) {
          rawFactor = 1;
        } else {
          rawFactor = (progress - stageStart) / STAGE_SPAN;
        }

        // Smooth cubic Hermite interpolation (smoothstep) for organic feel
        const factor = rawFactor * rawFactor * (3 - 2 * rawFactor);

        const opacity = factor;
        const blur = (1 - factor) * 18; // 18px down to 0px
        const brightness = 1.0 + (1 - factor) * 0.5; // 1.5 down to 1.0
        const translateY = (1 - factor) * 45; // 45px down to 0px
        const scale = 0.92 + factor * 0.08; // 0.92 up to 1.0

        card.style.opacity = opacity.toFixed(3);
        card.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`;
        card.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        card.style.pointerEvents = factor >= 0.85 ? "auto" : "none";
      });
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          updateCards();
          rafId = 0;
        });
      }
    };

    // Initial positioning calculation
    updateCards();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stages]);

  return (
    <section className="process-flow-section" id="process-flow" ref={sectionRef} aria-label="System Workflow">
      <div className="process-flow-sticky">
        {/* Section Header */}
        <header className="process-flow-header">
          <h2 className="process-flow-headline">
            FBSF Cash Flow <span className="process-flow-headline-accent">Optimization Fund</span>
          </h2>
        </header>

        {/* 5 Equal Horizontal 3D Distorted Spheres with Background Spectrum & Liquid Mouse Warping */}
        <div className="process-orbs-container" ref={containerRef}>
          {stages.map((stage, idx) => {
            const config = ORB_CONFIGS[idx] ?? ORB_CONFIGS[0];
            return (
              <JellySphere
                key={stage.id}
                config={config}
                step={stage.step}
                title={stage.title}
                stageIndex={idx}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
