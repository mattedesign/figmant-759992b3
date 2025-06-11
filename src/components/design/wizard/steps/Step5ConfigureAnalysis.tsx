
import React from 'react';
import { WizardData } from '../types';
import { AnalysisPreferencesSection } from '../../uploader/AnalysisPreferencesSection';
import { AnalysisPreferences } from '@/types/design';

interface Step5ConfigureAnalysisProps {
  data: WizardData;
  onUpdate: (updates: Partial<WizardData>) => void;
}

export const Step5ConfigureAnalysis: React.FC<Step5ConfigureAnalysisProps> = ({
  data,
  onUpdate
}) => {
  // Wrapper function to handle setState pattern conversion
  const handleAnalysisPreferencesChange = (prefs: AnalysisPreferences | ((prev: AnalysisPreferences) => AnalysisPreferences)) => {
    if (typeof prefs === 'function') {
      onUpdate({ analysisPreferences: prefs(data.analysisPreferences) });
    } else {
      onUpdate({ analysisPreferences: prefs });
    }
  };

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
        setAnalysisPreferences={handleAnalysisPreferencesChange}
      />
    </div>
  );
};
