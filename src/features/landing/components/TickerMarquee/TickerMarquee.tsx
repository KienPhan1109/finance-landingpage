import type { TickerMarqueeProps } from "../../types";
import { TickerItem } from "./TickerItem";
import "./TickerMarquee.css";

export function TickerMarquee({ items }: TickerMarqueeProps) {
  const doubledItems = [
    ...items.map((it) => ({ ...it, uniqueKey: `${it.id}-p1` })),
    ...items.map((it) => ({ ...it, uniqueKey: `${it.id}-p2` })),
  ];

  return (
    <div
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
