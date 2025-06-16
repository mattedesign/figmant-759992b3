
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StepData } from '@/components/figmant/pages/premium-analysis/types';
import { useUserCredits } from '@/hooks/useUserCredits';

interface PremiumAnalysisRequest {
  stepData: StepData;
  selectedPrompt: any;
}

export const usePremiumAnalysisSubmission = () => {
  const { toast } = useToast();
  const { deductAnalysisCredits, checkUserAccess } = useUserCredits();

  return useMutation({
    mutationFn: async ({ stepData, selectedPrompt }: PremiumAnalysisRequest) => {
      console.log('Starting premium analysis submission...');

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Check if user has access (subscription or credits)
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        throw new Error('You need an active subscription or credits to perform premium analysis. Please upgrade your plan or purchase credits.');
      }

      // Deduct credits for premium analysis (5 credits)
      const creditsDeducted = await deductAnalysisCredits(5, `Premium analysis: ${selectedPrompt.category}`);
      if (!creditsDeducted) {
        throw new Error('Unable to deduct credits for premium analysis. Please check your credit balance.');
      }

      try {
        // Build comprehensive prompt based on selected premium prompt and user data
        const contextPrompt = buildContextPrompt(stepData, selectedPrompt);

        // Call Claude AI function with premium analysis context
        const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
          body: {
            message: contextPrompt,
            requestType: 'premium_analysis',
            analysisType: selectedPrompt.category,
            promptTemplate: selectedPrompt.original_prompt,
            // Include uploaded files if any
            attachments: stepData.uploadedFiles ? stepData.uploadedFiles.map(file => ({
              name: file.name,
              type: file.type,
              size: file.size
            })) : []
          }
        });

        if (claudeError) {
          console.error('Claude AI error:', claudeError);
          throw new Error(`Premium analysis failed: ${claudeError.message}`);
        }

        // Properly serialize the analysis results to ensure JSON compatibility
        const analysisResults = {
          response: claudeResponse.analysis || claudeResponse.response,
          premium_analysis_data: JSON.parse(JSON.stringify(stepData)), // Ensure proper JSON serialization
          selected_prompt_id: selectedPrompt.id,
          selected_prompt_category: selectedPrompt.category,
          project_name: stepData.projectName,
          analysis_goals: stepData.analysisGoals,
          desired_outcome: stepData.desiredOutcome,
          files_uploaded: stepData.uploadedFiles?.length || 0,
          reference_links: stepData.referenceLinks.filter(link => link.trim()).length,
          // Store premium analysis metadata within analysis_results instead of separate metadata column
          is_premium: true,
          premium_type: selectedPrompt.category,
          credits_used: 5
        };

        // Save the premium analysis to chat history with proper labeling
        const { data: savedAnalysis, error: saveError } = await supabase
          .from('chat_analysis_history')
          .insert({
            user_id: user.id,
            prompt_used: contextPrompt,
            prompt_template_used: selectedPrompt.original_prompt,
            analysis_results: analysisResults,
            confidence_score: claudeResponse.confidence_score || 0.9,
            analysis_type: 'premium_analysis' // Clear labeling for premium analysis
          })
          .select()
          .single();

        if (saveError) {
          console.error('Error saving premium analysis:', saveError);
          throw saveError;
        }

        console.log('Premium analysis saved to chat history with ID:', savedAnalysis.id);

        return {
          analysis: claudeResponse.analysis || claudeResponse.response,
          savedAnalysisId: savedAnalysis.id,
          debugInfo: claudeResponse.debugInfo
        };
      } catch (error) {
        // If analysis fails after credits are deducted, we let the failed analysis consume the credits
        // This is consistent with how most SaaS products handle failed requests
        throw error;
      }
    },
    onError: (error) => {
      console.error('Premium analysis submission failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "An error occurred during premium analysis",
        variant: "destructive"
      });
    },
    onSuccess: () => {
      toast({
        title: "Premium Analysis Complete",
        description: "Your premium analysis has been generated and saved successfully.",
      });
    }
  });
};

function buildContextPrompt(stepData: StepData, selectedPrompt: any): string {
  let prompt = `Premium Analysis Request - ${selectedPrompt.title}\n\n`;
  
  prompt += `Project: ${stepData.projectName}\n`;
  
  if (stepData.analysisGoals) {
    prompt += `Analysis Goals: ${stepData.analysisGoals}\n`;
  }
  
  if (stepData.desiredOutcome) {
    prompt += `Desired Outcome: ${stepData.desiredOutcome}\n`;
  }
  
  if (stepData.improvementMetric) {
    prompt += `Target Improvement: ${stepData.improvementMetric}\n`;
  }
  
  if (stepData.deadline) {
    prompt += `Deadline: ${stepData.deadline}\n`;
  }
  
  if (stepData.stakeholders.length > 0) {
    prompt += `Stakeholders:\n`;
    stepData.stakeholders.forEach(stakeholder => {
      prompt += `- ${stakeholder.name} (${stakeholder.title})\n`;
    });
  }
  
  if (stepData.referenceLinks.filter(link => link.trim()).length > 0) {
    prompt += `Reference Links:\n`;
    stepData.referenceLinks.filter(link => link.trim()).forEach(link => {
      prompt += `- ${link}\n`;
    });
  }

  if (stepData.uploadedFiles && stepData.uploadedFiles.length > 0) {
    prompt += `Uploaded Files:\n`;
    stepData.uploadedFiles.forEach(file => {
      prompt += `- ${file.name} (${file.type}, ${Math.round(file.size / 1024)} KB)\n`;
    });
  }
  
  if (stepData.customPrompt) {
    prompt += `Additional Instructions: ${stepData.customPrompt}\n`;
  }
  
  prompt += `\nPlease provide a comprehensive ${selectedPrompt.category} analysis based on the above context and the following prompt template:\n\n`;
  prompt += selectedPrompt.original_prompt;
  
  return prompt;
}
