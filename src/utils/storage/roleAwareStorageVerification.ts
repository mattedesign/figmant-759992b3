
import { supabase } from '@/integrations/supabase/client';

export interface RoleAwareStorageResult {
  success: boolean;
  status: 'checking' | 'ready' | 'error' | 'unavailable';
  error?: string;
  details?: any;
  userRole?: string;
  isAuthenticated: boolean;
}

export const verifyStorageForRole = async (): Promise<RoleAwareStorageResult> => {
  try {
    console.log('=== ROLE-AWARE STORAGE VERIFICATION START ===');
    
    // Step 1: Check authentication status with timeout
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Authentication timeout')), 5000);
    });

    let user;
    let authError;
    
    try {
      const { data: { user: authUser }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
      user = authUser;
      authError = error;
    } catch (error) {
      console.warn('Auth check timed out or failed:', error);
      return {
        success: false,
        status: 'checking',
        error: 'Authentication check in progress...',
        isAuthenticated: false,
        details: { step: 'auth_timeout', error }
      };
    }

    if (authError) {
      console.error('Authentication error:', authError);
      return {
        success: false,
        status: 'error',
        error: 'Authentication failed. Please sign in again.',
        isAuthenticated: false,
        details: { step: 'auth_error', authError }
      };
    }

    if (!user) {
      console.log('User not authenticated');
      return {
        success: false,
        status: 'unavailable',
        error: 'Please sign in to access file uploads.',
        isAuthenticated: false,
        details: { step: 'not_authenticated' }
      };
    }

    console.log('✓ User authenticated:', user.id);

    // Step 2: Get user role from profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('Could not fetch user role:', profileError);
      // Continue without role for basic verification
    }

    const userRole = profile?.role || 'subscriber';
    console.log('✓ User role:', userRole);

    // Step 3: Role-based storage verification
    if (userRole === 'owner') {
      // Owners get full storage verification
      return await performFullStorageVerification(user.id, userRole);
    } else {
      // Subscribers get simplified verification
      return await performSubscriberStorageVerification(user.id, userRole);
    }

  } catch (error) {
    console.error('Unexpected error during role-aware storage verification:', error);
    return {
      success: false,
      status: 'error',
      error: 'Storage verification failed. Please try again.',
      isAuthenticated: false,
      details: { step: 'unexpected', error }
    };
  }
};

const performFullStorageVerification = async (userId: string, userRole: string): Promise<RoleAwareStorageResult> => {
  try {
    console.log('Performing full storage verification for owner...');
    
    // Test bucket access
    const { data: files, error: listError } = await supabase.storage
      .from('design-uploads')
      .list('', { limit: 1 });

    if (listError) {
      console.error('Bucket access failed:', listError);
      return {
        success: false,
        status: 'error',
        error: 'Storage bucket not accessible. Please check configuration.',
        isAuthenticated: true,
        userRole,
        details: { step: 'bucket_access', listError }
      };
    }

    // Test upload with minimal file
    const testData = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const testBlob = new Blob([testData], { type: 'image/png' });
    const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
    const testPath = `verification/${userId}/test-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('design-uploads')
      .upload(testPath, testFile, { upsert: false });

    if (uploadError) {
      console.error('Upload test failed:', uploadError);
      return {
        success: false,
        status: 'error',
        error: 'Upload permissions not configured properly.',
        isAuthenticated: true,
        userRole,
        details: { step: 'upload_test', uploadError }
      };
    }

    // Cleanup test file
    await supabase.storage.from('design-uploads').remove([testPath]);

    console.log('✓ Full storage verification successful');
    return {
      success: true,
      status: 'ready',
      isAuthenticated: true,
      userRole,
      details: { step: 'complete', verification: 'full' }
    };

  } catch (error) {
    console.error('Full storage verification failed:', error);
    return {
      success: false,
      status: 'error',
      error: 'Storage verification failed.',
      isAuthenticated: true,
      userRole,
      details: { step: 'full_verification_error', error }
    };
  }
};

const performSubscriberStorageVerification = async (userId: string, userRole: string): Promise<RoleAwareStorageResult> => {
  try {
    console.log('Performing simplified storage verification for subscriber...');
    
    // For subscribers, just check if bucket is accessible
    const { error: listError } = await supabase.storage
      .from('design-uploads')
      .list('', { limit: 1 });

    if (listError) {
      console.warn('Bucket access failed for subscriber:', listError);
      return {
        success: false,
        status: 'unavailable',
        error: 'File uploads are currently unavailable. Please contact support if you need this feature.',
        isAuthenticated: true,
        userRole,
        details: { step: 'subscriber_bucket_check', listError }
      };
    }

    console.log('✓ Simplified storage verification successful');
    return {
      success: true,
      status: 'ready',
      isAuthenticated: true,
      userRole,
      details: { step: 'complete', verification: 'simplified' }
    };

  } catch (error) {
    console.error('Subscriber storage verification failed:', error);
    return {
      success: false,
      status: 'unavailable',
      error: 'Storage access unavailable.',
      isAuthenticated: true,
      userRole,
      details: { step: 'subscriber_verification_error', error }
    };
  }
};
