
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
          <CardTitle className="text-xl font-semibold">Key Metrics</CardTitle>
        </CardHeader>
        
        <CardContent className="w-full">
          <AnalyticsMetricsGrid dataStats={dataStats} />
        </CardContent>
      </Card>
    </div>
  );
};
