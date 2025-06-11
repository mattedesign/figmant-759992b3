
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DesignContextFile } from '@/types/design';

export const useDesignContextFiles = (uploadId?: string) => {
  return useQuery({
    queryKey: ['design-context-files', uploadId],
    queryFn: async (): Promise<DesignContextFile[]> => {
      let query = supabase.from('design_context_files').select('*');
      
      if (uploadId) {
        query = query.eq('upload_id', uploadId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as DesignContextFile[];
    },
    enabled: !!uploadId
  });
};

export const useUploadContextFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ uploadId, file }: { uploadId: string; file: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      console.log('Uploading context file:', { uploadId, fileName: file.name });

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `context/${uploadId}/${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Context file upload error:', uploadError);
        throw new Error(`Context file upload failed: ${uploadError.message}`);
      }

      // Get text content preview for supported file types
      let contentPreview = null;
      if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
        try {
          const text = await file.text();
          contentPreview = text.slice(0, 1000); // First 1000 characters
        } catch (error) {
          console.warn('Could not extract text preview:', error);
        }
      }

      // Create database record
      const { data, error } = await supabase
        .from('design_context_files')
        .insert({
          upload_id: uploadId,
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          content_preview: contentPreview
        })
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Context file record created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-context-files'] });
      toast({
        title: "Context File Uploaded",
        description: "Additional context file has been uploaded successfully.",
      });
    },
    onError: (error) => {
      console.error('Context file upload failed:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message,
      });
    }
  });
};

export const useDeleteContextFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (contextFileId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get the file details first
      const { data: contextFile } = await supabase
        .from('design_context_files')
        .select('file_path')
        .eq('id', contextFileId)
        .single();

      if (contextFile?.file_path) {
        // Delete from storage
        await supabase.storage
          .from('design-uploads')
          .remove([contextFile.file_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('design_context_files')
        .delete()
        .eq('id', contextFileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-context-files'] });
      toast({
        title: "Context File Deleted",
        description: "Context file has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Context file deletion failed:', error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: error.message,
      });
    }
  });
};
