import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { FinancialHealthClient } from "@/components/financial-health-client";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardFinancialHealthPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk melakukan assessment keuangan.</p>
          <Link href="/auth/login" className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Masuk
          </Link>
        </div>
      </main>
    );
  }

  const latestAssessment = await prisma.financialAssessment.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      score: true,
      roadmap: { include: { tasks: true } },
    },
  });

  // Serialize assessment data to plain JSON for client component
  const assessmentData = latestAssessment
    ? {
        createdAt: latestAssessment.createdAt.toISOString(),
        score: latestAssessment.score
          ? {
              finalScore: latestAssessment.score.finalScore,
              category: latestAssessment.score.category,
              profitabilityScore: latestAssessment.score.profitabilityScore,
              liquidityScore: latestAssessment.score.liquidityScore,
              debtScore: latestAssessment.score.debtScore,
              growthScore: latestAssessment.score.growthScore,
              strengths: latestAssessment.score.strengths as string[],
              weaknesses: latestAssessment.score.weaknesses as string[],
            }
          : null,
        roadmap: latestAssessment.roadmap
          ? {
              target3Months: latestAssessment.roadmap.target3Months,
              target6Months: latestAssessment.roadmap.target6Months,
              target1Year: latestAssessment.roadmap.target1Year,
              tasks: latestAssessment.roadmap.tasks.map((t) => ({
                completed: t.completed,
              })),
            }
          : null,
      }
    : null;

  return (
    <AuthenticatedLayout
      title="Analisis Keuangan"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Analisis Keuangan" }]}
    >
      <FinancialHealthClient assessment={assessmentData} />
    </AuthenticatedLayout>
  );
}