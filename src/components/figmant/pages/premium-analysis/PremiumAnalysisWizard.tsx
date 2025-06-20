
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepRenderer } from './StepRenderer';
import { WizardNavigation } from './components/WizardNavigation';
import { useWizardState } from './hooks/useWizardState';
import { StepData } from './types';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';

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
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Create a proper setStepData function that matches the expected signature
  const handleSetStepData = (newData: StepData | ((prev: StepData) => StepData)) => {
    if (typeof newData === 'function') {
      setStepData(newData(stepData));
    } else {
      setStepData(newData);
    }
  };

  const getContentPadding = () => {
    if (isMobile) {
      return "px-0 py-3 min-h-full";
    }
    if (isTablet) {
      return "px-0 py-4 min-h-full";
    }
    return "px-0 py-6 min-h-full";
  };

  return (
    <div className="h-full flex flex-col max-h-screen">
      <div className="flex-1 min-h-0 overflow-hidden">
        {isMobile ? (
          // Mobile: Direct scroll without ScrollArea for better performance
          <div className="h-full overflow-y-auto">
            <div className={getContentPadding()}>
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
          </div>
        ) : (
          // Desktop/Tablet: Use ScrollArea
          <ScrollArea className="h-full w-full">
            <div className={getContentPadding()}>
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
        )}
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
