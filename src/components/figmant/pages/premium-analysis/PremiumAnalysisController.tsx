
import React, { useState, useCallback } from 'react';
import { StepRenderer } from './StepRenderer';
import { StepData } from './types';
import { AnalysisNavigationHeader } from '../analysis/components/AnalysisNavigationHeader';

export const PremiumAnalysisController: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentCreditCost, setCurrentCreditCost] = useState<number>(1);
  const [stepData, setStepData] = useState<StepData>({
    selectedType: '',
    projectName: 'Untitled Analysis', // Set default project name
    analysisGoals: '', // Keep this field but it won't be collected via the form
    contextualData: {},
    stakeholders: [],
    referenceLinks: [''],
    uploadedFiles: [],
    customPrompt: ''
  });

  console.log('🔍 PremiumAnalysisController render:', {
    currentStep,
    currentCreditCost,
    stepData: {
      selectedType: stepData.selectedType,
      projectName: stepData.projectName,
      hasAnalysisGoals: !!stepData.analysisGoals,
      uploadedFilesCount: stepData.uploadedFiles?.length || 0
    }
  });

  const handleCreditCostChange = (creditCost: number) => {
    setCurrentCreditCost(creditCost);
  };

  const goToNextStep = useCallback(() => {
    console.log('🔍 Going to next step, current:', currentStep);
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      console.log('🔍 Next step:', nextStep);
      return nextStep;
    });
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    console.log('🔍 Going to previous step, current:', currentStep);
    setCurrentStep(prev => {
      const prevStep = Math.max(1, prev - 1);
      console.log('🔍 Previous step:', prevStep);
      return prevStep;
    });
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    console.log('🔍 Going to specific step:', step);
    setCurrentStep(step);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <AnalysisNavigationHeader creditCost={currentCreditCost} />
      <StepRenderer
        currentStep={currentStep}
        totalSteps={5}
        stepData={stepData}
        setStepData={setStepData}
        onNextStep={goToNextStep}
        onPreviousStep={goToPreviousStep}
        onCreditCostChange={handleCreditCostChange}
      />
    </div>
  );
};
