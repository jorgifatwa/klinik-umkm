import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

const allowedStatuses = ["CONFIRMED", "COMPLETED", "CANCELLED"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "KONSULTAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultant = await prisma.consultant.findUnique({ where: { userId: currentUser.id } });
  if (!consultant) {
    return NextResponse.json({ error: "Konsultan tidak ditemukan." }, { status: 404 });
  }

  const body = await request.json();
  const status = body?.status;
  if (!status || !allowedStatuses.includes(status)) {
    return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
  }

  const consultation = await prisma.consultation.findUnique({ where: { id } });
  if (!consultation || consultation.consultantId !== consultant.id) {
    return NextResponse.json({ error: "Konsultasi tidak ditemukan atau tidak diizinkan." }, { status: 404 });
  }

  const updatedConsultation = await prisma.consultation.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ consultation: updatedConsultation });
}
