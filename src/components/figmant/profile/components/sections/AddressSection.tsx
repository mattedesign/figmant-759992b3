
import React from 'react';
import { AddressTab } from '@/components/dashboard/settings/AddressTab';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const AddressSection: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { user } = useAuth();
  const handlers = createSettingsHandlers(user, toast);

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
