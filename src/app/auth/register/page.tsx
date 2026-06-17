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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Kembali ke Beranda
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Daftar akun baru</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Buat akun UMKM</h1>
          <p className="mt-2 text-slate-600">Mulai kelola keuangan usaha dan konsultasi dengan mudah.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" placeholder="Nama lengkap" {...register("name")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@domain.com" {...register("email")} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          </div>
          <div>
            <Label htmlFor="role">Peran</Label>
            <select id="role" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none" {...register("role")}> 
              <option value="UMKM">UMKM</option>
              <option value="KONSULTAN">Konsultan</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {message ? <p className="text-sm text-slate-700">{message}</p> : null}
          <Button type="submit" disabled={isLoading}>{isLoading ? "Membuat akun..." : "Daftar"}</Button>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
          Sudah punya akun? <a className="font-medium text-slate-950 hover:underline" href="/auth/login">Login di sini</a>
        </div>
      </div>
    </main>
  );
}
