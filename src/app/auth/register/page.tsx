"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "UMKM" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setIsLoading(true);
    setMessage(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data?.error || "Pendaftaran gagal. Coba ulangi.");
      setIsLoading(false);
      return;
    }

    setMessage("Akun berhasil dibuat. Silakan login.");
    router.push("/auth/login");
  }

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* ── Background Pattern ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,76,154,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,76,154,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(15,76,154,0.04),transparent_70%)]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,115,216,0.03),transparent_70%)]" />
      </div>

      <div className="relative mx-auto min-h-screen lg:grid lg:grid-cols-2">
        {/* ════════════════════════════════════════════════════════════
            LEFT: Branding & Value Proposition
            ════════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-col justify-between px-12 py-16 relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0F4C9A] to-[#1E73D8]">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white,transparent_50%),radial-gradient(circle_at_80%_80%,white,transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:32px_32px]" />
          </div>

          {/* Decorative floating shapes */}
          <div className="absolute top-20 right-10 h-64 w-64 rounded-full border border-white/5 bg-white/[0.02]" />
          <div className="absolute bottom-32 left-10 h-48 w-48 rounded-full border border-white/5 bg-white/[0.02]" />
          <div className="absolute top-1/2 right-20 h-4 w-4 rounded-full bg-white/10" />

          {/* Logo & Back link */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-white/50 hover:text-white/80 transition-colors mb-12"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>

            <div className="flex items-center gap-3 mb-14">
              <img
                src="/logo.png"
                alt={"SUFIC'C"}
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10"
              />
              <div>
                <p className="text-sm font-bold tracking-tight text-white">
                  {"SUFIC'C"}
                </p>
                <p className="text-[11px] font-medium text-white/40">
                  Sustainable Financial Clinic Cianjur
                </p>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white leading-[1.15]">
              Bergabung dengan {"SUFIC'C"}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/60 max-w-md">
              Mewujudkan Cianjur yang Berdaya melalui Keuangan yang Cerdas dan Berkelanjutan
            </p>

            {/* Slogan */}
            <p className="mt-3 text-lg font-semibold text-white/80">
              Smart Finance, Sustainable Future
            </p>

            {/* Benefits */}
            <div className="mt-12 space-y-4">
              {[
                {
                  icon: (
                    <svg className="h-4 w-4 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ),
                  text: "Cek kesehatan keuangan UMKM",
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ),
                  text: "Roadmap keuangan otomatis",
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ),
                  text: "Konsultasi dengan ahli",
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ),
                  text: "Dashboard perkembangan usaha",
                },
              ].map((benefit) => (
                <div key={benefit.text} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10">
                    {benefit.icon}
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust indicator */}
          <div className="relative z-10 border-t border-white/10 pt-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <svg className="h-3.5 w-3.5 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Data Terenkripsi
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <svg className="h-3.5 w-3.5 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Gratis untuk UMKM
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <svg className="h-3.5 w-3.5 text-[#37B24D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                Didukung Pemerintah
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════
            RIGHT: Registration Card
            ════════════════════════════════════════════════════════════ */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md mx-auto">

            {/* Mobile logo (visible only on mobile/tablet) */}
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt={"SUFIC'C"}
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-bold tracking-tight text-[#0F4C9A]">
                    {"SUFIC'C"}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
                    Sustainable Financial Clinic Cianjur
                  </p>
                </div>
              </Link>
            </div>

            {/* Back link (mobile) */}
            <Link href="/" className="lg:hidden inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors mb-6">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>

            {/* Registration Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
              {/* Header */}
              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F4C9A]">
                  Daftar akun baru
                </p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Buat akun UMKM
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Mulai kelola keuangan usaha dan konsultasi dengan mudah.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {/* Nama */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Nama
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <Input
                      id="name"
                      placeholder="Nama lengkap"
                      className="pl-10 h-12 text-sm bg-white border-slate-200 focus:border-[#0F4C9A]/40 focus:ring-[#0F4C9A]/10"
                      {...register("name")}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@domain.com"
                      className="pl-10 h-12 text-sm bg-white border-slate-200 focus:border-[#0F4C9A]/40 focus:ring-[#0F4C9A]/10"
                      {...register("email")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 text-sm bg-white border-slate-200 focus:border-[#0F4C9A]/40 focus:ring-[#0F4C9A]/10"
                      {...register("password")}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-sm font-medium text-slate-700">
                    Peran
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 z-10">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                    <select
                      id="role"
                      className="w-full h-12 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 appearance-none cursor-pointer transition-all duration-200 hover:border-slate-300 focus:border-[#0F4C9A]/40 focus:ring-2 focus:ring-[#0F4C9A]/10 focus:shadow-md outline-none"
                      {...register("role")}
                    >
                      <option value="UMKM">UMKM</option>
                      <option value="KONSULTAN">Konsultan</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                    {/* Chevron icon */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message ? (
                  <div className={`rounded-xl border p-3.5 text-sm ${
                    message.includes("gagal")
                      ? "border-red-100 bg-red-50 text-red-700"
                      : "border-green-100 bg-green-50 text-green-700"
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {message.includes("gagal") ? (
                        <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                      <span>{message}</span>
                    </div>
                  </div>
                ) : null}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-[#0F4C9A] hover:bg-[#0A3A75] active:bg-[#082E5E] shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Membuat akun...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Daftar Sekarang
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider & Login link */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-slate-400">atau</span>
                  </div>
                </div>

                <div className="mt-5 text-center text-sm text-slate-500">
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-[#0F4C9A] hover:text-[#1E73D8] transition-colors"
                  >
                    Login di sini
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Dengan mendaftar, Anda menyetujui{" "}
              <a href="#" className="underline hover:text-slate-600 transition-colors">
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a href="#" className="underline hover:text-slate-600 transition-colors">
                Kebijakan Privasi
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}