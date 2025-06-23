
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIEnhancementSettings } from '@/components/owner/ai-enhancement/AIEnhancementSettings';
import { Settings, Zap, Shield } from 'lucide-react';

export const OwnerSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-enhancement');

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className="px-6 pt-6 pb-3 bg-transparent flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Owner Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Advanced configuration and AI enhancement controls
            </p>
          </div>
          <Badge variant="secondary">Owner Only</Badge>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-enhancement" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Enhancement
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              System Settings
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 overflow-auto mt-6">
            <TabsContent value="ai-enhancement" className="h-full">
              <AIEnhancementSettings />
            </TabsContent>

            <TabsContent value="system" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>
                    General system settings and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">System settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Advanced configuration options for power users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Advanced settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
