
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AnalyticsMetricsGrid } from '../../analytics/components/AnalyticsMetricsGrid';
import { TrendAnalysisChart } from '../../analytics/components/TrendAnalysisChart';
import { ActivityHeatMap } from '../../analytics/components/ActivityHeatMap';
import { PerformanceInsights } from '../../analytics/components/PerformanceInsights';
import { BarChart3, TrendingUp, Calendar, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

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
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Analytics Overview</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Performance insights and trends</p>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-50">
                  {isExpanded ? (
                    <>
                      <span>Collapse</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>View Details</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Enhanced metrics grid - always visible */}
            <div className="bg-gray-50 rounded-xl p-6">
              <AnalyticsMetricsGrid dataStats={dataStats} />
            </div>
            
            {/* Expandable analytics sections */}
            <CollapsibleContent>
              <div className="mt-8">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                    <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <TrendingUp className="h-4 w-4" />
                      <span className="hidden sm:inline">Trends</span>
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">Insights</span>
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2 data-[state=active]:bg-white">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Performance</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="overview" className="space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <TrendAnalysisChart data={analysisData} title="Activity Trends Overview" />
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <ActivityHeatMap />
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-6">
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <PerformanceInsights dataStats={dataStats} />
                      </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <TrendAnalysisChart data={analysisData} title="Performance Metrics" />
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                          <PerformanceInsights dataStats={dataStats} />
                        </div>
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
