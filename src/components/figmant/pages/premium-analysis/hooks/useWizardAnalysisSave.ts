
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WizardAnalysisData {
  stepData: any;
  analysisResults: any;
  confidenceScore?: number;
}

export const useWizardAnalysisSave = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: WizardAnalysisData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const analysisData = {
        user_id: user.id,
        analysis_type: 'wizard',
        prompt_used: 'Premium Analysis Wizard',
        prompt_template_used: 'wizard_template',
        analysis_results: {
          response: data.analysisResults?.analysis || 'Wizard analysis completed',
          wizard_data: data.stepData,
          attachments_processed: data.stepData?.attachments?.length || 0,
          debug_info: {
            wizard_steps: Object.keys(data.stepData || {}),
            completion_timestamp: new Date().toISOString()
          }
        },
        confidence_score: data.confidenceScore || 0.85
      };

      const { data: result, error } = await supabase
        .from('chat_analysis_history')
        .insert([analysisData])
        .select()
        .single();

      if (error) {
        console.error('Error saving wizard analysis:', error);
        throw error;
      }

      return result;
    }
  });
};
