
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import playerData from "@/data/playerData.json";

export function PlayerStats() {
  const { players, topScorers, positionDistribution } = playerData;

  const getPositionBadgeClass = (position) => {
    const classes = {
      'Forward': 'border-blue-500 text-blue-400',
      'Midfielder': 'border-green-500 text-green-400',
      'Defender': 'border-yellow-500 text-yellow-400',
      'Goalkeeper': 'border-red-500 text-red-400'
    };
    return classes[position] || '';
  };

  const getRatingBadgeClass = (rating) => {
    if (rating >= 8.0) return 'border-green-500 text-green-400';
    if (rating >= 7.5) return 'border-yellow-500 text-yellow-400';
    return 'border-red-500 text-red-400';
  };

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
              <BarChart data={topScorers}>
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
                  data={positionDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {positionDistribution.map((entry, index) => (
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
              {players.map((player) => (
                <TableRow key={player.id} className="border-gray-700">
                  <TableCell className="text-white font-medium">{player.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getPositionBadgeClass(player.position)}
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
                      className={getRatingBadgeClass(player.rating)}
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
