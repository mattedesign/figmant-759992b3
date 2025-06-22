
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Link } from 'lucide-react';
import { AnalysisSummaryProps } from '@/types/contextualAnalysis';

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  metrics,
  recommendations,
  className = ''
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-50';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 85) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 70) return <TrendingUp className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getAssociationRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Determine grid columns based on whether file association rate is available
  const gridCols = metrics.fileAssociationRate !== undefined ? 
    'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 md:grid-cols-4';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${gridCols} gap-4`}>
          {/* Total Recommendations */}
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.totalRecommendations}
            </div>
            <div className="text-sm text-gray-600">Total Recommendations</div>
          </div>

          {/* High Priority Count */}
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {metrics.highPriorityCount}
            </div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>

          {/* Average Confidence */}
          <div className="text-center">
            <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${getConfidenceColor(metrics.averageConfidence)}`}>
              {getConfidenceIcon(metrics.averageConfidence)}
              {metrics.averageConfidence}%
            </div>
            <div className="text-sm text-gray-600">Avg. Confidence</div>
          </div>

          {/* Files Analyzed */}
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.attachmentsAnalyzed}
            </div>
            <div className="text-sm text-gray-600">Files Analyzed</div>
          </div>

          {/* File Association Rate - Only show if available */}
          {metrics.fileAssociationRate !== undefined && (
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${getAssociationRateColor(metrics.fileAssociationRate)}`}>
                <Link className="h-4 w-4" />
                {metrics.fileAssociationRate}%
              </div>
              <div className="text-sm text-gray-600">File Associations</div>
            </div>
          )}
        </div>

        {/* Categories and Implementation Time */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories Identified:</h4>
            <div className="flex flex-wrap gap-2">
              {metrics.categoriesIdentified.map((category) => (
                <Badge key={category} variant="outline" className="capitalize">
                  {category.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {metrics.estimatedImplementationTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                <span className="font-medium">Estimated Implementation Time:</span> {metrics.estimatedImplementationTime}
              </span>
            </div>
          )}

          {/* File Association Details - Only show if available */}
          {metrics.fileAssociationRate !== undefined && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Link className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">File Association Analysis</span>
              </div>
              <p className="text-xs text-blue-700">
                {metrics.fileAssociationRate}% of uploaded files have been linked to specific recommendations, 
                providing contextual insights for your design assets.
              </p>
            </div>
          )}
        </div>

        {/* Priority Breakdown */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Breakdown:</h4>
          <div className="space-y-2">
            {(['high', 'medium', 'low'] as const).map((priority) => {
              const count = recommendations.filter(r => r.priority === priority).length;
              const percentage = metrics.totalRecommendations > 0 
                ? Math.round((count / metrics.totalRecommendations) * 100) 
                : 0;
              
              const priorityColors = {
                high: 'bg-red-200 text-red-800',
                medium: 'bg-yellow-200 text-yellow-800',
                low: 'bg-green-200 text-green-800'
              };

              return (
                <div key={priority} className="flex items-center gap-3">
                  <Badge className={`capitalize ${priorityColors[priority]}`}>
                    {priority}
                  </Badge>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[4rem] text-right">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
