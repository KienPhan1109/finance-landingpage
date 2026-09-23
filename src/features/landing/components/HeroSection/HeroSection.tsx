import { ArrowRightIcon } from "../../../../shared";
import { NAV_ITEMS, TICKER_ITEMS } from "../../data/landingData";
import { Navbar } from "../Navbar";
import { TickerMarquee } from "../TickerMarquee";
import "./HeroSection.css";

export function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      {/* Navigation bar */}
      <Navbar items={NAV_ITEMS} />

      {/* Center-aligned cinematic main content with scroll parallax wrap */}
      <div className="hero-content-scroll-wrap">
        <div className="hero-content-container">
          <h1 className="hero-headline">
            <span className="hero-headline-top">Optimized for</span>
            <span className="hero-headline-bottom">
              Steady <span className="hero-headline-accent">Growth</span>
            </span>
          </h1>

          <p className="hero-subheadline">
            A disciplined investment strategy balancing long-term growth, risk
            management, and financial stability.
          </p>

          {/* Dual Button Action Row */}
          <div className="hero-cta-row">
            <button type="button" className="hero-cta-primary" id="cta-start-free">
              <span>Start Free Now</span>
              <ArrowRightIcon size={14} className="hero-btn-arrow" />
            </button>
            <button type="button" className="hero-cta-secondary" id="cta-explore">
              <span>See In Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom scrolling ticker */}
      <TickerMarquee items={TICKER_ITEMS} />
    </section>
  );
}
