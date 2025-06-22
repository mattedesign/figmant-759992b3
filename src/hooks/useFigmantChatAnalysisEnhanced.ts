
import { useMutation } from '@tanstack/react-query';
import { ChatAttachment } from '@/components/design/DesignChatInterface';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedChatContext } from './useEnhancedChatContext';

interface EnhancedAnalysisRequest {
  message: string;
  attachments: ChatAttachment[];
  template?: any;
  sessionId?: string;
}

interface EnhancedAnalysisResponse {
  analysis: string;
  contextUsed: boolean;
  tokenCount?: number;
  processingTime?: number;
}

export const useFigmantChatAnalysisEnhanced = (sessionId?: string) => {
  const { toast } = useToast();
  const { createContextualPrompt, conversationContext } = useEnhancedChatContext(sessionId);

  return useMutation<EnhancedAnalysisResponse, Error, EnhancedAnalysisRequest>({
    mutationFn: async ({ message, attachments, template, sessionId }) => {
      console.log('🚀 ENHANCED ANALYSIS - Starting analysis with context...');
      
      const startTime = Date.now();

      try {
        // Create contextual prompt with conversation history
        const contextualPrompt = createContextualPrompt(message, template);
        
        console.log('🎯 ENHANCED ANALYSIS - Using contextual prompt:', {
          originalLength: message.length,
          contextualLength: contextualPrompt.length,
          hasContext: conversationContext.historicalContext.length > 0,
          tokenEstimate: conversationContext.tokenEstimate
        });

        // Prepare analysis request with enhanced context
        const analysisRequest = {
          message: contextualPrompt,
          attachments: attachments.map(att => ({
            id: att.id,
            type: att.type,
            name: att.name,
            uploadPath: att.uploadPath,
            url: att.url
          })),
          requestType: 'enhanced_figmant_chat',
          contextMetadata: {
            hasHistoricalContext: conversationContext.historicalContext.length > 0,
            hasAttachmentContext: conversationContext.attachmentContext.length > 0,
            tokenEstimate: conversationContext.tokenEstimate,
            sessionId
          }
        };

        console.log('📡 ENHANCED ANALYSIS - Sending to Claude with context...');

        const response = await fetch('/api/claude-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analysisRequest),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Analysis failed: ${response.status}`);
        }

        const result = await response.json();
        const processingTime = Date.now() - startTime;

        console.log('✅ ENHANCED ANALYSIS - Analysis completed:', {
          analysisLength: result.analysis?.length || 0,
          processingTime,
          contextUsed: true
        });

        return {
          analysis: result.analysis || result.response || 'Analysis completed.',
          contextUsed: true,
          tokenCount: result.tokenCount,
          processingTime
        };

      } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error('❌ ENHANCED ANALYSIS - Error:', error);

        // Fallback to regular analysis if context analysis fails
        console.log('🔄 ENHANCED ANALYSIS - Falling back to regular analysis...');
        
        try {
          const fallbackResponse = await fetch('/api/claude-ai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message,
              attachments: attachments.map(att => ({
                id: att.id,
                type: att.type,
                name: att.name,
                uploadPath: att.uploadPath,
                url: att.url
              })),
              requestType: 'fallback_chat'
            }),
          });

          if (fallbackResponse.ok) {
            const fallbackResult = await fallbackResponse.json();
            console.log('✅ ENHANCED ANALYSIS - Fallback successful');
            
            return {
              analysis: fallbackResult.analysis || fallbackResult.response || 'Analysis completed.',
              contextUsed: false,
              processingTime: Date.now() - startTime
            };
          }
        } catch (fallbackError) {
          console.error('❌ ENHANCED ANALYSIS - Fallback also failed:', fallbackError);
        }

        throw error;
      }
    },
    onError: (error) => {
      console.error('ENHANCED ANALYSIS - Mutation error:', error);
      toast({
        variant: "destructive",
        title: "Enhanced Analysis Failed",
        description: error.message || "Failed to analyze with conversation context",
      });
    },
    onSuccess: (data) => {
      console.log('ENHANCED ANALYSIS - Mutation success:', {
        analysisLength: data.analysis.length,
        contextUsed: data.contextUsed,
        processingTime: data.processingTime
      });
      
      toast({
        title: data.contextUsed ? "Enhanced Analysis Complete" : "Analysis Complete",
        description: data.contextUsed 
          ? "Analysis completed using full conversation context"
          : "Analysis completed successfully",
      });
    }
  });
};
