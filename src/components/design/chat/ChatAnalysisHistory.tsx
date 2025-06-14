
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Clock, FileText } from 'lucide-react';
import { useChatAnalysisHistory, SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';

interface ChatAnalysisHistoryProps {
  onSelectAnalysis?: (analysis: SavedChatAnalysis) => void;
}

export const ChatAnalysisHistory: React.FC<ChatAnalysisHistoryProps> = ({
  onSelectAnalysis
}) => {
  const { data: analyses, isLoading, error } = useChatAnalysisHistory();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading analysis history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Failed to load analysis history</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat Analysis History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No saved analyses yet</p>
            <p className="text-sm">Start a conversation to see your analysis history here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Chat Analysis History
          <Badge variant="secondary">{analyses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onSelectAnalysis?.(analysis)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Chat Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prompt:</p>
                  <p className="text-sm">{truncateText(analysis.prompt_used)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Analysis:</p>
                  <p className="text-sm text-muted-foreground">
                    {truncateText(analysis.analysis_results.response)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="outline" className="text-xs">
                    Confidence: {Math.round((analysis.confidence_score || 0) * 100)}%
                  </Badge>
                  {analysis.analysis_results.attachments_processed && (
                    <Badge variant="outline" className="text-xs">
                      {analysis.analysis_results.attachments_processed} attachments
                    </Badge>
                  )}
                </div>
              </div>
              
              {onSelectAnalysis && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAnalysis(analysis);
                  }}
                >
                  View Full Analysis
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
