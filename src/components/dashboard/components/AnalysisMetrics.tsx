
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ComprehensiveScoringService } from '@/services/comprehensiveScoringService';

interface AnalysisMetricsProps {
  totalAnalyses: number;
  batchAnalysesCount: number;
  completedAnalyses: number;
  analysisData?: any[];
}

export const AnalysisMetrics: React.FC<AnalysisMetricsProps> = ({
  totalAnalyses,
  batchAnalysesCount,
  completedAnalyses,
  analysisData = []
}) => {
  // Calculate overall average comprehensive score
  const calculateAverageComprehensiveScore = () => {
    if (!analysisData || analysisData.length === 0) return 0;
    
    const scores = analysisData
      .filter(analysis => analysis?.impact_summary || analysis?.analysis_results)
      .map(analysis => {
        try {
          const comprehensiveScore = ComprehensiveScoringService.generateCompleteScore(
            analysis,
            analysis?.analysis_type || 'general'
          );
          return comprehensiveScore.overallPlatformScore;
        } catch (error) {
          console.warn('Error calculating comprehensive score:', error);
          return 0;
        }
      })
      .filter(score => score > 0);

    if (scores.length === 0) return 0;
    
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    return Math.round(average);
  };

  const averageComprehensiveScore = calculateAverageComprehensiveScore();
  const scorePercentage = Math.round((averageComprehensiveScore / 1000) * 100);

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
          <CardTitle className="text-base">Average Comprehensive Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{averageComprehensiveScore}</p>
            <span className="text-sm text-muted-foreground">/1000</span>
          </div>
          <Progress value={scorePercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Platform intelligence score
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
