"use client";

import { useState } from "react";
import { DashboardSidebar } from "./sidebar";
import { DashboardTopBar } from "./topbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AuthenticatedLayout({ children, title, breadcrumbs }: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <DashboardTopBar
          title={title}
          breadcrumbs={breadcrumbs}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}