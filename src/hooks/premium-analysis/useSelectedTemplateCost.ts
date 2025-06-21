
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSelectedTemplateCost = (selectedTemplateId: string | null) => {
  const { data: creditCost, isLoading } = useQuery({
    queryKey: ['selected-template-credit-cost', selectedTemplateId],
    queryFn: async () => {
      if (!selectedTemplateId) return 1; // Default cost
      
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('credit_cost')
        .eq('id', selectedTemplateId)
        .single();
      
      if (error) {
        console.error('Error fetching template credit cost:', error);
        return 3; // Fallback
      }
      
      return data.credit_cost || 3;
    },
    enabled: !!selectedTemplateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    creditCost: creditCost || 1,
    isLoading
  };
};
