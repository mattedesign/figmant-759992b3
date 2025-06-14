
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalysisMetricsProps {
  totalAnalyses: number;
  batchAnalysesCount: number;
  completedAnalyses: number;
}

export const AnalysisMetrics: React.FC<AnalysisMetricsProps> = ({
  totalAnalyses,
  batchAnalysesCount,
  completedAnalyses
}) => {
  const completionRate = totalAnalyses > 0 ? Math.round((completedAnalyses / totalAnalyses) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Total Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalAnalyses}</p>
          <p className="text-sm text-muted-foreground">
            {batchAnalysesCount} batch analyses
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{completionRate}%</p>
          <p className="text-sm text-muted-foreground">
            Successful analyses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
