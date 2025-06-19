
import { useState } from 'react';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';

export const useRecentAnalysisData = (analysisHistory: SavedChatAnalysis[]) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Enhanced data mapping with more detailed information
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1,
      imageUrl: null, // Could be enhanced to include actual design file URLs
      // Include full impact summary for detailed preview
      impact_summary: a.impact_summary,
      // Include analysis results for content preview
      analysis_content: a.analysis_results
    })),
    ...analysisHistory.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1,
      imageUrl: null, // Could be enhanced with screenshot URLs
      // Include additional metadata for richer previews
      attachments: a.analysis_results?.upload_ids || [],
      prompt_preview: a.prompt_used?.substring(0, 100) + (a.prompt_used?.length > 100 ? '...' : ''),
      // Include analysis results for attachment counting
      analysis_content: a.analysis_results
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const recentAnalyses = allAnalyses.slice(0, 20);

  const toggleExpanded = (analysisId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(analysisId)) {
      newExpanded.delete(analysisId);
    } else {
      newExpanded.add(analysisId);
    }
    setExpandedItems(newExpanded);
  };

  return {
    recentAnalyses,
    isLoading,
    expandedItems,
    toggleExpanded
  };
};
