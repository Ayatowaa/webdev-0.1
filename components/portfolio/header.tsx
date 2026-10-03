"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="portfolio-nav wrap">
      <a className="wordmark" href="/" aria-label="Allefy Resende home">
        ar<span>.</span>
      </a>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        className={open ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        {[
          ["Work", "/#work"],
          ["About", "/#about"],
          ["Capabilities", "/#skills"],
          ["Contact", "/#contact"],
        ].map(([label, href]) => (
          <a key={label} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="/#contact">
        Let’s talk
      </a>
    </header>
  );
}
