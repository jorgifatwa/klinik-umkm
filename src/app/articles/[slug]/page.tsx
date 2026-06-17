import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import type { Metadata } from "next";

interface ArticleWithRelations {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  published: boolean;
  categoryId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  category: { id: string; name: string; slug: string; createdAt: Date };
  author: { id: string; name: string | null; email: string; createdAt: Date; updatedAt: Date };
}

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  return {
    title: article ? `${article.title} | Klinik UMKM` : "Artikel",
    description: article?.excerpt,
  };
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function getInitials(name: string | null): string {
  if (!name) return "TK";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;

  const rawArticle = await prisma.article.findUnique({
    where: { slug, published: true },
    include: { category: true, author: true },
  });

  if (!rawArticle) return notFound();

  const article = rawArticle as unknown as ArticleWithRelations;

  // Get related articles
  const relatedArticles = (await prisma.article.findMany({
    where: {
      published: true,
      categoryId: article.categoryId,
      id: { not: article.id },
    },
    include: { category: true, author: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  })) as unknown as ArticleWithRelations[];

  const readingTime = estimateReadingTime(article.content);
  const formattedDate = new Date(article.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Generate table of contents from content headings (lines that start with # or are short paragraphs)
  const paragraphs: string[] = article.content.split("\n").filter((p: string) => p.trim());
  const headings: string[] = paragraphs
    .filter((p: string) => p.length < 80 && p === p.trim())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0F4C9A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(30,115,216,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                Beranda
              </Link>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <Link href="/articles" className="transition-colors hover:text-white">
                Artikel
              </Link>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-white/80 truncate max-w-[200px]">{article.title}</span>
            </nav>

            <div className="mx-auto mt-8 max-w-3xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                {article.category.name}
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                {article.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                {article.excerpt}
              </p>

              {/* Author & Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold text-white">
                    {getInitials(article.author.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {article.author.name || "Tim Klinik UMKM"}
                    </p>
                    <p className="text-xs text-white/50">Penulis</p>
                  </div>
                </div>
                <div className="hidden sm:block h-5 w-px bg-white/20" />
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {readingTime} menit baca
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
            {/* Main Content */}
            <article className="max-w-3xl">
              {/* Article Image */}
              {article.image && (
                <div className="mb-10 overflow-hidden rounded-2xl">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={400}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Callout */}
              <div className="mb-10 rounded-2xl border-l-4 border-[#0F4C9A] bg-[#E8F0FE] p-6">
                <p className="text-base font-medium leading-relaxed text-[#0F4C9A] italic">
                  {article.excerpt}
                </p>
              </div>

              {/* Content Body */}
              <div className="prose-custom space-y-5 text-base leading-8 text-gray-700">
                {paragraphs.map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Share Section */}
              <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Bagikan artikel ini</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Bantu sesama UMKM mendapatkan informasi bermanfaat
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== "undefined" ? window.location.href : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-[#0F4C9A]/20 hover:bg-[#E8F0FE] hover:text-[#0F4C9A]"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${typeof window !== "undefined" ? window.location.href : ""}&text=${article.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-[#0F4C9A]/20 hover:bg-[#E8F0FE] hover:text-[#0F4C9A]"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={`https://wa.me/?text=${article.title}%20${typeof window !== "undefined" ? window.location.href : ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-[#0F4C9A]/20 hover:bg-[#E8F0FE] hover:text-[#0F4C9A]"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-[#0F4C9A]/20 hover:bg-[#E8F0FE] hover:text-[#0F4C9A]"
                      title="Salin link"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0FE] text-lg font-bold text-[#0F4C9A]">
                    {getInitials(article.author.name)}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {article.author.name || "Tim Klinik UMKM"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Penulis — SUFICSUFICSUFIC&apos;Capos;Capos;C
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Ditulis pada {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sticky Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="rounded-2xl border border-gray-100 bg-white p-5">
                  <h3 className="text-sm font-semibold text-gray-900">Daftar Isi</h3>
                  <ul className="mt-3 space-y-2">
                    {headings.map((heading: string, i: number) => (
                      <li key={i}>
                        <span className="block text-xs leading-relaxed text-gray-500 hover:text-[#0F4C9A] transition-colors cursor-pointer line-clamp-2">
                          {heading.length > 60 ? heading.slice(0, 60) + "..." : heading}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Back to articles */}
                <Link
                  href="/articles"
                  className="mt-4 flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-600 transition-all hover:border-[#0F4C9A]/20 hover:text-[#0F4C9A]"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Kembali ke Artikel
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 border-t border-gray-100 pt-12">
              <h2 className="text-2xl font-bold text-gray-900">Artikel Terkait</h2>
              <p className="mt-2 text-sm text-gray-500">
                Artikel lainnya dari kategori {article.category.name}
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {related.image ? (
                        <Image
                          src={related.image}
                          alt={related.title}
                          width={400}
                          height={200}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50/50">
                          <svg className="h-10 w-10 text-[#0F4C9A]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-[#0F4C9A]">
                        {related.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500">
                        {related.excerpt}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                        <span>{related.author.name || "Tim Klinik UMKM"}</span>
                        <span className="font-semibold text-[#1E73D8] opacity-0 transition-opacity group-hover:opacity-100">
                          Baca →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}