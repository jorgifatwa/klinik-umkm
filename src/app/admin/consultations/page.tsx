import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { AdminConsultationsManagement } from "@/components/admin/admin-consultations-management";
import { getCurrentUser } from "@/lib/get-current-user";

export const dynamic = "force-dynamic";

export default async function AdminConsultationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Anda tidak memiliki akses admin.</p>
        </div>
      </main>
    );
  }

  return (
    <AuthenticatedLayout
      title="Konsultasi"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Admin", href: "/admin" }, { label: "Konsultasi" }]}
    >
      <div className="space-y-6">
        <AdminConsultationsManagement />
      </div>
    </AuthenticatedLayout>
  );
}
