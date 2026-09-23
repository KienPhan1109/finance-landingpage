import type { NavbarProps } from "../../types";
import "./Navbar.css";

export function Navbar({ items }: NavbarProps) {
  return (
    <nav className="navbar" id="main-navbar" aria-label="Main navigation">
      {/* Logo */}
      <a href="/" className="navbar-logo" id="nav-logo" aria-label="Meridian Home">
        <div className="navbar-logo-text-group">
          <span className="navbar-logo-title">Meridian</span>
          <span className="navbar-logo-dot" aria-hidden="true" />
        </div>
      </a>

      {/* Center nav links — pill container */}
      <div className="navbar-pill">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`navbar-link ${item.isActive ? "navbar-link-active" : ""}`}
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <a href="#contact" className="navbar-cta" id="nav-cta">
        Start now
      </a>
    </nav>
  );
}
