import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useEffect, useState } from 'react';
import finalStats from '../data/df_final_stats.json';

const playerData = [
  { name: "João Silva", position: "Forward", goals: 15, assists: 8, minutes: 1200, rating: 8.5 },
  { name: "Miguel Santos", position: "Midfielder", goals: 6, assists: 12, minutes: 1450, rating: 8.2 },
  { name: "Pedro Costa", position: "Defender", goals: 2, assists: 3, minutes: 1380, rating: 7.8 },
  { name: "António Pereira", position: "Goalkeeper", goals: 0, assists: 1, minutes: 1440, rating: 8.0 },
  { name: "Carlos Oliveira", position: "Midfielder", goals: 8, assists: 6, minutes: 1100, rating: 7.9 },
];

const topScorersData = [
  { name: "João Silva", goals: 15 },
  { name: "Carlos Oliveira", goals: 8 },
  { name: "Miguel Santos", goals: 6 },
  { name: "Pedro Costa", goals: 2 },
];

const positionData = [
  { name: "Forwards", value: 4, color: "#3b82f6" },
  { name: "Midfielders", value: 6, color: "#10b981" },
  { name: "Defenders", value: 4, color: "#f59e0b" },
  { name: "Goalkeepers", value: 2, color: "#ef4444" },
];

interface PlayerDetection {
  frame: number;
  xyxy: number[];
  confidence: number;
  class_id: number;
  tracker_id: number | null;
  data: { class_name: string };
  team_id: number | null;
  transformed_x: number;
  transformed_y: number;
}

interface PlayerStatsData {
  frame: number;
  xyxy: number[];
  class_id: number;
  tracker_id: number | null;
  data: { class_name: string };
  team_id: number | null;
  t: number;
  t_cum: number;
  distance: number;
  v: number;
  a: number;
  cumulative_distance: number;
  proportion: number | string;
  proportion_player_possession: number | string;
  proportion_team_possession: number | string;
}

export function PlayerStats() {
  const [detections, setDetections] = useState<PlayerStatsData[]>([]);
  const [playerDistance, setPlayerDistance] = useState<{ name: string, distance: number }[]>([]);
  const [playerTopSpeed, setPlayerTopSpeed] = useState<{ name: string, speed: number }[]>([]);
  const [teamDetectionCounts, setTeamDetectionCounts] = useState<{ name: string, value: number, color: string }[]>([]);
  const [playerAverageVelocity, setPlayerAverageVelocity] = useState<{ name: string, averageVelocity: number }[]>([]);
  const [playerAverageAcceleration, setPlayerAverageAcceleration] = useState<{ name: string, averageAcceleration: number }[]>([]);
  const [playerSpeedProfile, setPlayerSpeedProfile] = useState<{ t_cum: number, velocity: number }[]>([]);
  const [playerPossession, setPlayerPossession] = useState<{ name: string, proportion: number }[]>([]);
  const [teamPossession, setTeamPossession] = useState<{ name: string, proportion: number }[]>([]);

  console.log('PlayerStats component rendered');

  useEffect(() => {
    console.log('Loading final stats:', finalStats);
    setDetections(finalStats.slice(0, 100)); // Display only the first 100 entries for the table

    // Process data for charts
    const cumulativeDistance: { [key: number]: number } = {};
    const topSpeed: { [key: number]: number } = {};
    const teamCounts: { [key: number]: number } = {};
    const velocitySums: { [key: number]: number } = {};
    const accelerationSums: { [key: number]: number } = {};
    const playerDetectionCounts: { [key: number]: number } = {};
    const speedProfileData: { t_cum: number, velocity: number }[] = [];
    const playerPossessionSums: { [key: number]: number } = {}; // To calculate player possession
    const playerPossessionCounts: { [key: number]: number } = {}; // To count valid player possession entries
    const teamPossessionSums: { [key: number]: number } = {}; // To calculate team possession
    const teamPossessionCounts: { [key: number]: number } = {}; // To count valid team possession entries

    finalStats.forEach(detection => {
      if (detection.tracker_id !== null) {
        cumulativeDistance[detection.tracker_id] = detection.cumulative_distance;
        topSpeed[detection.tracker_id] = Math.max(topSpeed[detection.tracker_id] || 0, detection.v);

        velocitySums[detection.tracker_id] = (velocitySums[detection.tracker_id] || 0) + detection.v;
        accelerationSums[detection.tracker_id] = (accelerationSums[detection.tracker_id] || 0) + detection.a;
        playerDetectionCounts[detection.tracker_id] = (playerDetectionCounts[detection.tracker_id] || 0) + 1;

        // For player possession
        if (detection.proportion_player_possession !== "na" && typeof detection.proportion_player_possession === 'number') {
             playerPossessionSums[detection.tracker_id] = (playerPossessionSums[detection.tracker_id] || 0) + detection.proportion_player_possession;
             playerPossessionCounts[detection.tracker_id] = (playerPossessionCounts[detection.tracker_id] || 0) + 1;
        }

        // For speed profile (example for player 1)
        if (detection.tracker_id === 1) {
            speedProfileData.push({ t_cum: detection.t_cum, velocity: detection.v });
        }

      }
      if (detection.team_id !== null) {
         teamCounts[detection.team_id] = (teamCounts[detection.team_id] || 0) + 1;

         // For team possession
         if (detection.proportion_team_possession !== "na" && typeof detection.proportion_team_possession === 'number') {
             teamPossessionSums[detection.team_id] = (teamPossessionSums[detection.team_id] || 0) + detection.proportion_team_possession;
             teamPossessionCounts[detection.team_id] = (teamPossessionCounts[detection.team_id] || 0) + 1;
         }

      }
    });

    const processedPlayerDistance = Object.entries(cumulativeDistance)
      .map(([id, distance]) => ({ name: `Player ${id}`, distance: distance / 100 }))
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 10);

    const processedPlayerTopSpeed = Object.entries(topSpeed)
       .map(([id, speed]) => ({ name: `Player ${id}`, speed: speed / 100 }))
       .sort((a, b) => b.speed - a.speed)
       .slice(0, 10);

    const processedAverageVelocity = Object.entries(velocitySums)
        .map(([id, sumV]) => ({
            name: `Player ${id}`,
            averageVelocity: (sumV / playerDetectionCounts[parseInt(id)]) / 100
        }))
        .sort((a, b) => b.averageVelocity - a.averageVelocity)
        .slice(0, 10);

    const processedAverageAcceleration = Object.entries(accelerationSums)
        .map(([id, sumA]) => ({
            name: `Player ${id}`,
            averageAcceleration: (sumA / playerDetectionCounts[parseInt(id)]) / 100
        }))
         .sort((a, b) => b.averageAcceleration - a.averageAcceleration)
        .slice(0, 10);

    // Calculate average player possession
    const processedPlayerPossession = Object.entries(playerPossessionSums)
        .filter(([id, sum]) => playerPossessionCounts[parseInt(id)] > 0) // Exclude players with no valid possession data
        .map(([id, sum]) => ({
            name: `Player ${id}`,
            proportion: sum / playerPossessionCounts[parseInt(id)]
        }))
        .sort((a, b) => b.proportion - a.proportion)
        .slice(0, 10); // Top 10 players by average possession

    // Calculate average team possession
    const processedTeamPossession = Object.entries(teamPossessionSums)
         .filter(([id, sum]) => teamPossessionCounts[parseInt(id)] > 0) // Exclude teams with no valid possession data
        .map(([id, sum]) => ({
            name: `Team ${id}`,
            proportion: sum / teamPossessionCounts[parseInt(id)] // Changed 'value' to 'proportion'
        }))
         .sort((a, b) => b.proportion - a.proportion);



    const teamColors: { [key: number]: string } = { 0: "#3b82f6", 1: "#ef4444" };
    const processedTeamCounts = Object.entries(teamCounts)
      .map(([id, value]) => ({ name: `Team ${id}`, value, color: teamColors[parseInt(id)] || '#cccccc' }));

    const scaledSpeedProfileData = speedProfileData.map(data => ({
        t_cum: data.t_cum,
        velocity: data.velocity / 100
    }));


    console.log('Processed Player Distance:', processedPlayerDistance);
    console.log('Processed Player Top Speed:', processedPlayerTopSpeed);
    console.log('Processed Team Counts:', processedTeamCounts);
    console.log('Processed Average Velocity:', processedAverageVelocity);
    console.log('Processed Average Acceleration:', processedAverageAcceleration);
    console.log('Player Speed Profile:', scaledSpeedProfileData);
    console.log('Processed Player Possession:', processedPlayerPossession);
    console.log('Processed Team Possession:', processedTeamPossession);

    setPlayerDistance(processedPlayerDistance);
    setPlayerTopSpeed(processedPlayerTopSpeed);
    setTeamDetectionCounts(processedTeamCounts);
    setPlayerAverageVelocity(processedAverageVelocity);
    setPlayerAverageAcceleration(processedAverageAcceleration);
    setPlayerSpeedProfile(scaledSpeedProfileData);
    setPlayerPossession(processedPlayerPossession);
    setTeamPossession(processedTeamPossession);

  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Player Performance Analysis</h2>
        <p className="text-gray-400">Visualizations and raw data for player performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Players by Distance Covered (Scaled by 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={playerDistance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="distance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

         <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Players by Top Speed (Velocity - Scaled by 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={playerTopSpeed}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="speed" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Players by Average Velocity (Scaled by 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={playerAverageVelocity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="averageVelocity" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Players by Average Acceleration (Scaled by 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={playerAverageAcceleration}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="averageAcceleration" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Players by Average Ball Possession</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={playerPossession}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" label={{ value: 'Average Proportion', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="proportion" fill="#065f46" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Team Ball Possession Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
               <BarChart data={teamPossession}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" label={{ value: 'Average Proportion', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="proportion" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Speed Profile (Example Player 1 - Velocity Scaled by 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={playerSpeedProfile}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="t_cum" stroke="#9ca3af" fontSize={12} label={{ value: 'Cumulative Time', position: 'insideBottom', offset: 0, fill: '#9ca3af' }}/>
                <YAxis stroke="#9ca3af" label={{ value: 'Velocity (Scaled by 100)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}/>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="velocity" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
             <p className="text-sm text-gray-400 mt-2">Note: This chart shows the velocity over cumulative time for an example player (Player 1). A player selection feature could be added to view other players. Velocity is scaled by 100.</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Team Detection Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={teamDetectionCounts}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {teamDetectionCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Raw Player Stats (First 100)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Frame</TableHead>
                <TableHead className="text-gray-300">Tracker ID</TableHead>
                <TableHead className="text-gray-300">Team ID</TableHead>
                <TableHead className="text-gray-300">Velocity</TableHead>
                <TableHead className="text-gray-300">Cumulative Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detections.map((detection, index) => (
                <TableRow key={index} className="border-gray-700">
                  <TableCell className="text-white font-medium">{detection.frame}</TableCell>
                  <TableCell className="text-gray-300">{detection.tracker_id ?? 'N/A'}</TableCell>
                  <TableCell className="text-gray-300">{detection.team_id ?? 'N/A'}</TableCell>
                   <TableCell className="text-gray-300">
                    {detection.v.toFixed(2)}
                  </TableCell>
                    <TableCell className="text-gray-300">
                    {detection.cumulative_distance.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
