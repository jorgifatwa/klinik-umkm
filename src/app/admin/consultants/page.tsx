import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminConsultantsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Anda tidak memiliki akses admin.</p>
        </div>
      </main>
    );
  }

  const consultants = await prisma.consultant.findMany({
    include: {
      user: true,
      consultations: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AuthenticatedLayout
      title="Manajemen Konsultan"
      breadcrumbs={[{ label: "Home", href: "/admin/dashboard" }, { label: "Admin", href: "/admin" }, { label: "Konsultan" }]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-gray-900">Daftar Konsultan</h2>
              <p className="mt-1 text-[12.5px] text-gray-500">Kelola data konsultan yang terdaftar di platform.</p>
            </div>
            <span className="rounded-md bg-[#E8F0FE] px-3 py-1 text-[12px] font-semibold text-[#0F4C9A]">{consultants.length} konsultan</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {consultants.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {consultants.map((c) => {
                const completedCount = c.consultations.filter((cs) => cs.status === "COMPLETED").length;
                return (
                  <div key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-[13px] font-bold text-[#8B5CF6]">
                      {c.user.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-gray-900">{c.user.name || "Konsultan"}</p>
                      <p className="text-[11.5px] text-gray-400">{c.user.email}</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="text-[12px] font-semibold text-gray-900">{c.speciality}</p>
                      <p className="text-[11px] text-gray-400">{c.consultations.length} sesi · {completedCount} selesai</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[13px] font-medium text-gray-500">Belum ada konsultan terdaftar</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}