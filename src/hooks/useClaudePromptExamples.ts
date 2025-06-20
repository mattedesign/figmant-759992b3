
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClaudePromptExample {
  id: string;
  title: string;
  display_name: string;
  description?: string;
  category: 'master' | 'competitor' | 'visual_hierarchy' | 'copy_messaging' | 'ecommerce_revenue' | 'ab_testing' | 'premium' | 'general';
  original_prompt: string;
  claude_response: string;
  effectiveness_rating?: number;
  use_case_context?: string;
  business_domain?: string;
  prompt_variables?: Record<string, any>;
  metadata?: Record<string, any>;
  is_template: boolean;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  credit_cost?: number;
}

export interface ClaudePromptVariation {
  id: string;
  base_example_id: string;
  variation_name: string;
  modified_prompt: string;
  test_status: 'draft' | 'active' | 'completed' | 'paused';
  success_metrics?: Record<string, any>;
  performance_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ClaudePromptAnalytics {
  id: string;
  example_id?: string;
  variation_id?: string;
  user_id?: string;
  usage_context: string;
  response_quality_score?: number;
  response_time_ms?: number;
  tokens_used?: number;
  user_feedback?: string;
  business_outcome_data?: Record<string, any>;
  created_at: string;
}

export const useClaudePromptExamples = () => {
  return useQuery({
    queryKey: ['claude-prompt-examples'],
    queryFn: async (): Promise<ClaudePromptExample[]> => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ClaudePromptExample[];
    }
  });
};

export const useClaudePromptExamplesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['claude-prompt-examples', category],
    queryFn: async (): Promise<ClaudePromptExample[]> => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false });
      
      if (error) throw error;
      return (data || []) as ClaudePromptExample[];
    },
    enabled: !!category
  });
};

export const useBestPromptForCategory = (category: string) => {
  return useQuery({
    queryKey: ['best-prompt', category],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_best_prompt_for_category', {
        category_name: category
      });
      
      if (error) throw error;
      return data[0] || null;
    },
    enabled: !!category
  });
};

export const useCreatePromptExample = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (example: Omit<ClaudePromptExample, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .insert(example)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-prompt-examples'] });
      toast({
        title: "Success",
        description: "Prompt example created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create prompt example",
        variant: "destructive",
      });
    }
  });
};

export const useUpdatePromptExample = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ClaudePromptExample> }) => {
      const { data, error } = await supabase
        .from('claude_prompt_examples')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claude-prompt-examples'] });
      toast({
        title: "Success",
        description: "Prompt template updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update prompt example",
        variant: "destructive",
      });
    }
  });
};

export const useTrackPromptUsage = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (analytics: Omit<ClaudePromptAnalytics, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('claude_prompt_analytics')
        .insert(analytics)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onError: (error: any) => {
      console.error('Failed to track prompt usage:', error);
      // Don't show toast for analytics tracking failures to avoid annoying users
    }
  });
};
