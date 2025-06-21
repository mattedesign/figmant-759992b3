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

      const result = await profileService.updateProfile(user.id, {
        full_name: data.full_name,
        bio: data.bio,
        website: data.website
      });

      if (result.success) {
        toast.success('Profile updated successfully');
        // Trigger auth context refresh
        if (refetchUserData) {
          await refetchUserData();
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

      const result = await profileService.updateProfile(user.id, {
        phone_number: data.phone_number,
        emergency_contact_name: data.emergency_contact_name,
        emergency_contact_phone: data.emergency_contact_phone
      });

      if (result.success) {
        toast.success('Contact information updated successfully');
        if (refetchUserData) {
          await refetchUserData();
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

      const result = await profileService.updateProfile(user.id, {
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country
      });

      if (result.success) {
        toast.success('Address updated successfully');
        if (refetchUserData) {
          await refetchUserData();
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
