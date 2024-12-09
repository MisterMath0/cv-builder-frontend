'use client';

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import { logoutUser } from "@/lib/api-client";
import {
  FileText,
  LayoutTemplate,
  Files,
  PenTool,
  Settings,
  Plus,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { CardTitle } from "./ui/card";

const menuItems = [
  { title: "Templates", url: "/templates", icon: LayoutTemplate },
  { title: "My CVs", url: "/cv/cvs", icon: Files },
  { title: "Cover Letters", url: "/cover-letters", icon: FileText },
  { title: "AI Writer", url: "/ai-writer", icon: PenTool },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const [loading, setLoading] = useState(false);

  // Function to handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser(); // Call the logout function from the API client
    } catch (error) {
      console.error("Error during logout", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="h-[100px] flex items-center px-6 border-b">
        <FileText className="h-12 w-12 text-blue-600" />
          <span className="font-bold text-xl">CV Builder</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/cv/create" className="bg-primary text-primary-foreground text-lg flex items-center">
                    <Plus className="w-6 h-6 mr-2" />
                    <span>Create New CV</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className={`flex items-center text-lg px-3 py-2 rounded ${
                        pathname === item.url
                          ? "text-black font-bold bg-gray-200" // Highlight current link
                          : "text-gray-700 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-6 h-6 mr-2" /> {/* Increase icon size */}
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
              <span className="text-lg">Theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <HelpCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg">Help</span>
                  <ChevronUp className="ml-auto w-5 h-5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
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
              <LogOut className="w-6 h-6 mr-2" />
              <span className="text-lg">{loading ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
