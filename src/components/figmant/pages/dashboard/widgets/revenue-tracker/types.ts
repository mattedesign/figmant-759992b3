
// Base interfaces for revenue tracking and ROI calculations
export interface BusinessMetrics {
  monthly_revenue: number;
  conversion_rate: number;
  average_order_value: number;
  traffic_volume: number;
  current_traffic: number;
  avg_order_value: number;
  current_conversion_rate: number;
}

export interface RevenueAnalysisData {
  id: string;
  confidence_score: number;
  suggestions: Record<string, string>;
  impact_summary?: {
    business_impact?: {
      conversion_potential?: number;
    };
  };
}

export interface ROICalculations {
  estimated_conversion_improvement: number;
  monthly_revenue_impact: number;
  annual_revenue_impact: number;
  implementation_cost: number;
  roi_percentage: number;
  payback_period: number;
  confidence_score: number;
  current_monthly_revenue: number;
  improved_monthly_revenue: number;
}

export interface SuccessMetric {
  metric: string;
  before: number;
  after: number;
  percentage_change: number;
  analysis_id: string;
}

export const calculateROI = (
  metrics: BusinessMetrics,
  improvements: Record<string, number>
): number => {
  // Basic ROI calculation placeholder
  const baseRevenue = metrics.monthly_revenue;
  const improvementFactor = Object.values(improvements).reduce((sum, val) => sum + val, 0) / Object.keys(improvements).length;
  return (baseRevenue * improvementFactor) / baseRevenue * 100;
};
