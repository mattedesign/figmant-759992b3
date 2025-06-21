
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileTab } from '@/components/dashboard/settings/ProfileTab';
import { useAuth } from '@/contexts/AuthContext';
import { createEnhancedSettingsHandlers } from '@/components/dashboard/settings/utils/enhancedSettingsHandlers';

export const PersonalInfoSection: React.FC = () => {
  const { user, refetchUserData } = useAuth();
  const handlers = createEnhancedSettingsHandlers(user, refetchUserData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-600 mt-1">
          Update your personal details and profile information.
        </p>
      </div>
      
      <ProfileTab 
        user={user} 
        onUpdateProfile={handlers.handleUpdateProfile}
        onUploadAvatar={handlers.handleUploadAvatar}
      />
    </div>
  );
};
