import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultants = await prisma.consultant.findMany({
    include: {
      user: true,
      consultations: { select: { id: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    consultants: consultants.map((consultant) => {
      const completed = consultant.consultations.filter((c) => c.status === "COMPLETED").length;
      const total = consultant.consultations.length;
      return {
        id: consultant.id,
        name: consultant.user.name ?? consultant.user.email,
        email: consultant.user.email,
        speciality: consultant.speciality,
        bio: consultant.bio,
        totalConsultations: total,
        completedConsultations: completed,
        status: consultant.user.emailVerified ? "ACTIVE" : "ACTIVE",
      };
    }),
  });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, speciality, bio } = body;

  if (!userId || !speciality) {
    return NextResponse.json({ error: "Data konsultan tidak lengkap." }, { status: 400 });
  }

  const existing = await prisma.consultant.findUnique({ where: { userId } });
  if (existing) {
    return NextResponse.json({ error: "User ini sudah terdaftar sebagai konsultan." }, { status: 400 });
  }

  const consultant = await prisma.consultant.create({
    data: {
      userId,
      speciality,
      bio: bio || "",
    },
    include: { user: true },
  });

  return NextResponse.json({ consultant });
}
