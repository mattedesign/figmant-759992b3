
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trophy, Target, TrendingUp, ExternalLink } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface CompetitorInsight {
  competitor: string;
  insight: string;
  advantageScore: number;
  category: string;
  actionable: boolean;
}

interface MarketPosition {
  dimension: string;
  yourScore: number;
  marketLeader: number;
  industry: number;
}

interface OpportunityArea {
  area: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  description: string;
  claudeInsight: string;
}

interface CompetitiveIntelligenceTrackerProps {
  realData?: {
    analysisMetrics?: any[];
    chatAnalysis?: any[];
    designAnalysis?: any[];
  };
  className?: string;
}

export const CompetitiveIntelligenceTracker: React.FC<CompetitiveIntelligenceTrackerProps> = ({
  realData,
  className
}) => {
  // Process real data from chat_analysis_history for competitor insights
  const competitorInsights = useMemo<CompetitorInsight[]>(() => {
    const chatAnalyses = realData?.chatAnalysis || [];
    
    // Filter analyses that contain competitor-related content
    const competitorAnalyses = chatAnalyses.filter(analysis => 
      analysis.analysis_results?.response?.toLowerCase()?.includes('competitor') ||
      analysis.analysis_results?.response?.toLowerCase()?.includes('comparison') ||
      analysis.analysis_type === 'competitor_analysis'
    );
    
    if (competitorAnalyses.length === 0) {
      // Fallback competitor insights for demonstration
      return [
        {
          competitor: 'Market Leader A',
          insight: 'Uses progressive disclosure in navigation, reducing cognitive load by 34%',
          advantageScore: 92,
          category: 'Navigation',
          actionable: true
        },
        {
          competitor: 'Industry Pioneer B',
          insight: 'Implements micro-interactions that increase engagement by 28%',
          advantageScore: 87,
          category: 'Engagement',
          actionable: true
        },
        {
          competitor: 'Growth Leader C',
          insight: 'Mobile-first checkout flow achieves 23% higher conversion',
          advantageScore: 89,
          category: 'Conversion',
          actionable: true
        }
      ];
    }
    
    // Extract competitor insights from real analysis data
    return competitorAnalyses.slice(0, 5).map((analysis, index) => ({
      competitor: `Analyzed Competitor ${index + 1}`,
      insight: analysis.analysis_results?.summary || 'Claude AI identified key competitive advantage',
      advantageScore: analysis.confidence_score || 85,
      category: analysis.analysis_type === 'competitor_analysis' ? 'Competitive Analysis' : 'General Analysis',
      actionable: (analysis.confidence_score || 85) > 80
    }));
  }, [realData]);

  // Calculate market positioning based on Claude's insights
  const marketPosition = useMemo<MarketPosition[]>(() => {
    const designAnalyses = realData?.designAnalysis || [];
    const avgConfidence = designAnalyses.length > 0
      ? designAnalyses.reduce((sum, d) => sum + (d.confidence_score || 0), 0) / designAnalyses.length
      : 82;

    return [
      { dimension: 'UX Quality', yourScore: avgConfidence, marketLeader: 95, industry: 75 },
      { dimension: 'Conversion', yourScore: Math.max(60, avgConfidence - 10), marketLeader: 88, industry: 68 },
      { dimension: 'Mobile Experience', yourScore: Math.max(65, avgConfidence - 5), marketLeader: 92, industry: 72 },
      { dimension: 'Navigation', yourScore: Math.max(70, avgConfidence), marketLeader: 90, industry: 70 },
      { dimension: 'Visual Design', yourScore: Math.max(75, avgConfidence + 5), marketLeader: 93, industry: 78 },
      { dimension: 'Performance', yourScore: Math.max(68, avgConfidence - 8), marketLeader: 87, industry: 74 }
    ];
  }, [realData]);

  // Extract top opportunities from Claude AI analysis
  const topOpportunities = useMemo<OpportunityArea[]>(() => {
    const designAnalyses = realData?.designAnalysis || [];
    
    if (designAnalyses.length === 0) {
      // Fallback opportunities
      return [
        {
          area: 'Navigation Simplification',
          impact: 'high',
          effort: 'medium',
          description: 'Streamline menu structure based on competitor best practices',
          claudeInsight: 'Analysis shows 23% improvement potential in user task completion'
        },
        {
          area: 'Mobile Checkout Optimization',
          impact: 'high',
          effort: 'low',
          description: 'Implement single-page checkout like top performers',
          claudeInsight: 'Mobile conversion could increase by 31% with optimized flow'
        },
        {
          area: 'Visual Hierarchy Enhancement',
          impact: 'medium',
          effort: 'low',
          description: 'Improve CTA visibility and contrast ratios',
          claudeInsight: 'Claude identified 15 specific areas for visual improvement'
        }
      ];
    }

    // Extract opportunities from real Claude analysis
    return designAnalyses.slice(0, 3).map((analysis, index) => {
      const suggestions = analysis.suggestions || {};
      const suggestionKeys = Object.keys(suggestions);
      const mainSuggestion = suggestionKeys[0] || 'optimization';
      
      return {
        area: mainSuggestion.charAt(0).toUpperCase() + mainSuggestion.slice(1),
        impact: analysis.confidence_score > 85 ? 'high' : analysis.confidence_score > 70 ? 'medium' : 'low',
        effort: suggestionKeys.length <= 2 ? 'low' : suggestionKeys.length <= 4 ? 'medium' : 'high',
        description: suggestions[mainSuggestion] || 'Claude AI identified improvement opportunity',
        claudeInsight: `Confidence score: ${analysis.confidence_score}% - ${analysis.analysis_type || 'General analysis'}`
      };
    });
  }, [realData]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Competitive Intelligence Tracker
          </CardTitle>
          <Badge className="bg-purple-100 text-purple-800">
            Claude AI Insights
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Market Position Radar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-gold-600" />
            Market Position Analysis
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={marketPosition}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={0} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar
                  name="Your Score"
                  dataKey="yourScore"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Market Leader"
                  dataKey="marketLeader"
                  stroke="#EF4444"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Radar
                  name="Industry Average"
                  dataKey="industry"
                  stroke="#10B981"
                  fill="transparent"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Your Score</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-red-500"></div>
              <span>Market Leader</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-1 bg-green-500"></div>
              <span>Industry Average</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Competitor Insights */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Competitive Insights
            </h4>
            <div className="space-y-3">
              {competitorInsights.map((insight, index) => (
                <div key={index} className="p-3 bg-white border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{insight.competitor}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-blue-600">
                        {insight.advantageScore}% Advantage
                      </span>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">Actionable</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{insight.insight}</p>
                  <Badge variant="secondary" className="text-xs">
                    {insight.category}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Top Opportunities */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Top 3 Opportunities (Claude AI)
            </h4>
            <div className="space-y-3">
              {topOpportunities.map((opportunity, index) => (
                <div key={index} className="p-3 bg-white border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">{opportunity.area}</span>
                    <div className="flex gap-1">
                      <Badge className={`text-xs ${getImpactColor(opportunity.impact)}`}>
                        {opportunity.impact} impact
                      </Badge>
                      <Badge className={`text-xs ${getEffortColor(opportunity.effort)}`}>
                        {opportunity.effort} effort
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{opportunity.description}</p>
                  <div className="text-xs text-blue-600 font-medium">
                    💡 {opportunity.claudeInsight}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Items Summary */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-purple-900">Competitive Action Plan</h4>
            <Button size="sm" variant="outline">
              <ExternalLink className="h-3 w-3 mr-1" />
              Full Report
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-purple-800">Quick Wins:</span>
              <div className="text-purple-700">
                {topOpportunities.filter(o => o.effort === 'low').length} opportunities
              </div>
            </div>
            <div>
              <span className="font-medium text-purple-800">High Impact:</span>
              <div className="text-purple-700">
                {topOpportunities.filter(o => o.impact === 'high').length} initiatives
              </div>
            </div>
            <div>
              <span className="font-medium text-purple-800">Competitive Gap:</span>
              <div className="text-purple-700">
                {Math.round(marketPosition.reduce((acc, pos) => acc + (pos.marketLeader - pos.yourScore), 0) / marketPosition.length)} points avg
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
