
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ContextualAnalysisResult } from '@/types/contextualAnalysis';

interface WizardAnalysisData {
  stepData: any;
  analysisResults: any;
  structuredAnalysis?: ContextualAnalysisResult;
  confidenceScore?: number;
}

// Helper function to safely serialize data for JSON storage
const serializeForJson = (data: any): any => {
  if (data === null || data === undefined) {
    return null;
  }
  
  if (Array.isArray(data)) {
    return data.map(item => serializeForJson(item));
  }
  
  if (typeof data === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(data)) {
      serialized[key] = serializeForJson(value);
    }
    return serialized;
  }
  
  return data;
};

export const useWizardAnalysisSave = () => {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: WizardAnalysisData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Safely serialize the structured analysis to ensure JSON compatibility
      const serializedStructuredAnalysis = data.structuredAnalysis ? 
        serializeForJson(data.structuredAnalysis) : null;

      // Safely serialize the metrics to ensure JSON compatibility
      const serializedMetrics = data.structuredAnalysis?.metrics ? 
        serializeForJson(data.structuredAnalysis.metrics) : null;

      const analysisData = {
        user_id: user.id,
        analysis_type: 'wizard',
        prompt_used: 'Premium Analysis Wizard',
        prompt_template_used: data.stepData?.selectedType || 'wizard_template',
        analysis_results: {
          response: data.analysisResults?.analysis || 'Wizard analysis completed',
          structured_analysis: serializedStructuredAnalysis,
          wizard_data: serializeForJson(data.stepData),
          attachments_processed: data.stepData?.uploadedFiles?.length || 0,
          template_info: {
            id: data.stepData?.selectedType,
            category: data.stepData?.templateData?.category || 'analysis'
          },
          recommendations_count: data.structuredAnalysis?.recommendations?.length || 0,
          metrics: serializedMetrics,
          debug_info: {
            wizard_steps: Object.keys(data.stepData || {}),
            completion_timestamp: new Date().toISOString(),
            has_structured_data: !!data.structuredAnalysis
          }
        },
        confidence_score: data.confidenceScore || (data.structuredAnalysis?.metrics?.averageConfidence ? data.structuredAnalysis.metrics.averageConfidence / 100 : 0.85)
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
