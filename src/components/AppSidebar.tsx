
import {
  BarChart3,
  Upload,
  Video,
  Settings,
  Home,
  Activity,
  Users,
  Target,
  PieChart
} from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    id: "dashboard"
  },
  {
    title: "Upload Video",
    url: "#",
    icon: Upload,
    id: "upload"
  },
  {
    title: "Video Analysis",
    url: "#",
    icon: Video,
    id: "analysis"
  },
  {
    title: "Player Stats",
    url: "#",
    icon: Users,
    id: "players"
  },
  {
    title: "Match Analytics",
    url: "#",
    icon: BarChart3,
    id: "match"
  },
  {
    title: "Performance",
    url: "#",
    icon: Activity,
    id: "performance"
  },
  {
    title: "Tactics",
    url: "#",
    icon: Target,
    id: "tactics"
  },
];

interface AppSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AppSidebar({ activeSection = "dashboard", onSectionChange }: AppSidebarProps) {
  return (
    <Sidebar className="bg-gray-950 border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">SoccerVision</h2>
            <p className="text-xs text-gray-400">Analytics Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gray-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 ${
                      activeSection === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                    }`}
                    onClick={() => onSectionChange?.(item.id)}
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-800 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-gray-400 hover:text-white hover:bg-gray-800">
              <a href="#" className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
