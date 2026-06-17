import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { taskId, completed } = await request.json();
  if (!taskId || typeof completed !== "boolean") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const task = await prisma.roadmapTask.update({
    where: { id: taskId },
    data: { completed },
  });

  return NextResponse.json({ task });
}
