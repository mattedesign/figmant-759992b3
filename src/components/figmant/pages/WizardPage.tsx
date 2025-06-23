
import React from 'react';
import { PremiumAnalysisWizard } from './premium-analysis/PremiumAnalysisWizard';
import { useIsMobile } from '@/hooks/use-mobile';

export const WizardPage: React.FC = () => {
  const isMobile = useIsMobile();
  
  console.log('🧙 WIZARD PAGE - Always rendering PremiumAnalysisWizard', { isMobile });

  // CRITICAL: This component should ALWAYS render PremiumAnalysisWizard
  // No conditional rendering based on state, template selection, or any other factors
  return (
    <div className={`flex flex-col min-h-0 overflow-hidden ${
      isMobile ? 'h-full wizard-container' : 'h-full'
    }`}>
      {/* IMPORTANT: Always render the same component structure */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <PremiumAnalysisWizard />
      </div>
    </div>
  );
};
