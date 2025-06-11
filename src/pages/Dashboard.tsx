
import { Navigation } from '@/components/layout/Navigation';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentAnalyses } from '@/components/dashboard/RecentAnalyses';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { Settings } from '@/components/dashboard/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditStatus } from '@/components/dashboard/CreditStatus';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your UX analytics and design performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <QuickActions />
                <CreditStatus />
              </div>
              <RecentAnalyses />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
