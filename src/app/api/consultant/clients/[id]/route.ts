import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify the client has consultations with this consultant
    const consultationCount = await prisma.consultation.count({
      where: { consultantId: consultant.id, userId: id },
    });

    if (consultationCount === 0) {
      return NextResponse.json({ error: "Klien tidak ditemukan." }, { status: 404 });
    }

    const clientUser = await prisma.user.findUnique({
      where: { id },
      include: {
        businessProfile: true,
        assessments: {
          include: { score: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!clientUser) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    }

    const consultations = await prisma.consultation.findMany({
      where: { consultantId: consultant.id, userId: id },
      include: {
        notes: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json({
      client: {
        id: clientUser.id,
        name: clientUser.name,
        email: clientUser.email,
        businessProfile: clientUser.businessProfile,
        assessment: clientUser.assessments[0] ?? null,
      },
      consultations: consultations.map((c) => ({
        id: c.id,
        scheduledAt: c.scheduledAt.toISOString(),
        status: c.status,
        notes: c.notes,
      })),
      stats: {
        totalConsultations: consultations.length,
        completedConsultations: consultations.filter((c) => c.status === "COMPLETED").length,
        lastConsultation: consultations[0]?.scheduledAt.toISOString() ?? null,
      },
    });
  } catch (error) {
    console.error("Client detail fetch error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}