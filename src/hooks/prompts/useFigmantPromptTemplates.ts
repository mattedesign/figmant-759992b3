
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FigmantPromptTemplate {
  id: string;
  title: string;
  displayName: string;
  description?: string;
  category: string;
  prompt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>; // Add metadata property
}

export const useFigmantPromptTemplates = () => {
  return useQuery({
    queryKey: ['figmant-prompt-templates'],
    queryFn: async (): Promise<FigmantPromptTemplate[]> => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching figmant prompt templates:', error);
        throw error;
      }
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        displayName: item.display_name || item.title,
        description: item.description,
        category: item.category,
        prompt: item.original_prompt,
        isActive: item.is_active,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        metadata: item.metadata && typeof item.metadata === 'object' && item.metadata !== null 
          ? item.metadata as Record<string, any>
          : {} // Default to empty object if metadata is not a valid object
      }));
    }
  });
};
