
import { supabase } from '@/integrations/supabase/client';
import { Asset, ASSET_CATEGORIES } from '@/types/assets';

export const uploadAssetToStorage = async (
  file: File,
  type: Asset['type'],
  category: string = ASSET_CATEGORIES.CONTENT,
  userId: string
): Promise<{ publicUrl: string; uploadPath: string }> => {
  // Create organized file path with sanitized file name
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  const randomId = Math.random().toString(36).substr(2, 9);
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const organizedPath = `assets/${category}/${type}/${timestamp}/${randomId}_${sanitizedFileName}`;

  console.log('Uploading asset to organized path:', organizedPath);
  console.log('File type:', file.type, 'File size:', file.size);

  // Upload to Supabase storage
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('design-uploads')
    .upload(organizedPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error details:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  console.log('Upload successful:', uploadData);

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('design-uploads')
    .getPublicUrl(organizedPath);

  console.log('Generated public URL:', publicUrl);

  return { publicUrl, uploadPath: organizedPath };
};

export const deleteAssetFromStorage = async (uploadPath: string): Promise<void> => {
  console.log('Deleting asset from path:', uploadPath);

  const { error } = await supabase.storage
    .from('design-uploads')
    .remove([uploadPath]);

  if (error) {
    console.error('Delete error:', error);
    throw new Error(`Delete failed: ${error.message}`);
  }

  console.log('Asset deleted successfully');
};
