
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Insight } from '../types/insights';
import { getInsightColor, getImpactColor } from '../utils/insightsUtils';

interface InsightCardProps {
  insight: Insight;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return Lightbulb;
      case 'trend':
        return TrendingUp;
      case 'alert':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const Icon = getInsightIcon(insight.type);
  const colorClass = getInsightColor(insight.type);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{insight.title}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getImpactColor(insight.impact)}>
                  {insight.impact} impact
                </Badge>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(insight.timestamp, { addSuffix: true })}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {insight.type === 'improvement' && (
                <Button size="sm">
                  Take Action
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
