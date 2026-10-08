"use client";

import Link from "next/link";
import { useState } from "react";
import { business, navLinks } from "@/lib/site";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-bg sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="font-heading font-bold text-xl tracking-wide text-primary"
            onClick={() => setOpen(false)}
          >
            {business.name.toUpperCase()}
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/contact"
              className="inline-block bg-accent text-white font-semibold text-sm px-6 py-3 rounded hover:opacity-90 transition-opacity"
            >
              Get a Quote
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 -mr-2"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="md:hidden border-t border-border px-6 pb-6 pt-2" aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-ink hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-3 inline-block w-full text-center bg-accent text-white font-semibold text-sm px-6 py-3 rounded"
          >
            Get a Quote
          </Link>
          <a
            href={business.phoneHref}
            className="mt-3 block text-center text-primary font-heading font-semibold text-lg"
          >
            {business.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
