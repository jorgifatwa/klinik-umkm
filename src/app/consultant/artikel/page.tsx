import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { AuthenticatedArticles } from "@/components/articles/authenticated-articles";

export const dynamic = "force-dynamic";

export default async function ConsultantArtikelPage() {
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

  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedArticles = articles.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <AuthenticatedArticles
      articles={serializedArticles}
      user={{ name: user.name ?? null, id: user.id }}
    />
  );
}