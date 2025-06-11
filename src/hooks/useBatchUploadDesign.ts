
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BatchUpload } from '@/types/design';
import { triggerAnalysis, triggerBatchAnalysis } from './designAnalysisHelpers';

export const useBatchUploadDesign = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ files, urls, contextFiles = [], useCase, batchName, analysisGoals, analysisPreferences }: BatchUpload) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const batchId = crypto.randomUUID();
      const uploads = [];

      console.log('Starting batch upload...', { 
        filesCount: files.length, 
        urlsCount: urls.length,
        contextFilesCount: contextFiles.length,
        batchId,
        analysisGoals,
        analysisPreferences
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
            batch_name: batchName,
            analysis_goals: analysisGoals || null,
            analysis_preferences: analysisPreferences ? JSON.parse(JSON.stringify(analysisPreferences)) : null
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
            batch_name: batchName,
            analysis_goals: analysisGoals || null,
            analysis_preferences: analysisPreferences ? JSON.parse(JSON.stringify(analysisPreferences)) : null
          })
          .select()
          .single();

        if (error) {
          console.error('Database insert error:', error);
          throw new Error(`Database error for URL ${url}: ${error.message}`);
        }

        uploads.push(data);
      }

      // Handle context files upload
      const contextFileUploads = [];
      for (const contextFile of contextFiles) {
        console.log('Processing context file:', contextFile.name);
        
        const fileExt = contextFile.name.split('.').pop();
        const fileName = `context/${batchId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('design-uploads')
          .upload(filePath, contextFile);

        if (uploadError) {
          console.error('Context file upload error:', uploadError);
          throw new Error(`Context file upload failed for ${contextFile.name}: ${uploadError.message}`);
        }

        // Get text content preview for supported file types
        let contentPreview = null;
        if (contextFile.type.startsWith('text/') || contextFile.name.endsWith('.md')) {
          try {
            const text = await contextFile.text();
            contentPreview = text.slice(0, 1000); // First 1000 characters
          } catch (error) {
            console.warn('Could not extract text preview:', error);
          }
        }

        const { data: contextData, error: contextError } = await supabase
          .from('design_context_files')
          .insert({
            upload_id: uploads[0]?.id || batchId, // Associate with first upload or batch
            user_id: user.id,
            file_name: contextFile.name,
            file_path: filePath,
            file_type: contextFile.type,
            file_size: contextFile.size,
            content_preview: contentPreview
          })
          .select()
          .single();

        if (contextError) {
          console.error('Context file database error:', contextError);
          // Don't fail the whole upload for context file issues
          console.warn(`Context file ${contextFile.name} could not be saved to database`);
        } else {
          contextFileUploads.push(contextData);
        }
      }

      console.log('Batch upload completed:', uploads.length, 'items,', contextFileUploads.length, 'context files');
      return { uploads, batchId, contextFiles: contextFileUploads };
    },
    onSuccess: async (result, variables) => {
      console.log('Batch upload successful, triggering analyses...');
      queryClient.invalidateQueries({ queryKey: ['design-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['design-context-files'] });
      
      // Get the use case details for analysis
      const { data: useCase } = await supabase
        .from('design_use_cases')
        .select('*')
        .eq('id', variables.useCase)
        .single();

      if (useCase) {
        // Trigger individual analyses for each upload
        const analysisPromises = result.uploads.map(upload => 
          triggerAnalysis(upload.id, useCase).catch(error => {
            console.error(`Analysis failed for ${upload.file_name}:`, error);
            return null;
          })
        );

        await Promise.allSettled(analysisPromises);

        // If multiple items and auto_comparative is enabled, trigger batch analysis
        const shouldTriggerBatchAnalysis = result.uploads.length > 1 && 
          variables.analysisPreferences?.auto_comparative;

        if (shouldTriggerBatchAnalysis) {
          console.log('Triggering batch comparative analysis...');
          try {
            await triggerBatchAnalysis(result.batchId, useCase);
            console.log('Batch analysis completed successfully');
          } catch (error) {
            console.error('Batch analysis failed:', error);
            // Don't fail the whole operation for batch analysis issues
          }
        }
      }

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
