import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { articleSchema } from "@/lib/validation";

export async function GET() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  let json;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body tidak valid." }, { status: 400 });
  }

  const parse = articleSchema.safeParse(json);
  if (!parse.success) {
    const errors = parse.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    return NextResponse.json({ error: `Data tidak valid: ${errors}` }, { status: 400 });
  }

  // Verify user exists in database (important after db:seed which recreates users with new IDs)
  const userExists = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!userExists) {
    return NextResponse.json({ error: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
  }

  try {
    const { image, published, ...rest } = parse.data;
    const article = await prisma.article.create({
      data: {
        ...rest,
        image: image || null,
        authorId: session.user.id,
        published: published ?? false,
      },
    });
    return NextResponse.json({ article });
  } catch (err) {
    console.error("Error creating article:", err);
    const msg = err instanceof Error ? err.message : "Gagal menyimpan artikel.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
