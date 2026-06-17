import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { forumTopicSchema } from "@/lib/validation";

export async function GET() {
  const topics = await prisma.forumTopic.findMany({
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      likes: true,
    },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ topics });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const json = await request.json();
  if (json.type === "comment") {
    const { topicId, content } = json;
    if (!topicId || !content) {
      return NextResponse.json({ error: "Data komentar tidak valid." }, { status: 400 });
    }
    const comment = await prisma.forumComment.create({
      data: {
        topicId,
        authorId: session.user.id,
        content,
      },
    });
    return NextResponse.json({ comment });
  }

  const parse = forumTopicSchema.safeParse(json);
  if (!parse.success) {
    const errors = parse.error.issues.map((i) => i.message).join("; ");
    return NextResponse.json({ error: `Data topik tidak valid: ${errors}` }, { status: 400 });
  }

  const topic = await prisma.forumTopic.create({
    data: {
      authorId: session.user.id,
      ...parse.data,
    },
  });

  return NextResponse.json({ topic });
}
