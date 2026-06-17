import { PublicNavbar } from "@/components/layout/public-navbar";
import { PublicFooter } from "@/components/layout/public-footer";
import { ForumBoard } from "@/components/forum/forum-board";
import { AuthenticatedForum } from "@/components/forum/authenticated-forum";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/get-current-user";

export const dynamic = "force-dynamic";

export default async function ForumPage() {
  const user = await getCurrentUser();
  const topics = await prisma.forumTopic.findMany({
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      likes: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // If user is logged in, show authenticated layout
  const authUser = user as { id: string; role: string } | null;
  if (authUser) {
    return (
      <AuthenticatedForum
        topics={topics}
        currentUserId={authUser.id}
        currentUserRole={authUser.role}
      />
    );
  }

  // Public view
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main>
        <section className="relative overflow-hidden bg-[#0F4C9A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(30,115,216,0.15),transparent_50%)]" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38a.641.641 0 01-.627-.044 12.016 12.016 0 01-3.818-4.255M10.34 15.84a11.963 11.963 0 01-1.36-3.59m4.32-5.34c.688.06 1.386.09 2.09.09H16.5a4.5 4.5 0 110 9h-.75c-.704 0-1.402.03-2.09.09m0-9.18a12.013 12.013 0 01-1.36 3.59m4.32 5.34a12.013 12.013 0 01-1.36 3.59m0 0l.657.38c.462.267.998.063 1.14-.384.403-1.105.734-2.035.985-2.783M9.678 9.75a11.98 11.98 0 010 4.5" />
                </svg>
                Komunitas UMKM
              </div>
              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Forum UMKM
              </h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Bagikan pengalaman, tanya tentang keuangan usaha, dan dapatkan
                dukungan dari komunitas pelaku UMKM seluruh Indonesia.
              </p>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
          <ForumBoard topics={topics} currentUserId={null} currentUserRole={null} />
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}