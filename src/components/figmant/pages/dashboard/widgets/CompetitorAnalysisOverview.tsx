
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  OverviewTab, 
  InsightsTab, 
  CreditsTab, 
  TabNavigation, 
  CTASection,
  calculateWidgetMetrics,
  type CompetitorAnalysisData
} from './competitor-analysis';

interface CompetitorAnalysisOverviewProps {
  analysisData: Array<{
    id: string;
    source_type: 'file' | 'url';
    confidence_score: number;
    source_url?: string;
    design_analysis?: Array<{
      confidence_score: number;
      suggestions?: any;
      improvement_areas?: string[];
    }>;
  }>;
  userCredits?: {
    current_balance: number;
    total_used: number;
  };
  className?: string;
}

export const CompetitorAnalysisOverview: React.FC<CompetitorAnalysisOverviewProps> = ({
  analysisData = [],
  userCredits,
  className
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'insights' | 'credits'>('overview');

  // Filter competitor analyses (URL-based)
  const competitorAnalyses = useMemo(() => {
    return analysisData.filter(upload => 
      upload.source_type === 'url' && 
      upload.source_url &&
      upload.design_analysis?.[0]
    ) as CompetitorAnalysisData[];
  }, [analysisData]);

  // Calculate widget metrics
  const widgetMetrics = useMemo(() => {
    return calculateWidgetMetrics(competitorAnalyses, userCredits);
  }, [competitorAnalyses, userCredits]);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return <OverviewTab widgetMetrics={widgetMetrics} />;
      case 'insights':
        return <InsightsTab widgetMetrics={widgetMetrics} />;
      case 'credits':
        return <CreditsTab widgetMetrics={widgetMetrics} />;
      default:
        return <OverviewTab widgetMetrics={widgetMetrics} />;
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Competitor Analysis Overview</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            UC-024 Core Feature
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <TabNavigation selectedTab={selectedTab} onTabChange={setSelectedTab} />
        
        {renderTabContent()}

        <CTASection widgetMetrics={widgetMetrics} />
      </CardContent>
    </Card>
  );
};
