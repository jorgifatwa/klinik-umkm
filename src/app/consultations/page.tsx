import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { ConsultationPanel } from "@/components/consultations/consultation-panel";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConsultationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses fitur konsultasi.</p>
        </div>
      </main>
    );
  }

  const consultants = await prisma.consultant.findMany({ include: { user: true } });
  const consultations = await prisma.consultation.findMany({
    where: { userId: user.id },
    include: { consultant: { include: { user: true } } },
    orderBy: { scheduledAt: "asc" },
  });

  const consultationItems = consultations.map((consultation) => ({
    id: consultation.id,
    scheduledAt: consultation.scheduledAt.toISOString(),
    status: consultation.status,
    consultantName: consultation.consultant.user.name ?? "Konsultan UMKM",
  }));

  return (
    <AuthenticatedLayout
      title="Konsultasi"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Konsultasi" }]}
    >
      <ConsultationPanel consultants={consultants} initialConsultations={consultationItems} />
    </AuthenticatedLayout>
  );
}