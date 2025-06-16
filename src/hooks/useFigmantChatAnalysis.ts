
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useUserCredits } from '@/hooks/useUserCredits';

interface FigmantChatRequest {
  message: string;
  attachments?: ChatAttachment[];
  promptTemplate?: string;
  analysisType?: string;
}

export const useFigmantChatAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { deductAnalysisCredits, checkUserAccess } = useUserCredits();

  return useMutation({
    mutationFn: async ({ message, attachments = [], promptTemplate, analysisType = 'figmant_chat' }: FigmantChatRequest) => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Check if user has access (subscription or credits)
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        throw new Error('You need an active subscription or credits to perform analysis. Please upgrade your plan or purchase credits.');
      }

      // Deduct credits for standard analysis (1 credit)
      const creditsDeducted = await deductAnalysisCredits(1, `Chat analysis: ${analysisType}`);
      if (!creditsDeducted) {
        throw new Error('Unable to deduct credits for analysis. Please check your credit balance.');
      }

      try {
        // Prepare the prompt
        let finalPrompt = message;
        if (promptTemplate) {
          finalPrompt = `${promptTemplate}\n\nUser Query: ${message}`;
        }

        // Call Claude AI function
        const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
          body: {
            message: finalPrompt,
            attachments,
            requestType: analysisType,
            promptTemplate
          }
        });

        if (claudeError) {
          console.error('Claude AI error:', claudeError);
          throw new Error(`Analysis failed: ${claudeError.message}`);
        }

        // Save the analysis to chat history
        const { data: savedAnalysis, error: saveError } = await supabase
          .from('chat_analysis_history')
          .insert({
            user_id: user.id,
            prompt_used: finalPrompt,
            prompt_template_used: promptTemplate,
            analysis_results: {
              response: claudeResponse.analysis || claudeResponse.response,
              attachments_processed: claudeResponse.attachmentsProcessed || 0,
              upload_ids: claudeResponse.uploadIds || [],
              debug_info: claudeResponse.debugInfo
            },
            confidence_score: claudeResponse.confidence_score || 0.8,
            analysis_type: analysisType
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving chat analysis:', saveError);
          // Don't throw here - analysis was successful even if saving failed
        }

        return {
          analysis: claudeResponse.analysis || claudeResponse.response,
          uploadIds: claudeResponse.uploadIds || [],
          debugInfo: claudeResponse.debugInfo,
          savedAnalysisId: savedAnalysis?.id
        };
      } catch (error) {
        // If analysis fails after credits are deducted, we let the failed analysis consume the credits
        // This is consistent with how most SaaS products handle failed requests
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-analysis-history'] });
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
    },
    onError: (error) => {
      console.error('Figmant chat analysis failed:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "An error occurred during analysis",
      });
    }
  });
};
