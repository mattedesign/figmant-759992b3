
// Base interfaces for revenue tracking and ROI calculations
export interface BusinessMetrics {
  monthly_revenue: number;
  conversion_rate: number;
  average_order_value: number;
  traffic_volume: number;
}

export interface RevenueAnalysisData {
  id: string;
  confidence_score: number;
  suggestions: Record<string, string>;
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
