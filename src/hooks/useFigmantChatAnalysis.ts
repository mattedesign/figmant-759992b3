
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
      if (!user?.id) {
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
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        console.error('🔍 FIGMANT CHAT - User does not have access');
        throw new Error('You need credits to perform analysis. Please purchase credits to continue.');
      }
      console.log('🔍 FIGMANT CHAT - User has access confirmed');

      // Process credits (1 credit for regular chat analysis)
      console.log('🔍 FIGMANT CHAT - Processing credits...');
      const creditsProcessed = await deductAnalysisCredits(1, 'Figmant chat analysis');
      if (!creditsProcessed) {
        console.error('🔍 FIGMANT CHAT - Failed to process credits');
        throw new Error('Unable to process chat analysis. Please check your credit balance.');
      }
      console.log('🔍 FIGMANT CHAT - Credits processed successfully');

      // Process attachments if any
      const processedAttachments = attachments?.map(attachment => ({
        name: attachment.name,
        type: attachment.type,
        path: attachment.uploadPath,
        url: attachment.url
      })) || [];

      console.log('🔍 FIGMANT CHAT - Calling Claude AI function...');
      
      // Call Claude AI function
      const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
        body: {
          message: analysisMessage, // Use the validated/generated message
          attachments: processedAttachments,
          requestType: 'figmant_chat_analysis',
          analysisType: 'chat',
          template: template || null
        }
      });

      if (claudeError) {
        console.error('🔍 FIGMANT CHAT - Claude AI error:', claudeError);
        throw new Error(`Analysis failed: ${claudeError.message}`);
      }

      console.log('🔍 FIGMANT CHAT - Claude AI response received successfully');

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
      console.log('🔍 FIGMANT CHAT - Analysis completed successfully');
    },

    onError: (error: any) => {
      console.error('🔍 FIGMANT CHAT - Analysis mutation error:', error);
    }
  });
};
