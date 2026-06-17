import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  bio: z.string().min(3, "Bio minimal 3 karakter").max(500, "Bio maksimal 500 karakter"),
  speciality: z.string().min(3, "Spesialisasi minimal 3 karakter").max(100, "Spesialisasi maksimal 100 karakter"),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }

    if (session.user.role !== "KONSULTAN") {
      return NextResponse.json({ error: "Hanya untuk konsultan." }, { status: 403 });
    }

    const consultant = await prisma.consultant.findUnique({
      where: { userId: session.user.id },
    });

    const totalConsultations = consultant
      ? await prisma.consultation.count({ where: { consultantId: consultant.id } })
      : 0;
    const completedConsultations = consultant
      ? await prisma.consultation.count({ where: { consultantId: consultant.id, status: "COMPLETED" } })
      : 0;
    const totalClients = consultant
      ? new Set(
          (await prisma.consultation.findMany({ where: { consultantId: consultant.id }, select: { userId: true } })).map((c) => c.userId)
        ).size
      : 0;

    return NextResponse.json({
      consultant: consultant || { bio: "", speciality: "" },
      stats: {
        totalConsultations,
        totalClients,
        completedConsultations,
      },
    });
  } catch (error) {
    console.error("Consultant profile fetch error:", error);
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

    const json = await request.json();
    const parse = updateProfileSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Data tidak valid.", details: parse.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    const consultant = await prisma.consultant.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        bio: parse.data.bio,
        speciality: parse.data.speciality,
      },
      update: {
        bio: parse.data.bio,
        speciality: parse.data.speciality,
      },
    });

    return NextResponse.json({ consultant });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan.";
    console.error("Consultant profile update error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan.", detail: message }, { status: 500 });
  }
}