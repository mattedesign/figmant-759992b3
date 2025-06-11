
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Upload } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  canProceed: boolean;
  isComplete: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  canProceed,
  isComplete,
  onNext,
  onPrev,
  onSubmit
}) => {
  if (isComplete) {
    return null;
  }

  const isLastStep = currentStep === 7;
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex justify-between items-center pt-6 mt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-sm text-muted-foreground">
        Step {currentStep} of 7
      </div>

      {isLastStep ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Start Analysis
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
