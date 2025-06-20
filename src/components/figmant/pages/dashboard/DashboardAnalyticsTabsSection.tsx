
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Activity, FileText, Briefcase, BarChart3 } from 'lucide-react';
import { 
  RevenueImpactTracker,
  AIAnalysisPerformanceDashboard,
  BusinessImpactCalculator,
  CompetitiveIntelligenceTracker,
  RevenueProjectionEngine,
  ExecutiveSummaryGenerator,
  BusinessCaseBuilder
} from './widgets';
import { AdvancedDataVisualization } from '../../analytics/advanced/AdvancedDataVisualization';

interface DashboardAnalyticsTabsSectionProps {
  dataStats: any;
  analysisData: any[];
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
}

export const DashboardAnalyticsTabsSection: React.FC<DashboardAnalyticsTabsSectionProps> = ({
  dataStats,
  analysisData,
  realData
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Business Intelligence Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="advanced-viz" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="advanced-viz" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Advanced Charts
            </TabsTrigger>
            <TabsTrigger value="revenue-impact" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Impact
            </TabsTrigger>
            <TabsTrigger value="ai-performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              AI Performance
            </TabsTrigger>
            <TabsTrigger value="business-impact" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Business Impact
            </TabsTrigger>
            <TabsTrigger value="competitive" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Competitive Intel
            </TabsTrigger>
            <TabsTrigger value="executive-summary" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Executive Reports
            </TabsTrigger>
            <TabsTrigger value="business-case" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Business Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advanced-viz" className="mt-6">
            <AdvancedDataVisualization realData={realData} />
          </TabsContent>

          <TabsContent value="revenue-impact" className="mt-6">
            <div className="space-y-6">
              <RevenueImpactTracker 
                analysisData={analysisData} 
                realData={realData}
              />
              <RevenueProjectionEngine realData={realData} />
            </div>
          </TabsContent>

          <TabsContent value="ai-performance" className="mt-6">
            <AIAnalysisPerformanceDashboard realData={realData} />
          </TabsContent>

          <TabsContent value="business-impact" className="mt-6">
            <BusinessImpactCalculator 
              analysisData={analysisData}
              realData={realData}
            />
          </TabsContent>

          <TabsContent value="competitive" className="mt-6">
            <CompetitiveIntelligenceTracker realData={realData} />
          </TabsContent>

          <TabsContent value="executive-summary" className="mt-6">
            <ExecutiveSummaryGenerator realData={realData} />
          </TabsContent>

          <TabsContent value="business-case" className="mt-6">
            <BusinessCaseBuilder realData={realData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
