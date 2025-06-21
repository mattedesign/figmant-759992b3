
// src/components/figmant/pages/AdminPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';

// Import real admin components
import { AdminAssetDashboard } from '@/components/admin/AdminAssetDashboard';
import { RegistrationDebugPanel } from '@/components/debug/RegistrationDebugPanel';
import { SpecificUserDebugPanel } from '@/components/debug/SpecificUserDebugPanel';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';
import { Settings } from '@/components/dashboard/Settings';
import { PromptsPage } from '@/components/design/PromptsPage';
import { SubscriptionPlansManager } from './admin/SubscriptionPlansManager';

interface AdminPageProps {
  initialTab?: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ initialTab }) => {
  const { isOwner, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Set initial tab based on the active section
  useEffect(() => {
    if (initialTab) {
      // Map old section names to new tab names
      const tabMap: Record<string, string> = {
        'users': 'users',
        'settings': 'settings',
        'claude': 'claude',
        'plans': 'plans',
        'products': 'plans',
        'assets': 'assets',
        'prompt-manager': 'prompts',
        'admin': 'dashboard'
      };
      setActiveTab(tabMap[initialTab] || 'dashboard');
    }
  }, [initialTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin panel. Owner access required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background">
      {/* Header */}
      <div className="flex-none px-6 py-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage users, settings, and system configuration
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="flex-none px-6 pt-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="prompts">Prompts</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="dashboard" className="m-0 h-full">
              <div className="p-6 space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Admin dashboard with integrated debugging and management tools.
                  </AlertDescription>
                </Alert>
                <RegistrationDebugPanel />
                <SpecificUserDebugPanel />
              </div>
            </TabsContent>

            <TabsContent value="users" className="m-0 h-full">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">User Management</h2>
                  <p className="text-muted-foreground mb-6">
                    Debug user accounts, profiles, and access permissions.
                  </p>
                </div>
                <UserDebugPanel />
                <SpecificUserDebugPanel />
              </div>
            </TabsContent>

            <TabsContent value="claude" className="m-0 h-full">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Claude Settings</h2>
                  <p className="text-muted-foreground">
                    Configure API keys, analysis preferences, and Claude AI integration settings.
                  </p>
                </div>
                <Settings />
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="m-0 h-full">
              <PromptsPage />
            </TabsContent>

            <TabsContent value="plans" className="m-0 h-full">
              <SubscriptionPlansManager />
            </TabsContent>

            <TabsContent value="assets" className="m-0 h-full">
              <AdminAssetDashboard />
            </TabsContent>

            <TabsContent value="settings" className="m-0 h-full">
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Admin Settings</h2>
                  <p className="text-muted-foreground">
                    Configure system-wide settings, API keys, and administrative preferences.
                  </p>
                </div>
                <Settings />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
