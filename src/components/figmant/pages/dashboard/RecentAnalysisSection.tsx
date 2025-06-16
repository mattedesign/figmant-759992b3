
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MoreHorizontal } from 'lucide-react';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { AnalysisData } from './types/dashboard';

interface RecentAnalysisSectionProps {
  analysisData: AnalysisData[];
}

export const RecentAnalysisSection: React.FC<RecentAnalysisSectionProps> = ({ analysisData }) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const getGridColumns = () => {
    if (isMobile) return 'grid-cols-1';
    if (isTablet) return 'grid-cols-1 xl:grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div className={isMobile ? "w-full" : isTablet ? "w-full" : "col-span-8"}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Analysis</h2>
        <Button variant="ghost" size="sm" className="text-gray-500">
          See all
        </Button>
      </div>
      
      <div className={`grid gap-4 mb-8 ${getGridColumns()}`}>
        {analysisData.map((analysis) => (
          <Card key={analysis.id} className="border border-gray-200">
            <CardHeader className={`pb-3 ${isTablet ? 'pb-2' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className={`h-4 w-4 text-gray-400 ${isTablet ? 'h-3 w-3' : ''}`} />
                  <span className={`font-medium ${isTablet ? 'text-sm' : ''}`}>{analysis.title}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className={`h-4 w-4 ${isTablet ? 'h-3 w-3' : ''}`} />
                </Button>
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
        ))}
      </div>
    </div>
  );
};
