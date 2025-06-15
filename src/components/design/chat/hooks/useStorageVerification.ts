
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

    console.log('Forcing storage verification from useStorageVerification...');
    
    verificationAttempted.current = true;
    setStorageStatus('checking');
    setStorageErrorDetails(null);

    timeoutRef.current = setTimeout(() => {
      if (!mounted.current) return;
      
      console.warn('Storage verification timeout in useStorageVerification');
      setStorageStatus('error');
      setStorageErrorDetails({ 
        step: 'timeout', 
        error: 'Storage verification timed out',
        timeout: true 
      });
      
      if (user && isOwner) {
        toast({
          variant: "destructive",
          title: "Storage Verification Timeout",
          description: "Storage check took too long. Please try again.",
        });
      }
    }, 7000); // 7 second timeout
    
    try {
      const result: SimplifiedStorageResult = await verifyStorageSimplified();
      
      if (!mounted.current) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      console.log('Forced storage verification result:', result);
      
      if (result.success) {
        setStorageStatus('ready');
        setStorageErrorDetails(null);
        
        if (result.userRole === 'owner') {
          toast({
            title: "Storage Ready",
            description: "File uploads are configured and ready to use.",
          });
        }
      } else {
        setStorageStatus('error');
        setStorageErrorDetails(result.details);
        if (result.status === 'unavailable') {
          if (result.userRole === 'subscriber') {
            toast({
              title: "File Uploads Unavailable",
              description: "Contact your administrator if you need file upload access.",
            });
          }
        } else {
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
      
      console.error('Forced storage verification error:', error);
      setStorageStatus('error');
      setStorageErrorDetails({ step: 'logic_hook_error', error });
      
      if (user) {
        toast({
          variant: "destructive",
          title: "Storage Verification Error",
          description: "An unexpected error occurred while checking storage access.",
        });
      }
    }
  }, [user, authLoading, isOwner, storageStatus, toast, setStorageStatus, setStorageErrorDetails]);

  useEffect(() => {
    verificationAttempted.current = false;
    const timeoutId = setTimeout(performRoleAwareVerification, 100);
    return () => clearTimeout(timeoutId);
  }, [user, authLoading, isOwner, performRoleAwareVerification]);
};
