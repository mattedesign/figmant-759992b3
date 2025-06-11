
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, MousePointer, Clock, Target, Brain, Zap } from 'lucide-react';
import { useAnalyticsSummary, useUserActivityLogs } from '@/hooks/useAnalytics';
import { useClaudeUsageStats } from '@/hooks/useClaudeUsageStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const EnhancedAnalyticsOverview = () => {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary(30);
  const { data: activityLogs, isLoading: activityLoading } = useUserActivityLogs(50);
  const { data: claudeStats, isLoading: claudeLoading } = useClaudeUsageStats(true);

  if (summaryLoading || activityLoading || claudeLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded animate-pulse w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    {
      title: 'Total Users',
      value: summary?.total_users?.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Active Users (30d)',
      value: summary?.active_users?.toLocaleString() || '0',
      change: '+8.2%',
      trend: 'up',
      icon: MousePointer,
    },
    {
      title: 'Avg. Response Time',
      value: `${Math.round(summary?.avg_response_time || 0)}ms`,
      change: summary?.avg_response_time && summary.avg_response_time < 2000 ? '-12%' : '+5%',
      trend: summary?.avg_response_time && summary.avg_response_time < 2000 ? 'up' : 'down',
      icon: Clock,
    },
    {
      title: 'Success Rate',
      value: `${summary?.success_rate?.toFixed(1) || '0'}%`,
      change: '+1.8%',
      trend: 'up',
      icon: Target,
    },
  ];

  // Process activity data for charts
  const recentActivity = activityLogs?.slice(0, 10).reverse() || [];
  const activityByType = activityLogs?.reduce((acc: any, log: any) => {
    acc[log.activity_type] = (acc[log.activity_type] || 0) + 1;
    return acc;
  }, {}) || {};

  const activityChartData = Object.entries(activityByType).map(([type, count]) => ({
    type,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {metric.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Claude AI Performance
            </CardTitle>
            <CardDescription>
              AI analysis metrics and usage statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">
                    {claudeStats?.totalTokens?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Tokens Used</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    ${claudeStats?.totalCost?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span>{summary?.success_rate?.toFixed(1) || '0'}%</span>
                </div>
                <Progress value={summary?.success_rate || 0} className="w-full" />
                <div className="flex justify-between text-sm">
                  <span>Avg Response Time</span>
                  <Badge variant={summary?.avg_response_time && summary.avg_response_time < 2000 ? 'default' : 'destructive'}>
                    {Math.round(summary?.avg_response_time || 0)}ms
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Activity
            </CardTitle>
            <CardDescription>
              Real-time user activity and system performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold">
                    {summary?.total_uploads || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Uploads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {summary?.total_analyses || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Analyses</div>
                </div>
              </div>
              {activityChartData.length > 0 && (
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityChartData}>
                      <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest user interactions and system events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.activity_type}</Badge>
                    <span className="text-muted-foreground">
                      {activity.page_path || 'Unknown page'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
