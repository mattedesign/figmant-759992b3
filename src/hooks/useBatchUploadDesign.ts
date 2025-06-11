
import { useMutation } from '@tanstack/react-query';
import { BatchUpload } from '@/types/design';
import { processBatchUpload } from './batch-upload/batchUploadProcessor';
import { processAnalysis } from './batch-upload/analysisProcessor';
import { useMutationHandlers } from './batch-upload/mutationHandlers';
import { useAnalysisDecisionEngine } from './batch-upload/analysisDecisionEngine';

export const useBatchUploadDesign = () => {
  const { handleSuccess, handleError } = useMutationHandlers();
  const { shouldTriggerBatchAnalysis } = useAnalysisDecisionEngine();

  return useMutation({
    mutationFn: async (variables: BatchUpload) => {
      return processBatchUpload(variables);
    },
    onSuccess: async (result, variables) => {
      // Trigger analysis processing
      const shouldRunBatchAnalysis = shouldTriggerBatchAnalysis(result, variables);
      
      await processAnalysis(
        result.uploads, 
        result.batchId, 
        variables.useCase,
        shouldRunBatchAnalysis
      );

      // Handle UI updates and notifications
      handleSuccess(result, variables);
    },
    onError: handleError
  });
};
