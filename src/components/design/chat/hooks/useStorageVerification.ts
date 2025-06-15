
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { verifyStorageSimplified, SimplifiedStorageResult } from '@/utils/storage/simplifiedStorageVerification';

interface UseStorageVerificationProps {
  storageStatus: 'checking' | 'ready' | 'error';
  setStorageStatus: (status: 'checking' | 'ready' | 'error') => void;
  setStorageErrorDetails: (details: any) => void;
}

export const useStorageVerification = ({
  storageStatus,
  setStorageStatus,
  setStorageErrorDetails,
}: UseStorageVerificationProps) => {
  const { toast } = useToast();
  const { user, loading: authLoading, isOwner } = useAuth();
  const verificationAttempted = useRef(false);
  const mounted = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const verificationInProgress = useRef(false);
  const verificationCompleted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    verificationCompleted.current = false;
    return () => {
      mounted.current = false;
      verificationCompleted.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, []);

  const clearExistingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      console.log('🕒 Clearing existing timeout');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const handleVerificationComplete = useCallback((success: boolean, result?: SimplifiedStorageResult, error?: any) => {
    // Guard against race conditions
    if (!mounted.current || verificationCompleted.current) {
      console.log('🚫 Verification complete called but component unmounted or already completed');
      return;
    }

    console.log('✅ Storage verification completed:', { success, userRole: result?.userRole });
    
    // Mark verification as completed and clear timeout
    verificationCompleted.current = true;
    verificationInProgress.current = false;
    clearExistingTimeout();

    if (success && result) {
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
      // For subscribers, default to ready state unless there's a critical error
      if (result?.userRole === 'subscriber') {
        setStorageStatus('ready');
        setStorageErrorDetails(null);
      } else {
        setStorageStatus('error');
        setStorageErrorDetails(error || result?.details);
        
        if (result?.userRole === 'owner') {
          toast({
            variant: "destructive",
            title: "Storage Configuration Issue",
            description: result.error || "Unable to access file storage.",
          });
        }
      }
    }
  }, [toast, setStorageStatus, setStorageErrorDetails, clearExistingTimeout]);

  const handleVerificationTimeout = useCallback(() => {
    // Guard against race conditions - only handle timeout if verification hasn't completed
    if (!mounted.current || verificationCompleted.current || !verificationInProgress.current) {
      console.log('🚫 Timeout fired but verification already completed or component unmounted');
      return;
    }

    console.warn('⏰ Storage verification timeout - setting to ready state to prevent blocking UI');
    
    // Mark as completed to prevent further race conditions
    verificationCompleted.current = true;
    verificationInProgress.current = false;
    
    // Set to ready state for better UX
    setStorageStatus('ready');
    setStorageErrorDetails(null);
    
    // Only show toast for owners who need to know about configuration issues
    if (user && isOwner) {
      toast({
        title: "Storage Check Timeout",
        description: "Storage verification took longer than expected, but file uploads should still work.",
      });
    }
  }, [user, isOwner, toast, setStorageStatus, setStorageErrorDetails]);

  const performRoleAwareVerification = useCallback(async () => {
    if (verificationAttempted.current || authLoading || !mounted.current || storageStatus === 'ready') {
      console.log('🚫 Skipping verification:', { 
        attempted: verificationAttempted.current, 
        authLoading, 
        mounted: mounted.current, 
        status: storageStatus 
      });
      return;
    }

    console.log('🚀 Starting storage verification...');
    
    verificationAttempted.current = true;
    verificationInProgress.current = true;
    verificationCompleted.current = false;
    setStorageStatus('checking');
    setStorageErrorDetails(null);

    // Clear any existing timeout before setting a new one
    clearExistingTimeout();

    // Set timeout with race condition protection
    timeoutRef.current = setTimeout(handleVerificationTimeout, 12000); // Reduced to 12 seconds
    
    try {
      const result: SimplifiedStorageResult = await verifyStorageSimplified();
      
      // Check if we should still process this result
      if (!mounted.current || verificationCompleted.current) {
        console.log('🚫 Verification result received but component unmounted or already completed');
        return;
      }
      
      console.log('📊 Storage verification result:', result);
      handleVerificationComplete(result.success, result);
      
    } catch (error) {
      if (!mounted.current || verificationCompleted.current) {
        console.log('🚫 Verification error but component unmounted or already completed');
        return;
      }
      
      console.error('❌ Storage verification error:', error);
      
      // For better UX, default to ready state instead of blocking the UI
      setStorageStatus('ready');
      setStorageErrorDetails(null);
      verificationCompleted.current = true;
      verificationInProgress.current = false;
      clearExistingTimeout();
      
      // Only show error for owners
      if (user && isOwner) {
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "Could not verify storage access, but uploads may still work.",
        });
      }
    }
  }, [
    user, 
    authLoading, 
    isOwner, 
    storageStatus, 
    toast, 
    setStorageStatus, 
    setStorageErrorDetails, 
    clearExistingTimeout,
    handleVerificationComplete,
    handleVerificationTimeout
  ]);

  useEffect(() => {
    // Reset verification flags when user or auth state changes
    verificationAttempted.current = false;
    verificationCompleted.current = false;
    verificationInProgress.current = false;
    
    // Clear any existing timeouts
    clearExistingTimeout();
    
    // Only start verification if we have a user and auth is not loading
    if (!authLoading && user) {
      const timeoutId = setTimeout(performRoleAwareVerification, 500); // Slight delay
      return () => clearTimeout(timeoutId);
    }
  }, [user, authLoading, isOwner, performRoleAwareVerification, clearExistingTimeout]);
};
