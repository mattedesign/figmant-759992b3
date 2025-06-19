
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { StepData, Stakeholder } from '../types';

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
    console.log('🎯 WIZARD STATE - handleNextStep called', { currentStep, totalSteps, canProceed: canProceedToNextStep() });
    
    if (currentStep < totalSteps && canProceedToNextStep()) {
      const nextStep = currentStep + 1;
      console.log('🎯 WIZARD STATE - Moving to step', nextStep);
      setCurrentStep(nextStep);
    } else {
      console.log('🎯 WIZARD STATE - Cannot proceed', { 
        currentStep, 
        totalSteps, 
        canProceed: canProceedToNextStep(),
        stepData 
      });
    }
  }, [currentStep, totalSteps, stepData]);
  
  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);
  
  const canProceedToNextStep = useCallback(() => {
    console.log('🎯 WIZARD STATE - canProceedToNextStep check', { currentStep, stepData: stepData.selectedType });
    
    switch (currentStep) {
      case 1:
        const canProceedStep1 = stepData.selectedType !== '';
        console.log('🎯 WIZARD STATE - Step 1 can proceed:', canProceedStep1, 'selectedType:', stepData.selectedType);
        return canProceedStep1;
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

  // Provide both interfaces - the new one for full updates and the old one for key-value updates
  const updateStepData = useCallback((newDataOrKey: StepData | string, value?: any) => {
    console.log('🎯 WIZARD STATE - updateStepData called', { newDataOrKey, value });
    
    if (typeof newDataOrKey === 'string') {
      // Old interface - key-value update
      setStepData(prev => {
        const updated = { ...prev, [newDataOrKey]: value };
        console.log('🎯 WIZARD STATE - Updated stepData (key-value):', updated);
        return updated;
      });
    } else {
      // New interface - full object update
      setStepData(newDataOrKey);
      console.log('🎯 WIZARD STATE - Updated stepData (full object):', newDataOrKey);
    }
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
