import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepData } from './types';
import { StepRenderer } from './StepRenderer';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
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
        return true;
      // Optional step
      case 6:
        return true;
      // Optional step
      default:
        return false;
    }
  };
  return <div className="h-full flex flex-col">
      {/* Main content area that fills remaining space */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            <StepRenderer stepData={stepData} setStepData={setStepData} currentStep={currentStep} totalSteps={totalSteps} onNextStep={handleNextStep} onPreviousStep={handlePreviousStep} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Fixed navigation at bottom - only show for non-processing steps */}
      {currentStep < 7 && <div className="flex-shrink-0 p-6 bg-transparent">
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button onClick={handleNextStep} disabled={!canProceedToNextStep()} className="bg-gray-900 hover:bg-gray-800 text-white">
              {currentStep === 6 ? 'Start Analysis' : 'Continue'}
            </Button>
          </div>
        </div>}
    </div>;
};
