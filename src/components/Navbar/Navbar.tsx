import type { NavbarProps } from "../../types";
import styles from "./Navbar.module.css";

export function Navbar({ items }: NavbarProps) {
  return (
    <nav className={styles.navbar} id="main-navbar" aria-label="Main navigation">
      {/* Logo */}
      <a href="/" className={styles.logo} id="nav-logo" aria-label="Meridian Home">
        <div className={styles.logoTextGroup}>
          <span className={styles.logoTitle}>Meridian</span>
          <span className={styles.logoDot} aria-hidden="true" />
        </div>
      </a>

      {/* Center nav links — pill container */}
      <div className={styles.navPill}>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${item.isActive ? styles.navLinkActive : ""}`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <a href="#contact" className={styles.navCta} id="nav-cta">
        Start now
      </a>
    </nav>
  );
}
