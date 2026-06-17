"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BusinessProfile {
  businessName: string;
  industry: string;
  location: string;
  whatsapp: string | null;
  monthlyRevenue: number;
  monthlyProfit: number;
  employeeCount: number;
  establishedYear: number;
}

interface AssessmentScore {
  finalScore: number;
  category: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface Assessment {
  score: AssessmentScore | null;
  createdAt: string;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

interface Consultation {
  id: string;
  scheduledAt: string;
  status: string;
  notes: Note[];
}

interface ClientData {
  id: string;
  name: string | null;
  email: string;
  businessProfile: BusinessProfile | null;
  assessment: Assessment | null;
}

interface Stats {
  totalConsultations: number;
  completedConsultations: number;
  lastConsultation: string | null;
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientData | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    fetch(`/api/consultant/clients/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setClient(data.client);
        setConsultations(data.consultations);
        setStats(data.stats);
      })
      .catch(() => setError("Gagal memuat data klien."))
      .finally(() => setLoading(false));
  }, [id]);

  async function addNote(consultationId: string) {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch("/api/consultant/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consultationId, content: noteText }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === consultationId
            ? { ...c, notes: [data.note, ...c.notes] }
            : c
        )
      );
      setNoteText("");
      setSelectedConsultation(null);
    } catch {
      alert("Gagal menambahkan catatan.");
    } finally {
      setAddingNote(false);
    }
  }

  if (loading) {
    return (
      <AuthenticatedLayout title="Detail Klien" breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Klien", href: "/consultant/clients" }, { label: "Detail" }]}>
        <div className="p-12 text-center text-[13px] text-gray-500">Memuat data...</div>
      </AuthenticatedLayout>
    );
  }

  if (error || !client) {
    return (
      <AuthenticatedLayout title="Detail Klien" breadcrumbs={[{ label: "Home", href: "/consultant" }, { label: "Klien", href: "/consultant/clients" }, { label: "Detail" }]}>
        <div className="p-12 text-center">
          <p className="text-[13px] font-medium text-red-500">{error || "Klien tidak ditemukan."}</p>
          <Link href="/consultant/clients" className="mt-3 inline-block text-[12px] text-[#0F4C9A] hover:underline">
            Kembali ke daftar klien
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout
      title={`${client.name || "Klien"}`}
      breadcrumbs={[
        { label: "Home", href: "/consultant" },
        { label: "Klien", href: "/consultant/clients" },
        { label: client.name || "Detail" },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#8B5CF6] p-6 sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-[24px] font-bold text-white backdrop-blur">
              {client.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-white/50">Detail Klien UMKM</p>
              <h1 className="mt-1 text-[24px] font-bold text-white">{client.name || "UMKM"}</h1>
              <p className="mt-1 text-[13px] text-white/60">{client.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="kpi-card">
              <p className="text-[11.5px] font-medium text-gray-400">Total Konsultasi</p>
              <p className="mt-1 text-[22px] font-bold text-gray-900">{stats.totalConsultations}</p>
            </div>
            <div className="kpi-card">
              <p className="text-[11.5px] font-medium text-gray-400">Selesai</p>
              <p className="mt-1 text-[22px] font-bold text-gray-900">{stats.completedConsultations}</p>
            </div>
            <div className="kpi-card">
              <p className="text-[11.5px] font-medium text-gray-400">Terakhir Konsultasi</p>
              <p className="mt-1 text-[13px] font-semibold text-gray-900">
                {stats.lastConsultation
                  ? new Date(stats.lastConsultation).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                  : "-"}
              </p>
            </div>
          </div>
        )}

        {/* Business Profile */}
        {client.businessProfile && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-[15px] font-bold text-gray-900">Profil Usaha</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Nama Usaha</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{client.businessProfile.businessName}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Industri</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{client.businessProfile.industry}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Lokasi</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{client.businessProfile.location}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Karyawan</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">{client.businessProfile.employeeCount} orang</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Omset Bulanan</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">Rp {client.businessProfile.monthlyRevenue.toLocaleString("id-ID")}</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[10.5px] font-medium text-gray-400">Laba Bulanan</p>
                <p className="mt-0.5 text-[13px] font-semibold text-gray-900">Rp {client.businessProfile.monthlyProfit.toLocaleString("id-ID")}</p>
              </div>
            </div>
            {client.businessProfile.whatsapp && (
              <div className="mt-4">
                <a
                  href={`https://wa.me/${client.businessProfile.whatsapp.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-[12px] font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Hubungi via WhatsApp
                </a>
              </div>
            )}
          </div>
        )}

        {/* Financial Assessment */}
        {client.assessment?.score && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-gray-900">Skor Kesehatan Keuangan</h3>
              <span className={`rounded-lg px-3 py-1 text-[12px] font-bold ${
                client.assessment.score.category === "Sehat" ? "bg-emerald-100 text-emerald-700" :
                client.assessment.score.category === "Cukup" ? "bg-amber-100 text-amber-700" :
                "bg-red-100 text-red-700"
              }`}>
                {client.assessment.score.finalScore} - {client.assessment.score.category}
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {client.assessment.score.strengths.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-emerald-600 mb-2">💪 Kelebihan</p>
                  <ul className="space-y-1">
                    {client.assessment.score.strengths.map((s, i) => (
                      <li key={i} className="text-[12px] text-gray-600 flex items-start gap-1.5">
                        <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {client.assessment.score.weaknesses.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-amber-600 mb-2">⚠️ Kelemahan</p>
                  <ul className="space-y-1">
                    {client.assessment.score.weaknesses.map((w, i) => (
                      <li key={i} className="text-[12px] text-gray-600 flex items-start gap-1.5">
                        <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-amber-400" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {client.assessment.score.recommendations.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-[#0F4C9A] mb-2">📋 Rekomendasi</p>
                <ul className="space-y-1">
                  {client.assessment.score.recommendations.map((r, i) => (
                    <li key={i} className="text-[12px] text-gray-600 flex items-start gap-1.5">
                      <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-[#0F4C9A]" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Consultation History with Notes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-[15px] font-bold text-gray-900">Riwayat Konsultasi</h3>
          <p className="mt-1 text-[12px] text-gray-500">Tambahkan catatan untuk setiap sesi konsultasi.</p>

          {consultations.length === 0 ? (
            <p className="mt-4 text-[13px] text-gray-400">Belum ada konsultasi.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {consultations.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12.5px] font-semibold text-gray-900">
                        {new Date(c.scheduledAt).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(c.scheduledAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                      c.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-700" :
                      c.status === "COMPLETED" ? "bg-slate-100 text-slate-700" :
                      c.status === "CANCELLED" ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {c.status === "PENDING" ? "Menunggu" :
                       c.status === "CONFIRMED" ? "Dikonfirmasi" :
                       c.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}
                    </span>
                  </div>

                  {/* Notes */}
                  {c.notes.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {c.notes.map((note) => (
                        <div key={note.id} className="rounded-lg bg-white px-3 py-2 border border-gray-100">
                          <p className="text-[12px] text-gray-700">{note.content}</p>
                          <p className="mt-1 text-[10px] text-gray-400">
                            {new Date(note.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add note */}
                  <div className="mt-3">
                    {selectedConsultation === c.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Tulis catatan konsultasi..."
                          className="min-h-[60px] text-[12px]"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => addNote(c.id)} disabled={addingNote || !noteText.trim()}>
                            {addingNote ? "Menyimpan..." : "Simpan Catatan"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setSelectedConsultation(null); setNoteText(""); }}>
                            Batal
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedConsultation(c.id)}
                        className="text-[11px] font-medium text-[#0F4C9A] hover:text-[#1E73D8] transition-colors"
                      >
                        + Tambah Catatan
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}