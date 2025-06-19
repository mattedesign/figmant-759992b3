
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { BatchAnalysisTabList } from './BatchAnalysisContent/BatchAnalysisTabList';
import { BatchAnalysisTabContent } from './BatchAnalysisContent/BatchAnalysisTabContent';

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
      <BatchAnalysisTabList 
        batchUploadsCount={batchUploads.length}
        modificationHistoryCount={modificationHistory.length}
      />

      <BatchAnalysisTabContent
        selectedVersion={selectedVersion}
        batchUploads={batchUploads}
        modificationHistory={modificationHistory}
        onViewVersion={onViewVersion}
        onAnalysisStarted={onAnalysisStarted}
      />
    </Tabs>
  );
};
