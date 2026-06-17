"use client";

import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface TopBarProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  onMenuToggle?: () => void;
}

export function DashboardTopBar({ title, breadcrumbs = [], onMenuToggle }: TopBarProps) {
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="dashboard-topbar">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 mt-0.5">
              {breadcrumbs.map((bc, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[12px] text-gray-400">
                  {i > 0 && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                  {bc.href ? (
                    <Link href={bc.href} className="hover:text-gray-600 transition-colors">{bc.label}</Link>
                  ) : (
                    <span className="text-gray-600 font-medium">{bc.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl bg-gray-50 border border-gray-200 text-gray-400 min-w-[200px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[12.5px]">Search...</span>
          <kbd className="ml-auto text-[10px] font-medium bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-dropdown z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">Notifikasi</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                  <p className="text-[12.5px] text-gray-700 font-medium">Selamat datang di Klinik UMKM</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Platform keuangan Anda sudah aktif</p>
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                <button type="button" className="text-[12px] font-medium text-[#0F4C9A] hover:underline">
                  Tandai semua sudah dibaca
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4C9A] text-[11px] font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12.5px] font-semibold text-gray-900 leading-tight">{session?.user?.name || "User"}</p>
              <p className="text-[10.5px] font-medium text-gray-500 leading-tight">{session?.user?.role || "UMKM"}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-gray-400 transition-transform ${showProfile ? "rotate-180" : ""}`}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-dropdown z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">{session?.user?.name}</p>
                <p className="text-[11px] text-gray-400">{session?.user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/dashboard/profil-usaha"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setShowProfile(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profil Saya
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  onClick={() => setShowProfile(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}