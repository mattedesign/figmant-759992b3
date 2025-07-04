
import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useDesignBatchAnalyses } from '@/hooks/useDesignBatchAnalyses';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'improvement' | 'success' | 'warning' | 'trend';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  createdAt: string;
  source: string;
}

export const InsightsPage = () => {
  const { data: individualAnalyses = [], refetch: refetchAnalyses } = useDesignAnalyses();
  const { data: batchAnalyses = [], refetch: refetchBatch } = useDesignBatchAnalyses();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Set up real-time subscriptions for new insights
  useEffect(() => {
    console.log('Setting up real-time subscriptions for insights...');
    
    const insightsChannel = supabase
      .channel('insights-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'design_analysis'
        },
        (payload) => {
          console.log('Real-time: New analysis for insights:', payload);
          // Refresh data to generate new insights
          refetchAnalyses();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'design_batch_analysis'
        },
        (payload) => {
          console.log('Real-time: New batch analysis for insights:', payload);
          refetchBatch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up insights real-time subscriptions...');
      supabase.removeChannel(insightsChannel);
    };
  }, [refetchAnalyses, refetchBatch]);

  // Generate insights from analysis data
  const insights = useMemo(() => {
    console.log('Generating insights from data:', {
      individualAnalysesCount: individualAnalyses.length,
      batchAnalysesCount: batchAnalyses.length
    });

    const generatedInsights: Insight[] = [];

    // Analyze individual analyses for patterns
    if (individualAnalyses.length > 0) {
      const avgConfidence = individualAnalyses.reduce((sum, analysis) => sum + (analysis.confidence_score || 0), 0) / individualAnalyses.length;
      
      // Count chat analyses specifically
      const chatAnalyses = individualAnalyses.filter(analysis => analysis.analysis_type === 'chat_analysis');
      
      if (chatAnalyses.length > 0) {
        generatedInsights.push({
          id: 'chat-analysis-activity',
          title: 'Active Chat Analysis Usage',
          description: `You've completed ${chatAnalyses.length} chat analysis session${chatAnalyses.length !== 1 ? 's' : ''}, showing strong engagement with AI-powered insights.`,
          type: 'success',
          priority: 'medium',
          confidence: 0.95,
          createdAt: new Date().toISOString(),
          source: 'Chat Analysis'
        });
      }
      
      if (avgConfidence > 0.8) {
        generatedInsights.push({
          id: 'high-confidence',
          title: 'High Analysis Confidence',
          description: `Your recent analyses show ${Math.round(avgConfidence * 100)}% average confidence, indicating strong design quality.`,
          type: 'success',
          priority: 'medium',
          confidence: avgConfidence,
          createdAt: new Date().toISOString(),
          source: 'Individual Analysis'
        });
      } else if (avgConfidence < 0.6) {
        generatedInsights.push({
          id: 'low-confidence',
          title: 'Design Quality Concerns',
          description: `Average analysis confidence is ${Math.round(avgConfidence * 100)}%. Consider reviewing design fundamentals.`,
          type: 'warning',
          priority: 'high',
          confidence: avgConfidence,
          createdAt: new Date().toISOString(),
          source: 'Individual Analysis'
        });
      }
    }

    // Analyze batch analyses for trends
    if (batchAnalyses.length > 0) {
      generatedInsights.push({
        id: 'batch-trends',
        title: 'Comparative Analysis Trends',
        description: `${batchAnalyses.length} batch analyses completed. Comparative testing shows iterative improvements.`,
        type: 'trend',
        priority: 'medium',
        confidence: 0.85,
        createdAt: new Date().toISOString(),
        source: 'Batch Analysis'
      });
    }

    // Add some example insights for demonstration
    generatedInsights.push(
      {
        id: 'accessibility-focus',
        title: 'Accessibility Improvement Opportunity',
        description: 'Recent analyses suggest focusing on color contrast and keyboard navigation improvements.',
        type: 'improvement',
        priority: 'high',
        confidence: 0.92,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'Pattern Analysis'
      },
      {
        id: 'conversion-optimization',
        title: 'Conversion Rate Optimization',
        description: 'Your call-to-action placements show strong performance. Consider applying similar patterns across designs.',
        type: 'success',
        priority: 'medium',
        confidence: 0.78,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        source: 'UX Analysis'
      }
    );

    return generatedInsights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [individualAnalyses, batchAnalyses]);

  const handleRefreshInsights = () => {
    console.log('Manually refreshing insights...');
    refetchAnalyses();
    refetchBatch();
    
    toast({
      title: "Insights Refreshed",
      description: "Insights have been updated based on the latest analysis data.",
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive' as const,
      medium: 'default' as const,
      low: 'secondary' as const
    };
    return <Badge variant={variants[priority as keyof typeof variants]}>{priority}</Badge>;
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Design Insights</h1>
          <p className="text-muted-foreground">
            AI-powered insights and recommendations based on your design analysis patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshInsights}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Insights
          </Button>
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getPriorityBadge(insight.priority)}
                      <Badge variant="outline">{insight.source}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{insight.description}</p>
              <div className="text-xs text-muted-foreground">
                Generated {new Date(insight.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {insights.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Insights Available</h3>
            <p className="text-muted-foreground">
              Complete more design analyses to generate AI-powered insights and recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
