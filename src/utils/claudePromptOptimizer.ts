
import { supabase } from '@/integrations/supabase/client';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';

export interface PromptOptimizationContext {
  category: string;
  useCase?: string;
  businessDomain?: string;
  userGoals?: string;
  analysisType?: string;
}

export class ClaudePromptOptimizer {
  static async getBestPromptForContext(context: PromptOptimizationContext): Promise<string | null> {
    try {
      // First try to get the best performing prompt for the category
      const { data: bestPrompt, error } = await supabase.rpc('get_best_prompt_for_category', {
        category_name: context.category
      });

      if (error) {
        console.error('Error fetching best prompt:', error);
        return null;
      }

      if (bestPrompt && bestPrompt.length > 0) {
        return bestPrompt[0].original_prompt;
      }

      // Fallback to any prompt in the category
      const { data: fallbackPrompts, error: fallbackError } = await supabase
        .from('claude_prompt_examples')
        .select('original_prompt')
        .eq('category', context.category)
        .eq('is_active', true)
        .limit(1);

      if (fallbackError) {
        console.error('Error fetching fallback prompt:', fallbackError);
        return null;
      }

      return fallbackPrompts?.[0]?.original_prompt || null;
    } catch (error) {
      console.error('Error in getBestPromptForContext:', error);
      return null;
    }
  }

  static async optimizePromptWithVariables(
    basePrompt: string,
    variables: Record<string, any>
  ): Promise<string> {
    let optimizedPrompt = basePrompt;

    // Replace variables in the prompt
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      optimizedPrompt = optimizedPrompt.replace(new RegExp(placeholder, 'g'), String(value));
    });

    return optimizedPrompt;
  }

  static async trackPromptPerformance(
    exampleId: string | null,
    context: string,
    responseTime: number,
    tokensUsed: number,
    success: boolean
  ): Promise<void> {
    try {
      if (!exampleId) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('claude_prompt_analytics')
        .insert({
          example_id: exampleId,
          user_id: user.id,
          usage_context: context,
          response_time_ms: responseTime,
          tokens_used: tokensUsed,
          business_outcome_data: { success }
        });
    } catch (error) {
      console.error('Error tracking prompt performance:', error);
    }
  }

  static getCategoryForUseCase(useCase: string): string {
    const useCaseLower = useCase.toLowerCase();
    
    if (useCaseLower.includes('premium') || useCaseLower.includes('advanced') || useCaseLower.includes('enterprise')) {
      return 'premium';
    }
    if (useCaseLower.includes('ecommerce') || useCaseLower.includes('revenue') || useCaseLower.includes('conversion')) {
      return 'ecommerce_revenue';
    }
    if (useCaseLower.includes('competitor') || useCaseLower.includes('competitive')) {
      return 'competitor';
    }
    if (useCaseLower.includes('visual') || useCaseLower.includes('hierarchy') || useCaseLower.includes('layout')) {
      return 'visual_hierarchy';
    }
    if (useCaseLower.includes('copy') || useCaseLower.includes('messaging') || useCaseLower.includes('content')) {
      return 'copy_messaging';
    }
    if (useCaseLower.includes('a/b') || useCaseLower.includes('test') || useCaseLower.includes('experiment')) {
      return 'ab_testing';
    }
    if (useCaseLower.includes('master') || useCaseLower.includes('comprehensive') || useCaseLower.includes('complete')) {
      return 'master';
    }
    
    return 'general';
  }
}
