import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const published = body?.published;
  if (typeof published !== "boolean") {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const article = await prisma.article.update({
    where: { id },
    data: { published },
  });

  return NextResponse.json({ article });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ message: "Artikel berhasil dihapus." });
}
