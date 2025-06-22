
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedChatContext } from '@/hooks/useEnhancedChatContext';

interface EnhancedAnalysisParams {
  message: string;
  attachments: any[];
  template?: any;
  sessionId?: string;
}

interface EnhancedAnalysisResult {
  analysis: string;
  contextUsed: boolean;
  tokenEstimate: number;
  attachmentCount: number;
}

export const useFigmantChatAnalysisEnhanced = (sessionId?: string) => {
  const { toast } = useToast();
  const { createContextualPrompt } = useEnhancedChatContext(sessionId);

  return useMutation({
    mutationFn: async (params: EnhancedAnalysisParams): Promise<EnhancedAnalysisResult> => {
      console.log('🚀 ENHANCED CHAT ANALYSIS - Starting analysis with context:', {
        messageLength: params.message.length,
        attachmentsCount: params.attachments.length,
        hasTemplate: !!params.template,
        sessionId: params.sessionId
      });

      try {
        // Create contextual prompt using conversation history
        const contextualPrompt = createContextualPrompt(params.message, params.template);
        const contextUsed = contextualPrompt !== params.message;

        console.log('🎯 ENHANCED CHAT ANALYSIS - Contextual prompt created:', {
          originalLength: params.message.length,
          contextualLength: contextualPrompt.length,
          contextUsed
        });

        // Call the edge function with the contextual prompt
        const { data, error } = await supabase.functions.invoke('figmant-chat-analysis', {
          body: {
            message: contextualPrompt,
            attachments: params.attachments,
            template: params.template,
            sessionId: params.sessionId,
            enhanced: true // Flag to indicate this is an enhanced analysis
          }
        });

        if (error) {
          console.error('❌ ENHANCED CHAT ANALYSIS - Edge function error:', error);
          throw new Error(`Analysis failed: ${error.message}`);
        }

        if (!data || !data.analysis) {
          console.error('❌ ENHANCED CHAT ANALYSIS - Invalid response:', data);
          throw new Error('Invalid response from analysis service');
        }

        console.log('✅ ENHANCED CHAT ANALYSIS - Analysis completed successfully:', {
          analysisLength: data.analysis.length,
          contextUsed,
          attachmentCount: params.attachments.length
        });

        return {
          analysis: data.analysis,
          contextUsed,
          tokenEstimate: Math.ceil(contextualPrompt.length / 4),
          attachmentCount: params.attachments.length
        };

      } catch (error) {
        console.error('❌ ENHANCED CHAT ANALYSIS - Analysis failed:', error);
        
        toast({
          variant: "destructive",
          title: "Enhanced Analysis Failed",
          description: error instanceof Error ? error.message : 'Unknown error occurred',
        });
        
        throw error;
      }
    },
    onSuccess: (result) => {
      console.log('🎉 ENHANCED CHAT ANALYSIS - Mutation completed successfully:', {
        contextUsed: result.contextUsed,
        tokenEstimate: result.tokenEstimate,
        attachmentCount: result.attachmentCount
      });
    },
    onError: (error) => {
      console.error('💥 ENHANCED CHAT ANALYSIS - Mutation failed:', error);
    }
  });
};
