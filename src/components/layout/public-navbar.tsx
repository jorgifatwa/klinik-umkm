"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Artikel", href: "/articles" },
  { label: "Kalkulator", href: "/calculators" },
  { label: "Forum", href: "/forum" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="SUFICSUFICSUFIC&apos;Capos;Capos;C"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-tight text-[#0F4C9A]">
              SUFICSUFICSUFIC&apos;Capos;Capos;C
            </p>
            <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
              Platform Pendampingan Keuangan
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-[#0F4C9A] ${
                pathname.startsWith(link.href) ? "text-[#0F4C9A] font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2.5 pl-5 border-l border-gray-200">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="h-9 text-gray-700">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="h-9">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          type="button"
          className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium transition-colors hover:text-[#0F4C9A] ${
                  pathname.startsWith(link.href) ? "text-[#0F4C9A]" : "text-gray-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="h-9 text-gray-700">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="h-9">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}