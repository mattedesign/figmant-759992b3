
import React from 'react';
import { WizardData } from '../types';
import { AnalysisPreferencesSection } from '../../uploader/AnalysisPreferencesSection';

interface Step5ConfigureAnalysisProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step5ConfigureAnalysis: React.FC<Step5ConfigureAnalysisProps> = ({
  data,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Configure Analysis Settings</h2>
        <p className="text-muted-foreground">
          Customize how your analysis will be performed
        </p>
      </div>

      <AnalysisPreferencesSection
        analysisPreferences={data.analysisPreferences}
        setAnalysisPreferences={(prefs) => onUpdate({ analysisPreferences: prefs })}
      />
    </div>
  );
};
