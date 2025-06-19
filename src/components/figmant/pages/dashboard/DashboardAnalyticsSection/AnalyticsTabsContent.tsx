
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { TrendAnalysisChart } from '../../../analytics/components/TrendAnalysisChart';
import { ActivityHeatMap } from '../../../analytics/components/ActivityHeatMap';
import { PerformanceInsights } from '../../../analytics/components/PerformanceInsights';

interface AnalyticsTabsContentProps {
  analysisData: any[];
  dataStats: any;
}

export const AnalyticsTabsContent: React.FC<AnalyticsTabsContentProps> = ({
  analysisData,
  dataStats
}) => {
  return (
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
  );
};
