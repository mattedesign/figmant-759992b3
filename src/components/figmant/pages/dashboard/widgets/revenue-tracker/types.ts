
export interface BusinessMetrics {
  current_traffic: number;
  avg_order_value: number;
  current_conversion_rate: number;
}

export interface ROICalculations {
  estimated_conversion_improvement: number;
  monthly_revenue_impact: number;
  annual_revenue_impact: number;
  implementation_cost: number;
  roi_percentage: number;
  payback_period: number;
  confidence_score: number;
}

export interface SuccessMetric {
  metric: string;
  before: number;
  after: number;
  percentage_change: number;
  analysis_id: string;
}

export interface RevenueAnalysisData {
  id: string;
  confidence_score: number;
  impact_summary?: {
    business_impact?: {
      conversion_potential: number;
    };
  };
  suggestions?: any;
}

export const calculateROI = (analysisData: RevenueAnalysisData[], businessMetrics: BusinessMetrics): ROICalculations => {
  // Calculate average confidence score from analysis data
  const avgConfidence = analysisData.length > 0 
    ? analysisData.reduce((sum, analysis) => sum + analysis.confidence_score, 0) / analysisData.length 
    : 0;

  // Calculate estimated conversion improvement based on confidence and suggestions
  const avgSuggestionCount = analysisData.length > 0
    ? analysisData.reduce((sum, analysis) => {
        return sum + (analysis.suggestions ? Object.keys(analysis.suggestions).length : 0);
      }, 0) / analysisData.length
    : 0;

  // Business logic: Higher confidence + more suggestions = higher conversion potential
  const baseImprovement = (avgConfidence * 0.4) + (avgSuggestionCount * 0.03);
  const estimated_conversion_improvement = Math.min(baseImprovement, 0.5); // Cap at 50%

  // Calculate revenue impact
  const currentMonthlyRevenue = businessMetrics.current_traffic * 
                               (businessMetrics.current_conversion_rate / 100) * 
                               businessMetrics.avg_order_value;
  
  const improvedConversionRate = businessMetrics.current_conversion_rate * (1 + estimated_conversion_improvement);
  const improvedMonthlyRevenue = businessMetrics.current_traffic * 
                                (improvedConversionRate / 100) * 
                                businessMetrics.avg_order_value;
  
  const monthly_revenue_impact = improvedMonthlyRevenue - currentMonthlyRevenue;
  const annual_revenue_impact = monthly_revenue_impact * 12;

  // Estimate implementation cost (percentage of first year impact)
  const implementation_cost = annual_revenue_impact * 0.15; // 15% of annual impact

  // Calculate ROI
  const roi_percentage = implementation_cost > 0 
    ? ((annual_revenue_impact - implementation_cost) / implementation_cost) * 100 
    : 0;

  // Calculate payback period in months
  const payback_period = implementation_cost > 0 && monthly_revenue_impact > 0
    ? implementation_cost / monthly_revenue_impact
    : 0;

  return {
    estimated_conversion_improvement: estimated_conversion_improvement * 100,
    monthly_revenue_impact,
    annual_revenue_impact,
    implementation_cost,
    roi_percentage,
    payback_period,
    confidence_score: avgConfidence
  };
};
