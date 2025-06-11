
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigation } from '@/components/layout/Navigation';
import { OwnerAnalytics } from '@/components/owner/OwnerAnalytics';
import { UserManagement } from '@/components/owner/UserManagement';
import { AdminSettings } from '@/components/owner/AdminSettings';
import { ClaudeSettings } from '@/components/owner/ClaudeSettings';
import { SubscriptionPlansManager } from '@/components/owner/SubscriptionPlansManager';
import { AdvancedDesignAnalysisPage } from '@/components/design/AdvancedDesignAnalysisPage';
import { useSearchParams, useNavigate } from 'react-router-dom';

const OwnerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get the tab from URL parameters, default to 'analytics'
  const tabFromUrl = searchParams.get('tab') || 'analytics';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Update URL when tab changes
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Sync tab state with URL changes
  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'analytics';
    setActiveTab(currentTab);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Owner Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your UX Analytics platform and monitor business metrics
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="design">Design Analysis</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="plans">Plans & Products</TabsTrigger>
            <TabsTrigger value="claude">Claude AI</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <OwnerAnalytics />
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <AdvancedDesignAnalysisPage />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <SubscriptionPlansManager />
          </TabsContent>

          <TabsContent value="claude" className="mt-6">
            <ClaudeSettings />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OwnerDashboard;
