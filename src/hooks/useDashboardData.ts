
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Hook for recent design analyses
export const useDashboardAnalyses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-analyses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('design_uploads')
        .select(`
          id,
          file_name,
          status,
          use_case,
          created_at,
          design_analysis(
            analysis_type,
            confidence_score,
            suggestions
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook for user insights/activity
export const useDashboardInsights = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get user activity data
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('activity_type, created_at, metadata')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook for recent prompts/templates
export const useDashboardPrompts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-prompts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_analysis_history')
        .select('id, prompt_used, prompt_template_used, created_at, analysis_type')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id
  });
};

// Hook for user notes (we'll need to create this table later or use existing data)
export const useDashboardNotes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['dashboard-notes', user?.id],
    queryFn: async () => {
      // For now, return empty array - we can implement notes later
      return [];
    },
    enabled: !!user?.id
  });
};
