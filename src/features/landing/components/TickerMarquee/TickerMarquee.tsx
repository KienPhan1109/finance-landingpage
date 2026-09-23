import { ArrowDownIcon, ArrowUpIcon } from "../../../../shared";
import type { TickerMarqueeProps } from "../../types";
import "./TickerMarquee.css";

export function TickerMarquee({ items }: TickerMarqueeProps) {
  // Pre-generate unique keys for seamless infinite ticker without using raw array index
  const firstPass = items.map((item) => ({ ...item, uniqueKey: `${item.id}-pass-1` }));
  const secondPass = items.map((item) => ({ ...item, uniqueKey: `${item.id}-pass-2` }));
  const doubledItems = [...firstPass, ...secondPass];

  return (
    <div
      className="ticker-container"
      role="region"
      aria-label="Live Market Ticker"
    >
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
  );
}
