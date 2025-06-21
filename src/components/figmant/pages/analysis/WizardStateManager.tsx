
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

  // Improved step validation logic
  const canProceedToNextStep = useCallback(() => {
    switch (currentStep) {
      case 1: // Analysis Type Selection
        return wizardData.selectedType !== '' && wizardData.selectedType.length > 0;
        
      case 2: // Project Information
        return wizardData.projectName.trim().length >= 3;
        
      case 3: // Analysis Goals
        return wizardData.analysisGoals.trim().length >= 10;
        
      case 4: // Additional Details
        // At least one field should be filled
        const hasDesiredOutcome = wizardData.desiredOutcome?.trim().length > 0;
        const hasImprovementMetric = wizardData.improvementMetric?.trim().length > 0;
        const hasDeadline = wizardData.deadline?.trim().length > 0;
        const hasStakeholders = wizardData.stakeholders?.length > 0;
        
        return hasDesiredOutcome || hasImprovementMetric || hasDeadline || hasStakeholders;
        
      case 5: // File Upload (Optional)
        return true; // Always allow proceeding from file upload
        
      case 6: // Custom Prompt (Optional)
        return true; // Always allow proceeding from custom prompt
        
      case 7: // Review & Submit
        return !isProcessing;
        
      default:
        return false;
    }
  }, [currentStep, wizardData, isProcessing]);

  // Add better data validation
  const validateWizardData = useCallback(() => {
    const errors: string[] = [];
    
    if (!wizardData.selectedType) {
      errors.push("Please select an analysis type");
    }
    
    if (wizardData.projectName.trim().length < 3) {
      errors.push("Project name must be at least 3 characters");
    }
    
    if (wizardData.analysisGoals.trim().length < 10) {
      errors.push("Analysis goals must be at least 10 characters");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [wizardData]);

  // Add state persistence
  useEffect(() => {
    // Save state to sessionStorage to persist during navigation
    const stateKey = 'figmant_wizard_state';
    sessionStorage.setItem(stateKey, JSON.stringify({
      currentStep,
      wizardData,
      timestamp: Date.now()
    }));
  }, [currentStep, wizardData]);

  // Restore state on component mount
  useEffect(() => {
    const stateKey = 'figmant_wizard_state';
    const savedState = sessionStorage.getItem(stateKey);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore if less than 1 hour old
        if (Date.now() - parsed.timestamp < 3600000) {
          setCurrentStep(parsed.currentStep);
          setWizardData(parsed.wizardData);
        }
      } catch (error) {
        console.warn('Failed to restore wizard state:', error);
      }
    }
  }, []);

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
    
    // Clear persisted state
    const stateKey = 'figmant_wizard_state';
    sessionStorage.removeItem(stateKey);
  }, []);

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
    validateWizardData,
    handleNextStep,
    handlePreviousStep,
    totalSteps: 7
  };
};
