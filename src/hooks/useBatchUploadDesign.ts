
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { BatchUpload } from '@/types/design';
import { processBatchUpload } from './batch-upload/batchUploadProcessor';
import { processAnalysis } from './batch-upload/analysisProcessor';

export const useBatchUploadDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (variables: BatchUpload) => {
      return processBatchUpload(variables);
    },
    onSuccess: async (result, variables) => {
      console.log('Batch upload successful, triggering analyses...');
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-context-files'] });
      
      // Determine if we should run comparative analysis
      const shouldTriggerBatchAnalysis = result.uploads.length > 1 && 
        variables.analysisPreferences?.auto_comparative;
      
      // Process analyses
      await processAnalysis(
        result.uploads, 
        result.batchId, 
        variables.useCase,
        shouldTriggerBatchAnalysis
      );

      const contextMessage = result.contextFiles.length > 0 ? 
        ` with ${result.contextFiles.length} context files` : '';
      
      const analysisMessage = result.uploads.length > 1 && variables.analysisPreferences?.auto_comparative ?
        ' Comparative analysis will be performed automatically.' : '';

      toast({
        title: "Batch Upload Complete",
        description: `Successfully uploaded ${result.uploads.length} items for analysis${contextMessage}.${analysisMessage}`,
      });
    },
    onError: (error) => {
      console.error('Batch upload failed:', error);
      toast({
        variant: "destructive",
        title: "Batch Upload Failed",
        description: error.message,
      });
    }
  });
};
