
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactTab } from '@/components/dashboard/settings/ContactTab';
import { useAuth } from '@/contexts/AuthContext';
import { createEnhancedSettingsHandlers } from '@/components/dashboard/settings/utils/enhancedSettingsHandlers';

export const ContactDetailsSection: React.FC = () => {
  const { user, refetchUserData } = useAuth();
  const handlers = createEnhancedSettingsHandlers(user, refetchUserData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Details</h2>
        <p className="text-gray-600 mt-1">
          Manage your email, phone, and other contact information.
        </p>
      </div>
      
      <ContactTab user={user} onUpdateContact={handlers.handleUpdateContact} />
    </div>
  );
};
