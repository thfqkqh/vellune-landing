"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/data/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || menuOpen
          ? "bg-background/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`font-display text-lg tracking-[0.35em] transition ${
            scrolled || menuOpen ? "text-foreground" : "text-white"
          }`}
        >
          VELLUNE
        </button>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => handleNavClick(link.href)}
              className={`text-xs tracking-[0.25em] transition hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={`md:hidden text-xl ${scrolled || menuOpen ? "text-foreground" : "text-white"}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-black/5 bg-background px-6 py-6 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-left text-sm tracking-[0.25em] text-foreground"
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
