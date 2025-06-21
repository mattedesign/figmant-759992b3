
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepRenderer } from './StepRenderer';
import { WizardNavigation } from './components/WizardNavigation';
import { useWizardState } from './hooks/useWizardState';
import { StepData } from './types';
import { SelectedTemplateProvider } from '@/contexts/SelectedTemplateContext';
import { AnalysisPageHeader } from '../analysis/components/AnalysisPageHeader';

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

  // Create a proper setStepData function that matches the expected signature
  const handleSetStepData = (newData: StepData | ((prev: StepData) => StepData)) => {
    if (typeof newData === 'function') {
      setStepData(newData(stepData));
    } else {
      setStepData(newData);
    }
  };

  return (
    <SelectedTemplateProvider>
      <div className="h-full flex flex-col max-h-screen">
        <AnalysisPageHeader title="Premium Analysis Wizard" />
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-0 py-6 min-h-full">
              <div className="h-full">
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
        
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPreviousStep={handlePreviousStep}
          onNextStep={handleNextStep}
          canProceed={canProceedToNextStep()}
        />
      </div>
    </SelectedTemplateProvider>
  );
};
