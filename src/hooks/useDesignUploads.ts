
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignUpload, AnalysisPreferences } from '@/types/design';

export const useDesignUploads = () => {
  return useQuery({
    queryKey: ['design-uploads'],
    queryFn: async (): Promise<DesignUpload[]> => {
      const { data, error } = await supabase
        .from('design_uploads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure analysis_preferences is properly typed
      return (data || []).map(upload => ({
        ...upload,
        analysis_preferences: upload.analysis_preferences ? 
          upload.analysis_preferences as unknown as AnalysisPreferences : null
      })) as DesignUpload[];
    }
  });
};
