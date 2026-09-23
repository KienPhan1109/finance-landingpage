import type { TickerMarqueeProps } from "../../types";
import { ArrowUpIcon, ArrowDownIcon } from "../Icons";
import styles from "./TickerMarquee.module.css";

export function TickerMarquee({ items }: TickerMarqueeProps) {
  // Duplicate items to create seamless infinite scroll
  const doubledItems = [...items, ...items];

  return (
    <div
      className={styles.tickerContainer}
      role="region"
      aria-label="Live Market Ticker"
    >
      <div className={styles.tickerTrack}>
        {doubledItems.map((item, index) => {
          const isPositive = item.direction === "up";
          const changeClass = isPositive ? styles.positive : styles.negative;

          return (
            <div
              key={`${item.id}-${index}`}
              className={styles.tickerItem}
            >
              <span className={styles.tickerSymbol}>{item.symbol}</span>
              <span className={styles.tickerName}>{item.companyName}</span>
              <span className={styles.tickerPrice}>
                ${item.price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className={`${styles.tickerChange} ${changeClass}`}>
                {isPositive ? (
                  <ArrowUpIcon size={10} className={styles.tickerArrow} />
                ) : (
                  <ArrowDownIcon size={10} className={styles.tickerArrow} />
                )}
                <span>
                  {isPositive ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </span>
              </span>
              <span className={styles.tickerDivider} aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
