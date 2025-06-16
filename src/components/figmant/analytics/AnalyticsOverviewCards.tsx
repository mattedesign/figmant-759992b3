
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Zap,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'efficiency' | 'quality' | 'usage' | 'engagement';
}

interface AnalyticsOverviewCardsProps {
  metrics: PerformanceMetric[];
  isLoading: boolean;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  metrics,
  isLoading
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'efficiency':
        return Clock;
      case 'quality':
        return Target;
      case 'usage':
        return BarChart3;
      case 'engagement':
        return Users;
      default:
        return Zap;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency':
        return 'text-blue-600 bg-blue-100';
      case 'quality':
        return 'text-green-600 bg-green-100';
      case 'usage':
        return 'text-purple-600 bg-purple-100';
      case 'engagement':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = getCategoryIcon(metric.category);
        const categoryColor = getCategoryColor(metric.category);
        const trendColor = getTrendColor(metric.trend);
        const percentageChange = formatPercentageChange(metric.value, metric.previousValue);

        return (
          <Card key={metric.id} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", categoryColor)}>
                  <Icon className="h-5 w-5" />
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value.toFixed(metric.unit === '%' ? 1 : metric.unit === 's' ? 1 : 0)}
                    {metric.unit}
                  </span>
                </div>
                <Badge variant="secondary" className={cn("text-xs", trendColor)}>
                  {percentageChange} vs last period
                </Badge>
              </div>
              
              {/* Mini trend indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1">
                <div 
                  className={cn(
                    "h-full transition-all duration-300",
                    metric.trend === 'up' ? 'bg-green-500' : 
                    metric.trend === 'down' ? 'bg-red-500' : 'bg-gray-300'
                  )}
                  style={{ 
                    width: `${Math.min(Math.abs(parseFloat(percentageChange)), 100)}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
