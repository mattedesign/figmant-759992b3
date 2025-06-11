
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignUseCase } from '@/types/design';

export const useDesignUseCases = () => {
  return useQuery({
    queryKey: ['design-use-cases'],
    queryFn: async (): Promise<DesignUseCase[]> => {
      const { data, error } = await supabase
        .from('design_use_cases')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return (data || []) as DesignUseCase[];
    }
  });
};
