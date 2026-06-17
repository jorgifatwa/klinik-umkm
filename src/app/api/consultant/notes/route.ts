import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createNoteSchema = z.object({
  consultationId: z.string().uuid(),
  content: z.string().min(1, "Catatan tidak boleh kosong").max(1000, "Catatan maksimal 1000 karakter"),
});

export async function POST(request: Request) {
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

    const json = await request.json();
    const parse = createNoteSchema.safeParse(json);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Data tidak valid.", details: parse.error.issues.map(i => i.message) },
        { status: 400 }
      );
    }

    // Verify the consultation belongs to this consultant
    const consultation = await prisma.consultation.findFirst({
      where: { id: parse.data.consultationId, consultantId: consultant.id },
    });

    if (!consultation) {
      return NextResponse.json({ error: "Konsultasi tidak ditemukan." }, { status: 404 });
    }

    const note = await prisma.consultationNote.create({
      data: {
        consultationId: parse.data.consultationId,
        content: parse.data.content,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan." }, { status: 500 });
  }
}