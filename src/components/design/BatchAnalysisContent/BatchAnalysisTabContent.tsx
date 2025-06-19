
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { BatchAnalysisResults } from '../BatchAnalysisResults';
import { BatchAnalysisDesigns } from '../BatchAnalysisDesigns';
import { BatchAnalysisSettings } from '../BatchAnalysisSettings';
import { BatchVersionHistory } from '../BatchVersionHistory';
import { ContinueAnalysisUploader } from '../ContinueAnalysisUploader';

interface BatchAnalysisTabContentProps {
  selectedVersion: DesignBatchAnalysis;
  batchUploads: DesignUpload[];
  modificationHistory: DesignBatchAnalysis[];
  onViewVersion: (version: DesignBatchAnalysis) => void;
  onAnalysisStarted: () => void;
}

export const BatchAnalysisTabContent: React.FC<BatchAnalysisTabContentProps> = ({
  selectedVersion,
  batchUploads,
  modificationHistory,
  onViewVersion,
  onAnalysisStarted
}) => {
  return (
    <>
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
    </>
  );
};
