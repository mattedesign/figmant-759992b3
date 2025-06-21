
import React, { useState } from 'react';
import { PreferencesTab } from '@/components/dashboard/settings/PreferencesTab';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const PreferencesSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const handlers = createSettingsHandlers(user, toast);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
    marketingEmails: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
        <p className="text-gray-600 mt-1">
          Customize your app experience and default settings.
        </p>
      </div>
      
      <PreferencesTab
        preferences={preferences}
        onUpdatePreferences={(newPreferences) => {
          setPreferences(newPreferences);
          handlers.handleUpdatePreferences(newPreferences);
        }}
      />
    </div>
  );
};
