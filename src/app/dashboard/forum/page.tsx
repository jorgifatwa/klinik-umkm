import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { AuthenticatedForum } from "@/components/forum/authenticated-forum";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardForumPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <PublicNavbar />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses forum.</p>
          <Link href="/auth/login" className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Masuk
          </Link>
        </main>
        <PublicFooter />
      </div>
    );
  }

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

  const authUser = user as { id: string; role: string } | null;

  return (
    <AuthenticatedForum
      topics={topics}
      currentUserId={authUser?.id ?? ""}
      currentUserRole={authUser?.role ?? "UMKM"}
    />
  );
}