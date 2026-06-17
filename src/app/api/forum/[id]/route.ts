import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { id } = await params;

  const topic = await prisma.forumTopic.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!topic) {
    return NextResponse.json({ error: "Topik tidak ditemukan." }, { status: 404 });
  }

  // Only admin or topic author can delete
  if (topic.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak memiliki izin." }, { status: 403 });
  }

  // Delete likes, comments, then topic
  await prisma.forumLike.deleteMany({ where: { topicId: id } });
  await prisma.forumComment.deleteMany({ where: { topicId: id } });
  await prisma.forumTopic.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}