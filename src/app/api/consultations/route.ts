import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consultationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const json = await request.json();
  const parse = consultationSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Data konsultasi tidak valid." }, { status: 400 });
  }

  const consultant = await prisma.consultant.findUnique({ where: { id: parse.data.consultantId } });
  if (!consultant) {
    return NextResponse.json({ error: "Konsultan tidak ditemukan." }, { status: 404 });
  }

  const consultation = await prisma.consultation.create({
    data: {
      userId: session.user.id,
      consultantId: consultant.id,
      scheduledAt: new Date(parse.data.scheduledAt),
      status: "PENDING",
    },
  });

  return NextResponse.json({ consultation });
}
