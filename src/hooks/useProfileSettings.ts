
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
}

export const useProfileSettings = () => {
  const { user, profile, refetchUserData } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize form data with profile data or defaults
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
    phone_number: profile?.phone_number || '',
  });

  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
    ...(profile?.notification_preferences ? 
        (typeof profile.notification_preferences === 'object' ? profile.notification_preferences : {}) 
        : {})
  });

  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    ...(profile?.billing_address ? 
        (typeof profile.billing_address === 'object' ? profile.billing_address : {}) 
        : {})
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationPreferences, value: boolean) => {
    setNotificationPreferences(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: keyof BillingAddress, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          notification_preferences: notificationPreferences as any,
          billing_address: billingAddress as any,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refetchUserData();
      setLastSaved(new Date());
      toast({
        title: "✅ Profile Updated",
        description: "Your profile has been saved successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    notificationPreferences,
    billingAddress,
    loading,
    lastSaved,
    handleInputChange,
    handleNotificationChange,
    handleAddressChange,
    handleSave,
  };
};
