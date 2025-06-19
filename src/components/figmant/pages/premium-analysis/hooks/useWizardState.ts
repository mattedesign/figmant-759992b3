
import { useState, useCallback } from 'react';
import { useWizardAnalysisSave } from './useWizardAnalysisSave';
import { useToast } from '@/hooks/use-toast';
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
    customPrompt: '',
    uploadedFiles: []
  });
  
  const { mutateAsync: saveWizardAnalysis } = useWizardAnalysisSave();
  const { toast } = useToast();

  const totalSteps = 6; // Updated to match the actual number of steps

  const handleNextStep = useCallback(async () => {
    console.log('🎯 handleNextStep called - currentStep:', currentStep, 'totalSteps:', totalSteps);
    
    if (currentStep < totalSteps) {
      console.log('🎯 Moving to next step:', currentStep + 1);
      setCurrentStep(prev => prev + 1);
    } else {
      console.log('🎯 Starting analysis - final step reached');
      // Save the completed wizard analysis
      try {
        await saveWizardAnalysis({
          stepData,
          analysisResults: stepData.analysisResults,
          confidenceScore: 0.85
        });

        toast({
          title: "Wizard Analysis Saved",
          description: "Your premium analysis has been saved and will appear in recent analyses.",
        });
      } catch (error) {
        console.error('Error saving wizard analysis:', error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save your wizard analysis.",
        });
      }
    }
  }, [currentStep, totalSteps, stepData, saveWizardAnalysis, toast]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const canProceedToNextStep = useCallback(() => {
    console.log('🎯 canProceedToNextStep - currentStep:', currentStep, 'stepData:', {
      selectedType: stepData.selectedType,
      projectName: stepData.projectName?.length,
      analysisGoals: stepData.analysisGoals?.length,
      desiredOutcome: stepData.desiredOutcome?.length
    });

    let canProceed = false;
    
    switch (currentStep) {
      case 1:
        canProceed = stepData.selectedType && stepData.selectedType.length > 0;
        break;
      case 2:
        canProceed = stepData.projectName && stepData.projectName.trim().length > 0;
        break;
      case 3:
        canProceed = stepData.analysisGoals && stepData.analysisGoals.trim().length > 0;
        break;
      case 4:
        canProceed = stepData.desiredOutcome && stepData.desiredOutcome.trim().length > 0;
        break;
      case 5:
        canProceed = true; // File upload step is optional, always allow proceed
        break;
      case 6:
        canProceed = true; // Custom prompt step is optional, always allow proceed
        break;
      default:
        canProceed = true;
    }
    
    console.log('🎯 canProceedToNextStep result for step', currentStep, ':', canProceed);
    return canProceed;
  }, [currentStep, stepData]);

  return {
    currentStep,
    stepData,
    setStepData,
    totalSteps,
    handleNextStep,
    handlePreviousStep,
    canProceedToNextStep
  };
};
