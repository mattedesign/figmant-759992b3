
import { CompetitorAnalysisData, WidgetMetrics, CompetitorComparison, CreditUsage } from './types';

export const calculateWidgetMetrics = (
  competitorAnalyses: CompetitorAnalysisData[],
  userCredits?: { current_balance: number; total_used: number; }
): WidgetMetrics => {
  const analyses_completed = competitorAnalyses.length;
  const competitor_insights_generated = competitorAnalyses.reduce((sum, analysis) => 
    sum + (analysis.design_analysis?.[0]?.suggestions ? 
      Object.keys(analysis.design_analysis[0].suggestions).length : 0), 0);
  
  const actionable_recommendations = competitorAnalyses.reduce((sum, analysis) => 
    sum + (analysis.design_analysis?.[0]?.improvement_areas?.length || 0), 0);

  // Credit usage calculation
  const current_credits = userCredits?.current_balance || 0;
  const total_used = userCredits?.total_used || 0;
  const credits_used_this_month = Math.min(total_used, 20); // Mock monthly usage
  const usage_trend = credits_used_this_month > 10 ? 'increasing' : 
                     credits_used_this_month < 5 ? 'decreasing' : 'stable';
  
  const credit_usage: CreditUsage = {
    current_credits,
    credits_used_this_month,
    credits_remaining: current_credits,
    usage_trend,
    upgrade_recommendation: current_credits < 3 || credits_used_this_month > 15
  };

  // Recent comparisons (mock competitive data)
  const recent_comparisons: CompetitorComparison[] = competitorAnalyses.slice(0, 3).map((analysis, index) => {
    const your_score = analysis.design_analysis?.[0]?.confidence_score || 
                      analysis.confidence_score || 
                      Math.floor(Math.random() * 30) + 60;
    
    const competitor_avg = your_score - Math.floor(Math.random() * 20) + 10;
    
    return {
      your_score,
      competitor_avg,
      improvement_areas: analysis.design_analysis?.[0]?.improvement_areas?.slice(0, 2) || 
                        ['CTA optimization', 'Visual hierarchy'],
      competitive_advantage: ['Modern design', 'Better accessibility']
    };
  });

  return {
    analyses_completed,
    competitor_insights_generated,
    actionable_recommendations,
    credit_usage,
    recent_comparisons
  };
};

export const getUsageTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing': return 'TrendingUp';
    case 'decreasing': return 'TrendingDown';
    default: return 'BarChart';
  }
};

export const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'increasing': return 'text-green-600';
    case 'decreasing': return 'text-red-600';
    default: return 'text-blue-600';
  }
};
