
import { useState } from 'react';
import { StepData } from '../types';

const TOTAL_STEPS = 4;

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    projectName: 'Untitled Analysis',
    analysisGoals: '',
    contextualData: {},
    uploadedFiles: [],
    customPrompt: '',
    stakeholders: [],
    referenceLinks: [''],
    uploads: {
      images: [],
      urls: [],
      files: [],
      screenshots: []
    }
  });

  const handleNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!stepData.selectedType;
      case 2:
        // Allow proceeding even if no uploads (uploads are optional)
        return true;
      case 3:
        // Require at least some contextual data or additional context
        return Object.keys(stepData.contextualData || {}).length > 0 || 
               !!stepData.analysisGoals?.trim();
      case 4:
        return false; // Processing step - no next
      default:
        return false;
    }
  };

  return {
    currentStep,
    stepData,
    setStepData,
    totalSteps: TOTAL_STEPS,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep
  };
};
