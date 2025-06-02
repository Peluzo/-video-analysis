
import { Upload, Video, FileVideo, Loader2, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
  isProcessing: boolean;
}

export function VideoUpload({ onVideoUpload, isProcessing }: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onVideoUpload(selectedFile);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Upload Match Video</h2>
        <p className="text-gray-400">Upload your soccer match video for AI-powered analysis</p>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isProcessing ? (
              <div className="space-y-4">
                <Loader2 className="w-16 h-16 text-blue-500 mx-auto animate-spin" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Processing Video...</h3>
                  <p className="text-gray-400">Our AI is analyzing the match footage</p>
                  <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mt-4">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">File Selected</h3>
                  <p className="text-gray-400">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleUpload}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Start Analysis
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Choose Different File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Video className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Drop your video here, or click to browse
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Support for MP4, MOV, AVI files up to 2GB
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <FileVideo className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Player Tracking</h3>
            <p className="text-sm text-gray-400">Track player movements and positions throughout the match</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Ball Analysis</h3>
            <p className="text-sm text-gray-400">Analyze ball possession, passes, and movement patterns</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-semibold mb-2">Performance Metrics</h3>
            <p className="text-sm text-gray-400">Generate detailed performance statistics and insights</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
