
import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (file: File): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  console.log('Uploading file to storage:', { fileName, filePath, fileSize: file.size });

  const { error: uploadError } = await supabase.storage
    .from('design-uploads')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  console.log('File uploaded successfully:', filePath);
  return filePath;
};
