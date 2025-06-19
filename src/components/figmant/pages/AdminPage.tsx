
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { ClaudePromptManager } from '@/components/owner/claude/ClaudePromptManager';
import { UserManagement } from '@/components/owner/UserManagement';
import { AdminSettings } from '@/components/owner/AdminSettings';
import { ClaudeSettings } from '@/components/owner/ClaudeSettings';
import { SubscriptionPlansManager } from '@/components/owner/SubscriptionPlansManager';
import { AdminAssetDashboard } from '@/components/admin/AdminAssetDashboard';
import { RegistrationDebugPanel } from '@/components/debug/RegistrationDebugPanel';

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
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-shrink-0 max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage your application settings, users, and system configuration</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="claude">Claude AI</TabsTrigger>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-transparent">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="dashboard" className="space-y-6">
                <AdminSettings />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <UserManagement />
                <RegistrationDebugPanel />
              </TabsContent>

              <TabsContent value="prompts" className="space-y-6">
                <ClaudePromptManager />
              </TabsContent>

              <TabsContent value="claude" className="space-y-6">
                <ClaudeSettings />
              </TabsContent>

              <TabsContent value="plans" className="space-y-6">
                <SubscriptionPlansManager />
              </TabsContent>

              <TabsContent value="assets" className="space-y-6">
                <AdminAssetDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
