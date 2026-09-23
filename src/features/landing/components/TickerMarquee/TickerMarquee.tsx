import { useEffect, useRef } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "../../../../shared";
import type { TickerMarqueeProps } from "../../types";
import "./TickerMarquee.css";

export function TickerMarquee({ items }: TickerMarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Pre-generate unique keys for seamless infinite ticker without using raw array index
  const firstPass = items.map((item) => ({ ...item, uniqueKey: `${item.id}-pass-1` }));
  const secondPass = items.map((item) => ({ ...item, uniqueKey: `${item.id}-pass-2` }));
  const doubledItems = [...firstPass, ...secondPass];

  useEffect(() => {
    // If native CSS scroll-driven animations are supported, let CSS handle it on GPU compositor
    if (typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline", "scroll()")) {
      return;
    }

    // High-performance fallback for browsers lacking animation-timeline
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrollY / 90));
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = `${1 - progress}`;
        wrapperRef.current.style.transform = `translateY(${progress * 24}px)`;
        wrapperRef.current.style.visibility = progress >= 1 ? "hidden" : "visible";
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
          {doubledItems.map((item) => {
            const isPositive = item.direction === "up";
            const changeClass = isPositive ? "ticker-positive" : "ticker-negative";

            return (
              <div
                key={item.uniqueKey}
                className="ticker-item"
              >
                <span className="ticker-symbol">{item.symbol}</span>
                <span className="ticker-name">{item.companyName}</span>
                <span className="ticker-price">
                  ${item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className={`ticker-change ${changeClass}`}>
                  {isPositive ? (
                    <ArrowUpIcon size={10} className="ticker-arrow" />
                  ) : (
                    <ArrowDownIcon size={10} className="ticker-arrow" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </span>
                <span className="ticker-divider" aria-hidden="true" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
