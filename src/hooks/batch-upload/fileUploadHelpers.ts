
import { supabase } from '@/integrations/supabase/client';

export const uploadFile = async (file: File, userId: string, filePath: string) => {
  const { error: uploadError } = await supabase.storage
    .from('design-uploads')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`File upload failed for ${file.name}: ${uploadError.message}`);
  }
};

export const generateFilePath = (userId: string, file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  return `${userId}/${fileName}`;
};

export const generateContextFilePath = (userId: string, file: File, batchId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `context/${batchId}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  return `${userId}/${fileName}`;
};

export const extractTextPreview = async (file: File): Promise<string | null> => {
  if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
    try {
      const text = await file.text();
      return text.slice(0, 1000); // First 1000 characters
    } catch (error) {
      console.warn('Could not extract text preview:', error);
      return null;
    }
  }
  return null;
};
