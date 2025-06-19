
import React from 'react';
import { ChatMessage } from '@/components/design/DesignChatInterface';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface AnalysisInsightsProps {
  analysisResult?: any;
  analysisMessages: ChatMessage[];
}

export const AnalysisInsights: React.FC<AnalysisInsightsProps> = ({
  analysisResult,
  analysisMessages
}) => {
  // Extract key insights from the latest analysis
  const getInsights = () => {
    const latestMessage = analysisMessages[analysisMessages.length - 1];
    if (!latestMessage) return null;

    const content = latestMessage.content;
    
    // Simple keyword extraction for insights
    const insights = [];
    
    if (content.toLowerCase().includes('improve')) {
      insights.push({
        type: 'improvement',
        text: 'Improvement opportunities identified',
        icon: TrendingUp,
        color: 'text-blue-600'
      });
    }
    
    if (content.toLowerCase().includes('good') || content.toLowerCase().includes('excellent')) {
      insights.push({
        type: 'positive',
        text: 'Positive design elements found',
        icon: CheckCircle,
        color: 'text-green-600'
      });
    }
    
    if (content.toLowerCase().includes('issue') || content.toLowerCase().includes('problem')) {
      insights.push({
        type: 'warning',
        text: 'Issues requiring attention',
        icon: AlertTriangle,
        color: 'text-yellow-600'
      });
    }

    return insights;
  };

  const insights = getInsights();
  const hasAnalysis = analysisMessages.length > 0;

  if (!hasAnalysis) {
    return (
      <div className="text-center py-4">
        <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No analysis yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Send a message to get insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Insights Summary */}
      {insights && insights.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Key Insights
          </p>
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
              <span className="text-xs">{insight.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recent Analysis */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Recent Analysis ({analysisMessages.length})
        </p>
        
        <ScrollArea className="max-h-32">
          <div className="space-y-2">
            {analysisMessages.slice(-3).map((message, index) => (
              <Card key={message.id} className="p-2">
                <CardContent className="p-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {message.content.substring(0, 150)}
                    {message.content.length > 150 && '...'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      Analysis #{analysisMessages.length - index}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
