
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
}

interface NotificationPreferencesSectionProps {
  notificationPreferences: NotificationPreferences;
  onNotificationChange: (field: keyof NotificationPreferences, value: boolean) => void;
}

export const NotificationPreferencesSection: React.FC<NotificationPreferencesSectionProps> = ({
  notificationPreferences,
  onNotificationChange,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive important updates via email
            </p>
          </div>
          <Switch
            checked={notificationPreferences.email_notifications}
            onCheckedChange={(checked) => onNotificationChange('email_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive real-time notifications in your browser
            </p>
          </div>
          <Switch
            checked={notificationPreferences.push_notifications}
            onCheckedChange={(checked) => onNotificationChange('push_notifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features and promotions
            </p>
          </div>
          <Switch
            checked={notificationPreferences.marketing_emails}
            onCheckedChange={(checked) => onNotificationChange('marketing_emails', checked)}
          />
        </div>
      </div>
    </div>
  );
};
