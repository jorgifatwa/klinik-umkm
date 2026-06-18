import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "SUFIC'C - Sustainable Financial Clinic Cianjur",
  description: "Platform pendampingan, konsultasi, dan kesehatan keuangan UMKM untuk mewujudkan Cianjur yang berdaya melalui keuangan yang cerdas dan berkelanjutan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-slate-50 text-slate-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
