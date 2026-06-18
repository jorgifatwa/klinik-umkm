import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Main Footer */}
        <div className="grid gap-10 py-12 sm:py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt={"SUFIC'C"}
                className="h-8 w-8 rounded-lg object-cover"
              />
              <div>
                <p className="text-sm font-bold text-[#0F4C9A]">
                  {"SUFIC'C"}
                </p>
                <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
                  Sustainable Financial Clinic Cianjur
                </p>
              </div>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Platform digital pendampingan keuangan untuk Usaha Mikro, Kecil,
              dan Menengah di Indonesia.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Layanan
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Artikel Edukasi", href: "/articles" },
                { label: "Kalkulator Keuangan", href: "/calculators" },
                { label: "Forum Komunitas", href: "/forum" },
                { label: "Cek Kesehatan Keuangan", href: "/assessment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-[#0F4C9A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Sumber Daya
            </h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Konsultasi", href: "/consultations" },
                { label: "AI Assistant", href: "/chat" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Profile", href: "/profile" },
              ].map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-[#0F4C9A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900">
              Kontak
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                info@klinikumkm.go.id
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <svg
                  className="h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                (021) 1234-5678
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 py-6 sm:flex-row">
          <p className="text-xs text-gray-400">
            © 2026 {"SUFIC'C"}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <Link
              href="/auth/login"
              className="transition-colors hover:text-[#0F4C9A]"
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="transition-colors hover:text-[#0F4C9A]"
            >
              Daftar
            </Link>
            <span className="text-gray-200">|</span>
            <span className="font-medium text-gray-500">
              Indonesia Maju · UMKM Naik Kelas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}