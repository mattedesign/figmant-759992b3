
import React from 'react';
import { PremiumAnalysisWizard } from './premium-analysis/PremiumAnalysisWizard';

export const WizardPage: React.FC = () => {
  console.log('🧙 WIZARD ANALYSIS PAGE - Rendering full wizard analysis system');

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      {/* Main Content - Use the full PremiumAnalysisWizard */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PremiumAnalysisWizard />
      </div>
    </div>
  );
};
