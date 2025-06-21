
import React from 'react';
import { SecurityTab } from '@/components/dashboard/settings/SecurityTab';
import { useAuth } from '@/contexts/AuthContext';
import { createEnhancedSettingsHandlers } from '@/components/dashboard/settings/utils/enhancedSettingsHandlers';

export const SecuritySection: React.FC = () => {
  const { user, refetchUserData } = useAuth();
  const handlers = createEnhancedSettingsHandlers(user, refetchUserData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-gray-600 mt-1">
          Manage your password, two-factor authentication, and security preferences.
        </p>
      </div>
      
      <SecurityTab
        onChangePassword={handlers.handleChangePassword}
        onEnable2FA={handlers.handleEnable2FA}
        twoFactorEnabled={false}
      />
    </div>
  );
};
