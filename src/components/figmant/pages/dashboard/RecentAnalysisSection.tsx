import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Target, BarChart3, Users, ShoppingCart, FlaskConical, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { AnalysisData } from './types/dashboard';
import { RecentAnalysisLoading } from './components/LoadingStates';
import { RecentAnalysisEmpty } from './components/EmptyStates';
import { RecentAnalysisError } from './components/ErrorStates';
import { AnalysisDetailDrawer } from '../analysis/AnalysisDetailDrawer';

interface RecentAnalysisSectionProps {
  analysisData: AnalysisData[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

const getTemplateIcon = (analysisType: string) => {
  const type = analysisType?.toLowerCase() || '';
  
  if (type.includes('master') || type.includes('comprehensive')) {
    return Sparkles;
  } else if (type.includes('competitor') || type.includes('competitive')) {
    return Target;
  } else if (type.includes('visual') || type.includes('hierarchy')) {
    return BarChart3;
  } else if (type.includes('copy') || type.includes('messaging') || type.includes('content')) {
    return Users;
  } else if (type.includes('ecommerce') || type.includes('revenue') || type.includes('conversion')) {
    return ShoppingCart;
  } else if (type.includes('ab') || type.includes('test') || type.includes('experiment')) {
    return FlaskConical;
  } else {
    return Sparkles; // Default fallback
  }
};

export const RecentAnalysisSection: React.FC<RecentAnalysisSectionProps> = ({ 
  analysisData, 
  isLoading, 
  error, 
  onRetry 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null);

  // Limit to maximum of 4 items
  const limitedAnalysisData = analysisData.slice(0, 4);

  const handleViewAnalysis = (analysis: AnalysisData) => {
    // Open the analysis detail drawer instead of navigating
    setSelectedAnalysis(analysis);
  };

  const handleCloseDrawer = () => {
    setSelectedAnalysis(null);
  };

  const handleViewAllAnalyses = () => {
    // Navigate to the analysis section in the Figmant layout
    window.dispatchEvent(new CustomEvent('navigate-to-analysis'));
  };

  const getGridColumns = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-1 xl:grid-cols-2';
    return 'grid-cols-2';
  };

  const containerStyle = {
    borderRadius: 'var(--corner-radius-2xl, 16px)',
    border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
    background: 'var(--background-base-white, #FFF)',
    padding: '24px'
  };

  return (
    <>
      <div 
        className={isMobile ? "w-full" : isTablet ? "w-full" : "col-span-8"}
        style={containerStyle}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Analysis</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500"
            onClick={handleViewAllAnalyses}
          >
            See all
          </Button>
        </div>
        
        {/* Loading State */}
        {isLoading && <RecentAnalysisLoading />}
        
        {/* Error State */}
        {error && !isLoading && <RecentAnalysisError onRetry={onRetry} />}
        
        {/* Empty State */}
        {!isLoading && !error && analysisData.length === 0 && (
          <RecentAnalysisEmpty onAction={() => window.dispatchEvent(new CustomEvent('navigate-to-analysis'))} />
        )}
        
        {/* Data State */}
        {!isLoading && !error && limitedAnalysisData.length > 0 && (
          <div className={`grid gap-4 mb-8 ${getGridColumns()}`}>
            {limitedAnalysisData.map((analysis) => {
              const TemplateIcon = getTemplateIcon(analysis.type);
              
              return (
                <Card 
                  key={analysis.id} 
                  className="border-0 cursor-pointer hover:shadow-md transition-shadow"
                  style={{
                    borderRadius: 'var(--corner-radius-xl, 12px)',
                    border: '1px solid var(--border-neutral-xsubtle, rgba(10, 12, 17, 0.10))',
                    background: 'var(--background-base-white, #FFF)'
                  }}
                  onClick={() => handleViewAnalysis(analysis)}
                >
                  <CardHeader className={`pb-3 ${isTablet ? 'pb-2' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TemplateIcon className={`h-4 w-4 text-gray-400 ${isTablet ? 'h-3 w-3' : ''}`} />
                        <span className={`font-medium ${isTablet ? 'text-sm' : ''}`}>{analysis.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewAnalysis(analysis);
                          }}
                        >
                          <ExternalLink className={`h-4 w-4 ${isTablet ? 'h-3 w-3' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className={`text-sm text-gray-500 ${isTablet ? 'text-xs' : ''}`}>Status: {analysis.status}</div>
                      <div className={`text-sm text-gray-500 ${isTablet ? 'text-xs' : ''}`}>Analysis Type: {analysis.type}</div>
                    </div>
                  </CardHeader>
                  <CardContent className={`pt-0 ${isTablet ? 'px-4 pb-4' : ''}`}>
                    <div className={`space-y-3 ${isTablet ? 'space-y-2' : ''}`}>
                      <div>
                        <div className={`flex justify-between text-sm mb-1 ${isTablet ? 'text-xs' : ''}`}>
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{analysis.progress}%</span>
                        </div>
                        <Progress value={analysis.progress} className={`h-2 ${isTablet ? 'h-1.5' : ''}`} />
                      </div>
                      <div className={`flex justify-between text-sm text-gray-600 ${isTablet ? 'text-xs' : ''}`}>
                        <span>Suggestions: {analysis.suggestions}</span>
                        <span>Documents: {analysis.documents}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Analysis Detail Drawer */}
      {selectedAnalysis && (
        <AnalysisDetailDrawer
          isOpen={!!selectedAnalysis}
          onClose={handleCloseDrawer}
          analysis={selectedAnalysis}
        />
      )}
    </>
  );
};
