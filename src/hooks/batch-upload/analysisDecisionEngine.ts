
import { BatchUpload, AnalysisPreferences } from '@/types/design';
import { BatchUploadResult } from './batchUploadTypes';

export const useAnalysisDecisionEngine = () => {
  const shouldTriggerBatchAnalysis = (
    result: BatchUploadResult, 
    variables: BatchUpload
  ): boolean => {
    return result.uploads.length > 1 && 
           variables.analysisPreferences?.auto_comparative === true;
  };

  const getAnalysisConfiguration = (
    uploads: any[],
    analysisPreferences: AnalysisPreferences | undefined
  ) => {
    return {
      shouldRunIndividual: uploads.length > 0,
      shouldRunComparative: uploads.length > 1 && analysisPreferences?.auto_comparative,
      contextIntegration: analysisPreferences?.context_integration || false,
      analysisDepth: analysisPreferences?.analysis_depth || 'detailed'
    };
  };

  return {
    shouldTriggerBatchAnalysis,
    getAnalysisConfiguration
  };
};
