import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const json = await request.json();
  const { commentId } = json;
  if (!commentId) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const comment = await prisma.forumComment.findUnique({
    where: { id: commentId },
    select: { authorId: true },
  });

  if (!comment) {
    return NextResponse.json({ error: "Komentar tidak ditemukan." }, { status: 404 });
  }

  // Only admin or comment author can delete
  if (comment.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Tidak memiliki izin." }, { status: 403 });
  }

  await prisma.forumComment.delete({ where: { id: commentId } });

  return NextResponse.json({ deleted: true });
}