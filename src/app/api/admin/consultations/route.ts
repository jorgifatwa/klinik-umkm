import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    include: {
      user: true,
      consultant: { include: { user: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ consultations });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const userId = body?.userId;
  const consultantId = body?.consultantId;
  const scheduledAt = body?.scheduledAt;

  if (!userId || !consultantId || !scheduledAt) {
    return NextResponse.json({ error: "Data konsultasi tidak lengkap." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "UMKM tidak ditemukan." }, { status: 404 });
  }

  const consultant = await prisma.consultant.findUnique({ where: { id: consultantId } });
  if (!consultant) {
    return NextResponse.json({ error: "Konsultan tidak ditemukan." }, { status: 404 });
  }

  const scheduledDate = new Date(scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) {
    return NextResponse.json({ error: "Jadwal tidak valid." }, { status: 400 });
  }

  const consultation = await prisma.consultation.create({
    data: {
      userId,
      consultantId,
      scheduledAt: scheduledDate,
      status: "PENDING",
    },
  });

  return NextResponse.json({ consultation });
}
