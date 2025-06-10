
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ClaudeInsights = () => {
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const { toast } = useToast();

  const analyzeWithClaude = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Claude API key to generate insights.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate Claude API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock insights data
      const mockInsights = [
        {
          type: 'improvement',
          title: 'Navigation Optimization',
          description: 'Users are spending 23% more time finding the search function. Consider making it more prominent.',
          priority: 'high',
          impact: 'conversion'
        },
        {
          type: 'trend',
          title: 'Mobile Usage Pattern',
          description: 'Mobile users show 15% higher engagement on product comparison pages.',
          priority: 'medium',
          impact: 'engagement'
        },
        {
          type: 'issue',
          title: 'Checkout Friction',
          description: 'Cart abandonment spikes at the payment step, suggesting form complexity issues.',
          priority: 'critical',
          impact: 'revenue'
        }
      ];
      
      setInsights(mockInsights);
      toast({
        title: "Analysis Complete",
        description: "Claude has generated new UX insights based on your data.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to generate insights. Please check your API key and try again.",
        variant: "destructive",
      });
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
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Claude AI Configuration</span>
          </CardTitle>
          <CardDescription>
            Connect your Claude API to generate intelligent UX insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claude-api-key">Claude API Key</Label>
            <Input
              id="claude-api-key"
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="analysis-query">Custom Analysis Query (Optional)</Label>
            <Textarea
              id="analysis-query"
              placeholder="Ask Claude to analyze specific aspects of your UX data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={analyzeWithClaude} 
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with Claude...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate AI Insights
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2 text-base">
                    {getInsightIcon(insight.type)}
                    <span>{insight.title}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="secondary" className={getPriorityColor(insight.priority)}>
                      {insight.priority}
                    </Badge>
                    <Badge variant="outline">
                      {insight.impact}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
