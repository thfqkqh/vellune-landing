"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/content";
import { AuthNav } from "@/components/layout/AuthNav";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lightHeader = !isHome || scrolled || menuOpen;

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth" });
  };

  const linkClass = `text-xs tracking-[0.25em] transition hover:opacity-70 ${
    lightHeader ? "text-foreground" : "text-white"
  }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        lightHeader ? "bg-background/95 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {isHome ? (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`font-display text-lg tracking-[0.35em] transition ${
              lightHeader ? "text-foreground" : "text-white"
            }`}
          >
            VELLUNE
          </button>
        ) : (
          <Link
            href="/"
            className={`font-display text-lg tracking-[0.35em] transition ${
              lightHeader ? "text-foreground" : "text-white"
            }`}
          >
            VELLUNE
          </Link>
        )}

        <nav className="hidden items-center gap-8 lg:flex">
          {isHome &&
            navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className={linkClass}
              >
                {link.label}
              </button>
            ))}
          <Link href="/board" className={linkClass}>
            BOARD
          </Link>
          <AuthNav className={linkClass} />
        </nav>

        <button
          type="button"
          className={`lg:hidden text-xl ${lightHeader ? "text-foreground" : "text-white"}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-black/5 bg-background px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {isHome &&
              navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className="text-left text-sm tracking-[0.25em] text-foreground"
                >
                  {link.label}
                </button>
              ))}
            <Link
              href="/board"
              onClick={() => setMenuOpen(false)}
              className="text-left text-sm tracking-[0.25em] text-foreground"
            >
              BOARD
            </Link>
            <AuthNav
              className="text-sm tracking-[0.25em] text-foreground"
              onNavigate={() => setMenuOpen(false)}
            />
          </div>
        </nav>
      )}
    </header>
  );
}
