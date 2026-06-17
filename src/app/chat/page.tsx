import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ChatBox } from "@/components/chat/chat-box";
import { getCurrentUser } from "@/lib/get-current-user";

export default async function ChatPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">Silakan login untuk mengakses AI Assistant.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
      <DashboardSidebar />
      <ChatBox />
    </main>
  );
}
