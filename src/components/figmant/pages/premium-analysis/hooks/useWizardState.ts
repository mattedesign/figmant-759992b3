
import { useState, useCallback } from 'react';
import { useWizardAnalysisSave } from './useWizardAnalysisSave';
import { useToast } from '@/hooks/use-toast';

export interface WizardStepData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
  attachments?: any[];
  analysisResults?: any;
}

export const useWizardState = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<WizardStepData>({});
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
    // Add validation logic based on current step
    switch (currentStep) {
      case 1:
        return stepData.step1 && Object.keys(stepData.step1).length > 0;
      case 2:
        return stepData.step2 && Object.keys(stepData.step2).length > 0;
      case 3:
        return stepData.step3 && Object.keys(stepData.step3).length > 0;
      case 4:
        return stepData.step4 && Object.keys(stepData.step4).length > 0;
      case 5:
        return stepData.step5 && Object.keys(stepData.step5).length > 0;
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
