
import React, { useState } from 'react';
import { NotificationsTab } from '@/components/dashboard/settings/NotificationsTab';

interface Notifications {
  realTimeAlerts: boolean;
  weeklyReports: boolean;
  anomalyDetection: boolean;
  emailNotifications: boolean;
}

export const NotificationsSection: React.FC = () => {
  const [notifications, setNotifications] = useState<Notifications>({
    realTimeAlerts: true,
    weeklyReports: true,
    anomalyDetection: true,
    emailNotifications: false,
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
