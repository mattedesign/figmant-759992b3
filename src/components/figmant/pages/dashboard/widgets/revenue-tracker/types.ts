
export interface BusinessMetrics {
  current_traffic: number;
  avg_order_value: number;
  current_conversion_rate: number;
}

export interface SuccessMetric {
  metric: 'conversion_rate' | 'click_through' | 'engagement';
  before: number;
  after: number;
  percentage_change: number;
  analysis_id: string;
}

export interface ROICalculations {
  estimated_conversion_improvement: number;
  monthly_revenue_impact: number;
  implementation_cost: number;
  roi_percentage: number;
  payback_period: number;
  current_monthly_revenue: number;
  improved_monthly_revenue: number;
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
