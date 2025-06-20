
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Analysis Performance Metrics (from real Claude API calls)
export const useAnalysisMetrics = () => {
  return useQuery({
    queryKey: ['analysis-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_upload_analytics')
        .select('analysis_success, processing_time_ms, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Chat Analysis History (real Claude responses)
export const useChatAnalysisData = () => {
  return useQuery({
    queryKey: ['chat-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_analysis_history')
        .select('analysis_results, confidence_score, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Design Analysis Results (real Claude insights)
export const useDesignAnalysisData = () => {
  return useQuery({
    queryKey: ['design-analysis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_analysis')
        .select('analysis_results, impact_summary, confidence_score, analysis_type')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
};

// Combined real data hook for dashboard
export const useRealDashboardData = () => {
  const analysisMetrics = useAnalysisMetrics();
  const chatAnalysis = useChatAnalysisData();
  const designAnalysis = useDesignAnalysisData();

  return {
    analysisMetrics: analysisMetrics.data || [],
    chatAnalysis: chatAnalysis.data || [],
    designAnalysis: designAnalysis.data || [],
    isLoading: analysisMetrics.isLoading || chatAnalysis.isLoading || designAnalysis.isLoading,
    error: analysisMetrics.error || chatAnalysis.error || designAnalysis.error
  };
};
