
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart3, Target, Clock, FileText, TrendingUp } from 'lucide-react';
import { AnalysisSummaryProps } from '@/types/contextualAnalysis';

export const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({
  metrics,
  recommendations,
  className = ''
}) => {
  const getCategoryDistribution = () => {
    const distribution: Record<string, number> = {};
    recommendations.forEach(rec => {
      distribution[rec.category] = (distribution[rec.category] || 0) + 1;
    });
    return distribution;
  };

  const getPriorityDistribution = () => {
    const distribution = { high: 0, medium: 0, low: 0 };
    recommendations.forEach(rec => {
      distribution[rec.priority]++;
    });
    return distribution;
  };

  const categoryDistribution = getCategoryDistribution();
  const priorityDistribution = getPriorityDistribution();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'conversion':
        return 'bg-green-100 text-green-800';
      case 'accessibility':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800';
      case 'branding':
        return 'bg-pink-100 text-pink-800';
      case 'content':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <BarChart3 className="h-5 w-5" />
          Analysis Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalRecommendations}</div>
            <div className="text-sm text-gray-600">Recommendations</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-2">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.highPriorityCount}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.averageConfidence}%</div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.attachmentsAnalyzed}</div>
            <div className="text-sm text-gray-600">Files Analyzed</div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Priority Breakdown
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(priorityDistribution.high / metrics.totalRecommendations) * 100} 
                  className="w-20 h-2"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                  {priorityDistribution.high}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(priorityDistribution.medium / metrics.totalRecommendations) * 100} 
                  className="w-20 h-2"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                  {priorityDistribution.medium}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(priorityDistribution.low / metrics.totalRecommendations) * 100} 
                  className="w-20 h-2"
                />
                <span className="text-sm font-medium text-gray-900 min-w-[2rem]">
                  {priorityDistribution.low}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Identified */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Categories Identified</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <Badge key={category} className={`${getCategoryColor(category)} font-medium`}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Implementation Estimate */}
        {metrics.estimatedImplementationTime && (
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Estimated Implementation Time</h4>
            </div>
            <p className="text-blue-800 font-medium">{metrics.estimatedImplementationTime}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
