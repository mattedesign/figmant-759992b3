
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';
import { AnalyticsTabsList } from './DashboardAnalyticsSection/AnalyticsTabsList';
import { AnalyticsTabsContent } from './DashboardAnalyticsSection/AnalyticsTabsContent';

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
          <div className="w-full">
            <AnalyticsMetricsGrid dataStats={dataStats} className="w-full" />
          </div>
          
          <div className="mt-8 w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <AnalyticsTabsList />
              <AnalyticsTabsContent 
                analysisData={analysisData}
                dataStats={dataStats}
              />
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
