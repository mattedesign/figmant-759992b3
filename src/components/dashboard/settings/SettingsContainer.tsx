
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useSettingsState } from './hooks/useSettingsState';
import { createSettingsHandlers } from './utils/settingsHandlers';
import { SettingsHeader } from './components/SettingsHeader';
import { SettingsTabs } from './components/SettingsTabs';

export const SettingsContainer = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const state = useSettingsState();
  const handlers = createSettingsHandlers(user, toast);

  return (
    <div className="container mx-auto px-4 py-8">
      <SettingsHeader />
      <SettingsTabs 
        user={user} 
        profile={profile} 
        handlers={handlers} 
        state={state} 
      />
    </div>
  );
};
