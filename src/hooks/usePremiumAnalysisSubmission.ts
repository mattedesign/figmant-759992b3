
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { PremiumAnalysisRequest } from './premium-analysis/types';
import { PremiumAnalysisService } from './premium-analysis/premiumAnalysisService';
import { AccessValidationService } from './premium-analysis/accessValidationService';

export const usePremiumAnalysisSubmission = () => {
  const { toast } = useToast();
  const premiumAnalysisService = new PremiumAnalysisService();

  return useMutation({
    mutationFn: async ({ stepData, selectedPrompt }: PremiumAnalysisRequest) => {
      console.log('🔍 PREMIUM ANALYSIS SUBMISSION - Starting mutation...');

      try {
        // Create validation service instance
        const accessValidationService = new AccessValidationService();
        
        // Validate user access and deduct credits
        await accessValidationService.validateAndDeductCredits(selectedPrompt);

        // Execute the premium analysis
        const result = await premiumAnalysisService.executeAnalysis({
          stepData,
          selectedPrompt
        });

        return result;
      } catch (error) {
        console.error('🔍 Error in analysis processing:', error);
        throw error;
      }
    },
    onError: (error) => {
      console.error('🔍 Premium analysis submission failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during premium analysis",
        variant: "destructive"
      });
    },
    onSuccess: (data) => {
      console.log('🔍 Premium analysis completed successfully:', {
        analysisLength: data.analysis?.length || 0,
        savedAnalysisId: data.savedAnalysisId
      });
      toast({
        title: "Premium Analysis Complete",
        description: "Your premium analysis has been generated and saved successfully.",
      });
    }
  });
};
