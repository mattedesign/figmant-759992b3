
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignUpload, DesignAnalysis, DesignUseCase } from '@/types/design';

export const useDesignUploads = () => {
  return useQuery({
    queryKey: ['design-uploads'],
    queryFn: async (): Promise<DesignUpload[]> => {
      const { data, error } = await supabase
        .from('design_uploads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Type assertion to ensure the data matches our DesignUpload interface
      return (data || []) as DesignUpload[];
    }
  });
};

export const useDesignUseCases = () => {
  return useQuery({
    queryKey: ['design-use-cases'],
    queryFn: async (): Promise<DesignUseCase[]> => {
      const { data, error } = await supabase
        .from('design_use_cases')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return (data || []) as DesignUseCase[];
    }
  });
};

export const useDesignAnalyses = (uploadId?: string) => {
  return useQuery({
    queryKey: ['design-analyses', uploadId],
    queryFn: async (): Promise<DesignAnalysis[]> => {
      let query = supabase.from('design_analysis').select('*');
      
      if (uploadId) {
        query = query.eq('design_upload_id', uploadId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as DesignAnalysis[];
    },
    enabled: !!uploadId
  });
};

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

const triggerAnalysis = async (uploadId: string, useCase: DesignUseCase) => {
  console.log('Triggering analysis for upload:', uploadId);
  
  // Update upload status to processing
  await supabase
    .from('design_uploads')
    .update({ status: 'processing' })
    .eq('id', uploadId);

  console.log('Status updated to processing');

  // Get the uploaded file URL
  const { data: upload } = await supabase
    .from('design_uploads')
    .select('file_path')
    .eq('id', uploadId)
    .single();

  if (!upload) throw new Error('Upload not found');

  console.log('Getting signed URL for file:', upload.file_path);

  const { data: urlData } = await supabase.storage
    .from('design-uploads')
    .createSignedUrl(upload.file_path, 3600);

  if (!urlData?.signedUrl) {
    console.error('Failed to get signed URL');
    throw new Error('Failed to get file URL');
  }

  console.log('Signed URL created, calling Claude AI...');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Call Claude AI for analysis
  const { data: analysisResponse, error: claudeError } = await supabase.functions.invoke('claude-ai', {
    body: {
      prompt: `${useCase.prompt_template}\n\nPlease analyze the design at this URL: ${urlData.signedUrl}`,
      userId: user.id,
      requestType: 'design_analysis'
    }
  });

  if (claudeError) {
    console.error('Claude AI error:', claudeError);
    throw claudeError;
  }

  console.log('Claude analysis completed, saving results...');

  // Save analysis results
  const { data: analysis, error: saveError } = await supabase
    .from('design_analysis')
    .insert({
      design_upload_id: uploadId,
      user_id: user.id,
      analysis_type: useCase.name,
      prompt_used: useCase.prompt_template,
      analysis_results: { response: analysisResponse.response },
      confidence_score: 0.8
    })
    .select()
    .single();

  if (saveError) {
    console.error('Failed to save analysis:', saveError);
    throw saveError;
  }

  console.log('Analysis saved successfully:', analysis.id);

  // Update upload status to completed
  await supabase
    .from('design_uploads')
    .update({ status: 'completed' })
    .eq('id', uploadId);

  console.log('Upload status updated to completed');
  return analysis;
};

export const useAnalyzeDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uploadId, useCase }: { uploadId: string; useCase: DesignUseCase }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      return await triggerAnalysis(uploadId, useCase);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-analyses'] });
      toast({
        title: "Analysis Complete",
        description: "Your design analysis is ready!",
      });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      
      // Update status to failed
      supabase
        .from('design_uploads')
        .update({ status: 'failed' })
        .eq('id', error.uploadId);

      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message,
      });
    }
  });
};
