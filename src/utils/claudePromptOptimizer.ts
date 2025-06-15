import { supabase } from '@/integrations/supabase/client';
import { ClaudePromptExample } from '@/hooks/useClaudePromptExamples';
import { ContentAnalyzer, UserInput, ContentAnalysis } from './contentAnalyzer';

export interface PromptOptimizationContext {
  category: string;
  useCase?: string;
  businessDomain?: string;
  userGoals?: string;
  analysisType?: string;
  contentAnalysis?: ContentAnalysis;
}

export interface IntelligentPromptSelection {
  selectedPrompt: string | null;
  category: string;
  analysisType: string;
  confidence: number;
  reasoning: string;
  fallbackUsed: boolean;
}

export class ClaudePromptOptimizer {
  static async getOptimalPromptForUserInput(input: UserInput): Promise<IntelligentPromptSelection> {
    try {
      console.log('=== INTELLIGENT PROMPT SELECTION ===');
      console.log('Analyzing user input:', {
        messageLength: input.message.length,
        attachmentCount: input.attachments?.length || 0
      });

      // Analyze the content to understand intent
      const contentAnalysis = ContentAnalyzer.analyzeContent(input);
      
      console.log('Content analysis result:', {
        suggestedCategory: contentAnalysis.suggestedCategory,
        suggestedAnalysisType: contentAnalysis.suggestedAnalysisType,
        confidence: contentAnalysis.confidenceScore,
        keywords: contentAnalysis.textKeywords,
        imageTypes: contentAnalysis.imageTypes
      });

      // Try to get the best prompt for the suggested category
      let selectedPrompt = await this.getBestPromptForCategory(contentAnalysis.suggestedCategory);
      let fallbackUsed = false;
      let finalCategory = contentAnalysis.suggestedCategory;

      // If no prompt found for suggested category, try fallback strategies
      if (!selectedPrompt) {
        console.log('No prompt found for suggested category, trying fallbacks...');
        
        // Fallback 1: Try 'master' category for comprehensive analysis
        if (contentAnalysis.analysisIntent === 'analysis' || contentAnalysis.confidenceScore < 0.5) {
          selectedPrompt = await this.getBestPromptForCategory('master');
          if (selectedPrompt) {
            finalCategory = 'master';
            fallbackUsed = true;
          }
        }
        
        // Fallback 2: Try 'general' category
        if (!selectedPrompt) {
          selectedPrompt = await this.getBestPromptForCategory('general');
          if (selectedPrompt) {
            finalCategory = 'general';
            fallbackUsed = true;
          }
        }

        // Fallback 3: Use any available active prompt
        if (!selectedPrompt) {
          selectedPrompt = await this.getAnyActivePrompt();
          if (selectedPrompt) {
            finalCategory = 'general';
            fallbackUsed = true;
          }
        }
      }

      // Generate reasoning for the selection
      const reasoning = this.generateSelectionReasoning(
        contentAnalysis, 
        finalCategory, 
        fallbackUsed
      );

      const result: IntelligentPromptSelection = {
        selectedPrompt,
        category: finalCategory,
        analysisType: contentAnalysis.suggestedAnalysisType,
        confidence: contentAnalysis.confidenceScore,
        reasoning,
        fallbackUsed
      };

      console.log('Prompt selection complete:', {
        hasPrompt: !!selectedPrompt,
        category: finalCategory,
        fallbackUsed,
        confidence: contentAnalysis.confidenceScore
      });
      
      console.log('=== SELECTION COMPLETE ===');
      return result;

    } catch (error) {
      console.error('Error in intelligent prompt selection:', error);
      
      // Return safe fallback
      return {
        selectedPrompt: null,
        category: 'general',
        analysisType: 'usability',
        confidence: 0.1,
        reasoning: 'Error occurred during analysis, using safe defaults',
        fallbackUsed: true
      };
    }
  }

  static async getBestPromptForCategory(category: string): Promise<string | null> {
    try {
      // First try to get the best performing prompt for the category
      const { data: bestPrompt, error } = await supabase.rpc('get_best_prompt_for_category', {
        category_name: category
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
        .eq('category', category)
        .eq('is_active', true)
        .limit(1);

      if (fallbackError) {
        console.error('Error fetching fallback prompt:', fallbackError);
        return null;
      }

      return fallbackPrompts?.[0]?.original_prompt || null;
    } catch (error) {
      console.error('Error in getBestPromptForCategory:', error);
      return null;
    }
  }

  private static async getAnyActivePrompt(): Promise<string | null> {
    try {
      const { data: prompts, error } = await supabase
        .from('claude_prompt_examples')
        .select('original_prompt')
        .eq('is_active', true)
        .order('effectiveness_rating', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching any active prompt:', error);
        return null;
      }

      return prompts?.[0]?.original_prompt || null;
    } catch (error) {
      console.error('Error in getAnyActivePrompt:', error);
      return null;
    }
  }

  private static generateSelectionReasoning(
    analysis: ContentAnalysis,
    selectedCategory: string,
    fallbackUsed: boolean
  ): string {
    const reasons: string[] = [];

    if (fallbackUsed) {
      reasons.push('Used fallback prompt selection');
    } else {
      reasons.push(`Selected based on content analysis (${Math.round(analysis.confidenceScore * 100)}% confidence)`);
    }

    if (analysis.textKeywords.length > 0) {
      reasons.push(`Detected keywords: ${analysis.textKeywords.slice(0, 3).join(', ')}`);
    }

    if (analysis.imageTypes.length > 0) {
      reasons.push(`Image types detected: ${analysis.imageTypes.join(', ')}`);
    }

    reasons.push(`Analysis intent: ${analysis.analysisIntent}`);
    reasons.push(`Category: ${selectedCategory}`);

    return reasons.join('. ');
  }

  // Keep existing methods for backward compatibility
  static async getBestPromptForContext(context: PromptOptimizationContext): Promise<string | null> {
    return this.getBestPromptForCategory(context.category);
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
