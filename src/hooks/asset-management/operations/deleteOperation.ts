
import { supabase } from '@/integrations/supabase/client';
import { Asset } from '@/types/assets';

export const deleteAssetOperation = async (
  asset: Asset,
  userId: string
): Promise<boolean> => {
  try {
    console.log('Deleting asset:', asset.name, 'Path:', asset.uploadPath);

    // Extract the file path from the upload path or URL
    let filePath = asset.uploadPath;
    
    // If uploadPath doesn't start with 'assets/', try to extract from URL
    if (!filePath.startsWith('assets/')) {
      const urlParts = asset.url.split('/');
      const assetsIndex = urlParts.findIndex(part => part === 'assets');
      if (assetsIndex !== -1) {
        filePath = urlParts.slice(assetsIndex).join('/');
      }
    }

    console.log('Attempting to delete file at path:', filePath);

    const { error } = await supabase.storage
      .from('design-uploads')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting asset from storage:', error);
      // Don't throw here - the file might already be deleted
      // Just log the error and continue
    }

    console.log('Asset deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting asset:', error);
    return false;
  }
};
