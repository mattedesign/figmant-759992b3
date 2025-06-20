
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCreditAccess } from './credits/useCreditAccess';

interface AnalysisRequest {
  message: string;
  attachments?: Array<{
    id: string;
    type: 'file' | 'url';
    name: string;
    uploadPath?: string;
    url?: string;
  }>;
  template?: any;
}

interface AnalysisResponse {
  analysis: string;
  response?: string;
  confidence_score?: number;
  debugInfo?: any;
}

export const useFigmantChatAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkUserAccess, deductAnalysisCredits } = useCreditAccess();

  return useMutation({
    mutationFn: async ({ message, attachments, template }: AnalysisRequest): Promise<AnalysisResponse> => {
      // Enhanced logging at the very beginning
      console.log('🔥 API CALL - useFigmantChatAnalysis called with:', {
        userId: user?.id,
        messageLength: message?.length || 0,
        attachmentCount: attachments?.length || 0,
        templateCategory: template?.category || 'none',
        timestamp: new Date().toISOString()
      });
      
      if (!user?.id) {
        console.error('🔥 API CALL - User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('🔍 FIGMANT CHAT - Starting analysis...', {
        userId: user.id,
        messageLength: message.length,
        attachmentCount: attachments?.length || 0,
        template: template?.title || 'None'
      });

      // Validate that we have either a message or attachments
      if (!message.trim() && (!attachments || attachments.length === 0)) {
        console.error('🔥 API CALL - No content provided');
        throw new Error('Please provide a message or attach files for analysis.');
      }

      // If no message but we have attachments, create a default analysis message
      let analysisMessage = message.trim();
      if (!analysisMessage && attachments && attachments.length > 0) {
        const fileCount = attachments.filter(a => a.type === 'file').length;
        const urlCount = attachments.filter(a => a.type === 'url').length;
        
        if (template?.category === 'competitor') {
          analysisMessage = `Please analyze the attached ${urlCount > 0 ? 'competitor websites' : 'design files'} using competitive analysis principles. Provide insights on design patterns, user experience, and market positioning opportunities.`;
        } else {
          analysisMessage = `Please analyze the attached ${fileCount > 0 ? `${fileCount} file(s)` : ''}${fileCount > 0 && urlCount > 0 ? ' and ' : ''}${urlCount > 0 ? `${urlCount} website(s)` : ''} and provide design insights.`;
        }
      }

      console.log('🔍 FIGMANT CHAT - Using analysis message:', analysisMessage);

      // Check user access and process credits
      console.log('🔍 FIGMANT CHAT - Checking user access...');
      try {
        const hasAccess = await checkUserAccess();
        if (!hasAccess) {
          console.error('🔍 FIGMANT CHAT - User does not have access');
          throw new Error('You need credits to perform analysis. Please purchase credits to continue.');
        }
        console.log('🔍 FIGMANT CHAT - User has access confirmed');
      } catch (accessError) {
        console.error('🔍 FIGMANT CHAT - Access check failed:', accessError);
        throw new Error('Failed to verify access. Please try again.');
      }

      // Process credits (1 credit for regular chat analysis)
      console.log('🔍 FIGMANT CHAT - Processing credits...');
      try {
        const creditsProcessed = await deductAnalysisCredits(1, 'Figmant chat analysis');
        if (!creditsProcessed) {
          console.error('🔍 FIGMANT CHAT - Failed to process credits');
          throw new Error('Unable to process chat analysis. Please check your credit balance.');
        }
        console.log('🔍 FIGMANT CHAT - Credits processed successfully');
      } catch (creditError) {
        console.error('🔍 FIGMANT CHAT - Credit processing failed:', creditError);
        throw new Error('Failed to process credits. Please try again.');
      }

      // Process attachments if any
      const processedAttachments = attachments?.map(attachment => ({
        name: attachment.name,
        type: attachment.type,
        path: attachment.uploadPath,
        url: attachment.url
      })) || [];

      console.log('🔍 FIGMANT CHAT - Calling Claude AI function with timeout protection...');
      
      // Add timeout handling
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.error('🔥 API CALL - Analysis timeout after 30 seconds');
          reject(new Error('Analysis timeout - please try again'));
        }, 30000);
      });

      // Wrap supabase call with timeout
      const analysisPromise = supabase.functions.invoke('claude-ai', {
        body: {
          message: analysisMessage,
          attachments: processedAttachments,
          requestType: 'figmant_chat_analysis',
          analysisType: 'chat',
          template: template || null,
          user_id: user.id
        }
      });

      console.log('🔥 API CALL - Starting race between analysis and timeout...');

      let claudeResponse, claudeError;
      try {
        const result = await Promise.race([analysisPromise, timeoutPromise]);
        claudeResponse = result.data;
        claudeError = result.error;
        console.log('🔥 API CALL - Analysis completed within timeout');
      } catch (raceError) {
        console.error('🔥 API CALL - Promise race failed:', raceError);
        throw raceError;
      }

      if (claudeError) {
        console.error('🔍 FIGMANT CHAT - Claude AI error:', claudeError);
        throw new Error(`Analysis failed: ${claudeError.message}`);
      }

      if (!claudeResponse) {
        console.error('🔍 FIGMANT CHAT - No response data from Claude AI');
        throw new Error('Analysis failed: No response received from AI service');
      }

      console.log('🔍 FIGMANT CHAT - Claude AI response received successfully:', {
        hasResponse: !!claudeResponse.response,
        hasAnalysis: !!claudeResponse.analysis,
        confidenceScore: claudeResponse.confidence_score
      });

      // Save to chat history
      try {
        console.log('🔍 FIGMANT CHAT - Saving to chat history...');
        const { error: saveError } = await supabase
          .from('chat_analysis_history')
          .insert({
            user_id: user.id,
            prompt_used: analysisMessage,
            analysis_results: {
              response: claudeResponse.response || claudeResponse.analysis,
              attachments: processedAttachments,
              metadata: claudeResponse.debugInfo,
              template: template
            },
            confidence_score: claudeResponse.confidence_score || 0.8,
            analysis_type: 'figmant_chat'
          });

        if (saveError) {
          console.error('🔍 FIGMANT CHAT - Error saving to chat history:', saveError);
        } else {
          console.log('🔍 FIGMANT CHAT - Analysis saved to chat history successfully');
        }
      } catch (saveError) {
        console.error('🔍 FIGMANT CHAT - Error saving analysis:', saveError);
        // Don't throw here, as the analysis was successful
      }

      console.log('🔍 FIGMANT CHAT - Analysis completed successfully');
      
      return {
        analysis: claudeResponse.response || claudeResponse.analysis,
        response: claudeResponse.response || claudeResponse.analysis,
        confidence_score: claudeResponse.confidence_score,
        debugInfo: claudeResponse.debugInfo
      };
    },

    onSuccess: (data) => {
      console.log('🔍 FIGMANT CHAT - Analysis mutation completed successfully');
    },

    onError: (error: any) => {
      console.error('🔍 FIGMANT CHAT - Analysis mutation error:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  });
};
