
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Users, Target, Lightbulb, Star, AlertTriangle } from 'lucide-react';
import { ImpactSummary as ImpactSummaryType } from '@/hooks/batch-upload/impactSummaryGenerator';

interface ImpactSummaryProps {
  impactSummary: ImpactSummaryType;
  className?: string;
}

export const ImpactSummary: React.FC<ImpactSummaryProps> = ({ 
  impactSummary, 
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
          Design Impact Summary
        </CardTitle>
        <CardDescription>
          AI-generated insights on business impact and user experience implications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-2xl font-bold">
              {impactSummary.key_metrics.overall_score}/10
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Design Score</p>
        </div>

        {/* Business Impact */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Business Impact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Conversion Potential</span>
                <span className={getScoreColor(impactSummary.business_impact.conversion_potential)}>
                  {impactSummary.business_impact.conversion_potential}/10
                </span>
              </div>
              <Progress value={impactSummary.business_impact.conversion_potential * 10} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Engagement</span>
                <span className={getScoreColor(impactSummary.business_impact.user_engagement_score)}>
                  {impactSummary.business_impact.user_engagement_score}/10
                </span>
              </div>
              <Progress value={impactSummary.business_impact.user_engagement_score * 10} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Brand Alignment</span>
                <span className={getScoreColor(impactSummary.business_impact.brand_alignment)}>
                  {impactSummary.business_impact.brand_alignment}/10
                </span>
              </div>
              <Progress value={impactSummary.business_impact.brand_alignment * 10} />
            </div>
          </div>
          {impactSummary.business_impact.competitive_advantage.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Competitive Advantages:</p>
              <div className="flex flex-wrap gap-2">
                {impactSummary.business_impact.competitive_advantage.map((advantage, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {advantage}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Experience */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Experience
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usability Score</span>
                <span className={getScoreColor(impactSummary.user_experience.usability_score)}>
                  {impactSummary.user_experience.usability_score}/10
                </span>
              </div>
              <Progress value={impactSummary.user_experience.usability_score * 10} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accessibility Rating</span>
                <span className={getScoreColor(impactSummary.user_experience.accessibility_rating)}>
                  {impactSummary.user_experience.accessibility_rating}/10
                </span>
              </div>
              <Progress value={impactSummary.user_experience.accessibility_rating * 10} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {impactSummary.user_experience.pain_points.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  Pain Points:
                </p>
                <ul className="text-xs space-y-1">
                  {impactSummary.user_experience.pain_points.map((point, index) => (
                    <li key={index} className="text-muted-foreground">• {point}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {impactSummary.user_experience.positive_aspects.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Star className="h-3 w-3 text-green-500" />
                  Positive Aspects:
                </p>
                <ul className="text-xs space-y-1">
                  {impactSummary.user_experience.positive_aspects.map((aspect, index) => (
                    <li key={index} className="text-muted-foreground">• {aspect}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {impactSummary.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Key Recommendations
            </h4>
            <div className="space-y-3">
              {impactSummary.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                      {rec.priority.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{rec.category}</span>
                  </div>
                  <p className="text-sm font-medium">{rec.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Expected Impact: {rec.expected_impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {impactSummary.key_metrics.strengths.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Key Strengths:</p>
              <ul className="text-xs space-y-1">
                {impactSummary.key_metrics.strengths.map((strength, index) => (
                  <li key={index} className="text-muted-foreground">• {strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {impactSummary.key_metrics.improvement_areas.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Improvement Areas:</p>
              <ul className="text-xs space-y-1">
                {impactSummary.key_metrics.improvement_areas.map((area, index) => (
                  <li key={index} className="text-muted-foreground">• {area}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
