import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { ProfileForm } from "@/components/profile/profile-form";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardProfilUsahaPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses profil usaha.</p>
          <Link href="/auth/login" className="mt-4 inline-flex h-10 items-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
            Masuk
          </Link>
        </div>
      </main>
    );
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: user.id },
  });

  return (
    <AuthenticatedLayout
      title="Profil Usaha"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Profil Usaha" }]}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-[17px] font-bold text-gray-900">Profil Usaha</h2>
          <p className="mt-1 text-[12.5px] text-gray-500">Kelola data usaha dan update informasi ketika terjadi perubahan.</p>
        </div>
        <ProfileForm profile={profile} />
      </div>
    </AuthenticatedLayout>
  );
}