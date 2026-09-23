import { ChartBackground } from "../ChartBackground";
import { ErrorBoundary } from "../ErrorBoundary";
import { ArrowRightIcon } from "../Icons";
import { Navbar } from "../Navbar";
import { TickerMarquee } from "../TickerMarquee";
import { DUAL_CHART_DATA, NAV_ITEMS, TICKER_ITEMS } from "./data";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.hero} id="hero-section">
      {/* 3D Glowing Silk Wave Dunes Canvas (SpineEdge Style) */}
      <ErrorBoundary>
        <ChartBackground data={DUAL_CHART_DATA} />
      </ErrorBoundary>

      {/* Subtle Noise Texture Overlay */}
      <div className={styles.noiseOverlay} aria-hidden="true" />

      {/* Navigation bar */}
      <Navbar items={NAV_ITEMS} />

      {/* Center-aligned cinematic main content */}
      <div className={styles.contentContainer}>

        <h1 className={styles.headline}>
          <span className={styles.headlineTop}>Systematic Edge</span>
          <span className={styles.headlineBottom}>
            for Global <span className={styles.headlineAccent}>Markets</span>
          </span>
        </h1>

        <p className={styles.subheadline}>
          Discover a data-driven platform for tracking over 3,000 financial
          assets with advanced quantitative strategies and machine learning.
        </p>

        {/* Dual Button Action Row */}
        <div className={styles.ctaRow}>
          <button type="button" className={styles.ctaPrimary} id="cta-start-free">
            <span>Start Free Now</span>
            <ArrowRightIcon size={14} className={styles.btnArrow} />
          </button>
          <button type="button" className={styles.ctaSecondary} id="cta-explore">
            <span>See In Action</span>
          </button>
        </div>
      </div>

      {/* Seamless Bottom Obsidian Fade Overlay */}
      <div className={styles.bottomFadeOverlay} aria-hidden="true" />

      {/* Bottom scrolling ticker */}
      <TickerMarquee items={TICKER_ITEMS} />
    </section>
  );
}
