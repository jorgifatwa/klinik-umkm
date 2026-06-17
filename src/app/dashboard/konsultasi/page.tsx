import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { ConsultationPanel } from "@/components/consultations/consultation-panel";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardKonsultasiPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses fitur konsultasi.</p>
          <Link href="/auth/login" className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Masuk
          </Link>
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