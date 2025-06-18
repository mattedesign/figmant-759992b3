
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
}

interface AnalysisResponse {
  analysis: string;
  confidence_score?: number;
  debugInfo?: any;
}

export const useFigmantChatAnalysis = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkUserAccess, deductAnalysisCredits } = useCreditAccess();

  return useMutation({
    mutationFn: async ({ message, attachments }: AnalysisRequest): Promise<AnalysisResponse> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log('🔍 Starting Figmant chat analysis...', {
        userId: user.id,
        messageLength: message.length,
        attachmentCount: attachments?.length || 0
      });

      // Check user access and credits first
      console.log('🔍 Checking user access...');
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        console.error('🔍 User does not have access');
        throw new Error('You need an active subscription or credits to perform analysis. Please upgrade your plan or purchase credits.');
      }
      console.log('🔍 User has access confirmed');

      // Deduct credits for analysis (1 credit for regular chat analysis)
      console.log('🔍 Attempting to deduct 1 credit...');
      const creditsDeducted = await deductAnalysisCredits(1, 'Figmant chat analysis');
      if (!creditsDeducted) {
        console.error('🔍 Failed to deduct credits');
        throw new Error('Insufficient credits for analysis');
      }
      console.log('🔍 Credits deducted successfully');

      // Process attachments if any
      const processedAttachments = attachments?.map(attachment => ({
        name: attachment.name,
        type: attachment.type,
        path: attachment.uploadPath,
        url: attachment.url
      })) || [];

      console.log('🔍 Calling Claude AI function...');
      
      // Call Claude AI function
      const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
        body: {
          message,
          attachments: processedAttachments,
          requestType: 'figmant_chat_analysis',
          analysisType: 'chat'
        }
      });

      if (claudeError) {
        console.error('🔍 Claude AI error:', claudeError);
        throw new Error(`Analysis failed: ${claudeError.message}`);
      }

      console.log('🔍 Claude AI response received successfully');

      // Save to chat history
      try {
        console.log('🔍 Saving to chat history...');
        const { error: saveError } = await supabase
          .from('chat_analysis_history')
          .insert({
            user_id: user.id,
            prompt_used: message,
            analysis_results: {
              response: claudeResponse.response || claudeResponse.analysis,
              attachments: processedAttachments,
              metadata: claudeResponse.debugInfo
            },
            confidence_score: claudeResponse.confidence_score || 0.8,
            analysis_type: 'figmant_chat'
          });

        if (saveError) {
          console.error('🔍 Error saving to chat history:', saveError);
          // Don't throw here - the analysis succeeded, just logging failed
        } else {
          console.log('🔍 Analysis saved to chat history successfully');
        }
      } catch (saveError) {
        console.error('🔍 Error saving analysis:', saveError);
        // Don't throw here - the analysis succeeded
      }

      console.log('🔍 Analysis completed successfully');
      
      return {
        analysis: claudeResponse.response || claudeResponse.analysis,
        confidence_score: claudeResponse.confidence_score,
        debugInfo: claudeResponse.debugInfo
      };
    },

    onSuccess: (data) => {
      console.log('🔍 Figmant chat analysis completed successfully');
      toast({
        title: "Analysis Complete",
        description: "Your design analysis has been completed successfully.",
      });
    },

    onError: (error: any) => {
      console.error('🔍 Figmant chat analysis mutation error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Failed to analyze your design. Please try again.",
      });
    }
  });
};
