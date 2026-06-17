"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";

interface ForumAuthor {
  id: string;
  name?: string | null;
}

interface ForumComment {
  id: string;
  content: string;
  author: ForumAuthor;
  createdAt: string | Date;
}

interface ForumLike {
  id: string;
  userId: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  author: ForumAuthor;
  comments: ForumComment[];
  likes: ForumLike[];
  createdAt: string | Date;
}

interface ForumBoardProps {
  topics: ForumTopic[];
  currentUserId: string | null;
  currentUserRole: string | null;
}

const forumCategories = [
  "Semua",
  "Keuangan",
  "Pemasaran",
  "Operasional",
  "Teknologi",
  "Legal",
  "Tips & Trik",
];

const categoryColorMap: Record<string, string> = {
  Keuangan: "bg-[#E8F0FE] text-[#0F4C9A]",
  Pemasaran: "bg-purple-50 text-purple-600",
  Operasional: "bg-amber-50 text-amber-600",
  Teknologi: "bg-blue-50 text-blue-600",
  Legal: "bg-gray-100 text-gray-600",
  "Tips & Trik": "bg-[#E6F9EC] text-[#37B24D]",
};

function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string | null): string {
  if (!name) return "P";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ForumBoard({
  topics: initialTopics,
  currentUserId,
  currentUserRole,
}: ForumBoardProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Keuangan");
  const [status, setStatus] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const refreshTopics = useCallback(async () => {
    const res = await fetch("/api/forum");
    const data = await res.json();
    if (data.topics) setTopics(data.topics);
  }, []);

  const filteredTopics = useMemo(() => {
    let result = topics;

    if (activeCategory !== "Semua") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [topics, activeCategory, searchQuery]);

  // Stats
  const totalTopics = topics.length;
  const totalReplies = topics.reduce((sum, t) => sum + t.comments.length, 0);

  async function createTopic() {
    setStatus(null);
    const response = await fetch("/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    });
    const result = await response.json();
    if (!response.ok) {
      setStatus(result?.error || "Gagal membuat topik.");
      return;
    }
    setToast({ message: "Topik berhasil dibuat!", type: "success" });
    setTitle("");
    setContent("");
    setCategory("Keuangan");
    await refreshTopics();
  }

  async function toggleLike(topicId: string) {
    if (!currentUserId) {
      setShowLoginModal(true);
      return;
    }
    setActionError(null);
    const response = await fetch("/api/forum/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId }),
    });
    if (response.ok) {
      await refreshTopics();
    } else {
      const data = await response.json().catch(() => ({}));
      setToast({
        message: data?.error || "Gagal memberi like.",
        type: "error",
      });
    }
  }

  async function addComment(topicId: string) {
    if (!currentUserId) {
      setShowLoginModal(true);
      return;
    }
    setActionError(null);
    const commentContent = commentInputs[topicId];
    if (!commentContent?.trim()) return;

    const response = await fetch("/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "comment", topicId, content: commentContent }),
    });
    if (response.ok) {
      setCommentInputs((prev) => ({ ...prev, [topicId]: "" }));
      setToast({ message: "Komentar berhasil dikirim.", type: "success" });
      await refreshTopics();
    } else {
      const data = await response.json().catch(() => ({}));
      setToast({
        message: data?.error || "Gagal mengirim komentar.",
        type: "error",
      });
    }
  }

  async function deleteComment(commentId: string) {
    setActionError(null);
    const response = await fetch("/api/forum/comment", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    if (response.ok) {
      setToast({ message: "Komentar berhasil dihapus.", type: "success" });
      await refreshTopics();
    } else {
      const data = await response.json().catch(() => ({}));
      setToast({
        message: data?.error || "Gagal menghapus komentar.",
        type: "error",
      });
    }
  }

  async function deleteTopic(topicId: string) {
    setActionError(null);
    setDeleteTarget(null);
    const response = await fetch(`/api/forum/${topicId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setToast({ message: "Topik berhasil dihapus.", type: "success" });
      await refreshTopics();
    } else {
      const data = await response.json().catch(() => ({}));
      setToast({
        message: data?.error || "Gagal menghapus topik.",
        type: "error",
      });
    }
  }

  const canDelete = (topicAuthorId: string) =>
    currentUserId &&
    (currentUserId === topicAuthorId || currentUserRole === "ADMIN");

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 max-w-sm rounded-xl border px-5 py-4 shadow-elevated transition-all ${
            toast.type === "success"
              ? "border-[#37B24D]/20 bg-[#E6F9EC] text-[#37B24D]"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" ? (
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-auto shrink-0 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Login Modal for Guests */}
      <Dialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Masuk Diperlukan"
        description="Silakan masuk terlebih dahulu untuk membuat topik diskusi dan berpartisipasi dalam Forum UMKM."
        confirmLabel="Masuk"
        cancelLabel="Daftar"
        onConfirm={() => {
          window.location.href = "/auth/login";
        }}
        variant="default"
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[#0F4C9A]">{totalTopics}</p>
          <p className="mt-1 text-xs font-medium text-gray-500">Topik</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-[#1E73D8]">{totalReplies}</p>
          <p className="mt-1 text-xs font-medium text-gray-500">Balasan</p>
        </div>
        <div className="col-span-2 rounded-xl border border-gray-100 bg-white p-4 text-center sm:col-span-1">
          <p className="text-2xl font-bold text-[#37B24D]">
            {new Set(topics.map((t) => t.author.id)).size}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-500">Anggota Aktif</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <Input
            placeholder="Cari topik diskusi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {currentUserId ? (
          <Button
            type="button"
            onClick={() => {
              const el = document.getElementById("create-topic-form");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tambah Topik
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowLoginModal(true)}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Tambah Topik
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {forumCategories.map((cat) => {
          const count =
            cat === "Semua"
              ? topics.length
              : topics.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#0F4C9A] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
              {count > 0 && (
                <span className="ml-1 text-xs opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Create Topic Form (Logged in users) */}
      {currentUserId && (
        <section
          id="create-topic-form"
          className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8"
        >
          <h2 className="text-lg font-bold text-gray-900">Buat Topik Baru</h2>
          <div className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="topicTitle">Judul Topik</Label>
                <Input
                  id="topicTitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Cara mengelola utang usaha"
                />
              </div>
              <div>
                <Label htmlFor="topicCategory">Kategori</Label>
                <select
                  id="topicCategory"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus:border-[#0F4C9A] focus:outline-none focus:ring-2 focus:ring-[#0F4C9A]/20"
                >
                  {forumCategories
                    .filter((c) => c !== "Semua")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="topicContent">Isi Diskusi</Label>
              <Textarea
                id="topicContent"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tulis pertanyaan atau pengalaman Anda..."
                rows={4}
              />
            </div>
            {status && (
              <p className="text-sm text-gray-600">{status}</p>
            )}
            {actionError && (
              <p className="text-sm text-red-600">
                {actionError}
                {actionError.includes("login") || actionError.includes("Sesi") ? (
                  <span>
                    {" "}
                    <a
                      href="/auth/login"
                      className="font-medium underline"
                    >
                      Login ulang
                    </a>
                  </span>
                ) : null}
              </p>
            )}
            <Button
              type="button"
              onClick={createTopic}
              disabled={!title.trim() || !content.trim()}
              className="w-full sm:w-auto"
            >
              Kirim Topik
            </Button>
          </div>
        </section>
      )}

      {/* Topics List */}
      <section className="space-y-4">
        <Dialog
          open={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
          title="Hapus Topik"
          description="Apakah Anda yakin ingin menghapus topik ini? Semua komentar dan like juga akan ikut terhapus."
          confirmLabel="Ya, Hapus"
          cancelLabel="Batal"
          onConfirm={() => deleteTarget && deleteTopic(deleteTarget)}
          variant="danger"
        />

        {filteredTopics.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <p className="mt-4 text-base font-medium text-gray-600">
              {searchQuery || activeCategory !== "Semua"
                ? "Tidak ada topik yang cocok dengan pencarian Anda."
                : "Belum ada topik forum."}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              {searchQuery || activeCategory !== "Semua"
                ? "Coba kata kunci atau kategori lain."
                : currentUserId
                ? "Buat topik pertama untuk memulai diskusi!"
                : "Masuk untuk membuat topik pertama."}
            </p>
          </div>
        ) : (
          filteredTopics.map((topic) => {
            const isExpanded = expandedTopic === topic.id;
            return (
              <article
                key={topic.id}
                className="rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-[var(--shadow-card)]"
              >
                {/* Topic Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            categoryColorMap[topic.category] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {topic.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(topic.createdAt)}
                        </span>
                      </div>
                      <h3
                        className="mt-2 text-base font-bold text-gray-900 cursor-pointer hover:text-[#0F4C9A] transition-colors"
                        onClick={() =>
                          setExpandedTopic(isExpanded ? null : topic.id)
                        }
                      >
                        {topic.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8F0FE] text-[9px] font-bold text-[#0F4C9A]">
                          {getInitials(topic.author.name ?? null)}
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {topic.author.name || "Pengguna"}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.671 1.09-.085 2.17-.207 3.238-.364 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                          />
                        </svg>
                        <span className="text-xs font-medium">
                          {topic.comments.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleLike(topic.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-all ${
                          topic.likes.length > 0
                            ? "bg-red-50 text-red-600"
                            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill={
                            topic.likes.some(
                              (l) => l.userId === currentUserId
                            )
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                        {topic.likes.length}
                      </button>
                      {canDelete(topic.author.id) && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(topic.id)}
                          className="text-gray-300 transition-colors hover:text-red-500"
                          title="Hapus topik"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 sm:px-6">
                    {/* Topic Body */}
                    <div className="py-4">
                      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {topic.content}
                      </p>
                    </div>

                    {/* Comments */}
                    <div className="space-y-3 pb-5">
                      {topic.comments.length > 0 && (
                        <p className="text-xs font-semibold text-gray-500">
                          {topic.comments.length} Balasan
                        </p>
                      )}
                      {topic.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-xl bg-gray-50 p-3.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                            {canDelete(comment.author?.id ?? "") && (
                              <button
                                onClick={() => deleteComment(comment.id)}
                                className="shrink-0 text-gray-300 transition-colors hover:text-red-500"
                                title="Hapus komentar"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E8F0FE] text-[7px] font-bold text-[#0F4C9A]">
                              {getInitials(comment.author?.name ?? null)}
                            </div>
                            <p className="text-xs text-gray-400">
                              {comment.author?.name || "Pengguna"} ·{" "}
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add Comment */}
                      {currentUserId ? (
                        <div className="flex gap-2 pt-2">
                          <Input
                            placeholder="Tulis komentar..."
                            value={commentInputs[topic.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [topic.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                addComment(topic.id);
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => addComment(topic.id)}
                            disabled={!commentInputs[topic.id]?.trim()}
                          >
                            Kirim
                          </Button>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 text-center">
                          <p className="text-xs text-gray-500">
                            <button
                              onClick={() => setShowLoginModal(true)}
                              className="font-medium text-[#0F4C9A] hover:underline"
                            >
                              Masuk
                            </button>{" "}
                            untuk menulis komentar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}