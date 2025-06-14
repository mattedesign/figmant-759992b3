
import { supabase } from '@/integrations/supabase/client';

export const verifyStorageAccess = async () => {
  try {
    console.log('=== ENHANCED STORAGE VERIFICATION START ===');
    
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

    // Step 2: Check if design-uploads bucket exists, create if needed
    console.log('Checking storage bucket configuration...');
    
    try {
      // Try to list files in the design-uploads bucket
      const { data: files, error: listError } = await supabase.storage
        .from('design-uploads')
        .list('', { 
          limit: 1,
          offset: 0
        });

      if (listError) {
        console.log('Bucket access failed, checking if bucket exists:', listError);
        
        // If bucket doesn't exist, we need to create it via the database
        if (listError.message?.toLowerCase().includes('not found') || 
            listError.message?.toLowerCase().includes('does not exist')) {
          
          console.log('Bucket does not exist, attempting to create it...');
          
          // Note: We can't create buckets directly from the client
          // This should be handled by the database migration
          return { 
            success: false, 
            error: 'Storage bucket "design-uploads" not found. Please contact your administrator to run the storage setup migration.',
            details: { 
              step: 'bucket_missing', 
              listError,
              suggestion: 'Run the storage configuration migration'
            }
          };
        }
        
        // For other errors, continue with upload test
        console.warn('List operation failed but bucket might still be accessible:', listError);
      } else {
        console.log('✓ Bucket access successful, found', files?.length || 0, 'files');
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
      
      const testPath = `verification/${user.id}/test-${Date.now()}.png`;
      
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

      // Step 4: Test public URL generation
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(testPath);

      console.log('✓ Public URL generated:', publicUrl);

      // Step 5: Clean up test file (non-critical)
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

      console.log('=== ENHANCED STORAGE VERIFICATION SUCCESS ===');
      return { 
        success: true,
        details: { 
          userId: user.id,
          bucketAccessible: true,
          uploadTest: true,
          listTest: !listError,
          publicUrlTest: true,
          testPath
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
