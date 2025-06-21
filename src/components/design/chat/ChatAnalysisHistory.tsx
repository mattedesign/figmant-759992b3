
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Clock, FileText } from 'lucide-react';
import { useChatAnalysisHistory, SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';
import { EnhancedAnalysisCard } from '@/components/figmant/analysis/EnhancedAnalysisCard';
import { AnalysisDetailModal } from '@/components/figmant/pages/dashboard/components/AnalysisDetailModal';

interface ChatAnalysisHistoryProps {
  onSelectAnalysis?: (analysis: SavedChatAnalysis) => void;
}

export const ChatAnalysisHistory: React.FC<ChatAnalysisHistoryProps> = ({
  onSelectAnalysis
}) => {
  const { data: analyses, isLoading, error } = useChatAnalysisHistory();
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedChatAnalysis | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (analysis: any) => {
    setSelectedAnalysis(analysis);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnalysis(null);
  };

  // Transform analyses to enhanced card format
  const transformedAnalyses = (analyses || []).map(analysis => ({
    ...analysis,
    type: 'chat',
    title: 'Chat Analysis',
    displayTitle: `Chat Analysis - ${analysis.analysis_type || 'General'}`,
    fileCount: analysis.analysis_results?.attachments_processed || 1,
    score: Math.round((analysis.confidence_score || 0.8) * 10)
  }));

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

  return (
    <>
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
            {transformedAnalyses.map((analysis) => (
              <EnhancedAnalysisCard
                key={analysis.id}
                analysis={analysis}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Detail Modal */}
      <AnalysisDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        analysis={selectedAnalysis}
      />
    </>
  );
};
