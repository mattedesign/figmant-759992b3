
import React, { useState } from 'react';
import { DesignBatchAnalysis, DesignUpload } from '@/types/design';
import { useDesignUploads } from '@/hooks/useDesignUploads';
import { useBatchModifications } from '@/hooks/useBatchModifications';
import { BatchModificationDialog } from './BatchModificationDialog';
import { ContinueAnalysisUploader } from './ContinueAnalysisUploader';
import { BatchAnalysisHeader } from './BatchAnalysisHeader';
import { BatchAnalysisOverview } from './BatchAnalysisOverview';
import { BatchAnalysisContent } from './BatchAnalysisContent';

interface EnhancedBatchAnalysisViewerProps {
  batchAnalysis: DesignBatchAnalysis;
  onBack: () => void;
}

export const EnhancedBatchAnalysisViewer = ({ batchAnalysis, onBack }: EnhancedBatchAnalysisViewerProps) => {
  const { data: allUploads = [] } = useDesignUploads();
  const { modificationHistory, createBatchModification, isCreatingModification } = useBatchModifications(batchAnalysis.batch_id);
  const [showModificationDialog, setShowModificationDialog] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DesignBatchAnalysis>(batchAnalysis);
  const [activeTab, setActiveTab] = useState('results');
  
  const batchUploads = allUploads.filter(upload => upload.batch_id === batchAnalysis.batch_id);

  const handleModification = async (modifications: {
    newFiles: File[];
    replacements: Record<string, File>;
    modificationSummary: string;
  }) => {
    try {
      // Create upload objects for new files and replacements
      const newUploads = [
        // New files
        ...modifications.newFiles.map(file => ({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          use_case: batchUploads[0]?.use_case || '',
          batch_name: `${batchUploads[0]?.batch_name || 'Batch'} - Modified`
        })),
        // Replacement files
        ...Object.entries(modifications.replacements).map(([originalUploadId, file]) => ({
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          use_case: batchUploads[0]?.use_case || '',
          batch_name: `${batchUploads[0]?.batch_name || 'Batch'} - Modified`,
          replaced_upload_id: originalUploadId
        }))
      ];

      await createBatchModification.mutateAsync({
        originalBatchId: batchAnalysis.batch_id,
        newUploads,
        replacementMap: Object.fromEntries(
          Object.entries(modifications.replacements).map(([oldId, file]) => [oldId, file.name])
        ),
        modificationSummary: modifications.modificationSummary
      });

      setShowModificationDialog(false);
    } catch (error) {
      console.error('Failed to create batch modification:', error);
    }
  };

  const handleContinueAnalysisStarted = () => {
    setActiveTab('continue');
  };

  return (
    <div className="space-y-6">
      <BatchAnalysisHeader
        batchAnalysis={batchAnalysis}
        modificationHistoryLength={modificationHistory.length}
        selectedVersion={selectedVersion}
        onBack={onBack}
        onModifyClick={() => setShowModificationDialog(true)}
      />

      <BatchAnalysisOverview
        selectedVersion={selectedVersion}
        batchUploadsLength={batchUploads.length}
        modificationHistoryLength={modificationHistory.length}
      />

      {/* Continue Analysis Section */}
      <ContinueAnalysisUploader 
        batchAnalysis={selectedVersion}
        onAnalysisStarted={handleContinueAnalysisStarted}
      />

      <BatchAnalysisContent
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedVersion={selectedVersion}
        batchUploads={batchUploads}
        modificationHistory={modificationHistory}
        onViewVersion={setSelectedVersion}
        onAnalysisStarted={handleContinueAnalysisStarted}
      />

      {/* Modification Dialog */}
      <BatchModificationDialog
        open={showModificationDialog}
        onOpenChange={setShowModificationDialog}
        originalUploads={batchUploads}
        onSubmit={handleModification}
        isLoading={isCreatingModification}
      />
    </div>
  );
};
