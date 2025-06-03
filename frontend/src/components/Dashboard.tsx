import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoUpload } from "@/components/VideoUpload";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { VideoAnalysis } from "@/components/VideoAnalysis";
import { PlayerStats } from "@/components/PlayerStats";
import { TeamStats } from "@/components/TeamStats";
import { BallDetection } from "@/components/BallDetection";
import { PoseEstimation } from "@/components/PoseEstimation";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

interface DashboardProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Dashboard({ activeSection, onSectionChange }: DashboardProps) {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log('Dashboard - activeSection:', activeSection);
  }, [activeSection]);

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Stay on dashboard after upload
    }, 3000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "players":
        return <PlayerStats />;
      case "team":
        return <TeamStats />;
      case "ball":
        return <BallDetection />;
      case "pose":
        return <PoseEstimation />;
      default:
        return (
          <div className="space-y-8">
            <VideoUpload onVideoUpload={handleVideoUpload} isProcessing={isProcessing} />
            <AnalyticsDashboard />
            {uploadedVideo && (
              <VideoAnalysis video={uploadedVideo} />
            )}
          </div>
        );
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
