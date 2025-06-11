
import { triggerAnalysis, triggerBatchAnalysis } from '@/hooks/designAnalysisHelpers';
import { useCaseValidator } from './useCaseValidator';
import { useAnalysisDecisionEngine } from './analysisDecisionEngine';

export const processAnalysis = async (
  uploads: any[], 
  batchId: string, 
  useCaseId: string,
  shouldTriggerBatchAnalysis: boolean
) => {
  const { validateUseCase } = useCaseValidator();
  
  // Get the use case details for analysis
  const useCase = await validateUseCase(useCaseId);

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
