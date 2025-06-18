
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Eye, 
  TrendingUp, 
  Zap, 
  Crown,
  ArrowRight,
  AlertCircle,
  Target,
  Trophy,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface CompetitorComparison {
  your_score: number;
  competitor_avg: number;
  improvement_areas: string[];
  competitive_advantage: string[];
}

interface CreditUsage {
  current_credits: number;
  credits_used_this_month: number;
  credits_remaining: number;
  usage_trend: 'increasing' | 'decreasing' | 'stable';
  upgrade_recommendation: boolean;
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
    );
  }, [analysisData]);

  // Calculate widget metrics
  const widgetMetrics = useMemo(() => {
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
  }, [competitorAnalyses, userCredits]);

  const getUsageTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <BarChart className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'text-green-600';
      case 'decreasing': return 'text-red-600';
      default: return 'text-blue-600';
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
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Target },
            { id: 'insights', label: 'Insights', icon: Trophy },
            { id: 'credits', label: 'Credits', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedTab(id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                selectedTab === id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {widgetMetrics.analyses_completed}
                </div>
                <div className="text-xs text-muted-foreground">Analyses Completed</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {widgetMetrics.competitor_insights_generated}
                </div>
                <div className="text-xs text-muted-foreground">Insights Generated</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {widgetMetrics.actionable_recommendations}
                </div>
                <div className="text-xs text-muted-foreground">Recommendations</div>
              </div>
            </div>

            {widgetMetrics.analyses_completed === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h3 className="font-semibold text-sm mb-2">No Competitor Analyses Yet</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Analyze competitor websites to gain strategic insights
                </p>
                <Button size="sm">
                  Start Competitor Analysis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Insights Tab */}
        {selectedTab === 'insights' && (
          <div className="space-y-4">
            {widgetMetrics.recent_comparisons.length > 0 ? (
              <div className="space-y-3">
                {widgetMetrics.recent_comparisons.map((comparison, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Comparison #{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Your Score:</span>
                        <Badge variant={comparison.your_score > comparison.competitor_avg ? "default" : "secondary"}>
                          {comparison.your_score}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs {comparison.competitor_avg}%</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="font-medium text-orange-600 mb-1">Improvement Areas:</div>
                        <ul className="space-y-1">
                          {comparison.improvement_areas.map((area, i) => (
                            <li key={i} className="text-muted-foreground">• {area}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-medium text-green-600 mb-1">Your Advantages:</div>
                        <ul className="space-y-1">
                          {comparison.competitive_advantage.map((advantage, i) => (
                            <li key={i} className="text-muted-foreground">• {advantage}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No competitor insights yet. Complete your first analysis to see comparisons.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Credits Tab */}
        {selectedTab === 'credits' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {widgetMetrics.credit_usage.current_credits}
                </div>
                <div className="text-xs text-muted-foreground">Credits Remaining</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {widgetMetrics.credit_usage.credits_used_this_month}
                </div>
                <div className="text-xs text-muted-foreground">Used This Month</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Usage Trend</span>
                <div className="flex items-center gap-2">
                  {getUsageTrendIcon(widgetMetrics.credit_usage.usage_trend)}
                  <span className={cn("text-sm font-medium", getTrendColor(widgetMetrics.credit_usage.usage_trend))}>
                    {widgetMetrics.credit_usage.usage_trend}
                  </span>
                </div>
              </div>

              <Progress 
                value={(widgetMetrics.credit_usage.credits_used_this_month / 25) * 100} 
                className="h-2"
              />
              
              <div className="text-xs text-muted-foreground text-center">
                {widgetMetrics.credit_usage.credits_used_this_month} of 25 monthly credits used
              </div>
            </div>

            {widgetMetrics.credit_usage.upgrade_recommendation && (
              <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Upgrade Recommended</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">
                  {widgetMetrics.credit_usage.current_credits < 3 
                    ? "You're running low on credits. Upgrade for unlimited competitor analyses."
                    : "Heavy usage detected. Upgrade for unlimited analyses and priority support."
                  }
                </p>
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        {widgetMetrics.analyses_completed > 0 && (
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              Analyze {5 - Math.min(widgetMetrics.analyses_completed, 5)} more competitors for deeper insights
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Eye className="h-4 w-4 mr-2" />
              Analyze Competitor
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
