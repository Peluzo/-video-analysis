
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from "recharts";
import { Activity, Users, Target, Clock, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import analyticsData from "@/data/analyticsData.json";

export function AnalyticsDashboard() {
  const { matchData, playerStats, positionData, keyMetrics } = analyticsData;

  const renderTrendIcon = (trend) => {
    return trend === 'up' ? 
      <ArrowUp className="w-4 h-4 mr-1" /> : 
      <ArrowDown className="w-4 h-4 mr-1" />;
  };

  const getTrendColorClass = (trend) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Match Overview</h2>
        <p className="text-gray-400">Real-time analytics and performance insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ball Possession</p>
                <p className="text-2xl font-bold">{keyMetrics.ballPossession.value}%</p>
                <div className={`flex items-center text-sm mt-1 ${getTrendColorClass(keyMetrics.ballPossession.trend)}`}>
                  {renderTrendIcon(keyMetrics.ballPossession.trend)}
                  +{keyMetrics.ballPossession.change}%
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Goals Scored</p>
                <p className="text-2xl font-bold">{keyMetrics.goalsScored.value}</p>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  {keyMetrics.goalsScored.status}
                </div>
              </div>
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pass Accuracy</p>
                <p className="text-2xl font-bold">{keyMetrics.passAccuracy.value}%</p>
                <div className={`flex items-center text-sm mt-1 ${getTrendColorClass(keyMetrics.passAccuracy.trend)}`}>
                  {renderTrendIcon(keyMetrics.passAccuracy.trend)}
                  {keyMetrics.passAccuracy.change}%
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Distance Covered</p>
                <p className="text-2xl font-bold">{keyMetrics.distanceCovered.value}km</p>
                <div className={`flex items-center text-sm mt-1 ${getTrendColorClass(keyMetrics.distanceCovered.trend)}`}>
                  {renderTrendIcon(keyMetrics.distanceCovered.trend)}
                  +{keyMetrics.distanceCovered.change}km
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Match Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={matchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="minute" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="possession" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2}
                />
                <Area 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#8B5CF6" 
                  fill="#8B5CF6" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Field Position</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Player Performance Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Player</th>
                  <th className="text-left py-3 px-4 text-gray-400">Goals</th>
                  <th className="text-left py-3 px-4 text-gray-400">Assists</th>
                  <th className="text-left py-3 px-4 text-gray-400">Distance (km)</th>
                  <th className="text-left py-3 px-4 text-gray-400">Performance</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((player, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-white">{player.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-blue-600">
                        {player.goals}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-green-600">
                        {player.assists}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{player.distance}</td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (player.goals + player.assists) * 25)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
