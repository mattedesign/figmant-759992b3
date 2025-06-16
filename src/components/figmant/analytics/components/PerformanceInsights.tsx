
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'improvement' | 'trend' | 'alert' | 'success';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations?: string[];
}

interface PerformanceInsightsProps {
  dataStats: any;
  className?: string;
}

export const PerformanceInsights: React.FC<PerformanceInsightsProps> = ({
  dataStats,
  className
}) => {
  // Generate insights based on data stats
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Completion rate insights
    if (dataStats.completionRate < 70) {
      insights.push({
        id: '1',
        type: 'improvement',
        title: 'Low Completion Rate Detected',
        description: `Your completion rate of ${dataStats.completionRate}% is below the recommended 80% threshold.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Review pending analyses and prioritize completion',
          'Check for blocking issues in your workflow',
          'Consider breaking down complex analyses into smaller parts'
        ]
      });
    } else if (dataStats.completionRate > 90) {
      insights.push({
        id: '2',
        type: 'success',
        title: 'Excellent Completion Rate',
        description: `Outstanding completion rate of ${dataStats.completionRate}%! You're managing your analyses very effectively.`,
        impact: 'medium',
        actionable: false
      });
    }

    // Activity score insights
    if (dataStats.activityScore > 80) {
      insights.push({
        id: '3',
        type: 'trend',
        title: 'High Activity Level',
        description: `Your activity score of ${dataStats.activityScore} indicates very active usage. Great engagement!`,
        impact: 'medium',
        actionable: false
      });
    } else if (dataStats.activityScore < 30) {
      insights.push({
        id: '4',
        type: 'alert',
        title: 'Low Activity Detected',
        description: `Activity score of ${dataStats.activityScore} suggests room for increased engagement.`,
        impact: 'medium',
        actionable: true,
        recommendations: [
          'Try exploring different analysis types',
          'Set up regular analysis schedules',
          'Experiment with various prompt templates'
        ]
      });
    }

    // Pending analyses insights
    if (dataStats.pendingAnalyses > 5) {
      insights.push({
        id: '5',
        type: 'alert',
        title: 'Many Pending Analyses',
        description: `You have ${dataStats.pendingAnalyses} pending analyses that need attention.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          'Schedule time to complete pending analyses',
          'Consider batch processing similar analyses',
          'Set up reminders for analysis follow-ups'
        ]
      });
    }

    // Prompt usage insights
    if (dataStats.totalPrompts > 20) {
      insights.push({
        id: '6',
        type: 'success',
        title: 'Diverse Prompt Usage',
        description: `Great variety with ${dataStats.totalPrompts} different prompts used. This indicates thorough analysis coverage.`,
        impact: 'low',
        actionable: false
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="h-4 w-4" />;
      case 'trend':
        return <Target className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'trend':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'alert':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;
    
    return (
      <Badge variant={variants[impact as keyof typeof variants]}>
        {impact} impact
      </Badge>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <CardTitle>Performance Insights</CardTitle>
          <Badge variant="outline">{insights.length} insights</Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">All looking good!</p>
            <p className="text-sm">No specific insights to show at the moment. Keep up the great work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={cn(
                  "p-4 rounded-lg border",
                  getInsightColor(insight.type)
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      {getImpactBadge(insight.impact)}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {insight.description}
                    </p>
                    
                    {insight.recommendations && (
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                          Recommendations:
                        </h5>
                        <ul className="space-y-1">
                          {insight.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                              <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {insight.actionable && (
                    <Button variant="outline" size="sm" className="flex-shrink-0">
                      <Zap className="h-3 w-3 mr-1" />
                      Act
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
