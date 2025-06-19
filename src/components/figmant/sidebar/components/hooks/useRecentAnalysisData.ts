
import { useState } from 'react';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';

export const useRecentAnalysisData = (analysisHistory: SavedChatAnalysis[]) => {
  const { data: designAnalyses = [], isLoading } = useDesignAnalyses();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Enhanced data mapping with attachment restoration
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1,
      imageUrl: null,
      impact_summary: a.impact_summary,
      analysis_content: a.analysis_results,
      // Add attachment metadata for restoration
      attachmentInfo: {
        hasDesignFile: true,
        designFileName: a.analysis_results?.title || 'Design File',
        attachmentCount: 1
      }
    })),
    ...analysisHistory.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || (a.analysis_results?.upload_ids?.length || 0),
      imageUrl: null,
      attachments: a.analysis_results?.upload_ids || [],
      prompt_preview: a.prompt_used?.substring(0, 100) + (a.prompt_used?.length > 100 ? '...' : ''),
      analysis_content: a.analysis_results,
      // Add attachment metadata for restoration
      attachmentInfo: {
        hasAttachments: !!(a.analysis_results?.upload_ids?.length > 0),
        attachmentCount: a.analysis_results?.upload_ids?.length || 0,
        urlAttachments: a.analysis_results?.upload_ids?.filter((id: string) => 
          id.startsWith('http://') || id.startsWith('https://')
        ) || [],
        fileAttachments: a.analysis_results?.upload_ids?.filter((id: string) => 
          !id.startsWith('http://') && !id.startsWith('https://')
        ) || []
      }
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
