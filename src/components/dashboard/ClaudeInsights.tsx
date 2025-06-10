
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingUp, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const ClaudeInsights = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [query, setQuery] = useState('Analyze my UX data and provide insights on user behavior patterns, conversion optimization opportunities, and potential issues.');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if Claude AI is enabled
  const { data: claudeSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['claude-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_claude_settings');
      if (error) throw error;
      return data[0];
    }
  });

  // Fetch existing insights
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['claude-insights'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claude_insights')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Generate insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('claude-ai', {
        body: {
          prompt,
          userId: user.id,
          requestType: 'insights'
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-insights'] });
      toast({
        title: "Analysis Complete",
        description: "Claude has generated new UX insights based on your request.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate insights. Please try again.",
        variant: "destructive",
      });
    }
  });

  const analyzeWithClaude = async () => {
    if (!claudeSettings?.claude_ai_enabled) {
      toast({
        title: "Claude AI Disabled",
        description: "Claude AI integration is currently disabled. Please contact your administrator.",
        variant: "destructive",
      });
      return;
    }

    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a query for Claude to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      await generateInsightsMutation.mutateAsync(query);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <Lightbulb className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'issue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'revenue': return 'bg-green-100 text-green-800';
      case 'conversion': return 'bg-purple-100 text-purple-800';
      case 'engagement': return 'bg-blue-100 text-blue-800';
      case 'ux': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (settingsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Claude AI Insights</CardTitle>
          <CardDescription>Loading Claude AI configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Claude AI Insights</span>
          </CardTitle>
          <CardDescription>
            Generate intelligent UX insights using Claude AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!claudeSettings?.claude_ai_enabled ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800 font-medium">Claude AI is disabled</p>
              </div>
              <p className="text-yellow-700 text-sm mt-1">
                Contact your administrator to enable Claude AI integration.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="analysis-query" className="text-sm font-medium">
                  Analysis Query
                </label>
                <Textarea
                  id="analysis-query"
                  placeholder="Ask Claude to analyze specific aspects of your UX data..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={3}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                onClick={analyzeWithClaude} 
                disabled={isAnalyzing || !claudeSettings?.claude_ai_enabled}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing with Claude...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate AI Insights
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {insightsLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Loading Insights...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : insights && insights.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent AI Insights</h3>
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    {getInsightIcon(insight.insight_type)}
                    <span>{insight.title}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                    {insight.impact_area && (
                      <Badge variant="outline" className={getImpactColor(insight.impact_area)}>
                        {insight.impact_area}
                      </Badge>
                    )}
                    {insight.confidence_score && (
                      <Badge variant="outline">
                        {Math.round(insight.confidence_score * 100)}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(insight.created_at).toLocaleDateString()} at{' '}
                  {new Date(insight.created_at).toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights yet</h3>
              <p className="text-muted-foreground">
                Generate your first AI insights by clicking the button above.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
