
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
      
      if (error) throw error;
      return (data || []) as DesignAnalysis[];
    },
    enabled: !!uploadId
  });
};
