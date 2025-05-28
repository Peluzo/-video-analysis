
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Download, Share } from "lucide-react";
import { useState } from "react";

interface VideoAnalysisProps {
  video: File | null;
}

export function VideoAnalysis({ video }: VideoAnalysisProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(42); // seconds

  const analysisData = {
    keyEvents: [
      { time: "12:34", event: "Goal", player: "Player 7", confidence: 0.95 },
      { time: "28:15", event: "Offside", player: "Player 3", confidence: 0.87 },
      { time: "45:22", event: "Yellow Card", player: "Player 11", confidence: 0.92 },
      { time: "67:43", event: "Corner Kick", player: "Player 5", confidence: 0.89 },
      { time: "82:18", event: "Substitution", player: "Player 9", confidence: 0.98 },
    ],
    heatmap: {
      player1: { x: 45, y: 30, intensity: 0.8 },
      player2: { x: 60, y: 45, intensity: 0.9 },
      player3: { x: 35, y: 60, intensity: 0.7 },
    },
    tactics: {
      formation: "4-3-3",
      pressurePoints: ["Left Wing", "Central Midfield"],
      weaknesses: ["Right Defense", "Counter Attacks"]
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Video Analysis</h2>
        <p className="text-gray-400">AI-powered match analysis and insights</p>
      </div>

      {/* Video Player */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center">
            {video ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <p className="text-white text-lg mb-2">{video.name}</p>
                <p className="text-gray-400">Video ready for analysis</p>
              </div>
            ) : (
              <div className="text-gray-400 text-lg">No video selected</div>
            )}
            
            {/* Video overlay with detection boxes */}
            <div className="absolute inset-0">
              {/* Simulated player detection boxes */}
              <div className="absolute top-20 left-32 w-16 h-20 border-2 border-blue-500 rounded">
                <span className="absolute -top-6 left-0 text-xs text-blue-400 bg-black px-1 rounded">Player 7</span>
              </div>
              <div className="absolute top-32 right-40 w-16 h-20 border-2 border-green-500 rounded">
                <span className="absolute -top-6 left-0 text-xs text-green-400 bg-black px-1 rounded">Player 3</span>
              </div>
              <div className="absolute bottom-20 left-1/2 w-8 h-8 border-2 border-red-500 rounded-full">
                <span className="absolute -top-6 left-0 text-xs text-red-400 bg-black px-1 rounded">Ball</span>
              </div>
            </div>
          </div>
          
          {/* Video Controls */}
          <div className="p-4 bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button size="sm" variant="outline" className="border-gray-600">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
                <span className="text-gray-600">/</span>
                <span className="text-sm text-gray-400">90:00</span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentTime / 5400) * 100}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Events */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Key Events
              <Badge className="bg-blue-600">AI Detected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisData.keyEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-white font-medium">{event.event}</p>
                      <p className="text-sm text-gray-400">{event.player}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">{event.time}</p>
                    <p className="text-xs text-green-400">{Math.round(event.confidence * 100)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tactical Analysis */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Tactical Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Formation</h4>
              <Badge className="bg-purple-600 text-lg px-3 py-1">{analysisData.tactics.formation}</Badge>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Pressure Points</h4>
              <div className="flex flex-wrap gap-2">
                {analysisData.tactics.pressurePoints.map((point, index) => (
                  <Badge key={index} variant="outline" className="border-green-500 text-green-400">
                    {point}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Areas to Improve</h4>
              <div className="flex flex-wrap gap-2">
                {analysisData.tactics.weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="outline" className="border-red-500 text-red-400">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Heatmap */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Player Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-green-600 rounded-lg aspect-[2/1] overflow-hidden">
            {/* Soccer field background */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full border-2 border-white">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white rounded-full"></div>
              </div>
            </div>
            
            {/* Player positions */}
            {Object.entries(analysisData.heatmap).map(([player, pos], index) => (
              <div
                key={player}
                className="absolute w-8 h-8 rounded-full border-2 border-white bg-red-500"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: pos.intensity,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-1 rounded">
                  P{index + 1}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
