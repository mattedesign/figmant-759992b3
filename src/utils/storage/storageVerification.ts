
import { supabase } from '@/integrations/supabase/client';

export const verifyStorageAccess = async () => {
  try {
    console.log('=== STORAGE VERIFICATION START ===');
    
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

    // Step 2: Test basic bucket access with simplified approach
    try {
      console.log('Testing bucket access...');
      
      // Try to list buckets first
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Failed to list buckets:', bucketsError);
        return { 
          success: false, 
          error: 'Cannot access storage buckets. Please check your connection.',
          details: { step: 'bucket_list', bucketsError }
        };
      }

      console.log('Available buckets:', buckets?.map(b => b.name) || []);

      // Check if design-uploads bucket exists
      const designUploadsBucket = buckets?.find(bucket => bucket.name === 'design-uploads');
      if (!designUploadsBucket) {
        console.error('design-uploads bucket not found in:', buckets?.map(b => b.name));
        return { 
          success: false, 
          error: 'Storage bucket "design-uploads" not found. Please contact your administrator.',
          details: { step: 'bucket_check', availableBuckets: buckets?.map(b => b.name) }
        };
      }

      console.log('✓ design-uploads bucket found:', designUploadsBucket);

      // Step 3: Test file operations with a simple list operation
      console.log('Testing file operations...');
      
      const { data: files, error: listError } = await supabase.storage
        .from('design-uploads')
        .list('', { limit: 1 });

      if (listError) {
        console.warn('File listing failed (this may be normal for empty buckets):', listError);
        // Don't fail verification just because listing failed - bucket might be empty or have permission issues
      } else {
        console.log('✓ File listing successful, found', files?.length || 0, 'files');
      }

      // Step 4: Test upload permissions with a minimal test
      console.log('Testing upload permissions...');
      
      // Create a minimal test blob
      const testData = new Uint8Array([0x89, 0x50, 0x4E, 0x47]); // PNG header
      const testBlob = new Blob([testData], { type: 'image/png' });
      const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
      
      const testPath = `${user.id}/verification-${Date.now()}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from('design-uploads')
        .upload(testPath, testFile);

      if (uploadError) {
        console.error('Upload test failed:', uploadError);
        return { 
          success: false, 
          error: `Upload permissions issue: ${uploadError.message}`,
          details: { step: 'upload_test', uploadError, testPath }
        };
      }

      console.log('✓ Upload test successful');

      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('design-uploads')
        .remove([testPath]);

      if (deleteError) {
        console.warn('Test file cleanup failed (non-critical):', deleteError);
      } else {
        console.log('✓ Test file cleaned up');
      }

      console.log('=== STORAGE VERIFICATION SUCCESS ===');
      return { 
        success: true,
        details: { 
          userId: user.id,
          bucketFound: true,
          uploadTest: true,
          cleanupTest: !deleteError
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
