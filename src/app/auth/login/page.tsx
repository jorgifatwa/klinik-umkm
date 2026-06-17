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
    <main className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <div className="mb-8">
            <Link href="/" className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Kembali ke Beranda
            </Link>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Klinik UMKM" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
              <div>
                <p className="text-base font-semibold text-slate-900">Klinik UMKM</p>
                <p className="text-xs text-slate-500">Platform pendampingan keuangan</p>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900">Masuk ke akun Anda</h1>
          <p className="mt-2 text-sm text-slate-600">Gunakan email dan password untuk melanjutkan.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@domain.com"
                className="mt-1.5"
                {...register("email")}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-xs font-medium text-slate-500 hover:text-slate-900" href="/auth/forgot-password">
                  Lupa password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5"
                {...register("password")}
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Memproses..." : "Masuk"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Belum punya akun?{" "}
            <a className="font-semibold text-slate-900 hover:text-slate-700" href="/auth/register">
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-start gap-3">
          <img src="/logo.png" alt="Klinik UMKM" className="h-12 w-12 rounded-xl object-cover shadow-lg shadow-black/20" />
          <div>
            <p className="text-base font-semibold text-white">Klinik Keuangan UMKM</p>
            <p className="text-xs text-white/50">Platform pendampingan keuangan</p>
          </div>
        </div>

        <div className="space-y-6">
          <blockquote className="text-2xl font-medium leading-relaxed text-white">
            &ldquo;Dengan platform ini, kami jadi lebih paham cara mengelola keuangan dan mengembangkan usaha.&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-white">
              B
            </div>
            <div>
              <p className="font-medium text-white">Budi UMKM</p>
              <p className="text-sm text-white/60">Pelaku UMKM — Kedai Kopi Nusantara</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Platform aktif — 24/7
        </div>
      </div>
    </main>
  );
}