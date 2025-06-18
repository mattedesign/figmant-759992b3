
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardQueries = () => {
  // Fetch design uploads with analysis data
  const { 
    data: designUploads = [], 
    isLoading: isAnalysesLoading,
    error: analysesError,
    refetch: refetchAnalyses
  } = useQuery({
    queryKey: ['dashboard-design-uploads'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('design_uploads')
        .select(`
          *,
          design_analysis(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch activity logs for insights
  const { 
    data: activityLogs = [], 
    isLoading: isInsightsLoading,
    error: insightsError,
    refetch: refetchInsights
  } = useQuery({
    queryKey: ['dashboard-activity-logs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch chat analysis history for prompts
  const { 
    data: chatHistory = [], 
    isLoading: isPromptsLoading,
    error: promptsError,
    refetch: refetchPrompts
  } = useQuery({
    queryKey: ['dashboard-chat-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('chat_analysis_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user credits
  const { 
    data: userCredits,
    isLoading: isCreditsLoading
  } = useQuery({
    queryKey: ['dashboard-user-credits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user profile for processing
  const { data: user } = useQuery({
    queryKey: ['dashboard-user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  return {
    // Raw data
    designUploads,
    activityLogs,
    chatHistory,
    userCredits,
    user,
    
    // Loading states
    isAnalysesLoading,
    isInsightsLoading,
    isPromptsLoading,
    isCreditsLoading,
    
    // Errors
    analysesError,
    insightsError,
    promptsError,
    
    // Refetch functions
    refetchAnalyses,
    refetchInsights,
    refetchPrompts
  };
};
