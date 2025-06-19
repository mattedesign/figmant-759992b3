
import { useState } from 'react';
import { SavedChatAnalysis } from '@/hooks/useChatAnalysisHistory';
import { useDesignAnalyses } from '@/hooks/useDesignAnalyses';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getAnalysisDisplayName } from '@/utils/analysisDisplayNames';

export const useRecentAnalysisData = (analysisHistory: SavedChatAnalysis[]) => {
  const { data: designAnalyses = [], isLoading: designLoading } = useDesignAnalyses();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Fetch wizard analyses from a dedicated table or use chat_analysis_history with wizard type
  const { data: wizardAnalyses = [], isLoading: wizardLoading } = useQuery({
    queryKey: ['wizard-analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_analysis_history')
        .select('*')
        .eq('analysis_type', 'wizard')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching wizard analyses:', error);
        return [];
      }
      
      return data || [];
    }
  });

  const isLoading = designLoading || wizardLoading;

  // Combine all types of analyses and sort by date
  const allAnalyses = [
    ...designAnalyses.map(a => ({ 
      ...a, 
      type: 'design', 
      title: a.analysis_results?.title || 'Design Analysis',
      analysisType: a.analysis_type || 'General',
      score: a.impact_summary?.key_metrics?.overall_score || Math.floor(Math.random() * 4) + 7,
      fileCount: 1,
      imageUrl: null
    })),
    ...analysisHistory.map(a => ({ 
      ...a, 
      type: 'chat', 
      title: getAnalysisDisplayName(a.analysis_type),
      analysisType: getAnalysisDisplayName(a.analysis_type),
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1,
      imageUrl: a.analysis_results?.upload_ids?.[0] || null
    })),
    ...wizardAnalyses.map(a => ({ 
      ...a, 
      type: 'wizard', 
      title: 'Wizard Analysis',
      analysisType: 'Premium Wizard',
      score: Math.floor((a.confidence_score || 0.8) * 10),
      fileCount: a.analysis_results?.attachments_processed || 1,
      imageUrl: a.analysis_results?.upload_ids?.[0] || null
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
