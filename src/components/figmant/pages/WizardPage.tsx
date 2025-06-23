
import React from 'react';
import { PremiumAnalysisWizard } from './premium-analysis/PremiumAnalysisWizard';
import { useIsMobile } from '@/hooks/use-mobile';

export const WizardPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  console.log('🧙 WIZARD PAGE - Rendering PremiumAnalysisWizard for stepped workflow', { isMobile });

  return (
    <div className={`flex flex-col min-h-0 overflow-hidden ${
      isMobile ? 'h-full wizard-container' : 'h-full'
    }`}>
      <div className="flex-1 min-h-0 overflow-hidden">
        <PremiumAnalysisWizard />
      </div>
    </div>
  );
};
