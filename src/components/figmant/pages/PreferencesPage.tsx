
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Settings, 
  CreditCard,
  Key,
  Globe,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const PreferencesPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    analysisComplete: true,
    weeklyReports: true,
    newFeatures: false,
    securityAlerts: true
  });
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en');
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Preferences</h1>
          <p className="text-gray-600">
            Manage your account settings and customize your analysis experience
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Ronald" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Richards" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || "ronaldrichards@gmail.com"} />
                </div>
                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input id="company" placeholder="Your company name" />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </CardTitle>
                <CardDescription>
                  Manage your subscription and billing information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Professional Plan</p>
                    <p className="text-sm text-gray-600">300 credits per month</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Manage Billing</Button>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Settings */}
          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Default Analysis Settings</CardTitle>
                <CardDescription>
                  Configure default settings for your design analyses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="defaultAnalysisType">Default Analysis Type</Label>
                    <Select defaultValue="comprehensive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                        <SelectItem value="quick">Quick Review</SelectItem>
                        <SelectItem value="accessibility">Accessibility Focused</SelectItem>
                        <SelectItem value="conversion">Conversion Optimization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-save Analysis Results</Label>
                      <p className="text-sm text-gray-600">Automatically save analysis results to your library</p>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Include Competitive Analysis</Label>
                      <p className="text-sm text-gray-600">Compare your designs against industry standards</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Generate Export Reports</Label>
                      <p className="text-sm text-gray-600">Automatically create PDF reports for analyses</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Analysis Focus Areas</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'User Experience',
                      'Visual Design',
                      'Accessibility',
                      'Performance',
                      'Brand Consistency',
                      'Conversion Optimization'
                    ].map((area) => (
                      <div key={area} className="flex items-center justify-between">
                        <Label className="text-sm">{area}</Label>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analysis Complete</Label>
                      <p className="text-sm text-gray-600">Get notified when your analysis is ready</p>
                    </div>
                    <Switch 
                      checked={notifications.analysisComplete} 
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, analysisComplete: checked }))
                      } 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-gray-600">Receive weekly summary of your activity</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyReports} 
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                      } 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Features</Label>
                      <p className="text-sm text-gray-600">Be the first to know about new features</p>
                    </div>
                    <Switch 
                      checked={notifications.newFeatures} 
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, newFeatures: checked }))
                      } 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-gray-600">Important security and account notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.securityAlerts} 
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, securityAlerts: checked }))
                      } 
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Method</h4>
                  <div className="space-y-2">
                    <Label>
                      <input type="radio" name="delivery" value="email" className="mr-2" defaultChecked />
                      Email notifications
                    </Label>
                    <Label>
                      <input type="radio" name="delivery" value="browser" className="mr-2" />
                      Browser notifications only
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interface Preferences</CardTitle>
                <CardDescription>
                  Customize the look and feel of your workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                            theme === option.value 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <option.icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Layout</Label>
                      <p className="text-sm text-gray-600">Use a more compact interface layout</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Tooltips</Label>
                      <p className="text-sm text-gray-600">Display helpful tooltips throughout the interface</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Update Password</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Two-Factor Authentication
                  </h4>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm">
                      Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Privacy Settings</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Share Usage Analytics</Label>
                      <p className="text-sm text-gray-600">Help improve Figmant by sharing anonymous usage data</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-gray-600">Receive product updates and promotional emails</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
