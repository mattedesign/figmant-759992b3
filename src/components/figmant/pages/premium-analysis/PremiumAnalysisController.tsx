
import React, { useState, useCallback } from 'react';
import { StepRenderer } from './StepRenderer';
import { StepData } from './types';

export const PremiumAnalysisController: React.FC = () => {
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
    uploadedFiles: [],
    customPrompt: ''
  });

  console.log('🔍 PremiumAnalysisController render:', {
    currentStep,
    stepData: {
      selectedType: stepData.selectedType,
      projectName: stepData.projectName,
      hasAnalysisGoals: !!stepData.analysisGoals,
      uploadedFilesCount: stepData.uploadedFiles?.length || 0
    }
  });

  const goToNextStep = useCallback(() => {
    console.log('🔍 Going to next step, current:', currentStep);
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      console.log('🔍 Next step:', nextStep);
      return nextStep;
    });
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    console.log('🔍 Going to previous step, current:', currentStep);
    setCurrentStep(prev => {
      const prevStep = Math.max(1, prev - 1);
      console.log('🔍 Previous step:', prevStep);
      return prevStep;
    });
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    console.log('🔍 Going to specific step:', step);
    setCurrentStep(step);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <StepRenderer
        currentStep={currentStep}
        totalSteps={7}
        stepData={stepData}
        setStepData={setStepData}
        onNextStep={goToNextStep}
        onPreviousStep={goToPreviousStep}
      />
    </div>
  );
};
