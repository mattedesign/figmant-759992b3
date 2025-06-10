
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsOverview } from '@/components/dashboard/AnalyticsOverview';
import { RealtimeMonitor } from '@/components/dashboard/RealtimeMonitor';
import { ClaudeInsights } from '@/components/dashboard/ClaudeInsights';
import { UserJourneyMap } from '@/components/dashboard/UserJourneyMap';
import { ReportGenerator } from '@/components/dashboard/ReportGenerator';
import { Settings } from '@/components/dashboard/Settings';
import { Navigation } from '@/components/layout/Navigation';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">UX Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            AI-powered insights into user experience and behavior patterns
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="journey">User Journey</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <AnalyticsOverview />
          </TabsContent>

          <TabsContent value="realtime" className="mt-6">
            <RealtimeMonitor />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <ClaudeInsights />
          </TabsContent>

          <TabsContent value="journey" className="mt-6">
            <UserJourneyMap />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportGenerator />
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
