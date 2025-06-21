
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileTab } from '@/components/dashboard/settings/ProfileTab';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createSettingsHandlers } from '@/components/dashboard/settings/utils/settingsHandlers';

export const PersonalInfoSection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const handlers = createSettingsHandlers(user, toast);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-1">
          Update your personal details and profile information.
        </p>
      </div>
      
      <ProfileTab user={user} onUpdateProfile={handlers.handleUpdateProfile} />
    </div>
  );
};
