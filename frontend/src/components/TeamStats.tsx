import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts";

const matchResults = [
  { match: "vs Team A", goals: 3, conceded: 1, possession: 65, result: "W" },
  { match: "vs Team B", goals: 1, conceded: 2, possession: 45, result: "L" },
  { match: "vs Team C", goals: 2, conceded: 2, possession: 55, result: "D" },
  { match: "vs Team D", goals: 4, conceded: 0, possession: 70, result: "W" },
  { match: "vs Team E", goals: 1, conceded: 1, possession: 50, result: "D" },
];

const monthlyStats = [
  { month: "Jan", goals: 12, assists: 8, cleanSheets: 2 },
  { month: "Feb", goals: 15, assists: 12, cleanSheets: 3 },
  { month: "Mar", goals: 18, assists: 10, cleanSheets: 4 },
  { month: "Apr", goals: 22, assists: 15, cleanSheets: 5 },
  { month: "May", goals: 19, assists: 13, cleanSheets: 3 },
];

const possessionData = [
  { match: "Match 1", possession: 65 },
  { match: "Match 2", possession: 45 },
  { match: "Match 3", possession: 55 },
  { match: "Match 4", possession: 70 },
  { match: "Match 5", possession: 50 },
];

export function TeamStats() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Statistics</h2>
        <p className="text-gray-400">Overall team performance metrics and analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">15</div>
              <div className="text-sm text-gray-400">Wins</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">5</div>
              <div className="text-sm text-gray-400">Draws</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">3</div>
              <div className="text-sm text-gray-400">Losses</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">86</div>
              <div className="text-sm text-gray-400">Goals Scored</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white">Monthly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="goals" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="assists" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white">Possession Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={possessionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="match" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line type="monotone" dataKey="possession" stroke="#f59e0b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Match Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matchResults.map((match, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    match.result === 'W' ? 'bg-green-500' : 
                    match.result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-white font-medium">{match.match}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-400">
                    Score: <span className="text-white">{match.goals}-{match.conceded}</span>
                  </span>
                  <span className="text-gray-400">
                    Possession: <span className="text-white">{match.possession}%</span>
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    match.result === 'W' ? 'bg-green-900 text-green-300' : 
                    match.result === 'L' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {match.result === 'W' ? 'Win' : match.result === 'L' ? 'Loss' : 'Draw'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
