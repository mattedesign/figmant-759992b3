
import React from 'react';
import { DesignUpload, DesignAnalysis } from '@/types/design';
import { AnalysisListItem } from './AnalysisListItem';

interface IndividualAnalysesListProps {
  uploads: DesignUpload[];
  analyses: DesignAnalysis[];
  onViewAnalysis: (upload: DesignUpload) => void;
  getStatusColor: (status: string) => string;
}

export const IndividualAnalysesList: React.FC<IndividualAnalysesListProps> = ({
  uploads,
  analyses,
  onViewAnalysis,
  getStatusColor
}) => {
  return (
    <div className="space-y-3">
      {uploads.map((upload) => {
        const analysis = analyses.find(a => a.design_upload_id === upload.id);
        
        return (
          <AnalysisListItem
            key={upload.id}
            upload={upload}
            analysis={analysis}
            onViewAnalysis={onViewAnalysis}
            getStatusColor={getStatusColor}
          />
        );
      })}
    </div>
  );
};
