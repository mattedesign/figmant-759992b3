
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';

interface DashboardMetricsSectionProps {
  dataStats: any;
  className?: string;
}

export const DashboardMetricsSection: React.FC<DashboardMetricsSectionProps> = ({
  dataStats,
  className
}) => {
  return (
    <div className={className}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Key Metrics</CardTitle>
        </CardHeader>
        
        <CardContent className="w-full">
          <div className="w-full">
            <AnalyticsMetricsGrid dataStats={dataStats} className="w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
