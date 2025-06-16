
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Lightbulb, ArrowRight } from 'lucide-react';
import { Recommendation } from '../types/insights';
import { getImpactColor } from '../utils/insightsUtils';

interface AIRecommendationsSectionProps {
  recommendations: Recommendation[];
}

export const AIRecommendationsSection: React.FC<AIRecommendationsSectionProps> = ({
  recommendations
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-600" />
          AI-Powered Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
              </div>
              <Badge variant="outline" className={getImpactColor(rec.impact)}>
                {rec.impact} impact
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">Action Items:</h5>
              {rec.actionItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <ArrowRight className="h-3 w-3" />
                  {item}
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-3">
              Implement Suggestions
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
