
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SavedChatAnalysis {
  id: string;
  analysis_type: string;
  prompt_used: string;
  analysis_results: {
    response: string;
    attachments_processed?: number;
    chat_context?: {
      message: string;
      attachments_count: number;
      upload_ids: string[];
    };
  };
  confidence_score: number;
  created_at: string;
  design_upload_id?: string;
}

export const useChatAnalysisHistory = () => {
  return useQuery({
    queryKey: ['chat-analysis-history'],
    queryFn: async (): Promise<SavedChatAnalysis[]> => {
      console.log('Fetching chat analysis history...');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('design_analysis')
        .select('*')
        .eq('user_id', user.id)
        .eq('analysis_type', 'chat_analysis')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching chat analysis history:', error);
        throw error;
      }

      console.log('Fetched chat analysis history:', data?.length || 0, 'records');
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetChatAnalysis = (analysisId: string) => {
  return useQuery({
    queryKey: ['chat-analysis', analysisId],
    queryFn: async (): Promise<SavedChatAnalysis | null> => {
      if (!analysisId) return null;
      
      console.log('Fetching specific chat analysis:', analysisId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('design_analysis')
        .select('*')
        .eq('id', analysisId)
        .eq('user_id', user.id)
        .eq('analysis_type', 'chat_analysis')
        .single();

      if (error) {
        console.error('Error fetching chat analysis:', error);
        throw error;
      }

      console.log('Fetched specific chat analysis:', data?.id);
      return data;
    },
    enabled: !!analysisId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
