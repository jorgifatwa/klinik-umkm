import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

const allowedStatuses = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const status = body?.status;
  const consultantId = body?.consultantId;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {};

  if (status) {
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }
    data.status = status;
  }

  if (consultantId) {
    const consultant = await prisma.consultant.findUnique({ where: { id: consultantId } });
    if (!consultant) {
      return NextResponse.json({ error: "Konsultan tidak ditemukan." }, { status: 404 });
    }
    data.consultant = { connect: { id: consultantId } };
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Tidak ada data yang diperbarui." }, { status: 400 });
  }

  const consultation = await prisma.consultation.update({
    where: { id },
    data,
    include: {
      user: true,
      consultant: { include: { user: true } },
    },
  });

  return NextResponse.json({ consultation });
}
