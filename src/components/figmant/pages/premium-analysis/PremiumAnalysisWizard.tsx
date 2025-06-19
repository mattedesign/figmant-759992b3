
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepRenderer } from './StepRenderer';
import { WizardNavigation } from './components/WizardNavigation';
import { useWizardState } from './hooks/useWizardState';

export const PremiumAnalysisWizard: React.FC = () => {
  const {
    currentStep,
    stepData,
    setStepData,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep
  } = useWizardState();

  return (
    <div className="h-full flex flex-col max-h-screen">
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-6 min-h-full">
            <div className="h-full">
              <StepRenderer 
                stepData={stepData} 
                setStepData={setStepData} 
                currentStep={currentStep} 
                totalSteps={totalSteps} 
                onNextStep={handleNextStep} 
                onPreviousStep={handlePreviousStep} 
              />
            </div>
          </div>
        </ScrollArea>
      </div>
      
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
        canProceed={canProceedToNextStep()}
      />
    </div>
  );
};
