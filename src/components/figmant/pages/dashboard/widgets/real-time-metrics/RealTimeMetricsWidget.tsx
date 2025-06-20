
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

export const RealTimeMetricsWidget: React.FC = () => {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);

  // Fetch real-time analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ['real-time-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claude_usage_logs')
        .select('success, response_time_ms, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: activeUsers } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('user_id')
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour
      
      if (error) throw error;
      return new Set(data?.map(log => log.user_id) || []).size;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  useEffect(() => {
    if (analyticsData) {
      const successRate = analyticsData.length > 0 
        ? (analyticsData.filter(log => log.success).length / analyticsData.length * 100).toFixed(1)
        : '0';
      
      const avgResponseTime = analyticsData.length > 0
        ? (analyticsData.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / analyticsData.length).toFixed(0)
        : '0';

      const newMetrics: RealTimeMetric[] = [
        {
          label: 'Active Users',
          value: activeUsers?.toString() || '0',
          change: '+12%',
          trend: 'up',
          icon: Users
        },
        {
          label: 'Success Rate',
          value: `${successRate}%`,
          change: '+2.1%',
          trend: 'up',
          icon: Zap
        },
        {
          label: 'Avg Response',
          value: `${avgResponseTime}ms`,
          change: '-8%',
          trend: 'up',
          icon: Clock
        },
        {
          label: 'Analyses Today',
          value: analyticsData.length.toString(),
          change: '+15%',
          trend: 'up',
          icon: Activity
        }
      ];

      setMetrics(newMetrics);
    }
  }, [analyticsData, activeUsers]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live System Metrics
          </CardTitle>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <metric.icon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <div className="text-lg font-bold text-gray-900">{metric.value}</div>
              <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
              <div className={`text-xs font-medium ${getTrendColor(metric.trend)}`}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
