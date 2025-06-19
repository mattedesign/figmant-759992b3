
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
  console.log('🎯 WizardNavigation render:', { currentStep, totalSteps, canProceed });

  // Don't show navigation if we're past the total steps
  if (currentStep > totalSteps) return null;

  const getButtonText = () => {
    if (currentStep === totalSteps) {
      return 'Start Analysis';
    }
    return 'Continue';
  };

  const handleNextClick = () => {
    console.log('🎯 Next button clicked - currentStep:', currentStep, 'canProceed:', canProceed);
    if (canProceed) {
      onNextStep();
    } else {
      console.log('🎯 Cannot proceed - button should be disabled');
    }
  };

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
          disabled={!canProceed} 
          className="bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};
