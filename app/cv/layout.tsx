// frontend/app/cv/layout.tsx
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function CVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
}