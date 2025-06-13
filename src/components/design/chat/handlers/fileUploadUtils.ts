
import { supabase } from '@/integrations/supabase/client';

export const uploadFileToStorage = async (file: File): Promise<string> => {
  console.log('=== FILE UPLOAD UTILS TESTING ===');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated for file upload');
    throw new Error('User not authenticated');
  }

  console.log('User authenticated for upload:', user.id);

  const fileExt = file.name.split('.').pop();
  const fileName = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  console.log('Uploading file to storage:', { fileName, filePath, fileSize: file.size, fileType: file.type });

  const { error: uploadError } = await supabase.storage
    .from('design-uploads')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  console.log('File uploaded successfully:', filePath);
  console.log('=== FILE UPLOAD UTILS TESTING COMPLETE ===');
  return filePath;
};
