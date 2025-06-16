
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { InsightData } from './types/dashboard';
import { InsightsSectionLoading } from './components/LoadingStates';
import { InsightsSectionEmpty } from './components/EmptyStates';
import { InsightsSectionError } from './components/ErrorStates';
import { InsightRowMobile } from './components/InsightRowMobile';
import { InsightRowTablet } from './components/InsightRowTablet';
import { InsightRowDesktop } from './components/InsightRowDesktop';
import { InsightsTableHeader } from './components/InsightsTableHeader';

interface InsightsSectionProps {
  insightsData: InsightData[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({ 
  insightsData, 
  isLoading, 
  error, 
  onRetry 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleViewInsight = (insight: InsightData) => {
    // Navigate to analytics page with insight parameter
    navigate(`/figmant/analytics?insight=${insight.id}`);
  };

  const handleViewAnalytics = () => {
    navigate('/figmant/analytics');
  };

  const handleMetricClick = (insight: InsightData, metricType: 'total' | 'running' | 'complete') => {
    // Navigate to filtered analytics view
    navigate(`/figmant/analytics?filter=${metricType}&user=${insight.id}`);
  };

  const containerStyle = {
    borderRadius: 'var(--corner-radius-2xl, 16px)',
    border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
    background: 'var(--background-base-white, #FFF)',
    padding: '24px'
  };

  return (
    <div 
      className={`mb-6 ${isMobile ? 'w-full' : ''}`}
      style={containerStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className={`font-medium text-base ${isTablet ? 'text-base' : 'text-base'}`}>Insights</h2>
          <Badge variant="outline" className="text-xs">
            {insightsData.length} active
          </Badge>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500"
          onClick={handleViewAnalytics}
        >
          This month
        </Button>
      </div>
      
      {/* Loading State */}
      {isLoading && <InsightsSectionLoading />}
      
      {/* Error State */}
      {error && !isLoading && <InsightsSectionError onRetry={onRetry} />}
      
      {/* Empty State */}
      {!isLoading && !error && insightsData.length === 0 && <InsightsSectionEmpty />}
      
      {/* Data State */}
      {!isLoading && !error && insightsData.length > 0 && (
        <div className="space-y-3">
          {!isMobile && !isTablet && <InsightsTableHeader />}
          
          {insightsData.map((insight, index) => {
            if (isMobile) {
              return (
                <InsightRowMobile
                  key={insight.id}
                  insight={insight}
                  index={index}
                  onViewInsight={handleViewInsight}
                  onMetricClick={handleMetricClick}
                />
              );
            }
            
            if (isTablet) {
              return (
                <InsightRowTablet
                  key={insight.id}
                  insight={insight}
                  index={index}
                  onViewInsight={handleViewInsight}
                  onMetricClick={handleMetricClick}
                />
              );
            }
            
            return (
              <InsightRowDesktop
                key={insight.id}
                insight={insight}
                index={index}
                onViewInsight={handleViewInsight}
                onMetricClick={handleMetricClick}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
