
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

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const performRoleAwareVerification = useCallback(async () => {
    if (verificationAttempted.current || authLoading || !mounted.current || storageStatus === 'ready') {
      return;
    }

    console.log('Starting storage verification...');
    
    verificationAttempted.current = true;
    setStorageStatus('checking');
    setStorageErrorDetails(null);

    // Set a longer timeout (15 seconds) and make it less aggressive
    timeoutRef.current = setTimeout(() => {
      if (!mounted.current) return;
      
      console.warn('Storage verification timeout - setting to ready state to prevent blocking UI');
      // Instead of showing an error, set to ready state for better UX
      setStorageStatus('ready');
      setStorageErrorDetails(null);
      
      // Only show toast for owners who need to know about configuration issues
      if (user && isOwner) {
        toast({
          title: "Storage Check Timeout",
          description: "Storage verification took longer than expected, but file uploads should still work.",
        });
      }
    }, 15000); // Increased to 15 seconds
    
    try {
      const result: SimplifiedStorageResult = await verifyStorageSimplified();
      
      if (!mounted.current) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.log('Storage verification result:', result);
      
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
        // For subscribers, default to ready state unless there's a critical error
        if (result.userRole === 'subscriber') {
          setStorageStatus('ready');
          setStorageErrorDetails(null);
        } else {
          setStorageStatus('error');
          setStorageErrorDetails(result.details);
          
          if (result.userRole === 'owner') {
            toast({
              variant: "destructive",
              title: "Storage Configuration Issue",
              description: result.error || "Unable to access file storage.",
            });
          }
        }
      }
    } catch (error) {
      if (!mounted.current) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.error('Storage verification error:', error);
      
      // For better UX, default to ready state instead of blocking the UI
      setStorageStatus('ready');
      setStorageErrorDetails(null);
      
      // Only show error for owners
      if (user && isOwner) {
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "Could not verify storage access, but uploads may still work.",
        });
      }
    }
  }, [user, authLoading, isOwner, storageStatus, toast, setStorageStatus, setStorageErrorDetails]);

  useEffect(() => {
    // Reset verification flag when user or auth state changes
    verificationAttempted.current = false;
    
    // Only start verification if we have a user and auth is not loading
    if (!authLoading && user) {
      const timeoutId = setTimeout(performRoleAwareVerification, 500); // Slight delay
      return () => clearTimeout(timeoutId);
    }
  }, [user, authLoading, isOwner, performRoleAwareVerification]);
};
