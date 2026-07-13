"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  
  // Pages that do not show the dashboard sidebar (e.g. landing, auth)
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#050508] text-slate-100 flex">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 min-w-0 ${
          isDashboard ? "lg:pl-68 p-4 lg:p-8 pt-20 lg:pt-8" : ""
        }`}>
          {children}
        </main>
      </div>
    </AppProvider>
  );
};
