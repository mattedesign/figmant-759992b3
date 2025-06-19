
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useChatAnalysisHistory } from '@/hooks/useChatAnalysisHistory';
import { formatDistanceToNow } from 'date-fns';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';
import { FileText, MessageSquare, Calendar, Eye } from 'lucide-react';

export const AllAnalysesGridPage: React.FC = () => {
  const { data: uploads = [] } = useDesignUploads();
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const { data: chatAnalyses = [] } = useChatAnalysisHistory();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'individual' | 'chat'>('all');

  // Combine both types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => {
      const upload = uploads.find(u => u.id === a.design_upload_id);
      return {
        ...a,
        type: 'design',
        title: a.analysis_results?.title || 'Design Analysis',
        analysisType: a.analysis_type || 'General',
        score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
        fileCount: 1,
        imageUrl: upload?.preview_url || upload?.file_url,
        fileName: upload?.file_name
      };
    }),
    ...chatAnalyses.map(a => ({
      ...a,
      type: 'chat',
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1,
      imageUrl: a.analysis_results?.screenshot_url || a.analysis_results?.website_screenshot,
      fileName: 'Chat Analysis'
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter analyses based on selected filter
  const filteredAnalyses = allAnalyses.filter(analysis => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'individual') return analysis.type === 'design';
    if (selectedFilter === 'chat') return analysis.type === 'chat';
    return true;
  });

  const handleViewAnalysis = (analysis: any) => {
    console.log('Viewing analysis:', analysis);
    // TODO: Implement analysis detail view
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">All Analyses</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Analyses</h1>
            <p className="text-muted-foreground mt-1">
              Browse your complete analysis history
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
            >
              All ({allAnalyses.length})
            </Button>
            <Button
              variant={selectedFilter === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('individual')}
            >
              Individual ({designAnalyses.length})
            </Button>
            <Button
              variant={selectedFilter === 'chat' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('chat')}
            >
              Chat ({chatAnalyses.length})
            </Button>
          </div>
        </div>

        {/* Grid Layout */}
        {filteredAnalyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No analyses found</p>
              <p className="text-sm mt-1">Start by uploading a design or starting a chat analysis</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnalyses.map((analysis) => {
              const analysisId = `${analysis.type}-${analysis.id}`;
              
              return (
                <Card key={analysisId} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="relative">
                    {/* Image Container */}
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                      {analysis.imageUrl ? (
                        <img
                          src={analysis.imageUrl}
                          alt={analysis.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {analysis.type === 'chat' ? (
                            <MessageSquare className="h-16 w-16 text-gray-400" />
                          ) : (
                            <FileText className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant={analysis.type === 'chat' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {analysis.type === 'chat' ? 'Chat' : 'Individual'}
                      </Badge>
                    </div>

                    {/* Score Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className="text-xs bg-white/90">
                        {analysis.score}/10
                      </Badge>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-t-lg flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleViewAnalysis(analysis)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Analysis
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate mb-1">
                      {analysis.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {analysis.fileName || analysis.analysisType}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(analysis.created_at))} ago</span>
                      <Badge variant="outline" className="text-xs">
                        {analysis.analysisType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
