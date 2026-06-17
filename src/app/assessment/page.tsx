import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk melakukan assessment keuangan.</p>
        </div>
      </main>
    );
  }

  const latestAssessment = await prisma.financialAssessment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { score: true, roadmap: true },
  });

  return (
    <AuthenticatedLayout
      title="Financial Health Score"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Financial Health Score" }]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[17px] font-bold text-gray-900">Cek Kesehatan UMKM</h2>
          <p className="mt-1 text-[12.5px] text-gray-500">Analisis cepat untuk menilai profitabilitas, likuiditas, utang, dan growth.</p>
        </div>
        <AssessmentWizard />
        {latestAssessment && latestAssessment.score ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-[15px] font-bold text-gray-900">Assessment Terakhir</h3>
            <p className="mt-2 text-[13px] text-gray-600">Skor terakhir: <span className="font-bold text-gray-900">{latestAssessment.score.finalScore}</span> ({latestAssessment.score.category})</p>
          </div>
        ) : null}
      </div>
    </AuthenticatedLayout>
  );
}