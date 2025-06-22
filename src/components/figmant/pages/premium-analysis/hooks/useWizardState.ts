
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StepData } from '../types';

const TOTAL_STEPS = 4; // Fixed to 4 steps for the proper flow

export const useWizardState = () => {
  const location = useLocation();
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

  // Handle pre-selected template from Templates page
  useEffect(() => {
    if (location.state?.selectedTemplate && location.state?.preSelectedTemplate) {
      const template = location.state.selectedTemplate;
      
      setStepData(prev => ({
        ...prev,
        selectedType: template.id,
        projectName: `${template.title} Analysis`,
        analysisGoals: template.description || `Analysis using ${template.title} template`,
        contextualData: {
          selectedTemplate: template,
          templateCategory: template.category,
          templateTitle: template.title
        }
      }));
      
      // Start at step 2 since template is pre-selected
      setCurrentStep(2);
    }
  }, [location.state]);

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
        return false; // Results step - no next step
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
