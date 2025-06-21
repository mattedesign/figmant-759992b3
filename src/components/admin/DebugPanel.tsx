
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, Database, User, Search } from 'lucide-react';
import { RegistrationDebugPanel } from '@/components/debug/RegistrationDebugPanel';
import { SpecificUserDebugPanel } from '@/components/debug/SpecificUserDebugPanel';
import { UserDebugPanel } from '@/components/debug/UserDebugPanel';

export const DebugPanel: React.FC = () => {
  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bug className="h-6 w-6" />
            Debug Panel
          </h1>
          <p className="text-muted-foreground">
            Advanced debugging tools for system diagnostics and troubleshooting
          </p>
        </div>
      </div>

      <Tabs defaultValue="registration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registration" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Registration Debug
          </TabsTrigger>
          <TabsTrigger value="user-search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            User Search
          </TabsTrigger>
          <TabsTrigger value="specific-user" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Specific User Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Registration System Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <RegistrationDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-search">
          <Card>
            <CardHeader>
              <CardTitle>User Debug Search</CardTitle>
            </CardHeader>
            <CardContent>
              <UserDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specific-user">
          <Card>
            <CardHeader>
              <CardTitle>Specific User Debug</CardTitle>
            </CardHeader>
            <CardContent>
              <SpecificUserDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
