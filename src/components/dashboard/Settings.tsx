
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Key, Bell, Shield, Database, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Settings = () => {
  const [apiKeys, setApiKeys] = useState({
    claude: '',
    analytics: '',
    heatmap: ''
  });
  const [notifications, setNotifications] = useState({
    realTimeAlerts: true,
    weeklyReports: true,
    anomalyDetection: true,
    emailNotifications: false
  });
  const [dataRetention, setDataRetention] = useState('90');
  const [analysisFrequency, setAnalysisFrequency] = useState('daily');
  const { toast } = useToast();

  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="data">Data Settings</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <h3 className="text-lg font-medium">API Configuration</h3>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="claude-key">Claude AI API Key</Label>
                    <Input
                      id="claude-key"
                      type="password"
                      placeholder="sk-ant-..."
                      value={apiKeys.claude}
                      onChange={(e) => setApiKeys({...apiKeys, claude: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for AI-powered insights and recommendations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="analytics-key">Google Analytics API Key</Label>
                    <Input
                      id="analytics-key"
                      type="password"
                      placeholder="AIza..."
                      value={apiKeys.analytics}
                      onChange={(e) => setApiKeys({...apiKeys, analytics: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      Connect your Google Analytics data
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heatmap-key">Heatmap Service API Key</Label>
                    <Input
                      id="heatmap-key"
                      type="password"
                      placeholder="hm_..."
                      value={apiKeys.heatmap}
                      onChange={(e) => setApiKeys({...apiKeys, heatmap: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">
                      For heatmap and user session recordings
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Real-time Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified about significant changes immediately
                      </p>
                    </div>
                    <Switch
                      checked={notifications.realTimeAlerts}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, realTimeAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Reports</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive weekly UX analytics summaries
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, weeklyReports: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Anomaly Detection</Label>
                      <p className="text-xs text-muted-foreground">
                        Alert when AI detects unusual patterns
                      </p>
                    </div>
                    <Switch
                      checked={notifications.anomalyDetection}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, anomalyDetection: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">
                        Send notifications to your email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailNotifications: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Data Management</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Retention Period</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How long to keep user analytics data
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Data Export Format</Label>
                    <div className="flex space-x-2">
                      <Badge variant="outline">JSON</Badge>
                      <Badge variant="outline">CSV</Badge>
                      <Badge variant="outline">Excel</Badge>
                      <Badge variant="outline">PDF</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Privacy Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">Anonymize user data</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch defaultChecked />
                        <Label className="text-sm">GDPR compliance mode</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Analysis Configuration</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AI Analysis Frequency</Label>
                    <Select value={analysisFrequency} onValueChange={setAnalysisFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Analysis Prompts</Label>
                    <Textarea
                      placeholder="Enter custom prompts for Claude AI analysis..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Customize what Claude should focus on when analyzing your UX data
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Metrics Thresholds</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Bounce Rate Alert (%)</Label>
                        <Input type="number" placeholder="75" />
                      </div>
                      <div>
                        <Label className="text-xs">Conversion Drop (%)</Label>
                        <Input type="number" placeholder="20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
