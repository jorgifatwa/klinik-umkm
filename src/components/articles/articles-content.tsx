"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string | null;
  category: { name: string };
  author: { name: string | null };
  createdAt: string;
}

interface ArticlesPageProps {
  articles: Article[];
  user: { name: string | null } | null;
}

const categoryColors: Record<string, { bg: string; text: string; hover: string }> = {
  "Cash Flow": { bg: "bg-[#E8F0FE]", text: "text-[#0F4C9A]", hover: "hover:bg-[#0F4C9A]" },
  "Laporan Keuangan": { bg: "bg-[#E6F9EC]", text: "text-[#37B24D]", hover: "hover:bg-[#37B24D]" },
  "Investasi": { bg: "bg-blue-50", text: "text-blue-600", hover: "hover:bg-blue-600" },
  "Pembiayaan": { bg: "bg-amber-50", text: "text-amber-600", hover: "hover:bg-amber-600" },
  "Syariah": { bg: "bg-purple-50", text: "text-purple-600", hover: "hover:bg-purple-600" },
};

const defaultColor = { bg: "bg-gray-100", text: "text-gray-600", hover: "hover:bg-gray-600" };

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export function ArticlesContent({ articles }: ArticlesPageProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  const categories = useMemo(
    () => [...new Set(articles.map((a) => a.category.name))],
    [articles]
  );

  const filtered = useMemo(() => {
    let result = articles;

    if (activeCategory !== "Semua") {
      result = result.filter((a) => a.category.name === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery]);

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    return filtered.slice(startIndex, startIndex + articlesPerPage);
  }, [filtered, currentPage]);

  const totalPages = Math.ceil(filtered.length / articlesPerPage);

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#0F4C9A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(30,115,216,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Edukasi & Literasi Keuangan
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Artikel & Edukasi
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Kumpulan artikel tentang pengelolaan arus kas, laporan keuangan,
                investasi, pembiayaan, dan prinsip keuangan syariah untuk UMKM.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari artikel tentang keuangan, investasi, pajak..."
                  className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/50 backdrop-blur transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("Semua");
                setCurrentPage(1);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === "Semua"
                  ? "bg-[#0F4C9A] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua ({articles.length})
            </button>
            {categories.map((cat) => {
              const count = articles.filter((a) => a.category.name === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-[#0F4C9A] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Featured Article */}
          {featuredArticle && activeCategory === "Semua" && !searchQuery && (
            <div className="mt-10">
              <Link
                href={`/articles/${featuredArticle.slug}`}
                className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:grid sm:grid-cols-[1.2fr_1fr]"
              >
                <div className="relative h-64 overflow-hidden sm:h-full sm:min-h-[320px]">
                  {featuredArticle.image ? (
                    <img
                      src={featuredArticle.image}
                      alt={featuredArticle.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50">
                      <svg className="h-16 w-16 text-[#0F4C9A]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-[#0F4C9A] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                      Unggulan
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1E73D8]">
                    {featuredArticle.category.name}
                  </span>
                  <h2 className="mt-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#0F4C9A] sm:text-2xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FE] text-xs font-bold text-[#0F4C9A]">
                        {getInitials(featuredArticle.author.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {featuredArticle.author.name || "Tim Klinik UMKM"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(featuredArticle.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span className="ml-auto text-sm font-semibold text-[#1E73D8] opacity-0 transition-opacity group-hover:opacity-100">
                      Baca →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          <div className="mt-10">
            {paginatedArticles.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedArticles.map((article) => {
                  const colors = categoryColors[article.category.name] || defaultColor;
                  return (
                    <Link
                      key={article.id}
                      href={`/articles/${article.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50/50">
                            <svg className="h-12 w-12 text-[#0F4C9A]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute left-3 top-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}>
                            {article.category.name}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#0F4C9A]">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-500">
                          {article.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F0FE] text-[10px] font-bold text-[#0F4C9A]">
                              {getInitials(article.author.name)}
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {article.author.name || "Tim Klinik UMKM"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span>{formatDate(article.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-16 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-600">
                  Belum ada artikel yang ditemukan.
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Coba kata kunci lain atau ubah kategori.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    page === currentPage
                      ? "bg-[#0F4C9A] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}