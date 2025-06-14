
import React, { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { verifyStorageForRole, RoleAwareStorageResult } from '@/utils/storage/roleAwareStorageVerification';
import { useAuth } from '@/contexts/AuthContext';

interface RoleAwareStorageManagerProps {
  setStorageStatus: (status: 'checking' | 'ready' | 'error') => void;
  setStorageErrorDetails: (details: any) => void;
}

export const RoleAwareStorageManager: React.FC<RoleAwareStorageManagerProps> = ({
  setStorageStatus,
  setStorageErrorDetails
}) => {
  const { toast } = useToast();
  const { user, loading: authLoading, isOwner } = useAuth();
  const verificationAttempted = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const performRoleAwareVerification = async () => {
      // Skip if already attempted, auth is loading, or component unmounted
      if (verificationAttempted.current || authLoading || !mounted.current) {
        return;
      }

      console.log('Starting role-aware storage verification...', { 
        user: user?.id, 
        authLoading, 
        isOwner 
      });
      
      verificationAttempted.current = true;
      setStorageStatus('checking');
      setStorageErrorDetails(null);
      
      try {
        const result: RoleAwareStorageResult = await verifyStorageForRole();
        
        if (!mounted.current) return;
        
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
          // Handle different failure scenarios
          if (result.status === 'checking') {
            setStorageStatus('checking');
            setStorageErrorDetails(result.details);
            // Don't show error toast for checking state
          } else if (result.status === 'unavailable') {
            setStorageStatus('error');
            setStorageErrorDetails(result.details);
            
            // Show informational message for subscribers
            if (result.userRole === 'subscriber') {
              toast({
                title: "File Uploads Unavailable",
                description: "Contact your administrator if you need file upload access.",
              });
            }
          } else {
            setStorageStatus('error');
            setStorageErrorDetails(result.details);
            
            // Only show error toast for owners
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
        
        console.error('Storage verification error:', error);
        setStorageStatus('error');
        setStorageErrorDetails({ step: 'manager_error', error });
        
        // Only show error toast for authenticated users
        if (user) {
          toast({
            variant: "destructive",
            title: "Storage Verification Error",
            description: "An unexpected error occurred while checking storage access.",
          });
        }
      }
    };
    
    // Small delay to allow auth context to stabilize
    const timeoutId = setTimeout(performRoleAwareVerification, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [user, authLoading, isOwner, toast, setStorageStatus, setStorageErrorDetails]);

  return null; // This component only handles side effects
};
