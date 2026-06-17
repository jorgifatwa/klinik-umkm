import { AuthenticatedForum } from "@/components/forum/authenticated-forum";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export const dynamic = "force-dynamic";

export default async function ConsultantForumPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login.</p>
        </div>
      </main>
    );
  }

  const topics = await prisma.forumTopic.findMany({
    include: {
      author: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      likes: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <AuthenticatedForum
      topics={topics}
      currentUserId={user.id}
      currentUserRole={(user as { role: string }).role}
    />
  );
}