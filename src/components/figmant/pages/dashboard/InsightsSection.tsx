
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { InsightsLoading } from './components/LoadingStates';
import { InsightsEmpty } from './components/EmptyStates';
import { InsightsError } from './components/ErrorStates';

interface InsightData {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'user-behavior' | 'optimization' | 'trend';
  impact: 'high' | 'medium' | 'low';
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface InsightsSectionProps {
  insightsData: InsightData[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'performance':
      return TrendingUp;
    case 'user-behavior':
      return Users;
    case 'optimization':
      return Target;
    case 'trend':
      return Lightbulb;
    default:
      return Lightbulb;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  insightsData, 
  isLoading, 
  error, 
  onRetry 
}) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const containerStyle = {
    borderRadius: 'var(--corner-radius-2xl, 16px)',
    border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
    background: 'var(--background-base-white, #FFF)',
    padding: '24px'
  };

  return (
    <div 
      className="w-full"
      style={containerStyle}
    >
      <div className="mb-4">
        <CardTitle className="text-xl font-semibold">Insights</CardTitle>
        <Badge variant="secondary" className="ml-2">1 active</Badge>
      </div>
      
      {/* Loading State */}
      {isLoading && <InsightsLoading />}
      
      {/* Error State */}
      {error && !isLoading && <InsightsError onRetry={onRetry} />}
      
      {/* Empty State */}
      {!isLoading && !error && insightsData.length === 0 && <InsightsEmpty />}
      
      {/* Data State */}
      {!isLoading && !error && insightsData.length > 0 && (
        <div className="space-y-4">
          {insightsData.map((insight) => {
            const CategoryIcon = getCategoryIcon(insight.category);
            
            return (
              <Card 
                key={insight.id} 
                className="border-0"
                style={{
                  borderRadius: 'var(--corner-radius-xl, 12px)',
                  border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
                  background: 'var(--background-base-white, #FFF)'
                }}
              >
                <CardHeader className={`pb-3 ${isTablet ? 'pb-2' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className={`h-4 w-4 text-gray-400 ${isTablet ? 'h-3 w-3' : ''}`} />
                      <span className={`font-medium ${isTablet ? 'text-sm' : ''}`}>{insight.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getImpactColor(insight.impact)} ${isTablet ? 'text-xs' : ''}`}
                      >
                        {insight.impact} impact
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        <ExternalLink className={`h-4 w-4 ${isTablet ? 'h-3 w-3' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={`pt-0 ${isTablet ? 'px-4 pb-4' : ''}`}>
                  <div className={`space-y-2 ${isTablet ? 'space-y-1' : ''}`}>
                    <p className={`text-sm text-gray-600 ${isTablet ? 'text-xs' : ''}`}>
                      {insight.description}
                    </p>
                    <div className={`flex justify-between items-center text-sm ${isTablet ? 'text-xs' : ''}`}>
                      <span className="font-medium">{insight.value}</span>
                      <span className={`${
                        insight.trend === 'up' ? 'text-green-600' : 
                        insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {insight.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
