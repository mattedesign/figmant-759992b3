
import { useState } from 'react';
import { StepData } from '../types';

export const useWizardState = () => {
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
        const hasAnyDynamicField = Object.keys(stepData).some(key => {
          if (!['selectedType', 'projectName', 'analysisGoals', 'stakeholders', 'referenceLinks', 'uploadedFiles', 'customPrompt'].includes(key)) {
            const value = stepData[key];
            return typeof value === 'string' && value.trim() !== '';
          }
          return false;
        });
        return hasAnyDynamicField || stepData.desiredOutcome?.trim() !== '';
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    stepData,
    setStepData,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep
  };
};
