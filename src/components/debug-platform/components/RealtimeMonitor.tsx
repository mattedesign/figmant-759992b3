
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RealtimeMonitorProps {
  isActive: boolean;
  onAlert: (alert: any) => void;
}

interface MonitoringData {
  activeUsers: number;
  authEvents: number;
  securityAlerts: number;
  lastUpdate: Date;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export const RealtimeMonitor: React.FC<RealtimeMonitorProps> = ({ 
  isActive, 
  onAlert 
}) => {
  const { user } = useAuth();
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    activeUsers: 0,
    authEvents: 0,
    securityAlerts: 0,
    lastUpdate: new Date(),
    systemHealth: 'healthy'
  });
  const [sessionEvents, setSessionEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate real-time data updates
      setMonitoringData(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        authEvents: prev.authEvents + Math.floor(Math.random() * 3),
        securityAlerts: prev.securityAlerts + (Math.random() > 0.9 ? 1 : 0),
        lastUpdate: new Date(),
        systemHealth: Math.random() > 0.8 ? 'warning' : 'healthy'
      }));

      // Add random session events
      if (Math.random() > 0.7) {
        const eventTypes = ['user_login', 'permission_check', 'data_access', 'auth_refresh'];
        const newEvent = {
          id: crypto.randomUUID(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          timestamp: new Date(),
          userId: `user_${Math.floor(Math.random() * 1000)}`,
          status: Math.random() > 0.1 ? 'success' : 'error'
        };

        setSessionEvents(prev => [newEvent, ...prev.slice(0, 9)]);

        if (newEvent.status === 'error') {
          onAlert({
            id: crypto.randomUUID(),
            type: 'error',
            message: `${newEvent.type} failed for ${newEvent.userId}`,
            timestamp: newEvent.timestamp
          });
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, onAlert]);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (!isActive) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Monitoring</h3>
            <p className="text-gray-500">Start a debug session to begin real-time monitoring</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{monitoringData.activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auth Events</p>
                <p className="text-2xl font-bold">{monitoringData.authEvents}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Alerts</p>
                <p className="text-2xl font-bold">{monitoringData.securityAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <div className={`flex items-center gap-1 ${getHealthColor(monitoringData.systemHealth)}`}>
                  {getHealthIcon(monitoringData.systemHealth)}
                  <span className="text-sm font-medium capitalize">{monitoringData.systemHealth}</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Event Stream */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Event Stream
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="animate-pulse">
              Live
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sessionEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Waiting for events...</p>
            ) : (
              sessionEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <Badge variant={event.status === 'success' ? 'default' : 'destructive'}>
                      {event.status}
                    </Badge>
                    <span className="text-sm font-medium">{event.type}</span>
                    <span className="text-sm text-muted-foreground">{event.userId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Session Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">98.5%</p>
              <p className="text-sm text-muted-foreground">Auth Success Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">45ms</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-muted-foreground">Failed Logins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-muted-foreground">API Calls/min</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
