
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTabContent } from './tabs/OverviewTabContent';
import { DetailsTabContent } from './tabs/DetailsTabContent';
import { AttachmentsTabContent } from './tabs/AttachmentsTabContent';
import { HistoryTabContent } from './tabs/HistoryTabContent';
import { HistoryContextTabContent } from './tabs/HistoryContextTabContent';

interface UnifiedAnalysisResultsViewerProps {
  analysis: any;
  analysisType: string;
  attachments?: any[];
}

export const UnifiedAnalysisResultsViewer: React.FC<UnifiedAnalysisResultsViewerProps> = ({
  analysis,
  analysisType,
  attachments = []
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="attachments">Attachments & Links</TabsTrigger>
          <TabsTrigger value="history">Analysis History</TabsTrigger>
          <TabsTrigger value="context">History & Context</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <OverviewTabContent 
            analysis={analysis}
            analysisType={analysisType}
            attachments={attachments}
          />
        </TabsContent>
        
        <TabsContent value="details" className="mt-0">
          <DetailsTabContent 
            analysis={analysis}
            analysisType={analysisType}
          />
        </TabsContent>
        
        <TabsContent value="attachments" className="mt-0">
          <AttachmentsTabContent 
            analysis={analysis}
            attachments={attachments}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <HistoryTabContent 
            analysis={analysis}
            analysisType={analysisType}
          />
        </TabsContent>
        
        <TabsContent value="context" className="mt-0">
          <HistoryContextTabContent 
            analysis={analysis}
            analysisType={analysisType}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
