
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, MoreHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnalysisData } from './types/dashboard';

interface RecentAnalysisSectionProps {
  analysisData: AnalysisData[];
}

export const RecentAnalysisSection: React.FC<RecentAnalysisSectionProps> = ({ analysisData }) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "w-full" : "col-span-8"}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Analysis</h2>
        <Button variant="ghost" size="sm" className="text-gray-500">
          See all
        </Button>
      </div>
      
      <div className={`grid gap-4 mb-8 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {analysisData.map((analysis) => (
          <Card key={analysis.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{analysis.title}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Status: {analysis.status}</div>
                <div className="text-sm text-gray-500">Analysis Type: {analysis.type}</div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{analysis.progress}%</span>
                  </div>
                  <Progress value={analysis.progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
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
