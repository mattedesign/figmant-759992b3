
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Activity, 
  Clock, 
  Zap,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { PerformanceChart } from './PerformanceChart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartDataPoint {
  date: string;
  analyses: number;
  successRate: number;
  avgConfidence: number;
  processingTime: number;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

interface UsageMetricsProps {
  data: ChartDataPoint[];
  metrics: PerformanceMetric[];
  isLoading: boolean;
}

export const UsageMetrics: React.FC<UsageMetricsProps> = ({
  data,
  metrics,
  isLoading
}) => {
  // Mock additional usage data
  const usageByTimeData = [
    { hour: '00', analyses: 3 },
    { hour: '06', analyses: 8 },
    { hour: '09', analyses: 24 },
    { hour: '12', analyses: 31 },
    { hour: '15', analyses: 28 },
    { hour: '18', analyses: 19 },
    { hour: '21', analyses: 12 }
  ];

  const analysisTypeData = [
    { name: 'Standard Analysis', value: 45, color: '#3b82f6' },
    { name: 'Premium Analysis', value: 25, color: '#10b981' },
    { name: 'Batch Analysis', value: 20, color: '#f59e0b' },
    { name: 'Quick Analysis', value: 10, color: '#8b5cf6' }
  ];

  const deviceTypeData = [
    { name: 'Desktop', value: 60, color: '#6366f1' },
    { name: 'Mobile', value: 25, color: '#ec4899' },
    { name: 'Tablet', value: 15, color: '#14b8a6' }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Analyses</span>
                <span className="text-2xl font-bold text-gray-900">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Peak Hour</span>
                <Badge variant="secondary">12:00 PM</Badge>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-gray-500">78% of daily target reached</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-600" />
              User Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Sessions</span>
                <span className="text-2xl font-bold text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Session</span>
                <Badge variant="secondary">24m</Badge>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-gray-500">Above average engagement</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-purple-600" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Queue Length</span>
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Normal</Badge>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-gray-500">Low system load</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage by Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Usage by Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={usageByTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  formatter={(value: any) => [`${value} analyses`, 'Count']}
                  labelFormatter={(label) => `${label}:00`}
                />
                <Bar dataKey="analyses" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analysis Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analysis Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analysisTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analysisTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Usage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {analysisTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Volume Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Volume Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PerformanceChart 
            data={data}
            metric="analyses"
            isLoading={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
