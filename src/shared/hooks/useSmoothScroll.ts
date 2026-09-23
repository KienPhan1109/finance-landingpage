import { useEffect } from "react";

/**
 * Custom hook providing momentum-damped smooth wheel scrolling.
 * Transforms harsh discrete mouse wheel jumps into a silky, slow, cinematic glide.
 */
export function useSmoothScroll(damping = 5.0, sensitivity = 0.72) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = 0;
    let lastTime = performance.now();

    const updateScroll = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      // Frame-rate independent exponential interpolation
      const factor = 1.0 - Math.exp(-damping * dt);
      currentY += (targetY - currentY) * factor;

      if (Math.abs(targetY - currentY) < 0.2) {
        currentY = targetY;
        window.scrollTo(0, targetY);
        rafId = 0;
        return;
      }

      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(updateScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;

      e.preventDefault();

      // Normalize delta across all input devices and modes
      let rawDelta = e.deltaY;
      if (e.deltaMode === 1) {
        rawDelta *= 32;
      } else if (e.deltaMode === 2) {
        rawDelta *= window.innerHeight;
      }

      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const delta = rawDelta * sensitivity;

      if (!rafId) {
        currentY = window.scrollY;
        targetY = window.scrollY;
        lastTime = performance.now();
        rafId = requestAnimationFrame(updateScroll);
      }

      targetY = Math.max(0, Math.min(maxScroll, targetY + delta));
    };

    const handleScrollSync = () => {
      if (!rafId) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScrollSync, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScrollSync);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [damping, sensitivity]);
}
