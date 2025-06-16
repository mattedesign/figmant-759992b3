
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { ContactTab } from './ContactTab';
import { AddressTab } from './AddressTab';
import { PaymentMethodsTab } from './PaymentMethodsTab';
import { SocialAccountsTab } from './SocialAccountsTab';
import { PreferencesTab } from './PreferencesTab';
import { NotificationsTab } from './NotificationsTab';
import { ApiKeysTab } from './ApiKeysTab';
import { CreditsTab } from './CreditsTab';
import { AnalysisTab } from './AnalysisTab';
import { DataSettingsTab } from './DataSettingsTab';

export const SettingsContainer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    theme: 'system',
    compactMode: false,
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    analysisNotifications: true,
    weeklyDigest: true,
  });

  // State for API keys
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    analytics: '',
    heatmap: ''
  });

  // State for notifications
  const [notifications, setNotifications] = useState({
    realTimeAlerts: true,
    weeklyReports: true,
    anomalyDetection: true,
    emailNotifications: false
  });

  // State for data settings
  const [dataRetention, setDataRetention] = useState('90');
  
  // State for analysis settings
  const [analysisFrequency, setAnalysisFrequency] = useState('daily');

  const handleUpdateProfile = async (data: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
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
        .update(data)
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
        .update(data)
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
    setPreferences(newPreferences);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-12">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab user={user} onUpdateProfile={handleUpdateProfile} />
        </TabsContent>

        <TabsContent value="contact">
          <ContactTab user={user} onUpdateContact={handleUpdateContact} />
        </TabsContent>

        <TabsContent value="address">
          <AddressTab user={user} onUpdateAddress={handleUpdateAddress} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            onChangePassword={handleChangePassword}
            onEnable2FA={handleEnable2FA}
            twoFactorEnabled={false}
          />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodsTab
            onAddPaymentMethod={handleAddPaymentMethod}
            onManagePaymentMethod={handleManagePaymentMethod}
          />
        </TabsContent>

        <TabsContent value="social">
          <SocialAccountsTab
            onConnectAccount={handleConnectAccount}
            onDisconnectAccount={handleDisconnectAccount}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab 
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysTab 
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
          />
        </TabsContent>

        <TabsContent value="credits">
          <CreditsTab />
        </TabsContent>

        <TabsContent value="analysis">
          <AnalysisTab 
            analysisFrequency={analysisFrequency}
            setAnalysisFrequency={setAnalysisFrequency}
          />
        </TabsContent>

        <TabsContent value="data">
          <DataSettingsTab 
            dataRetention={dataRetention}
            setDataRetention={setDataRetention}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
