
import React, { useState } from 'react';
import { NotificationsTab } from '@/components/dashboard/settings/NotificationsTab';

export const NotificationsSection: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false,
    security: true,
    product: true,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
        <p className="text-gray-600 mt-1">
          Control how and when you receive notifications from Figmant.
        </p>
      </div>
      
      <NotificationsTab 
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
};
