
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BatchAnalysisTabListProps {
  batchUploadsCount: number;
  modificationHistoryCount: number;
}

export const BatchAnalysisTabList: React.FC<BatchAnalysisTabListProps> = ({
  batchUploadsCount,
  modificationHistoryCount
}) => {
  return (
    <TabsList>
      <TabsTrigger value="results">Analysis Results</TabsTrigger>
      <TabsTrigger value="designs">Designs ({batchUploadsCount})</TabsTrigger>
      <TabsTrigger value="history">
        Version History ({modificationHistoryCount})
      </TabsTrigger>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="continue">Continue Analysis</TabsTrigger>
    </TabsList>
  );
};
