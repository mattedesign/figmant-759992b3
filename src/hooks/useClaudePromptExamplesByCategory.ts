
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClaudePromptExamplesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['claude-prompt-examples', category],
    queryFn: async () => {
      let query = supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      // If category is 'all', don't filter by category
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching claude prompt examples:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!category
  });
};
