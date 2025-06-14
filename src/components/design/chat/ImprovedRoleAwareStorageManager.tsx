
import React, { useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyStorageForRole, RoleAwareStorageResult } from '@/utils/storage/roleAwareStorageVerification';
import { useAuth } from '@/contexts/AuthContext';

interface ImprovedRoleAwareStorageManagerProps {
  setStorageStatus: (status: 'checking' | 'ready' | 'error') => void;
  setStorageErrorDetails: (details: any) => void;
}

export const ImprovedRoleAwareStorageManager: React.FC<ImprovedRoleAwareStorageManagerProps> = ({
  setStorageStatus,
  setStorageErrorDetails
}) => {
  const { toast } = useToast();
  const { user, loading: authLoading, isOwner } = useAuth();
  const verificationAttempted = useRef(false);
  const mounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const verificationInProgress = useRef(false);

  console.log('=== IMPROVED STORAGE MANAGER DEBUG ===');
  console.log('Auth state:', { 
    user: user?.id, 
    authLoading, 
    isOwner,
    verificationAttempted: verificationAttempted.current,
    verificationInProgress: verificationInProgress.current
  });

  useEffect(() => {
    return () => {
      console.log('ImprovedRoleAwareStorageManager: Cleanup');
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const resetVerification = useCallback(() => {
    console.log('ImprovedRoleAwareStorageManager: Resetting verification state...');
    verificationAttempted.current = false;
    verificationInProgress.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const scheduleRetry = useCallback((delay: number = 3000) => {
    console.log(`ImprovedRoleAwareStorageManager: Scheduling retry in ${delay}ms`);
    retryTimeoutRef.current = setTimeout(() => {
      if (mounted.current) {
        console.log('ImprovedRoleAwareStorageManager: Executing scheduled retry');
        resetVerification();
        performRoleAwareVerification();
      }
    }, delay);
  }, []);

  const performRoleAwareVerification = useCallback(async () => {
    // Prevent multiple simultaneous verifications
    if (verificationInProgress.current) {
      console.log('ImprovedRoleAwareStorageManager: Verification already in progress, skipping');
      return;
    }

    // Skip if already attempted successfully or auth is loading
    if (verificationAttempted.current || authLoading || !mounted.current) {
      console.log('ImprovedRoleAwareStorageManager: Skipping verification', {
        verificationAttempted: verificationAttempted.current,
        authLoading,
        mounted: mounted.current
      });
      return;
    }

    console.log('ImprovedRoleAwareStorageManager: Starting role-aware storage verification...', { 
      user: user?.id, 
      authLoading, 
      isOwner 
    });
    
    verificationAttempted.current = true;
    verificationInProgress.current = true;
    setStorageStatus('checking');
    setStorageErrorDetails(null);

    // Set a more aggressive timeout to prevent getting stuck
    timeoutRef.current = setTimeout(() => {
      if (!mounted.current) return;
      
      console.warn('ImprovedRoleAwareStorageManager: Storage verification timeout reached');
      verificationInProgress.current = false;
      setStorageStatus('error');
      setStorageErrorDetails({ 
        step: 'timeout', 
        error: 'Storage verification timed out - will retry automatically',
        timeout: true,
        retryScheduled: true
      });
      
      // Show different messages based on user role
      if (user && isOwner) {
        toast({
          title: "Storage Check Timeout",
          description: "Storage verification is taking longer than expected. Retrying automatically...",
        });
      }

      // Schedule automatic retry
      scheduleRetry(5000);
    }, 7000); // Reduced timeout to 7 seconds
    
    try {
      const result: RoleAwareStorageResult = await verifyStorageForRole();
      
      if (!mounted.current) {
        verificationInProgress.current = false;
        return;
      }
      
      // Clear timeout on completion
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      verificationInProgress.current = false;
      
      console.log('ImprovedRoleAwareStorageManager: Storage verification result:', result);
      
      if (result.success) {
        setStorageStatus('ready');
        setStorageErrorDetails(null);
        
        // Only show success toast for owners
        if (result.userRole === 'owner') {
          toast({
            title: "Storage Ready",
            description: "File uploads are configured and ready to use.",
          });
        }
      } else {
        console.log('ImprovedRoleAwareStorageManager: Storage verification failed:', result);
        
        // Handle different failure scenarios with better recovery
        if (result.status === 'checking') {
          console.log('ImprovedRoleAwareStorageManager: Still in checking state, scheduling retry');
          scheduleRetry(2000);
          return;
        }
        
        if (result.status === 'unavailable') {
          setStorageStatus('error');
          setStorageErrorDetails(result.details);
          
          // Show informational message for subscribers
          if (result.userRole === 'subscriber') {
            console.log('ImprovedRoleAwareStorageManager: Storage unavailable for subscriber');
            // Don't show toast for subscribers - this is expected behavior
          }
        } else {
          setStorageStatus('error');
          setStorageErrorDetails(result.details);
          
          // Only show error toast for owners and consider retry
          if (result.userRole === 'owner') {
            toast({
              variant: "destructive",
              title: "Storage Configuration Issue",
              description: result.error || "Unable to access file storage. Will retry automatically.",
            });
            
            // Schedule retry for owners as this might be a temporary issue
            scheduleRetry(10000);
          }
        }
      }
    } catch (error) {
      if (!mounted.current) {
        verificationInProgress.current = false;
        return;
      }
      
      // Clear timeout on error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      verificationInProgress.current = false;
      
      console.error('ImprovedRoleAwareStorageManager: Storage verification error:', error);
      setStorageStatus('error');
      setStorageErrorDetails({ step: 'manager_error', error });
      
      // Only show error toast for authenticated users
      if (user) {
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred. Retrying automatically...",
        });
        
        // Schedule retry for unexpected errors
        scheduleRetry(8000);
      }
    }
  }, [user, authLoading, isOwner, toast, setStorageStatus, setStorageErrorDetails, scheduleRetry]);

  // Main effect that triggers verification
  useEffect(() => {
    console.log('ImprovedRoleAwareStorageManager: Auth state changed, considering verification');
    
    // Don't start verification if auth is still loading
    if (authLoading) {
      console.log('ImprovedRoleAwareStorageManager: Auth still loading, waiting...');
      return;
    }

    // Reset verification state when user changes
    resetVerification();
    
    // Wait a bit for auth context to fully stabilize
    const timeoutId = setTimeout(() => {
      if (mounted.current) {
        console.log('ImprovedRoleAwareStorageManager: Starting verification after auth stabilization');
        performRoleAwareVerification();
      }
    }, 250); // Slightly longer delay
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, authLoading, isOwner, performRoleAwareVerification, resetVerification]);

  return null; // This component only handles side effects
};
