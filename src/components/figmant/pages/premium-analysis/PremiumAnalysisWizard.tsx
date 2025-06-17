
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
    </div>
  );
};
