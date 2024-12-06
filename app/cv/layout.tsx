'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ClipLoader } from "react-spinners";

export default function CVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 500);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ClipLoader size={50} color="#4b5563" />
      </div>
    );
  }

  return (
    <Suspense>
      <TooltipProvider>
        <SidebarProvider>
          <div className="flex h-full w-full">
            <AppSidebar />
            <main className="flex-1">
              <div className="h-full">
                <SidebarTrigger />
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </Suspense>
  );
}
