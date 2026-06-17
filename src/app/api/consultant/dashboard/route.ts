import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }

    if (session.user.role !== "KONSULTAN") {
      return NextResponse.json({ error: "Hanya untuk konsultan." }, { status: 403 });
    }

    const consultant = await prisma.consultant.findUnique({ where: { userId: session.user.id } });
    if (!consultant) {
      return NextResponse.json({ error: "Profil konsultan tidak ditemukan." }, { status: 404 });
    }

    // Get monthly consultation trends for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const consultations = await prisma.consultation.findMany({
      where: {
        consultantId: consultant.id,
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Build monthly trend data
    const monthLabels: string[] = [];
    const monthCounts: number[] = [];
    const monthCompleted: number[] = [];

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const monthKey = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
      monthLabels.push(monthKey);

      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

      const total = consultations.filter(
        (c) => new Date(c.createdAt) >= monthStart && new Date(c.createdAt) <= monthEnd
      ).length;
      const completed = consultations.filter(
        (c) =>
          c.status === "COMPLETED" &&
          new Date(c.createdAt) >= monthStart &&
          new Date(c.createdAt) <= monthEnd
      ).length;

      monthCounts.push(total);
      monthCompleted.push(completed);
    }

    // Recent clients
    const recentConsultations = await prisma.consultation.findMany({
      where: { consultantId: consultant.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      trends: {
        labels: monthLabels,
        total: monthCounts,
        completed: monthCompleted,
      },
      recentClients: recentConsultations.map((c) => ({
        id: c.userId,
        name: c.user.name || "UMKM",
        email: c.user.email,
        status: c.status,
        date: c.scheduledAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}