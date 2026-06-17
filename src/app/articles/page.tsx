import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";
import { ArticlesContent } from "@/components/articles/articles-content";
import { AuthenticatedArticles } from "@/components/articles/authenticated-articles";

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const user = await getCurrentUser();
  const articles = await prisma.article.findMany({
    where: { published: true },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
  });

  const serializedArticles = articles.map((a) => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  // If user is logged in, show authenticated layout
  if (user) {
    return (
      <AuthenticatedArticles
        articles={serializedArticles}
        user={{ name: user.name ?? null, id: user.id }}
      />
    );
  }

  // Public view
  return (
    <ArticlesContent
      articles={serializedArticles}
      user={null}
    />
  );
}