import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { businessProfileSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
    }

    let json: Record<string, unknown>;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
    }

    const parse = businessProfileSchema.safeParse(json);
    if (!parse.success) {
      const issues = parse.error.issues.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      return NextResponse.json(
        { error: "Data profil tidak valid.", details: issues },
        { status: 400 }
      );
    }

    const profile = await prisma.businessProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        ...parse.data,
      },
      update: {
        ...parse.data,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan profil.";
    console.error("Profile save error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat menyimpan profil.",
        detail: message,
        ...(process.env.NODE_ENV !== "production" && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 }
    );
  }
}