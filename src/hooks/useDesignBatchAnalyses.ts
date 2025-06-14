
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignBatchAnalysis } from '@/types/design';

export const useDesignBatchAnalyses = (batchId?: string) => {
  return useQuery({
    queryKey: ['design-batch-analyses', batchId],
    queryFn: async (): Promise<DesignBatchAnalysis[]> => {
      let query = supabase.from('design_batch_analysis').select('*');
      
      if (batchId) {
        query = query.eq('batch_id', batchId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching batch analyses:', error);
        throw error;
      }
      
      console.log('Fetched batch analyses:', data?.length || 0);
      return (data || []) as unknown as DesignBatchAnalysis[];
    },
    enabled: true // Always enabled to fetch all batch analyses
  });
};
