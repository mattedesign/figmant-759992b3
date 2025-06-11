
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save } from 'lucide-react';
import { useSettingsState } from '@/hooks/useSettingsState';
import { ApiKeysTab } from '@/components/dashboard/settings/ApiKeysTab';
import { NotificationsTab } from '@/components/dashboard/settings/NotificationsTab';
import { DataSettingsTab } from '@/components/dashboard/settings/DataSettingsTab';
import { AnalysisTab } from '@/components/dashboard/settings/AnalysisTab';
import { CreditsTab } from '@/components/dashboard/settings/CreditsTab';

export const Settings = () => {
  const {
    apiKeys,
    setApiKeys,
    notifications,
    setNotifications,
    dataRetention,
    setDataRetention,
    analysisFrequency,
    setAnalysisFrequency,
    saveSettings
  } = useSettingsState();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Settings</CardTitle>
          <CardDescription>
            Configure your UX analytics dashboard and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="api-keys" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="data">Data Settings</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys" className="space-y-4">
              <ApiKeysTab apiKeys={apiKeys} setApiKeys={setApiKeys} />
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <CreditsTab />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <NotificationsTab 
                notifications={notifications} 
                setNotifications={setNotifications} 
              />
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <DataSettingsTab 
                dataRetention={dataRetention} 
                setDataRetention={setDataRetention} 
              />
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <AnalysisTab 
                analysisFrequency={analysisFrequency} 
                setAnalysisFrequency={setAnalysisFrequency} 
              />
            </TabsContent>
          </Tabs>

          <div className="pt-6">
            <Button onClick={saveSettings} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
