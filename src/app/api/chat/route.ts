import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const answerMap: Record<string, string> = {
  "cara menghitung laba": "Laba bersih dihitung dari pendapatan dikurangi total biaya operasional dan biaya lainnya.",
  "apa itu cash flow": "Cash flow adalah aliran masuk dan keluar kas dalam periode usaha, penting untuk menjaga likuiditas.",
  "bagaimana menentukan harga jual": "Harga jual ditentukan berdasarkan biaya produksi, biaya operasional, dan margin keuntungan yang ditargetkan.",
};

function buildAnswer(question: string) {
  const key = question.toLowerCase();
  for (const trigger of Object.keys(answerMap)) {
    if (key.includes(trigger)) {
      return answerMap[trigger];
    }
  }
  return "Asisten UMKM merekomendasikan fokus pada laporan laba rugi, arus kas, dan manajemen modal agar usaha lebih sehat.";
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { question } = await request.json();
  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Pertanyaan tidak valid." }, { status: 400 });
  }

  const answer = buildAnswer(question);

  await prisma.chatHistory.create({
    data: {
      userId: session.user.id,
      sessionId: `${session.user.id}-${Date.now()}`,
      question,
      answer,
    },
  });

  return NextResponse.json({ answer });
}
