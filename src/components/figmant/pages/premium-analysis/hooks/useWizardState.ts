
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

  const totalSteps = 5;

  const handleNextStep = useCallback(async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
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
    switch (currentStep) {
      case 1:
        return stepData.selectedType && stepData.selectedType.length > 0;
      case 2:
        return stepData.projectName && stepData.projectName.trim().length > 0;
      case 3:
        return stepData.analysisGoals && stepData.analysisGoals.trim().length > 0;
      case 4:
        return stepData.desiredOutcome && stepData.desiredOutcome.trim().length > 0;
      case 5:
        return true; // Final step
      default:
        return true;
    }
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
