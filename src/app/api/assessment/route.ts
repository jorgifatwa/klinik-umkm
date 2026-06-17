import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assessmentSchema } from "@/lib/validation";
import { calculateFinancialScore, generateRoadmapFromScore } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const json = await request.json();
  const parse = assessmentSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Data assessment tidak valid." }, { status: 400 });
  }

  const score = calculateFinancialScore(parse.data);
  const roadmap = generateRoadmapFromScore(score.finalScore);

  const assessment = await prisma.financialAssessment.create({
    data: {
      userId: session.user.id,
      ...parse.data,
      score: {
        create: {
          profitabilityScore: score.profitabilityScore,
          liquidityScore: score.liquidityScore,
          debtScore: score.debtScore,
          growthScore: score.growthScore,
          finalScore: score.finalScore,
          category: score.category,
          strengths: score.strengths,
          weaknesses: score.weaknesses,
          recommendations: score.recommendations,
        },
      },
    },
    include: {
      score: true,
    },
  });

  const roadmapRecord = await prisma.roadmap.create({
    data: {
      userId: session.user.id,
      assessmentId: assessment.id,
      target3Months: roadmap.target3Months,
      target6Months: roadmap.target6Months,
      target1Year: roadmap.target1Year,
    },
  });

  return NextResponse.json({ assessment: { ...assessment, roadmap: roadmapRecord } });
}
