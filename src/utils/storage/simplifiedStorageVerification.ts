
import { supabase } from '@/integrations/supabase/client';

export interface SimplifiedStorageResult {
  success: boolean;
  status: 'ready' | 'error' | 'unavailable';
  error?: string;
  details?: any;
  userRole?: string;
  isAuthenticated: boolean;
}

const SIMPLIFIED_TIMEOUT = 5000; // 5 seconds timeout

export const verifyStorageSimplified = async (): Promise<SimplifiedStorageResult> => {
  try {
    console.log('=== SIMPLIFIED STORAGE VERIFICATION START ===');
    
    // Step 1: Quick auth check with timeout
    const authPromise = supabase.auth.getUser();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Auth timeout')), 3000);
    });

    let user;
    let authError;
    
    try {
      const { data: { user: authUser }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
      user = authUser;
      authError = error;
    } catch (error) {
      console.warn('Simplified verification: Auth check failed:', error);
      return {
        success: false,
        status: 'error',
        error: 'Authentication check failed',
        isAuthenticated: false,
        details: { step: 'auth_timeout', error }
      };
    }

    if (authError || !user) {
      console.log('Simplified verification: User not authenticated');
      return {
        success: false,
        status: 'unavailable',
        error: 'Authentication required',
        isAuthenticated: false,
        details: { step: 'not_authenticated' }
      };
    }

    console.log('✓ Simplified verification: User authenticated:', user.id);

    // Step 2: Get user role quickly (with fallback)
    let userRole = 'subscriber';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile?.role) {
        userRole = profile.role;
      }
    } catch (error) {
      console.warn('Simplified verification: Could not fetch role, using default:', error);
    }

    console.log('✓ Simplified verification: User role:', userRole);

    // Step 3: Quick bucket check based on role
    if (userRole === 'owner') {
      // For owners, do a quick bucket test
      try {
        const listPromise = supabase.storage
          .from('design-uploads')
          .list('', { limit: 1 });
        
        const listTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Bucket timeout')), 3000);
        });

        const { error: listError } = await Promise.race([listPromise, listTimeoutPromise]) as any;
        
        if (listError) {
          console.error('Simplified verification: Bucket access failed for owner:', listError);
          return {
            success: false,
            status: 'error',
            error: 'Storage bucket not accessible',
            isAuthenticated: true,
            userRole,
            details: { step: 'owner_bucket_check', listError }
          };
        }

        console.log('✓ Simplified verification: Owner storage access confirmed');
        return {
          success: true,
          status: 'ready',
          isAuthenticated: true,
          userRole,
          details: { step: 'complete', verification: 'owner_simplified' }
        };

      } catch (error) {
        console.error('Simplified verification: Owner bucket check failed:', error);
        return {
          success: false,
          status: 'error',
          error: 'Storage verification failed',
          isAuthenticated: true,
          userRole,
          details: { step: 'owner_verification_error', error }
        };
      }
    } else {
      // For subscribers, assume storage is available but limited
      console.log('✓ Simplified verification: Subscriber access granted');
      return {
        success: true,
        status: 'ready',
        isAuthenticated: true,
        userRole,
        details: { step: 'complete', verification: 'subscriber_simplified' }
      };
    }

  } catch (error) {
    console.error('Simplified verification: Unexpected error:', error);
    return {
      success: false,
      status: 'error',
      error: 'Storage verification failed',
      isAuthenticated: false,
      details: { step: 'unexpected', error }
    };
  }
};
