
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '../ProfileTab';
import { SecurityTab } from '../SecurityTab';
import { ContactTab } from '../ContactTab';
import { AddressTab } from '../AddressTab';
import { PaymentMethodsTab } from '../PaymentMethodsTab';
import { SocialAccountsTab } from '../SocialAccountsTab';
import { PreferencesTab } from '../PreferencesTab';
import { NotificationsTab } from '../NotificationsTab';
import { ApiKeysTab } from '../ApiKeysTab';
import { CreditsTab } from '../CreditsTab';
import { AnalysisTab } from '../AnalysisTab';
import { DataSettingsTab } from '../DataSettingsTab';

interface SettingsTabsProps {
  user: any;
  profile: any;
  handlers: any;
  state: any;
}

export const SettingsTabs = ({ user, profile, handlers, state }: SettingsTabsProps) => {
  return (
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
        <ProfileTab user={user} onUpdateProfile={handlers.handleUpdateProfile} />
      </TabsContent>

      <TabsContent value="contact">
        <ContactTab user={user} onUpdateContact={handlers.handleUpdateContact} />
      </TabsContent>

      <TabsContent value="address">
        <AddressTab onUpdateAddress={handlers.handleUpdateAddress} address={profile} />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab
          onChangePassword={handlers.handleChangePassword}
          onEnable2FA={handlers.handleEnable2FA}
          twoFactorEnabled={false}
        />
      </TabsContent>

      <TabsContent value="payment">
        <PaymentMethodsTab
          onAddPaymentMethod={handlers.handleAddPaymentMethod}
          onManagePaymentMethod={handlers.handleManagePaymentMethod}
        />
      </TabsContent>

      <TabsContent value="social">
        <SocialAccountsTab
          onConnectAccount={handlers.handleConnectAccount}
          onDisconnectAccount={handlers.handleDisconnectAccount}
        />
      </TabsContent>

      <TabsContent value="preferences">
        <PreferencesTab
          preferences={state.preferences}
          onUpdatePreferences={(newPreferences) => {
            state.setPreferences(newPreferences);
            handlers.handleUpdatePreferences(newPreferences);
          }}
        />
      </TabsContent>

      <TabsContent value="notifications">
        <NotificationsTab 
          notifications={state.notifications}
          setNotifications={state.setNotifications}
        />
      </TabsContent>

      <TabsContent value="api-keys">
        <ApiKeysTab 
          apiKeys={state.apiKeys}
          setApiKeys={state.setApiKeys}
        />
      </TabsContent>

      <TabsContent value="credits">
        <CreditsTab />
      </TabsContent>

      <TabsContent value="analysis">
        <AnalysisTab 
          analysisFrequency={state.analysisFrequency}
          setAnalysisFrequency={state.setAnalysisFrequency}
        />
      </TabsContent>

      <TabsContent value="data">
        <DataSettingsTab 
          dataRetention={state.dataRetention}
          setDataRetention={state.setDataRetention}
        />
      </TabsContent>
    </Tabs>
  );
};
