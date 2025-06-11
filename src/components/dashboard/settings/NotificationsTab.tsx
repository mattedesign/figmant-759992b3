
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

interface Notifications {
  realTimeAlerts: boolean;
  weeklyReports: boolean;
  anomalyDetection: boolean;
  emailNotifications: boolean;
}

interface NotificationsTabProps {
  notifications: Notifications;
  setNotifications: (notifications: Notifications) => void;
}

export const NotificationsTab = ({ notifications, setNotifications }: NotificationsTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Bell className="h-4 w-4" />
        <h3 className="text-lg font-medium">Notification Preferences</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Real-time Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about significant changes immediately
            </p>
          </div>
          <Switch
            checked={notifications.realTimeAlerts}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, realTimeAlerts: checked})
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Weekly Reports</Label>
            <p className="text-xs text-muted-foreground">
              Receive weekly UX analytics summaries
            </p>
          </div>
          <Switch
            checked={notifications.weeklyReports}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, weeklyReports: checked})
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Anomaly Detection</Label>
            <p className="text-xs text-muted-foreground">
              Alert when AI detects unusual patterns
            </p>
          </div>
          <Switch
            checked={notifications.anomalyDetection}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, anomalyDetection: checked})
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Email Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Send notifications to your email
            </p>
          </div>
          <Switch
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) => 
              setNotifications({...notifications, emailNotifications: checked})
            }
          />
        </div>
      </div>
    </div>
  );
};
