
import React from 'react';
import { SocialAccountsTab } from '@/components/dashboard/settings/SocialAccountsTab';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const ConnectedAccountsSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const handlers = createSettingsHandlers(user, toast);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Connected Accounts</h2>
        <p className="text-gray-600 mt-1">
          Connect and manage your social media accounts and third-party integrations.
        </p>
      </div>
      
      <SocialAccountsTab
        onConnectAccount={handlers.handleConnectAccount}
        onDisconnectAccount={handlers.handleDisconnectAccount}
      />
    </div>
  );
};
