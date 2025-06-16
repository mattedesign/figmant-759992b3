
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StepData } from '@/components/figmant/pages/premium-analysis/types';

interface PremiumAnalysisRequest {
  stepData: StepData;
  selectedPrompt: any;
}

export const usePremiumAnalysisSubmission = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ stepData, selectedPrompt }: PremiumAnalysisRequest) => {
      console.log('Starting premium analysis submission...');

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated');
      }

      // Build comprehensive prompt based on selected premium prompt and user data
      const contextPrompt = buildContextPrompt(stepData, selectedPrompt);

      // Call Claude AI function with premium analysis context
      const { data: claudeResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
        body: {
          message: contextPrompt,
          requestType: 'premium_analysis',
          analysisType: selectedPrompt.category,
          promptTemplate: selectedPrompt.original_prompt
        }
      });

      if (claudeError) {
        console.error('Claude AI error:', claudeError);
        throw new Error(`Premium analysis failed: ${claudeError.message}`);
      }

      // Save the premium analysis to chat history
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('chat_analysis_history')
        .insert({
          user_id: user.id,
          prompt_used: contextPrompt,
          prompt_template_used: selectedPrompt.original_prompt,
          analysis_results: {
            response: claudeResponse.analysis || claudeResponse.response,
            premium_analysis_data: stepData,
            selected_prompt_id: selectedPrompt.id,
            selected_prompt_category: selectedPrompt.category
          },
          confidence_score: claudeResponse.confidence_score || 0.9,
          analysis_type: `premium_${selectedPrompt.category}`
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving premium analysis:', saveError);
        throw saveError;
      }

      return {
        analysis: claudeResponse.analysis || claudeResponse.response,
        savedAnalysisId: savedAnalysis.id,
        debugInfo: claudeResponse.debugInfo
      };
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
        description: "Your premium analysis has been generated successfully.",
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
  
  if (stepData.customPrompt) {
    prompt += `Additional Instructions: ${stepData.customPrompt}\n`;
  }
  
  prompt += `\nPlease provide a comprehensive ${selectedPrompt.category} analysis based on the above context and the following prompt template:\n\n`;
  prompt += selectedPrompt.original_prompt;
  
  return prompt;
}
