
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, Clock, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AnalysisDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
}

export const AnalysisDetailModal: React.FC<AnalysisDetailModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  console.log('Modal props:', { isOpen, analysis: !!analysis });

  if (!analysis) {
    console.log('No analysis provided to modal');
    return null;
  }

  const getAnalysisIcon = () => {
    return analysis.type === 'chat' ? MessageSquare : FileText;
  };

  const getAnalysisResults = () => {
    if (analysis.type === 'chat') {
      return analysis.analysis_results?.response || 'No analysis results available';
    }
    return analysis.analysis_results?.response || analysis.analysis_results?.analysis || 'No analysis results available';
  };

  const getConfidenceScore = () => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    return analysis.impact_summary?.key_metrics?.overall_score * 10 || 85;
  };

  const Icon = getAnalysisIcon();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('Dialog onOpenChange:', open);
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {analysis.type === 'chat' ? 'Chat Analysis Details' : 'Design Analysis Details'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Analysis Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{analysis.displayTitle || analysis.title}</span>
                <Badge variant="default">
                  {getConfidenceScore()}% Confidence
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                  </span>
                </div>
                <Badge variant="outline">
                  {analysis.analysis_type || 'General Analysis'}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Analysis Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed bg-muted/30 p-4 rounded-lg">
                  {getAnalysisResults()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Used (for chat analyses) */}
          {analysis.type === 'chat' && analysis.prompt_used && (
            <Card>
              <CardHeader>
                <CardTitle>Prompt Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  {analysis.prompt_used}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions (if available) */}
          {analysis.suggestions && (
            <Card>
              <CardHeader>
                <CardTitle>Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-3 rounded-lg text-sm">
                  <pre className="whitespace-pre-wrap">
                    {typeof analysis.suggestions === 'string' 
                      ? analysis.suggestions 
                      : JSON.stringify(analysis.suggestions, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Impact Summary (for design analyses) */}
          {analysis.impact_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.impact_summary.key_metrics && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                        <p className="text-2xl font-bold">
                          {analysis.impact_summary.key_metrics.overall_score}/10
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {analysis.impact_summary.improvement_areas && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Improvement Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.impact_summary.improvement_areas.map((area: string, index: number) => (
                          <Badge key={index} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
