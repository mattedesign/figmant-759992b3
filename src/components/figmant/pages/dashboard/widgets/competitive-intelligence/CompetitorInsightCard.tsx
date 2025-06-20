
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Users, Star } from 'lucide-react';

interface CompetitorInsight {
  id: string;
  competitor: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  confidence: number;
}

interface CompetitorInsightCardProps {
  insights: CompetitorInsight[];
  className?: string;
}

export const CompetitorInsightCard: React.FC<CompetitorInsightCardProps> = ({
  insights,
  className
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'conversion': return <Target className="h-4 w-4" />;
      case 'engagement': return <Users className="h-4 w-4" />;
      case 'performance': return <TrendingUp className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Competitive Intelligence
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.slice(0, 3).map((insight) => (
            <div key={insight.id} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <span className="font-medium text-sm">{insight.competitor}</span>
                </div>
                <Badge className={getImpactColor(insight.impact)}>
                  {insight.impact} impact
                </Badge>
              </div>
              
              <p className="text-sm text-gray-700">{insight.insight}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="capitalize">{insight.category}</span>
                <span>{insight.confidence}% confidence</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No competitive insights yet</p>
            <p className="text-xs">Run competitor analysis to see insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
