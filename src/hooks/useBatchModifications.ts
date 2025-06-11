
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DesignUpload, DesignBatchAnalysis } from '@/types/design';

export const useBatchModifications = (originalBatchId?: string) => {
  const queryClient = useQueryClient();

  // Fetch modification history for a batch
  const { data: modificationHistory = [] } = useQuery({
    queryKey: ['batch-modifications', originalBatchId],
    queryFn: async (): Promise<DesignBatchAnalysis[]> => {
      if (!originalBatchId) return [];
      
      const { data, error } = await supabase
        .from('design_batch_analysis')
        .select('*')
        .eq('batch_id', originalBatchId)
        .order('version_number', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!originalBatchId
  });

  // Create a new batch modification
  const createBatchModification = useMutation({
    mutationFn: async ({
      originalBatchId,
      newUploads,
      replacementMap,
      modificationSummary
    }: {
      originalBatchId: string;
      newUploads: {
        file_name: string;
        file_size: number;
        file_type: string;
        use_case: string;
        batch_name: string;
        replaced_upload_id?: string;
      }[];
      replacementMap: Record<string, string>; // old upload id -> new upload id
      modificationSummary: string;
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Generate new batch ID for the modification
      const newBatchId = crypto.randomUUID();

      // Insert new uploads with modification metadata
      const uploadsWithMetadata = newUploads.map(upload => ({
        file_name: upload.file_name,
        file_size: upload.file_size,
        file_type: upload.file_type,
        use_case: upload.use_case,
        status: 'pending' as const,
        source_type: 'file' as const,
        batch_id: newBatchId,
        batch_name: upload.batch_name,
        original_batch_id: originalBatchId,
        is_replacement: !!upload.replaced_upload_id,
        replaced_upload_id: upload.replaced_upload_id || null,
        user_id: user.data.user!.id
      }));

      const { data: insertedUploads, error: uploadError } = await supabase
        .from('design_uploads')
        .insert(uploadsWithMetadata)
        .select();

      if (uploadError) throw uploadError;

      return {
        newBatchId,
        uploads: insertedUploads,
        modificationSummary
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['batch-modifications'] });
    }
  });

  // Create a new version of batch analysis
  const createAnalysisVersion = useMutation({
    mutationFn: async ({
      originalAnalysisId,
      newBatchId,
      modificationSummary,
      analysisResults
    }: {
      originalAnalysisId: string;
      newBatchId: string;
      modificationSummary: string;
      analysisResults: any;
    }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Get the latest version number for this analysis chain
      const { data: latestVersion } = await supabase
        .from('design_batch_analysis')
        .select('version_number')
        .or(`id.eq.${originalAnalysisId},parent_analysis_id.eq.${originalAnalysisId}`)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const newVersionNumber = (latestVersion?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from('design_batch_analysis')
        .insert({
          batch_id: newBatchId,
          user_id: user.data.user!.id,
          parent_analysis_id: originalAnalysisId,
          modification_summary: modificationSummary,
          version_number: newVersionNumber,
          analysis_type: 'comparative_modification',
          prompt_used: 'Modified batch comparative analysis',
          analysis_results: analysisResults,
          confidence_score: 0.8
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-batch-analyses'] });
      queryClient.invalidateQueries({ queryKey: ['batch-modifications'] });
    }
  });

  return {
    modificationHistory,
    createBatchModification,
    createAnalysisVersion,
    isCreatingModification: createBatchModification.isPending,
    isCreatingVersion: createAnalysisVersion.isPending
  };
};
