
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignUploader } from './DesignUploader';
import { DesignList } from './DesignList';
import { AnalysisViewer } from './AnalysisViewer';
import { DesignUpload } from '@/types/design';

export const DesignAnalysisPage = () => {
  const [selectedUpload, setSelectedUpload] = useState<DesignUpload | null>(null);

  if (selectedUpload) {
    return (
      <AnalysisViewer
        upload={selectedUpload}
        onBack={() => setSelectedUpload(null)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Design Analysis</h1>
        <p className="text-muted-foreground">
          Upload your designs and get AI-powered insights to improve user experience and conversion rates
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Design</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <DesignUploader />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <DesignList onViewAnalysis={setSelectedUpload} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
