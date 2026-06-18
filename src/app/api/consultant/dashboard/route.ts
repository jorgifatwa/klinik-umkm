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

    // Get all consultations for this consultant
    const allConsultations = await prisma.consultation.findMany({
      where: { consultantId: consultant.id },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    // KPI Calculations
    const totalKonsultasi = allConsultations.length;
    const konsultasiAktif = allConsultations.filter(
      (c) => c.status === "CONFIRMED" || c.status === "PENDING"
    ).length;
    const umkmDampingan = new Set(allConsultations.map((c) => c.userId)).size;
    const konsultasiSelesai = allConsultations.filter((c) => c.status === "COMPLETED").length;
    const tingkatPenyelesaian = totalKonsultasi > 0 ? Math.round((konsultasiSelesai / totalKonsultasi) * 100) : 0;

    // Status breakdown
    const statusBreakdown = {
      selesai: allConsultations.filter((c) => c.status === "COMPLETED").length,
      berjalan: allConsultations.filter((c) => c.status === "CONFIRMED").length,
      dijadwalkan: allConsultations.filter((c) => c.status === "PENDING").length,
      dibatalkan: allConsultations.filter((c) => c.status === "CANCELLED").length,
    };

    // Monthly consultation trends for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

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

      const total = allConsultations.filter(
        (c) => new Date(c.createdAt) >= monthStart && new Date(c.createdAt) <= monthEnd
      ).length;
      const completed = allConsultations.filter(
        (c) =>
          c.status === "COMPLETED" &&
          new Date(c.createdAt) >= monthStart &&
          new Date(c.createdAt) <= monthEnd
      ).length;

      monthCounts.push(total);
      monthCompleted.push(completed);
    }

    // Top UMKM by consultation count
    const umkmCounts = new Map<string, { name: string; count: number; email: string }>();
    allConsultations.forEach((c) => {
      const existing = umkmCounts.get(c.userId) || { name: c.user.name || "UMKM", count: 0, email: c.user.email };
      existing.count += 1;
      umkmCounts.set(c.userId, existing);
    });

    const topUmkm = Array.from(umkmCounts.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        email: data.email,
        totalSessions: data.count,
      }))
      .sort((a, b) => b.totalSessions - a.totalSessions)
      .slice(0, 10);

    // Upcoming consultations (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingConsultations = allConsultations
      .filter((c) => {
        const scheduled = new Date(c.scheduledAt);
        return scheduled >= now && scheduled <= nextWeek && c.status !== "CANCELLED";
      })
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 5)
      .map((c) => ({
        id: c.id,
        clientName: c.user.name || "UMKM",
        clientEmail: c.user.email,
        date: new Date(c.scheduledAt).toISOString().split("T")[0],
        time: new Date(c.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        status: c.status,
      }));

    // Recent activity (last 10 consultations with notes)
    const recentActivity = allConsultations
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        type: c.status === "COMPLETED" ? "Konsultasi selesai" :
              c.status === "CONFIRMED" ? "Konsultasi dikonfirmasi" :
              c.status === "CANCELLED" ? "Konsultasi dibatalkan" :
              "Konsultasi dijadwalkan",
        clientName: c.user.name || "UMKM",
        timestamp: c.updatedAt.toISOString(),
        status: c.status,
      }));

    // Generate insights
    const insights: string[] = [];
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthStart = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0);
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);

    const lastMonthCount = allConsultations.filter(
      (c) => new Date(c.createdAt) >= lastMonthStart && new Date(c.createdAt) <= lastMonthEnd
    ).length;
    const thisMonthCount = allConsultations.filter(
      (c) => new Date(c.createdAt) >= thisMonthStart
    ).length;

    if (lastMonthCount > 0) {
      const change = ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100;
      if (change > 0) {
        insights.push(`Jumlah konsultasi meningkat ${Math.round(change)}% dibanding bulan lalu.`);
      } else if (change < 0) {
        insights.push(`Jumlah konsultasi menurun ${Math.abs(Math.round(change))}% dibanding bulan lalu.`);
      } else {
        insights.push("Jumlah konsultasi stabil dibanding bulan lalu.");
      }
    }

    const needsFollowUp = allConsultations.filter(
      (c) => c.status === "PENDING" && new Date(c.scheduledAt) < now
    ).length;
    if (needsFollowUp > 0) {
      insights.push(`${needsFollowUp} UMKM memerlukan tindak lanjut minggu ini.`);
    }

    if (tingkatPenyelesaian >= 80) {
      insights.push(`Rata-rata tingkat penyelesaian konsultasi mencapai ${tingkatPenyelesaian}%.`);
    } else if (tingkatPenyelesaian > 0) {
      insights.push(`Tingkat penyelesaian konsultasi saat ini ${tingkatPenyelesaian}%.`);
    }

    if (insights.length === 0) {
      insights.push("Belum ada data yang cukup untuk menghasilkan insight.");
    }

    // Recent clients (deduplicated by userId)
    const seen = new Set<string>();
    const uniqueRecentClients = allConsultations
      .map((c) => ({
        id: c.userId,
        name: c.user.name || "UMKM",
        email: c.user.email,
        status: c.status,
        date: c.scheduledAt.toISOString(),
      }))
      .filter((client) => {
        if (seen.has(client.id)) return false;
        seen.add(client.id);
        return true;
      })
      .slice(0, 5);

    return NextResponse.json({
      kpi: {
        totalKonsultasi,
        konsultasiAktif,
        umkmDampingan,
        tingkatPenyelesaian,
      },
      trends: {
        labels: monthLabels,
        total: monthCounts,
        completed: monthCompleted,
      },
      statusBreakdown,
      topUmkm,
      upcomingConsultations,
      recentActivity,
      insights,
      recentClients: uniqueRecentClients,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}