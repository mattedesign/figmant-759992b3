
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClaudePromptExamplesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['claude-prompt-examples', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching claude prompt examples:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!category
  });
};
