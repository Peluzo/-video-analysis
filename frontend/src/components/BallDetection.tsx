import { useEffect, useState } from 'react';
import ballDetections from '../data/initial_ball_detections.json';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface BallDetection {
  frame: number;
  xyxy: number[];
  confidence: number;
  transformed_x: number;
  transformed_y: number;
}

export function BallDetection() {
  console.log('BallDetection component rendered');
  const [detections, setDetections] = useState<BallDetection[]>([]);
  const [detectionsPerFrame, setDetectionsPerFrame] = useState<{ frame: number, count: number }[]>([]);

  useEffect(() => {
    console.log('Loading ball detections:', ballDetections);
    setDetections(ballDetections);

    // Process data for detections per frame chart
    const frameCounts: { [key: number]: number } = {};
    ballDetections.forEach(detection => {
      frameCounts[detection.frame] = (frameCounts[detection.frame] || 0) + 1;
    });

    const processedFrameCounts = Object.entries(frameCounts)
      .map(([frame, count]) => ({ frame: parseInt(frame), count }))
      .sort((a, b) => a.frame - b.frame); // Sort by frame number

    console.log('Processed Detections Per Frame:', processedFrameCounts);
    setDetectionsPerFrame(processedFrameCounts);

  }, []);

  return (
    <div className="p-4 min-h-[50vh]">
      <h2 className="text-2xl font-bold mb-4">Ball Detection Data</h2>

      {/* Detections Per Frame Chart */}
       <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Ball Detections Per Frame</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={detectionsPerFrame}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="frame" stroke="#9ca3af" fontSize={12} label={{ value: 'Frame', position: 'insideBottom', offset: 0, fill: '#9ca3af' }}/>
                <YAxis stroke="#9ca3af" label={{ value: 'Detection Count', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-gray-800">Frame</th>
              <th className="px-4 py-2 border text-gray-800">Confidence</th>
              <th className="px-4 py-2 border text-gray-800">Position (X, Y)</th>
              <th className="px-4 py-2 border text-gray-800">Transformed Position</th>
            </tr>
          </thead>
          <tbody>
            {detections.map((detection, index) => {
              console.log('Rendering detection:', detection);
              return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-gray-800">{detection.frame}</td>
                <td className="px-4 py-2 border text-gray-800">
                  {(detection.confidence * 100).toFixed(2)}%
                </td>
                <td className="px-4 py-2 border text-gray-800">
                  ({detection.xyxy[0].toFixed(1)}, {detection.xyxy[1].toFixed(1)})
                </td>
                <td className="px-4 py-2 border text-gray-800">
                  ({detection.transformed_x.toFixed(1)}, {detection.transformed_y.toFixed(1)})
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
} 