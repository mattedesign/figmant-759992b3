
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profileService';
import { UserProfile } from '@/types/auth';

export const useProfileSync = () => {
  const { user, refetchUserData } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to profile updates
    const unsubscribe = profileService.onProfileUpdate((updatedProfile: UserProfile) => {
      console.log('Profile updated via ProfileService:', updatedProfile);
      
      // Trigger auth context refresh to sync the updated data
      if (refetchUserData) {
        refetchUserData();
      }
    });

    return unsubscribe;
  }, [user?.id, refetchUserData]);

  const refreshProfile = async () => {
    if (user?.id) {
      await profileService.refreshProfile(user.id);
    }
  };

  return {
    refreshProfile
  };
};
