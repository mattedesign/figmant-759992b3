
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StepData } from '../types';

const TOTAL_STEPS = 4; // Correct 4-step flow

export const useWizardState = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    selectedTemplate: undefined, // Add selectedTemplate
    projectName: 'Untitled Analysis',
    analysisGoals: '',
    contextualData: {},
    uploadedFiles: [],
    customPrompt: '',
    stakeholders: [],
    referenceLinks: [''],
    attachments: [], // Add attachments
    uploads: {
      images: [],
      urls: [],
      files: [],
      screenshots: []
    }
  });

  // Handle pre-selected template from Templates page
  useEffect(() => {
    if (location.state?.selectedTemplate) {
      const template = location.state.selectedTemplate;
      const startStep = location.state.startStep || 2; // Default to step 2 when coming from templates
      
      console.log('🎯 Template pre-selected from Templates page:', { 
        template: template.title, 
        startStep,
        state: location.state 
      });
      
      setStepData(prev => ({
        ...prev,
        selectedType: template.id,
        selectedTemplate: template, // Save full template object
        projectName: `${template.title} Analysis`,
        analysisGoals: template.description || `Analysis using ${template.title} template`,
        contextualData: {
          selectedTemplate: template,
          templateCategory: template.category,
          templateTitle: template.title
        }
      }));
      
      // Start at the specified step (usually step 2 for template pre-selection)
      setCurrentStep(startStep);
    }
    // Also handle legacy preSelectedTemplate flag for backward compatibility
    else if (location.state?.preSelectedTemplate && location.state?.selectedTemplate) {
      const template = location.state.selectedTemplate;
      
      console.log('🔄 Legacy template handling:', template.title);
      
      setStepData(prev => ({
        ...prev,
        selectedType: template.id,
        selectedTemplate: template, // Save full template object
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
    console.log('🔄 Wizard next step requested:', { currentStep, nextStep: currentStep + 1 });
    
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
    
    // CRITICAL: No navigation or component switching here
    // This should only update the step number
  };

  const handlePreviousStep = () => {
    console.log('🔄 Wizard previous step requested:', { currentStep, prevStep: currentStep - 1 });
    
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    
    // CRITICAL: No navigation or component switching here
    // This should only update the step number
  };

  const canProceedToNextStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Ensure both selectedType and selectedTemplate are present
        return !!stepData.selectedType && !!stepData.selectedTemplate;
      case 2:
        return true; // File upload (optional)
      case 3:
        return true; // Contextual fields (optional)
      case 4:
        // Must have template to start analysis
        return !!stepData.selectedTemplate;
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
