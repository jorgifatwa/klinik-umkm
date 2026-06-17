import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const json = await request.json();
  const { topicId } = json;
  if (!topicId) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  // Verify user exists in database (important after db:seed which recreates users)
  const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!userExists) {
    return NextResponse.json({ error: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
  }

  const existing = await prisma.forumLike.findUnique({
    where: { topicId_userId: { topicId, userId: session.user.id } },
  });

  if (existing) {
    await prisma.forumLike.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false });
  } else {
    await prisma.forumLike.create({
      data: { topicId, userId: session.user.id },
    });
    return NextResponse.json({ liked: true });
  }
}