import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { AuthenticatedArticles } from "@/components/articles/authenticated-articles";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardArtikelPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses artikel.</p>
          <Link href="/auth/login" className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Masuk
          </Link>
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