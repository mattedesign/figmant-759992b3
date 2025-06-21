
import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface WizardData {
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
  const [wizardData, setWizardData] = useState<WizardData>({
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
  const [historicalContext, setHistoricalContext] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load historical analysis context if provided
  useEffect(() => {
    if (location.state?.loadHistoricalAnalysis && location.state?.historicalData) {
      const historicalData = location.state.historicalData;
      setHistoricalContext(historicalData);
      
      // Pre-populate wizard with historical data if it's a design analysis
      if (historicalData.type === 'design') {
        setWizardData({
          analysisType: historicalData.analysisType,
          selectedType: historicalData.analysisType || '',
          projectName: `Continuation of: ${historicalData.title}`,
          analysisGoals: `Building upon previous analysis with score ${historicalData.score}/10`,
          desiredOutcome: '',
          improvementMetric: '',
          deadline: '',
          date: '',
          stakeholders: [],
          referenceLinks: [''],
          customPrompt: '',
          previousAnalysis: historicalData
        });
      }
    }
  }, [location.state]);

  const updateWizardData = useCallback((key: string, value: any) => {
    setWizardData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setWizardData({
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
    setHistoricalContext(null);
    setIsProcessing(false);
  }, []);

  const canProceedToNextStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return wizardData.selectedType !== '';
      case 2:
        return wizardData.projectName.trim() !== '';
      case 3:
        return wizardData.analysisGoals.trim() !== '';
      case 4:
        const hasAnyDynamicField = Object.keys(wizardData).some(key => {
          if (!['selectedType', 'projectName', 'analysisGoals', 'stakeholders', 'referenceLinks', 'uploadedFiles', 'customPrompt'].includes(key)) {
            const value = wizardData[key];
            return typeof value === 'string' && value.trim() !== '';
          }
          return false;
        });
        return hasAnyDynamicField || wizardData.desiredOutcome?.trim() !== '';
      case 5:
        return true; // File upload is optional
      case 6:
        return true; // Custom prompt is optional
      case 7:
        return !isProcessing; // Can proceed if not currently processing
      default:
        return false;
    }
  }, [currentStep, wizardData, isProcessing]);

  const handleNextStep = useCallback(() => {
    if (currentStep < 7 && canProceedToNextStep()) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, canProceedToNextStep]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const startProcessing = useCallback(() => {
    setIsProcessing(true);
  }, []);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    wizardData,
    setWizardData,
    updateWizardData,
    resetWizard,
    historicalContext,
    isProcessing,
    startProcessing,
    stopProcessing,
    canProceedToNextStep,
    handleNextStep,
    handlePreviousStep,
    totalSteps: 7
  };
};
