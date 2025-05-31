import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";
import { useState, useEffect } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    console.log('Index - activeSection:', activeSection);
  }, [activeSection]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900">
        <AppSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <Dashboard 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
