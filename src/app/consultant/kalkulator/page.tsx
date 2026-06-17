import { AuthenticatedCalculators } from "@/components/calculators/authenticated-calculators";
import { getCurrentUser } from "@/lib/get-current-user";

export const dynamic = "force-dynamic";

export default async function ConsultantKalkulatorPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login.</p>
        </div>
      </main>
    );
  }

  return <AuthenticatedCalculators />;
}