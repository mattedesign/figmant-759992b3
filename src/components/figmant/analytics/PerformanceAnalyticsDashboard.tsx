import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  Target,
  Zap,
  Users,
  Calendar,
  Download,
  Filter,
  Settings,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalyticsOverviewCards } from './AnalyticsOverviewCards';
import { PerformanceChart } from './PerformanceChart';
import { InsightsPanel } from './InsightsPanel';
import { UsageMetrics } from './UsageMetrics';
import { MetricsHeatmap } from './MetricsHeatmap';
import { InteractiveMetricsChart } from './InteractiveMetricsChart';
import { RealTimeMetrics } from './RealTimeMetrics';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'efficiency' | 'quality' | 'usage' | 'engagement';
}

interface AnalyticsData {
  metrics: PerformanceMetric[];
  chartData: Array<{
    date: string;
    analyses: number;
    successRate: number;
    avgConfidence: number;
    processingTime: number;
  }>;
  insights: Array<{
    id: string;
    type: 'improvement' | 'trend' | 'alert';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    timestamp: Date;
  }>;
}

interface PerformanceAnalyticsDashboardProps {
  className?: string;
}

export const PerformanceAnalyticsDashboard: React.FC<PerformanceAnalyticsDashboardProps> = ({
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    metrics: [
      {
        id: '1',
        name: 'Analysis Success Rate',
        value: 94.2,
        previousValue: 91.5,
        unit: '%',
        trend: 'up',
        category: 'quality'
      },
      {
        id: '2',
        name: 'Avg Processing Time',
        value: 2.8,
        previousValue: 3.2,
        unit: 's',
        trend: 'up',
        category: 'efficiency'
      },
      {
        id: '3',
        name: 'Daily Active Analyses',
        value: 47,
        previousValue: 42,
        unit: '',
        trend: 'up',
        category: 'usage'
      },
      {
        id: '4',
        name: 'Avg Confidence Score',
        value: 87.3,
        previousValue: 85.1,
        unit: '%',
        trend: 'up',
        category: 'quality'
      }
    ],
    chartData: [
      { date: '2024-01-01', analyses: 23, successRate: 92, avgConfidence: 85, processingTime: 3.1 },
      { date: '2024-01-02', analyses: 31, successRate: 94, avgConfidence: 87, processingTime: 2.9 },
      { date: '2024-01-03', analyses: 28, successRate: 93, avgConfidence: 86, processingTime: 3.0 },
      { date: '2024-01-04', analyses: 35, successRate: 95, avgConfidence: 88, processingTime: 2.8 },
      { date: '2024-01-05', analyses: 42, successRate: 96, avgConfidence: 89, processingTime: 2.7 },
      { date: '2024-01-06', analyses: 38, successRate: 94, avgConfidence: 87, processingTime: 2.8 },
      { date: '2024-01-07', analyses: 47, successRate: 95, avgConfidence: 87, processingTime: 2.8 }
    ],
    insights: [
      {
        id: '1',
        type: 'improvement',
        title: 'Processing Speed Optimization',
        description: 'Recent optimizations have reduced average processing time by 12.5%',
        impact: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'trend',
        title: 'Increasing Analysis Volume',
        description: 'Daily analysis count has increased by 20% this week',
        impact: 'medium',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'alert',
        title: 'Confidence Score Plateau',
        description: 'Average confidence scores have plateaued - consider prompt optimization',
        impact: 'medium',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      }
    ]
  });

  const [isLoading, setIsLoading] = useState(false);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        metrics: prev.metrics.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 2
        }))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleApplyFilters = (filters: any) => {
    console.log('Applying filters:', filters);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Generate heatmap data
  const heatmapData = analyticsData.chartData.map(point => ({
    date: point.date,
    value: point.analyses,
    analyses: point.analyses
  }));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600">Track and optimize your design analysis performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={dateRange === '24h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('24h')}
            >
              24h
            </Button>
            <Button
              variant={dateRange === '7d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('7d')}
            >
              7d
            </Button>
            <Button
              variant={dateRange === '30d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleDateRangeChange('30d')}
            >
              30d
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Status */}
      <RealTimeMetrics />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AnalyticsOverviewCards 
            metrics={analyticsData.metrics}
            isLoading={isLoading}
          />
          
          <PerformanceChart 
            data={analyticsData.chartData}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.metrics.filter(m => m.category === 'efficiency' || m.category === 'quality').map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {metric.value.toFixed(1)}{metric.unit}
                    </span>
                    <span className={cn("text-sm font-medium", getTrendColor(metric.trend))}>
                      {formatPercentageChange(metric.value, metric.previousValue)}
                    </span>
                  </div>
                  <Progress 
                    value={metric.category === 'efficiency' ? 100 - metric.value : metric.value} 
                    className="mt-3 h-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Chart */}
          <InteractiveMetricsChart 
            data={analyticsData.chartData}
            isLoading={isLoading}
          />

          {/* Detailed Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Time Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart 
                  data={analyticsData.chartData}
                  metric="processingTime"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Confidence Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart 
                  data={analyticsData.chartData}
                  metric="avgConfidence"
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageMetrics 
            data={analyticsData.chartData}
            metrics={analyticsData.metrics.filter(m => m.category === 'usage')}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Activity Heatmap */}
          <MetricsHeatmap 
            data={heatmapData}
            metric="analyses"
            isLoading={isLoading}
          />

          {/* Trend Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricsHeatmap 
              data={heatmapData.map(d => ({ ...d, value: d.value * 0.94 }))}
              metric="successRate"
              isLoading={isLoading}
              title="Success Rate Heatmap"
            />
            
            <MetricsHeatmap 
              data={heatmapData.map(d => ({ ...d, value: d.value * 0.87 }))}
              metric="avgConfidence"
              isLoading={isLoading}
              title="Confidence Score Heatmap"
            />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <InsightsPanel 
            insights={analyticsData.insights}
            metrics={analyticsData.metrics}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
