
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

  // Helper function to safely get nested properties
  const safeGet = (obj: any, path: string, defaultValue: any = null) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  };

  // Enhanced data transformation with better error handling and logging
  const transformAnalysisData = () => {
    console.log('🔍 Transforming analysis data:', {
      designAnalysesCount: designAnalyses.length,
      chatAnalysesCount: analysisHistory.length,
      wizardAnalysesCount: wizardAnalyses.length
    });

    const transformedDesignAnalyses = designAnalyses.map(a => {
      const transformed = {
        ...a, 
        type: 'design', 
        title: safeGet(a, 'analysis_results.title', 'Design Analysis'),
        displayTitle: safeGet(a, 'analysis_results.title', 'Design Analysis'),
        analysisType: a.analysis_type || 'General Design Analysis',
        score: safeGet(a, 'impact_summary.key_metrics.overall_score', Math.floor(Math.random() * 4) + 7),
        fileCount: 1,
        imageUrl: null,
        status: 'completed',
        confidence_score: a.confidence_score || 0.8
      };
      
      console.log('🔍 Transformed design analysis:', {
        id: transformed.id,
        title: transformed.title,
        analysisType: transformed.analysisType,
        score: transformed.score
      });
      
      return transformed;
    });

    const transformedChatAnalyses = analysisHistory.map(a => {
      const analysisTypeName = getAnalysisDisplayName(a.analysis_type);
      const transformed = {
        ...a, 
        type: 'chat', 
        title: analysisTypeName,
        displayTitle: analysisTypeName,
        analysisType: analysisTypeName,
        score: Math.floor((a.confidence_score || 0.8) * 10),
        fileCount: safeGet(a, 'analysis_results.attachments_processed', 1),
        imageUrl: safeGet(a, 'analysis_results.upload_ids.0', null),
        status: 'completed'
      };
      
      console.log('🔍 Transformed chat analysis:', {
        id: transformed.id,
        title: transformed.title,
        analysisType: transformed.analysisType,
        score: transformed.score,
        originalType: a.analysis_type
      });
      
      return transformed;
    });

    const transformedWizardAnalyses = wizardAnalyses.map(a => {
      const transformed = {
        ...a, 
        type: 'wizard', 
        title: 'Premium Wizard Analysis',
        displayTitle: 'Premium Wizard Analysis',
        analysisType: 'Premium Wizard',
        score: Math.floor((a.confidence_score || 0.8) * 10),
        fileCount: safeGet(a, 'analysis_results.attachments_processed', 1),
        imageUrl: safeGet(a, 'analysis_results.upload_ids.0', null),
        status: 'completed'
      };
      
      console.log('🔍 Transformed wizard analysis:', {
        id: transformed.id,
        title: transformed.title,
        analysisType: transformed.analysisType,
        score: transformed.score
      });
      
      return transformed;
    });

    return [
      ...transformedDesignAnalyses,
      ...transformedChatAnalyses,
      ...transformedWizardAnalyses
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const recentAnalyses = transformAnalysisData().slice(0, 20);

  console.log('🔍 Final recent analyses:', {
    totalCount: recentAnalyses.length,
    types: recentAnalyses.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  const toggleExpanded = (analysisId: string) => {
    console.log('🔍 Toggling expanded state for analysis:', analysisId);
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
