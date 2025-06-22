
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { AnalysisSummaryProps } from '@/types/contextualAnalysis';

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  metrics,
  recommendations,
  className = ''
}) => {
  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');
  const lowPriorityRecs = recommendations.filter(r => r.priority === 'low');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Analysis Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.averageConfidence}%
            </div>
            <div className="text-sm text-blue-700">Average Confidence</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {metrics.totalRecommendations}
            </div>
            <div className="text-sm text-green-700">Total Recommendations</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.highPriorityCount}
            </div>
            <div className="text-sm text-orange-700">High Priority Items</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.attachmentsAnalyzed}
            </div>
            <div className="text-sm text-purple-700">Files Analyzed</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Recommendations Breakdown</h4>
            <div className="space-y-2">
              {highPriorityRecs.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-700">High Priority</span>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    {highPriorityRecs.length} items
                  </Badge>
                </div>
              )}
              
              {mediumPriorityRecs.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">Medium Priority</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    {mediumPriorityRecs.length} items
                  </Badge>
                </div>
              )}
              
              {lowPriorityRecs.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-700">Low Priority</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {lowPriorityRecs.length} items
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {metrics.categoriesIdentified && metrics.categoriesIdentified.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Categories</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.categoriesIdentified.map((category) => (
                  <Badge key={category} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {metrics.estimatedImplementationTime && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Implementation Timeline</h4>
              <p className="text-gray-600">
                Estimated time to implement all recommendations: {' '}
                <span className="font-medium">{metrics.estimatedImplementationTime}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
