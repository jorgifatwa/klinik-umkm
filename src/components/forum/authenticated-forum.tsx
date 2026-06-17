"use client";

import { AuthenticatedLayout } from "@/components/dashboard/authenticated-layout";
import { ForumBoard } from "./forum-board";

interface ForumAuthor {
  id: string;
  name?: string | null;
}

interface ForumComment {
  id: string;
  content: string;
  author: ForumAuthor;
  createdAt: string | Date;
}

interface ForumLike {
  id: string;
  userId: string;
}

interface ForumTopic {
  id: string;
  title: string;
  content: string;
  category: string;
  author: ForumAuthor;
  comments: ForumComment[];
  likes: ForumLike[];
  createdAt: string | Date;
}

interface AuthenticatedForumProps {
  topics: ForumTopic[];
  currentUserId: string;
  currentUserRole: string;
}

export function AuthenticatedForum({ topics, currentUserId, currentUserRole }: AuthenticatedForumProps) {
  const totalTopics = topics.length;
  const totalReplies = topics.reduce((sum, t) => sum + t.comments.length, 0);
  const activeMembers = new Set(topics.map((t) => t.author.id)).size;

  return (
    <AuthenticatedLayout
      title="Forum Diskusi"
      breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Forum" }]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#0F4C9A15" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F4C9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Total Topik</p>
              <p className="text-[18px] font-bold text-gray-900">{totalTopics}</p>
            </div>
          </div>
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#1E73D815" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E73D8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Total Balasan</p>
              <p className="text-[18px] font-bold text-gray-900">{totalReplies}</p>
            </div>
          </div>
          <div className="kpi-card flex items-center gap-4">
            <div className="kpi-card-icon" style={{ backgroundColor: "#37B24D15" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#37B24D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500">Anggota Aktif</p>
              <p className="text-[18px] font-bold text-gray-900">{activeMembers}</p>
            </div>
          </div>
        </div>

        {/* Forum Board */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <ForumBoard
            topics={topics}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}