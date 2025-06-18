
export interface CompetitorAnalysisData {
  id: string;
  source_type: 'file' | 'url';
  confidence_score: number;
  source_url?: string;
  design_analysis?: Array<{
    confidence_score: number;
    suggestions?: any;
    improvement_areas?: string[];
  }>;
}

export interface CompetitorComparison {
  your_score: number;
  competitor_avg: number;
  improvement_areas: string[];
  competitive_advantage: string[];
}

export interface CreditUsage {
  current_credits: number;
  credits_used_this_month: number;
  credits_remaining: number;
  usage_trend: 'increasing' | 'decreasing' | 'stable';
  upgrade_recommendation: boolean;
}

export interface WidgetMetrics {
  analyses_completed: number;
  competitor_insights_generated: number;
  actionable_recommendations: number;
  credit_usage: CreditUsage;
  recent_comparisons: CompetitorComparison[];
}
