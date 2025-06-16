
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';
import { TrendAnalysisChart } from '../../analytics/components/TrendAnalysisChart';
import { ActivityHeatMap } from '../../analytics/components/ActivityHeatMap';
import { PerformanceInsights } from '../../analytics/components/PerformanceInsights';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Lightbulb,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className={className}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <CardTitle>Dashboard Analytics</CardTitle>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isExpanded ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Expand Analytics</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Always show metrics grid */}
            <AnalyticsMetricsGrid dataStats={dataStats} />
            
            {/* Expandable analytics sections */}
            <CollapsibleContent>
              <div className="mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                      <BarChart3 className="h-4 w-4" />
                      Performance
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                      <TrendAnalysisChart 
                        data={analysisData}
                        title="Activity Trends Overview"
                      />
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                      <ActivityHeatMap />
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-6">
                      <PerformanceInsights dataStats={dataStats} />
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <TrendAnalysisChart 
                          data={analysisData}
                          title="Performance Metrics"
                        />
                        <PerformanceInsights dataStats={dataStats} />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  );
};
