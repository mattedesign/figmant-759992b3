
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { BatchAnalysisResults } from './BatchAnalysisResults';
import { BatchAnalysisDesigns } from './BatchAnalysisDesigns';
import { BatchAnalysisSettings } from './BatchAnalysisSettings';
import { BatchVersionHistory } from './BatchVersionHistory';
import { ContinueAnalysisUploader } from './ContinueAnalysisUploader';

interface BatchAnalysisContentProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  selectedVersion: DesignBatchAnalysis;
  batchUploads: DesignUpload[];
  modificationHistory: DesignBatchAnalysis[];
  onViewVersion: (version: DesignBatchAnalysis) => void;
  onAnalysisStarted: () => void;
}

export const BatchAnalysisContent = ({
  activeTab,
  onTabChange,
  selectedVersion,
  batchUploads,
  modificationHistory,
  onViewVersion,
  onAnalysisStarted
}: BatchAnalysisContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="results">Analysis Results</TabsTrigger>
        <TabsTrigger value="designs">Designs ({batchUploads.length})</TabsTrigger>
        <TabsTrigger value="history">
          Version History ({modificationHistory.length})
        </TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="continue">Continue Analysis</TabsTrigger>
      </TabsList>

      <TabsContent value="results" className="mt-6">
        <BatchAnalysisResults selectedVersion={selectedVersion} />
      </TabsContent>

      <TabsContent value="designs" className="mt-6">
        <BatchAnalysisDesigns batchUploads={batchUploads} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <BatchVersionHistory
          versions={modificationHistory}
          onViewVersion={onViewVersion}
          currentVersionId={selectedVersion.id}
        />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <BatchAnalysisSettings selectedVersion={selectedVersion} />
      </TabsContent>

      <TabsContent value="continue" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Continue Analysis</CardTitle>
            <CardDescription>
              Add more screenshots to extend your batch analysis with additional insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContinueAnalysisUploader 
              batchAnalysis={selectedVersion}
              onAnalysisStarted={onAnalysisStarted}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
