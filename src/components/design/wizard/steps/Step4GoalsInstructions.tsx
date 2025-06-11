
import React from 'react';
import { WizardData } from '../types';
import { BatchInfoSection } from '../../uploader/BatchInfoSection';

interface Step4GoalsInstructionsProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step4GoalsInstructions: React.FC<Step4GoalsInstructionsProps> = ({
  data,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Set Goals & Instructions</h2>
        <p className="text-muted-foreground">
          Provide context and specific goals for your design analysis
        </p>
      </div>

      <BatchInfoSection
        batchName={data.batchName}
        setBatchName={(name) => onUpdate({ batchName: name })}
        analysisGoals={data.analysisGoals}
        setAnalysisGoals={(goals) => onUpdate({ analysisGoals: goals })}
      />
    </div>
  );
};
