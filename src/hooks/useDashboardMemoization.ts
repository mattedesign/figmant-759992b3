
import { useMemo, useCallback } from 'react';
import { AnalysisData, InsightData, PromptData, NoteData } from '@/components/figmant/pages/dashboard/types/dashboard';

interface MemoizedDashboardData {
  memoizedAnalysisData: AnalysisData[];
  memoizedInsightsData: InsightData[];
  memoizedPromptsData: PromptData[];
  memoizedNotesData: NoteData[];
  memoizedDataStats: {
    totalAnalyses: number;
    completedAnalyses: number;
    pendingAnalyses: number;
    totalPrompts: number;
    totalNotes: number;
  };
  memoizedChartData: any[];
  memoizedFilters: {
    statusFilter: string[];
    typeFilter: string[];
    dateFilter: string;
  };
}

export const useDashboardMemoization = (
  analysisData: AnalysisData[],
  insightsData: InsightData[],
  promptsData: PromptData[],
  notesData: NoteData[],
  dataStats: any
): MemoizedDashboardData => {

  // Memoize analysis data with deep comparison
  const memoizedAnalysisData = useMemo(() => {
    return analysisData.map(analysis => ({
      ...analysis,
      // Add computed properties for better performance
      progressColor: analysis.progress >= 100 ? 'green' : 
                    analysis.progress >= 50 ? 'yellow' : 'red',
      statusBadgeColor: analysis.status === 'Completed' ? 'green' :
                       analysis.status === 'In Progress' ? 'blue' : 'gray'
    }));
  }, [analysisData]);

  // Memoize insights data
  const memoizedInsightsData = useMemo(() => {
    return insightsData.map(insight => ({
      ...insight,
      // Add computed properties
      changeDirection: insight.change.startsWith('+') ? 'up' : 'down',
      changeValue: parseFloat(insight.change.replace(/[+%]/g, ''))
    }));
  }, [insightsData]);

  // Memoize prompts data with search indexing
  const memoizedPromptsData = useMemo(() => {
    return promptsData.map((prompt, index) => ({
      ...prompt,
      searchableText: `${prompt.title} ${prompt.subtitle}`.toLowerCase(),
      displayOrder: index
    }));
  }, [promptsData]);

  // Memoize notes data
  const memoizedNotesData = useMemo(() => {
    return notesData.map(note => ({
      ...note,
      itemCount: note.items.length,
      hasItems: note.items.length > 0
    }));
  }, [notesData]);

  // Memoize data statistics with additional computed values
  const memoizedDataStats = useMemo(() => {
    return {
      ...dataStats,
      completionRate: dataStats.totalAnalyses > 0 
        ? Math.round((dataStats.completedAnalyses / dataStats.totalAnalyses) * 100)
        : 0,
      pendingRate: dataStats.totalAnalyses > 0 
        ? Math.round((dataStats.pendingAnalyses / dataStats.totalAnalyses) * 100)
        : 0,
      activityScore: Math.min(100, (dataStats.totalPrompts + dataStats.totalNotes) * 5)
    };
  }, [dataStats]);

  // Memoize chart data for analytics
  const memoizedChartData = useMemo(() => {
    return [
      { name: 'Completed', value: memoizedDataStats.completedAnalyses, color: '#10B981' },
      { name: 'Pending', value: memoizedDataStats.pendingAnalyses, color: '#F59E0B' },
      { name: 'In Progress', value: Math.max(0, memoizedDataStats.totalAnalyses - memoizedDataStats.completedAnalyses - memoizedDataStats.pendingAnalyses), color: '#3B82F6' }
    ].filter(item => item.value > 0);
  }, [memoizedDataStats]);

  // Memoize available filters
  const memoizedFilters = useMemo(() => {
    const statusFilter = [...new Set(memoizedAnalysisData.map(a => a.status))];
    const typeFilter = [...new Set(memoizedAnalysisData.map(a => a.type))];
    const dateFilter = 'last_30_days'; // Default filter
    
    return {
      statusFilter,
      typeFilter,
      dateFilter
    };
  }, [memoizedAnalysisData]);

  return {
    memoizedAnalysisData,
    memoizedInsightsData,
    memoizedPromptsData,
    memoizedNotesData,
    memoizedDataStats,
    memoizedChartData,
    memoizedFilters
  };
};
