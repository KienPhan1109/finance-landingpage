import { useEffect, useRef } from "react";
import type { TickerMarqueeProps } from "../../types";
import { TickerItem } from "./TickerItem";
import "./TickerMarquee.css";

export function TickerMarquee({ items }: TickerMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const doubledItems = [
    ...items.map((it) => ({ ...it, uniqueKey: `${it.id}-p1` })),
    ...items.map((it) => ({ ...it, uniqueKey: `${it.id}-p2` })),
  ];

  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline", "scroll()")) {
      return;
    }

    const handleScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / 420));
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = `${1 - progress}`;
        wrapperRef.current.style.transform = `translateY(${-progress * 48}px) scale(${1 - progress * 0.03})`;
        wrapperRef.current.style.pointerEvents = progress >= 1 ? "none" : "auto";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="ticker-scroll-wrapper"
      role="region"
      aria-label="Live Market Ticker"
    >
      <div className="ticker-container">
        <div className="ticker-track">
          {doubledItems.map((item) => (
            <TickerItem key={item.uniqueKey} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
