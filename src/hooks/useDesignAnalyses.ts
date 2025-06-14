
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignAnalysis } from '@/types/design';

export const useDesignAnalyses = (uploadId?: string) => {
  return useQuery({
    queryKey: ['design-analyses', uploadId],
    queryFn: async (): Promise<DesignAnalysis[]> => {
      let query = supabase.from('design_analysis').select('*');
      
      if (uploadId) {
        query = query.eq('design_upload_id', uploadId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching design analyses:', error);
        throw error;
      }
      
      console.log('Fetched design analyses:', data?.length || 0);
      return (data || []) as unknown as DesignAnalysis[];
    },
    enabled: uploadId ? !!uploadId : true // Always enabled if no uploadId, enabled only if uploadId exists when provided
  });
};
