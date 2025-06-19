
import React from 'react';
import { StepProps } from '../types';
import { StepHeader } from '../components/StepHeader';
import { FormField } from '../components/FormField';

export const Step3AnalysisGoals: React.FC<StepProps> = ({ 
  stepData, 
  setStepData, 
  currentStep, 
  totalSteps 
}) => {
  const handleAnalysisGoalsChange = (value: string) => {
    // Check if setStepData is the key-value version or full object version
    if (typeof setStepData === 'function') {
      const funcStr = setStepData.toString();
      if (funcStr.includes('key') || setStepData.length === 2) {
        (setStepData as (key: string, value: any) => void)('analysisGoals', value);
      } else {
        (setStepData as (newData: StepData) => void)({ ...stepData, analysisGoals: value });
      }
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Any specific feedback you would like?"
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <div className="max-w-2xl mx-auto">
        <FormField
          id="analysisGoals"
          type="textarea"
          label="Analysis Goals & Context"
          placeholder="e.g. Create a user-friendly mobile app to help people track their daily water intake"
          value={stepData.analysisGoals}
          onChange={handleAnalysisGoalsChange}
        />
      </div>
    </div>
  );
};
