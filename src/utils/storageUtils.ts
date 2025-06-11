
import { supabase } from '@/integrations/supabase/client';

export const verifyStorageAccess = async () => {
  try {
    console.log('Verifying storage bucket access...');
    
    // Check if design-uploads bucket exists and is accessible
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Failed to list buckets:', bucketsError);
      return { success: false, error: 'Failed to access storage buckets' };
    }

    const designUploadsBucket = buckets.find(bucket => bucket.id === 'design-uploads');
    
    if (!designUploadsBucket) {
      console.error('design-uploads bucket not found');
      return { success: false, error: 'design-uploads bucket not found' };
    }

    console.log('Storage bucket access verified successfully');
    return { success: true };

  } catch (error) {
    console.error('Storage verification error:', error);
    return { success: false, error: 'Unexpected error during storage verification' };
  }
};

export const testFileUpload = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create a small test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    const testPath = `${user.id}/test-${Date.now()}.txt`;
    
    console.log('Testing file upload to:', testPath);
    
    // Try to upload the test file
    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('Test upload failed:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Clean up the test file
    await supabase.storage
      .from('design-uploads')
      .remove([testPath]);

    console.log('Test upload successful');
    return { success: true };

  } catch (error) {
    console.error('Test upload error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
