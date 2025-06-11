
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignUpload } from '@/types/design';

export const useDesignUploads = () => {
  return useQuery({
    queryKey: ['design-uploads'],
    queryFn: async (): Promise<DesignUpload[]> => {
      const { data, error } = await supabase
        .from('design_uploads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Type assertion to ensure the data matches our DesignUpload interface
      return (data || []) as DesignUpload[];
    }
  });
};
