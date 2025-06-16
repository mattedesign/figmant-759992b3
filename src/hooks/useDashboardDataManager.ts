
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useDashboardAnalyses, 
  useDashboardInsights, 
  useDashboardPrompts, 
  useDashboardNotes 
} from '@/hooks/useDashboardData';
import { useDashboardDataProcessor } from './useDashboardDataProcessor';

interface DashboardDataState {
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  lastUpdated: Date | null;
}

export const useDashboardDataManager = () => {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardDataState>({
    isLoading: false,
    isRefreshing: false,
    error: null,
    lastUpdated: null
  });

  // Fetch data with enhanced error handling
  const { 
    data: rawAnalysisData = [], 
    isLoading: analysisLoading, 
    error: analysisError,
    refetch: refetchAnalysis 
  } = useDashboardAnalyses();
  
  const { 
    data: rawInsightsData = [], 
    isLoading: insightsLoading, 
    error: insightsError,
    refetch: refetchInsights 
  } = useDashboardInsights();
  
  const { 
    data: rawPromptsData = [], 
    isLoading: promptsLoading, 
    error: promptsError,
    refetch: refetchPrompts 
  } = useDashboardPrompts();
  
  const { 
    data: rawNotesData = [], 
    isLoading: notesLoading, 
    error: notesError,
    refetch: refetchNotes 
  } = useDashboardNotes();

  // Process the data
  const processedData = useDashboardDataProcessor(
    rawAnalysisData,
    rawInsightsData,
    rawPromptsData,
    rawNotesData,
    user
  );

  // Aggregate loading and error states
  const isLoading = analysisLoading || insightsLoading || promptsLoading || notesLoading;
  const error = analysisError || insightsError || promptsError || notesError;

  // Enhanced refresh function
  const refreshAllData = useCallback(async () => {
    setState(prev => ({ ...prev, isRefreshing: true, error: null }));
    
    try {
      await Promise.all([
        refetchAnalysis(),
        refetchInsights(),
        refetchPrompts(),
        refetchNotes()
      ]);
      
      setState(prev => ({ 
        ...prev, 
        isRefreshing: false, 
        lastUpdated: new Date(),
        error: null
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isRefreshing: false,
        error: err as Error
      }));
    }
  }, [refetchAnalysis, refetchInsights, refetchPrompts, refetchNotes]);

  // Section-specific refresh functions
  const refreshAnalyses = useCallback(async () => {
    try {
      await refetchAnalysis();
    } catch (err) {
      console.error('Failed to refresh analyses:', err);
    }
  }, [refetchAnalysis]);

  const refreshInsights = useCallback(async () => {
    try {
      await refetchInsights();
    } catch (err) {
      console.error('Failed to refresh insights:', err);
    }
  }, [refetchInsights]);

  const refreshPrompts = useCallback(async () => {
    try {
      await refetchPrompts();
    } catch (err) {
      console.error('Failed to refresh prompts:', err);
    }
  }, [refetchPrompts]);

  const refreshNotes = useCallback(async () => {
    try {
      await refetchNotes();
    } catch (err) {
      console.error('Failed to refresh notes:', err);
    }
  }, [refetchNotes]);

  return {
    // Processed data
    ...processedData,
    
    // State management
    isLoading: isLoading || state.isLoading,
    isRefreshing: state.isRefreshing,
    error: error || state.error,
    lastUpdated: state.lastUpdated,
    
    // Refresh functions
    refreshAllData,
    refreshAnalyses,
    refreshInsights,
    refreshPrompts,
    refreshNotes,
    
    // Individual loading states for granular control
    loadingStates: {
      analyses: analysisLoading,
      insights: insightsLoading,
      prompts: promptsLoading,
      notes: notesLoading
    },
    
    // Individual error states
    errorStates: {
      analyses: analysisError,
      insights: insightsError,
      prompts: promptsError,
      notes: notesError
    }
  };
};
