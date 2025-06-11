
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsSummary {
  total_users: number;
  active_users: number;
  total_uploads: number;
  total_analyses: number;
  avg_response_time: number;
  total_tokens_used: number;
  total_cost: number;
  success_rate: number;
}

export const useAnalyticsSummary = (daysBack: number = 30) => {
  return useQuery({
    queryKey: ['analytics-summary', daysBack],
    queryFn: async (): Promise<AnalyticsSummary> => {
      const { data, error } = await supabase.rpc('get_analytics_summary', {
        days_back: daysBack
      });
      
      if (error) throw error;
      
      return data[0] || {
        total_users: 0,
        active_users: 0,
        total_uploads: 0,
        total_analyses: 0,
        avg_response_time: 0,
        total_tokens_used: 0,
        total_cost: 0,
        success_rate: 0
      };
    }
  });
};

export const useUserActivityLogs = (limit: number = 100) => {
  return useQuery({
    queryKey: ['user-activity-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useLogUserActivity = () => {
  return useMutation({
    mutationFn: async (activity: {
      activity_type: string;
      page_path?: string;
      session_duration_seconds?: number;
      metadata?: any;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('log_user_activity', {
        p_user_id: user.id,
        p_activity_type: activity.activity_type,
        p_page_path: activity.page_path,
        p_session_duration_seconds: activity.session_duration_seconds,
        p_metadata: activity.metadata
      });

      if (error) throw error;
      return data;
    }
  });
};

export const useDesignUploadAnalytics = () => {
  return useQuery({
    queryKey: ['design-upload-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_upload_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });
};

export const useSystemMetrics = () => {
  return useQuery({
    queryKey: ['system-performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });
};
