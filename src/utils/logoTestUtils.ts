
import { supabase } from '@/integrations/supabase/client';

export const testStorageAccess = async () => {
  try {
    console.log('Testing storage access...');
    
    // Test bucket access
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError);
      return { success: false, error: 'Failed to access storage buckets' };
    }
    
    console.log('Available buckets:', buckets);
    
    // Check if design-uploads bucket exists
    const designUploadsBucket = buckets.find(bucket => bucket.id === 'design-uploads');
    if (!designUploadsBucket) {
      console.error('design-uploads bucket not found');
      return { success: false, error: 'design-uploads bucket not found' };
    }
    
    console.log('design-uploads bucket config:', designUploadsBucket);
    
    // Test listing files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('design-uploads')
      .list('assets/branding/logo', {
        limit: 10
      });
      
    if (filesError) {
      console.error('Failed to list files:', filesError);
      return { success: false, error: 'Failed to list files in bucket' };
    }
    
    console.log('Files in assets/branding/logo:', files);
    
    return { 
      success: true, 
      bucket: designUploadsBucket, 
      files: files 
    };
    
  } catch (error) {
    console.error('Storage access test error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('Testing image URL:', url);
    
    // For Supabase storage URLs, try to fetch with proper headers
    if (url.includes('supabase')) {
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      console.log('Image URL test response:', response.status, response.statusText);
      return response.ok;
    }
    
    // For other URLs, use image loading test
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('Image URL test timeout');
        resolve(false);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('Image URL test successful');
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('Image URL test failed');
        resolve(false);
      };
      
      img.src = url;
    });
    
  } catch (error) {
    console.error('Image URL test error:', error);
    return false;
  }
};
