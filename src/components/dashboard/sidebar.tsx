"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { type ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  matchChildren?: boolean;
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navSections = [
  {
    label: "General",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "home" },
      { href: "/dashboard/profil-usaha", label: "Profil Usaha", icon: "building" },
    ],
  },
  {
    label: "Financial Tools",
    items: [
      { href: "/dashboard/financial-health", label: "Analisis Keuangan", icon: "heartbeat" },
      { href: "/dashboard/roadmap-keuangan", label: "Roadmap Keuangan", icon: "map" },
      { href: "/dashboard/kalkulator", label: "Kalkulator", icon: "calculator" },
    ],
  },
  {
    label: "Knowledge Center",
    items: [
      { href: "/dashboard/artikel", label: "Artikel", icon: "article" },
      { href: "/dashboard/forum", label: "Forum", icon: "forum" },
    ],
  },
  {
    label: "Services",
    items: [
      { href: "/dashboard/konsultasi", label: "Konsultasi", icon: "consultation" },
    ],
  },
];

const consultantNav = [
  {
    label: "Konsultan",
    items: [
      { href: "/consultant", label: "Dashboard Konsultan", icon: "consultant" },
      { href: "/consultant/konsultasi", label: "Konsultasi", icon: "consultation" },
      { href: "/consultant/clients", label: "Klien Saya", icon: "users", matchChildren: true },
      { href: "/consultant/profile", label: "Profil Konsultan", icon: "building" },
    ],
  },
];

const adminNav = [
  {
    label: "Administration",
    items: [
      { href: "/admin", label: "Admin Dashboard", icon: "admin" },
      { href: "/admin/users", label: "User Management", icon: "users" },
      { href: "/admin/consultations", label: "Konsultasi", icon: "consultation", matchChildren: true },
      { href: "/admin/artikel", label: "Artikel", icon: "article" },
      { href: "/admin/forum", label: "Forum", icon: "forum" },
    ],
  },
];

function NavIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const s = size;
  const icons: Record<string, ReactNode> = {
    home: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    building: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
      </svg>
    ),
    heartbeat: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        <path d="M3.5 12h3l2-4 4 8 2-4h3" />
      </svg>
    ),
    map: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    calculator: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="8" y2="10.01" />
        <line x1="12" y1="10" x2="12" y2="10.01" />
        <line x1="16" y1="10" x2="16" y2="10.01" />
        <line x1="8" y1="14" x2="8" y2="14.01" />
        <line x1="12" y1="14" x2="12" y2="14.01" />
        <line x1="16" y1="14" x2="16" y2="14.01" />
        <line x1="8" y1="18" x2="8" y2="18.01" />
        <line x1="12" y1="18" x2="16" y2="18" />
      </svg>
    ),
    article: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    forum: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <line x1="8" y1="9" x2="16" y2="9" />
        <line x1="8" y1="13" x2="13" y2="13" />
      </svg>
    ),
    consultation: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    consultant: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    admin: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    users: (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  };

  return icons[icon] || <span className="w-[18px]" />;
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "ADMIN":
      return "bg-rose-500/20 text-rose-300 border border-rose-400/20";
    case "KONSULTAN":
      return "bg-amber-500/20 text-amber-300 border border-amber-400/20";
    default:
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20";
  }
}

function getRoleLabel(role: string) {
  switch (role) {
    case "ADMIN": return "Admin";
    case "KONSULTAN": return "Konsultan";
    default: return "UMKM";
  }
}

export function DashboardSidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, matchChildren = false) => {
    if (pathname === href) return true;
    if (matchChildren && pathname.startsWith(href + "/")) return true;
    return false;
  };

  const renderNavSection = (section: { label: string; items: NavItem[] }) => (
    <div key={section.label}>
      <div className="sidebar-section-label">{section.label}</div>
      <div className="px-3 space-y-0.5">
        {section.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-nav-item ${isActive(item.href, item.matchChildren) ? "active" : ""}`}
            onClick={onClose}
          >
            <NavIcon icon={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`dashboard-sidebar ${open ? "open" : ""}`}>
        {/* Brand */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <img src="/logo.png" alt={"SUFIC'C"} className="h-6 w-6 rounded-lg object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white tracking-tight">{"SUFIC'C"}</p>
            <p className="text-[10.5px] text-white/40 font-medium">Sustainable Financial Clinic Cianjur</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navSections.map(renderNavSection)}

          {session?.user?.role === "KONSULTAN" &&
            consultantNav.map(renderNavSection)}

          {session?.user?.role === "ADMIN" &&
            adminNav.map(renderNavSection)}
        </nav>

        {/* User Profile */}
        {session?.user && (
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold text-white">
                {session.user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">
                  {session.user.name}
                </p>
                <div className="mt-0.5">
                  <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${getRoleBadgeStyle(session.user.role || "UMKM")}`}>
                    {getRoleLabel(session.user.role || "UMKM")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                title="Keluar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}