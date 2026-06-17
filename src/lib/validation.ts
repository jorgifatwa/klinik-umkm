import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama lengkap diperlukan"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Minimal 8 karakter"),
  role: z.enum(["UMKM", "KONSULTAN", "ADMIN"]),
});

export const businessProfileSchema = z.object({
  businessName: z.string().min(3),
  industry: z.string().min(3),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()),
  employeeCount: z.number().int().min(0),
  monthlyRevenue: z.number().min(0),
  monthlyProfit: z.number().min(0),
  initialCapital: z.number().min(0),
  location: z.string().min(3),
  whatsapp: z
    .string()
    .optional()
    .nullable()
    .transform((value) => {
      if (!value) return null;
      const cleaned = String(value)
        .trim()
        .replace(/[^\d+]/g, "")
        .replace(/^0(?=\d)/, "+62")
        .replace(/^62(?=\d)/, "+62");
      return cleaned;
    })
    .refine(
      (value) => !value || /^\+62\d{8,12}$/.test(value),
      {
        message: "Nomor WhatsApp tidak valid",
      }
    ),
});

export const assessmentSchema = z.object({
  monthlyRevenue: z.number().min(0),
  priorRevenue: z.number().min(0),
  operatingCost: z.number().min(0),
  payrollCost: z.number().min(0),
  otherCost: z.number().min(0),
  totalDebt: z.number().min(0),
  monthlyInstallment: z.number().min(0),
  businessCapital: z.number().min(0),
  cashBalance: z.number().min(0),
});

export const articleSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3, "Slug minimal 3 karakter"),
  excerpt: z.string().min(10, "Ringkasan minimal 10 karakter"),
  content: z.string().min(20, "Isi minimal 20 karakter"),
  categoryId: z.string().uuid("Kategori harus valid"),
  published: z.boolean().optional(),
  image: z.string().optional().nullable(),
});

export const forumTopicSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Isi diskusi minimal 10 karakter"),
  category: z.string().min(2, "Kategori minimal 2 karakter"),
});

export const consultationSchema = z.object({
  consultantId: z.string().uuid(),
  scheduledAt: z.string(),
});
