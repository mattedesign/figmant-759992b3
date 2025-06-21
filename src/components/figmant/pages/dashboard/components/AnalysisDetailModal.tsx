
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, MessageSquare, Sparkles, ExternalLink, User, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  if (!analysis) {
    console.log('🔍 AnalysisDetailModal: No analysis provided');
    return null;
  }

  console.log('🔍 AnalysisDetailModal: Rendering modal for analysis:', {
    id: analysis.id,
    type: analysis.type,
    title: analysis.title || analysis.displayTitle
  });

  const getAnalysisIcon = () => {
    if (analysis.type === 'chat') return MessageSquare;
    if (analysis.type === 'wizard') return Sparkles;
    return FileText;
  };

  const getAnalysisTitle = () => {
    return analysis.displayTitle || analysis.title || 'Analysis';
  };

  const getAnalysisResponse = () => {
    if (analysis.type === 'chat') {
      return analysis.analysis_results?.response || 'No response available';
    }
    
    if (analysis.type === 'design') {
      return analysis.analysis_results?.summary || analysis.analysis_results?.analysis || 'Analysis completed';
    }
    
    if (analysis.type === 'wizard') {
      return analysis.analysis_results?.response || 'Wizard analysis completed';
    }
    
    return 'Analysis completed';
  };

  const getConfidenceScore = () => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    if (analysis.score) {
      return analysis.score * 10;
    }
    return 85;
  };

  const handleContinueAnalysis = () => {
    console.log('🔍 AnalysisDetailModal: Continue analysis clicked:', {
      analysisType: analysis.type,
      analysisId: analysis.id
    });

    if (analysis.type === 'chat') {
      // Navigate to chat page with the historical analysis loaded
      navigate('/figmant', { 
        state: { 
          activeSection: 'chat',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else if (analysis.type === 'wizard') {
      // Navigate to wizard/premium analysis
      navigate('/figmant', { 
        state: { 
          activeSection: 'wizard',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    } else {
      // For design analysis, navigate to analysis page
      navigate('/figmant', { 
        state: { 
          activeSection: 'analysis',
          loadHistoricalAnalysis: analysis.id,
          historicalData: analysis
        } 
      });
    }
    onClose();
  };

  const Icon = getAnalysisIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-blue-600" />
            <DialogTitle>
              {getAnalysisTitle()}
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {analysis.type === 'chat' ? 'Chat Analysis' : 
               analysis.type === 'wizard' ? 'Premium Wizard' : 
               'Design Analysis'}
            </Badge>
            {analysis.analysisType && (
              <Badge variant="secondary">
                {analysis.analysisType}
              </Badge>
            )}
            <Badge variant="default">
              Score: {getConfidenceScore()}%
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Analysis Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Created {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Confidence: {getConfidenceScore()}%
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Files processed: {analysis.fileCount || 1}
            </div>
          </div>

          {/* Original Prompt for Chat Analysis */}
          {analysis.type === 'chat' && analysis.prompt_used && (
            <div>
              <h4 className="font-semibold mb-2">Original Prompt</h4>
              <div className="bg-muted p-3 rounded-lg text-sm">
                {analysis.prompt_used}
              </div>
            </div>
          )}

          {/* Analysis Content */}
          <div>
            <h4 className="font-semibold mb-2">
              {analysis.type === 'chat' ? 'AI Response' : 'Analysis Results'}
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

          {/* Action Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handleContinueAnalysis}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {analysis.type === 'chat' ? 'Continue in Chat' : 
               analysis.type === 'wizard' ? 'Open in Wizard' :
               'View in Analysis'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
