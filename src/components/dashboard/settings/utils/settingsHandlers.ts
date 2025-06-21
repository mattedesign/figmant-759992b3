
import { supabase } from '@/integrations/supabase/client';

export const createSettingsHandlers = (user: any, toast: any) => {
  const handleUpdateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          bio: data.bio,
          website: data.website
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
      });
    }
  };

  const handleUpdateContact = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone_number: data.phone_number,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_phone: data.emergency_contact_phone
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Contact Information Updated",
        description: "Your contact information has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your contact information. Please try again.",
      });
    }
  };

  const handleUpdateAddress = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          address: data.address,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your address. Please try again.",
      });
    }
  };

  const handleChangePassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update your password. Please try again.",
      });
    }
  };

  const handleEnable2FA = () => {
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup is not yet implemented.",
    });
  };

  const handleUpdatePreferences = (newPreferences: any) => {
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleAddPaymentMethod = () => {
    toast({
      title: "Add Payment Method",
      description: "Payment method management will be available soon.",
    });
  };

  const handleManagePaymentMethod = (methodId: string) => {
    toast({
      title: "Manage Payment Method",
      description: "Payment method management will be available soon.",
    });
  };

  const handleConnectAccount = (provider: string) => {
    toast({
      title: "Connect Account",
      description: `${provider} account connection will be available soon.`,
    });
  };

  const handleDisconnectAccount = (provider: string) => {
    toast({
      title: "Disconnect Account",
      description: `${provider} account disconnection will be available soon.`,
    });
  };

  return {
    handleUpdateProfile,
    handleUpdateContact,
    handleUpdateAddress,
    handleChangePassword,
    handleEnable2FA,
    handleUpdatePreferences,
    handleAddPaymentMethod,
    handleManagePaymentMethod,
    handleConnectAccount,
    handleDisconnectAccount,
  };
};
