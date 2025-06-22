
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { PersonalInformationSection } from './sections/PersonalInformationSection';
import { NotificationPreferencesSection } from './sections/NotificationPreferencesSection';
import { BillingAddressSection } from './sections/BillingAddressSection';
import { SaveSection } from './sections/SaveSection';

export const SimplifiedProfile: React.FC = () => {
  const {
    formData,
    notificationPreferences,
    billingAddress,
    loading,
    lastSaved,
    handleInputChange,
    handleNotificationChange,
    handleAddressChange,
    handleSave,
  } = useProfileSettings();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className={`transition-all duration-300 ${loading ? 'opacity-75' : ''}`}>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <PersonalInformationSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <Separator />

          {/* Notification Preferences */}
          <NotificationPreferencesSection
            notificationPreferences={notificationPreferences}
            onNotificationChange={handleNotificationChange}
          />

          <Separator />

          {/* Billing Address */}
          <BillingAddressSection
            billingAddress={billingAddress}
            onAddressChange={handleAddressChange}
          />

          <Separator />

          {/* Save Section */}
          <SaveSection
            loading={loading}
            lastSaved={lastSaved}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
};
