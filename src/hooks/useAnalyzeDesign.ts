
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignUseCase } from '@/types/design';
import { triggerAnalysis, retryFailedAnalysis } from './designAnalysisHelpers';
import { useCreditAccess } from './credits/useCreditAccess';

export const useAnalyzeDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { deductAnalysisCredits, checkUserAccess } = useCreditAccess();

  return useMutation({
    mutationFn: async ({ uploadId, useCase }: { uploadId: string; useCase: DesignUseCase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access (owners get unlimited, others need credits)
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        throw new Error('You need credits to perform analysis. Please purchase credits to continue.');
      }

      // Deduct credits before analysis (1 credit per analysis)
      const creditsDeducted = await deductAnalysisCredits(1, `Design analysis: ${useCase.name}`);
      if (!creditsDeducted) {
        throw new Error('Unable to deduct credits for analysis. Please check your credit balance.');
      }

      try {
        return await triggerAnalysis(uploadId, useCase);
      } catch (error) {
        // If analysis fails, we could consider refunding the credit
        // For now, we'll let the failed analysis consume the credit
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      toast({
        title: "Analysis Complete",
        description: "Your design analysis is ready!",
      });
    },
    onError: (error, variables) => {
      console.error('Analysis failed:', error);
      
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message,
      });
    }
  });
};

export const useRetryAnalysis = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { deductAnalysisCredits, checkUserAccess } = useCreditAccess();

  return useMutation({
    mutationFn: async (uploadId: string) => {
      // Check if user has access before retry
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        throw new Error('You need credits to retry analysis. Please purchase credits to continue.');
      }

      // Deduct credits for retry (1 credit per retry)
      const creditsDeducted = await deductAnalysisCredits(1, 'Design analysis retry');
      if (!creditsDeducted) {
        throw new Error('Unable to deduct credits for analysis retry. Please check your credit balance.');
      }

      return await retryFailedAnalysis(uploadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      toast({
        title: "Analysis Retried Successfully",
        description: "Your design analysis has been completed!",
      });
    },
    onError: (error) => {
      console.error('Retry failed:', error);
      toast({
        variant: "destructive",
        title: "Retry Failed", 
        description: error.message,
      });
    }
  });
};
