
import { supabase } from '@/integrations/supabase/client';

export interface RoleAwareStorageResult {
  success: boolean;
  status: 'checking' | 'ready' | 'error' | 'unavailable';
  error?: string;
  details?: any;
  userRole?: string;
  isAuthenticated: boolean;
}

const VERIFICATION_TIMEOUT = 8000; // 8 seconds timeout

export const verifyStorageForRole = async (): Promise<RoleAwareStorageResult> => {
  try {
    console.log('=== ROLE-AWARE STORAGE VERIFICATION START ===');
    
    // Step 1: Check authentication status with timeout
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Authentication timeout')), VERIFICATION_TIMEOUT);
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
        status: 'error',
        error: 'Authentication check timed out. Please refresh and try again.',
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

    // Step 2: Get user role from profiles with timeout
    const profilePromise = supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const profileTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Profile fetch timeout')), 3000);
    });

    let profile;
    let profileError;
    
    try {
      const result = await Promise.race([profilePromise, profileTimeoutPromise]) as any;
      profile = result.data;
      profileError = result.error;
    } catch (error) {
      console.warn('Profile fetch timed out:', error);
      // Continue with default role instead of failing
      profile = { role: 'subscriber' };
      profileError = null;
    }

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
    
    // Test bucket access with timeout
    const listPromise = supabase.storage
      .from('design-uploads')
      .list('', { limit: 1 });
    
    const listTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Bucket list timeout')), 5000);
    });

    let files, listError;
    try {
      const result = await Promise.race([listPromise, listTimeoutPromise]) as any;
      files = result.data;
      listError = result.error;
    } catch (error) {
      console.error('Bucket access timed out:', error);
      return {
        success: false,
        status: 'error',
        error: 'Storage bucket access timed out. Please try again.',
        isAuthenticated: true,
        userRole,
        details: { step: 'bucket_timeout', error }
      };
    }

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

    // Test upload with minimal file and timeout
    const testData = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const testBlob = new Blob([testData], { type: 'image/png' });
    const testFile = new File([testBlob], 'test.png', { type: 'image/png' });
    const testPath = `verification/${userId}/test-${Date.now()}.png`;

    const uploadPromise = supabase.storage
      .from('design-uploads')
      .upload(testPath, testFile, { upsert: false });
    
    const uploadTimeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload test timeout')), 5000);
    });

    let uploadError;
    try {
      const result = await Promise.race([uploadPromise, uploadTimeoutPromise]) as any;
      uploadError = result.error;
    } catch (error) {
      console.error('Upload test timed out:', error);
      return {
        success: false,
        status: 'error',
        error: 'Upload test timed out. Storage may be slow.',
        isAuthenticated: true,
        userRole,
        details: { step: 'upload_timeout', error }
      };
    }

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

    // Cleanup test file (don't fail if this doesn't work)
    try {
      await supabase.storage.from('design-uploads').remove([testPath]);
    } catch (cleanupError) {
      console.warn('Test file cleanup failed:', cleanupError);
    }

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
    
    // For subscribers, just check if bucket is accessible with timeout
    const listPromise = supabase.storage
      .from('design-uploads')
      .list('', { limit: 1 });
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Bucket check timeout')), 3000);
    });

    let listError;
    try {
      const result = await Promise.race([listPromise, timeoutPromise]) as any;
      listError = result.error;
    } catch (error) {
      console.warn('Bucket check timed out for subscriber:', error);
      return {
        success: false,
        status: 'unavailable',
        error: 'Storage check timed out. Please try again.',
        isAuthenticated: true,
        userRole,
        details: { step: 'subscriber_timeout', error }
      };
    }

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
