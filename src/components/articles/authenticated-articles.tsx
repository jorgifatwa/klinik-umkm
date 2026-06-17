"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";

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

interface AuthenticatedArticlesProps {
  articles: Article[];
  user: { name: string | null; id: string };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  "Cash Flow": { bg: "bg-[#E8F0FE]", text: "text-[#0F4C9A]" },
  "Laporan Keuangan": { bg: "bg-[#E6F9EC]", text: "text-[#37B24D]" },
  "Investasi": { bg: "bg-blue-50", text: "text-blue-600" },
  "Pembiayaan": { bg: "bg-amber-50", text: "text-amber-600" },
  "Syariah": { bg: "bg-purple-50", text: "text-purple-600" },
};

const defaultColor = { bg: "bg-gray-100", text: "text-gray-600" };

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getInitials(name: string | null): string {
  if (!name) return "TK";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function AuthenticatedArticles({ articles }: AuthenticatedArticlesProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
          a.excerpt.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, activeCategory, searchQuery]);

  const featuredArticle = articles.length > 0 && activeCategory === "Semua" && !searchQuery ? articles[0] : null;

  return (
    <AuthenticatedLayout
      title="Artikel & Edukasi"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Artikel" }]}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[17px] font-bold text-gray-900">Artikel & Edukasi Keuangan</h2>
              <p className="mt-1 text-[12.5px] text-gray-500">
                Kumpulan artikel tentang pengelolaan keuangan untuk UMKM.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 transition-all focus:border-[#0F4C9A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F4C9A]/10"
            />
          </div>

          {/* Category Filters */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setActiveCategory("Semua")}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${
                activeCategory === "Semua"
                  ? "bg-[#0F4C9A] text-white"
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
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-[#0F4C9A] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-[var(--shadow-card-hover)] sm:grid sm:grid-cols-[1.2fr_1fr]"
          >
            <div className="relative h-56 overflow-hidden sm:h-full sm:min-h-[280px]">
              {featuredArticle.image ? (
                <img src={featuredArticle.image} alt={featuredArticle.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50">
                  <svg className="h-14 w-14 text-[#0F4C9A]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
              )}
              <div className="absolute left-3 top-3">
                <span className="rounded-lg bg-[#0F4C9A] px-2.5 py-1 text-[10.5px] font-semibold text-white shadow-sm">
                  Unggulan
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-6">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E73D8]">{featuredArticle.category.name}</span>
              <h3 className="mt-2 text-[17px] font-bold text-gray-900 group-hover:text-[#0F4C9A] transition-colors">{featuredArticle.title}</h3>
              <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-gray-500">{featuredArticle.excerpt}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F0FE] text-[9px] font-bold text-[#0F4C9A]">
                    {getInitials(featuredArticle.author.name)}
                  </div>
                  <span className="text-[11px] font-medium text-gray-600">{featuredArticle.author.name || "Tim Klinik UMKM"}</span>
                </div>
                <span className="text-[11px] text-gray-400">·</span>
                <span className="text-[11px] text-gray-400">{formatDate(featuredArticle.createdAt)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Articles Grid/List */}
        {filtered.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((article) => {
                const colors = categoryColors[article.category.name] || defaultColor;
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {article.image ? (
                        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50/50">
                          <svg className="h-10 w-10 text-[#0F4C9A]/12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute left-2.5 top-2.5">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>
                          {article.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C9A] transition-colors line-clamp-2">{article.title}</h3>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-[12px] leading-relaxed text-gray-500">{article.excerpt}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E8F0FE] text-[8px] font-bold text-[#0F4C9A]">
                            {getInitials(article.author.name)}
                          </div>
                          <span className="text-[10.5px] font-medium text-gray-600">{article.author.name || "Tim"}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{formatDate(article.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((article) => {
                const colors = categoryColors[article.category.name] || defaultColor;
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-sm"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
                      {article.image ? (
                        <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-blue-50">
                          <svg className="h-6 w-6 text-[#0F4C9A]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${colors.bg} ${colors.text}`}>{article.category.name}</span>
                        <span className="text-[10px] text-gray-400">{formatDate(article.createdAt)}</span>
                      </div>
                      <h3 className="mt-1.5 text-[14px] font-bold text-gray-900 group-hover:text-[#0F4C9A] transition-colors line-clamp-1">{article.title}</h3>
                      <p className="mt-1 text-[12px] text-gray-500 line-clamp-1">{article.excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="mt-4 text-[14px] font-medium text-gray-600">Belum ada artikel yang ditemukan.</p>
            <p className="mt-1 text-[12px] text-gray-400">Coba kata kunci lain atau ubah kategori.</p>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}