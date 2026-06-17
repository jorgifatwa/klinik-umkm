"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage(null);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    startTransition(() => {
      if (result?.error) {
        setErrorMessage("Email atau password tidak valid.");
        return;
      }
      router.push("/dashboard");
    });
  }

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* ── Background Pattern ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,76,154,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,76,154,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(15,76,154,0.04),transparent_70%)]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(30,115,216,0.03),transparent_70%)]" />
      </div>

      <div className="relative mx-auto min-h-screen lg:grid lg:grid-cols-2">
        {/* ════════════════════════════════════════════════════════════
            LEFT: Branding & Welcome Back
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
          <div className="absolute top-1/3 right-20 h-4 w-4 rounded-full bg-white/10" />
          <div className="absolute bottom-1/4 right-32 h-3 w-3 rounded-full bg-white/5" />

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
                alt="Klinik Keuangan UMKM"
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-white/10"
              />
              <div>
                <p className="text-sm font-bold tracking-tight text-white">
                  Klinik Keuangan UMKM
                </p>
                <p className="text-[11px] font-medium text-white/40">
                  Platform Pendampingan Keuangan
                </p>
              </div>
            </div>

            {/* Headline — Welcome Back */}
            <h1 className="text-4xl font-bold tracking-tight text-white leading-[1.15]">
              Selamat datang
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#37B24D] to-[#6FCF7A]">
                kembali
              </span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/60 max-w-md">
              Masuk untuk memantau kesehatan keuangan usaha Anda dan
              lanjutkan perjalanan menuju bisnis yang lebih maju.
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
                  text: "Dashboard kesehatan keuangan",
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-[#37B24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ),
                  text: "Roadmap keuangan UMKM",
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
                  text: "Monitoring perkembangan usaha",
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
            RIGHT: Login Card
            ════════════════════════════════════════════════════════════ */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md mx-auto">

            {/* Mobile logo (visible only on mobile/tablet) */}
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Klinik Keuangan UMKM"
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div>
                  <p className="text-sm font-bold tracking-tight text-[#0F4C9A]">
                    Klinik Keuangan UMKM
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 -mt-0.5">
                    Platform Pendampingan Keuangan
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

            {/* Login Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
              {/* Header */}
              <div className="mb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F4C9A]">
                  Selamat datang kembali
                </p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Masuk ke akun
                </h1>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Gunakan email dan password untuk melanjutkan.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                      Password
                    </Label>
                    <a
                      className="text-xs font-medium text-slate-400 hover:text-[#0F4C9A] transition-colors"
                      href="/auth/forgot-password"
                    >
                      Lupa password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-12 h-12 text-sm bg-white border-slate-200 focus:border-[#0F4C9A]/40 focus:ring-[#0F4C9A]/10"
                      {...register("password")}
                    />
                    {/* Password visibility toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm text-red-700">
                    <div className="flex items-center gap-2.5">
                      <svg className="h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full h-12 text-base font-semibold bg-[#0F4C9A] hover:bg-[#0A3A75] active:bg-[#082E5E] shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Masuk
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  )}
                </Button>
              </form>

              {/* Divider & Register link */}
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
                  Belum punya akun?{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-[#0F4C9A] hover:text-[#1E73D8] transition-colors"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Dengan melanjutkan, Anda menyetujui{" "}
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