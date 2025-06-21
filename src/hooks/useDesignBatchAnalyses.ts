
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
      
      // Process batch analyses data - they should already have impact_summary from database
      const processedData = (data || []).map(analysis => {
        // If analysis doesn't have impact_summary for some reason, create a basic one
        if (!analysis.analysis_results) {
          return {
            ...analysis,
            analysis_results: { response: 'Analysis data not available' }
          };
        }
        return analysis;
      });
      
      return processedData as unknown as DesignBatchAnalysis[];
    },
    enabled: true // Always enabled to fetch all batch analyses
  });
};
