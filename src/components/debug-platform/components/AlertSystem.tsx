
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  X, 
  Bell, 
  Settings,
  Shield,
  CreditCard,
  User,
  Activity
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'security' | 'billing' | 'user' | 'system' | 'error';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  read: boolean;
}

interface AlertSystemProps {
  alerts: any[];
  onClearAlert: (id: string) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ 
  alerts, 
  onClearAlert 
}) => {
  const [filter, setFilter] = useState<string>('all');

  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'security',
      message: 'Multiple failed login attempts detected for user@example.com',
      timestamp: new Date('2024-01-15T10:30:00'),
      severity: 'high',
      read: false
    },
    {
      id: '2',
      type: 'billing',
      message: 'Payment failed for subscription renewal - user ID: 12345',
      timestamp: new Date('2024-01-15T09:15:00'),
      severity: 'medium',
      read: false
    },
    {
      id: '3',
      type: 'user',
      message: 'User credit balance below threshold (5 credits remaining)',
      timestamp: new Date('2024-01-15T08:45:00'),
      severity: 'low',
      read: true
    },
    {
      id: '4',
      type: 'system',
      message: 'API response time above threshold (2.5s average)',
      timestamp: new Date('2024-01-15T08:00:00'),
      severity: 'medium',
      read: false
    }
  ];

  // Combine real alerts with mock alerts
  const allAlerts = [...alerts.map((alert: any) => ({
    id: alert.id,
    type: alert.type || 'system',
    message: alert.message,
    timestamp: alert.timestamp,
    severity: 'medium' as const,
    read: false
  })), ...mockAlerts];

  const filteredAlerts = filter === 'all' 
    ? allAlerts 
    : allAlerts.filter(alert => alert.type === filter);

  const unreadCount = allAlerts.filter(alert => !alert.read).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'billing': return <CreditCard className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold">{allAlerts.length}</p>
              </div>
              <Bell className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allAlerts.filter(a => a.type === 'security').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {allAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
              <X className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert Management
            </span>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({allAlerts.length})
            </Button>
            <Button 
              variant={filter === 'security' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('security')}
              className="flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              Security ({allAlerts.filter(a => a.type === 'security').length})
            </Button>
            <Button 
              variant={filter === 'billing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('billing')}
              className="flex items-center gap-1"
            >
              <CreditCard className="h-3 w-3" />
              Billing ({allAlerts.filter(a => a.type === 'billing').length})
            </Button>
            <Button 
              variant={filter === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('user')}
              className="flex items-center gap-1"
            >
              <User className="h-3 w-3" />
              User ({allAlerts.filter(a => a.type === 'user').length})
            </Button>
            <Button 
              variant={filter === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('system')}
              className="flex items-center gap-1"
            >
              <Activity className="h-3 w-3" />
              System ({allAlerts.filter(a => a.type === 'system').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No alerts found for the selected filter
              </p>
            ) : (
              filteredAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-r ${getSeverityColor(alert.severity)} ${!alert.read ? 'font-medium' : 'opacity-75'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2 mt-1">
                        {getAlertIcon(alert.type)}
                        <Badge variant={getSeverityBadge(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">
                          {alert.type}
                        </Badge>
                        {!alert.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onClearAlert(alert.id)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
