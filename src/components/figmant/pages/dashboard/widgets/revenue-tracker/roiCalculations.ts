
import { BusinessMetrics, ROICalculations, RevenueAnalysisData } from './types';

export const calculateROI = (
  analysisData: RevenueAnalysisData[],
  businessMetrics: BusinessMetrics
): ROICalculations => {
  if (!analysisData.length) {
    return {
      estimated_conversion_improvement: 0,
      monthly_revenue_impact: 0,
      implementation_cost: 0,
      roi_percentage: 0,
      payback_period: 0,
      current_monthly_revenue: 0,
      improved_monthly_revenue: 0
    };
  }

  // Get average confidence score and conversion potential
  const avgConfidence = analysisData.reduce((sum, analysis) => 
    sum + (analysis.confidence_score || 0), 0) / analysisData.length;
  
  const avgConversionPotential = analysisData.reduce((sum, analysis) => 
    sum + (analysis.impact_summary?.business_impact?.conversion_potential || 6), 0) / analysisData.length;

  // Calculate improvement potential (conservative estimate)
  const improvement_factor = (avgConfidence * avgConversionPotential) / 100;
  const estimated_conversion_improvement = Math.min(improvement_factor * 0.5, 2.0); // Cap at 2% improvement

  // Calculate revenue impact
  const current_monthly_revenue = businessMetrics.current_traffic * 
    (businessMetrics.current_conversion_rate / 100) * 
    businessMetrics.avg_order_value;
  
  const improved_conversion_rate = businessMetrics.current_conversion_rate + estimated_conversion_improvement;
  const improved_monthly_revenue = businessMetrics.current_traffic * 
    (improved_conversion_rate / 100) * 
    businessMetrics.avg_order_value;
  
  const monthly_revenue_impact = improved_monthly_revenue - current_monthly_revenue;

  // Estimate implementation cost (design + dev time)
  const total_suggestions = analysisData.reduce((sum, analysis) => 
    sum + (analysis.suggestions ? Object.keys(analysis.suggestions).length : 0), 0);
  const implementation_cost = total_suggestions * 500; // $500 per suggestion implementation

  const roi_percentage = implementation_cost > 0 ? 
    ((monthly_revenue_impact * 12 - implementation_cost) / implementation_cost) * 100 : 0;
  
  const payback_period = implementation_cost > 0 ? 
    implementation_cost / monthly_revenue_impact : 0;

  return {
    estimated_conversion_improvement,
    monthly_revenue_impact,
    implementation_cost,
    roi_percentage,
    payback_period,
    current_monthly_revenue,
    improved_monthly_revenue
  };
};
