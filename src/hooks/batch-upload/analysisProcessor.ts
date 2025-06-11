
import { triggerAnalysis, triggerBatchAnalysis } from '@/hooks/designAnalysisHelpers';
import { supabase } from '@/integrations/supabase/client';

export const processAnalysis = async (
  uploads: any[], 
  batchId: string, 
  useCaseId: string,
  shouldTriggerBatchAnalysis: boolean
) => {
  // Get the use case details for analysis
  const { data: useCase } = await supabase
    .from('design_use_cases')
    .select('*')
    .eq('id', useCaseId)
    .single();

  if (!useCase) {
    console.error('Use case not found:', useCaseId);
    return;
  }

  // Trigger individual analyses for each upload
  const analysisPromises = uploads.map(upload => 
    triggerAnalysis(upload.id, useCase).catch(error => {
      console.error(`Analysis failed for ${upload.file_name}:`, error);
      return null;
    })
  );

  await Promise.allSettled(analysisPromises);

  // If multiple items and auto_comparative is enabled, trigger batch analysis
  if (shouldTriggerBatchAnalysis) {
    console.log('Triggering batch comparative analysis...');
    try {
      await triggerBatchAnalysis(batchId, useCase);
      console.log('Batch analysis completed successfully');
    } catch (error) {
      console.error('Batch analysis failed:', error);
      // Don't fail the whole operation for batch analysis issues
    }
  }
};
