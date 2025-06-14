
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target, Lightbulb, Star, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { ImpactSummary as ImpactSummaryType } from '@/hooks/batch-upload/impactSummaryGenerator';
import { DesignScreenshot } from './DesignScreenshot';
import { ImpactMetricsChart } from './ImpactMetricsChart';

interface EnhancedImpactSummaryProps {
  impactSummary: ImpactSummaryType;
  designImageUrl?: string;
  designFileName?: string;
  winnerUploadId?: string;
  className?: string;
}

export const EnhancedImpactSummary: React.FC<EnhancedImpactSummaryProps> = ({ 
  impactSummary, 
  designImageUrl,
  designFileName,
  winnerUploadId,
  className = '' 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Enhanced Design Impact Summary
        </CardTitle>
        <CardDescription>
          AI-generated insights with visual analysis and comprehensive metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Design Screenshot Section */}
        {(designImageUrl || winnerUploadId) && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Design Analysis
            </h4>
            <DesignScreenshot
              imageUrl={designImageUrl}
              fileName={designFileName}
              uploadId={winnerUploadId}
              overallScore={impactSummary.key_metrics.overall_score}
            />
          </div>
        )}

        {/* Overall Score with Visual Enhancement */}
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Star className="h-6 w-6 text-yellow-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {impactSummary.key_metrics.overall_score}/10
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Design Score</p>
          <Progress 
            value={impactSummary.key_metrics.overall_score * 10} 
            className="w-32 mx-auto mt-2"
          />
        </div>

        {/* Interactive Metrics Chart */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Metrics
          </h4>
          <ImpactMetricsChart impactSummary={impactSummary} />
        </div>

        {/* Business Impact with Enhanced Visuals */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Business Impact Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3 p-4 bg-green-50 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conversion Potential</span>
                <span className={`font-bold ${getScoreColor(impactSummary.business_impact.conversion_potential)}`}>
                  {impactSummary.business_impact.conversion_potential}/10
                </span>
              </div>
              <Progress 
                value={impactSummary.business_impact.conversion_potential * 10} 
                className="h-2"
              />
            </div>
            <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">User Engagement</span>
                <span className={`font-bold ${getScoreColor(impactSummary.business_impact.user_engagement_score)}`}>
                  {impactSummary.business_impact.user_engagement_score}/10
                </span>
              </div>
              <Progress 
                value={impactSummary.business_impact.user_engagement_score * 10} 
                className="h-2"
              />
            </div>
            <div className="space-y-3 p-4 bg-purple-50 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Brand Alignment</span>
                <span className={`font-bold ${getScoreColor(impactSummary.business_impact.brand_alignment)}`}>
                  {impactSummary.business_impact.brand_alignment}/10
                </span>
              </div>
              <Progress 
                value={impactSummary.business_impact.brand_alignment * 10} 
                className="h-2"
              />
            </div>
          </div>
          {impactSummary.business_impact.competitive_advantage.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Competitive Advantages:
              </p>
              <div className="flex flex-wrap gap-2">
                {impactSummary.business_impact.competitive_advantage.map((advantage, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                    {advantage}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Experience with Enhanced Presentation */}
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Experience Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 bg-orange-50 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Usability Score</span>
                <span className={`font-bold ${getScoreColor(impactSummary.user_experience.usability_score)}`}>
                  {impactSummary.user_experience.usability_score}/10
                </span>
              </div>
              <Progress 
                value={impactSummary.user_experience.usability_score * 10} 
                className="h-2"
              />
            </div>
            <div className="space-y-3 p-4 bg-indigo-50 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Accessibility Rating</span>
                <span className={`font-bold ${getScoreColor(impactSummary.user_experience.accessibility_rating)}`}>
                  {impactSummary.user_experience.accessibility_rating}/10
                </span>
              </div>
              <Progress 
                value={impactSummary.user_experience.accessibility_rating * 10} 
                className="h-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactSummary.user_experience.pain_points.length > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Areas for Improvement:
                </p>
                <ul className="text-xs space-y-2">
                  {impactSummary.user_experience.pain_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {impactSummary.user_experience.positive_aspects.length > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  Strengths Identified:
                </p>
                <ul className="text-xs space-y-2">
                  {impactSummary.user_experience.positive_aspects.map((aspect, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Recommendations */}
        {impactSummary.recommendations.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Actionable Recommendations
            </h4>
            <div className="space-y-3">
              {impactSummary.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                      {rec.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <span className="text-xs text-muted-foreground px-2 py-1 bg-gray-100 rounded">
                      {rec.category}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{rec.description}</p>
                    <div className="text-xs text-muted-foreground p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                      <strong>Expected Impact:</strong> {rec.expected_impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
          {impactSummary.key_metrics.strengths.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-green-500" />
                Key Strengths:
              </p>
              <ul className="text-xs space-y-2">
                {impactSummary.key_metrics.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {impactSummary.key_metrics.improvement_areas.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Growth Opportunities:
              </p>
              <ul className="text-xs space-y-2">
                {impactSummary.key_metrics.improvement_areas.map((area, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
