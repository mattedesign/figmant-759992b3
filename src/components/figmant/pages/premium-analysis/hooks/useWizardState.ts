
import { useState } from 'react';
import { StepData } from '../types';

const TOTAL_STEPS = 5;

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    projectName: 'Untitled Analysis', // Set default project name
    analysisGoals: '', // Keep this field but don't require it since we removed the step
    contextualData: {},
    uploadedFiles: [],
    customPrompt: '',
    stakeholders: [],
    referenceLinks: []
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
        // For step 2 (Project Details), we no longer require static fields - just check if there are contextual fields to fill
        return true; // Always allow proceeding since contextual fields are optional or template-specific
      case 3:
        return stepData.uploadedFiles && stepData.uploadedFiles.length > 0;
      case 4:
        return true; // Custom prompt is optional
      case 5:
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
