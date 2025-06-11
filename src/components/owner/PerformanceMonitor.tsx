
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalyticsSummary, useSystemMetrics } from '@/hooks/useAnalytics';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export const PerformanceMonitor = () => {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(7);
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();

  if (summaryLoading || metricsLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-muted rounded animate-pulse w-32" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const performanceMetrics = [
    {
      title: 'Avg Response Time',
      value: `${Math.round(summary?.avg_response_time || 0)}ms`,
      status: summary?.avg_response_time && summary.avg_response_time < 2000 ? 'good' : 'warning',
      icon: Clock,
      trend: summary?.avg_response_time && summary.avg_response_time < 2000 ? 'up' : 'down'
    },
    {
      title: 'Success Rate',
      value: `${summary?.success_rate?.toFixed(1) || '0'}%`,
      status: summary?.success_rate && summary.success_rate > 95 ? 'good' : 'warning',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Active Users (7d)',
      value: summary?.active_users?.toLocaleString() || '0',
      status: 'good',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Total Analyses',
      value: summary?.total_analyses?.toLocaleString() || '0',
      status: 'good',
      icon: Zap,
      trend: 'up'
    },
    {
      title: 'Error Rate',
      value: `${summary?.success_rate ? (100 - summary.success_rate).toFixed(1) : '0'}%`,
      status: summary?.success_rate && summary.success_rate > 95 ? 'good' : 'error',
      icon: AlertTriangle,
      trend: 'down'
    },
    {
      title: 'Cost (7d)',
      value: `$${summary?.total_cost?.toFixed(2) || '0.00'}`,
      status: 'good',
      icon: Activity,
      trend: 'up'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Process metrics for chart
  const chartData = metrics?.slice(0, 20).reverse().map((metric: any) => ({
    timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    value: parseFloat(metric.metric_value),
    name: metric.metric_name
  })) || [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {performanceMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="secondary" className={getStatusColor(metric.status)}>
                  {metric.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last 7 days
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>System Performance Trend</CardTitle>
            <CardDescription>
              Real-time performance metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary?.avg_response_time && summary.avg_response_time > 3000 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">High response times detected</span>
                </div>
              )}
              {summary?.success_rate && summary.success_rate < 95 && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Low success rate - investigate errors</span>
                </div>
              )}
              {(!summary?.avg_response_time || summary.avg_response_time < 2000) && 
               (!summary?.success_rate || summary.success_rate > 95) && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">System performing optimally</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Users</span>
                <span className="font-medium">{summary?.total_users || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Uploads</span>
                <span className="font-medium">{summary?.total_uploads || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tokens Used</span>
                <span className="font-medium">{summary?.total_tokens_used?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Cost</span>
                <span className="font-medium">${summary?.total_cost?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
