
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BusinessMetricsSection,
  ROICalculatorResults,
  SuccessTrackingSection,
  EmptyStateSection,
  calculateROI,
  BusinessMetrics,
  SuccessMetric,
  RevenueAnalysisData
} from './revenue-tracker';

interface RevenueImpactTrackerProps {
  analysisData: RevenueAnalysisData[];
  className?: string;
}

export const RevenueImpactTracker: React.FC<RevenueImpactTrackerProps> = ({
  analysisData = [],
  className
}) => {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    current_traffic: 10000,
    avg_order_value: 150,
    current_conversion_rate: 2.5
  });

  const [isEditing, setIsEditing] = useState(false);
  
  // Mock success metrics - in production this would come from user tracking
  const [successMetrics] = useState<SuccessMetric[]>([
    {
      metric: 'conversion_rate',
      before: 2.1,
      after: 2.8,
      percentage_change: 33.3,
      analysis_id: 'recent-analysis'
    },
    {
      metric: 'click_through',
      before: 3.2,
      after: 4.1,
      percentage_change: 28.1,
      analysis_id: 'cta-analysis'
    }
  ]);

  // Calculate ROI based on analysis results
  const roiCalculations = useMemo(() => {
    return calculateROI(analysisData, businessMetrics);
  }, [analysisData, businessMetrics]);

  const handleMetricsUpdate = (field: keyof BusinessMetrics, value: string) => {
    const numValue = parseFloat(value) || 0;
    setBusinessMetrics(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Revenue Impact Tracker</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ROI Calculator
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Business Metrics Input */}
        <BusinessMetricsSection
          businessMetrics={businessMetrics}
          isEditing={isEditing}
          onToggleEditing={() => setIsEditing(!isEditing)}
          onMetricsUpdate={handleMetricsUpdate}
        />

        {/* ROI Calculator Results */}
        <ROICalculatorResults roiCalculations={roiCalculations} />

        {/* Success Tracking */}
        <SuccessTrackingSection successMetrics={successMetrics} />

        {/* Empty State */}
        {analysisData.length === 0 && <EmptyStateSection />}
      </CardContent>
    </Card>
  );
};
