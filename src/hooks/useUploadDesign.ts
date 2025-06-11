
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignUseCase } from '@/types/design';
import { triggerAnalysis } from './designAnalysisHelpers';

export const useUploadDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, useCase }: { file: File; useCase: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Upload record created:', data);
      return data;
    },
    onSuccess: async (uploadData, variables) => {
      console.log('Upload successful, triggering analysis...');
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      
      // Automatically trigger analysis
      try {
        const { data: useCases } = await supabase
          .from('design_use_cases')
          .select('*')
          .eq('id', variables.useCase)
          .single();

        if (useCases) {
          console.log('Found use case, starting analysis:', useCases.name);
          await triggerAnalysis(uploadData.id, useCases);
        }
      } catch (error) {
        console.error('Auto-analysis failed:', error);
        toast({
          title: "Upload Complete",
          description: "Design uploaded successfully. You can manually trigger analysis from the history tab.",
        });
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
