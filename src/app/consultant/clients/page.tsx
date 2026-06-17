import Link from "next/link";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConsultantClientsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "KONSULTAN") {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Halaman ini hanya untuk konsultan.</p>
        </div>
      </main>
    );
  }

  const consultant = await prisma.consultant.findUnique({ where: { userId: user.id } });
  if (!consultant) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Profil konsultan tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  const consultations = await prisma.consultation.findMany({
    where: { consultantId: consultant.id },
    include: {
      user: {
        include: {
          businessProfile: true,
          assessments: { include: { score: true }, orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
    orderBy: { scheduledAt: "desc" },
  });

  const clientsMap = new Map<string, {
    user: typeof consultations[0]["user"];
    consultations: number;
    lastConsultation: Date;
    consultationIds: string[];
  }>();
  for (const c of consultations) {
    const existing = clientsMap.get(c.userId);
    if (existing) {
      existing.consultations++;
      existing.consultationIds.push(c.id);
    } else {
      clientsMap.set(c.userId, {
        user: c.user,
        consultations: 1,
        lastConsultation: c.scheduledAt,
        consultationIds: [c.id],
      });
    }
  }
  const clients = Array.from(clientsMap.values());

  return (
    <AuthenticatedLayout
      title="Klien Saya"
      breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Klien" }]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[17px] font-bold text-gray-900">Klien UMKM</h2>
          <p className="mt-1 text-[12.5px] text-gray-500">Daftar UMKM yang pernah berkonsultasi dengan Anda.</p>
        </div>

        {/* Search bar */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari klien..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-[13px] text-gray-900 outline-none focus:border-[#0F4C9A] focus:ring-2 focus:ring-[#0F4C9A]/10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.length > 0 ? clients.map((client) => (
            <Link
              key={client.user.id}
              href={`/consultant/clients/${client.user.id}`}
              className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-[var(--shadow-elevated)] transition-all block"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[13px] font-bold text-[#0F4C9A]">
                  {client.user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-gray-900">{client.user.name || "UMKM"}</p>
                  <p className="truncate text-[11.5px] text-gray-400">{client.user.email}</p>
                </div>
              </div>
              {client.user.businessProfile && (
                <div className="mt-4 grid gap-2">
                  <div className="rounded-lg bg-gray-50 px-3 py-2">
                    <p className="text-[10px] font-medium text-gray-400">Usaha</p>
                    <p className="text-[12px] font-semibold text-gray-900">{client.user.businessProfile.businessName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-medium text-gray-400">Industri</p>
                      <p className="text-[12px] font-semibold text-gray-900">{client.user.businessProfile.industry}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                      <p className="text-[10px] font-medium text-gray-400">Lokasi</p>
                      <p className="text-[12px] font-semibold text-gray-900">{client.user.businessProfile.location}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-[11px] text-gray-400">{client.consultations} konsultasi</span>
                <div className="flex items-center gap-2">
                  {client.user.assessments[0]?.score && (
                    <span className="rounded-md bg-[#E8F0FE] px-2 py-0.5 text-[10px] font-bold text-[#0F4C9A]">
                      Skor: {client.user.assessments[0].score.finalScore}
                    </span>
                  )}
                  <svg className="h-3.5 w-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-[13px] font-medium text-gray-500">Belum ada klien</p>
              <p className="mt-1 text-[11.5px] text-gray-400">Klien akan muncul di sini setelah ada konsultasi.</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}