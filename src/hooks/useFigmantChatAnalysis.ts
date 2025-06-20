
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

      console.log('🔍 FIGMANT CHAT - Calling Supabase function with timeout protection...');
      
      // Add timeout handling
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          console.error('🔥 API CALL - Analysis timeout after 30 seconds');
          reject(new Error('Analysis timeout - please try again'));
        }, 30000);
      });

      // Wrap supabase call with timeout and improved error handling
      const analysisPromise = supabase.functions.invoke('figmant-chat-analysis', {
        body: {
          message: analysisMessage,
          attachments: processedAttachments,
          template: template || { category: 'competitor' },
          user_id: user.id,
          analysis_type: 'competitor_analysis'
        }
      });

      console.log('🔥 API CALL - Starting race between analysis and timeout...');

      try {
        console.log('🔥 API - Calling supabase function...');
        
        const { data, error } = await Promise.race([analysisPromise, timeoutPromise]);

        console.log('🔥 API - Supabase response:', { data, error });

        if (error) {
          console.error('🔥 API - Supabase error:', error);
          throw new Error(`Analysis service error: ${error.message}`);
        }

        if (!data) {
          console.error('🔥 API - No data returned');
          throw new Error('No analysis data returned from service');
        }

        console.log('🔍 FIGMANT CHAT - Analysis response received successfully:', {
          hasResponse: !!data.response,
          hasAnalysis: !!data.analysis,
          confidenceScore: data.confidence_score
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
                response: data.response || data.analysis,
                attachments: processedAttachments,
                metadata: data,
                template: template
              },
              confidence_score: data.confidence_score || 0.8,
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
          analysis: data.analysis || data.response || 'Analysis completed',
          confidence_score: data.confidence_score || 85,
          debugInfo: data
        };

      } catch (error) {
        console.error('🔥 API - Full error:', error);
        
        if (error.message?.includes('timeout')) {
          throw new Error('Analysis is taking longer than expected. Please try again.');
        }
        
        if (error.message?.includes('credits')) {
          throw new Error('Insufficient credits for analysis. Please purchase more credits.');
        }
        
        throw new Error(`Analysis failed: ${error.message || 'Unknown error'}`);
      }
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
