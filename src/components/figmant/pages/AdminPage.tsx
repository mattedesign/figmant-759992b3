
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { EnhancedPromptTemplateManager } from '@/components/owner/claude/EnhancedPromptTemplateManager';
import { UserManagement } from '@/components/owner/UserManagement';
import { AdminSettings } from '@/components/owner/AdminSettings';
import { ClaudeSettings } from '@/components/owner/ClaudeSettings';
import { SubscriptionPlansManager } from '@/components/owner/SubscriptionPlansManager';
import { AdminAssetDashboard } from '@/components/admin/AdminAssetDashboard';
import { RegistrationDebugPanel } from '@/components/debug/RegistrationDebugPanel';
import { SpecificUserDebugPanel } from '@/components/debug/SpecificUserDebugPanel';

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
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto w-full p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage your application settings, users, and system configuration</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-100">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white">Dashboard</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-white">Users</TabsTrigger>
              <TabsTrigger value="prompts" className="data-[state=active]:bg-white">Prompts</TabsTrigger>
              <TabsTrigger value="claude" className="data-[state=active]:bg-white">Claude AI</TabsTrigger>
              <TabsTrigger value="plans" className="data-[state=active]:bg-white">Plans</TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-white">Assets</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="dashboard" className="space-y-6 mt-0">
              <AdminSettings />
            </TabsContent>

            <TabsContent value="users" className="space-y-6 mt-0">
              <UserManagement />
              <RegistrationDebugPanel />
              <SpecificUserDebugPanel />
            </TabsContent>

            <TabsContent value="prompts" className="space-y-6 mt-0">
              <EnhancedPromptTemplateManager />
            </TabsContent>

            <TabsContent value="claude" className="space-y-6 mt-0">
              <ClaudeSettings />
            </TabsContent>

            <TabsContent value="plans" className="space-y-6 mt-0">
              <SubscriptionPlansManager />
            </TabsContent>

            <TabsContent value="assets" className="space-y-6 mt-0">
              <AdminAssetDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
