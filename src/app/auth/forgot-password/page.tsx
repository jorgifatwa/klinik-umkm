"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await response.json();
    setMessage(result.message || "Jika email terdaftar, instruksi reset telah dikirim.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/5">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Lupa password</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Reset akses Anda</h1>
          <p className="mt-2 text-slate-600">Masukkan email untuk menerima instruksi pengaturan ulang password.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@domain.com" {...register("email")} />
          </div>
          {message ? <p className="text-sm text-slate-700">{message}</p> : null}
          <Button type="submit">Kirim Instruksi</Button>
        </form>
      </div>
    </main>
  );
}
