"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";

type AdminTab = "users" | "articles" | "consultations";
type UserItem = { id: string; name: string | null; email: string; role: string; createdAt: string };
type ArticleItem = { id: string; title: string; published: boolean; category: { name?: string | null } | null; author: { name?: string | null } | null; createdAt: string };
type ConsultationItem = { id: string; scheduledAt: string; status: string; user: { name: string | null } | null; consultant: { user: { name: string | null } | null } | null };
type CategoryItem = { id: string; name: string };
type ConsultantOption = { id: string; name: string };

const tabLabels: Record<AdminTab, string> = { users: "Kelola User", articles: "Kelola Artikel", consultations: "Kelola Konsultasi" };
const createLabels: Record<AdminTab, string> = { users: "Tambah User", articles: "Tambah Artikel", consultations: "Tambah Konsultasi" };

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function statusBadge(status: string) {
  if (status === "CONFIRMED") return "bg-emerald-100 text-emerald-700";
  if (status === "COMPLETED") return "bg-slate-100 text-slate-700";
  if (status === "CANCELLED") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export function AdminManagement({ initialTab = "users" }: { initialTab?: AdminTab }) {
  const [tab] = useState<AdminTab>(initialTab);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [consultantOptions, setConsultantOptions] = useState<ConsultantOption[]>([]);
  const [userOptions, setUserOptions] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "UMKM" });
  const [newArticle, setNewArticle] = useState({ title: "", slug: "", excerpt: "", content: "", categoryId: "", published: false, image: "" });
  const [newConsultation, setNewConsultation] = useState({ userId: "", consultantId: "", scheduledAt: "" });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchDataRef = useCallback(async (signal?: AbortSignal) => {
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/admin/${tab}`, { signal });
      if (!r.ok) { const d = await r.json(); throw new Error(d?.error || "Gagal memuat data."); }
      const d = await r.json();
      if (tab === "users") setUsers(d.users ?? []);
      else if (tab === "articles") setArticles(d.articles ?? []);
      else setConsultations(d.consultations ?? []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally { setLoading(false); }
  }, [tab]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      await fetchDataRef(signal);
      if (!signal.aborted && tab === "articles") {
        try {
          const r = await fetch("/api/admin/categories", { signal });
          if (r.ok) { const d = await r.json(); setCategories(d.categories ?? []); }
        } catch { /* ignore */ }
      }
      if (!signal.aborted && tab === "consultations") {
        try {
          const [usersR, consR] = await Promise.all([
            fetch("/api/admin/users", { signal }),
            fetch("/api/admin/consultants", { signal }),
          ]);
          if (usersR.ok) { const d = await usersR.json(); setUserOptions((d.users ?? []).filter((u: UserItem) => u.role === "UMKM")); }
          if (consR.ok) { const d = await consR.json(); setConsultantOptions(d.consultants ?? []); }
        } catch { /* ignore */ }
      }
    })();
    return () => { controller.abort(); };
  }, [tab, fetchDataRef]);

  async function fetchData() { await fetchDataRef(); }

  function resetForm() { setNewUser({ name: "", email: "", password: "", role: "UMKM" }); setNewArticle({ title: "", slug: "", excerpt: "", content: "", categoryId: "", published: false, image: "" }); setNewConsultation({ userId: "", consultantId: "", scheduledAt: "" }); }

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setCreateSuccess(null);
    try {
      const r = await fetch("/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
      const d = await r.json(); if (!r.ok) throw new Error(d?.error || "Gagal membuat user.");
      setCreateSuccess("✓ User berhasil dibuat."); resetForm(); await fetchData();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal membuat user."); } finally { setLoading(false); }
  }

  async function handleCreateArticle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setCreateSuccess(null);
    if (!newArticle.categoryId) { setError("Silakan pilih kategori."); setLoading(false); return; }
    try {
      const r = await fetch("/api/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newArticle) });
      const d = await r.json(); if (!r.ok) throw new Error(d?.error || "Gagal membuat artikel.");
      setCreateSuccess("✓ Artikel berhasil dibuat."); resetForm(); await fetchData();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal membuat artikel."); } finally { setLoading(false); }
  }

  async function handleCreateConsultation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setCreateSuccess(null);
    if (!newConsultation.userId || !newConsultation.consultantId || !newConsultation.scheduledAt) { setError("Lengkapi semua field."); setLoading(false); return; }
    try {
      const r = await fetch("/api/admin/consultations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newConsultation) });
      const d = await r.json(); if (!r.ok) throw new Error(d?.error || "Gagal membuat konsultasi.");
      setCreateSuccess("✓ Konsultasi berhasil dibuat."); resetForm(); await fetchData();
    } catch (e) { setError(e instanceof Error ? e.message : "Gagal membuat konsultasi."); } finally { setLoading(false); }
  }

  async function handleUserRoleChange(userId: string, role: string) { setLoading(true); setError(null); setCreateSuccess(null); try { const r = await fetch(`/api/admin/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) }); if (!r.ok) throw new Error("Gagal mengubah role."); setCreateSuccess(`✓ Role diubah menjadi ${role}.`); await fetchData(); } catch (e) { setError(e instanceof Error ? e.message : "Kesalahan."); } finally { setLoading(false); } }
  async function handleArticleToggle(id: string, pub: boolean) { setLoading(true); setError(null); setCreateSuccess(null); try { const r = await fetch(`/api/admin/articles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: pub }) }); if (!r.ok) throw new Error("Gagal memperbarui."); setCreateSuccess(pub ? "✓ Artikel dipublikasikan." : "✓ Artikel diunpublish."); await fetchData(); } catch (e) { setError(e instanceof Error ? e.message : "Kesalahan."); } finally { setLoading(false); } }
  async function handleArticleDelete(id: string) { setDeleteTarget(id); }
  async function confirmDelete() {
    if (!deleteTarget) return;
    setLoading(true); setError(null); setCreateSuccess(null);
    try {
      const r = await fetch(`/api/admin/articles/${deleteTarget}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Gagal menghapus.");
      setDeleteTarget(null);
      setCreateSuccess("✓ Artikel berhasil dihapus.");
      await fetchData();
    } catch (e) { setError(e instanceof Error ? e.message : "Kesalahan."); } finally { setLoading(false); }
  }
  async function handleConsultationStatus(id: string, status: string) { setLoading(true); setError(null); setCreateSuccess(null); try { const r = await fetch(`/api/admin/consultations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); if (!r.ok) throw new Error("Gagal memperbarui."); setCreateSuccess(`✓ Status diubah menjadi ${status}.`); await fetchData(); } catch (e) { setError(e instanceof Error ? e.message : "Kesalahan."); } finally { setLoading(false); } }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Management</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{tabLabels[tab]}</h2>
        </div>
        <Button type="button" variant={showCreateForm ? "secondary" : "default"} onClick={() => { setShowCreateForm(!showCreateForm); resetForm(); }} className="rounded-xl">
          {showCreateForm ? "Tutup Form" : `+ ${createLabels[tab]}`}
        </Button>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2"><span>⚠</span>{error}</div>}
      {createSuccess && <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 flex items-center gap-2"><span>✓</span>{createSuccess}</div>}

      {/* Create Forms */}
      {showCreateForm && tab === "users" && (
        <form onSubmit={handleCreateUser} className="mb-8 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-900">Tambah User Baru</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Nama</Label><Input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required /></div>
            <div><Label>Email</Label><Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required /></div>
            <div><Label>Password</Label><Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required /></div>
            <div><Label>Role</Label>
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none">
                <option value="UMKM">UMKM</option><option value="KONSULTAN">Konsultan</option><option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan User"}</Button>
        </form>
      )}

      {showCreateForm && tab === "articles" && (
        <form onSubmit={handleCreateArticle} className="mb-8 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-900">Tambah Artikel Baru</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Judul</Label><Input value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} required /></div>
            <div><Label>Slug</Label><Input value={newArticle.slug} onChange={(e) => setNewArticle({ ...newArticle, slug: e.target.value })} required /></div>
          </div>
          <div><Label>Ringkasan</Label><Textarea value={newArticle.excerpt} onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })} required /></div>
          <div><Label>Isi Artikel</Label><Textarea value={newArticle.content} onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })} rows={6} required /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Kategori</Label>
              <select value={newArticle.categoryId} onChange={(e) => setNewArticle({ ...newArticle, categoryId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none" required>
                <option value="">Pilih Kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={newArticle.published} onChange={(e) => setNewArticle({ ...newArticle, published: e.target.checked })} className="h-4 w-4 rounded border-slate-300" /> Publish langsung</label></div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Artikel"}</Button>
        </form>
      )}

      {showCreateForm && tab === "consultations" && (
        <form onSubmit={handleCreateConsultation} className="mb-8 space-y-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <p className="text-sm font-semibold text-slate-900">Tambah Konsultasi Baru</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><Label>UMKM</Label><select value={newConsultation.userId} onChange={(e) => setNewConsultation({ ...newConsultation, userId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none" required><option value="">Pilih UMKM</option>{userOptions.map((u) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}</select></div>
            <div><Label>Konsultan</Label><select value={newConsultation.consultantId} onChange={(e) => setNewConsultation({ ...newConsultation, consultantId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none" required><option value="">Pilih Konsultan</option>{consultantOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><Label>Jadwal</Label><Input type="datetime-local" value={newConsultation.scheduledAt} onChange={(e) => setNewConsultation({ ...newConsultation, scheduledAt: e.target.value })} required /></div>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Konsultasi"}</Button>
        </form>
      )}

      {/* DataTables */}
      {tab === "users" && (
        <DataTable<UserItem>
          data={users} keyExtractor={(u) => u.id} searchPlaceholder="Cari nama atau email..."
          loading={loading} pageSize={8} emptyMessage="Belum ada data user." emptyIcon="👤"
          columns={[
            { key: "name", header: "Nama", render: (u) => <span className="font-medium text-slate-900">{u.name ?? "-"}</span> },
            { key: "email", header: "Email", render: (u) => <span className="text-slate-600">{u.email}</span> },
            { key: "role", header: "Role", render: (u) => <Badge className={cn(u.role === "ADMIN" ? "bg-violet-100 text-violet-700" : u.role === "KONSULTAN" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>{u.role}</Badge> },
            { key: "createdAt", header: "Terdaftar", render: (u) => <span className="text-slate-500">{formatDate(u.createdAt)}</span> },
          ]}
          actions={(u) => (
            <div className="flex flex-wrap justify-end gap-2">
              {u.role !== "ADMIN" && <Button variant="secondary" size="sm" onClick={() => handleUserRoleChange(u.id, "ADMIN")}>Admin</Button>}
              {u.role !== "KONSULTAN" && <Button variant="outline" size="sm" onClick={() => handleUserRoleChange(u.id, "KONSULTAN")}>Konsultan</Button>}
              {u.role !== "UMKM" && <Button variant="ghost" size="sm" onClick={() => handleUserRoleChange(u.id, "UMKM")}>UMKM</Button>}
            </div>
          )}
        />
      )}

      {tab === "articles" && (
        <DataTable<ArticleItem>
          data={articles} keyExtractor={(a) => a.id} searchPlaceholder="Cari judul artikel..."
          loading={loading} pageSize={8} emptyMessage="Belum ada artikel." emptyIcon="📄"
          columns={[
            { key: "title", header: "Judul", render: (a) => <span className="font-medium text-slate-900">{a.title}</span> },
            { key: "category", header: "Kategori", render: (a) => <span className="text-slate-600">{a.category?.name ?? "-"}</span> },
            { key: "author", header: "Penulis", render: (a) => <span className="text-slate-500">{a.author?.name ?? "Tim Klinikum"}</span> },
            { key: "published", header: "Status", render: (a) => <Badge className={a.published ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{a.published ? "Published" : "Draft"}</Badge> },
          ]}
          actions={(a) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleArticleToggle(a.id, !a.published)}>{a.published ? "Unpublish" : "Publish"}</Button>
              <Button variant="ghost" size="sm" onClick={() => handleArticleDelete(a.id)}>Hapus</Button>
            </div>
          )}
        />
      )}

      {tab === "consultations" && (
        <DataTable<ConsultationItem>
          data={consultations} keyExtractor={(c) => c.id} searchPlaceholder="Cari nama UMKM atau konsultan..."
          loading={loading} pageSize={8} emptyMessage="Belum ada konsultasi." emptyIcon="📅"
          columns={[
            { key: "user", header: "UMKM", render: (c) => <span className="font-medium text-slate-900">{c.user?.name ?? "-"}</span> },
            { key: "consultant", header: "Konsultan", render: (c) => <span className="text-slate-600">{c.consultant?.user?.name ?? "-"}</span> },
            { key: "scheduledAt", header: "Jadwal", render: (c) => <span className="text-slate-500">{formatDate(c.scheduledAt)}</span> },
            { key: "status", header: "Status", render: (c) => <Badge className={statusBadge(c.status)}>{c.status}</Badge> },
          ]}
          actions={(c) => (
            <div className="flex flex-wrap justify-end gap-2">
              {c.status !== "CONFIRMED" && <Button variant="secondary" size="sm" onClick={() => handleConsultationStatus(c.id, "CONFIRMED")}>Konfirmasi</Button>}
              {c.status !== "COMPLETED" && <Button variant="outline" size="sm" onClick={() => handleConsultationStatus(c.id, "COMPLETED")}>Selesaikan</Button>}
              {c.status !== "CANCELLED" && <Button variant="ghost" size="sm" onClick={() => handleConsultationStatus(c.id, "CANCELLED")}>Batalkan</Button>}
            </div>
          )}
        />
      )}

      {/* Delete Modal */}
      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Artikel"
        description="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus" cancelLabel="Batal"
        onConfirm={confirmDelete}
        variant="danger"
      />
    </section>
  );
}