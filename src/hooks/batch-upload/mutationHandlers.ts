
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { BatchUploadResult } from './batchUploadTypes';
import { BatchUpload } from '@/types/design';

export const useMutationHandlers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSuccess = (result: BatchUploadResult, variables: BatchUpload) => {
    console.log('Batch upload successful, triggering analyses...');
    queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
    queryClient.invalidateQueries({ queryKey: ['design-context-files'] });
    
    const contextMessage = result.contextFiles.length > 0 ? 
      ` with ${result.contextFiles.length} context files` : '';
    
    const analysisMessage = result.uploads.length > 1 && variables.analysisPreferences?.auto_comparative ?
      ' Comparative analysis will be performed automatically.' : '';

    toast({
      title: "Batch Upload Complete",
      description: `Successfully uploaded ${result.uploads.length} items for analysis${contextMessage}.${analysisMessage}`,
    });
  };

  const handleError = (error: Error) => {
    console.error('Batch upload failed:', error);
    toast({
      variant: "destructive",
      title: "Batch Upload Failed",
      description: error.message,
    });
  };

  return { handleSuccess, handleError };
};
