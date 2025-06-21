
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { useToast } from '@/hooks/use-toast';

export const useAutomaticProfileRecovery = () => {
  const { user, profile, refetchUserData } = useAuth();
  const { toast } = useToast();
  const [isRecovering, setIsRecovering] = useState(false);
  const recoveryAttempted = useRef(false);
  const maxRecoveryTime = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (maxRecoveryTime.current) {
        clearTimeout(maxRecoveryTime.current);
      }
    };
  }, []);

  useEffect(() => {
    const attemptProfileRecovery = async () => {
      // Only run if user exists but profile is missing, and we haven't already attempted recovery
      if (!user || profile || isRecovering || recoveryAttempted.current) return;

      console.log('🔄 User exists but profile missing, attempting automatic recovery...');
      setIsRecovering(true);
      recoveryAttempted.current = true;

      // Set maximum recovery time to prevent infinite loops
      maxRecoveryTime.current = setTimeout(() => {
        console.log('⏰ Recovery timeout reached, stopping recovery process');
        setIsRecovering(false);
        toast({
          title: "Profile Recovery Timeout",
          description: "Recovery process timed out. Please refresh the page or contact support.",
        });
      }, 10000); // 10 second maximum recovery time

      try {
        console.log('🔧 Attempting to ensure profile exists...');
        
        const result = await profileService.ensureProfileExists(user.id);
        
        if (result.success) {
          console.log('✅ Profile recovery completed successfully');
          
          // Clear timeout and refresh data
          clearTimeout(maxRecoveryTime.current);
          
          // Wait a moment for database consistency
          setTimeout(async () => {
            await refetchUserData();
            setIsRecovering(false);
            
            toast({
              title: "Profile Recovered Successfully",
              description: "Your profile has been restored successfully!",
            });
          }, 2000);
        } else {
          throw new Error(result.error || 'Profile recovery failed');
        }

      } catch (error) {
        console.error('❌ Profile recovery failed:', error);
        clearTimeout(maxRecoveryTime.current);
        setIsRecovering(false);
        
        toast({
          variant: "destructive",
          title: "Profile Recovery Failed",
          description: "Unable to recover your profile automatically. Please refresh the page or contact support.",
        });
      }
    };

    // Only run recovery attempt after a short delay to allow initial auth to settle
    if (!recoveryAttempted.current) {
      const timeout = setTimeout(attemptProfileRecovery, 2000);
      return () => clearTimeout(timeout);
    }
  }, [user, profile, refetchUserData, toast, isRecovering]);

  // Reset recovery state when user changes
  useEffect(() => {
    if (user?.id) {
      // Reset recovery state for new user
      recoveryAttempted.current = false;
      setIsRecovering(false);
      if (maxRecoveryTime.current) {
        clearTimeout(maxRecoveryTime.current);
      }
    }
  }, [user?.id]);

  return { isRecovering };
};
