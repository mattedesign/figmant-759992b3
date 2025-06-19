
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { FileText, MessageSquare, Calendar, User, Target, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalysisDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
}

export const AnalysisDetailDrawer: React.FC<AnalysisDetailDrawerProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  const navigate = useNavigate();

  if (!analysis) return null;

  const handleOpenInChat = () => {
    if (analysis.type === 'chat') {
      // Navigate to chat page with the historical analysis loaded
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else {
      // For design analysis, navigate to wizard with historical context
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    }
    onClose();
  };

  const getAnalysisPreview = () => {
    if (analysis.type === 'chat') {
      return analysis.prompt_used || 'Chat analysis';
    }
    return analysis.analysis_results?.analysis || 'Design analysis';
  };

  const getAnalysisResponse = () => {
    if (analysis.type === 'chat') {
      return analysis.analysis_results?.response || 'No response available';
    }
    return analysis.analysis_results?.summary || 'Analysis completed';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3">
          <div className="flex items-center gap-2">
            {analysis.type === 'chat' ? (
              <MessageSquare className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-green-600" />
            )}
            <SheetTitle>
              {analysis.title || (analysis.type === 'chat' ? 'Chat Analysis' : 'Design Analysis')}
            </SheetTitle>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {analysis.type === 'chat' ? 'Chat Analysis' : 'Design Analysis'}
            </Badge>
            {analysis.analysisType && (
              <Badge variant="secondary">
                {analysis.analysisType}
              </Badge>
            )}
            {analysis.score && (
              <Badge variant="default">
                Score: {analysis.score}/10
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Analysis Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Confidence: {Math.round((analysis.confidence_score || 0.8) * 100)}%
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Files processed: {analysis.fileCount || 1}
            </div>
          </div>

          {/* Analysis Content */}
          <div className="space-y-4">
            {analysis.type === 'chat' && (
              <div>
                <h4 className="font-semibold mb-2">Original Prompt</h4>
                <div className="bg-muted p-3 rounded-lg text-sm">
                  {analysis.prompt_used}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">
                {analysis.type === 'chat' ? 'AI Response' : 'Analysis Summary'}
              </h4>
              <div className="bg-muted p-3 rounded-lg text-sm max-h-64 overflow-y-auto">
                {getAnalysisResponse()}
              </div>
            </div>

            {/* Key Metrics if available */}
            {analysis.impact_summary?.key_metrics && (
              <div>
                <h4 className="font-semibold mb-2">Key Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(analysis.impact_summary.key_metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-muted rounded">
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleOpenInChat}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {analysis.type === 'chat' ? 'Continue in Chat' : 'Open in Analysis Wizard'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
