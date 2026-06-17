import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { FinanceCalculators } from "@/components/calculators/finance-calculators";
import { AuthenticatedCalculators } from "@/components/calculators/authenticated-calculators";
import { getCurrentUser } from "@/lib/get-current-user";

export const dynamic = "force-dynamic";

export default async function CalculatorsPage() {
  const user = await getCurrentUser();

  // If user is logged in, show authenticated layout
  if (user) {
    return <AuthenticatedCalculators />;
  }

  // Public view
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        <section className="relative overflow-hidden bg-[#0F4C9A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(30,115,216,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                </svg>
                Alat Perhitungan Keuangan
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Kalkulator Keuangan
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Hitung laba rugi, titik impas, kebutuhan modal, dan proyeksi
                keuntungan usaha Anda secara instan dan akurat.
              </p>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
          <FinanceCalculators />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}