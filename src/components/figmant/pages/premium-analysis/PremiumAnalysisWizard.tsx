
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft } from 'lucide-react';
import { StepData } from './types';
import { StepRenderer } from './StepRenderer';

export const PremiumAnalysisWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    projectName: '',
    analysisGoals: '',
    desiredOutcome: '',
    improvementMetric: '',
    deadline: '',
    date: '',
    stakeholders: [],
    referenceLinks: [''],
    customPrompt: ''
  });

  const totalSteps = 7;

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return stepData.selectedType !== '';
      case 2:
        return stepData.projectName.trim() !== '';
      case 3:
        return stepData.analysisGoals.trim() !== '';
      case 4:
        return stepData.desiredOutcome.trim() !== '';
      case 5:
        return true; // Optional step
      case 6:
        return true; // Optional step
      case 7:
        return false; // Processing step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <StepRenderer 
            stepData={stepData} 
            setStepData={setStepData} 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
          />
        </div>
      </ScrollArea>

      {/* Fixed Navigation Footer */}
      {currentStep < 7 && (
        <div className="flex-shrink-0 border-t bg-white p-6">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1} 
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button 
              onClick={handleNext} 
              disabled={!canProceedToNextStep()} 
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {currentStep === 6 ? 'Start Analysis' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
