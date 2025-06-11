
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProcessingRedirect } from '@/hooks/useProcessingRedirect';
import { DesignUseCase } from '@/types/design';
import { triggerAnalysis } from './designAnalysisHelpers';
import { useUserCredits } from './useUserCredits';

export const useUploadDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { redirectToProcessing } = useProcessingRedirect();
  const { checkUserAccess, deductAnalysisCredits } = useUserCredits();

  return useMutation({
    mutationFn: async ({ file, useCase, analysisGoals }: { file: File; useCase: string; analysisGoals?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user has access before upload
      const hasAccess = await checkUserAccess();
      if (!hasAccess) {
        throw new Error('You need an active subscription or credits to upload and analyze designs. Please upgrade your plan or purchase credits.');
      }

      console.log('Starting file upload...', { fileName: file.name, size: file.size });

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully to:', filePath);

      // Create a unique batch ID for single uploads
      const batchId = crypto.randomUUID();

      // Create database record
      const { data, error } = await supabase
        .from('design_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          use_case: useCase,
          status: 'pending',
          batch_id: batchId,
          batch_name: `Single Upload - ${file.name}`,
          analysis_goals: analysisGoals || null
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Upload record created:', data);
      return { ...data, batchId };
    },
    onSuccess: async (uploadData, variables) => {
      console.log('Upload successful, redirecting to processing...');
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      
      // Redirect to processing page
      redirectToProcessing(uploadData.batchId, `Successfully uploaded ${uploadData.file_name} for analysis.`);
      
      // Automatically trigger analysis in the background with credit deduction
      try {
        const { data: useCases } = await supabase
          .from('design_use_cases')
          .select('*')
          .eq('id', variables.useCase)
          .single();

        if (useCases) {
          console.log('Found use case, checking credits and starting analysis:', useCases.name);
          
          // Deduct credits for auto-analysis
          const creditsDeducted = await deductAnalysisCredits(1, `Auto-analysis: ${useCases.name}`);
          if (creditsDeducted) {
            await triggerAnalysis(uploadData.id, useCases);
            queryClient.invalidateQueries({ queryKey: ['user-credits'] });
          } else {
            console.warn('Auto-analysis skipped due to insufficient credits');
          }
        }
      } catch (error) {
        console.error('Auto-analysis failed:', error);
      }
    },
    onError: (error) => {
      console.error('Upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    }
  });
};
