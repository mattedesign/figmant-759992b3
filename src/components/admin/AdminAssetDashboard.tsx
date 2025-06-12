
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetManager } from './AssetManager';
import { LogoManager } from './LogoManager';

export const AdminAssetDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Asset Management</h1>
        <p className="text-muted-foreground">
          Manage logos, images, and other assets for your application
        </p>
      </div>

      <Tabs defaultValue="logos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logos">Logo Management</TabsTrigger>
          <TabsTrigger value="assets">All Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="logos">
          <LogoManager />
        </TabsContent>

        <TabsContent value="assets">
          <AssetManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
