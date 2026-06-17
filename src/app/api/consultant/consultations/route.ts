import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

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
      return NextResponse.json({ consultations: [] });
    }

    const consultations = await prisma.consultation.findMany({
      where: { consultantId: consultant.id },
      include: { user: { include: { businessProfile: true } } },
      orderBy: { scheduledAt: "asc" },
    });

    const items = consultations.map((c) => ({
      id: c.id,
      scheduledAt: c.scheduledAt.toISOString(),
      status: c.status,
      userName: c.user.name ?? "-",
      userEmail: c.user.email,
      businessName: c.user.businessProfile?.businessName ?? null,
      industry: c.user.businessProfile?.industry ?? null,
    }));

    return NextResponse.json({ consultations: items });
  } catch (error) {
    console.error("Consultant consultations fetch error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
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

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID dan status diperlukan." }, { status: 400 });
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }

    const consultation = await prisma.consultation.findFirst({
      where: { id, consultantId: consultant.id },
    });

    if (!consultation) {
      return NextResponse.json({ error: "Konsultasi tidak ditemukan." }, { status: 404 });
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ consultation: updated });
  } catch (error) {
    console.error("Consultant consultation update error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}