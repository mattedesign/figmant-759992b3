
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  return (
    <div className="h-full flex flex-col max-h-screen overflow-hidden">
      {/* Fixed height container with proper overflow handling */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6 min-h-full">
            <StepRenderer 
              stepData={stepData} 
              setStepData={setStepData} 
              currentStep={currentStep} 
              totalSteps={totalSteps} 
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
