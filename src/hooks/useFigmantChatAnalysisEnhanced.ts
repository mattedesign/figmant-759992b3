
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedChatContext } from './useEnhancedChatContext';

interface AnalysisParams {
  message: string;
  attachments?: any[];
  template?: any;
  sessionId?: string;
}

interface AnalysisResult {
  analysis: string;
  contextUsed: boolean;
  analysisType: string;
  confidenceScore: number;
  tokenEstimate: number;
}

export const useFigmantChatAnalysisEnhanced = (sessionId?: string) => {
  const { toast } = useToast();
  const { createContextualPrompt } = useEnhancedChatContext(sessionId);

  return useMutation<AnalysisResult, Error, AnalysisParams>({
    mutationFn: async ({ message, attachments = [], template, sessionId }) => {
      console.log('🚀 FIGMANT ENHANCED ANALYSIS - Starting with context:', {
        sessionId,
        messageLength: message.length,
        attachmentsCount: attachments.length,
        hasTemplate: !!template
      });

      try {
        // Create contextual prompt with conversation history
        const contextualPrompt = createContextualPrompt(message, template);
        
        console.log('🎯 FIGMANT ENHANCED ANALYSIS - Contextual prompt created:', {
          originalLength: message.length,
          contextualLength: contextualPrompt.length,
          contextUsed: contextualPrompt.length > message.length
        });

        // Call the enhanced analysis edge function
        const { data, error } = await supabase.functions.invoke('figmant-chat-analysis-enhanced', {
          body: {
            message: contextualPrompt,
            attachments,
            template,
            sessionId,
            originalMessage: message,
            contextEnhanced: true
          }
        });

        if (error) {
          console.error('❌ FIGMANT ENHANCED ANALYSIS - Edge function error:', error);
          throw new Error(`Analysis failed: ${error.message}`);
        }

        if (!data || !data.analysis) {
          console.error('❌ FIGMANT ENHANCED ANALYSIS - Invalid response:', data);
          throw new Error('Invalid analysis response received');
        }

        const result: AnalysisResult = {
          analysis: data.analysis,
          contextUsed: contextualPrompt.length > message.length,
          analysisType: data.analysisType || 'enhanced_figmant_chat',
          confidenceScore: data.confidenceScore || 0.85,
          tokenEstimate: Math.ceil(contextualPrompt.length / 4)
        };

        console.log('✅ FIGMANT ENHANCED ANALYSIS - Success:', {
          analysisLength: result.analysis.length,
          contextUsed: result.contextUsed,
          confidenceScore: result.confidenceScore,
          tokenEstimate: result.tokenEstimate
        });

        return result;

      } catch (error) {
        console.error('❌ FIGMANT ENHANCED ANALYSIS - Complete failure:', error);
        
        // Provide fallback response
        return {
          analysis: `I apologize, but I encountered an error during the enhanced analysis. Your message has been received: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

Please try again, and your conversation history will be preserved for context.`,
          contextUsed: false,
          analysisType: 'error_fallback',
          confidenceScore: 0.0,
          tokenEstimate: 0
        };
      }
    },
    onError: (error) => {
      console.error('❌ FIGMANT ENHANCED ANALYSIS - Mutation error:', error);
      toast({
        variant: "destructive",
        title: "Enhanced Analysis Failed",
        description: "The analysis could not be completed, but your conversation context is preserved.",
      });
    },
    onSuccess: (data) => {
      if (data.contextUsed) {
        toast({
          title: "Enhanced Analysis Complete",
          description: "Your analysis included full conversation context for better insights.",
        });
      }
    }
  });
};
