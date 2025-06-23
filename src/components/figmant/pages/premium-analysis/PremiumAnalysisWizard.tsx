
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepRenderer } from './StepRenderer';
import { WizardNavigation } from './components/WizardNavigation';
import { useWizardState } from './hooks/useWizardState';
import { StepData } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

export const PremiumAnalysisWizard: React.FC = () => {
  const isMobile = useIsMobile();
  
  const {
    currentStep,
    stepData,
    setStepData,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep
  } = useWizardState();

  console.log('🧙‍♂️ PremiumAnalysisWizard render - Current step:', currentStep, 'Selected type:', stepData.selectedType);

  // Create a proper setStepData function that matches the expected signature
  const handleSetStepData = (newData: StepData | ((prev: StepData) => StepData)) => {
    console.log('🔄 Wizard state update requested:', typeof newData === 'function' ? 'function' : newData);
    
    if (typeof newData === 'function') {
      setStepData(newData(stepData));
    } else {
      setStepData(newData);
    }
    
    // IMPORTANT: Do not navigate or change components here
    // This should only update the wizard's internal state
  };

  // CRITICAL: This component should ALWAYS render the same structure
  // No conditional rendering that switches to different components
  return (
    <div className={`flex flex-col h-full ${isMobile ? 'wizard-container' : 'h-full max-h-screen'}`}>
      {/* Fixed wizard header - always visible */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analysis Wizard</h1>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Main content area - always the same structure */}
      <div className={`flex-1 min-h-0 overflow-hidden ${isMobile ? 'wizard-content' : ''}`}>
        <ScrollArea className={`h-full w-full ${isMobile ? 'wizard-scroll-area' : ''}`}>
          <div className="px-6 py-6 min-h-full">
            <div className="h-full">
              {/* CRITICAL: StepRenderer should handle all step content */}
              {/* No conditional rendering here that switches components */}
              <StepRenderer 
                stepData={stepData} 
                setStepData={handleSetStepData} 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onNextStep={handleNextStep} 
                onPreviousStep={handlePreviousStep} 
              />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Fixed navigation footer - always visible */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200">
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          canProceed={canProceedToNextStep()}
        />
      </div>
    </div>
  );
};
