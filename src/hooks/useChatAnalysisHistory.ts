
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SavedChatAnalysis {
  id: string;
  user_id: string;
  prompt_used: string;
  prompt_template_used?: string;
  analysis_results: {
    response: string;
    attachments_processed?: number;
    upload_ids?: string[];
    debug_info?: any;
  };
  confidence_score: number;
  analysis_type: string;
  created_at: string;
}

export const useChatAnalysisHistory = () => {
  return useQuery({
    queryKey: ['chat-analysis-history'],
    queryFn: async (): Promise<SavedChatAnalysis[]> => {
      const { data, error } = await supabase
        .from('chat_analysis_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching chat analysis history:', error);
        throw error;
      }
      
      console.log('Fetched chat analysis history:', data?.length || 0);
      return data || [];
    }
  });
};
