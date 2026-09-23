import { ArrowDownIcon, ArrowUpIcon } from "../../../../shared";
import type { TickerItem as TickerItemType } from "../../types";

interface TickerItemProps {
  item: TickerItemType;
}

export function TickerItem({ item }: TickerItemProps) {
  const isPositive = item.direction === "up";
  const changeClass = isPositive ? "ticker-positive" : "ticker-negative";

  return (
    <>
      <div className="ticker-item">
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
      </div>
      <span className="ticker-divider" aria-hidden="true" />
    </>
  );
}
