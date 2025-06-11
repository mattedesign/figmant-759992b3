
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignUseCase } from '@/types/design';
import { triggerAnalysis, retryFailedAnalysis } from './designAnalysisHelpers';

export const useAnalyzeDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uploadId, useCase }: { uploadId: string; useCase: DesignUseCase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return await triggerAnalysis(uploadId, useCase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
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

  return useMutation({
    mutationFn: async (uploadId: string) => {
      return await retryFailedAnalysis(uploadId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
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
