
import React from "react";
import { Sidebar } from "./Sidebar";
import { KpiProvider } from "@/context/KpiContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <KpiProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar className="hidden md:block w-64 flex-shrink-0" />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </KpiProvider>
  );
}
