import {
  BarChart3,
  Home,
  Users,
  Target,
  Activity,
  Settings,
  Circle,
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

const menuItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
    id: "dashboard"
  },
  {
    title: "Player Stats",
    url: "#",
    icon: Users,
    id: "players"
  },
  {
    title: "Team Stats",
    url: "#",
    icon: Target,
    id: "team"
  },
  {
    title: "Ball Detection",
    url: "#",
    icon: Circle,
    id: "ball"
  },
];

interface AppSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export function AppSidebar({ activeSection = "dashboard", onSectionChange }: AppSidebarProps) {
  const handleMenuClick = (itemId: string) => {
    onSectionChange?.(itemId);
  };

  return (
    <Sidebar className="bg-gray-950 border-gray-800">
      <SidebarHeader className="border-b border-gray-800 p-6 bg-gray-950">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/lovable-uploads/0de70b71-a308-41e9-91a8-894ecfc73c21.png" 
              alt="TIA Sport Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">TIA Sport</h2>
            <p className="text-xs text-gray-400">Tactical Intelligence Assistant</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-gray-950">
        <SidebarGroup className="bg-gray-950">
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2 bg-gray-950">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="bg-gray-950">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className={`text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 cursor-pointer ${
                      activeSection === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-800 p-4 bg-gray-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
