
import React from 'react';
import { SecurityTab } from '@/components/dashboard/settings/SecurityTab';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const SecuritySection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const handlers = createSettingsHandlers(user, toast);

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
