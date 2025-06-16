
import { PerformanceMetric, Recommendation } from '../types/insights';

export const generateRecommendations = (metrics: PerformanceMetric[]): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  
  // Check processing time
  const processingTime = metrics.find(m => m.name.includes('Processing Time'));
  if (processingTime && processingTime.value > 3.0) {
    recommendations.push({
      id: 'rec-1',
      type: 'improvement',
      title: 'Optimize Processing Pipeline',
      description: 'Current processing time is above optimal range. Consider implementing caching or optimizing analysis algorithms.',
      impact: 'high',
      timestamp: new Date(),
      actionItems: [
        'Enable result caching for similar designs',
        'Optimize image preprocessing pipeline',
        'Consider upgrading processing infrastructure'
      ]
    });
  }

  // Check success rate
  const successRate = metrics.find(m => m.name.includes('Success Rate'));
  if (successRate && successRate.value < 95) {
    recommendations.push({
      id: 'rec-2',
      type: 'improvement',
      title: 'Improve Analysis Reliability',
      description: 'Success rate could be improved. Review error patterns and enhance input validation.',
      impact: 'medium',
      timestamp: new Date(),
      actionItems: [
        'Review common failure patterns',
        'Enhance input validation',
        'Implement better error recovery'
      ]
    });
  }

  return recommendations;
};

export const getInsightIcon = (type: string) => {
  switch (type) {
    case 'improvement':
      return 'Lightbulb';
    case 'trend':
      return 'TrendingUp';
    case 'alert':
      return 'AlertTriangle';
    default:
      return 'CheckCircle';
  }
};

export const getInsightColor = (type: string) => {
  switch (type) {
    case 'improvement':
      return 'text-blue-600 bg-blue-100';
    case 'trend':
      return 'text-green-600 bg-green-100';
    case 'alert':
      return 'text-yellow-600 bg-yellow-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
