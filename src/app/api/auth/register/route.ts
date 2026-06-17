import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const json = await request.json();
  const parse = registerSchema.safeParse(json);
  if (!parse.success) {
    return NextResponse.json({ error: "Data pendaftaran tidak valid." }, { status: 400 });
  }

  const { name, email, password, role } = parse.data;
  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const createdUser = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      consultant: role === "KONSULTAN" ? { create: { bio: "Konsultan UMKM", speciality: "Keuangan UMKM" } } : undefined,
    },
  });

  return NextResponse.json({ userId: createdUser.id, message: "Akun berhasil dibuat." });
}
