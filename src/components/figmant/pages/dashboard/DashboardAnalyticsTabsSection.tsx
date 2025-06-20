
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BarChart3, Target, Zap } from 'lucide-react';

// Import advanced analytics components
import { ConfidenceScoreDistribution } from '../../analytics/advanced/ConfidenceScoreDistribution';
import { UserEngagementPatterns } from '../../analytics/advanced/UserEngagementPatterns';
import { ProcessingPerformanceMetrics } from '../../analytics/advanced/ProcessingPerformanceMetrics';
import { ROIProjectionsChart } from '../../analytics/advanced/ROIProjectionsChart';
import { ClaudeAnalysisVolumeChart } from '../../analytics/advanced/ClaudeAnalysisVolumeChart';
import { CompetitiveAdvantageRadar } from '../../analytics/advanced/CompetitiveAdvantageRadar';
import { RevenueImpactWaterfall } from '../../analytics/advanced/RevenueImpactWaterfall';
import { ImplementationTimelineGantt } from '../../analytics/advanced/ImplementationTimelineGantt';

// Import executive dashboard
import { ExecutiveDashboardWidget } from '../widgets/ExecutiveDashboardWidget';

interface DashboardAnalyticsTabsSectionProps {
  dataStats: any;
  analysisData: any[];
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const DashboardAnalyticsTabsSection: React.FC<DashboardAnalyticsTabsSectionProps> = ({
  dataStats,
  analysisData,
  realData,
  className = ""
}) => {
  const [activeTab, setActiveTab] = useState('executive');

  const handleExportData = (componentName: string) => {
    console.log(`Exporting data for ${componentName}...`);
    // Implementation for exporting specific component data
  };

  const tabConfig = [
    {
      id: 'executive',
      label: 'Executive Summary',
      icon: TrendingUp,
      description: 'Business intelligence and ROI projections',
      premium: true
    },
    {
      id: 'performance',
      label: 'AI Performance',
      icon: Zap,
      description: 'Claude analysis metrics and accuracy',
      premium: false
    },
    {
      id: 'business',
      label: 'Business Impact',
      icon: Target,
      description: 'Revenue projections and competitive analysis',
      premium: true
    },
    {
      id: 'analytics',
      label: 'Advanced Analytics',
      icon: BarChart3,
      description: 'Detailed usage patterns and insights',
      premium: true
    }
  ];

  return (
    <section className={className}>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Business Intelligence Dashboard
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Real-time AI performance with calculated business impact projections
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                Live Data
              </Badge>
              {realData && (
                <Badge className="bg-blue-100 text-blue-800">
                  {realData.designAnalysis?.length || 0} Analyses
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 relative"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.premium && (
                    <Badge className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1 py-0">
                      Pro
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Executive Summary Tab */}
            <TabsContent value="executive" className="space-y-6 mt-6">
              <ExecutiveDashboardWidget 
                realData={realData}
                className="w-full"
              />
            </TabsContent>

            {/* AI Performance Tab */}
            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConfidenceScoreDistribution 
                  realData={realData}
                  onExport={() => handleExportData('confidence-distribution')}
                />
                <ClaudeAnalysisVolumeChart 
                  realData={realData}
                  onExport={() => handleExportData('analysis-volume')}
                />
                <ProcessingPerformanceMetrics 
                  realData={realData}
                  onExport={() => handleExportData('performance-metrics')}
                />
                <UserEngagementPatterns 
                  realData={realData}
                  onExport={() => handleExportData('engagement-patterns')}
                />
              </div>
            </TabsContent>

            {/* Business Impact Tab */}
            <TabsContent value="business" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ROIProjectionsChart 
                  realData={realData}
                  onExport={() => handleExportData('roi-projections')}
                  className="lg:col-span-2"
                />
                <RevenueImpactWaterfall 
                  realData={realData}
                  onExport={() => handleExportData('revenue-waterfall')}
                  className="lg:col-span-2"
                />
                <CompetitiveAdvantageRadar 
                  realData={realData}
                  onExport={() => handleExportData('competitive-analysis')}
                />
                <ImplementationTimelineGantt 
                  realData={realData}
                  onExport={() => handleExportData('implementation-timeline')}
                />
              </div>
            </TabsContent>

            {/* Advanced Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <UserEngagementPatterns 
                    realData={realData}
                    onExport={() => handleExportData('engagement-detailed')}
                  />
                  <ProcessingPerformanceMetrics 
                    realData={realData}
                    onExport={() => handleExportData('performance-detailed')}
                  />
                </div>
                
                <RevenueImpactWaterfall 
                  realData={realData}
                  onExport={() => handleExportData('revenue-analysis')}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CompetitiveAdvantageRadar 
                    realData={realData}
                    onExport={() => handleExportData('competitive-detailed')}
                  />
                  <ImplementationTimelineGantt 
                    realData={realData}
                    onExport={() => handleExportData('timeline-detailed')}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};
