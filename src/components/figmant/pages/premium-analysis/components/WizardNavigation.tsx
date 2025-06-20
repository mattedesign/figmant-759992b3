
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
  canProceed: boolean;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onPreviousStep,
  onNextStep,
  canProceed
}) => {
  console.log('🎯 WizardNavigation render:', { 
    currentStep, 
    totalSteps, 
    canProceed,
    isOnFinalStep: currentStep === 4,
    isProcessingStep: currentStep === 5
  });

  // Don't show navigation if we're past the total steps OR on processing step
  if (currentStep > totalSteps || currentStep === 5) return null;

  const isOnFinalStep = currentStep === 4;
  const getButtonText = () => {
    if (isOnFinalStep) {
      return 'Start Wizard Analysis';
    }
    return 'Continue';
  };

  const handleNextClick = () => {
    console.log('🎯 Next button clicked:', {
      currentStep,
      canProceed,
      isOnFinalStep,
      buttonText: getButtonText()
    });
    
    if (canProceed) {
      console.log('🎯 Calling onNextStep...');
      onNextStep();
    } else {
      console.log('🎯 Cannot proceed - button should be disabled but was clicked');
    }
  };

  const isDisabled = !canProceed;
  console.log('🎯 Button state:', {
    isDisabled,
    canProceed,
    currentStep,
    isOnFinalStep,
    buttonText: getButtonText()
  });

  return (
    <div className="flex-shrink-0 p-6 bg-white border-t border-gray-200">
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPreviousStep} 
          disabled={currentStep === 1} 
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button 
          onClick={handleNextClick} 
          disabled={isDisabled}
          variant="default"
          className={`${
            isDisabled 
              ? 'opacity-50 cursor-not-allowed bg-gray-400' 
              : isOnFinalStep
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-900 hover:bg-gray-800'
          } text-white font-medium`}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
