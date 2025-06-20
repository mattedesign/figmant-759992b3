
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';
import { calculateROI, CalculatedProjections } from './roiEngine';
import type { RevenueAnalysisData } from './types';

interface RevenueProjectionEngineProps {
  realData?: {
    analysisMetrics?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const RevenueProjectionEngine: React.FC<RevenueProjectionEngineProps> = ({
  realData,
  className = ""
}) => {
  // Create mock analysis data if no real data available
  const mockAnalysisData: RevenueAnalysisData = {
    id: 'mock-analysis',
    confidence_score: 0.87,
    suggestions: {
      navigation: "Improve navigation clarity",
      cta: "Optimize call-to-action placement", 
      mobile: "Enhance mobile responsiveness"
    }
  };

  // Calculate projections using real or mock data
  const projections: CalculatedProjections = calculateROI(
    mockAnalysisData,
    realData?.designAnalysis?.[0]?.confidence_score || mockAnalysisData.confidence_score
  );

  // Generate scenario data
  const scenarios = [
    {
      name: 'E-commerce Optimization',
      monthlyImpact: projections.monthly_revenue_impact,
      yearlyProjection: projections.annual_revenue_impact,
      paybackPeriod: projections.payback_period_months,
      confidence: projections.confidence_adjusted_impact
    },
    {
      name: 'SaaS Landing Page',
      monthlyImpact: projections.monthly_revenue_impact * 0.7,
      yearlyProjection: projections.annual_revenue_impact * 0.7,
      paybackPeriod: projections.payback_period_months * 1.2,
      confidence: projections.confidence_adjusted_impact * 0.9
    }
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Revenue Projection Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{scenario.name}</h4>
                <Badge className="bg-blue-100 text-blue-800">
                  {scenario.confidence.toFixed(1)}% confidence
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Monthly Impact</span>
                  <div className="font-semibold text-green-600">
                    ${scenario.monthlyImpact.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Annual Projection</span>
                  <div className="font-semibold text-blue-600">
                    ${scenario.yearlyProjection.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Payback Period</span>
                  <div className="font-semibold text-purple-600">
                    {scenario.paybackPeriod.toFixed(1)} months
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
