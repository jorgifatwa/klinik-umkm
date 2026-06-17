import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminForumPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Anda tidak memiliki akses admin.</p>
        </div>
      </main>
    );
  }

  const topics = await prisma.forumTopic.findMany({
    include: {
      author: true,
      comments: { select: { id: true } },
      likes: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalTopics = topics.length;
  const totalComments = topics.reduce((sum, t) => sum + t.comments.length, 0);
  const totalLikes = topics.reduce((sum, t) => sum + t.likes.length, 0);

  return (
    <AuthenticatedLayout
      title="Forum Moderation"
      breadcrumbs={[{ label: "Home", href: "/admin/dashboard" }, { label: "Admin", href: "/admin" }, { label: "Forum" }]}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Topik", value: totalTopics, color: "#0F4C9A" },
            { label: "Total Komentar", value: totalComments, color: "#1E73D8" },
            { label: "Total Likes", value: totalLikes, color: "#8B5CF6" },
          ].map((stat) => (
            <div key={stat.label} className="kpi-card">
              <p className="text-[12px] font-medium text-gray-400">{stat.label}</p>
              <p className="mt-1 text-[22px] font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Topics List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[15px] font-bold text-gray-900">Semua Topik Forum</h2>
          <p className="mt-1 text-[12.5px] text-gray-500">Monitor dan moderasi diskusi di forum.</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
          {topics.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {topics.map((topic) => (
                <div key={topic.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">{topic.category}</span>
                      </div>
                      <h3 className="mt-1.5 text-[13px] font-semibold text-gray-900">{topic.title}</h3>
                      <p className="mt-1 text-[12px] text-gray-500 line-clamp-2">{topic.content}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                        <span>oleh {topic.author.name || "Anonymous"}</span>
                        <span>·</span>
                        <span>{topic.comments.length} komentar</span>
                        <span>·</span>
                        <span>{topic.likes.length} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[13px] font-medium text-gray-500">Belum ada topik forum</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}