// frontend/components/app-sidebar.tsx
'use client';
import { LogOut } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/api-client"
import { 
    FileText, 
    LayoutTemplate, 
    Files, 
    PenTool, 
    Settings,
    Plus,
    User2,
    HelpCircle,
    Moon,
    ChevronUp
  } from "lucide-react"
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter
  } from "@/components/ui/sidebar"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Switch } from "@/components/ui/switch"

  const menuItems = [
    {
      title: "Templates",
      url: "/cv/templates",
      icon: LayoutTemplate,
    },
    {
      title: "My CVs",
      url: "/cv/list",
      icon: Files,
    },
    {
      title: "Cover Letters",
      url: "/cv/cover-letters",
      icon: FileText,
    },
    {
      title: "AI Writer",
      url: "/cv/ai-writer",
      icon: PenTool,
    },
    {
      title: "Settings",
      url: "/cv/settings",
      icon: Settings,
    },
  ]
  
  export function AppSidebar() {
    const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Function to handle logout
  const handleLogout = async () => {
    setLoading(true)
    try {
      await logoutUser();  // Call the logout function from the API client
    } catch (error) {
      console.error("Error during logout", error)
    } finally {
      setLoading(false)
    }
  }
    return (
      <Sidebar>
        <SidebarHeader className="h-[80px] flex items-center px-6 border-b">
          <h1 className="text-2xl font-bold">CV Builder</h1>
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/cv/create" className="bg-primary text-primary-foreground">
                      <Plus />
                      <span>Create New CV</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Switch />
                <span>Theme</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <HelpCircle />
                    <span>Help</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  side="top" 
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Documentation</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>About</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="mr-2" />
              <span>{loading ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }