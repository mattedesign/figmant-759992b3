import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface WizardData {
  // Step 1: Template Selection (existing)
  selectedType: string;
  
  // Step 2: Smart Upload (combines old steps 2-5)
  uploads: {
    images: File[];
    urls: string[];
    files: File[];
    screenshots: any[];
  };
  
  // Step 3: Contextual Fields (enhanced step 4)
  contextualData: Record<string, any>;
  additionalContext: string;
  
  // Step 4: Results (existing step 7)
  analysisResults?: any;
  
  // Keep existing fields for backward compatibility
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
    // Step 1: Template Selection
    selectedType: '',
    
    // Step 2: Smart Upload
    uploads: {
      images: [],
      urls: [],
      files: [],
      screenshots: []
    },
    
    // Step 3: Contextual Fields
    contextualData: {},
    additionalContext: '',
    
    // Step 4: Results
    analysisResults: undefined,
    
    // Backward compatibility fields
    projectName: '',
    analysisGoals: '',
    desiredOutcome: '',
    improvementMetric: '',
    deadline: '',
    date: '',
    stakeholders: [],
    referenceLinks: [''],
    customPrompt: '',
    uploadedFiles: []
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
        setWizardData(prev => ({
          ...prev,
          selectedType: historicalData.analysisType || '',
          projectName: `Continuation of: ${historicalData.title}`,
          analysisGoals: `Building upon previous analysis with score ${historicalData.score}/10`,
          additionalContext: `Previous analysis context: ${historicalData.title}`,
          previousAnalysis: historicalData
        }));
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
      // Step 1: Template Selection
      selectedType: '',
      
      // Step 2: Smart Upload
      uploads: {
        images: [],
        urls: [],
        files: [],
        screenshots: []
      },
      
      // Step 3: Contextual Fields
      contextualData: {},
      additionalContext: '',
      
      // Step 4: Results
      analysisResults: undefined,
      
      // Backward compatibility fields
      projectName: '',
      analysisGoals: '',
      desiredOutcome: '',
      improvementMetric: '',
      deadline: '',
      date: '',
      stakeholders: [],
      referenceLinks: [''],
      customPrompt: '',
      uploadedFiles: []
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
        return !isProcessing; // Step 4 is results - can proceed if not processing
      default:
        return false;
    }
  }, [currentStep, wizardData, isProcessing]);

  const handleNextStep = useCallback(() => {
    if (currentStep < 4 && canProceedToNextStep()) {
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
    totalSteps: 4
  };
};
