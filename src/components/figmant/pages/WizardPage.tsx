
import React from 'react';
import { PremiumAnalysisWizard } from './premium-analysis/PremiumAnalysisWizard';
import { useIsMobile } from '@/hooks/use-mobile';

export const WizardPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  console.log('🧙 WIZARD ANALYSIS PAGE - Rendering full wizard analysis system', { isMobile });

  return (
    <div className={`flex flex-col min-h-0 overflow-hidden ${
      isMobile ? 'h-full wizard-container' : 'h-full'
    }`}>
      {/* Main Content - Use the full PremiumAnalysisWizard */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PremiumAnalysisWizard />
      </div>
    </div>
  );
};
