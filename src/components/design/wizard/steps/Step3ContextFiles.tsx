
import React from 'react';
import { WizardData } from '../types';
import { ContextFilesSection } from '../../uploader/ContextFilesSection';

interface Step3ContextFilesProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step3ContextFiles: React.FC<Step3ContextFilesProps> = ({
  data,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Add Context Files (Optional)</h2>
        <p className="text-muted-foreground">
          Upload additional files that provide context for your analysis
        </p>
      </div>

      <ContextFilesSection
        contextFiles={data.contextFiles}
        setContextFiles={(files) => onUpdate({ contextFiles: files })}
        isEnabled={data.analysisPreferences.context_integration}
      />
    </div>
  );
};
