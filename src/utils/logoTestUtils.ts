
import { supabase } from '@/integrations/supabase/client';

export const testStorageAccess = async () => {
  try {
    console.log('=== LOGO STORAGE ACCESS TEST START ===');
    
    // Step 1: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      return { 
        success: false, 
        error: `Authentication failed: ${authError.message}`,
        details: { step: 'authentication', authError }
      };
    }

    if (!user) {
      console.error('No authenticated user found');
      return { 
        success: false, 
        error: 'User not authenticated. Please sign in.',
        details: { step: 'authentication', user: null }
      };
    }

    console.log('✓ User authenticated for storage test:', user.id);

    // Step 2: Test bucket access
    console.log('Testing design-uploads bucket access...');
    
    try {
      // Try to list files in the bucket
      const { data: files, error: listError } = await supabase.storage
        .from('design-uploads')
        .list('assets/branding/logo', {
          limit: 5
        });

      if (listError) {
        console.error('Bucket list operation failed:', listError);
        
        // Check if it's a bucket not found error
        if (listError.message?.toLowerCase().includes('not found') || 
            listError.message?.toLowerCase().includes('does not exist')) {
          return { 
            success: false, 
            error: 'Storage bucket "design-uploads" not found. Storage setup required.',
            details: { step: 'bucket_missing', listError }
          };
        }
        
        // For other errors, still consider it a failure but with different message
        return { 
          success: false, 
          error: `Bucket access failed: ${listError.message}`,
          details: { step: 'bucket_access', listError }
        };
      }

      console.log('✓ Bucket access successful, found', files?.length || 0, 'logo files');

      // Step 3: Test a simple upload to verify write permissions
      console.log('Testing upload permissions...');
      
      // Create a minimal test file
      const testData = new Uint8Array([1, 2, 3, 4]); // Minimal test data
      const testBlob = new Blob([testData], { type: 'application/octet-stream' });
      const testFile = new File([testBlob], 'logo-test.bin', { type: 'application/octet-stream' });
      
      const testPath = `assets/branding/logo/test-${user.id}-${Date.now()}.bin`;
      
      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(testPath, testFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload test failed:', uploadError);
        return { 
          success: false, 
          error: `Upload test failed: ${uploadError.message}`,
          details: { step: 'upload_test', uploadError, testPath }
        };
      }

      console.log('✓ Upload test successful');

      // Step 4: Clean up test file
      try {
        await supabase.storage
          .from('design-uploads')
          .remove([testPath]);
        console.log('✓ Test file cleanup successful');
      } catch (cleanupError) {
        console.warn('Test file cleanup failed (non-critical):', cleanupError);
      }

      return { 
        success: true, 
        bucket: { id: 'design-uploads', name: 'design-uploads' }, 
        files: files,
        details: {
          userId: user.id,
          filesFound: files?.length || 0,
          uploadTest: true,
          testPath
        }
      };
      
    } catch (storageError) {
      console.error('Storage operations failed:', storageError);
      return { 
        success: false, 
        error: `Storage system error: ${storageError instanceof Error ? storageError.message : 'Unknown error'}`,
        details: { step: 'storage_operations', storageError }
      };
    }
    
  } catch (error) {
    console.error('Unexpected error in storage access test:', error);
    return { 
      success: false, 
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: { step: 'unexpected', error }
    };
  }
};

export const testImageUrl = async (url: string): Promise<boolean> => {
  try {
    console.log('=== IMAGE URL TEST START ===');
    console.log('Testing image URL accessibility:', url);
    
    // For local assets (like the default fallback), assume they're accessible
    if (url.startsWith('/lovable-uploads/') || url.startsWith('/')) {
      console.log('✓ Local asset URL detected, assuming accessible:', url);
      return true;
    }
    
    // For Supabase storage URLs, try to fetch with proper headers
    if (url.includes('supabase.co/storage')) {
      console.log('Testing Supabase storage URL...');
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      console.log('Supabase storage URL test response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      return response.ok;
    }
    
    // For other URLs, use image loading test
    console.log('Testing external URL with image loading...');
    
    return new Promise((resolve) => {
      const img = new Image();
      const timeout = setTimeout(() => {
        console.warn('Image URL test timeout for:', url);
        resolve(false);
      }, 5000);
      
      img.onload = () => {
        clearTimeout(timeout);
        console.log('✓ Image URL test successful for:', url);
        resolve(true);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        console.error('✗ Image URL test failed for:', url);
        resolve(false);
      };
      
      // Set crossOrigin for external URLs
      if (url.includes('supabase') || !url.startsWith('/')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.src = url;
    });
    
  } catch (error) {
    console.error('Image URL test error:', error);
    return false;
  }
};
