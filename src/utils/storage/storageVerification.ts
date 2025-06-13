
import { supabase } from '@/integrations/supabase/client';

export const verifyStorageAccess = async () => {
  try {
    console.log('=== SIMPLIFIED STORAGE VERIFICATION START ===');
    
    // Step 1: Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      return { 
        success: false, 
        error: 'Authentication failed. Please sign in again.',
        details: { step: 'auth_check', authError }
      };
    }

    if (!user) {
      console.error('No authenticated user found');
      return { 
        success: false, 
        error: 'User not authenticated. Please sign in.',
        details: { step: 'auth_check', user: null }
      };
    }

    console.log('✓ User authenticated:', user.id);

    // Step 2: Test direct bucket access with a simple operation
    // Instead of listing buckets, try a direct operation on the known bucket
    try {
      console.log('Testing direct bucket access...');
      
      // Try to list files in the design-uploads bucket with a very small limit
      // This will tell us if the bucket exists and is accessible
      const { data: files, error: listError } = await supabase.storage
        .from('design-uploads')
        .list('', { 
          limit: 1,
          offset: 0
        });

      if (listError) {
        console.error('Direct bucket access failed:', listError);
        
        // Check if it's a "bucket not found" error
        if (listError.message?.toLowerCase().includes('not found') || 
            listError.message?.toLowerCase().includes('does not exist')) {
          return { 
            success: false, 
            error: 'Storage bucket "design-uploads" not found. Please contact your administrator.',
            details: { step: 'bucket_access', listError }
          };
        }
        
        // For other errors, it might still be accessible for uploads
        console.warn('List operation failed but bucket might still be accessible:', listError);
      } else {
        console.log('✓ Direct bucket access successful, found', files?.length || 0, 'files');
      }

      // Step 3: Test upload permissions with a minimal test file
      console.log('Testing upload permissions...');
      
      // Create a minimal test blob (1x1 pixel PNG)
      const testData = new Uint8Array([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, // IHDR data
        0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
        0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00, 0x05, 0x00, 0x01, // compressed data
        0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00, 0x00, 0x00, // IDAT end
        0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82  // IEND chunk
      ]);
      
      const testBlob = new Blob([testData], { type: 'image/png' });
      const testFile = new File([testBlob], 'verification-test.png', { type: 'image/png' });
      
      const testPath = `${user.id}/storage-verification-${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(testPath, testFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload test failed:', uploadError);
        
        // Provide specific error messages based on error type
        let errorMessage = 'Storage upload failed';
        if (uploadError.message?.toLowerCase().includes('not found')) {
          errorMessage = 'Storage bucket not accessible. Please contact your administrator.';
        } else if (uploadError.message?.toLowerCase().includes('policy')) {
          errorMessage = 'Upload permission denied. Please check your account settings.';
        } else if (uploadError.message?.toLowerCase().includes('size')) {
          errorMessage = 'File size exceeds storage limits.';
        } else {
          errorMessage = `Upload failed: ${uploadError.message}`;
        }
        
        return { 
          success: false, 
          error: errorMessage,
          details: { step: 'upload_test', uploadError, testPath }
        };
      }

      console.log('✓ Upload test successful');

      // Step 4: Clean up test file (non-critical)
      try {
        const { error: deleteError } = await supabase.storage
          .from('design-uploads')
          .remove([testPath]);

        if (deleteError) {
          console.warn('Test file cleanup failed (non-critical):', deleteError);
        } else {
          console.log('✓ Test file cleaned up');
        }
      } catch (cleanupError) {
        console.warn('Cleanup error (non-critical):', cleanupError);
      }

      console.log('=== SIMPLIFIED STORAGE VERIFICATION SUCCESS ===');
      return { 
        success: true,
        details: { 
          userId: user.id,
          bucketAccessible: true,
          uploadTest: true,
          listTest: !listError
        }
      };

    } catch (storageError) {
      console.error('Storage operation failed:', storageError);
      return { 
        success: false, 
        error: 'Storage system error. Please try again or contact support.',
        details: { step: 'storage_operations', storageError }
      };
    }

  } catch (error) {
    console.error('Unexpected error during storage verification:', error);
    return { 
      success: false, 
      error: 'Unexpected error during storage verification. Please try again.',
      details: { step: 'unexpected', error }
    };
  }
};
