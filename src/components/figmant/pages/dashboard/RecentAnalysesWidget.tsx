
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, MessageSquare, Eye } from 'lucide-react';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { AnalysisDetailModal } from './components/AnalysisDetailModal';
import { formatDistanceToNow } from 'date-fns';

export const RecentAnalysesWidget: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const { data: designAnalyses = [] } = useDesignAnalyses();

  // Combine and sort recent analyses
  const recentAnalyses = [
    ...chatAnalyses.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: 'Chat Analysis',
      displayTitle: `Chat Analysis - ${a.analysis_type || 'General'}`
    })),
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: 'Design Analysis',
      displayTitle: `Design Analysis - ${a.analysis_type || 'General'}`
    }))
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  const handleAnalysisClick = (analysis: any) => {
    console.log('Opening analysis modal:', analysis);
    setSelectedAnalysis(analysis);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnalysis(null);
  };

  const getAnalysisIcon = (type: string) => {
    return type === 'chat' ? MessageSquare : FileText;
  };

  const getConfidenceScore = (analysis: any) => {
    if (analysis.confidence_score) {
      return Math.round(analysis.confidence_score * 100);
    }
    return analysis.impact_summary?.key_metrics?.overall_score * 10 || 85;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Analyses</span>
            <Badge variant="outline">{recentAnalyses.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAnalyses.length > 0 ? (
              recentAnalyses.map((analysis) => {
                const Icon = getAnalysisIcon(analysis.type);
                return (
                  <div
                    key={`${analysis.type}-${analysis.id}`}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleAnalysisClick(analysis)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {analysis.displayTitle}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {getConfidenceScore(analysis)}% Confidence
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  No analyses available yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start analyzing designs to see them here
                </p>
              </div>
            )}
            
            {recentAnalyses.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full">
                View All Analyses
              </Button>
            )}
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
