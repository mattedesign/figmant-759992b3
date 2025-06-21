
import React from 'react';
import { AddressTab } from '@/components/dashboard/settings/AddressTab';
import { useAuth } from '@/contexts/AuthContext';
import { createEnhancedSettingsHandlers } from '@/components/dashboard/settings/utils/enhancedSettingsHandlers';

export const AddressSection: React.FC = () => {
  const { profile, user, refetchUserData } = useAuth();
  const handlers = createEnhancedSettingsHandlers(user, refetchUserData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
        <p className="text-gray-600 mt-1">
          Update your billing and shipping address details.
        </p>
      </div>
      
      <AddressTab onUpdateAddress={handlers.handleUpdateAddress} address={profile} />
    </div>
  );
};
