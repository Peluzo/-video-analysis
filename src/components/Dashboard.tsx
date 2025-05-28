
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoUpload } from "@/components/VideoUpload";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { VideoAnalysis } from "@/components/VideoAnalysis";
import { useState } from "react";
import { Menu } from "lucide-react";

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setActiveSection("analysis");
    }, 3000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "upload":
        return <VideoUpload onVideoUpload={handleVideoUpload} isProcessing={isProcessing} />;
      case "analysis":
        return <VideoAnalysis video={uploadedVideo} />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <main className="flex-1 bg-gray-900 text-white">
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 p-4">
          <SidebarTrigger className="text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          <div>
            <h1 className="text-xl font-semibold">Soccer Analytics Dashboard</h1>
            <p className="text-sm text-gray-400">Advanced video analysis and performance insights</p>
          </div>
        </div>
      </header>
      
      <div className="p-6">
        {renderContent()}
      </div>
    </main>
  );
}
