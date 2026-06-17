import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
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

  const totalUsers = await prisma.user.count();
  const totalArticles = await prisma.article.count();
  const totalConsultations = await prisma.consultation.count();
  const totalForumTopics = await prisma.forumTopic.count();
  const totalCategories = await prisma.category.count();

  return (
    <AuthenticatedLayout
      title="Pengaturan"
      breadcrumbs={[{ label: "Home", href: "/admin/dashboard" }, { label: "Admin", href: "/admin" }, { label: "Pengaturan" }]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[17px] font-bold text-gray-900">Pengaturan Platform</h2>
          <p className="mt-1 text-[12.5px] text-gray-500">Informasi dan statistik platform SUFICSUFICSUFIC&apos;Capos;Capos;C.</p>
        </div>

        {/* System Stats */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-[14px] font-bold text-gray-900">Statistik Sistem</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Total Pengguna", value: totalUsers, color: "#0F4C9A" },
              { label: "Total Artikel", value: totalArticles, color: "#37B24D" },
              { label: "Total Konsultasi", value: totalConsultations, color: "#8B5CF6" },
              { label: "Topik Forum", value: totalForumTopics, color: "#1E73D8" },
              { label: "Kategori Artikel", value: totalCategories, color: "#D97706" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  <p className="text-[12px] font-medium text-gray-500">{stat.label}</p>
                </div>
                <p className="mt-2 text-[20px] font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Info */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-[14px] font-bold text-gray-900">Informasi Platform</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Nama Platform", value: "SUFICSUFICSUFIC&apos;Capos;Capos;C" },
              { label: "Versi", value: "1.0.0" },
              { label: "Framework", value: "Next.js" },
              { label: "Database", value: "PostgreSQL (Prisma)" },
              { label: "Autentikasi", value: "NextAuth.js" },
              { label: "Status", value: "Aktif" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">{item.label}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}