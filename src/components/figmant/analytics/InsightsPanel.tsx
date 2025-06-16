
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Target,
  Zap,
  Clock,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'improvement' | 'trend' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

interface InsightsPanelProps {
  insights: Insight[];
  metrics: PerformanceMetric[];
  isLoading: boolean;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  insights,
  metrics,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Generate AI-powered recommendations based on metrics
  const generateRecommendations = () => {
    const recommendations = [];
    
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

  const recommendations = generateRecommendations();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return Lightbulb;
      case 'trend':
        return TrendingUp;
      case 'alert':
        return AlertTriangle;
      default:
        return CheckCircle;
    }
  };

  const getInsightColor = (type: string) => {
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

  const getImpactColor = (impact: string) => {
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

  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">87%</div>
              <p className="text-sm text-gray-600">Overall Health Score</p>
              <Progress value={87} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">+12%</div>
              <p className="text-sm text-gray-600">Performance Improvement</p>
              <Progress value={65} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
              <p className="text-sm text-gray-600">User Satisfaction</p>
              <Progress value={94} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="improvement">Improvements</TabsTrigger>
          <TabsTrigger value="trend">Trends</TabsTrigger>
          <TabsTrigger value="alert">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec: any) => (
                  <div key={rec.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-purple-600" />
                        <h4 className="font-medium text-gray-900">{rec.title}</h4>
                      </div>
                      <Badge variant="outline" className={getImpactColor(rec.impact)}>
                        {rec.impact} impact
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-900">Action Items:</h5>
                      {rec.actionItems.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <ArrowRight className="h-3 w-3" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <Button size="sm" className="mt-3">
                      Implement Suggestions
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Insights List */}
          <div className="space-y-4">
            {filteredInsights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.type);

              return (
                <Card key={insight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{insight.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getImpactColor(insight.impact)}>
                              {insight.impact} impact
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {formatDistanceToNow(insight.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {insight.type === 'improvement' && (
                            <Button size="sm">
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredInsights.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">
                  {activeTab === 'all' ? 'No insights available' : `No ${activeTab} insights`}
                </h3>
                <p className="text-sm text-gray-500">
                  {activeTab === 'alert' 
                    ? "Great! No alerts at the moment. Your system is running smoothly."
                    : "Check back later for new insights and recommendations."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
