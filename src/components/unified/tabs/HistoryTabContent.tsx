
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  Clock, 
  FileText, 
  MessageSquare,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';

interface HistoryTabContentProps {
  analysis: any;
  analysisType: string;
}

export const HistoryTabContent: React.FC<HistoryTabContentProps> = ({
  analysis,
  analysisType
}) => {
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const { data: designAnalyses = [] } = useDesignAnalyses();

  // Combine all analyses and filter out current one
  const allAnalyses = [
    ...chatAnalyses.map(a => ({ ...a, type: 'chat' })),
    ...designAnalyses.map(a => ({ ...a, type: 'design' }))
  ]
    .filter(a => a.id !== analysis.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 10);
  
  // Get related analyses (same type or similar keywords)
  const getRelatedAnalyses = () => {
    const currentTitle = analysis.title || analysis.analysis_results?.title || '';
    const currentSummary = analysis.analysis_results?.response || '';
    const searchText = (currentTitle + ' ' + currentSummary).toLowerCase();
    
    return allAnalyses
      .filter(a => {
        if (a.type === analysisType) return true;
        
        const aTitle = (a.title || a.analysis_results?.title || '').toLowerCase();
        const aSummary = (a.analysis_results?.response || '').toLowerCase();
        const aText = aTitle + ' ' + aSummary;
        
        // Simple keyword matching
        const keywords = searchText.split(' ').filter(word => word.length > 3);
        return keywords.some(keyword => aText.includes(keyword));
      })
      .slice(0, 5);
  };

  const relatedAnalyses = getRelatedAnalyses();

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return MessageSquare;
      default:
        return FileText;
    }
  };

  const getAnalysisTitle = (analysisItem: any) => {
    if (analysisItem.title) return analysisItem.title;
    if (analysisItem.analysis_results?.title) return analysisItem.analysis_results.title;
    return `${analysisItem.type} Analysis`;
  };

  const getAnalysisSummary = (analysisItem: any) => {
    if (analysisItem.analysis_results?.response) {
      return analysisItem.analysis_results.response.substring(0, 150) + '...';
    }
    if (analysisItem.analysis_results?.summary) {
      return analysisItem.analysis_results.summary.substring(0, 150) + '...';
    }
    return 'Analysis completed';
  };

  const handleOpenAnalysis = (analysisItem: any) => {
    // This would typically open the analysis in a new modal or navigate to it
    console.log('Opening analysis:', analysisItem);
  };

  if (allAnalyses.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis History</h3>
          <p className="text-gray-500">This is your first analysis. Future analyses will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Analysis Timeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{allAnalyses.length}</div>
              <div className="text-sm text-gray-500">Total Analyses</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {allAnalyses.filter(a => a.type === 'chat').length}
              </div>
              <div className="text-sm text-gray-500">Chat Analyses</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {allAnalyses.filter(a => a.type === 'design').length}
              </div>
              <div className="text-sm text-gray-500">Design Analyses</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {allAnalyses.filter(a => 
                  new Date(a.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-gray-500">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Analyses */}
      {relatedAnalyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Related Analyses
              <Badge variant="outline">{relatedAnalyses.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relatedAnalyses.map((relatedAnalysis) => {
                const Icon = getAnalysisIcon(relatedAnalysis.type);
                return (
                  <div
                    key={`${relatedAnalysis.type}-${relatedAnalysis.id}`}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {getAnalysisTitle(relatedAnalysis)}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {relatedAnalysis.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {getAnalysisSummary(relatedAnalysis)}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(relatedAnalysis.created_at), { addSuffix: true })}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleOpenAnalysis(relatedAnalysis)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent Analysis History
            <Badge variant="outline">{recentAnalyses.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentAnalyses.map((historyAnalysis) => {
              const Icon = getAnalysisIcon(historyAnalysis.type);
              return (
                <div
                  key={`${historyAnalysis.type}-${historyAnalysis.id}`}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {getAnalysisTitle(historyAnalysis)}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {historyAnalysis.type}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {getAnalysisSummary(historyAnalysis)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(historyAnalysis.created_at), { addSuffix: true })}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleOpenAnalysis(historyAnalysis)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
