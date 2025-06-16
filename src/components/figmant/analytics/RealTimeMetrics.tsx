
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Zap, 
  Users, 
  Clock,
  Wifi,
  WifiOff,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

interface RealTimeMetricsProps {
  className?: string;
}

export const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      id: '1',
      name: 'Active Analyses',
      value: 3,
      unit: '',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Queue Length',
      value: 1,
      unit: '',
      status: 'healthy',
      trend: 'down',
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'Avg Response Time',
      value: 2.3,
      unit: 's',
      status: 'healthy',
      trend: 'stable',
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'System Load',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'up',
      lastUpdated: new Date()
    },
    {
      id: '5',
      name: 'Active Users',
      value: 12,
      unit: '',
      status: 'healthy',
      trend: 'up',
      lastUpdated: new Date()
    },
    {
      id: '6',
      name: 'Error Rate',
      value: 0.2,
      unit: '%',
      status: 'healthy',
      trend: 'down',
      lastUpdated: new Date()
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value + (Math.random() - 0.5) * (metric.value * 0.1)),
        lastUpdated: new Date(),
        trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : !prev);
    }, 30000);

    return () => clearInterval(connectionInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      default:
        return '→';
    }
  };

  const getMetricIcon = (name: string) => {
    if (name.includes('Active')) return Activity;
    if (name.includes('Queue')) return Clock;
    if (name.includes('Response') || name.includes('Load')) return Zap;
    if (name.includes('Users')) return Users;
    return Activity;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-Time Metrics
          </CardTitle>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Live
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <WifiOff className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const Icon = getMetricIcon(metric.name);
            const statusColor = getStatusColor(metric.status);
            
            return (
              <div 
                key={metric.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  isConnected ? "border-gray-200" : "border-gray-300 opacity-75"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {metric.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                    <Badge variant="secondary" className={cn("text-xs", statusColor)}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value.toFixed(metric.unit === '%' || metric.unit === 's' ? 1 : 0)}
                  </span>
                  <span className="text-sm text-gray-600">{metric.unit}</span>
                </div>
                
                {metric.unit === '%' && (
                  <Progress 
                    value={metric.value} 
                    className="h-2 mb-2"
                    // @ts-ignore
                    indicatorClassName={
                      metric.value > 80 ? 'bg-red-500' :
                      metric.value > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }
                  />
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Updated {metric.lastUpdated.toLocaleTimeString()}</span>
                  {isConnected && (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {!isConnected && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm font-medium">Connection Lost</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Real-time updates are unavailable. Showing last known values.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
