
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

export function PlayerStats() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Player Statistics</h2>
        <p className="text-gray-400">Individual player performance metrics and analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Top Scorers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topScorersData}>
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
                <Bar dataKey="goals" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Squad Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {positionData.map((entry, index) => (
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
          <CardTitle className="text-white">Player Performance Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Player</TableHead>
                <TableHead className="text-gray-300">Position</TableHead>
                <TableHead className="text-gray-300">Goals</TableHead>
                <TableHead className="text-gray-300">Assists</TableHead>
                <TableHead className="text-gray-300">Minutes</TableHead>
                <TableHead className="text-gray-300">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playerData.map((player) => (
                <TableRow key={player.name} className="border-gray-700">
                  <TableCell className="text-white font-medium">{player.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${player.position === 'Forward' ? 'border-blue-500 text-blue-400' : ''}
                        ${player.position === 'Midfielder' ? 'border-green-500 text-green-400' : ''}
                        ${player.position === 'Defender' ? 'border-yellow-500 text-yellow-400' : ''}
                        ${player.position === 'Goalkeeper' ? 'border-red-500 text-red-400' : ''}
                      `}
                    >
                      {player.position}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{player.goals}</TableCell>
                  <TableCell className="text-gray-300">{player.assists}</TableCell>
                  <TableCell className="text-gray-300">{player.minutes}</TableCell>
                  <TableCell className="text-gray-300">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${player.rating >= 8.0 ? 'border-green-500 text-green-400' : ''}
                        ${player.rating >= 7.5 && player.rating < 8.0 ? 'border-yellow-500 text-yellow-400' : ''}
                        ${player.rating < 7.5 ? 'border-red-500 text-red-400' : ''}
                      `}
                    >
                      {player.rating}
                    </Badge>
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
