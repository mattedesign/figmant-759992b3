
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Filter, Download, Eye } from 'lucide-react';
import { ClaudeAnalysisVolumeChart } from './ClaudeAnalysisVolumeChart';
import { ConfidenceScoreDistribution } from './ConfidenceScoreDistribution';
import { ProcessingPerformanceMetrics } from './ProcessingPerformanceMetrics';
import { UserEngagementPatterns } from './UserEngagementPatterns';
import { RevenueImpactWaterfall } from './RevenueImpactWaterfall';
import { ROIProjectionsChart } from './ROIProjectionsChart';
import { ImplementationTimelineGantt } from './ImplementationTimelineGantt';
import { CompetitiveAdvantageRadar } from './CompetitiveAdvantageRadar';

interface AdvancedDataVisualizationProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({
  realData,
  className
}) => {
  const [activeTab, setActiveTab] = useState('real-data');
  const [showFilters, setShowFilters] = useState(false);

  const handleExportData = (chartType: string) => {
    const exportData = {
      chartType,
      timestamp: new Date().toISOString(),
      realData: realData,
      metadata: {
        totalAnalyses: realData?.designAnalysis?.length || 0,
        dateRange: '30d',
        exportFormat: 'comprehensive'
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${chartType}-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            Advanced Data Visualization
          </CardTitle>
          <div className="flex gap-2">
            <Badge className="bg-purple-100 text-purple-800">
              Real-Time Analytics
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleExportData('comprehensive')}
            >
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="real-data" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Real Data Charts
            </TabsTrigger>
            <TabsTrigger value="projected-impact" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Projected Impact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="real-data" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ClaudeAnalysisVolumeChart 
                realData={realData}
                onExport={() => handleExportData('claude-analysis-volume')}
              />
              <ConfidenceScoreDistribution 
                realData={realData}
                onExport={() => handleExportData('confidence-distribution')}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProcessingPerformanceMetrics 
                realData={realData}
                onExport={() => handleExportData('processing-performance')}
              />
              <UserEngagementPatterns 
                realData={realData}
                onExport={() => handleExportData('user-engagement')}
              />
            </div>
          </TabsContent>

          <TabsContent value="projected-impact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueImpactWaterfall 
                realData={realData}
                onExport={() => handleExportData('revenue-waterfall')}
              />
              <ROIProjectionsChart 
                realData={realData}
                onExport={() => handleExportData('roi-projections')}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ImplementationTimelineGantt 
                realData={realData}
                onExport={() => handleExportData('implementation-timeline')}
              />
              <CompetitiveAdvantageRadar 
                realData={realData}
                onExport={() => handleExportData('competitive-advantage')}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
