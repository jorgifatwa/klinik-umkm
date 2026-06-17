"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ConsultantProfile {
  bio: string;
  speciality: string;
}

interface ProfileStats {
  totalConsultations: number;
  totalClients: number;
  completedConsultations: number;
}

export default function ConsultantProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<ConsultantProfile>({ bio: "", speciality: "" });
  const [form, setForm] = useState({ bio: "", speciality: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [stats, setStats] = useState<ProfileStats>({ totalConsultations: 0, totalClients: 0, completedConsultations: 0 });

  useEffect(() => {
    let ignore = false;
    fetch("/api/consultant/profile")
      .then((res) => {
        if (!ignore && res.ok) return res.json();
      })
      .then((data) => {
        if (ignore || !data) return;
        if (data.consultant) {
          setProfile({ bio: data.consultant.bio || "", speciality: data.consultant.speciality || "" });
          setForm({ bio: data.consultant.bio || "", speciality: data.consultant.speciality || "" });
        }
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {});
    return () => { ignore = true; };
  }, []);

  async function handleSave() {
    setIsSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/consultant/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: form.bio, speciality: form.speciality }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Gagal menyimpan." });
        return;
      }
      setProfile({ bio: data.consultant.bio, speciality: data.consultant.speciality });
      setStatus({ type: "success", message: "Profil konsultan berhasil diperbarui." });
      setIsEditing(false);
    } catch {
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancelEdit() {
    setForm({ bio: profile.bio, speciality: profile.speciality });
    setIsEditing(false);
    setStatus(null);
  }

  const user = session?.user;
  const userName = user?.name || "Konsultan";
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <AuthenticatedLayout
      title="Profil Konsultan"
      breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Profil" }]}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#8B5CF6] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-[24px] font-bold text-white backdrop-blur">
              {firstLetter}
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/50">Profil Konsultan</p>
              <h1 className="mt-1 text-[24px] font-bold text-white">{userName}</h1>
              <p className="mt-1 text-[13px] text-white/60">{user?.email}</p>
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (isEditing) {
                    handleCancelEdit();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="bg-white/15 text-white hover:bg-white/25 border border-white/20"
              >
                {isEditing ? "Batal" : "Edit Profil"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Konsultasi", value: stats.totalConsultations, icon: "📅", color: "#1E73D8" },
            { label: "Klien Aktif", value: stats.totalClients, icon: "👥", color: "#8B5CF6" },
            { label: "Selesai", value: stats.completedConsultations, icon: "✅", color: "#37B24D" },
          ].map((stat) => (
            <div key={stat.label} className="kpi-card">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[16px]" style={{ backgroundColor: stat.color + "15" }}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[11.5px] font-medium text-gray-400">{stat.label}</p>
                  <p className="text-[20px] font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status message */}
        {status && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {status.type === "success" ? (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {status.message}
            </div>
          </div>
        )}

        {/* Profile Details / Edit Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-[15px] font-bold text-gray-900">
            {isEditing ? "Edit Profil" : "Detail Profil"}
          </h3>

          {isEditing ? (
            <div className="mt-4 space-y-5">
              <div>
                <Label htmlFor="speciality">Spesialisasi</Label>
                <Input
                  id="speciality"
                  value={form.speciality}
                  onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                  className="mt-1.5"
                  placeholder="Mis: Keuangan UMKM, Akuntansi"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="mt-1.5"
                  rows={3}
                  placeholder="Ceritakan tentang diri Anda..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Batal
                </Button>
                <Button onClick={handleSave} disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Nama Lengkap</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{userName || "-"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Email</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{user?.email || "-"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Spesialisasi</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{profile.speciality || "-"}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Bio</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{profile.bio || "-"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}