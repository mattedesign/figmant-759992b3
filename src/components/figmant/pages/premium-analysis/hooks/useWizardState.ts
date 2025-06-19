
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface StepData {
  selectedType: string;
  projectName: string;
  analysisGoals: string;
  desiredOutcome: string;
  improvementMetric: string;
  deadline: string;
  date: string;
  stakeholders: string[];
  referenceLinks: string[];
  customPrompt: string;
  uploadedFiles?: File[];
  [key: string]: any;
}

export const useWizardState = () => {
  const location = useLocation();
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const totalSteps = 7;

  // Load any existing context from route state
  useEffect(() => {
    if (location.state?.wizardData) {
      setStepData(prev => ({
        ...prev,
        ...location.state.wizardData
      }));
    }
  }, [location.state]);
  
  const handleNextStep = useCallback(() => {
    if (currentStep < totalSteps && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);
  
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  const canProceedToNextStep = useCallback(() => {
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
        return true; // File upload is optional
      case 6:
        return true; // Custom prompt is optional  
      case 7:
        return !isProcessing; // Can proceed once processing is complete
      default:
        return false;
    }
  }, [currentStep, stepData, isProcessing]);

  const updateStepData = useCallback((key: string, value: any) => {
    setStepData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setStepData({
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
    setIsProcessing(false);
    setAnalysisResults(null);
  }, []);

  const startAnalysis = useCallback(() => {
    setIsProcessing(true);
    setCurrentStep(7); // Move to processing step
  }, []);

  const completeAnalysis = useCallback((results: any) => {
    setIsProcessing(false);
    setAnalysisResults(results);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    stepData,
    setStepData: updateStepData,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep,
    isProcessing,
    analysisResults,
    startAnalysis,
    completeAnalysis,
    resetWizard
  };
};
