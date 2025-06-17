
import { supabase } from '@/integrations/supabase/client';
import { Asset } from '@/types/assets';

export const replaceAssetOperation = async (
  existingAsset: Asset, 
  newFile: File,
  userId: string
): Promise<Asset | null> => {
  try {
    console.log('Starting asset replacement:', { 
      existingAsset: existingAsset.name,
      newFileName: newFile.name, 
      newFileType: newFile.type, 
      newFileSize: newFile.size 
    });

    // Use the existing upload path to replace the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(existingAsset.uploadPath, newFile, {
        cacheControl: '3600',
        upsert: true // This will replace the existing file
      });

    if (uploadError) {
      console.error('Replace upload error:', uploadError);
      throw uploadError;
    }

    console.log('Replace upload successful:', uploadData);

    // Get the public URL (should be the same as before)
    const { data: urlData } = supabase.storage
      .from('design-uploads')
      .getPublicUrl(existingAsset.uploadPath);

    console.log('Updated public URL:', urlData.publicUrl);

    // Create the updated Asset object
    const updatedAsset: Asset = {
      ...existingAsset,
      name: newFile.name,
      fileSize: newFile.size,
      mimeType: newFile.type,
      uploadedAt: new Date().toISOString(),
      url: urlData.publicUrl // URL stays the same but content is updated
    };

    console.log('Updated asset object created:', updatedAsset);
    return updatedAsset;
  } catch (error) {
    console.error('Error replacing asset:', error);
    return null;
  }
};
