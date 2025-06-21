
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Activity, 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Eye,
  Settings,
  Monitor
} from 'lucide-react';
import { UserAccessAnalyzer } from './components/UserAccessAnalyzer';
import { SecurityScanner } from './components/SecurityScanner';
import { FlowDebugger } from './components/FlowDebugger';
import { BillingIntegration } from './components/BillingIntegration';
import { AlertSystem } from './components/AlertSystem';
import { RealtimeMonitor } from './components/RealtimeMonitor';
import { DebugSessionManager } from './services/DebugSessionManager';
import { useAuth } from '@/contexts/AuthContext';

export const DebugPlatformLayout: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('monitor');
  const [sessionCount, setSessionCount] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isDebugActive, setIsDebugActive] = useState(false);

  const maxFreeSessions = 10;
  const isPro = profile?.role === 'owner'; // Simulate pro subscription

  useEffect(() => {
    // Initialize debug session tracking
    const debugManager = new DebugSessionManager();
    debugManager.getSessionCount(user?.id || '').then(setSessionCount);
  }, [user]);

  const canStartDebugSession = isPro || sessionCount < maxFreeSessions;

  const handleStartDebugging = () => {
    if (canStartDebugSession) {
      setIsDebugActive(true);
      setSessionCount(prev => prev + 1);
    }
  };

  const handleStopDebugging = () => {
    setIsDebugActive(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">DebugLens</h1>
              <Badge variant="secondary">Debug-as-a-Service</Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Session Counter */}
            <div className="text-sm">
              <span className="text-muted-foreground">Sessions:</span>
              <span className="ml-1 font-medium">
                {sessionCount}/{isPro ? '∞' : maxFreeSessions}
              </span>
            </div>

            {/* Debug Control */}
            <Button
              onClick={isDebugActive ? handleStopDebugging : handleStartDebugging}
              variant={isDebugActive ? "destructive" : "default"}
              disabled={!canStartDebugSession && !isDebugActive}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              {isDebugActive ? 'Stop Debug' : 'Start Debug'}
            </Button>

            {/* Upgrade CTA */}
            {!isPro && sessionCount >= maxFreeSessions && (
              <Button variant="outline" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>

        {/* Usage Warning */}
        {!isPro && sessionCount >= maxFreeSessions * 0.8 && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You've used {sessionCount} of {maxFreeSessions} free debug sessions. 
              <Button variant="link" className="p-0 ml-1 h-auto">
                Upgrade to Pro for unlimited debugging
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-6">
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time Monitor
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Access
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Scanner
            </TabsTrigger>
            <TabsTrigger value="flows" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Flow Debugger
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts ({alerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <RealtimeMonitor 
              isActive={isDebugActive}
              onAlert={(alert) => setAlerts(prev => [...prev, alert])}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserAccessAnalyzer isDebugActive={isDebugActive} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityScanner 
              isActive={isDebugActive}
              onAlert={(alert) => setAlerts(prev => [...prev, alert])}
            />
          </TabsContent>

          <TabsContent value="flows" className="space-y-6">
            <FlowDebugger isActive={isDebugActive} />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingIntegration />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertSystem 
              alerts={alerts}
              onClearAlert={(id) => setAlerts(prev => prev.filter(a => a.id !== id))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
