import type { GlassCardsProps } from "../../types";
import styles from "./GlassCards.module.css";

export function GlassCards({ cards }: GlassCardsProps) {
  return (
    <div className={styles.cardsContainer} aria-hidden="true">
      {cards.map((card) => {
        const positionClass = getPositionClass(card.position);

        return (
          <div key={card.id} className={`${styles.card} ${positionClass}`}>
            {card.title !== "" && (
              <span className={styles.cardTitle}>{card.title}</span>
            )}

            {card.value !== "" && (
              <span className={styles.cardValue}>{card.value}</span>
            )}

            {card.subtitle !== undefined && card.subtitle !== "" && (
              <span className={styles.cardSubtitle}>{card.subtitle}</span>
            )}

            {card.items !== undefined && card.items.length > 0 && (
              <div className={styles.cardItems}>
                {card.items.map((item) => (
                  <div key={item.label} className={styles.cardItem}>
                    <span className={styles.cardItemLabel}>{item.label}</span>
                    <span
                      className={`${styles.cardItemValue} ${
                        item.accent === "positive" ? styles.accentPositive
                        : item.accent === "negative" ? styles.accentNegative
                        : ""
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getPositionClass(position: string): string {
  switch (position) {
    case "left-top": return styles.posLeftTop;
    case "left-bottom": return styles.posLeftBottom;
    case "center": return styles.posCenter;
    case "right-top": return styles.posRightTop;
    case "right-bottom": return styles.posRightBottom;
    default: return "";
  }
}
