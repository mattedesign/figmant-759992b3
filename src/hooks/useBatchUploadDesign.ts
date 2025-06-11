
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BatchUpload } from '@/types/design';
import { triggerAnalysis } from './designAnalysisHelpers';

export const useBatchUploadDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ files, urls, useCase, batchName }: BatchUpload) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const batchId = crypto.randomUUID();
      const uploads = [];

      console.log('Starting batch upload...', { 
        filesCount: files.length, 
        urlsCount: urls.length, 
        batchId 
      });

      // Handle file uploads
      for (const file of files) {
        console.log('Processing file:', file.name);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('design-uploads')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`File upload failed for ${file.name}: ${uploadError.message}`);
        }

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
            source_type: 'file',
            source_url: null,
            batch_id: batchId,
            batch_name: batchName
          })
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          throw new Error(`Database error for ${file.name}: ${error.message}`);
        }

        uploads.push(data);
      }

      // Handle URL uploads
      for (const url of urls) {
        console.log('Processing URL:', url);
        
        try {
          new URL(url); // Validate URL format
        } catch {
          throw new Error(`Invalid URL format: ${url}`);
        }

        const { data, error } = await supabase
          .from('design_uploads')
          .insert({
            user_id: user.id,
            file_name: new URL(url).hostname,
            file_path: null,
            file_size: null,
            file_type: null,
            use_case: useCase,
            status: 'pending',
            source_type: 'url',
            source_url: url,
            batch_id: batchId,
            batch_name: batchName
          })
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          throw new Error(`Database error for URL ${url}: ${error.message}`);
        }

        uploads.push(data);
      }

      console.log('Batch upload completed:', uploads.length, 'items');
      return { uploads, batchId };
    },
    onSuccess: async (result, variables) => {
      console.log('Batch upload successful, triggering analyses...');
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      
      // Get the use case details for analysis
      const { data: useCase } = await supabase
        .from('design_use_cases')
        .select('*')
        .eq('id', variables.useCase)
        .single();

      if (useCase) {
        // Trigger analysis for each upload
        const analysisPromises = result.uploads.map(upload => 
          triggerAnalysis(upload.id, useCase).catch(error => {
            console.error(`Analysis failed for ${upload.file_name}:`, error);
            return null;
          })
        );

        await Promise.allSettled(analysisPromises);
      }

      toast({
        title: "Batch Upload Complete",
        description: `Successfully uploaded ${result.uploads.length} items for analysis.`,
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
