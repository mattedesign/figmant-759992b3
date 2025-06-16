
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';
import { TrendAnalysisChart } from '../../analytics/components/TrendAnalysisChart';
import { ActivityHeatMap } from '../../analytics/components/ActivityHeatMap';
import { PerformanceInsights } from '../../analytics/components/PerformanceInsights';
import { TrendingUp, Calendar, Lightbulb } from 'lucide-react';

interface DashboardAnalyticsSectionProps {
  dataStats: any;
  analysisData: any[];
  className?: string;
}

export const DashboardAnalyticsSection: React.FC<DashboardAnalyticsSectionProps> = ({
  dataStats,
  analysisData,
  className
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Dashboard Analytics</CardTitle>
        </CardHeader>
        
        <CardContent className="w-full">
          {/* Always show metrics grid - now full width */}
          <div className="w-full">
            <AnalyticsMetricsGrid dataStats={dataStats} className="w-full" />
          </div>
          
          {/* Analytics sections - now always visible */}
          <div className="mt-8 w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 w-full">
                <TabsContent value="overview" className="space-y-6 w-full">
                  <TrendAnalysisChart data={analysisData} title="Activity Trends Overview" />
                </TabsContent>

                <TabsContent value="activity" className="space-y-6 w-full">
                  <ActivityHeatMap />
                </TabsContent>

                <TabsContent value="insights" className="space-y-6 w-full">
                  <PerformanceInsights dataStats={dataStats} />
                </TabsContent>

                <TabsContent value="performance" className="space-y-6 w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    <TrendAnalysisChart data={analysisData} title="Performance Metrics" />
                    <PerformanceInsights dataStats={dataStats} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
