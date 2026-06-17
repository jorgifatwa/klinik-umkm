import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    console.log(`Reset password request untuk: ${email}`);
  }

  return NextResponse.json({ message: "Jika email terdaftar, instruksi reset telah dikirim." });
}
