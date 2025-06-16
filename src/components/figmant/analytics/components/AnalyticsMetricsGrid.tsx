
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  description?: string;
  progress?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  progress,
  status = 'info'
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", getStatusColor())} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {change && (
          <div className="flex items-center space-x-1 text-xs mt-2">
            {getTrendIcon()}
            <span className={cn(
              "font-medium",
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            )}>
              {change}
            </span>
            <span className="text-gray-500">vs last period</span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface AnalyticsMetricsGridProps {
  dataStats: any;
  className?: string;
}

export const AnalyticsMetricsGrid: React.FC<AnalyticsMetricsGridProps> = ({
  dataStats,
  className
}) => {
  const metrics: MetricCardProps[] = [
    {
      title: 'Total Analyses',
      value: dataStats.totalAnalyses,
      change: '+12.5%',
      trend: 'up' as const,
      icon: BarChart3,
      description: 'All-time analysis count',
      status: 'info' as const
    },
    {
      title: 'Completion Rate',
      value: `${dataStats.completionRate}%`,
      change: '+5.2%',
      trend: 'up' as const,
      icon: CheckCircle,
      progress: dataStats.completionRate,
      status: dataStats.completionRate > 80 ? 'success' : 'warning'
    },
    {
      title: 'Active Prompts',
      value: dataStats.totalPrompts,
      change: '+8.1%',
      trend: 'up' as const,
      icon: Zap,
      description: 'Recently used prompts',
      status: 'info' as const
    },
    {
      title: 'Activity Score',
      value: dataStats.activityScore,
      change: dataStats.activityScore > 50 ? '+15.3%' : '-3.2%',
      trend: dataStats.activityScore > 50 ? 'up' : 'down',
      icon: Target,
      progress: dataStats.activityScore,
      status: dataStats.activityScore > 70 ? 'success' : 
             dataStats.activityScore > 40 ? 'warning' : 'error'
    },
    {
      title: 'Pending Items',
      value: dataStats.pendingAnalyses,
      change: dataStats.pendingAnalyses > 5 ? '+2' : '-1',
      trend: dataStats.pendingAnalyses > 5 ? 'down' : 'up',
      icon: AlertCircle,
      description: 'Requiring attention',
      status: dataStats.pendingAnalyses > 5 ? 'warning' : 'success'
    },
    {
      title: 'Avg Processing',
      value: '2.4s',
      change: '-12%',
      trend: 'up' as const,
      icon: Clock,
      description: 'Analysis speed',
      status: 'success' as const
    }
  ];

  return (
    <div className={cn("w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", className)}>
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </div>
  );
};
