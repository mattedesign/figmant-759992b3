
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Clock, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisPerformanceWidgetProps {
  analysisData: Array<{
    id: string;
    confidence_score: number;
    suggestions?: any;
  }>;
  className?: string;
}

export const AnalysisPerformanceWidget: React.FC<AnalysisPerformanceWidgetProps> = ({
  analysisData = [],
  className
}) => {
  const performanceMetrics = useMemo(() => {
    if (analysisData.length === 0) {
      return {
        total_analyses: 0,
        avg_confidence_score: 0,
        high_confidence_count: 0,
        avg_suggestions_per_analysis: 0,
        success_rate: 0,
        performance_trend: 'stable' as const,
        quality_score: 0
      };
    }

    const total_analyses = analysisData.length;
    
    // Calculate average confidence score
    const total_confidence = analysisData.reduce((sum, analysis) => 
      sum + (analysis.confidence_score || 0), 0);
    const avg_confidence_score = Math.round(total_confidence / total_analyses);
    
    // Count high confidence analyses (>80%)
    const high_confidence_count = analysisData.filter(analysis => 
      (analysis.confidence_score || 0) > 80).length;
    
    // Calculate average suggestions per analysis
    const total_suggestions = analysisData.reduce((sum, analysis) => {
      if (!analysis.suggestions) return sum;
      const suggestionCount = typeof analysis.suggestions === 'object' ? 
        Object.keys(analysis.suggestions).length : 0;
      return sum + suggestionCount;
    }, 0);
    const avg_suggestions_per_analysis = total_analyses > 0 ? 
      Math.round(total_suggestions / total_analyses) : 0;
    
    // Calculate success rate (analyses with confidence > 70%)
    const successful_analyses = analysisData.filter(analysis => 
      (analysis.confidence_score || 0) > 70).length;
    const success_rate = Math.round((successful_analyses / total_analyses) * 100);
    
    // Determine performance trend (mock calculation based on recent vs older analyses)
    const recent_analyses = analysisData.slice(0, Math.ceil(total_analyses / 2));
    const older_analyses = analysisData.slice(Math.ceil(total_analyses / 2));
    
    const recent_avg = recent_analyses.length > 0 ? 
      recent_analyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / recent_analyses.length : 0;
    const older_avg = older_analyses.length > 0 ? 
      older_analyses.reduce((sum, a) => sum + (a.confidence_score || 0), 0) / older_analyses.length : 0;
    
    let performance_trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recent_avg > older_avg + 5) performance_trend = 'improving';
    else if (recent_avg < older_avg - 5) performance_trend = 'declining';
    
    // Overall quality score (composite metric)
    const quality_score = Math.round(
      (avg_confidence_score * 0.4) + 
      (success_rate * 0.3) + 
      (Math.min(avg_suggestions_per_analysis * 10, 100) * 0.3)
    );

    return {
      total_analyses,
      avg_confidence_score,
      high_confidence_count,
      avg_suggestions_per_analysis,
      success_rate,
      performance_trend,
      quality_score
    };
  }, [analysisData]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    const baseClass = "h-4 w-4";
    switch (trend) {
      case 'improving': return <TrendingUp className={cn(baseClass, "text-green-600")} />;
      case 'declining': return <TrendingUp className={cn(baseClass, "text-red-600 rotate-180")} />;
      default: return <BarChart3 className={cn(baseClass, "text-blue-600")} />;
    }
  };

  const getQualityStatus = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 40) return { label: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const qualityStatus = getQualityStatus(performanceMetrics.quality_score);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Analysis Performance</CardTitle>
          </div>
          <Badge variant="outline" className={cn(qualityStatus.color, qualityStatus.bgColor)}>
            {qualityStatus.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {performanceMetrics.total_analyses}
            </div>
            <div className="text-xs text-muted-foreground">Total Analyses</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {performanceMetrics.avg_confidence_score}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{performanceMetrics.success_rate}%</span>
            </div>
          </div>
          <Progress value={performanceMetrics.success_rate} className="h-2" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm">High Confidence</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {performanceMetrics.high_confidence_count}/{performanceMetrics.total_analyses}
              </span>
            </div>
          </div>
          <Progress 
            value={performanceMetrics.total_analyses > 0 ? 
              (performanceMetrics.high_confidence_count / performanceMetrics.total_analyses) * 100 : 0} 
            className="h-2" 
          />
        </div>

        {/* Quality Score */}
        <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Quality Score</span>
            <span className="text-lg font-bold text-purple-600">
              {performanceMetrics.quality_score}/100
            </span>
          </div>
          <Progress value={performanceMetrics.quality_score} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Based on confidence, success rate, and suggestion quality
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Performance Trend</span>
          </div>
          <div className="flex items-center gap-2">
            {getTrendIcon(performanceMetrics.performance_trend)}
            <span className={cn("text-sm font-medium", getTrendColor(performanceMetrics.performance_trend))}>
              {performanceMetrics.performance_trend.charAt(0).toUpperCase() + 
               performanceMetrics.performance_trend.slice(1)}
            </span>
          </div>
        </div>

        {/* Suggestions Metric */}
        <div className="text-center p-3 border rounded-lg">
          <div className="text-xl font-bold text-orange-600">
            {performanceMetrics.avg_suggestions_per_analysis}
          </div>
          <div className="text-xs text-muted-foreground">
            Average Suggestions per Analysis
          </div>
        </div>

        {/* Empty State */}
        {performanceMetrics.total_analyses === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold text-sm mb-2">No Performance Data</h3>
            <p className="text-xs text-muted-foreground">
              Complete your first analysis to see performance metrics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
