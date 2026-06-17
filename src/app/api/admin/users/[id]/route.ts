import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { Role } from "@prisma/client";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  if (!currentUser?.id || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const role = body?.role as Role | undefined;
  if (!role || !["ADMIN", "KONSULTAN", "UMKM"].includes(role)) {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
  }

  if (id === currentUser.id) {
    return NextResponse.json({ error: "Tidak dapat mengubah peran akun sendiri." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user });
}
