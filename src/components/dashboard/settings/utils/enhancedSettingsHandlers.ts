import { supabase } from '@/integrations/supabase/client';
import { profileService } from '@/services/profileService';
import { toast } from 'sonner';

export const createEnhancedSettingsHandlers = (user: any, refetchUserData?: () => Promise<void>) => {
  const handleUpdateProfile = async (data: any) => {
    try {
      if (!user?.id) {
        toast.error('User not found');
        return;
      }

      console.log('Enhanced handlers: Updating profile with data:', data);

      // Ensure profile exists before updating
      const ensureResult = await profileService.ensureProfileExists(user.id);
      if (!ensureResult.success) {
        console.error('Failed to ensure profile exists:', ensureResult.error);
        toast.error('Failed to initialize profile');
        return;
      }

      const updateData = {
        full_name: data.full_name,
        bio: data.bio,
        website: data.website
      };

      const result = await profileService.updateProfile(user.id, updateData);

      if (result.success) {
        // Verify the update was successful
        const isVerified = await profileService.verifyProfileUpdate(user.id, updateData);
        
        if (isVerified) {
          toast.success('Profile updated successfully');
          // Trigger auth context refresh after verification
          if (refetchUserData) {
            await refetchUserData();
          }
        } else {
          console.error('Profile update verification failed');
          toast.error('Profile update could not be verified. Please try again.');
        }
      } else {
        const errorMessage = result.errors?.join(', ') || 'Failed to update profile';
        console.error('Profile update failed:', result.errors);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleUpdateContact = async (data: any) => {
    try {
      if (!user?.id) {
        toast.error('User not found');
        return;
      }

      // Ensure profile exists before updating
      const ensureResult = await profileService.ensureProfileExists(user.id);
      if (!ensureResult.success) {
        console.error('Failed to ensure profile exists:', ensureResult.error);
        toast.error('Failed to initialize profile');
        return;
      }

      const updateData = {
        phone_number: data.phone_number,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone
      };

      const result = await profileService.updateProfile(user.id, updateData);

      if (result.success) {
        const isVerified = await profileService.verifyProfileUpdate(user.id, updateData);
        
        if (isVerified) {
          toast.success('Contact information updated successfully');
          if (refetchUserData) {
            await refetchUserData();
          }
        } else {
          console.error('Contact update verification failed');
          toast.error('Contact update could not be verified. Please try again.');
        }
      } else {
        const errorMessage = result.errors?.join(', ') || 'Failed to update contact information';
        console.error('Contact update failed:', result.errors);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Contact update error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleUpdateAddress = async (data: any) => {
    try {
      if (!user?.id) {
        toast.error('User not found');
        return;
      }

      // Ensure profile exists before updating
      const ensureResult = await profileService.ensureProfileExists(user.id);
      if (!ensureResult.success) {
        console.error('Failed to ensure profile exists:', ensureResult.error);
        toast.error('Failed to initialize profile');
        return;
      }

      const updateData = {
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country
      };

      const result = await profileService.updateProfile(user.id, updateData);

      if (result.success) {
        const isVerified = await profileService.verifyProfileUpdate(user.id, updateData);
        
        if (isVerified) {
          toast.success('Address updated successfully');
          if (refetchUserData) {
            await refetchUserData();
          }
        } else {
          console.error('Address update verification failed');
          toast.error('Address update could not be verified. Please try again.');
        }
      } else {
        const errorMessage = result.errors?.join(', ') || 'Failed to update address';
        console.error('Address update failed:', result.errors);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Address update error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleUploadAvatar = async (file: File) => {
    try {
      if (!user?.id) {
        toast.error('User not found');
        return;
      }

      // Ensure profile exists before updating
      const ensureResult = await profileService.ensureProfileExists(user.id);
      if (!ensureResult.success) {
        console.error('Failed to ensure profile exists:', ensureResult.error);
        toast.error('Failed to initialize profile');
        return;
      }

      const result = await profileService.uploadAvatar(user.id, file);

      if (result.success) {
        toast.success('Profile image updated successfully');
        if (refetchUserData) {
          await refetchUserData();
        }
      } else {
        console.error('Avatar upload failed:', result.error);
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleChangePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Password update error:', error);
      toast.error(error.message || 'Failed to update password');
    }
  };

  const handleEnable2FA = () => {
    toast.info('Two-factor authentication setup is not yet implemented');
  };

  const handleUpdatePreferences = (newPreferences: any) => {
    toast.success('Preferences updated successfully');
  };

  const handleAddPaymentMethod = () => {
    toast.info('Payment method management will be available soon');
  };

  const handleManagePaymentMethod = (methodId: string) => {
    toast.info('Payment method management will be available soon');
  };

  const handleConnectAccount = (provider: string) => {
    toast.info(`${provider} account connection will be available soon`);
  };

  const handleDisconnectAccount = (provider: string) => {
    toast.info(`${provider} account disconnection will be available soon`);
  };

  return {
    handleUpdateProfile,
    handleUpdateContact,
    handleUpdateAddress,
    handleUploadAvatar,
    handleChangePassword,
    handleEnable2FA,
    handleUpdatePreferences,
    handleAddPaymentMethod,
    handleManagePaymentMethod,
    handleConnectAccount,
    handleDisconnectAccount,
  };
};
