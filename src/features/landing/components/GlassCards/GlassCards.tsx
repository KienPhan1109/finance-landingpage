import type { GlassCardsProps } from "../../types";
import "./GlassCards.css";

export function GlassCards({ cards }: GlassCardsProps) {
  return (
    <div className="glass-cards-container" aria-hidden="true">
      {cards.map((card) => {
        const positionClass = getPositionClass(card.position);

        return (
          <div key={card.id} className={`glass-card ${positionClass}`}>
            {card.title !== "" && (
              <span className="glass-card-title">{card.title}</span>
            )}

            {card.value !== "" && (
              <span className="glass-card-value">{card.value}</span>
            )}

            {card.subtitle !== undefined && card.subtitle !== "" && (
              <span className="glass-card-subtitle">{card.subtitle}</span>
            )}

            {card.items !== undefined && card.items.length > 0 && (
              <div className="glass-card-items">
                {card.items.map((item) => (
                  <div key={item.label} className="glass-card-item">
                    <span className="glass-card-item-label">{item.label}</span>
                    <span
                      className={`glass-card-item-value ${
                        item.accent === "positive"
                          ? "glass-card-accent-positive"
                          : item.accent === "negative"
                            ? "glass-card-accent-negative"
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
    case "left-top":
      return "glass-card-pos-left-top";
    case "left-bottom":
      return "glass-card-pos-left-bottom";
    case "center":
      return "glass-card-pos-center";
    case "right-top":
      return "glass-card-pos-right-top";
    case "right-bottom":
      return "glass-card-pos-right-bottom";
    default:
      return "";
  }
}
